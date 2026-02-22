package com.saksham.dto;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@Builder
public class AuthResponse {
    
    private String token;
    private String name;
    private String email;   
    private String role;
}
