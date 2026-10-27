import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  student,
  deleting,
}) {
  if (!isOpen || !student) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card modal-confirm animate-scale-up" onClick={(e) => e.stopPropagation()}>
        <div className="confirm-icon-wrapper">
          <AlertTriangle size={32} className="text-red-500" />
        </div>

        <div className="text-center">
          <h3 className="confirm-title">Delete Student Record?</h3>
          <p className="confirm-desc">
            Are you sure you want to delete the record for{' '}
            <strong className="text-gray-900">{student.name}</strong> (Roll No:{' '}
            <span className="font-mono font-semibold text-indigo-600">{student.rollNumber}</span>)?
          </p>
          <div className="confirm-warning-box">
            This action cannot be undone. All marks and data associated with this student will be permanently removed.
          </div>
        </div>

        <div className="confirm-actions">
          <button
            type="button"
            onClick={onClose}
            disabled={deleting}
            className="btn btn-secondary flex-1"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onConfirm(student.id)}
            disabled={deleting}
            className="btn btn-danger flex-1"
          >
            <Trash2 size={16} />
            <span>{deleting ? 'Deleting...' : 'Delete Record'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
