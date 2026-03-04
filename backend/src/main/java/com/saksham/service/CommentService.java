package com.saksham.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.saksham.dto.CommentResponse;
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
    public CommentResponse addComment(UUID postId, String content) {

        User user = userService.getCurrentUser();
        System.out.println("CURRENT USER EMAIL: " + user.getEmail());

        if (!user.getRole().name().equals("ROLE_STUDENT")) {
            throw new RuntimeException("Only students can comment");
        }

        if (containsBadWords(content)) {
            throw new RuntimeException("Comment contains inappropriate content");
        }

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        Comment comment = new Comment();
        comment.setContent(content);
        comment.setCreatedAt(LocalDateTime.now());
        comment.setPost(post);
        comment.setUser(user);

        Comment saved = commentRepository.save(comment);

        return CommentResponse.from(saved, user);
    }

    // EDIT COMMENT
    public CommentResponse editComment(UUID commentId, String content) {

        User user = userService.getCurrentUser();
        System.out.println("CURRENT USER EMAIL: " + user.getEmail());

        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        if (!comment.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        comment.setContent(content);

        return CommentResponse.from(commentRepository.save(comment), user);
    }

    // FETCH ONLY NON-HIDDEN COMMENTS
    public List<CommentResponse> getCommentsByPost(UUID postId) {

        User user = userService.getCurrentUser();
        System.out.println("CURRENT USER EMAIL: " + user.getEmail());

        List<Comment> comments = commentRepository.findByPostIdAndIsHiddenFalseOrderByCreatedAtDesc(postId);

        return comments.stream()
                .map(comment -> CommentResponse.from(comment, user))
                .toList();
    }

    public String deleteComment(UUID commentId) {

        User user = userService.getCurrentUser();
        System.out.println("CURRENT USER EMAIL: " + user.getEmail());

        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        // ADMIN
        if (user.getRole().name().equals("ROLE_ADMIN")) {
            commentRepository.delete(comment);
            return "Deleted by admin";
        }

        // OWNER
        if (!comment.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You can only delete your own comment");
        }

        commentRepository.delete(comment);

        return "Deleted successfully";
    }

    public User getCurrentUser() {
        return userService.getCurrentUser();
    }
}