package com.saksham.entity;

import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class Comment {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(nullable = false, length = 500)
    private String content;

    private LocalDateTime createdAt;

    private boolean isHidden = false;

    @ManyToOne
    @JoinColumn(name = "post_id")
    private Post post;

    // NEW: USER LINK
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    public Comment() {
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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public boolean isHidden() {
        return isHidden;
    }

    public void setHidden(boolean hidden) {
        isHidden = hidden;
    }

    public Post getPost() {
        return post;
    }

    public void setPost(Post post) {
        this.post = post;
    }

    // NEW
    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}

// package com.saksham.entity;

// import java.time.LocalDateTime;
// import java.util.UUID;

// import jakarta.persistence.Column;
// import jakarta.persistence.Entity;
// import jakarta.persistence.GeneratedValue;
// import jakarta.persistence.Id;
// import jakarta.persistence.JoinColumn;
// import jakarta.persistence.ManyToOne;

// @Entity
// public class Comment {

// @Id
// @GeneratedValue
// private UUID id;

// @Column(nullable = false, length = 500)
// private String content;

// private LocalDateTime createdAt;

// private boolean isHidden = false;

// @ManyToOne
// @JoinColumn(name = "post_id")
// private Post post;

// public Comment() {}

// // Getters & Setters

// public UUID getId() {
// return id;
// }

// public String getContent() {
// return content;
// }

// public void setContent(String content) {
// this.content = content;
// }

// public LocalDateTime getCreatedAt() {
// return createdAt;
// }

// public void setCreatedAt(LocalDateTime createdAt) {
// this.createdAt = createdAt;
// }

// public boolean isHidden() {
// return isHidden;
// }

// public void setHidden(boolean hidden) {
// isHidden = hidden;
// }

// public Post getPost() {
// return post;
// }

// public void setPost(Post post) {
// this.post = post;
// }
// }