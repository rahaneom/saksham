package com.saksham.service;

import com.saksham.entity.Slot;
import com.saksham.repository.SlotRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;

@Service
@RequiredArgsConstructor
public class SlotScheduler {

    private final SlotRepository slotRepository;

    // 🔥 Runs ONCE when application starts (DEV support)
    @PostConstruct
    public void init() {
        generateTomorrowSlots();
    }

    // ⏰ Runs every day at 12:01 AM
    @Scheduled(cron = "0 1 0 * * ?")
    public void generateTomorrowSlots() {

        LocalDate tomorrow = LocalDate.now().plusDays(1);

        // Prevent duplicate generation
        int expectedSlots = 10;
        int existingSlots = slotRepository.countBySlotDate(tomorrow);

        if (existingSlots >= expectedSlots) {
            return;
        }

        LocalTime start = LocalTime.of(10, 0);
        LocalTime end = LocalTime.of(15, 0);

        while (start.isBefore(end)) {
            Slot slot = Slot.builder()
                    .slotDate(tomorrow)
                    .startTime(start)
                    .endTime(start.plusMinutes(30))
                    .isAvailable(true)
                    .build();

            slotRepository.save(slot);
            start = start.plusMinutes(30);
        }
    }
}