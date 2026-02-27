package com.saksham.controller;

import com.saksham.dto.*;
import com.saksham.entity.AppointmentStatus;
import com.saksham.entity.User;
import com.saksham.repository.UserRepository;
import com.saksham.service.AppointmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.Map;

@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentService appointmentService;
    private final UserRepository userRepository;

    // 🔵 Book Appointment (JWT Based)
    @PreAuthorize("hasRole('STUDENT')")
    @PostMapping("/book")
    public ResponseEntity<BookingResponse> bookAppointment(
            @RequestParam UUID slotId,
            Authentication authentication
    ) {

        UUID studentId = getUserIdFromAuth(authentication);

        return ResponseEntity.ok(
                appointmentService.bookAppointmentResponse(studentId, slotId)
        );
    }

    // 🔵 Student Dashboard
    @PreAuthorize("hasRole('STUDENT')")
    @GetMapping("/student")
    public ResponseEntity<List<StudentAppointmentResponse>> getStudentAppointments(
            Authentication authentication
    ) {

        UUID studentId = getUserIdFromAuth(authentication);

        return ResponseEntity.ok(
                appointmentService.getAppointmentsForStudent(studentId)
        );
    }

    // 🔵 Counsellor Dashboard
    @PreAuthorize("hasRole('COUNSELLOR')")
    @GetMapping("/counsellor")
    public ResponseEntity<Page<CounsellorAppointmentResponse>> getAllAppointments(
            @RequestParam(required = false) AppointmentStatus status,
            Pageable pageable,
            Authentication authentication
    ) {

        String email = authentication.getName();

        UUID counsellorId = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"))
                .getId();

        return ResponseEntity.ok(
                appointmentService.getAppointmentsForCounsellor(counsellorId, status, pageable)
        );
    }

    // 🔵 Booking Slots (Today + Tomorrow)
    @PreAuthorize("hasRole('STUDENT')")
    @GetMapping("/slots/booking")
    public ResponseEntity<Map<String, List<SlotDisplayResponse>>> getBookingSlots() {
        return ResponseEntity.ok(
                appointmentService.getBookingSlotsForStudent()
        );
    }

    // 🔵 Cancel Appointment
    @PreAuthorize("hasRole('STUDENT')")
    @PutMapping("/cancel")
    public ResponseEntity<String> cancelAppointment(
            @RequestParam UUID appointmentId,
            Authentication authentication
    ) {

        UUID studentId = getUserIdFromAuth(authentication);

        appointmentService.cancelAppointment(appointmentId, studentId);

        return ResponseEntity.ok("Appointment cancelled successfully");
    }

    // 🔵 Mark Appointment Completed
    @PreAuthorize("hasRole('COUNSELLOR')")
    @PutMapping("/complete")
    public ResponseEntity<String> completeAppointment(
            @RequestParam UUID appointmentId,
            Authentication authentication
    ) {

        UUID counsellorId = getUserIdFromAuth(authentication);

        appointmentService.markAppointmentCompleted(appointmentId, counsellorId);

        return ResponseEntity.ok("Appointment marked as completed");
    }

    // 🔒 Helper Method (avoid repetition)
    private UUID getUserIdFromAuth(Authentication authentication) {
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"))
                .getId();
    }
}
