package com.studyhub.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AIController {

    @Value("${app.ai.gemini.api-key:}")
    private String geminiApiKey;

    @Value("${app.ai.gemini.url}")
    private String geminiUrl;

    @Value("${app.ai.groq.api-key:}")
    private String groqApiKey;

    @Value("${app.ai.groq.url}")
    private String groqUrl;

    @Value("${app.ai.groq.model:llama3-8b-8192}")
    private String groqModel;

    private final RestTemplate restTemplate = new RestTemplate();

    // ===== GROQ (free, fast) =====
    @PostMapping("/chat/groq")
    public ResponseEntity<?> chatWithGroq(@RequestBody Map<String, Object> body, Authentication auth) {
        String message = (String) body.get("message");
        String systemPrompt = (String) body.getOrDefault("systemPrompt", "You are a helpful CSE tutor.");

        @SuppressWarnings("unchecked")
        List<Map<String, String>> history = (List<Map<String, String>>) body.getOrDefault("history", new ArrayList<>());

        List<Map<String, String>> messages = new ArrayList<>();
        messages.add(Map.of("role", "system", "content", systemPrompt));
        messages.addAll(history);
        messages.add(Map.of("role", "user", "content", message));

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", groqModel);
        requestBody.put("messages", messages);
        requestBody.put("max_tokens", 1000);
        requestBody.put("temperature", 0.7);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(groqApiKey);

        try {
            ResponseEntity<Map> response = restTemplate.exchange(
                    groqUrl,
                    HttpMethod.POST,
                    new HttpEntity<>(requestBody, headers),
                    Map.class
            );
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> choices = (List<Map<String, Object>>) response.getBody().get("choices");
            @SuppressWarnings("unchecked")
            Map<String, String> msgObj = (Map<String, String>) choices.get(0).get("message");
            return ResponseEntity.ok(Map.of("reply", msgObj.get("content")));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "AI service error: " + e.getMessage()));
        }
    }

    // ===== GEMINI (free) =====
    @PostMapping("/chat/gemini")
    public ResponseEntity<?> chatWithGemini(@RequestBody Map<String, Object> body, Authentication auth) {
        String message = (String) body.get("message");
        String systemPrompt = (String) body.getOrDefault("systemPrompt", "You are a helpful CSE tutor.");

        String fullPrompt = systemPrompt + "\n\nUser: " + message;

        Map<String, Object> part = Map.of("text", fullPrompt);
        Map<String, Object> content = Map.of("parts", List.of(part));
        Map<String, Object> requestBody = Map.of("contents", List.of(content));

        String url = geminiUrl + "?key=" + geminiApiKey;
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        try {
            ResponseEntity<Map> response = restTemplate.exchange(
                    url, HttpMethod.POST,
                    new HttpEntity<>(requestBody, headers),
                    Map.class
            );
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> candidates = (List<Map<String, Object>>) response.getBody().get("candidates");
            @SuppressWarnings("unchecked")
            Map<String, Object> contentObj = (Map<String, Object>) candidates.get(0).get("content");
            @SuppressWarnings("unchecked")
            List<Map<String, String>> parts = (List<Map<String, String>>) contentObj.get("parts");
            return ResponseEntity.ok(Map.of("reply", parts.get(0).get("text")));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Gemini API error: " + e.getMessage()));
        }
    }

    // ===== MCQ Generation =====
    @PostMapping("/generate/mcq")
    public ResponseEntity<?> generateMCQ(@RequestBody Map<String, String> body, Authentication auth) {
        String topic = body.getOrDefault("topic", "Data Structures");
        String prompt = String.format(
            "Generate 5 MCQs on '%s' for CSE university exams. Return ONLY JSON array: " +
            "[{\"q\":\"question\",\"opts\":[\"A. opt1\",\"B. opt2\",\"C. opt3\",\"D. opt4\"],\"ans\":0,\"exp\":\"explanation\"},...] " +
            "where ans is the correct option index (0-3).", topic
        );
        return chatWithGroq(Map.of("message", prompt, "systemPrompt", "Return ONLY valid JSON array, no markdown, no text."), auth);
    }

    // ===== Flashcard Generation =====
    @PostMapping("/generate/flashcards")
    public ResponseEntity<?> generateFlashcards(@RequestBody Map<String, String> body, Authentication auth) {
        String topic = body.getOrDefault("topic", "Operating Systems");
        String prompt = String.format(
            "Generate 8 flashcards on '%s' for CSE students. Return ONLY JSON array: " +
            "[{\"front\":\"term or question\",\"back\":\"definition or answer\"},...] Keep answers 2-3 lines max.", topic
        );
        return chatWithGroq(Map.of("message", prompt, "systemPrompt", "Return ONLY valid JSON array, no markdown."), auth);
    }

    // ===== Roadmap Generation =====
    @PostMapping("/generate/roadmap")
    public ResponseEntity<?> generateRoadmap(@RequestBody Map<String, String> body, Authentication auth) {
        String goal = body.getOrDefault("goal", "Full Stack Developer");
        String prompt = String.format(
            "Generate a 6-step learning roadmap for a CSE student wanting to become: '%s'. " +
            "Return ONLY: [{\"title\":\"Step title\",\"desc\":\"2-sentence description\",\"tags\":[\"topic1\",\"topic2\"],\"status\":\"done|current|upcoming\"},...] " +
            "where first 2 are done, 3rd is current, rest upcoming.", goal
        );
        return chatWithGroq(Map.of("message", prompt, "systemPrompt", "Return ONLY valid JSON array, no markdown."), auth);
    }
}
