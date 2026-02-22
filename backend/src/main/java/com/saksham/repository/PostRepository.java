package com.saksham.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.saksham.entity.Post;

public interface PostRepository extends JpaRepository<Post, UUID> {
}