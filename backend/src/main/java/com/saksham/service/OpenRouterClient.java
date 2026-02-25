package com.saksham.service;

import java.util.*;

import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import com.saksham.config.OpenRouterProperties;

@Component
public class OpenRouterClient {

    private final String apiKey;
    private final String apiUrl;
    private final String model;
    private final RestTemplate restTemplate = new RestTemplate();

    public OpenRouterClient(OpenRouterProperties openRouterProperties) {
        this.apiKey = openRouterProperties.getApi().getKey();
        this.apiUrl = openRouterProperties.getApi().getUrl();
        this.model = openRouterProperties.getApi().getModel();

        System.out.println("OPENROUTER CONFIG:");
    System.out.println("KEY: " + (apiKey == null ? "NULL" : "LOADED"));
    System.out.println("URL: " + apiUrl);
    System.out.println("MODEL: " + model);
    }

    public String generateResponse(String userMessage) {

    List<String> models = List.of(
        "google/gemma-3-27b-it:free",
    "qwen/qwen3-next-80b-a3b-instruct:free"
    );

    for (String currentModel : models) {
        try {

            Map<String, Object> payload = new HashMap<>();
            payload.put("model", currentModel);
            payload.put("max_tokens", 300);
            payload.put("temperature", 0.7);
            payload.put("messages", List.of(
                Map.of("role", "system", "content",
                    "You are a calm, supportive mental health assistant. Do not provide medical diagnosis. Encourage professional help if needed."),
                Map.of("role", "user", "content", userMessage)
            ));

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(apiKey);
            headers.set("HTTP-Referer", "http://localhost:8080");
            headers.set("X-Title", "Saksham Mental Health App");

            HttpEntity<Map<String, Object>> entity =
                    new HttpEntity<>(payload, headers);

            ResponseEntity<Map<String, Object>> response =
                    restTemplate.exchange(apiUrl, HttpMethod.POST, entity,
                            new ParameterizedTypeReference<>() {});

            @SuppressWarnings("unchecked")
            List<Map<String, Object>> choices =
                    (List<Map<String, Object>>) response.getBody().get("choices");

            Map<String, Object> first = choices.get(0);
            @SuppressWarnings("unchecked")
            Map<String, Object> message =
                    (Map<String, Object>) first.get("message");

            System.out.println("Model used: " + currentModel);
            return message.get("content").toString();

        } catch (HttpClientErrorException.TooManyRequests e) {
            System.out.println("Model rate-limited: " + currentModel);
            continue;
        } catch (Exception e) {
            System.out.println("Model failed: " + currentModel);
            continue;
        }
    }

    return "I'm here to listen. Please try again shortly.";
}
}