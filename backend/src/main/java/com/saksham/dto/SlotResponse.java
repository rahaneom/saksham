package com.saksham.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

@Getter
@AllArgsConstructor
public class SlotResponse {

    private UUID slotId;
    private LocalDate slotDate;
    private LocalTime startTime;
    private LocalTime endTime;
}