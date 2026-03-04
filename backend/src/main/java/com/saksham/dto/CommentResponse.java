package com.saksham.dto;

import java.time.LocalDateTime;
import java.util.UUID;

import com.saksham.entity.Comment;
import com.saksham.entity.User;

public class CommentResponse {

    private UUID id;
    private String content;
    private LocalDateTime createdAt;
    private String authorName;
    private boolean isOwner;

    public static CommentResponse from(Comment comment, User currentUser) {
        CommentResponse res = new CommentResponse();

        res.id = comment.getId();
        res.content = comment.getContent();
        res.createdAt = comment.getCreatedAt();

        System.out.println("COMMENT USER: " + comment.getUser().getId());

        if (comment.getUser() != null) {
            res.authorName = comment.getUser().getAlias();
        }

        res.isOwner = comment.getUser() != null &&
                comment.getUser().getId().equals(currentUser.getId());

        return res;
    }

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

    public boolean isOwner() {
        return isOwner;
    }
}