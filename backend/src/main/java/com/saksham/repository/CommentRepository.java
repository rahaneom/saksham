package com.saksham.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.saksham.entity.Comment;

public interface CommentRepository extends JpaRepository<Comment, UUID> {

    // Only fetch visible comments
    List<Comment> findByPostIdAndIsHiddenFalse(UUID postId);
}