package com.saksham.repository;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.saksham.entity.Post;
import com.saksham.entity.Tag;

public interface PostRepository extends JpaRepository<Post, UUID> {
    // Filter by tag + not hidden
    Page<Post> findByTagAndIsHiddenFalse(Tag tag, Pageable pageable);

    // Only non-hidden posts
    Page<Post> findByIsHiddenFalse(Pageable pageable);
}