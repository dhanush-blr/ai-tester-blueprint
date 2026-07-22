# task_plan.md — RoleRadar AI Build Checklist

> **Protocol:** B.L.A.S.T. | **Started:** 2026-07-22 | **Status:** 🟡 In Progress

---

## Phase 1: B — Blueprint ✅

- [x] Read and internalize B.L.A.S.T.md protocol
- [x] Define IndexedDB JSON schema in `LLM.md`
- [x] Define AI service request/response shapes
- [x] Define all business rules and invariants
- [x] Create `task_plan.md` (this file)
- [x] Create `findings.md`
- [x] Create `progress.md`

---

## Phase 2: L — Link (Scaffold & Dependencies)

- [x] Initialize Vite + React + TypeScript project in `roleradar-ai/`
- [x] Install `idb` (IndexedDB wrapper)
- [x] Install `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`
- [x] Install `tailwindcss`, `autoprefixer`, `postcss`
- [x] Configure `vite.config.ts` with `/api/ollama` proxy
- [x] Configure `tailwind.config.js` with dark mode
- [x] Configure `postcss.config.js`
- [x] Update `index.html` with app title and meta tags

---

## Phase 3: A — Architect (Source Files)

### Types
- [x] `src/types/index.ts` — `JobEntry`, `JobStatus`, `OllamaRequest`, `OllamaResponse`

### Data Layer
- [x] `src/db/db.ts` — idb wrapper: `initDB`, `getAllJobs`, `addJob`, `updateJob`, `deleteJob`, `exportAllJobs`, `importJobs`

### Service Layer
- [x] `src/services/ollama.ts` — `extractSkills()`, `generateInterviewQuestions()`, `draftFollowUpEmail()`

### Components
- [x] `src/components/DashboardMetrics.tsx`
- [x] `src/components/FilterBar.tsx`
- [x] `src/components/KanbanBoard.tsx`
- [x] `src/components/KanbanColumn.tsx`
- [x] `src/components/JobCard.tsx`
- [x] `src/components/JobModal.tsx`
- [x] `src/components/AIAssistant.tsx`

### App Root
- [x] `src/App.tsx` — Main app with state, backup/restore, modal management
- [x] `src/main.tsx` — React 18 root render
- [x] `src/index.css` — Tailwind directives + custom CSS

---

## Phase 4: S — Stylize

- [x] Dark slate/navy theme via Tailwind
- [x] Status border accent colors applied to `JobCard`
- [x] Glassmorphism card surfaces
- [x] Hover micro-animations on cards and buttons
- [x] Independent column scrolling
- [x] Fixed header counters per column
- [x] Responsive layout

---

## Phase 5: T — Trigger (Polish)

- [x] JSON Export function (`exportAllJobs`)
- [x] JSON Import/Restore function (`importJobs`)
- [x] Auto follow-up flag logic (≥7 days + Applied)
- [x] Verify TypeScript compiles with zero errors
- [x] Verify zero console errors at runtime

---

## Open Issues / Bugs
_None at inception._
