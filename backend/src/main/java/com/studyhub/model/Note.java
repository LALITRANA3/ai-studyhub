package com.studyhub.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "notes")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class Note {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fileName;
    private String originalName;
    private String fileType;
    private Long fileSize;
    private String filePath;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(updatable = false)
    private LocalDateTime uploadedAt;

    @PrePersist
    protected void onCreate() { uploadedAt = LocalDateTime.now(); }
}
