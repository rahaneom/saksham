package com.saksham.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.saksham.entity.Like;
import com.saksham.entity.Post;
import com.saksham.entity.Report;
import com.saksham.entity.User;
import com.saksham.repository.LikeRepository;
import com.saksham.repository.PostRepository;
import com.saksham.repository.ReportRepository;

@Service
public class ForumService {
    private final PostRepository postRepository;
    private final UserService userService;
    private final LikeRepository likeRepository;
    private final ReportRepository reportRepository;

    public ForumService(PostRepository postRepository,
            UserService userService,
            LikeRepository likeRepository,
            ReportRepository reportRepository) {

        this.postRepository = postRepository;
        this.userService = userService;
        this.likeRepository = likeRepository;
        this.reportRepository = reportRepository;
    }

    private boolean containsBadWords(String content) {
        String[] bannedWords = { "badword1", "badword2", "hate", "abuse" };

        for (String word : bannedWords) {
            if (content.toLowerCase().contains(word)) {
                return true;
            }
        }
        return false;
    }

    // Create Post
    public Post createPost(Post post) {
        if (containsBadWords(post.getContent())) {
            throw new RuntimeException("Post contains inappropriate content");
        }
        post.setCreatedAt(LocalDateTime.now());

        userService.getCurrentUser();
        return postRepository.save(post);
    }

    // Get all posts
    public List<Post> getAllPosts() {
        return postRepository.findAll()
                .stream()
                .filter(post -> !post.isHidden())
                .toList();
    }

    // Like a post
    public Post likePost(UUID postId) {
        User user = userService.getCurrentUser();

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        // Check if already liked
        if (likeRepository.findByUserAndPost(user, post).isPresent()) {
            throw new RuntimeException("You already liked this post");
        }

        // Save like
        Like like = new Like(user, post);
        likeRepository.save(like);

        // Increment count
        post.setLikesCount(post.getLikesCount() + 1);

        return postRepository.save(post);
    }

    // Report a post
    public Post reportPost(UUID postId) {

        User user = userService.getCurrentUser();

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        // Check if already reported
        if (reportRepository.findByUserAndPost(user, post).isPresent()) {
            throw new RuntimeException("You already reported this post");
        }

        // Save report
        Report report = new Report(user, post);
        reportRepository.save(report);

        // Increment count
        post.setReportCount(post.getReportCount() + 1);

        // Auto-hide logic
        if (post.getReportCount() >= 3) {
            post.setHidden(true);
        }

        return postRepository.save(post);
    }
}