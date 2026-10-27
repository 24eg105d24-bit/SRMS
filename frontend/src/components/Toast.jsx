import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4500);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const isError = toast.type === 'error';
  const isSuccess = toast.type === 'success';

  return (
    <div className={`toast-container animate-slide-in ${isError ? 'toast-error' : isSuccess ? 'toast-success' : 'toast-info'}`}>
      <div className="toast-icon">
        {isError && <AlertCircle size={22} className="text-red-500" />}
        {isSuccess && <CheckCircle2 size={22} className="text-emerald-500" />}
        {!isError && !isSuccess && <Info size={22} className="text-blue-500" />}
      </div>
      <div className="toast-content">
        <div className="toast-title">
          {toast.title || (isError ? 'Validation Error' : 'Success')}
        </div>
        <div className="toast-message">{toast.message}</div>
      </div>
      <button onClick={onClose} className="toast-close" title="Dismiss">
        <X size={16} />
      </button>
    </div>
  );
}
