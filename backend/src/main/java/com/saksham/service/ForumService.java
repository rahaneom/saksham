package com.saksham.service;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.saksham.dto.CreatePostRequest;
import com.saksham.dto.PostResponse;
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
        User currentUser = userService.getCurrentUser();

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
            boolean liked = likeRepository
                    .findByUserAndPost(currentUser, post)
                    .isPresent();

            String alias = post.getUser() != null
                    ? post.getUser().getAlias()
                    : "Unknown";

            return PostResponse.from(post, alias, liked, currentUser);
        });
    }

    public Page<PostResponse> getMyPosts(int page, int size) {

        User currentUser = userService.getCurrentUser();

        Pageable pageable = PageRequest.of(page, size,
                Sort.by(Sort.Direction.DESC, "createdAt"));

        Page<Post> posts = postRepository.findByUserAndIsHiddenFalse(currentUser, pageable);

        return posts.map(post -> {
            boolean liked = likeRepository
                    .findByUserAndPost(currentUser, post)
                    .isPresent();

            String alias = post.getUser() != null
                    ? post.getUser().getAlias()
                    : "Unknown";

            return PostResponse.from(post, alias, liked, currentUser);
        });
    }

    // Like a post
    public PostResponse likePost(UUID postId) {

        User user = userService.getCurrentUser();

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        var existingLike = likeRepository.findByUserAndPost(user, post);

        boolean liked;

        if (existingLike.isPresent()) {
            likeRepository.delete(existingLike.get());
            liked = false;
        } else {
            likeRepository.save(new Like(user, post));
            liked = true;
        }

        long count = likeRepository.countByPost(post);
        post.setLikesCount((int) count);

        postRepository.save(post);

        String alias = post.getUser() != null
                ? post.getUser().getAlias()
                : "Unknown";

        return PostResponse.from(post, alias, liked, user);
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

    public PostResponse editPost(UUID postId, String content) {

        User user = userService.getCurrentUser();

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        if (!post.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        post.setContent(content);

        Post updated = postRepository.save(post);

        boolean liked = likeRepository.findByUserAndPost(user, post).isPresent();

        String alias = post.getUser() != null
                ? post.getUser().getAlias()
                : "Unknown";

        return PostResponse.from(post, alias, liked, user);
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