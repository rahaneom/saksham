package com.saksham.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.saksham.entity.ChatMessage;
import com.saksham.entity.User;
import com.saksham.repository.ChatMessageRepository;
import com.saksham.repository.UserRepository;

@Service
public class ChatService {

    private final ChatMessageRepository repo;
    private final GeminiClient aiClient;
    private final UserRepository userRepository;

    public ChatService(ChatMessageRepository repo,
            GeminiClient aiClient,
            UserRepository userRepository) {
        this.repo = repo;
        this.aiClient = aiClient;
        this.userRepository = userRepository;
    }

    // Emergency keyword detection
    private boolean isEmergency(String message) {
        String msg = message.toLowerCase();

        List<String> emergencyKeywords = List.of(
                "suicide",
                "kill myself",
                "end my life",
                "want to die",
                "no reason to live",
                "self harm",
                "hurt myself",
                "cut myself",
                "can't go on",
                "give up");

        return emergencyKeywords.stream().anyMatch(msg::contains);
    }

    // 🚨 Emergency fallback response
    private String emergencyResponse() {
        return """
                I'm really sorry that you're feeling this way.
                You're not alone, and help is available.

                If you are in immediate danger, please contact your local emergency number right now.

                📞 India:
                AASRA: 91-9820466726 (24x7)
                Kiran (Govt. of India): 1800-599-0019

                If possible, consider reaching out to a trusted friend, family member,
                or a mental health professional.

                I'm here with you. You can tell me more if you'd like.
                """;
    }

    public String handleChat(String email, String message) {

        if (message == null || message.isBlank()) {
            throw new IllegalArgumentException("Message cannot be empty");
        }

        final String sanitizedInput = message.trim();

        final User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalStateException("Authenticated user not found"));

        final String botResponse;

        if (isEmergency(sanitizedInput)) {
            botResponse = emergencyResponse();
        } else {
            try {
                System.out.println("INPUT: " + sanitizedInput);

                // Contextual window extraction (sliding window mechanism)
                final List<ChatMessage> historicalContext = repo.findByUserAndCreatedAtAfterOrderByCreatedAtAsc(
                        user,
                        LocalDateTime.now().minusDays(1));

                // Adaptive truncation (limit conversational memory footprint)
                final int windowStartIndex = Math.max(historicalContext.size() - 3, 0);

                final List<ChatMessage> contextualWindow = historicalContext.subList(windowStartIndex,
                        historicalContext.size());

                // Context serialization (linearized dialogue reconstruction)
                final StringBuilder contextualPrompt = new StringBuilder();

                contextualWindow.forEach(chat -> {
                    contextualPrompt
                            .append("User: ")
                            .append(chat.getUserMessage())
                            .append("\n")
                            .append("Assistant: ")
                            .append(chat.getBotResponse())
                            .append("\n");
                });

                // Append current utterance
                contextualPrompt
                        .append("User: ")
                        .append(sanitizedInput);

                // LLM invocation with enriched conversational state
                botResponse = aiClient.generateResponse(contextualPrompt.toString());

                System.out.println("GEMINI RESPONSE: " + botResponse);

            } catch (Exception ex) {
                ex.printStackTrace();

                // Graceful degradation strategy
                return "I'm here with you. Something went wrong, but you can try again.";
            }
        }

        // Persistent conversation logging (event sourcing style)
        final ChatMessage chat = new ChatMessage();
        chat.setUser(user);
        chat.setUserMessage(sanitizedInput);
        chat.setBotResponse(botResponse);
        chat.setCreatedAt(LocalDateTime.now());

        repo.save(chat);

        return botResponse;
    }

    public List<ChatMessage> getUserChatHistory(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        LocalDateTime sevenDaysAgo = LocalDateTime.now().minusDays(7);
        // Assuming ChatMessageRepository has a method to find by user and date range
        // If not, will need to add it
        return repo.findByUserAndCreatedAtAfterOrderByCreatedAtAsc(user, sevenDaysAgo);
    }
}