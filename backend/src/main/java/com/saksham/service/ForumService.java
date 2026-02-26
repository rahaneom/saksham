package com.saksham.service;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.saksham.dto.CreatePostRequest;
import com.saksham.entity.Like;
import com.saksham.entity.Post;
import com.saksham.entity.Report;
import com.saksham.entity.User;
import com.saksham.repository.LikeRepository;
import com.saksham.repository.PostRepository;
import com.saksham.repository.ReportRepository;
import com.saksham.dto.PostResponse;

@Service
public class ForumService {
    private final PostRepository postRepository;
    private final UserService userService;
    private final LikeRepository likeRepository;
    private final ReportRepository reportRepository;
    private final AliasService aliasService;

    public ForumService(PostRepository postRepository,
            UserService userService,
            LikeRepository likeRepository,
            ReportRepository reportRepository,
            AliasService aliasService) {
        this.postRepository = postRepository;
        this.userService = userService;
        this.likeRepository = likeRepository;
        this.reportRepository = reportRepository;
        this.aliasService = aliasService;
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
    public Post createPost(CreatePostRequest request) {

        if (containsBadWords(request.getContent())) {
            throw new RuntimeException("Post contains inappropriate content");
        }

        User user = userService.getCurrentUser();

        Post post = new Post();
        post.setContent(request.getContent());
        post.setTag(request.getTag());
        post.setAnonymous(request.isAnonymous());
        post.setUser(user);
        post.setCreatedAt(LocalDateTime.now());

        return postRepository.save(post);
    }

    // Get all posts
    public Page<PostResponse> getPosts(int page, int size, String sortBy, String tag) {

        Sort sort;

        if (sortBy.equalsIgnoreCase("likes")) {
            sort = Sort.by(Sort.Direction.DESC, "likesCount");
        } else if (sortBy.equalsIgnoreCase("reports")) {
            sort = Sort.by(Sort.Direction.DESC, "reportCount");
        } else {
            sort = Sort.by(Sort.Direction.DESC, "createdAt");
        }

        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Post> postPage;

        if (tag != null) {
            postPage = postRepository.findByTagAndIsHiddenFalse(
                    com.saksham.entity.Tag.valueOf(tag.toUpperCase()),
                    pageable);
        } else {
            postPage = postRepository.findByIsHiddenFalse(pageable);
        }

        // CONVERT PAGE<Post> → PAGE<PostResponse>
        return postPage.map(post -> {
            String alias = aliasService.generateAlias();
            return PostResponse.from(post, alias);
        });
    }

    public Page<PostResponse> getMyPosts(int page, int size) {

        User user = userService.getCurrentUser();

        Pageable pageable = PageRequest.of(page, size,
                Sort.by(Sort.Direction.DESC, "createdAt"));

        Page<Post> posts = postRepository.findByUserAndIsHiddenFalse(user, pageable);

        return posts.map(post -> {
            String alias = aliasService.generateAlias();
            return PostResponse.from(post, alias);
        });
    }

    // Like a post
    public Post likePost(UUID postId) {

        User user = userService.getCurrentUser();

        if (!user.getRole().name().equals("ROLE_STUDENT")) {
            throw new RuntimeException("Only students can perform this action");
        }

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        // CHECK EXISTING LIKE
        var existingLike = likeRepository.findByUserAndPost(user, post);

        if (existingLike.isPresent()) {
            // UNLIKE
            likeRepository.delete(existingLike.get());

        } else {
            // LIKE
            Like like = new Like(user, post);
            likeRepository.save(like);
        }

        // ALWAYS UPDATE COUNT FROM DB
        long count = likeRepository.countByPost(post);
        post.setLikesCount((int) count);

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