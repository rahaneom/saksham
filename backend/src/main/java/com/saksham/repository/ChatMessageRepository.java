package com.saksham.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.saksham.entity.ChatMessage;
import com.saksham.entity.User;

public interface ChatMessageRepository 
        extends JpaRepository<ChatMessage, UUID> {

    void deleteByCreatedAtBefore(LocalDateTime cutoff);
    
    List<ChatMessage> findByUserAndCreatedAtAfterOrderByCreatedAtAsc(User user, LocalDateTime createdAt);
}