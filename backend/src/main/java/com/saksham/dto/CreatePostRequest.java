package com.saksham.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.NotNull;

import com.saksham.entity.Tag;

public class CreatePostRequest {

    @NotBlank(message = "Content cannot be empty")
    @Size(max = 1000, message = "Content too long")
    private String content;

    @NotNull(message = "Tag is required")
    private Tag tag;

    private boolean anonymous = true;

    // getters & setters
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
        return anonymous;
    }

    public void setAnonymous(boolean anonymous) {
        this.anonymous = anonymous;
    }
}