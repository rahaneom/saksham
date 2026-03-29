package com.saksham.repository;

import com.saksham.entity.Appointment;
import com.saksham.entity.AppointmentStatus;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface AppointmentRepository extends JpaRepository<Appointment, UUID> {

    List<Appointment> findByStudent_Id(UUID studentId);

    boolean existsByStudent_IdAndSlot_SlotDateAndStatus(
            UUID studentId,
            LocalDate slotDate,
            AppointmentStatus status);

    List<Appointment> findByStatus(AppointmentStatus status);

    List<Appointment> findByStatusIn(List<AppointmentStatus> statuses);

    boolean existsBySlot_SlotDateAndSlot_StartTime(LocalDate slotDate, LocalTime startTime);

    boolean existsBySlot_Id(UUID slotId);

    Page<Appointment> findByStatusIn(
            List<AppointmentStatus> statuses,
            Pageable pageable);
}