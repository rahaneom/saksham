package com.saksham.service;

import com.saksham.dto.BookingResponse;
import com.saksham.dto.CounsellorAppointmentResponse;
import com.saksham.dto.SlotDisplayResponse;
import com.saksham.dto.SlotResponse;
import com.saksham.dto.StudentAppointmentResponse;
import com.saksham.entity.*;
import com.saksham.repository.*;
// import jakarta.transaction.Transactional;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.UUID;
import java.util.Map;


@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final SlotRepository slotRepository;
    private final UserRepository userRepository;

    // 🔵 Book Appointment (TOMORROW ONLY + ONE PER DAY)
    @Transactional
    public Appointment bookAppointment(UUID studentId, UUID slotId) {

        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        // 🔐 ROLE CHECK
        if (student.getRole() != Role.ROLE_STUDENT) {
            throw new RuntimeException("Only students can book appointments");
        }

        Slot slot = slotRepository.findByIdForUpdate(slotId)
                .orElseThrow(() -> new RuntimeException("Slot not found"));

        // if (!slot.getSlotDate().equals(LocalDate.now().plusDays(1))) {
        //     throw new RuntimeException("Booking allowed only for tomorrow");
        // }
        LocalDateTime slotStartDateTime =
        LocalDateTime.of(slot.getSlotDate(), slot.getStartTime());

        LocalDateTime bookingCutoff =
                slotStartDateTime.minusHours(1);

        if (LocalDateTime.now().isAfter(bookingCutoff)) {
            throw new RuntimeException(
                "Booking not allowed within 1 hour of slot start time"
            );
        }

        boolean alreadyBooked = appointmentRepository
                .existsByStudent_IdAndSlot_SlotDateAndStatus(
                        studentId,
                        slot.getSlotDate(),
                        AppointmentStatus.BOOKED
                );

        if (alreadyBooked) {
            throw new RuntimeException("You already have an appointment for this day");
        }

        if (!slot.isAvailable()) {
            throw new RuntimeException("Slot already booked");
        }

        slot.setAvailable(false);
        slotRepository.save(slot);

        Appointment appointment = Appointment.builder()
                .student(student)
                .slot(slot)
                .status(AppointmentStatus.BOOKED)
                .build();

        return appointmentRepository.save(appointment);
    }

    // 🔵 Booking response
    @Transactional
    public BookingResponse bookAppointmentResponse(UUID studentId, UUID slotId) {

        Appointment appointment = bookAppointment(studentId, slotId);

        return new BookingResponse(
                appointment.getId(),
                appointment.getSlot().getSlotDate(),
                appointment.getSlot().getStartTime(),
                appointment.getSlot().getEndTime(),
                appointment.getStatus().toString()
        );
    }

    // 🔵 Student Dashboard
    public List<StudentAppointmentResponse> getAppointmentsForStudent(UUID studentId) {
        return appointmentRepository.findByStudent_Id(studentId)
                .stream()
                .map(a -> new StudentAppointmentResponse(
                        a.getId(),
                        a.getSlot().getSlotDate(),
                        a.getSlot().getStartTime(),
                        a.getSlot().getEndTime(),
                        a.getStatus().toString()
                ))
                .toList();
    }

    // 🔵 Counsellor Dashboard
    public Page<CounsellorAppointmentResponse> getAppointmentsForCounsellor(
        UUID counsellorId,
        AppointmentStatus status,
        Pageable pageable
    ) {

    User counsellor = userRepository.findById(counsellorId)
            .orElseThrow(() -> new RuntimeException("User not found"));

    if (counsellor.getRole() != Role.ROLE_COUNSELLOR) {
        throw new RuntimeException("Only counsellor can view appointments");
    }

    List<Appointment> appointments;

    if (status != null) {
        // BOOKED OR COMPLETED explicitly
        appointments = appointmentRepository.findByStatus(status);
    } else {
        // Default → hide CANCELLED
        appointments = appointmentRepository.findByStatusIn(
                List.of(
                        AppointmentStatus.BOOKED,
                        AppointmentStatus.COMPLETED
                )
        );
    }

        // Ensure pagination starts from latest appointments first (newest date/time).
        appointments.sort((a, b) -> {
                int dateCompare = b.getSlot().getSlotDate().compareTo(a.getSlot().getSlotDate());
                if (dateCompare != 0) {
                        return dateCompare;
                }
                return b.getSlot().getStartTime().compareTo(a.getSlot().getStartTime());
        });

    List<CounsellorAppointmentResponse> content = appointments.stream()
            .map(a -> new CounsellorAppointmentResponse(
                    a.getId(),
                    a.getStudent().getName(),
                    a.getStudent().getAcademicYear(),
                    a.getStudent().getPhone(),
                    a.getSlot().getSlotDate(),
                    a.getSlot().getStartTime(),
                    a.getSlot().getEndTime(),
                    a.getStatus().toString()
            ))
            .toList();

    int start = (int) pageable.getOffset();
    int end = Math.min((start + pageable.getPageSize()), content.size());

    List<CounsellorAppointmentResponse> pageContent = content.subList(start, end);

    return new PageImpl<>(pageContent, pageable, content.size());
    }

    // 🔵 Tomorrow Available Slots
    public List<SlotResponse> getTomorrowAvailableSlots() {
        return slotRepository
                .findByIsAvailableTrueAndSlotDate(LocalDate.now().plusDays(1))
                .stream()
                .map(slot -> new SlotResponse(
                        slot.getId(),
                        slot.getSlotDate(),
                        slot.getStartTime(),
                        slot.getEndTime()
                ))
                .toList();
    }

    // 🔵 All Tomorrow Slots (UI)
    public List<SlotDisplayResponse> getAllTomorrowSlotsForUI() {
        return slotRepository
                .findBySlotDate(LocalDate.now().plusDays(1))
                .stream()
                .map(slot -> new SlotDisplayResponse(
                        slot.getId(),
                        slot.getSlotDate(),
                        slot.getStartTime(),
                        slot.getEndTime(),
                        slot.isAvailable()
                ))
                .toList();
    }

    // 🔵 Cancel Appointment
    @Transactional
    public void cancelAppointment(UUID appointmentId, UUID studentId) {

        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 🔐 ROLE CHECK
        if (student.getRole() != Role.ROLE_STUDENT) {
            throw new RuntimeException("Only students can cancel appointments");
        }

        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        if (!appointment.getStudent().getId().equals(studentId)) {
            throw new RuntimeException("Unauthorized cancellation");
        }

        if (appointment.getStatus() == AppointmentStatus.COMPLETED) {
            throw new RuntimeException("Completed appointment cannot be cancelled");
        }

        if (appointment.getStatus() == AppointmentStatus.CANCELLED) {
            throw new RuntimeException("Appointment already cancelled");
        }

        appointment.setStatus(AppointmentStatus.CANCELLED);

        Slot slot = appointment.getSlot();
        slot.setAvailable(true);

        slotRepository.save(slot);
        appointmentRepository.save(appointment);
    }

    // 🔵 Mark Appointment Completed
    @Transactional
    public void markAppointmentCompleted(UUID appointmentId, UUID counsellorId) {

        User counsellor = userRepository.findById(counsellorId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 🔐 ROLE CHECK
        if (counsellor.getRole() != Role.ROLE_COUNSELLOR) {
            throw new RuntimeException("Only counsellor can complete appointment");
        }

        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        if (appointment.getStatus() != AppointmentStatus.BOOKED) {
            throw new RuntimeException("Only booked appointments can be completed");
        }

        appointment.setStatus(AppointmentStatus.COMPLETED);
        appointmentRepository.save(appointment);
    }

    public Map<String, List<SlotDisplayResponse>> getBookingSlotsForStudent() {

    LocalDate today = LocalDate.now();
    LocalDate tomorrow = today.plusDays(1);
    LocalDateTime now = LocalDateTime.now();

    List<SlotDisplayResponse> todaySlots =
            slotRepository.findBySlotDate(today)
                    .stream()
                    .map(slot -> {
                        LocalDateTime slotStart =
                                LocalDateTime.of(today, slot.getStartTime());

                        boolean bookable =
                                slot.isAvailable() &&
                                now.isBefore(slotStart.minusHours(1));

                        return new SlotDisplayResponse(
                                slot.getId(),
                                slot.getSlotDate(),
                                slot.getStartTime(),
                                slot.getEndTime(),
                                bookable
                        );
                    })
                    .toList();

    List<SlotDisplayResponse> tomorrowSlots =
            slotRepository.findBySlotDate(tomorrow)
                    .stream()
                    .map(slot -> new SlotDisplayResponse(
                            slot.getId(),
                            slot.getSlotDate(),
                            slot.getStartTime(),
                            slot.getEndTime(),
                            slot.isAvailable()
                    ))
                    .toList();

    Map<String, List<SlotDisplayResponse>> response = new HashMap<>();
    response.put("today", todaySlots);
    response.put("tomorrow", tomorrowSlots);

    return response;
}
}