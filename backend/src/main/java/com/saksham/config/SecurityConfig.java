package com.saksham.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.saksham.security.JwtAuthenticationFilter;

import lombok.RequiredArgsConstructor;

@Configuration
@RequiredArgsConstructor
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .httpBasic(httpBasic -> httpBasic.disable())
                .formLogin(form -> form.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // AUTH APIs - only unauthenticated actions
                        .requestMatchers("/api/auth/register", "/api/auth/login", "/api/auth/forgot-password", "/api/auth/reset-password").permitAll()
                        // self user profile update requires auth
                        .requestMatchers(HttpMethod.PUT, "/api/auth/update").hasAnyAuthority("ROLE_STUDENT", "ROLE_COUNSELLOR", "ROLE_ADMIN")
                        .requestMatchers(org.springframework.http.HttpMethod.OPTIONS, "/**").permitAll()

                        // ===== AUTHENTICATED PROFILE =====
                        .requestMatchers(HttpMethod.GET, "/api/users/me").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/api/users/me").hasAnyAuthority("ROLE_STUDENT", "ROLE_COUNSELLOR", "ROLE_ADMIN")

                        // ===== STUDENT ONLY =====
                        .requestMatchers("/api/calendly/**").permitAll()
                        .requestMatchers("/api/calendly/webhook").permitAll()
                        .requestMatchers("/api/forum/**").hasAuthority("ROLE_STUDENT")
                        .requestMatchers("/api/forum/create").hasAuthority("ROLE_STUDENT")
                        .requestMatchers("/api/forum/like/**").hasAuthority("ROLE_STUDENT")
                        .requestMatchers("/api/forum/report/**").hasAuthority("ROLE_STUDENT")
                        .requestMatchers("/api/comments/add/**").hasAuthority("ROLE_STUDENT")
                        // ===== ADMIN ONLY =====
                        .requestMatchers("/api/admin/**").hasAuthority("ROLE_ADMIN")
                        // ===== COUNSELLOR ONLY =====
                        .requestMatchers(HttpMethod.POST, "/api/resources/**").hasAuthority("ROLE_COUNSELLOR")
                        .requestMatchers(HttpMethod.DELETE, "/api/resources/**").hasAuthority("ROLE_COUNSELLOR")
                        .requestMatchers(HttpMethod.GET, "/api/resources/**").permitAll()
                        // ===== EVERYTHING ELSE → LOGIN REQUIRED =====
                        .anyRequest().authenticated())
                .addFilterBefore(jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(List.of(
                "http://localhost:*",
                "http://127.0.0.1:*",
                "https://saksham-mind.vercel.app"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }
}
