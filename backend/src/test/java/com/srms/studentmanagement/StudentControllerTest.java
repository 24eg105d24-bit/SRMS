package com.srms.studentmanagement;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.srms.studentmanagement.dto.StudentRequestDTO;
import com.srms.studentmanagement.model.Student;
import com.srms.studentmanagement.repository.StudentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class StudentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        studentRepository.deleteAll();
    }

    @Test
    @DisplayName("Should create student successfully with valid details")
    void testCreateStudentSuccess() throws Exception {
        StudentRequestDTO request = new StudentRequestDTO("Alice Smith", "TEST101", "Computer Science", 85.5);

        mockMvc.perform(post("/api/students")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.name").value("Alice Smith"))
                .andExpect(jsonPath("$.rollNumber").value("TEST101"))
                .andExpect(jsonPath("$.branch").value("Computer Science"))
                .andExpect(jsonPath("$.marks").value(85.5))
                .andExpect(jsonPath("$.grade").value("A"))
                .andExpect(jsonPath("$.status").value("PASS"));
    }

    @Test
    @DisplayName("Should reject student creation with duplicate roll number")
    void testDuplicateRollNumberRejection() throws Exception {
        studentRepository.save(new Student("Existing Student", "DUP001", "IT", 75.0));

        StudentRequestDTO duplicateRequest = new StudentRequestDTO("Another Student", "DUP001", "ECE", 90.0);

        mockMvc.perform(post("/api/students")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(duplicateRequest)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.error").value("Conflict"))
                .andExpect(jsonPath("$.message", containsString("already exists")));
    }

    @Test
    @DisplayName("Should reject marks less than 0")
    void testInvalidMarksNegative() throws Exception {
        StudentRequestDTO request = new StudentRequestDTO("Bob", "TEST102", "Civil", -5.0);

        mockMvc.perform(post("/api/students")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fieldErrors.marks").value("Marks must be between 0 and 100"));
    }

    @Test
    @DisplayName("Should reject marks greater than 100")
    void testInvalidMarksOver100() throws Exception {
        StudentRequestDTO request = new StudentRequestDTO("Bob", "TEST103", "Civil", 105.0);

        mockMvc.perform(post("/api/students")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fieldErrors.marks").value("Marks must be between 0 and 100"));
    }

    @Test
    @DisplayName("Should reject empty student name")
    void testEmptyNameValidation() throws Exception {
        StudentRequestDTO request = new StudentRequestDTO("", "TEST104", "Civil", 70.0);

        mockMvc.perform(post("/api/students")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fieldErrors.name").exists());
    }

    @Test
    @DisplayName("Should retrieve all students and calculate total count")
    void testGetAllAndCount() throws Exception {
        studentRepository.save(new Student("Student 1", "R01", "CSE", 80.0));
        studentRepository.save(new Student("Student 2", "R02", "ECE", 90.0));

        mockMvc.perform(get("/api/students"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)));

        mockMvc.perform(get("/api/students/count"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalStudents").value(2));
    }

    @Test
    @DisplayName("Should search student by roll number")
    void testSearchByRollNumber() throws Exception {
        studentRepository.save(new Student("Student 1", "24EG101", "CSE", 80.0));
        studentRepository.save(new Student("Student 2", "24EG202", "ECE", 90.0));

        mockMvc.perform(get("/api/students/search").param("rollNumber", "24EG101"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].rollNumber").value("24EG101"));
    }

    @Test
    @DisplayName("Should update student details")
    void testUpdateStudent() throws Exception {
        Student student = studentRepository.save(new Student("Old Name", "UPD01", "CSE", 60.0));

        StudentRequestDTO updateRequest = new StudentRequestDTO("Updated Name", "UPD01", "CSE", 85.0);

        mockMvc.perform(put("/api/students/" + student.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Updated Name"))
                .andExpect(jsonPath("$.marks").value(85.0));
    }

    @Test
    @DisplayName("Should delete student record")
    void testDeleteStudent() throws Exception {
        Student student = studentRepository.save(new Student("Delete Me", "DEL01", "CSE", 50.0));

        mockMvc.perform(delete("/api/students/" + student.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));

        mockMvc.perform(get("/api/students/" + student.getId()))
                .andExpect(status().isNotFound());
    }
}
