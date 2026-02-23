package com.saksham.controller;

import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.saksham.entity.Comment;
import com.saksham.service.CommentService;

@RestController
@RequestMapping("/api/comments")
@CrossOrigin
public class CommentController {

    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    // ADD COMMENT
    @PostMapping("/add/{postId}")
    public Object addComment(@PathVariable UUID postId,
            @RequestBody Map<String, String> body) {
        try {
            String content = body.get("content");
            return commentService.addComment(postId, content);
        } catch (RuntimeException e) {
            return Map.of(
                    "success", false,
                    "message", e.getMessage());
        }
    }

    // GET COMMENTS FOR A POST
    @GetMapping("/{postId}")
    public List<Comment> getComments(@PathVariable UUID postId) {
        return commentService.getCommentsByPost(postId);
    }
}