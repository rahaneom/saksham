package com.saksham.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.saksham.service.AppointmentService;
import com.saksham.service.CalendlyService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/calendly")
@RequiredArgsConstructor
public class CalendlyController {

    private final CalendlyService calendlyService;
    private final AppointmentService appointmentService;

    // Sync events from Calendly → DB
    @PostMapping("/sync")
    public ResponseEntity<?> syncCalendly() {

        List<Map<String, Object>> events = calendlyService.getScheduledEvents();

        appointmentService.syncFromCalendly(events);

        return ResponseEntity.ok("Calendly sync completed");
    }
}