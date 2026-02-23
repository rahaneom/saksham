package com.saksham.controller;

import com.saksham.dto.BookingResponse;
import com.saksham.dto.CounsellorAppointmentResponse;
import com.saksham.dto.SlotDisplayResponse;
import com.saksham.dto.SlotResponse;
import com.saksham.dto.StudentAppointmentResponse;
import com.saksham.entity.Appointment;
import com.saksham.entity.Slot;
import com.saksham.service.AppointmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentService appointmentService;

    // 🔵 Book Appointment
    @PostMapping("/book")
public ResponseEntity<BookingResponse> bookAppointment(
        @RequestParam UUID studentId,
        @RequestParam UUID slotId
) {
    return ResponseEntity.ok(
            appointmentService.bookAppointmentResponse(studentId, slotId)
    );
}

    // 🔵 Student Dashboard
    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<StudentAppointmentResponse>> getStudentAppointments(
            @PathVariable UUID studentId
    ) {
        return ResponseEntity.ok(
                appointmentService.getAppointmentsForStudent(studentId)
        );
    }

    // 🔵 Counsellor Dashboard
    @GetMapping("/counsellor")
    public ResponseEntity<List<CounsellorAppointmentResponse>> getAllAppointments(
            @RequestParam UUID counsellorId
    ) {
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

    // 🔵 All Tomorrow Slots for UI (including booked ones)
    @GetMapping("/slots/tomorrow/all")
    public ResponseEntity<List<SlotDisplayResponse>> getAllTomorrowSlots() {
        return ResponseEntity.ok(
                appointmentService.getAllTomorrowSlotsForUI()
        );
    }

    // 🔵 Cancel Appointment
    @PutMapping("/cancel")
    public ResponseEntity<String> cancelAppointment(
            @RequestParam UUID appointmentId,
            @RequestParam UUID studentId
    ) {
        appointmentService.cancelAppointment(appointmentId, studentId);
        return ResponseEntity.ok("Appointment cancelled successfully");
    }

    @PutMapping("/complete")
    public ResponseEntity<String> completeAppointment(
            @RequestParam UUID appointmentId,
            @RequestParam UUID counsellorId
    ) {
        appointmentService.markAppointmentCompleted(appointmentId, counsellorId);
        return ResponseEntity.ok("Appointment marked as completed");
    }
}