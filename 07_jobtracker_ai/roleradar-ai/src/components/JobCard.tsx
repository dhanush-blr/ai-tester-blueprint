// ============================================================
// src/components/JobCard.tsx — RoleRadar AI: Job Entry Card
// Status border accents per LLM.md § STATUS STYLE MAP
// ============================================================


import type { JobEntry, JobStatus } from '../types';

const STATUS_STYLES: Record<JobStatus, { border: string; badge: string; dot: string }> = {
  Wishlist:   { border: 'border-l-amber-500',   badge: 'bg-amber-500/15 text-amber-300 border-amber-500/30',   dot: 'bg-amber-500' },
  Applied:    { border: 'border-l-blue-500',    badge: 'bg-blue-500/15 text-blue-300 border-blue-500/30',     dot: 'bg-blue-500' },
  'Follow-up':{ border: 'border-l-purple-500',  badge: 'bg-purple-500/15 text-purple-300 border-purple-500/30', dot: 'bg-purple-500' },
  Interview:  { border: 'border-l-orange-500',  badge: 'bg-orange-500/15 text-orange-300 border-orange-500/30', dot: 'bg-orange-500' },
  Offer:      { border: 'border-l-emerald-500', badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30', dot: 'bg-emerald-500' },
  Rejected:   { border: 'border-l-rose-500',    badge: 'bg-rose-500/15 text-rose-300 border-rose-500/30',     dot: 'bg-rose-500' },
};

function daysSince(isoDate: string): number {
  const applied = new Date(isoDate);
  const now = new Date();
  return Math.floor((now.getTime() - applied.getTime()) / (1000 * 60 * 60 * 24));
}

function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

interface JobCardProps {
  job: JobEntry;
  onEdit: (job: JobEntry) => void;
  onDelete: (id: number) => void;
  onOpenAI: (job: JobEntry) => void;
  isDragging?: boolean;
}

export function JobCard({ job, onEdit, onDelete, onOpenAI, isDragging }: JobCardProps) {
  const styles = STATUS_STYLES[job.status];
  const daysAgo = daysSince(job.dateApplied);
  const needsFollowUp = job.status === 'Applied' && daysAgo >= 7;

  return (
    <div
      className={`
        group relative bg-slate-900/80 border border-white/5 border-l-4 ${styles.border}
        rounded-xl p-4 flex flex-col gap-3 cursor-grab active:cursor-grabbing
        backdrop-blur-sm transition-all duration-200
        hover:border-white/10 hover:shadow-lg hover:shadow-black/30 hover:-translate-y-0.5
        ${isDragging ? 'opacity-50 rotate-1 scale-95' : ''}
      `}
    >
      {/* Follow-up alert */}
      {needsFollowUp && (
        <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-300 bg-amber-500/10 border border-amber-500/20 rounded-lg px-2.5 py-1.5">
          <span>⚠️</span>
          <span>Follow Up — {daysAgo} days since applied</span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-100 text-sm leading-tight truncate">
            {job.role}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5 font-medium">{job.company}</p>
        </div>

        {/* Action buttons - visible on hover */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 shrink-0">
          <button
            onClick={(e) => { e.stopPropagation(); onOpenAI(job); }}
            title="AI Assistant"
            className="w-7 h-7 flex items-center justify-center rounded-lg bg-indigo-500/20 hover:bg-indigo-500/40 text-indigo-300 text-xs transition-colors"
          >
            🤖
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(job); }}
            title="Edit"
            className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-700/60 hover:bg-slate-600/60 text-slate-300 text-xs transition-colors"
          >
            ✏️
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (job.id !== undefined && window.confirm(`Delete "${job.role}" at ${job.company}?`)) {
                onDelete(job.id);
              }
            }}
            title="Delete"
            className="w-7 h-7 flex items-center justify-center rounded-lg bg-rose-500/10 hover:bg-rose-500/25 text-rose-400 text-xs transition-colors"
          >
            🗑️
          </button>
        </div>
      </div>

      {/* Tech Stack Tags */}
      {job.techStack.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {job.techStack.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 bg-slate-800 text-slate-400 border border-slate-700/60 rounded-md font-mono"
            >
              {tag}
            </span>
          ))}
          {job.techStack.length > 4 && (
            <span className="text-xs px-2 py-0.5 text-slate-500">
              +{job.techStack.length - 4}
            </span>
          )}
        </div>
      )}

      {/* Notes preview */}
      {job.notes && (
        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{job.notes}</p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-1 border-t border-white/5">
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-slate-500">📅</span>
          <span className="text-xs text-slate-500">{formatDate(job.dateApplied)}</span>
        </div>
        <div className="flex items-center gap-2">
          {job.expectedSalary && (
            <span className="text-xs text-emerald-400/80 font-medium">{job.expectedSalary}</span>
          )}
          {job.jobUrl && (
            <a
              href={job.jobUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
              title="View Job Listing"
            >
              🔗
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
