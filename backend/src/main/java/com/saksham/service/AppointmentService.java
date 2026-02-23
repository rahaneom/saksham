package com.saksham.service;

import com.saksham.dto.BookingResponse;
import com.saksham.dto.CounsellorAppointmentResponse;
import com.saksham.dto.SlotDisplayResponse;
import com.saksham.dto.SlotResponse;
import com.saksham.dto.StudentAppointmentResponse;
import com.saksham.entity.*;
import com.saksham.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

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

        Slot slot = slotRepository.findById(slotId)
                .orElseThrow(() -> new RuntimeException("Slot not found"));

        if (!slot.getSlotDate().equals(LocalDate.now().plusDays(1))) {
            throw new RuntimeException("Booking allowed only for tomorrow");
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
                        a.getSlot().getSlotDate(),
                        a.getSlot().getStartTime(),
                        a.getSlot().getEndTime(),
                        a.getStatus().toString()
                ))
                .toList();
    }

    // 🔵 Counsellor Dashboard
    public List<CounsellorAppointmentResponse> getAllAppointmentsForCounsellor(UUID counsellorId) {

        User counsellor = userRepository.findById(counsellorId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 🔐 ROLE CHECK
        if (counsellor.getRole() != Role.ROLE_COUNSELLOR) {
            throw new RuntimeException("Only counsellor can view all appointments");
        }

        return appointmentRepository.findAll().stream()
                .map(a -> new CounsellorAppointmentResponse(
                        a.getStudent().getName(),
                        a.getStudent().getAcademicYear(),
                        a.getStudent().getPhone(),
                        a.getSlot().getSlotDate(),
                        a.getSlot().getStartTime(),
                        a.getSlot().getEndTime(),
                        a.getStatus().toString()
                ))
                .toList();
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
}