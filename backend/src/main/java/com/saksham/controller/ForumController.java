package com.saksham.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.saksham.entity.Post;
import com.saksham.service.ForumService;

@RestController
@RequestMapping("/api/forum")
@CrossOrigin
public class ForumController {

    private final ForumService forumService;

    public ForumController(ForumService forumService) {
        this.forumService = forumService;
    }

    // CREATE POST
    @PostMapping("/create")
    public Object createPost(@RequestBody Post post) {
        try {
            return forumService.createPost(post);
        } catch (RuntimeException e) {
            return java.util.Map.of(
                    "success", false,
                    "message", e.getMessage());
        }
    }

    // GET ALL POSTS
    @GetMapping("/all")
    public List<Post> getAllPosts() {
        return forumService.getAllPosts();
    }

    // LIKE A POST
    @PutMapping("/like/{id}")
    public Post likePost(@PathVariable java.util.UUID id) {
        return forumService.likePost(id);
    }

    // REPORT A POST
    @PutMapping("/report/{id}")
    public Post reportPost(@PathVariable java.util.UUID id) {
        return forumService.reportPost(id);
    }
}