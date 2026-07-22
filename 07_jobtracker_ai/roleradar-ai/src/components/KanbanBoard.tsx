// ============================================================
// src/components/KanbanBoard.tsx — RoleRadar AI: DnD Board
// Uses @dnd-kit/core DndContext for cross-column drag
// ============================================================

import { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  MeasuringStrategy,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';

import type { JobEntry, JobStatus } from '../types';
import { KanbanColumn } from './KanbanColumn';
import { JobCard } from './JobCard';

const ALL_STATUSES: JobStatus[] = [
  'Wishlist',
  'Applied',
  'Follow-up',
  'Interview',
  'Offer',
  'Rejected',
];

interface KanbanBoardProps {
  jobs: JobEntry[];
  onStatusChange: (id: number, newStatus: JobStatus) => void;
  onEdit: (job: JobEntry) => void;
  onDelete: (id: number) => void;
  onOpenAI: (job: JobEntry) => void;
}

export function KanbanBoard({
  jobs,
  onStatusChange,
  onEdit,
  onDelete,
  onOpenAI,
}: KanbanBoardProps) {
  const [activeJob, setActiveJob] = useState<JobEntry | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 }, // Require 5px drag before activation
    })
  );

  function getJobsByStatus(status: JobStatus): JobEntry[] {
    return jobs.filter((j) => j.status === status);
  }

  function handleDragStart(event: DragStartEvent) {
    const job = jobs.find((j) => j.id === event.active.id);
    setActiveJob(job ?? null);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveJob(null);

    if (!over) return;

    const draggedJobId = active.id as number;
    const draggedJob = jobs.find((j) => j.id === draggedJobId);
    if (!draggedJob) return;

    // Check if dropped onto a column (status string) or another card (number id)
    const overId = over.id;
    let targetStatus: JobStatus;

    if (ALL_STATUSES.includes(overId as JobStatus)) {
      // Dropped directly on column droppable
      targetStatus = overId as JobStatus;
    } else {
      // Dropped on another card — find that card's status
      const overJob = jobs.find((j) => j.id === overId);
      if (!overJob) return;
      targetStatus = overJob.status;
    }

    if (draggedJob.status !== targetStatus) {
      onStatusChange(draggedJobId, targetStatus);
    }
  }

  return (
    <DndContext
      sensors={sensors}
      // MeasuringStrategy.Always re-measures droppables on every render,
      // which fixes the DragOverlay offset bug inside scrollable containers.
      measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div
        className="flex gap-5 overflow-x-auto pb-4"
        style={{ scrollbarWidth: 'thin', scrollbarColor: '#334155 transparent' }}
      >
        {ALL_STATUSES.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            jobs={getJobsByStatus(status)}
            onEdit={onEdit}
            onDelete={onDelete}
            onOpenAI={onOpenAI}
          />
        ))}
      </div>

      {/* Drag Overlay — floats above everything, follows the cursor */}
      <DragOverlay dropAnimation={{
        duration: 200,
        easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
      }}>
        {activeJob ? (
          <div className="rotate-1 shadow-2xl shadow-black/50 scale-105">
            <JobCard
              job={activeJob}
              onEdit={() => {}}
              onDelete={() => {}}
              onOpenAI={() => {}}
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
