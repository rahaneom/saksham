package com.saksham.repository;

import com.saksham.entity.Slot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;

import jakarta.persistence.LockModeType;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface SlotRepository extends JpaRepository<Slot, UUID> {

    // 🔒 Concurrency-safe slot fetch (used during booking)
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    Optional<Slot> findById(UUID id);

    // Existing queries (unchanged)
    List<Slot> findByIsAvailableTrueAndSlotDate(LocalDate slotDate);

    boolean existsBySlotDate(LocalDate slotDate);

    void deleteByIsAvailableTrueAndSlotDateBefore(LocalDate date);

    List<Slot> findBySlotDate(LocalDate slotDate);
}