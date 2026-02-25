package com.saksham.controller;

import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
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
        String content = body.get("content");
        return commentService.addComment(postId, content);
    }

    // EDIT COMMENT
    @PutMapping("/edit/{commentId}")
    public Comment editComment(@PathVariable UUID commentId,
            @RequestBody Map<String, String> body) {

        return commentService.editComment(commentId, body.get("content"));
    }

    // GET COMMENTS
    @GetMapping("/{postId}")
    public List<Comment> getComments(@PathVariable UUID postId) {
        return commentService.getCommentsByPost(postId);
    }

    @DeleteMapping("/delete/{id}")
    public Object deleteComment(@PathVariable UUID id) {
        return commentService.deleteComment(id);
    }
}