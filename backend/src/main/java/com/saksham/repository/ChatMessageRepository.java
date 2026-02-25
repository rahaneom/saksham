package com.saksham.repository;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.saksham.entity.ChatMessage;

public interface ChatMessageRepository 
        extends JpaRepository<ChatMessage, UUID> {

    void deleteByCreatedAtBefore(LocalDateTime cutoff);
}