// ============================================================
// src/components/KanbanColumn.tsx — RoleRadar AI: Board Column
// useDroppable from @dnd-kit/core for drop target behavior
// ============================================================


import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { JobEntry, JobStatus } from '../types';
import { JobCard } from './JobCard';

const COLUMN_META: Record<
  JobStatus,
  { label: string; emoji: string; headerClass: string }
> = {
  Wishlist:   { label: 'Wishlist',   emoji: '⭐', headerClass: 'text-amber-400 border-b-amber-500/30' },
  Applied:    { label: 'Applied',    emoji: '📨', headerClass: 'text-blue-400 border-b-blue-500/30' },
  'Follow-up':{ label: 'Follow-up', emoji: '🔔', headerClass: 'text-purple-400 border-b-purple-500/30' },
  Interview:  { label: 'Interview',  emoji: '🎙️', headerClass: 'text-orange-400 border-b-orange-500/30' },
  Offer:      { label: 'Offer',      emoji: '🏆', headerClass: 'text-emerald-400 border-b-emerald-500/30' },
  Rejected:   { label: 'Rejected',   emoji: '🚫', headerClass: 'text-rose-400 border-b-rose-500/30' },
};

// ---- Sortable Card Wrapper ----
interface SortableCardProps {
  job: JobEntry;
  onEdit: (job: JobEntry) => void;
  onDelete: (id: number) => void;
  onOpenAI: (job: JobEntry) => void;
}

function SortableCard({ job, onEdit, onDelete, onOpenAI }: SortableCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: job.id! });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      // When dragging: keep the space but make it invisible.
      // The DragOverlay in KanbanBoard renders the visible floating card.
      className={isDragging ? 'opacity-0 pointer-events-none' : ''}
    >
      <JobCard
        job={job}
        onEdit={onEdit}
        onDelete={onDelete}
        onOpenAI={onOpenAI}
      />
    </div>
  );
}

// ---- Column Component ----
interface KanbanColumnProps {
  status: JobStatus;
  jobs: JobEntry[];
  onEdit: (job: JobEntry) => void;
  onDelete: (id: number) => void;
  onOpenAI: (job: JobEntry) => void;
}

export function KanbanColumn({ status, jobs, onEdit, onDelete, onOpenAI }: KanbanColumnProps) {
  const meta = COLUMN_META[status];
  const { setNodeRef, isOver } = useDroppable({ id: status });

  const jobIds = jobs.map((j) => j.id!);

  return (
    <div className="flex flex-col min-w-[280px] max-w-[320px] w-full">
      {/* Fixed Column Header */}
      <div
        className={`flex items-center justify-between px-3 py-3 mb-3 border-b ${meta.headerClass}`}
      >
        <div className="flex items-center gap-2">
          <span>{meta.emoji}</span>
          <span className={`text-sm font-semibold ${meta.headerClass.split(' ')[0]}`}>
            {meta.label}
          </span>
        </div>
        <span className="text-xs font-bold px-2 py-0.5 bg-slate-800 text-slate-400 rounded-full border border-slate-700">
          {jobs.length}
        </span>
      </div>

      {/* Scrollable Cards Area */}
      <div
        ref={setNodeRef}
        className={`flex-1 flex flex-col gap-3 min-h-[120px] max-h-[calc(100vh-320px)] overflow-y-auto pr-1 rounded-xl transition-all duration-150 ${
          isOver ? 'bg-white/3 ring-1 ring-white/10' : ''
        }`}
        style={{ scrollbarWidth: 'thin', scrollbarColor: '#334155 transparent' }}
      >
        <SortableContext items={jobIds} strategy={verticalListSortingStrategy}>
          {jobs.map((job) => (
            <SortableCard
              key={job.id}
              job={job}
              onEdit={onEdit}
              onDelete={onDelete}
              onOpenAI={onOpenAI}
            />
          ))}
        </SortableContext>

        {jobs.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <span className="text-3xl mb-2 opacity-20">{meta.emoji}</span>
            <p className="text-xs text-slate-600">No jobs here yet</p>
            <p className="text-xs text-slate-700 mt-0.5">Drag cards here or add new</p>
          </div>
        )}
      </div>
    </div>
  );
}
