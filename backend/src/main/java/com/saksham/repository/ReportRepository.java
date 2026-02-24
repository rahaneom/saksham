package com.saksham.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.saksham.entity.Post;
import com.saksham.entity.Report;
import com.saksham.entity.User;

public interface ReportRepository extends JpaRepository<Report, UUID> {

    Optional<Report> findByUserAndPost(User user, Post post);
    
    long countByPost(Post post);
}