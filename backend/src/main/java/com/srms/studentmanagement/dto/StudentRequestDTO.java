package com.srms.studentmanagement.dto;

import jakarta.validation.constraints.*;

public class StudentRequestDTO {

    @NotBlank(message = "Student name is required")
    @Size(min = 2, max = 100, message = "Student name must be between 2 and 100 characters")
    private String name;

    @NotBlank(message = "Roll number is required")
    @Pattern(regexp = "^[a-zA-Z0-9-_]+$", message = "Roll number can only contain alphanumeric characters, hyphens, and underscores")
    private String rollNumber;

    @NotBlank(message = "Branch is required")
    @Size(min = 2, max = 100, message = "Branch name must be between 2 and 100 characters")
    private String branch;

    @NotNull(message = "Marks are required")
    @DecimalMin(value = "0.0", inclusive = true, message = "Marks must be between 0 and 100")
    @DecimalMax(value = "100.0", inclusive = true, message = "Marks must be between 0 and 100")
    private Double marks;

    public StudentRequestDTO() {
    }

    public StudentRequestDTO(String name, String rollNumber, String branch, Double marks) {
        this.name = name;
        this.rollNumber = rollNumber;
        this.branch = branch;
        this.marks = marks;
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
}
