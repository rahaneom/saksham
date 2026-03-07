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
        // Sliding window: delete only messages from exactly 7 days ago (24-hour window)
        // On day 8, deletes day 1; on day 9, deletes day 2; and so on
        LocalDateTime endOfWindow = LocalDateTime.now().minusDays(7);
        LocalDateTime startOfWindow = endOfWindow.minusDays(1);
        repo.deleteByCreatedAtBetween(startOfWindow, endOfWindow);
    }
}