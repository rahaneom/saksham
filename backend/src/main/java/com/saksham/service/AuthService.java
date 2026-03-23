package com.saksham.service;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.MailException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;

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
    private final JavaMailSender mailSender;

    @Value("${app.frontend.reset-password-url:http://localhost:5173/reset-password}")
    private String resetPasswordUrl;

    @Value("${spring.mail.username:}")
    private String mailUsername;

    @Value("${spring.mail.password:}")
    private String mailPassword;

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

    // Update User
    public String updateUser(UpdateUserRequest request){
        String email=SecurityContextHolder.getContext()
        .getAuthentication()
        .getName();

        User user=userRepository.findByEmail(email) 
        .orElseThrow(()-> new RuntimeException("User not found"));

        if(request.getPhone()!=null && !request.getPhone().isBlank()){
            user.setPhone(request.getPhone());
        }
        if(request.getAcademicYear()!=null && !request.getAcademicYear().isBlank()){
            user.setAcademicYear(request.getAcademicYear());
        }
        if(request.getPassword()!=null && !request.getPassword().isBlank()){
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }
        userRepository.save(user);
        return "User updated successfully!";
    }

    public String requestPasswordReset(ForgotPasswordRequest request) {
        if (request.getEmail() == null || request.getEmail().isBlank()) {
            throw new RuntimeException("Email is required");
        }

        if (mailUsername == null || mailUsername.isBlank() || mailPassword == null || mailPassword.isBlank()) {
            throw new RuntimeException("Email service not configured. Set MAIL_USERNAME and MAIL_PASSWORD.");
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Account with this email does not exist"));

        String token = UUID.randomUUID().toString();
        user.setPasswordResetToken(token);
        user.setPasswordResetTokenExpiry(LocalDateTime.now().plusMinutes(30));
        userRepository.save(user);

        String resetLink = resetPasswordUrl + "?token=" + token;

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(user.getEmail());
        message.setSubject("Saksham - Reset Your Password");
        message.setText(
                "Hi " + user.getName() + ",\n\n"
                        + "We received a request to reset your password.\n"
                        + "Click the link below to set a new password:\n\n"
                        + resetLink + "\n\n"
                        + "This link is valid for 30 minutes.\n"
                        + "If you didn't request this, you can ignore this email.\n\n"
                        + "Thanks,\nSaksham Team"
        );
        try {
            mailSender.send(message);
        } catch (MailException ex) {
            throw new RuntimeException("Failed to send reset email. Check Gmail app password configuration.");
        }

        return "Password reset email sent successfully";
    }

    public String resetPassword(ResetPasswordRequest request) {
        if (request.getNewPassword() == null || request.getNewPassword().length() < 6) {
            throw new RuntimeException("Password must be at least 6 characters");
        }

        User user = userRepository.findByPasswordResetToken(request.getToken())
                .orElseThrow(() -> new RuntimeException("Invalid reset token"));

        if (user.getPasswordResetTokenExpiry() == null
                || user.getPasswordResetTokenExpiry().isBefore(LocalDateTime.now())) {
            user.setPasswordResetToken(null);
            user.setPasswordResetTokenExpiry(null);
            userRepository.save(user);
            throw new RuntimeException("Reset token has expired");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setPasswordResetToken(null);
        user.setPasswordResetTokenExpiry(null);
        userRepository.save(user);

        return "Password updated successfully";
    }
}
