package com.saksham.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.saksham.entity.Post;
import com.saksham.repository.PostRepository;

@Service
public class ForumService {
    private final PostRepository postRepository;

    public ForumService(PostRepository postRepository) {
        this.postRepository = postRepository;
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
        return postRepository.save(post);
    }

    // Get all posts
    public List<Post> getAllPosts() {
    return postRepository.findAll()
            .stream()
            .filter(post -> !post.isHidden())
            .toList();
}
}
