package com.saksham.dto;

import lombok.*;
import com.saksham.entity.Role;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegisterRequest {
    
    private String name;
    private String academicYear;
    private String collegeName;
    private String email;
    private String phone;
    private String password;  
    private Role role;

}
