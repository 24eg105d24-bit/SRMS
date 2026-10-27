package com.srms.studentmanagement.controller;

import com.srms.studentmanagement.dto.DashboardStatsDTO;
import com.srms.studentmanagement.dto.StudentRequestDTO;
import com.srms.studentmanagement.model.Student;
import com.srms.studentmanagement.service.StudentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/students")
@CrossOrigin(originPatterns = "*", allowCredentials = "true")
public class StudentController {

    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    /**
     * POST /api/students
     * Add a student using name, roll number, branch, and marks
     */
    @PostMapping
    public ResponseEntity<Student> createStudent(@Valid @RequestBody StudentRequestDTO request) {
        Student createdStudent = studentService.createStudent(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdStudent);
    }

    /**
     * GET /api/students
     * Display all saved students in a table (or filter by optional roll number)
     */
    @GetMapping
    public ResponseEntity<List<Student>> getAllStudents(
            @RequestParam(value = "rollNumber", required = false) String rollNumber) {
        if (rollNumber != null && !rollNumber.trim().isEmpty()) {
            return ResponseEntity.ok(studentService.searchStudentsByRollNumber(rollNumber));
        }
        return ResponseEntity.ok(studentService.getAllStudents());
    }

    /**
     * GET /api/students/{id}
     * Retrieve a student by their database ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Student> getStudentById(@PathVariable Long id) {
        Student student = studentService.getStudentById(id);
        return ResponseEntity.ok(student);
    }

    /**
     * GET /api/students/search?rollNumber=...
     * Search option using the student's roll number
     */
    @GetMapping("/search")
    public ResponseEntity<List<Student>> searchByRollNumber(
            @RequestParam("rollNumber") String rollNumber) {
        List<Student> results = studentService.searchStudentsByRollNumber(rollNumber);
        return ResponseEntity.ok(results);
    }

    /**
     * PUT /api/students/{id}
     * Allow student details to be edited
     */
    @PutMapping("/{id}")
    public ResponseEntity<Student> updateStudent(
            @PathVariable Long id,
            @Valid @RequestBody StudentRequestDTO request) {
        Student updatedStudent = studentService.updateStudent(id, request);
        return ResponseEntity.ok(updatedStudent);
    }

    /**
     * DELETE /api/students/{id}
     * Allow a student record to be deleted
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteStudent(@PathVariable Long id) {
        studentService.deleteStudent(id);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Student record deleted successfully with ID: " + id);
        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/students/count
     * Show the total number of students currently registered
     */
    @GetMapping("/count")
    public ResponseEntity<Map<String, Object>> getTotalCount() {
        long count = studentService.getTotalStudentCount();
        Map<String, Object> response = new HashMap<>();
        response.put("totalStudents", count);
        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/students/stats
     * Return comprehensive analytics for trainer dashboard
     */
    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsDTO> getDashboardStats() {
        return ResponseEntity.ok(studentService.getDashboardStats());
    }
}
