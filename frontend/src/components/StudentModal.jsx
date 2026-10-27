import React, { useState, useEffect } from 'react';
import { X, User, Hash, BookOpen, Percent, AlertCircle, Save } from 'lucide-react';

const COMMON_BRANCHES = [
  'Computer Science & Engineering',
  'Information Technology',
  'Artificial Intelligence & ML',
  'Data Science',
  'Electronics & Communication',
  'Electrical & Electronics',
  'Mechanical Engineering',
  'Civil Engineering',
  'Other / Custom Branch',
];

export default function StudentModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isEditMode,
  serverErrors,
  submitting,
}) {
  const [formData, setFormData] = useState({
    name: '',
    rollNumber: '',
    branch: '',
    marks: '',
  });

  const [isCustomBranch, setIsCustomBranch] = useState(false);
  const [customBranchText, setCustomBranchText] = useState('');
  const [clientErrors, setClientErrors] = useState({});

  useEffect(() => {
    if (initialData && isEditMode) {
      const isKnownBranch = COMMON_BRANCHES.includes(initialData.branch);
      setFormData({
        name: initialData.name || '',
        rollNumber: initialData.rollNumber || '',
        branch: isKnownBranch ? initialData.branch : 'Other / Custom Branch',
        marks: initialData.marks !== undefined ? String(initialData.marks) : '',
      });
      if (!isKnownBranch && initialData.branch) {
        setIsCustomBranch(true);
        setCustomBranchText(initialData.branch);
      } else {
        setIsCustomBranch(false);
        setCustomBranchText('');
      }
    } else {
      setFormData({
        name: '',
        rollNumber: '',
        branch: 'Computer Science & Engineering',
        marks: '',
      });
      setIsCustomBranch(false);
      setCustomBranchText('');
    }
    setClientErrors({});
  }, [initialData, isEditMode, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errors = {};

    // Validate Name
    if (!formData.name || !formData.name.trim()) {
      errors.name = 'Student name is required.';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters long.';
    }

    // Validate Roll Number
    if (!formData.rollNumber || !formData.rollNumber.trim()) {
      errors.rollNumber = 'Roll number is required.';
    } else if (!/^[a-zA-Z0-9-_]+$/.test(formData.rollNumber.trim())) {
      errors.rollNumber = 'Roll number can only contain letters, numbers, hyphens, and underscores.';
    }

    // Validate Branch
    const activeBranch = isCustomBranch ? customBranchText.trim() : formData.branch.trim();
    if (!activeBranch) {
      errors.branch = 'Branch is required.';
    }

    // Validate Marks: "Marks must be between 0 and 100"
    if (formData.marks === '' || formData.marks === null || formData.marks === undefined) {
      errors.marks = 'Marks are required.';
    } else {
      const numMarks = Number(formData.marks);
      if (isNaN(numMarks)) {
        errors.marks = 'Marks must be a valid number.';
      } else if (numMarks < 0 || numMarks > 100) {
        errors.marks = 'Marks must be between 0 and 100.';
      }
    }

    setClientErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'rollNumber' ? value.toUpperCase().trim() : value,
    }));

    // Clear client-side error on input change
    if (clientErrors[name]) {
      setClientErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleBranchSelectChange = (e) => {
    const val = e.target.value;
    setFormData((prev) => ({ ...prev, branch: val }));
    if (val === 'Other / Custom Branch') {
      setIsCustomBranch(true);
    } else {
      setIsCustomBranch(false);
    }
    if (clientErrors.branch) {
      setClientErrors((prev) => ({ ...prev, branch: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }

    const finalBranch = isCustomBranch ? customBranchText.trim() : formData.branch.trim();
    const payload = {
      name: formData.name.trim(),
      rollNumber: formData.rollNumber.trim().toUpperCase(),
      branch: finalBranch,
      marks: Number(formData.marks),
    };

    onSubmit(payload);
  };

  // Combine client and server errors
  const activeErrors = { ...clientErrors, ...(serverErrors || {}) };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card animate-scale-up" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2 className="modal-title">
              {isEditMode ? 'Edit Student Details' : 'Add New Student'}
            </h2>
            <p className="modal-subtitle">
              {isEditMode
                ? 'Update academic records and marks for this student.'
                : 'Enter student information and marks. Roll number must be unique.'}
            </p>
          </div>
          <button onClick={onClose} className="modal-close-btn" title="Close">
            <X size={20} />
          </button>
        </div>

        {/* Global Server Error Banner */}
        {serverErrors && serverErrors._general && (
          <div className="alert-box alert-error">
            <AlertCircle size={18} />
            <span>{serverErrors._general}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="modal-form" noValidate>
          {/* Student Name */}
          <div className="form-group">
            <label className="form-label" htmlFor="student-name">
              Full Name <span className="text-required">*</span>
            </label>
            <div className={`input-with-icon ${activeErrors.name ? 'input-error' : ''}`}>
              <User size={18} className="input-icon" />
              <input
                id="student-name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Sindhu Nori"
                className="form-control"
                autoFocus
              />
            </div>
            {activeErrors.name && (
              <p className="validation-error-msg">
                <AlertCircle size={14} />
                <span>{activeErrors.name}</span>
              </p>
            )}
          </div>

          {/* Roll Number */}
          <div className="form-group">
            <label className="form-label" htmlFor="student-roll">
              Roll Number <span className="text-required">*</span>
              <span className="label-hint">(Must be unique)</span>
            </label>
            <div className={`input-with-icon ${activeErrors.rollNumber ? 'input-error' : ''}`}>
              <Hash size={18} className="input-icon" />
              <input
                id="student-roll"
                type="text"
                name="rollNumber"
                value={formData.rollNumber}
                onChange={handleChange}
                placeholder="e.g. 24EG105D24"
                className="form-control font-mono uppercase"
              />
            </div>
            {activeErrors.rollNumber && (
              <p className="validation-error-msg">
                <AlertCircle size={14} />
                <span>{activeErrors.rollNumber}</span>
              </p>
            )}
          </div>

          {/* Branch */}
          <div className="form-group">
            <label className="form-label" htmlFor="student-branch">
              Academic Branch <span className="text-required">*</span>
            </label>
            <div className={`input-with-icon ${activeErrors.branch ? 'input-error' : ''}`}>
              <BookOpen size={18} className="input-icon" />
              <select
                id="student-branch"
                value={formData.branch}
                onChange={handleBranchSelectChange}
                className="form-control select-control"
              >
                {COMMON_BRANCHES.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            {isCustomBranch && (
              <div className="mt-2">
                <input
                  type="text"
                  value={customBranchText}
                  onChange={(e) => setCustomBranchText(e.target.value)}
                  placeholder="Enter branch name (e.g. Biotechnology)"
                  className="form-control"
                />
              </div>
            )}

            {activeErrors.branch && (
              <p className="validation-error-msg">
                <AlertCircle size={14} />
                <span>{activeErrors.branch}</span>
              </p>
            )}
          </div>

          {/* Marks */}
          <div className="form-group">
            <label className="form-label" htmlFor="student-marks">
              Marks (Score) <span className="text-required">*</span>
              <span className="label-hint">(Must be between 0 and 100)</span>
            </label>
            <div className={`input-with-icon ${activeErrors.marks ? 'input-error' : ''}`}>
              <Percent size={18} className="input-icon" />
              <input
                id="student-marks"
                type="number"
                name="marks"
                min="0"
                max="100"
                step="0.1"
                value={formData.marks}
                onChange={handleChange}
                placeholder="e.g. 88.5"
                className="form-control font-mono"
              />
            </div>
            {activeErrors.marks && (
              <p className="validation-error-msg">
                <AlertCircle size={14} />
                <span>{activeErrors.marks}</span>
              </p>
            )}
            <span className="input-helper">
              Passing threshold is 40.0 marks.
            </span>
          </div>

          {/* Action buttons */}
          <div className="modal-footer">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary"
            >
              <Save size={18} />
              <span>{submitting ? 'Saving...' : isEditMode ? 'Update Student' : 'Save Student'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
