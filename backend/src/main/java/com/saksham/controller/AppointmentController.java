package com.saksham.controller;

import com.saksham.dto.*;
import com.saksham.entity.User;
import com.saksham.repository.UserRepository;
import com.saksham.service.AppointmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentService appointmentService;
    private final UserRepository userRepository;

    // 🔵 Book Appointment (JWT Based)
    @PostMapping("/book")
    public ResponseEntity<BookingResponse> bookAppointment(
            @RequestParam UUID slotId,
            Authentication authentication
    ) {

        String email = authentication.getName();

        UUID studentId = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"))
                .getId();

        return ResponseEntity.ok(
                appointmentService.bookAppointmentResponse(studentId, slotId)
        );
    }

    // 🔵 Student Dashboard (JWT Based)
    @GetMapping("/student")
    public ResponseEntity<List<StudentAppointmentResponse>> getStudentAppointments(
            Authentication authentication
    ) {

        String email = authentication.getName();

        UUID studentId = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"))
                .getId();

        return ResponseEntity.ok(
                appointmentService.getAppointmentsForStudent(studentId)
        );
    }

    // 🔵 Counsellor Dashboard (JWT Based)
    @GetMapping("/counsellor")
    public ResponseEntity<List<CounsellorAppointmentResponse>> getAllAppointments(
            Authentication authentication
    ) {

        String email = authentication.getName();

        UUID counsellorId = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"))
                .getId();

        return ResponseEntity.ok(
                appointmentService.getAllAppointmentsForCounsellor(counsellorId)
        );
    }

    // 🔵 Tomorrow Available Slots
    @GetMapping("/slots/tomorrow")
    public ResponseEntity<List<SlotResponse>> getTomorrowSlots() {
        return ResponseEntity.ok(
                appointmentService.getTomorrowAvailableSlots()
        );
    }

    // 🔵 All Tomorrow Slots for UI
    @GetMapping("/slots/tomorrow/all")
    public ResponseEntity<List<SlotDisplayResponse>> getAllTomorrowSlots() {
        return ResponseEntity.ok(
                appointmentService.getAllTomorrowSlotsForUI()
        );
    }

    // 🔵 Cancel Appointment (JWT Based)
    @PutMapping("/cancel")
    public ResponseEntity<String> cancelAppointment(
            @RequestParam UUID appointmentId,
            Authentication authentication
    ) {

        String email = authentication.getName();

        UUID studentId = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"))
                .getId();

        appointmentService.cancelAppointment(appointmentId, studentId);

        return ResponseEntity.ok("Appointment cancelled successfully");
    }

    // 🔵 Mark Appointment Completed (JWT Based)
    @PutMapping("/complete")
    public ResponseEntity<String> completeAppointment(
            @RequestParam UUID appointmentId,
            Authentication authentication
    ) {

        String email = authentication.getName();

        UUID counsellorId = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"))
                .getId();

        appointmentService.markAppointmentCompleted(appointmentId, counsellorId);

        return ResponseEntity.ok("Appointment marked as completed");
    }
}