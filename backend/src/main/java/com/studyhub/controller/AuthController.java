package com.studyhub.controller;

import com.studyhub.model.User;
import com.studyhub.repository.UserRepository;
import com.studyhub.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authManager;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> body) {
        String name = body.get("name");
        String email = body.get("email");
        String password = body.get("password");

        if (userRepository.existsByEmail(email)) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email already registered"));
        }

        User user = User.builder()
                .name(name)
                .email(email)
                .password(passwordEncoder.encode(password))
                .role("CSE Student")
                .build();
        user = userRepository.save(user);

        String token = jwtUtil.generateToken(email, user.getId());
        return ResponseEntity.ok(Map.of(
                "token", token,
                "user", buildUserMap(user)
        ));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String password = body.get("password");

        try {
            Authentication auth = authManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, password)
            );
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials"));
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String token = jwtUtil.generateToken(email, user.getId());
        return ResponseEntity.ok(Map.of(
                "token", token,
                "user", buildUserMap(user)
        ));
    }

    @GetMapping("/profile")
    public ResponseEntity<?> profile(Authentication auth) {
        User user = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(buildUserMap(user));
    }

    private Map<String, Object> buildUserMap(User user) {
        return Map.of(
                "id", user.getId(),
                "name", user.getName(),
                "email", user.getEmail(),
                "role", user.getRole() != null ? user.getRole() : "CSE Student",
                "avatar", user.getAvatar() != null ? user.getAvatar() : user.getName().substring(0, 2).toUpperCase(),
                "studyStreak", user.getStudyStreak() != null ? user.getStudyStreak() : 0,
                "totalMcqsSolved", user.getTotalMcqsSolved() != null ? user.getTotalMcqsSolved() : 0
        );
    }
}
