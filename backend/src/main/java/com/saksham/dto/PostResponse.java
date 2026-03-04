package com.saksham.dto;

import java.time.LocalDateTime;
import java.util.UUID;

import com.saksham.entity.Post;
import com.saksham.entity.Tag;
import com.saksham.entity.User;

public class PostResponse {

    private UUID id;
    private String content;
    private Tag tag;
    private boolean anonymous;
    private int likesCount;
    private int reportCount;
    private LocalDateTime createdAt;
    private String authorName;
    private boolean likedByCurrentUser;
    private boolean isOwner;

    public boolean isLikedByCurrentUser() {
        return likedByCurrentUser;
    }

    // STATIC CONVERTER
    public static PostResponse from(Post post, String alias, boolean liked, User currentUser) {
        PostResponse res = new PostResponse();

        res.id = post.getId();
        res.content = post.getContent();
        res.tag = post.getTag();
        res.anonymous = post.isAnonymous();
        res.createdAt = post.getCreatedAt();
        res.likesCount = post.getLikesCount();
        res.reportCount = post.getReportCount();

        res.authorName = alias;
        res.likedByCurrentUser = liked;

        res.isOwner = post.getUser() != null &&
                post.getUser().getId().equals(currentUser.getId());

        return res;
    }

    // getters
    public UUID getId() {
        return id;
    }

    public String getContent() {
        return content;
    }

    public Tag getTag() {
        return tag;
    }

    public boolean isAnonymous() {
        return anonymous;
    }

    public int getLikesCount() {
        return likesCount;
    }

    public int getReportCount() {
        return reportCount;
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