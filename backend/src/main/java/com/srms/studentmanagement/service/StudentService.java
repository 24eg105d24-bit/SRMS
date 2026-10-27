package com.srms.studentmanagement.service;

import com.srms.studentmanagement.dto.DashboardStatsDTO;
import com.srms.studentmanagement.dto.StudentRequestDTO;
import com.srms.studentmanagement.model.Student;

import java.util.List;

public interface StudentService {

    Student createStudent(StudentRequestDTO request);

    List<Student> getAllStudents();

    Student getStudentById(Long id);

    List<Student> searchStudentsByRollNumber(String rollNumber);

    Student updateStudent(Long id, StudentRequestDTO request);

    void deleteStudent(Long id);

    long getTotalStudentCount();

    DashboardStatsDTO getDashboardStats();

    void seedInitialSampleData();
}
