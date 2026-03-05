package com.saksham.dto;

import lombok.*;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
public class CounsellorAppointmentResponse {

    private UUID appointmentId;
    private String studentName;
    private String academicYear;
    private String phone;

    private LocalDate slotDate;
    private LocalTime startTime;
    private LocalTime endTime;

    private String status;
}