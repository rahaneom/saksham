package com.saksham.controller;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

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

        String email = authentication.getName();

        String response =
                chatService.handleChat(email, request.getMessage());

        return new ChatResponse(response);
    }

    @PreAuthorize("hasRole('STUDENT')")
    @GetMapping("/history")
    public List<ChatMessage> getChatHistory(Authentication authentication) {
        String email = authentication.getName();
        return chatService.getUserChatHistory(email);
    }
}