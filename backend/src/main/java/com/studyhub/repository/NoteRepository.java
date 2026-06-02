package com.studyhub.repository;

import com.studyhub.model.Note;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NoteRepository extends JpaRepository<Note, Long> {
    List<Note> findByUserIdOrderByUploadedAtDesc(Long userId);
    void deleteByIdAndUserId(Long id, Long userId);
}
