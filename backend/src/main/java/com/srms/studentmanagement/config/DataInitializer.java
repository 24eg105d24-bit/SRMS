package com.srms.studentmanagement.config;

import com.srms.studentmanagement.service.StudentService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final StudentService studentService;

    public DataInitializer(StudentService studentService) {
        this.studentService = studentService;
    }

    @Override
    public void run(String... args) {
        studentService.seedInitialSampleData();
    }
}
