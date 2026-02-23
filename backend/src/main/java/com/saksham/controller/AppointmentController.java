package com.saksham.controller;

import com.saksham.entity.Appointment;
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

    // 🔵 Student books appointment
    @PostMapping("/book")
    public ResponseEntity<Appointment> bookAppointment(
            @RequestParam UUID studentId,
            @RequestParam UUID slotId
    ) {
        Appointment appointment = appointmentService.bookAppointment(studentId, slotId);
        return ResponseEntity.ok(appointment);
    }

    // 🔵 Student views their appointments
    @GetMapping("/student/{studentId}")
    public ResponseEntity<?> getStudentAppointments(@PathVariable UUID studentId) {
    return ResponseEntity.ok(
        appointmentService.getAppointmentsForStudent(studentId)
    );
}

    // 🔵 Counsellor views all appointments
    @GetMapping("/counsellor")
    public ResponseEntity<?> getAllAppointments() {
    return ResponseEntity.ok(
        appointmentService.getAllAppointmentsForCounsellor()
    );
}
}