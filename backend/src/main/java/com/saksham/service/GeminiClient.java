package com.saksham.service;

import org.springframework.stereotype.Component;

import com.google.genai.Client;
import com.google.genai.types.GenerateContentResponse;

@Component
public class GeminiClient {

    private final Client client;

    public GeminiClient() {
        this.client = new Client();

        // client.models.list().forEach(model -> {
        // System.out.println("MODEL: " + model.getName());
        // });
    }

    public String generateResponse(String userMessage) {

        int retries = 3;

        for (int i = 0; i < retries; i++) {
            try {
                GenerateContentResponse response = client.models.generateContent(
                        "gemini-3-flash-preview",
                        "You are a supportive mental health assistant. Keep responses brief (2-3 sentences). Be warm but concise. Do not provide medical diagnosis. Suggest professional help when needed.\n\nUser: "
                                + userMessage,
                        null);

                String text = response.text();

                if (text != null && !text.trim().isEmpty()) {
                    return text;
                }

            } catch (Exception e) {

                System.out.println("Retry " + (i + 1));

                // Only retry for server errors
                if (i == retries - 1) {
                    return "I'm here with you. Please try again in a moment.";
                }

                try {
                    Thread.sleep(1000); // wait 1 sec
                } catch (InterruptedException ignored) {
                }
            }
        }

        return "I'm here with you.";
    }
}