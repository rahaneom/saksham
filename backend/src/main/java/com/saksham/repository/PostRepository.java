package com.saksham.repository;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.saksham.entity.Post;

public interface PostRepository extends JpaRepository<Post, UUID> {
    Page<Post> findByIsHiddenFalse(Pageable pageable);
}