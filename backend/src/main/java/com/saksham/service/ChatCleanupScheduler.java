package com.saksham.service;

import java.time.LocalDateTime;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.saksham.repository.ChatMessageRepository;

@Component
public class ChatCleanupScheduler {

    private final ChatMessageRepository repo;

    public ChatCleanupScheduler(ChatMessageRepository repo) {
        this.repo = repo;
    }

    @Scheduled(cron = "0 0 2 * * ?")
    public void cleanupOldChats() {
        repo.deleteByCreatedAtBefore(
                LocalDateTime.now().minusDays(7));
    }
}