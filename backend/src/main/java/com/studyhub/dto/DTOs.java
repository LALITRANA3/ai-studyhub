package com.studyhub.dto;

import lombok.Data;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

// ===== AUTH DTOs =====

@Data
class LoginRequest {
    @Email @NotBlank
    public String email;
    @NotBlank @Size(min = 6)
    public String password;
}

@Data
class RegisterRequest {
    @NotBlank
    public String name;
    @Email @NotBlank
    public String email;
    @NotBlank @Size(min = 6)
    public String password;
}

@Data
class AuthResponse {
    public String token;
    public UserDTO user;

    public AuthResponse(String token, UserDTO user) {
        this.token = token;
        this.user = user;
    }
}

@Data
class UserDTO {
    public Long id;
    public String name;
    public String email;
    public String role;
    public String avatar;
    public Integer studyStreak;
    public Integer totalMcqsSolved;

    public static UserDTO from(com.studyhub.model.User user) {
        UserDTO dto = new UserDTO();
        dto.id = user.getId();
        dto.name = user.getName();
        dto.email = user.getEmail();
        dto.role = user.getRole();
        dto.avatar = user.getAvatar();
        dto.studyStreak = user.getStudyStreak();
        dto.totalMcqsSolved = user.getTotalMcqsSolved();
        return dto;
    }
}

// ===== AI DTOs =====

@Data
class AIChatRequest {
    public String message;
    public String systemPrompt;
    public java.util.List<java.util.Map<String, String>> history;
}

@Data
class AIChatResponse {
    public String reply;
    public AIChatResponse(String reply) { this.reply = reply; }
}

// ===== NOTE DTOs =====

@Data
class NoteDTO {
    public Long id;
    public String originalName;
    public String fileType;
    public Long fileSize;
    public java.time.LocalDateTime uploadedAt;
}
