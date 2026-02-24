package com.saksham.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.saksham.security.JwtAuthenticationFilter;

import lombok.RequiredArgsConstructor;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // AUTH APIs
                        .requestMatchers("/api/auth/**").permitAll()

                        // ===== STUDENT ONLY =====
                        .requestMatchers("/api/forum/create").hasRole("STUDENT")
                        .requestMatchers("/api/forum/like/**").hasRole("STUDENT")
                        .requestMatchers("/api/forum/report/**").hasRole("STUDENT")

                        .requestMatchers("/api/comments/add/**").hasRole("STUDENT")

                        // ===== ADMIN ONLY =====
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")

                        // ===== EVERYTHING ELSE → LOGIN REQUIRED =====
                        .anyRequest().authenticated())
                .addFilterBefore(jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}

// @Bean
// public SecurityFilterChain securityFilterChain(HttpSecurity http) throws
// Exception {

// http
// .csrf(csrf -> csrf.disable())
// .sessionManagement(session ->
// session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
// )
// .authorizeHttpRequests(auth -> auth
// .requestMatchers("/api/auth/**").permitAll()
// .requestMatchers("/api/admin/**").hasRole("ADMIN")
// .requestMatchers("/api/student/**").hasRole("STUDENT")
// .requestMatchers("/api/counsellor/**").hasRole("COUNSELLOR")
// .anyRequest().authenticated()
// )
// .addFilterBefore(jwtAuthenticationFilter,
// UsernamePasswordAuthenticationFilter.class);

// return http.build();
// }