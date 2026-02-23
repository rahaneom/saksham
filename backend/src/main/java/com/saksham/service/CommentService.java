package com.saksham.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.saksham.entity.Comment;
import com.saksham.entity.Post;
import com.saksham.entity.User;
import com.saksham.repository.CommentRepository;
import com.saksham.repository.PostRepository;

@Service
public class CommentService {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final UserService userService; // NEW

    public CommentService(CommentRepository commentRepository,
                          PostRepository postRepository,
                          UserService userService) {
        this.commentRepository = commentRepository;
        this.postRepository = postRepository;
        this.userService = userService;
    }

    // Moderation
    private boolean containsBadWords(String content) {
        String[] bannedWords = { "badword1", "badword2", "hate", "abuse" };

        for (String word : bannedWords) {
            if (content.toLowerCase().contains(word)) {
                return true;
            }
        }
        return false;
    }

    // ADD COMMENT WITH USER
    public Comment addComment(UUID postId, String content) {

        if (containsBadWords(content)) {
            throw new RuntimeException("Comment contains inappropriate content");
        }

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        // JWT USER
        User user = userService.getCurrentUser();

        Comment comment = new Comment();
        comment.setContent(content);
        comment.setCreatedAt(LocalDateTime.now());
        comment.setPost(post);
        comment.setUser(user); // IMPORTANT

        return commentRepository.save(comment);
    }

    // FETCH ONLY NON-HIDDEN COMMENTS
    public List<Comment> getCommentsByPost(UUID postId) {
        return commentRepository.findByPostIdAndIsHiddenFalse(postId);
    }
}