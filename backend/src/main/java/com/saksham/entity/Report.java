package com.saksham.entity;

import java.util.UUID;

import jakarta.persistence.*;

@Entity
@Table(name = "reports")
public class Report {

    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne
    private User user;

    @ManyToOne
    private Post post;

    public Report() {
    }

    public Report(User user, Post post) {
        this.user = user;
        this.post = post;
    }

    public UUID getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public Post getPost() {
        return post;
    }
}