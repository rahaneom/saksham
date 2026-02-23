package com.saksham.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.saksham.entity.Comment;
import com.saksham.entity.Post;
import com.saksham.repository.CommentRepository;
import com.saksham.repository.PostRepository;

@Service
public class CommentService {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;

    public CommentService(CommentRepository commentRepository,
            PostRepository postRepository) {
        this.commentRepository = commentRepository;
        this.postRepository = postRepository;
    }

    // same moderation as posts
    private boolean containsBadWords(String content) {
        String[] bannedWords = { "badword1", "badword2", "hate", "abuse" };

        for (String word : bannedWords) {
            if (content.toLowerCase().contains(word)) {
                return true;
            }
        }
        return false;
    }

    // Add comment to a post
    public Comment addComment(UUID postId, String content) {

        if (containsBadWords(content)) {
            throw new RuntimeException("Comment contains inappropriate content");
        }

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        Comment comment = new Comment();
        comment.setContent(content);
        comment.setCreatedAt(LocalDateTime.now());
        comment.setPost(post);

        return commentRepository.save(comment);
    }

    // Get comments for a post (hide flagged)
    public List<Comment> getCommentsByPost(UUID postId) {
        return commentRepository.findByPostId(postId)
                .stream()
                .filter(comment -> !comment.isHidden())
                .toList();
    }
}