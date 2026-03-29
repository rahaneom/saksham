package com.saksham.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        // ✅ Allow CORS preflight
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            filterChain.doFilter(request, response);
            return;
        }

        final String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7);
        System.out.println("[JwtAuthFilter] token received (first20): " + token.substring(0, Math.min(20, token.length())));
        String email = null;
        String role = null;
        try {
            email = jwtUtil.extractEmail(token);
            role = jwtUtil.extractRole(token);
            System.out.println("[JwtAuthFilter] extracted user=" + email + " role=" + role);
        } catch (Exception ex) {
            System.err.println("[JwtAuthFilter] invalid token: " + ex.getMessage());
        }

        if (email != null &&
            SecurityContextHolder.getContext().getAuthentication() == null) {

            if (!jwtUtil.validateToken(token, email)) {
                System.out.println("[JwtAuthFilter] token validation failed for " + email);
                filterChain.doFilter(request, response);
                return;
            }

            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(
                            email,
                            null,
                            Collections.singletonList(new SimpleGrantedAuthority(role))
                    );

            authentication.setDetails(
                    new WebAuthenticationDetailsSource().buildDetails(request)
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);
        }

        filterChain.doFilter(request, response);
    }

    // ✅ Skip JWT filter for auth APIs except update
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String uri = request.getRequestURI();

        // allow unauthenticated register/login/forgot/reset
        if (uri.equals("/api/auth/register") || uri.equals("/api/auth/login") || uri.equals("/api/auth/forgot-password") || uri.equals("/api/auth/reset-password")) {
            return true;
        }

        // allow unauthenticated GET requests to resources
        if (uri.startsWith("/api/resources/") && "GET".equalsIgnoreCase(request.getMethod())) {
            return true;
        }

        // require auth for update/profile endpoints and all appointment endpoints
        if (uri.equals("/api/auth/update") || uri.equals("/api/users/me") || uri.startsWith("/api/appointments/")) {
            return false;
        }

        // protect everything else as usual
        return uri.startsWith("/api/auth/") ? false : false;
    }
}