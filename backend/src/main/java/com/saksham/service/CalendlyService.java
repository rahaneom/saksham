package com.saksham.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class CalendlyService {

    @Value("${calendly.token}")
    private String token;

    private final RestTemplate restTemplate = new RestTemplate();

    // Get current user URI
    public String getUserUri() {

        String url = "https://api.calendly.com/users/me";

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);

        HttpEntity<Void> request = new HttpEntity<>(headers);

        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                request,
                new ParameterizedTypeReference<>() {
                });

        Map<String, Object> body = response.getBody();

        if (body == null || !body.containsKey("resource")) {
            throw new RuntimeException("Invalid response from Calendly (user)");
        }

        Map<?, ?> resource = (Map<?, ?>) body.get("resource");

        return (String) resource.get("uri");
    }

    // Get scheduled events
    public List<Map<String, Object>> getScheduledEvents() {

        String userUri = getUserUri();

        String url = "https://api.calendly.com/scheduled_events?user=" + userUri;

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);

        HttpEntity<Void> request = new HttpEntity<>(headers);

        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                request,
                new ParameterizedTypeReference<>() {
                });

        Map<String, Object> body = response.getBody();

        if (body == null || !body.containsKey("collection")) {
            throw new RuntimeException("Invalid response from Calendly (events)");
        }

        Object collectionObj = body.get("collection");

        if (collectionObj instanceof List<?>) {
            return ((List<?>) collectionObj)
                    .stream()
                    .filter(item -> item instanceof Map)
                    .map(item -> (Map<String, Object>) item)
                    .toList();
        }

        return List.of();
    }
}