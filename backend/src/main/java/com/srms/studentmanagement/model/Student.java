package com.srms.studentmanagement.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "students", uniqueConstraints = {
    @UniqueConstraint(name = "uk_students_roll_number", columnNames = "roll_number")
})
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Student name is required")
    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    @Column(nullable = false, length = 100)
    private String name;

    @NotBlank(message = "Roll number is required")
    @Pattern(regexp = "^[a-zA-Z0-9-_]+$", message = "Roll number can only contain alphanumeric characters, hyphens, and underscores")
    @Column(name = "roll_number", nullable = false, unique = true, length = 50)
    private String rollNumber;

    @NotBlank(message = "Branch is required")
    @Column(nullable = false, length = 100)
    private String branch;

    @NotNull(message = "Marks are required")
    @DecimalMin(value = "0.0", inclusive = true, message = "Marks must be between 0 and 100")
    @DecimalMax(value = "100.0", inclusive = true, message = "Marks must be between 0 and 100")
    @Column(nullable = false)
    private Double marks;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public Student() {
    }

    public Student(Long id, String name, String rollNumber, String branch, Double marks) {
        this.id = id;
        this.name = name;
        this.rollNumber = rollNumber;
        this.branch = branch;
        this.marks = marks;
    }

    public Student(String name, String rollNumber, String branch, Double marks) {
        this.name = name;
        this.rollNumber = rollNumber;
        this.branch = branch;
        this.marks = marks;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getRollNumber() {
        return rollNumber;
    }

    public void setRollNumber(String rollNumber) {
        this.rollNumber = rollNumber != null ? rollNumber.trim().toUpperCase() : null;
    }

    public String getBranch() {
        return branch;
    }

    public void setBranch(String branch) {
        this.branch = branch;
    }

    public Double getMarks() {
        return marks;
    }

    public void setMarks(Double marks) {
        this.marks = marks;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public String getGrade() {
        if (marks == null) return "N/A";
        if (marks >= 90) return "A+";
        if (marks >= 80) return "A";
        if (marks >= 70) return "B";
        if (marks >= 60) return "C";
        if (marks >= 50) return "D";
        if (marks >= 40) return "E";
        return "F";
    }

    public String getStatus() {
        if (marks == null) return "N/A";
        return marks >= 40 ? "PASS" : "FAIL";
    }
}
