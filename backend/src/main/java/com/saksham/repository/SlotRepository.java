package com.saksham.repository;

import com.saksham.entity.Slot;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface SlotRepository extends JpaRepository<Slot, UUID> {

    List<Slot> findByIsAvailableTrueAndSlotDate(LocalDate slotDate);
    boolean existsBySlotDate(LocalDate slotDate);
}