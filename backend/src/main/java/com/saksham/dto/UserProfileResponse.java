package com.saksham.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProfileResponse {
    private String name;
    private String alias;
    private String academicYear;
    private String collegeName;
    private String email;
    private String phone;
    private String role;
    private LocalDateTime createdAt;
}
