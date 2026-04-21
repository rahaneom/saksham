package com.saksham.controller;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.saksham.dto.ChatRequest;
import com.saksham.dto.ChatResponse;
import com.saksham.entity.ChatMessage;
import com.saksham.service.ChatService;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @PreAuthorize("hasRole('STUDENT')")
    @PostMapping("/send")
    public ChatResponse sendMessage(
            @RequestBody ChatRequest request,
            Authentication authentication) {
        System.out.println("🔥 CONTROLLER HIT 🔥");

        String email = authentication.getName();

        String response = chatService.handleChat(email, request.getMessage());

        return new ChatResponse(response);
    }

    @PreAuthorize("hasRole('STUDENT')")
    @GetMapping("/history")
    public List<ChatMessage> getChatHistory(Authentication authentication) {
        String email = authentication.getName();
        return chatService.getUserChatHistory(email);
    }
}