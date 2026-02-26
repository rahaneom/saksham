package com.saksham.dto;

import java.time.LocalDateTime;
import java.util.UUID;

import com.saksham.entity.Comment;

public class CommentResponse {

    private UUID id;
    private String content;
    private LocalDateTime createdAt;
    private String authorName;

    // CONVERTER
    public static CommentResponse from(Comment comment) {
        CommentResponse res = new CommentResponse();

        res.id = comment.getId();
        res.content = comment.getContent();
        res.createdAt = comment.getCreatedAt();

        if (comment.getUser() != null) {
            res.authorName = comment.getUser().getAlias();
        }

        return res;
    }

    // getters
    public UUID getId() {
        return id;
    }

    public String getContent() {
        return content;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public String getAuthorName() {
        return authorName;
    }
}