import React from 'react';
import { Search, X, UserPlus, Filter, Download } from 'lucide-react';

export default function SearchBar({
  searchRoll,
  onSearchChange,
  onSearchSubmit,
  onClearSearch,
  selectedBranch,
  onBranchChange,
  branches,
  onOpenAddModal,
  onExportCSV,
  totalResults,
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearchSubmit();
  };

  return (
    <div className="search-bar-wrapper">
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-input-group">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search by student roll number (e.g. 24EG105D24)..."
            value={searchRoll}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchRoll && (
            <button
              type="button"
              onClick={onClearSearch}
              className="search-clear-btn"
              title="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>
        <button type="submit" className="btn btn-search">
          Search
        </button>
      </form>

      <div className="search-filter-actions">
        {/* Branch Filter */}
        <div className="branch-filter-group">
          <Filter size={16} className="text-muted" />
          <select
            value={selectedBranch}
            onChange={(e) => onBranchChange(e.target.value)}
            className="branch-select"
          >
            <option value="">All Branches ({totalResults})</option>
            {branches.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>

        {/* Export CSV Button */}
        <button
          type="button"
          onClick={onExportCSV}
          className="btn btn-outline"
          title="Export student records to CSV"
        >
          <Download size={16} />
          <span>Export</span>
        </button>

        {/* Add Student CTA */}
        <button
          type="button"
          onClick={onOpenAddModal}
          className="btn btn-primary"
        >
          <UserPlus size={18} />
          <span>Add Student</span>
        </button>
      </div>
    </div>
  );
}
