package com.studyhub;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class StudyHubApplication {
    public static void main(String[] args) {
        SpringApplication.run(StudyHubApplication.class, args);
        System.out.println("\n==========================================");
        System.out.println("  AI StudyHub Backend Started!");
        System.out.println("  API:      http://localhost:8080/api");
        System.out.println("  H2 DB:    http://localhost:8080/h2-console");
        System.out.println("==========================================\n");
    }
}
