package com.saksham.service;

import java.time.LocalDateTime;

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

    public String handleChat(String email, String message) {

    if (message == null || message.trim().isEmpty()) {
        throw new RuntimeException("Message cannot be empty");
    }

    message = message.trim();

    User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));

    String aiResponse;

    try {
        aiResponse = aiClient.generateResponse(message);
    } catch (Exception e) {
        aiResponse = "I'm here to listen. Please try again in a moment.";
    }

    ChatMessage chat = new ChatMessage();
    chat.setUser(user);
    chat.setUserMessage(message);
    chat.setBotResponse(aiResponse);
    chat.setCreatedAt(LocalDateTime.now());

    repo.save(chat);

    return aiResponse;
    }
}