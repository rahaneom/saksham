package com.saksham.controller;

import com.saksham.dto.UserProfileResponse;
import com.saksham.dto.UpdateUserRequest;
import com.saksham.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final AuthService authService;

    @GetMapping("/me")
    public UserProfileResponse me() {
        String currentUser = org.springframework.security.core.context.SecurityContextHolder
                .getContext().getAuthentication().getName();
        System.out.println("[UserController] current authenticated user: " + currentUser);
        return authService.getCurrentUser();
    }

    @PutMapping("/me")
    public String updateMe(@RequestBody UpdateUserRequest request) {
        System.out.println("[UserController] update request for current user");
        return authService.updateUser(request);
    }
}
