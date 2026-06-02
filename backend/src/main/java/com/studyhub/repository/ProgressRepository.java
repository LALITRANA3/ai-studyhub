package com.studyhub.repository;

import com.studyhub.model.Progress;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProgressRepository extends JpaRepository<Progress, Long> {
    List<Progress> findByUserIdOrderByRecordedAtDesc(Long userId);
}
