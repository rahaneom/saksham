package com.saksham.repository;

import com.saksham.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface AppointmentRepository extends JpaRepository<Appointment, UUID> {

    List<Appointment> findByStudent_Id(UUID studentId);
    boolean existsByStudent_IdAndSlot_SlotDateAndStatus(
        UUID studentId,
        LocalDate slotDate,
        String status
);
}