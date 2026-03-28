package com.saksham.controller;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.saksham.entity.User;
import com.saksham.repository.UserRepository;
import com.saksham.service.AppointmentService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/calendly")
@RequiredArgsConstructor
public class CalendlyWebhookController {

    private final AppointmentService appointmentService;
    private final UserRepository userRepository;

    @PostMapping("/webhook")
    public ResponseEntity<?> handleWebhook(@RequestBody Map<String, Object> payload) {

        System.out.println("Calendly Webhook Received: " + payload);

        String event = (String) payload.get("event");

        // Only handle booking event
        if (!"invitee.created".equals(event)) {
            return ResponseEntity.ok().build();
        }

        Map<?, ?> data = (Map<?, ?>) payload.get("payload");

        Map<?, ?> invitee = (Map<?, ?>) data.get("invitee");
        Map<?, ?> eventDetails = (Map<?, ?>) data.get("event");

        String email = (String) invitee.get("email");

        String startTimeStr = (String) eventDetails.get("start_time");
        String endTimeStr = (String) eventDetails.get("end_time");

        LocalDateTime startTime = Instant.parse(startTimeStr)
                .atZone(ZoneId.of("Asia/Kolkata"))
                .toLocalDateTime();

        LocalDateTime endTime = Instant.parse(endTimeStr)
                .atZone(ZoneId.of("Asia/Kolkata"))
                .toLocalDateTime();
        // Find user
        User student = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Call service
        try {
            appointmentService.bookViaCalendly(student.getId(), startTime, endTime);
            System.out.println("Appointment booked successfully via Calendly");
        } catch (Exception e) {
            System.out.println("Booking failed: " + e.getMessage());
        }

        return ResponseEntity.ok().build();
    }
}