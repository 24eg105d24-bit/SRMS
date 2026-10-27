package com.srms.studentmanagement.repository;

import com.srms.studentmanagement.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {

    Optional<Student> findByRollNumberIgnoreCase(String rollNumber);

    boolean existsByRollNumberIgnoreCase(String rollNumber);

    boolean existsByRollNumberIgnoreCaseAndIdNot(String rollNumber, Long id);

    List<Student> findByRollNumberContainingIgnoreCase(String rollNumber);

    List<Student> findAllByOrderByCreatedAtDesc();

    @Query("SELECT AVG(s.marks) FROM Student s")
    Double getAverageMarks();

    @Query("SELECT MAX(s.marks) FROM Student s")
    Double getMaxMarks();

    @Query("SELECT MIN(s.marks) FROM Student s")
    Double getMinMarks();

    @Query("SELECT COUNT(s) FROM Student s WHERE s.marks >= 40.0")
    Long countPassedStudents();
}
