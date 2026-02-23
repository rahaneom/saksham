package com.saksham.controller;

import com.saksham.dto.*;
import com.saksham.service.AuthService;
import lombok.RequiredArgsConstructor;

import org.hibernate.sql.Update;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public String register(@RequestBody RegisterRequest request){
        return authService.register(request);
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest request){
        return authService.login(request);
    }

    @PutMapping("/update")
    public String updateUser(@RequestBody UpdateUserRequest request){
        return authService.updateUser(request);
    }
    
}