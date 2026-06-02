package com.studyhub.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "progress")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class Progress {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String subject;
    private Integer score;
    private Integer mcqsSolved;
    private Integer mcqsCorrect;
    private Integer flashcardsReviewed;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    private LocalDateTime recordedAt;

    @PrePersist
    protected void onCreate() { recordedAt = LocalDateTime.now(); }
}
