package com.saksham.dto;

import lombok.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
@AllArgsConstructor
public class StudentAppointmentResponse {

    private LocalDate slotDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private String status;
}