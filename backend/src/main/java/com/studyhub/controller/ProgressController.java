package com.studyhub.controller;

import com.studyhub.model.Progress;
import com.studyhub.model.User;
import com.studyhub.repository.UserRepository;
import com.studyhub.repository.ProgressRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/progress")
@RequiredArgsConstructor
public class ProgressController {

    private final ProgressRepository progressRepository;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<?> getProgress(Authentication auth) {
        User user = userRepository.findByEmail(auth.getName()).orElseThrow();
        List<Progress> records = progressRepository.findByUserIdOrderByRecordedAtDesc(user.getId());
        List<Map<String, Object>> result = records.stream().map(p -> {
            Map<String, Object> m = new HashMap<>();
            m.put("id", p.getId());
            m.put("subject", p.getSubject());
            m.put("score", p.getScore());
            m.put("mcqsSolved", p.getMcqsSolved());
            m.put("mcqsCorrect", p.getMcqsCorrect());
            m.put("flashcardsReviewed", p.getFlashcardsReviewed());
            m.put("recordedAt", p.getRecordedAt());
            return m;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(result);
    }

    @PostMapping
    public ResponseEntity<?> saveProgress(@RequestBody Map<String, Object> body, Authentication auth) {
        User user = userRepository.findByEmail(auth.getName()).orElseThrow();
        Progress progress = Progress.builder()
                .subject((String) body.get("subject"))
                .score((Integer) body.get("score"))
                .mcqsSolved((Integer) body.getOrDefault("mcqsSolved", 0))
                .mcqsCorrect((Integer) body.getOrDefault("mcqsCorrect", 0))
                .flashcardsReviewed((Integer) body.getOrDefault("flashcardsReviewed", 0))
                .user(user)
                .build();
        progressRepository.save(progress);
        return ResponseEntity.ok(Map.of("message", "Progress saved!"));
    }
}
