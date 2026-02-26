package com.saksham.service;

import java.util.Random;

import org.springframework.stereotype.Service;

@Service
public class AliasService {

    private static final String[] adjectives = {
            "Calm", "Brave", "Hopeful", "Peaceful", "Gentle",
            "Strong", "Kind", "Bright", "Quiet", "Fearless",
            "Positive", "Radiant", "Balanced", "Focused"
    };

    private static final String[] nouns = {
            "Soul", "Mind", "Spirit", "Heart", "Energy",
            "Light", "Wave", "Journey", "Path", "Horizon",
            "Voice", "Dream", "Aura"
    };

    private final Random random = new Random();

    public String generateAlias() {
        String adjective = adjectives[random.nextInt(adjectives.length)];
        String noun = nouns[random.nextInt(nouns.length)];
        int number = random.nextInt(100); // 0–99

        return adjective + noun + number;
    }
}