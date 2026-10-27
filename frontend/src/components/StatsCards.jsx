import React from 'react';
import { Users, Award, TrendingUp, CheckCircle, AlertTriangle } from 'lucide-react';

export default function StatsCards({ stats, totalCount }) {
  const count = totalCount !== undefined ? totalCount : (stats?.totalStudents || 0);
  const avg = stats?.averageMarks !== undefined ? Number(stats.averageMarks).toFixed(1) : '0.0';
  const highest = stats?.highestMarks !== undefined ? Number(stats.highestMarks).toFixed(1) : '0.0';
  const passPct = stats?.passPercentage !== undefined ? Number(stats.passPercentage).toFixed(1) : '0.0';
  const passCount = stats?.passCount || 0;
  const failCount = stats?.failCount || 0;

  return (
    <div className="stats-grid">
      {/* Required feature: Total Registered Students */}
      <div className="stat-card stat-primary">
        <div className="stat-header">
          <span className="stat-label">Total Registered Students</span>
          <div className="stat-icon-wrapper bg-indigo-50 text-indigo-600">
            <Users size={22} />
          </div>
        </div>
        <div className="stat-body">
          <div className="stat-number">{count}</div>
          <span className="stat-badge badge-primary">Active Enrolled</span>
        </div>
        <div className="stat-footer text-muted">
          Updated in real-time from database
        </div>
      </div>

      {/* Class Average Marks */}
      <div className="stat-card">
        <div className="stat-header">
          <span className="stat-label">Class Average Marks</span>
          <div className="stat-icon-wrapper bg-blue-50 text-blue-600">
            <TrendingUp size={22} />
          </div>
        </div>
        <div className="stat-body">
          <div className="stat-number">{avg}<span className="stat-unit">/100</span></div>
          <span className="stat-badge badge-info">Performance</span>
        </div>
        <div className="stat-footer text-muted">
          Based on all active assessments
        </div>
      </div>

      {/* Top Marks */}
      <div className="stat-card">
        <div className="stat-header">
          <span className="stat-label">Highest Score</span>
          <div className="stat-icon-wrapper bg-amber-50 text-amber-600">
            <Award size={22} />
          </div>
        </div>
        <div className="stat-body">
          <div className="stat-number">{highest}<span className="stat-unit">/100</span></div>
          <span className="stat-badge badge-warning">Top Mark</span>
        </div>
        <div className="stat-footer text-muted">
          Maximum marks achieved
        </div>
      </div>

      {/* Pass Rate */}
      <div className="stat-card">
        <div className="stat-header">
          <span className="stat-label">Passing Rate</span>
          <div className="stat-icon-wrapper bg-emerald-50 text-emerald-600">
            <CheckCircle size={22} />
          </div>
        </div>
        <div className="stat-body">
          <div className="stat-number">{passPct}<span className="stat-unit">%</span></div>
          <span className="stat-badge badge-success">{passCount} Passed</span>
        </div>
        <div className="stat-footer text-muted">
          {failCount > 0 ? `${failCount} student(s) need attention` : 'All registered students passing'}
        </div>
      </div>
    </div>
  );
}
