// ============================================================
// src/App.tsx — RoleRadar AI: Root Application
// State management, data flow, modal, AI, backup/restore
// ============================================================

import { useState, useEffect, useCallback, useMemo } from 'react';
import type { JobEntry, JobStatus, FilterState, ModalState } from './types';
import {
  getAllJobs,
  addJob,
  updateJob,
  updateJobStatus,
  deleteJob,
  exportAllJobs,
  importJobs,
} from './db/db';
import { DashboardMetrics } from './components/DashboardMetrics';
import { FilterBar } from './components/FilterBar';
import { KanbanBoard } from './components/KanbanBoard';
import { JobModal } from './components/JobModal';
import { AIAssistant } from './components/AIAssistant';

// ---- Toast System ----
type ToastType = 'success' | 'error' | 'info';
interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

let _toastId = 0;

function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = ++_toastId;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  return { toasts, showToast };
}

function ToastContainer({ toasts }: { toasts: Toast[] }) {
  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast-${t.type}`}>
          {t.type === 'success' && '✅ '}
          {t.type === 'error' && '❌ '}
          {t.type === 'info' && 'ℹ️ '}
          {t.message}
        </div>
      ))}
    </div>
  );
}

// ---- App ----
export default function App() {
  const [jobs, setJobs] = useState<JobEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<FilterState>({ query: '', status: '', techTag: '' });
  const [modal, setModal] = useState<ModalState>({ isOpen: false, mode: 'create', job: null });
  const [aiJob, setAiJob] = useState<JobEntry | null>(null);
  const { toasts, showToast } = useToast();

  // ---- Load all jobs from IndexedDB on mount ----
  const loadJobs = useCallback(async () => {
    try {
      const all = await getAllJobs();
      setJobs(all);
    } catch (err) {
      console.error('Failed to load jobs:', err);
      showToast('Failed to load jobs from local storage', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  // ---- Filtered Jobs ----
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const q = filter.query.toLowerCase();
      const matchesQuery =
        !q ||
        job.company.toLowerCase().includes(q) ||
        job.role.toLowerCase().includes(q);

      const matchesStatus = !filter.status || job.status === filter.status;

      const matchesTech =
        !filter.techTag ||
        job.techStack.some((t) => t.toLowerCase() === filter.techTag.toLowerCase());

      return matchesQuery && matchesStatus && matchesTech;
    });
  }, [jobs, filter]);

  // ---- All unique tech tags (for filter dropdown) ----
  const allTechTags = useMemo(() => {
    const tags = new Set<string>();
    jobs.forEach((j) => j.techStack.forEach((t) => tags.add(t)));
    return Array.from(tags).sort();
  }, [jobs]);

  // ---- Modal Handlers ----
  const openCreateModal = () => {
    setModal({ isOpen: true, mode: 'create', job: null });
  };

  const openEditModal = (job: JobEntry) => {
    setModal({ isOpen: true, mode: 'edit', job });
  };

  const closeModal = () => {
    setModal((prev) => ({ ...prev, isOpen: false }));
  };

  // ---- Save Handler (Create + Edit) ----
  const handleSave = async (
    data: Omit<JobEntry, 'id' | 'createdAt' | 'updatedAt'>,
    id?: number
  ) => {
    const now = new Date().toISOString();
    try {
      if (id !== undefined) {
        // Edit mode
        const existing = jobs.find((j) => j.id === id);
        if (!existing) return;
        await updateJob({ ...existing, ...data, id, updatedAt: now });
        showToast(`Updated "${data.role}" at ${data.company}`, 'success');
      } else {
        // Create mode — supply createdAt/updatedAt so addJob gets full shape
        await addJob({ ...data, createdAt: now, updatedAt: now });
        showToast(`Added "${data.role}" at ${data.company}`, 'success');
      }
      await loadJobs();
      closeModal();
    } catch (err) {
      console.error('Save failed:', err);
      showToast('Failed to save job. Please try again.', 'error');
    }
  };

  // ---- Delete Handler ----
  const handleDelete = async (id: number) => {
    try {
      await deleteJob(id);
      showToast('Job entry deleted', 'info');
      await loadJobs();
    } catch (err) {
      console.error('Delete failed:', err);
      showToast('Failed to delete job', 'error');
    }
  };

  // ---- Drag-and-Drop Status Change ----
  const handleStatusChange = async (id: number, newStatus: JobStatus) => {
    try {
      await updateJobStatus(id, newStatus);
      // Optimistic UI update
      setJobs((prev) =>
        prev.map((j) =>
          j.id === id ? { ...j, status: newStatus, updatedAt: new Date().toISOString() } : j
        )
      );
      showToast(`Moved to ${newStatus}`, 'info');
    } catch (err) {
      console.error('Status update failed:', err);
      showToast('Failed to update status', 'error');
      await loadJobs(); // Revert on failure
    }
  };

  // ---- Export ----
  const handleExport = async () => {
    try {
      await exportAllJobs();
      showToast(`Exported ${jobs.length} job entries`, 'success');
    } catch (err) {
      console.error('Export failed:', err);
      showToast('Export failed', 'error');
    }
  };

  // ---- Import ----
  const handleImport = async (file: File) => {
    try {
      showToast('Importing...', 'info');
      const { imported, errors } = await importJobs(file);
      await loadJobs();
      if (errors.length > 0) {
        showToast(`Imported ${imported} jobs (${errors.length} skipped)`, 'info');
      } else {
        showToast(`Successfully imported ${imported} job entries`, 'success');
      }
    } catch (err) {
      console.error('Import failed:', err);
      showToast('Import failed — invalid file format', 'error');
    }
  };

  // ---- Loading Screen ----
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
          <p className="text-slate-400 text-sm">Loading RoleRadar AI...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* ---- Ambient Background ---- */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/5 rounded-full blur-3xl" />
      </div>

      <div className="relative flex flex-col h-screen overflow-hidden">
        {/* ---- App Header ---- */}
        <header className="shrink-0 px-6 pt-5 pb-4 border-b border-white/5 bg-slate-950/80 backdrop-blur-sm">
          <div className="max-w-screen-2xl mx-auto flex items-center justify-between gap-6">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-lg shadow-lg shadow-blue-900/30">
                📡
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-100 leading-tight">
                  RoleRadar
                  <span className="ml-1.5 text-xs font-semibold px-2 py-0.5 bg-indigo-500/20 text-indigo-400 rounded-full border border-indigo-500/30">
                    AI
                  </span>
                </h1>
                <p className="text-xs text-slate-500 leading-tight">Local-first Job Command Center</p>
              </div>
            </div>

            {/* Stats pill */}
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-900/60 border border-white/5 rounded-full text-xs text-slate-500">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>{jobs.length} jobs tracked</span>
              <span className="text-slate-700">·</span>
              <span>100% local</span>
              <span className="text-slate-700">·</span>
              <span>🔒 Private</span>
            </div>
          </div>
        </header>

        {/* ---- Scrollable Content ---- */}
        <main className="flex-1 overflow-y-auto px-6 py-5">
          <div className="max-w-screen-2xl mx-auto flex flex-col gap-6">
            {/* Dashboard Metrics */}
            <section className="animate-fade-in">
              <DashboardMetrics jobs={jobs} />
            </section>

            {/* Filter Bar */}
            <section className="animate-fade-in">
              <FilterBar
                filter={filter}
                onChange={setFilter}
                allTechTags={allTechTags}
                onExport={handleExport}
                onImport={handleImport}
                onAddNew={openCreateModal}
              />
            </section>

            {/* Kanban Board */}
            <section className="animate-fade-in flex-1">
              {filteredJobs.length === 0 && jobs.length > 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
                  <span className="text-4xl">🔍</span>
                  <p className="text-slate-400 font-medium">No jobs match your filters</p>
                  <button
                    onClick={() => setFilter({ query: '', status: '', techTag: '' })}
                    className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Clear all filters
                  </button>
                </div>
              ) : jobs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
                  <span className="text-5xl">🚀</span>
                  <div>
                    <p className="text-slate-300 font-semibold text-lg">Ready to track your hunt</p>
                    <p className="text-slate-500 text-sm mt-1">
                      Add your first job application to get started
                    </p>
                  </div>
                  <button
                    onClick={openCreateModal}
                    className="px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:from-blue-500 hover:to-indigo-500 transition-all shadow-lg shadow-blue-900/30"
                  >
                    + Add First Job
                  </button>
                </div>
              ) : (
                <KanbanBoard
                  jobs={filteredJobs}
                  onStatusChange={handleStatusChange}
                  onEdit={openEditModal}
                  onDelete={handleDelete}
                  onOpenAI={(job) => setAiJob(job)}
                />
              )}
            </section>
          </div>
        </main>
      </div>

      {/* ---- Modals ---- */}
      <JobModal
        isOpen={modal.isOpen}
        job={modal.job}
        onClose={closeModal}
        onSave={handleSave}
      />

      {aiJob && (
        <AIAssistant
          job={aiJob}
          onClose={() => setAiJob(null)}
          onUpdateJob={async (updatedJob) => {
            // AI panel saved a JD inline — persist and refresh
            await loadJobs();
            setAiJob(updatedJob); // keep panel open with updated job
          }}
        />
      )}

      {/* ---- Toast Notifications ---- */}
      <ToastContainer toasts={toasts} />
    </div>
  );
}
