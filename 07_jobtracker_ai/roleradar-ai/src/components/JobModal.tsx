// ============================================================
// src/components/JobModal.tsx — RoleRadar AI: Create/Edit Modal
// Full form validation, controlled inputs, TypeScript-safe
// ============================================================

import React, { useState, useEffect } from 'react';
import type { JobEntry, JobStatus } from '../types';

const ALL_STATUSES: JobStatus[] = [
  'Wishlist',
  'Applied',
  'Follow-up',
  'Interview',
  'Offer',
  'Rejected',
];

const EMPTY_FORM: Omit<JobEntry, 'id' | 'createdAt' | 'updatedAt'> = {
  company: '',
  role: '',
  jobUrl: '',
  resumeUsed: '',
  dateApplied: new Date().toISOString().slice(0, 16),
  expectedSalary: '',
  status: 'Wishlist',
  techStack: [],
  jobDescription: '',
  notes: '',
};

type FormData = Omit<JobEntry, 'id' | 'createdAt' | 'updatedAt'>;

interface FormErrors {
  company?: string;
  role?: string;
}

interface JobModalProps {
  isOpen: boolean;
  job: JobEntry | null;          // null = create mode
  onClose: () => void;
  onSave: (data: Omit<JobEntry, 'id' | 'createdAt' | 'updatedAt'>, id?: number) => void;
}

export function JobModal({ isOpen, job, onClose, onSave }: JobModalProps) {
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [techInput, setTechInput] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});

  // Populate form when editing
  useEffect(() => {
    if (job) {
      setForm({
        company: job.company,
        role: job.role,
        jobUrl: job.jobUrl,
        resumeUsed: job.resumeUsed,
        dateApplied: job.dateApplied.slice(0, 16),
        expectedSalary: job.expectedSalary,
        status: job.status,
        techStack: [...job.techStack],
        jobDescription: job.jobDescription,
        notes: job.notes,
      });
      setTechInput(job.techStack.join(', '));
    } else {
      setForm({ ...EMPTY_FORM, dateApplied: new Date().toISOString().slice(0, 16) });
      setTechInput('');
    }
    setErrors({});
  }, [job, isOpen]);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!form.company.trim()) newErrors.company = 'Company name is required';
    if (!form.role.trim()) newErrors.role = 'Role is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // Parse tech stack from input
    const techStack = techInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    onSave({ ...form, techStack }, job?.id);
  };

  const set = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (key === 'company' || key === 'role') {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  };

  if (!isOpen) return null;

  const isEdit = job !== null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-slate-700/50 rounded-2xl shadow-2xl shadow-black/50">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-slate-900/95 border-b border-slate-800 backdrop-blur-sm">
          <div>
            <h2 className="text-lg font-bold text-slate-100">
              {isEdit ? '✏️ Edit Job Entry' : '+ Add New Job'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {isEdit ? `Editing: ${job?.role} at ${job?.company}` : 'Track a new job application'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-5">
          {/* Row 1: Company + Role */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                Company <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={form.company}
                onChange={(e) => set('company', e.target.value)}
                placeholder="e.g., Google, Flipkart"
                className={`w-full px-3 py-2.5 bg-slate-800 border rounded-xl text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 transition-all ${
                  errors.company
                    ? 'border-rose-500 focus:ring-rose-500/50'
                    : 'border-slate-700 focus:border-blue-500 focus:ring-blue-500/30'
                }`}
              />
              {errors.company && (
                <p className="text-xs text-rose-400 mt-1">{errors.company}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                Role <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={form.role}
                onChange={(e) => set('role', e.target.value)}
                placeholder="e.g., Senior SDE-2, QA Lead"
                className={`w-full px-3 py-2.5 bg-slate-800 border rounded-xl text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 transition-all ${
                  errors.role
                    ? 'border-rose-500 focus:ring-rose-500/50'
                    : 'border-slate-700 focus:border-blue-500 focus:ring-blue-500/30'
                }`}
              />
              {errors.role && (
                <p className="text-xs text-rose-400 mt-1">{errors.role}</p>
              )}
            </div>
          </div>

          {/* Row 2: Status + Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Status</label>
              <select
                value={form.status}
                onChange={(e) => set('status', e.target.value as JobStatus)}
                className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-blue-500 transition-all cursor-pointer"
              >
                {ALL_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Date Applied</label>
              <input
                type="datetime-local"
                value={form.dateApplied}
                onChange={(e) => set('dateApplied', e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          {/* Row 3: Salary + Resume */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                Expected Salary
              </label>
              <input
                type="text"
                value={form.expectedSalary}
                onChange={(e) => set('expectedSalary', e.target.value)}
                placeholder="e.g., ₹25-30 LPA, $120k"
                className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                Resume Used
              </label>
              <input
                type="text"
                value={form.resumeUsed}
                onChange={(e) => set('resumeUsed', e.target.value)}
                placeholder="e.g., Automation_Lead_v2"
                className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          {/* Job URL */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">Job URL</label>
            <input
              type="url"
              value={form.jobUrl}
              onChange={(e) => set('jobUrl', e.target.value)}
              placeholder="https://..."
              className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-all"
            />
          </div>

          {/* Tech Stack */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">
              Tech Stack{' '}
              <span className="font-normal text-slate-600">(comma-separated)</span>
            </label>
            <input
              type="text"
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              placeholder="React, TypeScript, Node.js, AWS"
              className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-all font-mono"
            />
            {/* Tag preview */}
            {techInput && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {techInput
                  .split(',')
                  .map((t) => t.trim())
                  .filter(Boolean)
                  .map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-0.5 bg-slate-700 text-slate-300 rounded-md font-mono"
                    >
                      {tag}
                    </span>
                  ))}
              </div>
            )}
          </div>

          {/* Job Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">
              Job Description{' '}
              <span className="font-normal text-slate-600">(used by AI assistant)</span>
            </label>
            <textarea
              value={form.jobDescription}
              onChange={(e) => set('jobDescription', e.target.value)}
              placeholder="Paste the full job description here for AI-powered skill extraction and interview prep..."
              rows={5}
              className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-all resize-y"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">
              Personal Notes
            </label>
            <textarea
              value={form.notes}
              onChange={(e) => set('notes', e.target.value)}
              placeholder="Recruiter contact, referral source, interview feedback..."
              rows={3}
              className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-all resize-y"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm text-slate-400 hover:text-slate-200 border border-slate-700 hover:border-slate-500 rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl transition-all shadow-lg shadow-blue-900/30"
            >
              {isEdit ? 'Save Changes' : 'Add Job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
