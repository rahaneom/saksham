package com.saksham.repository;

import com.saksham.entity.Slot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import jakarta.persistence.LockModeType;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface SlotRepository extends JpaRepository<Slot, UUID> {

    // 🔒 Concurrency-safe slot fetch (used during booking - with exclusive lock)
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT s FROM Slot s WHERE s.id = :id")
    Optional<Slot> findByIdForUpdate(@Param("id") UUID id);

    // Existing queries (unchanged)
    List<Slot> findByIsAvailableTrueAndSlotDate(LocalDate slotDate);

    boolean existsBySlotDate(LocalDate slotDate);

    // void deleteByIsAvailableTrueAndSlotDateBefore(LocalDate date);
    @Query("""
        DELETE FROM Slot s
        WHERE s.isAvailable = true
        AND s.slotDate < :date
        AND s.id NOT IN (
            SELECT a.slot.id FROM Appointment a
        )
    """)
    @Modifying
    void deleteUnusedOldSlots(@Param("date") LocalDate date);

    List<Slot> findBySlotDate(LocalDate slotDate);

    int countBySlotDate(LocalDate slotDate);
}