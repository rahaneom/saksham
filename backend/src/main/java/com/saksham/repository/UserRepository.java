package com.saksham.repository;

import com.saksham.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {
    // DO NOT add auth-related methods here
}