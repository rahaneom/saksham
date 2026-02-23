package com.saksham.service;

import com.saksham.repository.SlotRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class SlotCleanupScheduler {

    private final SlotRepository slotRepository;

    // Runs daily at 1:00 AM
    // @Scheduled(cron = "0
    //  0 1 * * ?")
   @Transactional
    @Scheduled(fixedRate = 60000) // every 1 minute
    public void cleanupOldSlots() {
        slotRepository.deleteByIsAvailableTrueAndSlotDateBefore(
                LocalDate.now()
        );
    }
}