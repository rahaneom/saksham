package com.saksham.service;

import com.saksham.dto.BookingResponse;
import com.saksham.dto.CounsellorAppointmentResponse;
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

        // 1️⃣ Fetch student
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        if (!student.getRole().equals(Role.ROLE_STUDENT)) {
            throw new RuntimeException("Only students can book appointments");
        }

        // 2️⃣ Fetch slot
        Slot slot = slotRepository.findById(slotId)
                .orElseThrow(() -> new RuntimeException("Slot not found"));

        // 🚫 Booking allowed only for tomorrow
        if (!slot.getSlotDate().equals(LocalDate.now().plusDays(1))) {
            throw new RuntimeException("Booking allowed only for tomorrow");
        }

        // ❌ Prevent multiple bookings per day per student
        boolean alreadyBooked = appointmentRepository
                .existsByStudent_IdAndSlot_SlotDateAndStatus(
                        studentId,
                        slot.getSlotDate(),
                        "BOOKED"
                );

        if (alreadyBooked) {
            throw new RuntimeException("You already have an appointment for this day");
        }

        // 3️⃣ Check slot availability
        if (!slot.isAvailable()) {
            throw new RuntimeException("Slot already booked");
        }

        // 4️⃣ Lock slot
        slot.setAvailable(false);
        slotRepository.save(slot);

        // 5️⃣ Create appointment
        Appointment appointment = Appointment.builder()
                .student(student)
                .slot(slot)
                .status("BOOKED")
                .build();

        return appointmentRepository.save(appointment);
    }

    // 🔵 Booking response (safe DTO)
    public BookingResponse bookAppointmentResponse(UUID studentId, UUID slotId) {

        Appointment appointment = bookAppointment(studentId, slotId);

        return new BookingResponse(
                appointment.getId(),
                appointment.getSlot().getSlotDate(),
                appointment.getSlot().getStartTime(),
                appointment.getSlot().getEndTime(),
                appointment.getStatus()
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
                        a.getStatus()
                ))
                .toList();
    }

    // 🔵 Counsellor Dashboard
    public List<CounsellorAppointmentResponse> getAllAppointmentsForCounsellor() {
        return appointmentRepository.findAll().stream()
                .map(a -> new CounsellorAppointmentResponse(
                        a.getStudent().getName(),
                        a.getStudent().getAcademicYear(),
                        a.getStudent().getPhone(),
                        a.getSlot().getSlotDate(),
                        a.getSlot().getStartTime(),
                        a.getSlot().getEndTime(),
                        a.getStatus()
                ))
                .toList();
    }

    // 🔵 Tomorrow Available Slots
    public List<Slot> getTomorrowAvailableSlots() {
        return slotRepository.findByIsAvailableTrueAndSlotDate(
                LocalDate.now().plusDays(1)
        );
    }

    // 🔵 Cancel Appointment
    @Transactional
    public void cancelAppointment(UUID appointmentId, UUID studentId) {

        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        if (!appointment.getStudent().getId().equals(studentId)) {
            throw new RuntimeException("Unauthorized cancellation");
        }

        if ("CANCELLED".equals(appointment.getStatus())) {
            throw new RuntimeException("Appointment already cancelled");
        }

        appointment.setStatus("CANCELLED");

        Slot slot = appointment.getSlot();
        slot.setAvailable(true);

        slotRepository.save(slot);
        appointmentRepository.save(appointment);
    }

    @Transactional
    public void markAppointmentCompleted(UUID appointmentId) {

        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        // Only BOOKED appointments can be completed
        if (!"BOOKED".equals(appointment.getStatus())) {
            throw new RuntimeException("Only booked appointments can be completed");
        }

        // Mark completed
        appointment.setStatus("COMPLETED");

        appointmentRepository.save(appointment);
    }
}