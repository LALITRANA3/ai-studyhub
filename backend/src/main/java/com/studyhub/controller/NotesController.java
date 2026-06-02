package com.studyhub.controller;

import com.studyhub.model.Note;
import com.studyhub.model.User;
import com.studyhub.repository.NoteRepository;
import com.studyhub.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.*;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/notes")
@RequiredArgsConstructor
public class NotesController {

    private final NoteRepository noteRepository;
    private final UserRepository userRepository;

    @Value("${app.upload.dir:uploads/}")
    private String uploadDir;

    @PostMapping("/upload")
    public ResponseEntity<?> upload(@RequestParam("file") MultipartFile file, Authentication auth) throws IOException {
        User user = getUser(auth);
        if (user == null) return ResponseEntity.status(401).body("Unauthorized");

        // Create upload directory
        Path uploadPath = Paths.get(uploadDir + user.getId());
        Files.createDirectories(uploadPath);

        // Save file
        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        Path filePath = uploadPath.resolve(fileName);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        Note note = Note.builder()
                .fileName(fileName)
                .originalName(file.getOriginalFilename())
                .fileType(file.getContentType())
                .fileSize(file.getSize())
                .filePath(filePath.toString())
                .user(user)
                .build();
        note = noteRepository.save(note);

        return ResponseEntity.ok(noteToMap(note));
    }

    @GetMapping
    public ResponseEntity<?> getAllNotes(Authentication auth) {
        User user = getUser(auth);
        if (user == null) return ResponseEntity.status(401).body("Unauthorized");

        List<Map<String, Object>> notes = noteRepository.findByUserIdOrderByUploadedAtDesc(user.getId())
                .stream().map(this::noteToMap).collect(Collectors.toList());
        return ResponseEntity.ok(notes);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteNote(@PathVariable Long id, Authentication auth) {
        User user = getUser(auth);
        if (user == null) return ResponseEntity.status(401).body("Unauthorized");
        noteRepository.deleteByIdAndUserId(id, user.getId());
        return ResponseEntity.ok(Map.of("message", "Note deleted"));
    }

    private User getUser(Authentication auth) {
        return userRepository.findByEmail(auth.getName()).orElse(null);
    }

    private Map<String, Object> noteToMap(Note note) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", note.getId());
        map.put("originalName", note.getOriginalName());
        map.put("fileType", note.getFileType());
        map.put("fileSize", note.getFileSize());
        map.put("uploadedAt", note.getUploadedAt());
        return map;
    }
}
