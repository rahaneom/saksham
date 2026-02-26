package com.saksham.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class EditPostRequest {

    @NotBlank(message = "Content cannot be empty")
    @Size(max = 1000, message = "Content too long")
    private String content;

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}