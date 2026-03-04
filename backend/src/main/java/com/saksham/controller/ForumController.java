package com.saksham.controller;

import java.util.Map;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.saksham.dto.CreatePostRequest;
import com.saksham.dto.EditPostRequest;
import com.saksham.entity.Post;
import com.saksham.service.ForumService;
import com.saksham.dto.PostResponse;

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
    public Post createPost(@RequestBody @jakarta.validation.Valid CreatePostRequest request) {
        return forumService.createPost(request);
    }

    // GET ALL POSTS
    @GetMapping("/posts")
    public Page<PostResponse> getPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(defaultValue = "latest") String sortBy,
            @RequestParam(required = false) String tag) {

        return forumService.getPosts(page, size, sortBy, tag);
    }

    // GET MY POSTS
    @GetMapping("/my-posts")
    public Page<PostResponse> getMyPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {

        return forumService.getMyPosts(page, size);
    }

    // LIKE A POST
    @PutMapping("/like/{id}")
    public PostResponse likePost(@PathVariable java.util.UUID id) {
        return forumService.likePost(id);
    }

    // REPORT A POST
    @PutMapping("/report/{id}")
    public Post reportPost(@PathVariable java.util.UUID id) {
        return forumService.reportPost(id);
    }

    // EDIT POST
    @PutMapping("/edit/{id}")
    public PostResponse editPost(@PathVariable UUID id,
            @RequestBody @jakarta.validation.Valid EditPostRequest request) {

        return forumService.editPost(id, request.getContent());
    }

    @DeleteMapping("/delete/{id}")
    public Object deletePost(@PathVariable UUID id) {
        return forumService.deletePost(id);
    }
}