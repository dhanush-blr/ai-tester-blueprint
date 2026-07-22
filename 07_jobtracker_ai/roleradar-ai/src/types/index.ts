// ============================================================
// src/types/index.ts — RoleRadar AI: All TypeScript Interfaces
// Project Constitution Reference: LLM.md § DATA SCHEMA
// ============================================================

export type JobStatus =
  | 'Wishlist'
  | 'Applied'
  | 'Follow-up'
  | 'Interview'
  | 'Offer'
  | 'Rejected';

export interface JobEntry {
  id?: number;
  company: string;
  role: string;
  jobUrl: string;
  resumeUsed: string;
  dateApplied: string;       // ISO 8601
  expectedSalary: string;
  status: JobStatus;
  techStack: string[];
  jobDescription: string;
  notes: string;
  createdAt: string;         // ISO 8601 — set once on create
  updatedAt: string;         // ISO 8601 — updated on every save
}

// ---- DB Layer ----
export interface DBExportPayload {
  exportedAt: string;        // ISO 8601
  version: number;           // Schema version (currently 1)
  jobs: JobEntry[];
}

// ---- Ollama AI Service ----
export type OllamaAction = 'extractSkills' | 'generateInterviewQuestions' | 'draftFollowUpEmail';

export interface OllamaRequest {
  model: string;           // e.g. 'deepseek-r1:8b', 'qwen2.5-coder:7b'
  prompt: string;
  stream: false;
}


export interface OllamaResponse {
  model: string;
  response: string;
  done: boolean;
}

export interface OllamaResult {
  action: OllamaAction;
  content: string;
  error?: string;
  errorType?: 'validation' | 'network'; // 'validation' = missing JD, 'network' = Ollama unreachable
}


// ---- Dashboard Metrics ----
export interface DashboardMetrics {
  totalActive: number;       // All non-rejected entries
  followUpsNeeded: number;   // Applied + ≥7 days
  interviews: number;        // Status === 'Interview'
  offers: number;            // Status === 'Offer'
}

// ---- Filter State ----
export interface FilterState {
  query: string;             // Text search across company, role
  techTag: string;           // Filter by single tech tag
  status: JobStatus | '';    // Filter by status (empty = all)
}

// ---- Modal State ----
export type ModalMode = 'create' | 'edit';

export interface ModalState {
  isOpen: boolean;
  mode: ModalMode;
  job: JobEntry | null;      // null when creating new
}
