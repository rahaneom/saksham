package com.saksham.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

import com.saksham.entity.User;
import com.saksham.dto.*;
import com.saksham.security.JwtUtil;
import com.saksham.repository.UserRepository;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AliasService aliasService;

    // Regsiter user
    public String register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered!");
        }

        String alias;
        do {
            alias = aliasService.generateAlias();
        } while (userRepository.existsByAlias(alias));

        User user = User.builder()
                .name(request.getName())
                .academicYear(request.getAcademicYear())
                .collegeName(request.getCollegeName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .alias(alias)
                .build();
        userRepository.save(user);
        System.out.println("User registered: " + user.getEmail());
        return "User registered successfully!";
    }

    // Login user
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());

        System.out.println("User logged in: " + user.getEmail());
        return AuthResponse.builder()
                .token(token)
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .build();
    }
}
