package com.saksham.controller;

import org.springframework.web.bind.annotation.RestController;

import com.saksham.service.ResourceService;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.saksham.dto.ResourceRequest;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import com.saksham.entity.Resource;
import java.util.List;
import java.util.UUID;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.beans.factory.annotation.Value;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;


@RestController
@RequestMapping("/api/resources")
@RequiredArgsConstructor
public class ResourceController {
    private final ResourceService resourceService;

    @Value("${supabase.url:}")
    private String supabaseUrl;

    @Value("${supabase.service-role-key:}")
    private String supabaseServiceRoleKey;

    @PostMapping
    public String addResource(@RequestBody ResourceRequest request) {
        return resourceService.addResource(request);
    }

    @GetMapping
    public List<Resource> getResource() {
        return resourceService.getAllResources();
    }

    @DeleteMapping("/{id}")
    public String deleteResource(@PathVariable UUID id) {
        return resourceService.deleteResource(id);
    }
    
    @PostMapping("/upload")
    public Map<String, String> upload(@RequestParam("file") MultipartFile file,
                                      @RequestParam(value = "type", defaultValue = "pdf") String type) throws IOException {
        // debug authentication
        var auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        System.out.println("/upload called by auth=" + auth + ", name=" + (auth!=null?auth.getName():"null") + ", authorities=" + (auth!=null?auth.getAuthorities():"none"));

        if (file == null || file.isEmpty()) {
            throw new RuntimeException("File is required");
        }

        String original = file.getOriginalFilename();
        String ext = "";
        if (original != null && original.contains(".")) ext = original.substring(original.lastIndexOf('.'));
        String fileName = System.currentTimeMillis() + "-" + java.util.UUID.randomUUID().toString().substring(0, 8) + ext;
        String path = type.toLowerCase() + "/" + fileName;

        if (supabaseUrl == null || supabaseUrl.isBlank() || supabaseServiceRoleKey == null || supabaseServiceRoleKey.isBlank()) {
            throw new RuntimeException("Supabase not configured on server. Please set supabase.url and supabase.service-role-key in application.properties or environment.");
        }

        String uploadUrl = supabaseUrl + "/storage/v1/object/resources/" + path;
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + supabaseServiceRoleKey);
        headers.setContentType(MediaType.parseMediaType(file.getContentType() == null ? "application/octet-stream" : file.getContentType()));

        HttpEntity<byte[]> entity = new HttpEntity<>(file.getBytes(), headers);
        RestTemplate rest = new RestTemplate();
        ResponseEntity<String> resp = rest.exchange(uploadUrl, HttpMethod.PUT, entity, String.class);
        if (!resp.getStatusCode().is2xxSuccessful()) {
            throw new RuntimeException("Upload failed: " + resp.getStatusCode() + " - " + resp.getBody());
        }

        String publicUrl = supabaseUrl + "/storage/v1/object/public/resources/" + path;
        Map<String, String> result = new HashMap<>();
        result.put("publicUrl", publicUrl);
        result.put("path", path);
        return result;
    }
    
}
