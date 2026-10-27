import React, { useState } from 'react';
import { Edit2, Trash2, ArrowUpDown, ChevronUp, ChevronDown, User, AlertCircle, Sparkles } from 'lucide-react';

export default function StudentTable({
  students,
  loading,
  onEdit,
  onDelete,
  onOpenAddModal,
  searchQuery,
}) {
  const [sortField, setSortField] = useState('name');
  const [sortAsc, setSortAsc] = useState(true);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const sortedStudents = [...students].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];

    if (typeof aVal === 'string') {
      aVal = aVal.toLowerCase();
      bVal = (bVal || '').toLowerCase();
    }

    if (aVal < bVal) return sortAsc ? -1 : 1;
    if (aVal > bVal) return sortAsc ? 1 : -1;
    return 0;
  });

  const getMarksProgressColor = (marks) => {
    if (marks >= 80) return 'progress-emerald';
    if (marks >= 60) return 'progress-blue';
    if (marks >= 40) return 'progress-amber';
    return 'progress-rose';
  };

  const getGradeBadge = (marks) => {
    if (marks >= 90) return { label: 'A+', bg: 'badge-grade-aplus' };
    if (marks >= 80) return { label: 'A', bg: 'badge-grade-a' };
    if (marks >= 70) return { label: 'B', bg: 'badge-grade-b' };
    if (marks >= 60) return { label: 'C', bg: 'badge-grade-c' };
    if (marks >= 50) return { label: 'D', bg: 'badge-grade-d' };
    if (marks >= 40) return { label: 'E', bg: 'badge-grade-e' };
    return { label: 'F', bg: 'badge-grade-f' };
  };

  const getAvatarInitials = (name) => {
    if (!name) return 'S';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  if (loading) {
    return (
      <div className="table-card">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading student records from server...</p>
        </div>
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <div className="table-card">
        <div className="empty-state">
          <div className="empty-icon-box">
            <AlertCircle size={36} className="text-muted" />
          </div>
          <h3 className="empty-title">
            {searchQuery ? 'No matching students found' : 'No student records yet'}
          </h3>
          <p className="empty-description">
            {searchQuery
              ? `No student found with roll number "${searchQuery}". Try a different roll number or clear your search.`
              : 'Get started by registering your first student into the system.'}
          </p>
          {!searchQuery && (
            <button
              onClick={onOpenAddModal}
              className="btn btn-primary mt-3"
            >
              <Sparkles size={16} />
              <span>Add First Student</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="table-card">
      <div className="table-header-meta">
        <div>
          <h3 className="table-title">Registered Students List</h3>
          <p className="table-subtitle">
            Showing {sortedStudents.length} {sortedStudents.length === 1 ? 'record' : 'records'}
          </p>
        </div>
      </div>

      <div className="table-responsive">
        <table className="student-table">
          <thead>
            <tr>
              <th className="th-index">#</th>
              <th className="th-sortable" onClick={() => handleSort('rollNumber')}>
                <div className="th-content">
                  <span>Roll Number</span>
                  {sortField === 'rollNumber' ? (
                    sortAsc ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                  ) : (
                    <ArrowUpDown size={14} className="th-sort-icon" />
                  )}
                </div>
              </th>
              <th className="th-sortable" onClick={() => handleSort('name')}>
                <div className="th-content">
                  <span>Student Name</span>
                  {sortField === 'name' ? (
                    sortAsc ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                  ) : (
                    <ArrowUpDown size={14} className="th-sort-icon" />
                  )}
                </div>
              </th>
              <th className="th-sortable" onClick={() => handleSort('branch')}>
                <div className="th-content">
                  <span>Branch</span>
                  {sortField === 'branch' ? (
                    sortAsc ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                  ) : (
                    <ArrowUpDown size={14} className="th-sort-icon" />
                  )}
                </div>
              </th>
              <th className="th-sortable" onClick={() => handleSort('marks')}>
                <div className="th-content">
                  <span>Marks (out of 100)</span>
                  {sortField === 'marks' ? (
                    sortAsc ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                  ) : (
                    <ArrowUpDown size={14} className="th-sort-icon" />
                  )}
                </div>
              </th>
              <th>Grade</th>
              <th>Status</th>
              <th className="th-actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedStudents.map((student, idx) => {
              const gradeInfo = getGradeBadge(student.marks);
              const isPass = student.marks >= 40;

              return (
                <tr key={student.id} className="table-row">
                  <td className="td-index">{idx + 1}</td>
                  <td className="td-roll">
                    <span className="badge-roll">{student.rollNumber}</span>
                  </td>
                  <td className="td-student">
                    <div className="student-name-box">
                      <div className="student-avatar">
                        {getAvatarInitials(student.name)}
                      </div>
                      <div className="student-info">
                        <span className="student-name">{student.name}</span>
                        <span className="student-id">ID: #{student.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="td-branch">
                    <span className="branch-tag">{student.branch}</span>
                  </td>
                  <td className="td-marks">
                    <div className="marks-wrapper">
                      <div className="marks-value">
                        <span className="marks-score">{student.marks}</span>
                        <span className="marks-max">/ 100</span>
                      </div>
                      <div className="progress-bar-bg">
                        <div
                          className={`progress-bar-fill ${getMarksProgressColor(student.marks)}`}
                          style={{ width: `${Math.min(Math.max(student.marks, 0), 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`badge-grade ${gradeInfo.bg}`}>
                      {student.grade || gradeInfo.label}
                    </span>
                  </td>
                  <td>
                    <span className={`badge-status ${isPass ? 'badge-pass' : 'badge-fail'}`}>
                      {isPass ? 'PASS' : 'FAIL'}
                    </span>
                  </td>
                  <td className="td-actions">
                    <div className="action-buttons">
                      <button
                        onClick={() => onEdit(student)}
                        className="btn-action btn-edit"
                        title={`Edit ${student.name}'s details`}
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => onDelete(student)}
                        className="btn-action btn-delete"
                        title={`Delete ${student.name}'s record`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
