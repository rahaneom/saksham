package com.saksham.entity;

import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;

@Entity
public class Post {
    @Id
    @GeneratedValue
    private UUID id;

    @Column(nullable = false, length = 1000)
    private String content;

    @Enumerated(EnumType.STRING)
    private Tag tag;

    private boolean isAnonymous = true;

    private int likesCount = 0;

    private int reportCount = 0;

    private boolean isHidden = false;

    private LocalDateTime createdAt;

    public Post() {
    }

    // Getters & Setters

    public UUID getId() {
        return id;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Tag getTag() {
        return tag;
    }

    public void setTag(Tag tag) {
        this.tag = tag;
    }

    public boolean isAnonymous() {
        return isAnonymous;
    }

    public int getLikesCount() {
        return likesCount;
    }

    public int getReportCount() {
        return reportCount;
    }

    public boolean isHidden() {
        return isHidden;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
