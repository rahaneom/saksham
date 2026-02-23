package com.saksham.dto;

import lombok.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
@AllArgsConstructor
public class CounsellorAppointmentResponse {

    private String studentName;
    private String academicYear;
    private String phone;

    private LocalDate slotDate;
    private LocalTime startTime;
    private LocalTime endTime;

    private String status;
}