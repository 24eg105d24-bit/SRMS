package com.srms.studentmanagement.service.impl;

import com.srms.studentmanagement.dto.DashboardStatsDTO;
import com.srms.studentmanagement.dto.StudentRequestDTO;
import com.srms.studentmanagement.exception.DuplicateRollNumberException;
import com.srms.studentmanagement.exception.ResourceNotFoundException;
import com.srms.studentmanagement.model.Student;
import com.srms.studentmanagement.repository.StudentRepository;
import com.srms.studentmanagement.service.StudentService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class StudentServiceImpl implements StudentService {

    private final StudentRepository studentRepository;

    public StudentServiceImpl(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    @Override
    public Student createStudent(StudentRequestDTO request) {
        String rollNumber = request.getRollNumber().trim().toUpperCase();

        if (studentRepository.existsByRollNumberIgnoreCase(rollNumber)) {
            throw new DuplicateRollNumberException("Roll number '" + rollNumber + "' already exists. A roll number should not be duplicated.");
        }

        validateMarks(request.getMarks());

        Student student = new Student();
        student.setName(request.getName().trim());
        student.setRollNumber(rollNumber);
        student.setBranch(request.getBranch().trim());
        student.setMarks(request.getMarks());

        return studentRepository.save(student);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Student> getAllStudents() {
        return studentRepository.findAllByOrderByCreatedAtDesc();
    }

    @Override
    @Transactional(readOnly = true)
    public Student getStudentById(Long id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<Student> searchStudentsByRollNumber(String rollNumber) {
        if (rollNumber == null || rollNumber.trim().isEmpty()) {
            return getAllStudents();
        }
        return studentRepository.findByRollNumberContainingIgnoreCase(rollNumber.trim());
    }

    @Override
    public Student updateStudent(Long id, StudentRequestDTO request) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + id));

        String newRollNumber = request.getRollNumber().trim().toUpperCase();

        // Check if new roll number belongs to another student
        if (studentRepository.existsByRollNumberIgnoreCaseAndIdNot(newRollNumber, id)) {
            throw new DuplicateRollNumberException("Roll number '" + newRollNumber + "' is already assigned to another student.");
        }

        validateMarks(request.getMarks());

        student.setName(request.getName().trim());
        student.setRollNumber(newRollNumber);
        student.setBranch(request.getBranch().trim());
        student.setMarks(request.getMarks());

        return studentRepository.save(student);
    }

    @Override
    public void deleteStudent(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + id));
        studentRepository.delete(student);
    }

    @Override
    @Transactional(readOnly = true)
    public long getTotalStudentCount() {
        return studentRepository.count();
    }

    @Override
    @Transactional(readOnly = true)
    public DashboardStatsDTO getDashboardStats() {
        long total = studentRepository.count();
        if (total == 0) {
            return new DashboardStatsDTO(0, 0.0, 0.0, 0.0, 0, 0, 0.0);
        }

        Double avg = studentRepository.getAverageMarks();
        Double max = studentRepository.getMaxMarks();
        Double min = studentRepository.getMinMarks();
        Long pass = studentRepository.countPassedStudents();

        double average = avg != null ? Math.round(avg * 100.0) / 100.0 : 0.0;
        double highest = max != null ? max : 0.0;
        double lowest = min != null ? min : 0.0;
        long passedCount = pass != null ? pass : 0;
        long failCount = total - passedCount;
        double passPct = Math.round(((double) passedCount / total * 100.0) * 10.0) / 10.0;

        return new DashboardStatsDTO(total, average, highest, lowest, passedCount, failCount, passPct);
    }

    @Override
    public void seedInitialSampleData() {
        if (studentRepository.count() == 0) {
            studentRepository.save(new Student("Sindhu Nori", "24EG105D24", "Computer Science & Engineering", 94.5));
            studentRepository.save(new Student("Rahul Sharma", "24EG105D01", "Information Technology", 82.0));
            studentRepository.save(new Student("Priya Patel", "24EG105D15", "Electronics & Communication", 88.5));
            studentRepository.save(new Student("Ananya Reddy", "24EG105D33", "Artificial Intelligence & ML", 91.0));
            studentRepository.save(new Student("Vikram Verma", "24EG105D42", "Mechanical Engineering", 68.0));
            studentRepository.save(new Student("Sneha Nair", "24EG105D58", "Computer Science & Engineering", 74.0));
        }
    }

    private void validateMarks(Double marks) {
        if (marks == null) {
            throw new IllegalArgumentException("Marks cannot be null.");
        }
        if (marks < 0.0 || marks > 100.0) {
            throw new IllegalArgumentException("Marks must be between 0 and 100. Received: " + marks);
        }
    }
}
