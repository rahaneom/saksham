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
    private final OpenRouterClient aiClient;
    private final UserRepository userRepository;

    public ChatService(ChatMessageRepository repo,
                       OpenRouterClient aiClient,
                       UserRepository userRepository) {
        this.repo = repo;
        this.aiClient = aiClient;
        this.userRepository = userRepository;
    }

    // 🚨 Emergency keyword detection
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
            "give up"
        );

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

        if (message == null || message.trim().isEmpty()) {
            throw new RuntimeException("Message cannot be empty");
        }

        message = message.trim();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String botResponse;

        // 🚨 PRIORITY 1: Emergency handling (NO AI call)
        if (isEmergency(message)) {
            botResponse = emergencyResponse();
        }
        // 🤖 PRIORITY 2: AI response
        else {
            try {
                botResponse = aiClient.generateResponse(message);
            } catch (Exception e) {
                botResponse = "I'm here to listen. Please tell me more about what's on your mind.";
            }
        }

        ChatMessage chat = new ChatMessage();
        chat.setUser(user);
        chat.setUserMessage(message);
        chat.setBotResponse(botResponse);
        chat.setCreatedAt(LocalDateTime.now());

        repo.save(chat);

        return botResponse;
    }
}