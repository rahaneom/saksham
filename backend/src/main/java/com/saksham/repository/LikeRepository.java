package com.saksham.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.saksham.entity.Like;
import com.saksham.entity.Post;
import com.saksham.entity.User;

public interface LikeRepository extends JpaRepository<Like, UUID> {

    Optional<Like> findByUserAndPost(User user, Post post);

    long countByPost(Post post);
}