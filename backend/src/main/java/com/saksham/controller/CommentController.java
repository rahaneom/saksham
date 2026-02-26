package com.saksham.controller;

import java.util.List;
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

import com.saksham.dto.CommentResponse;
import com.saksham.dto.CreateCommentRequest;
import com.saksham.dto.EditCommentRequest;
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
    public Comment addComment(@PathVariable UUID postId,
            @RequestBody @jakarta.validation.Valid CreateCommentRequest request) {

        return commentService.addComment(postId, request.getContent());
    }

    // EDIT COMMENT
    @PutMapping("/edit/{id}")
    public Comment editComment(@PathVariable UUID id,
            @RequestBody @jakarta.validation.Valid EditCommentRequest request) {

        return commentService.editComment(id, request.getContent());
    }

    // GET COMMENTS
    @GetMapping("/{postId}")
    public List<CommentResponse> getComments(@PathVariable UUID postId) {
        return commentService.getCommentsByPost(postId);
    }

    @DeleteMapping("/delete/{id}")
    public Object deleteComment(@PathVariable UUID id) {
        return commentService.deleteComment(id);
    }
}