package com.saksham.service;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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

        User user = userService.getCurrentUser(); // IMPORTANT

        post.setUser(user); // LINK USER
        post.setCreatedAt(LocalDateTime.now());

        return postRepository.save(post);
    }

    // Get all posts
    public Page<Post> getPosts(int page, int size, String sortBy, String tag) {

        Sort sort;

        // 🔥 SORT LOGIC
        if (sortBy.equalsIgnoreCase("likes")) {
            sort = Sort.by(Sort.Direction.DESC, "likesCount");
        } else if (sortBy.equalsIgnoreCase("reports")) {
            sort = Sort.by(Sort.Direction.DESC, "reportCount");
        } else {
            sort = Sort.by(Sort.Direction.DESC, "createdAt"); // default latest
        }

        Pageable pageable = PageRequest.of(page, size, sort);

        // FILTER + PAGINATION
        if (tag != null) {
            return postRepository.findByTagAndIsHiddenFalse(
                    com.saksham.entity.Tag.valueOf(tag.toUpperCase()),
                    pageable);
        }

        return postRepository.findByIsHiddenFalse(pageable);
    }

    // Like a post
    public Post likePost(UUID postId) {
        User user = userService.getCurrentUser();

        if (!user.getRole().name().equals("ROLE_STUDENT")) {
            throw new RuntimeException("Only students can perform this action");
        }
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
        post.setLikesCount((int) likeRepository.countByPost(post));

        return postRepository.save(post);
    }

    // Report a post
    public Post reportPost(UUID postId) {

        User user = userService.getCurrentUser();

        if (!user.getRole().name().equals("ROLE_STUDENT")) {
            throw new RuntimeException("Only students can perform this action");
        }
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        // Prevent duplicate report
        if (reportRepository.findByUserAndPost(user, post).isPresent()) {
            throw new RuntimeException("You already reported this post");
        }

        // Save report
        Report report = new Report(user, post);
        reportRepository.save(report);

        // Correct count from DB
        long reportCount = reportRepository.countByPost(post);
        post.setReportCount((int) reportCount);

        // Auto-hide
        if (reportCount >= 3) {
            post.setHidden(true);
        }

        return postRepository.save(post);
    }

    public Post editPost(UUID postId, String newContent) {

        User user = userService.getCurrentUser();

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        // Ownership check
        if (post.getUser() == null || !post.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You can only edit your own post");
        }

        if (containsBadWords(newContent)) {
            throw new RuntimeException("Content contains inappropriate words");
        }

        post.setContent(newContent);

        return postRepository.save(post);
    }

    public String deletePost(UUID postId) {

        User user = userService.getCurrentUser();

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        // ADMIN CAN DELETE ANY
        if (user.getRole().name().equals("ROLE_ADMIN")) {
            postRepository.delete(post);
            return "Deleted by admin";
        }

        // OWNER CAN DELETE
        if (post.getUser() == null ||
                !post.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You can only delete your own post");
        }

        postRepository.delete(post);

        return "Post deleted successfully";
    }
}