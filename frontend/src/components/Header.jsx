import React from 'react';
import { GraduationCap, ShieldCheck, RefreshCw } from 'lucide-react';

export default function Header({ isBackendOnline, onRefresh, loading }) {
  return (
    <header className="header-wrapper">
      <div className="header-container">
        <div className="header-brand">
          <div className="brand-icon-box">
            <GraduationCap size={28} className="brand-icon" />
          </div>
          <div>
            <h1 className="brand-title">Student Record Management System</h1>
            <p className="brand-subtitle">Academic Records & Evaluation Portal for College Trainers & Staff</p>
          </div>
        </div>

        <div className="header-actions">
          <div className={`status-pill ${isBackendOnline ? 'status-online' : 'status-offline'}`}>
            <span className="status-dot"></span>
            <span className="status-text">{isBackendOnline ? 'API Connected' : 'Connecting to API...'}</span>
          </div>

          <button 
            onClick={onRefresh} 
            disabled={loading}
            className="btn-icon-refresh" 
            title="Refresh student records"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>
    </header>
  );
}
