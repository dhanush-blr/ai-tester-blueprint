// ============================================================
// src/components/FilterBar.tsx — RoleRadar AI Search & Filter
// ============================================================

import React from 'react';
import type { FilterState, JobStatus } from '../types';

const ALL_STATUSES: JobStatus[] = [
  'Wishlist',
  'Applied',
  'Follow-up',
  'Interview',
  'Offer',
  'Rejected',
];

interface FilterBarProps {
  filter: FilterState;
  onChange: (f: FilterState) => void;
  allTechTags: string[];
  onExport: () => void;
  onImport: (file: File) => void;
  onAddNew: () => void;
}

export function FilterBar({
  filter,
  onChange,
  allTechTags,
  onExport,
  onImport,
  onAddNew,
}: FilterBarProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImport(file);
      e.target.value = '';
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Search */}
      <div className="relative flex-1 min-w-[200px]">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
        <input
          type="text"
          placeholder="Search company or role..."
          value={filter.query}
          onChange={(e) => onChange({ ...filter, query: e.target.value })}
          className="w-full pl-9 pr-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all"
        />
      </div>

      {/* Status Filter */}
      <select
        value={filter.status}
        onChange={(e) => onChange({ ...filter, status: e.target.value as JobStatus | '' })}
        className="px-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-blue-500 transition-all cursor-pointer"
      >
        <option value="">All Statuses</option>
        {ALL_STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      {/* Tech Tag Filter */}
      {allTechTags.length > 0 && (
        <select
          value={filter.techTag}
          onChange={(e) => onChange({ ...filter, techTag: e.target.value })}
          className="px-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-blue-500 transition-all cursor-pointer"
        >
          <option value="">All Tech</option>
          {allTechTags.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      )}

      {/* Clear Filters */}
      {(filter.query || filter.status || filter.techTag) && (
        <button
          onClick={() => onChange({ query: '', status: '', techTag: '' })}
          className="px-3 py-2.5 text-xs text-slate-400 hover:text-slate-200 border border-slate-700 rounded-xl hover:border-slate-500 transition-all"
        >
          ✕ Clear
        </button>
      )}

      <div className="flex-1" />

      {/* Action Buttons */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
        className="hidden"
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        title="Import JSON backup"
        className="px-4 py-2.5 text-sm font-medium text-slate-300 bg-slate-800/80 border border-slate-700 rounded-xl hover:border-slate-500 hover:text-slate-100 transition-all flex items-center gap-2"
      >
        📥 Import
      </button>
      <button
        onClick={onExport}
        title="Export JSON backup"
        className="px-4 py-2.5 text-sm font-medium text-slate-300 bg-slate-800/80 border border-slate-700 rounded-xl hover:border-slate-500 hover:text-slate-100 transition-all flex items-center gap-2"
      >
        📤 Export
      </button>
      <button
        onClick={onAddNew}
        className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:from-blue-500 hover:to-indigo-500 transition-all shadow-lg shadow-blue-900/30 flex items-center gap-2"
      >
        + Add Job
      </button>
    </div>
  );
}
