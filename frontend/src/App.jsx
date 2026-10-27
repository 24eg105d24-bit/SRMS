import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Header from './components/Header';
import StatsCards from './components/StatsCards';
import SearchBar from './components/SearchBar';
import StudentTable from './components/StudentTable';
import StudentModal from './components/StudentModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import Toast from './components/Toast';
import { studentService } from './services/studentService';

export default function App() {
  const [students, setStudents] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isBackendOnline, setIsBackendOnline] = useState(true);

  // Search & Filter state
  const [searchRoll, setSearchRoll] = useState('');
  const [submittedSearch, setSubmittedSearch] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [serverErrors, setServerErrors] = useState(null);

  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingStudent, setDeletingStudent] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Toast state
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success', title = '') => {
    setToast({ message, type, title });
  };

  // Load students and stats from backend
  const loadData = useCallback(async (rollQuery = '') => {
    setLoading(true);
    try {
      let data = [];
      if (rollQuery && rollQuery.trim()) {
        data = await studentService.searchByRollNumber(rollQuery.trim());
      } else {
        data = await studentService.getAll();
      }
      setStudents(data);
      setIsBackendOnline(true);

      // Load count and stats
      try {
        const [countVal, statsVal] = await Promise.all([
          studentService.getCount(),
          studentService.getStats(),
        ]);
        setTotalCount(countVal);
        setStats(statsVal);
      } catch (e) {
        // Fallback to local array length if stats endpoint fails
        setTotalCount(data.length);
      }
    } catch (err) {
      console.error('Failed to load data:', err);
      setIsBackendOnline(false);
      showToast(
        'Unable to connect to Spring Boot backend. Please ensure the backend server is running on port 8080.',
        'error',
        'Connection Error'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle Search submit
  const handleSearchSubmit = () => {
    setSubmittedSearch(searchRoll.trim());
    loadData(searchRoll.trim());
  };

  // Handle live search change with debounce-friendly clear
  const handleSearchChange = (val) => {
    setSearchRoll(val);
    if (val.trim() === '' && submittedSearch !== '') {
      setSubmittedSearch('');
      loadData('');
    }
  };

  // Handle Clear search
  const handleClearSearch = () => {
    setSearchRoll('');
    setSubmittedSearch('');
    loadData('');
  };

  // Extract unique branches for dropdown filter
  const branches = useMemo(() => {
    const list = students.map((s) => s.branch).filter(Boolean);
    return Array.from(new Set(list)).sort();
  }, [students]);

  // Filter students by selected branch (client-side addition to backend roll-number search)
  const filteredStudents = useMemo(() => {
    if (!selectedBranch) return students;
    return students.filter((s) => s.branch === selectedBranch);
  }, [students, selectedBranch]);

  // Open Add Student Modal
  const handleOpenAddModal = () => {
    setEditingStudent(null);
    setServerErrors(null);
    setIsModalOpen(true);
  };

  // Open Edit Student Modal
  const handleOpenEditModal = (student) => {
    setEditingStudent(student);
    setServerErrors(null);
    setIsModalOpen(true);
  };

  // Handle Create or Update Student Submit
  const handleFormSubmit = async (formData) => {
    setSubmitting(true);
    setServerErrors(null);
    try {
      if (editingStudent) {
        // Edit existing student
        const updated = await studentService.updateStudent(editingStudent.id, formData);
        showToast(
          `Student "${updated.name}" (Roll No: ${updated.rollNumber}) updated successfully.`,
          'success',
          'Record Updated'
        );
      } else {
        // Add new student
        const created = await studentService.create(formData);
        showToast(
          `Student "${created.name}" (Roll No: ${created.rollNumber}) registered successfully.`,
          'success',
          'Student Registered'
        );
      }

      setIsModalOpen(false);
      setEditingStudent(null);
      await loadData(submittedSearch);
    } catch (err) {
      console.error('Save student error:', err);
      const res = err.response?.data;

      if (res && res.fieldErrors) {
        setServerErrors(res.fieldErrors);
        showToast(res.message || 'Please correct the validation errors in the form.', 'error');
      } else if (res && res.message) {
        setServerErrors({ _general: res.message });
        showToast(res.message, 'error', 'Validation Notice');
      } else {
        const errorMsg = err.message || 'An unexpected error occurred while saving.';
        setServerErrors({ _general: errorMsg });
        showToast(errorMsg, 'error', 'Error');
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Open Delete Confirmation Modal
  const handleOpenDeleteModal = (student) => {
    setDeletingStudent(student);
    setIsDeleteModalOpen(true);
  };

  // Confirm Delete
  const handleConfirmDelete = async (studentId) => {
    setDeleting(true);
    try {
      await studentService.delete(studentId);
      showToast(
        `Student record (Roll No: ${deletingStudent.rollNumber}) deleted successfully.`,
        'success',
        'Record Deleted'
      );
      setIsDeleteModalOpen(false);
      setDeletingStudent(null);
      await loadData(submittedSearch);
    } catch (err) {
      console.error('Delete error:', err);
      const errorMsg = err.response?.data?.message || 'Failed to delete student record.';
      showToast(errorMsg, 'error', 'Delete Failed');
    } finally {
      setDeleting(false);
    }
  };

  // Export records to CSV
  const handleExportCSV = () => {
    if (filteredStudents.length === 0) {
      showToast('No records to export.', 'info');
      return;
    }

    const headers = ['ID', 'Roll Number', 'Name', 'Branch', 'Marks', 'Grade', 'Status'];
    const rows = filteredStudents.map((s) => [
      s.id,
      `"${s.rollNumber}"`,
      `"${s.name}"`,
      `"${s.branch}"`,
      s.marks,
      s.grade || (s.marks >= 90 ? 'A+' : s.marks >= 80 ? 'A' : s.marks >= 70 ? 'B' : s.marks >= 60 ? 'C' : s.marks >= 50 ? 'D' : s.marks >= 40 ? 'E' : 'F'),
      s.marks >= 40 ? 'PASS' : 'FAIL',
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `students_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported students list as CSV.', 'success', 'Export Ready');
  };

  return (
    <div className="app-container">
      {/* Toast Alert */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Main Header */}
      <Header
        isBackendOnline={isBackendOnline}
        onRefresh={() => loadData(submittedSearch)}
        loading={loading}
      />

      <main className="main-content">
        {/* Metric Cards showing Total Registered Students & Analytics */}
        <StatsCards stats={stats} totalCount={totalCount} />

        {/* Search, Filter & Action Bar */}
        <SearchBar
          searchRoll={searchRoll}
          onSearchChange={handleSearchChange}
          onSearchSubmit={handleSearchSubmit}
          onClearSearch={handleClearSearch}
          selectedBranch={selectedBranch}
          onBranchChange={setSelectedBranch}
          branches={branches}
          onOpenAddModal={handleOpenAddModal}
          onExportCSV={handleExportCSV}
          totalResults={filteredStudents.length}
        />

        {/* Students Table */}
        <StudentTable
          students={filteredStudents}
          loading={loading}
          onEdit={handleOpenEditModal}
          onDelete={handleOpenDeleteModal}
          onOpenAddModal={handleOpenAddModal}
          searchQuery={submittedSearch}
        />
      </main>

      {/* Add / Edit Student Modal */}
      <StudentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingStudent}
        isEditMode={!!editingStudent}
        serverErrors={serverErrors}
        submitting={submitting}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        student={deletingStudent}
        deleting={deleting}
      />

      {/* Footer */}
      <footer className="footer-bar">
        <p>
          Student Record Management System (SRMS) &bull; Built with Spring Boot REST API &amp; React.js
        </p>
      </footer>
    </div>
  );
}
