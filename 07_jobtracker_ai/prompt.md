# 📝 RoleRadar AI — Prompt Log

All prompts entered during the development of **RoleRadar AI** in chronological order.
This file serves as a full audit trail of every instruction given to the AI agent.

---

## Prompt Index

| # | Prompt Summary | Type |
|:-:|:--------------|:----:|
| [P01](#p01--initial-blast-build-prompt) | Initial B.L.A.S.T. Build — Full SPA Scaffold | 🏗️ Build |
| [P02](#p02--how-to-run) | How to run? | ❓ Query |
| [P03](#p03--drag-and-drop-transition-bug) | Issue with the transition | 🐛 Bug |
| [P04](#p04--drag-overlay-position-still-wrong) | Still same issue | 🐛 Bug |
| [P05](#p05--repair-patch-ai-assistant-jd-validation) | Fix AI Assistant Modal Validation & Add Inline JD Input | 🔧 Patch |
| [P06](#p06--repair-patch-ollama-model-endpoint) | Update Ollama Model Endpoint & Fallback Handling | 🔧 Patch |
| [P07](#p07--repair-patch-replace-llama3-hardcoding) | Replace llama3 hardcoding in API Payload & UI Loading States | 🔧 Patch |
| [P08](#p08--create-interactive-readme) | Create a readme file for this project and make it interactive | 📄 Docs |
| [P09](#p09--update-parent-readme) | Update the parent readme file | 📄 Docs |
| [P10](#p10--create-prompt-log) | Create a prompt.md file with all prompts entered | 📄 Docs |

---

## P01 — Initial B.L.A.S.T. Build Prompt

> **Type:** 🏗️ Full Build  
> **Session:** Session 1  
> **Referenced files:** `07_jobtracker_ai/B.L.A.S.T.md`, `07_jobtracker_ai/`

```
@[07_jobtracker_ai/B.L.A.S.T.md] @[07_jobtracker_ai/]

### [R] - ROLE
You are System Pilot, an elite Principal Full-Stack Engineer and AI Architect.
You build deterministic, self-healing, local-first web applications using the
B.L.A.S.T. (Blueprint, Link, Architect, Stylize, Trigger) protocol and the
A.N.T. 3-layer architecture. You prioritize reliability, strict state
management, and offline-first capabilities.

---

### [C] - CONTEXT
The user needs a local-first, privacy-focused, AI-powered Job Tracker named
**"RoleRadar AI"**. The app must run entirely in the browser as a Vite + React
+ TypeScript single-page app, using IndexedDB (`idb`) for local data storage
and local Ollama (`llama3`) for AI features. It serves as a personal command
center for tracking tech applications across different hiring stages without
sending sensitive salary or application data to external cloud servers.

---

### [I] - INSTRUCTIONS & BLAST PROTOCOL

Execute the project following the **B.L.A.S.T.** protocol and **A.N.T.**
3-layer architecture:

#### Phase 1: B - Blueprint (Initialization & Memory)
1. Initialize Project Memory Files:
   - `LLM.md`: Project Constitution (Data Schema, Invariants, Rules).
   - `task_plan.md`: Phases, goals, and step-by-step checklist.
   - `findings.md`: Constraints, discoveries, and state tracking.
   - `progress.md`: Execution log, test results, and repairs.
2. Enforce the **Data-First Rule**: Define the IndexedDB JSON schema in
   `LLM.md` before generating component code.

#### Phase 2: L - Link (Persistence & Proxy Handshake)
1. Setup `idb` wrapper for IndexedDB.
2. Configure `vite.config.ts` with a proxy for `http://localhost:11434` to
   prevent CORS issues when calling local Ollama (`llama3`).

#### Phase 3: A - Architect (The 3-Layer Build)
1. **Data Model (IndexedDB Schema):**
   - `id`: Auto-incrementing primary key
   - `company`: String (required)
   - `role`: String (required)
   - `jobUrl`: String (clickable link)
   - `resumeUsed`: String (e.g., "Automation_Lead_v2", "DevOps_Resume")
   - `dateApplied`: ISO Timestamp (auto-set, editable)
   - `expectedSalary`: String (e.g., "₹25-30 LPA")
   - `status`: String (Wishlist | Applied | Follow-up | Interview | Offer | Rejected)
   - `techStack`: Array of strings
   - `jobDescription`: Text
   - `notes`: Text

2. **Core Features:**
   - **Kanban Board:** Drag-and-drop between columns using `@dnd-kit/core`,
     `@dnd-kit/sortable`, and `@dnd-kit/utilities`.
   - **Dashboard Cards:** Real-time metrics at top (Active Applications,
     Follow-ups Needed, Interviews).
   - **Modal Forms:** Create and edit job cards with validation.
   - **Filter/Search:** Filter by role, company, or tech stack tag.
   - **Automated Alerts:** Auto-flag cards as `⚠️ Time to Follow Up` if
     `dateApplied` >= 7 days and status is 'Applied'.

3. **Local AI Assistant Layer:**
   - Provide an AI Assistant panel to trigger local Ollama (`llama3`) to:
     - Extract top technical skills from `jobDescription`.
     - Generate 3 tailored technical interview questions.
     - Draft recruiter follow-up emails.

#### Phase 4: S - Stylize (UI Refinement)
1. Apply Tailwind CSS with a clean dark-mode theme (slate/navy palette).
2. Status left-border accent styles:
   - Wishlist:   `border-l-amber-500`
   - Applied:    `border-l-blue-500`
   - Follow-up:  `border-l-purple-500`
   - Interview:  `border-l-orange-500`
   - Offer:      `border-l-emerald-500`
   - Rejected:   `border-l-rose-500`
3. Independent column scrolling with fixed header counters.

#### Phase 5: T - Trigger (Backup & Polish)
1. Include full JSON Backup (Export) and JSON Restore (Import) functionality.
2. 100% offline, client-side application.

---

### [P] - PARAMETERS & CONSTRAINTS
- **Tech Stack:** React 18+, Vite, TypeScript, Tailwind CSS, `idb`,
  `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`.
- **Quality:** Production-grade TypeScript types, zero console errors,
  clean modular components.

---

### [O] - OUTPUT
1. Complete scaffold files for Vite + React + TS.
2. Initial memory files (`LLM.md`, `task_plan.md`, `findings.md`, `progress.md`).
3. Fully functional React components (`App.tsx`, `KanbanBoard.tsx`, `JobCard.tsx`,
   `JobModal.tsx`, `DashboardMetrics.tsx`, `db.ts`, `ollama.ts`).

---

### [T] - TONE
Technical, authoritative, deterministic, and system-oriented.
```

**Result:** Full SPA scaffolded — 10 source files, zero TS errors, dev server running at `http://localhost:5173`.

---

## P02 — How to run?

> **Type:** ❓ Query  
> **Session:** Session 1

```
How to run?
```

**Result:** Agent started the dev server and provided the 4-step run guide (npm run dev + ollama serve + ollama pull deepseek-r1:8b).

---

## P03 — Drag and Drop Transition Bug

> **Type:** 🐛 Bug Report (with screenshot)  
> **Session:** Session 1  
> **Observation:** DragOverlay card appeared at the bottom of the viewport instead of following the cursor

```
Issue with the transition
```

**Result:** Agent identified two root causes:
1. `MeasuringStrategy.Always` missing from `DndContext` — stale droppable measurements in scroll container
2. Original card was showing as semi-transparent alongside the overlay

Fixes applied to `KanbanBoard.tsx` and `KanbanColumn.tsx`.

---

## P04 — Drag Overlay Position Still Wrong

> **Type:** 🐛 Bug Report (with screenshot)  
> **Session:** Session 1  
> **Observation:** Overlay still appearing at bottom of screen after first fix

```
still same issue
```

**Result:** Agent identified the **real root cause** — `animate-fade-in` CSS class applied `transform: translateY(0)` to the board's parent `<section>`. Any CSS `transform` on an ancestor breaks `position: fixed` children. Fixed by removing `translateY` from all animations (opacity-only transitions).

---

## P05 — REPAIR PATCH: AI Assistant JD Validation

> **Type:** 🔧 Repair Patch  
> **Session:** Session 2

```
### REPAIR PATCH: Fix AI Assistant Modal Validation & Add Inline JD Input

The AI Assistant modal currently displays a confusing error state ("Ollama Unavailable")
when the underlying Job Description is empty, even when Ollama is running.

Execute the following updates across `src/components/AIAssistantModal.tsx` and
`src/services/ollama.ts`:

#### 1. Differentiate Validation Errors from API Errors
- Separate empty `jobDescription` state from actual Ollama connection failures
  (`FETCH_ERROR` / `ECONNREFUSED`).
- If `jobDescription` is missing or empty:
  - Display an **info banner** (not a critical Ollama error): "No Job Description Found".
  - Render an inline <textarea> inside the modal so the user can paste/save the job
    description on the fly without closing the modal.

#### 2. Update `AIAssistantModal.tsx` Logic
// Inside AIAssistantModal.tsx
const [jdText, setJdText] = useState(job.jobDescription || '');
const [isSavingJD, setIsSavingJD] = useState(false);

const handleSaveJD = async () => {
  setIsSavingJD(true);
  await db.applications.update(job.id, { jobDescription: jdText });
  onUpdateJob({ ...job, jobDescription: jdText });
  setIsSavingJD(false);
};

// Guard clause in AI action triggers:
const handleRunAITask = async (taskType: string) => {
  if (!jdText.trim()) {
    setError('Please paste or save a Job Description below before running the AI assistant.');
    return;
  }
  // Proceed with Ollama API call...
};
```

**Result:** Implemented across `AIAssistant.tsx`, `ollama.ts`, `types/index.ts`, and `App.tsx`:
- Added `errorType: 'validation' | 'network'` discriminator to `OllamaResult`
- Inline JD textarea with 💾 Save JD button renders when JD is empty
- Guard clause blocks Ollama calls and shows amber warning instead
- `onUpdateJob` prop wired to App.tsx for real-time state sync

---

## P06 — REPAIR PATCH: Update Ollama Model Endpoint

> **Type:** 🔧 Repair Patch  
> **Session:** Session 2

```
### REPAIR PATCH: Update Ollama Model Endpoint & Fallback Handling

The app is currently throwing a `404 Not Found` because `ollama.ts` hardcodes
model: 'llama3', but the local system has `deepseek-r1:8b` and
`qwen2.5-coder:7b` installed instead.

Execute the following fixes:

1. In `src/services/ollama.ts`:
   - Change the default model fallback from 'llama3' to 'deepseek-r1:8b'
     (or 'qwen2.5-coder:7b').
   - Update the request payload to target deepseek-r1:8b.

2. Update Modal Error Message:
   - If Ollama returns a 404, display a helpful message:
     "Model 'deepseek-r1:8b' not found in local Ollama.
      Please run $ ollama pull deepseek-r1:8b in terminal."

3. Memory Update:
   - Log this fix in `progress.md`.
   - Update `LLM.md` invariant:
     "Default local LLM endpoint must target 'deepseek-r1:8b'."
```

**Result:**
- Introduced `ACTIVE_MODEL = 'deepseek-r1:8b'` constant in `ollama.ts`
- 404 responses throw a targeted error message with pull instruction
- AI modal renders distinct "Model Not Found" UI vs "Ollama Unavailable" UI
- `LLM.md` Invariant #8 added; `progress.md` patched

---

## P07 — REPAIR PATCH: Replace llama3 Hardcoding

> **Type:** 🔧 Repair Patch  
> **Session:** Session 2

```
### REPAIR PATCH: Replace llama3 hardcoding in API Payload & UI Loading States

The API request payload inside `ollama.ts` and the modal loading state inside
`AIAssistantModal.tsx` are still hardcoded to use `llama3`.

Fix the API call and loading text across the codebase:

#### 1. In `src/services/ollama.ts`
Ensure the JSON body sent to Ollama explicitly specifies `deepseek-r1:8b`:

const response = await fetch('/api/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    model: 'deepseek-r1:8b', // DO NOT USE llama3
    prompt: userPrompt,
    stream: false,
  }),
});
```

**Result:** Full codebase purge — zero `llama3` strings remaining across all `src/` files:
- `AIAssistant.tsx` — comment, subtitle, loading spinner text updated
- `types/index.ts` — `OllamaRequest.model` changed from `'llama3'` literal to `string`
- Confirmed with `grep -rn "llama3" src/` → 0 matches

---

## P08 — Create Interactive README

> **Type:** 📄 Documentation  
> **Session:** Session 2

```
create a readme file for this project and make it interactive
```

**Result:** Created `roleradar-ai/README.md` with:
- 9 shields.io badges (React, TypeScript, Vite, Tailwind, Ollama, IndexedDB, License, Privacy)
- Clickable table of contents with anchor links
- 6 collapsible `<details>` feature blocks
- Full architecture diagram + file tree
- Tech stack table, data schema, keyboard shortcuts
- 6-question FAQ with collapsible answers
- Roadmap with completed ✅ and upcoming items

---

## P09 — Update Parent README

> **Type:** 📄 Documentation  
> **Session:** Session 2

```
Update the parent readme file
```

**Result:** Updated `/ai-tester-blueprint/README.md`:
- Badge updated: `modules-6` → `modules-7`
- Description updated to mention 7 modules and local-first AI tracker
- Quick Nav grid: Module 07 row added
- Portfolio comparison table: Module 07 row added
- Full `### 📦 Module 07 — RoleRadar AI Job Tracker` section added with file tree, milestone table, 8-point highlights
- Getting Started quick-start table: Module 07 row added

---

## P10 — Create Prompt Log

> **Type:** 📄 Documentation  
> **Session:** Session 2

```
Create a prompt.md file in the @directory:07_jobtracker_ai folder and add all
the prompts which I entered
```

**Result:** This file. ✅

---

## Summary Stats

| Metric | Value |
|:-------|------:|
| Total prompts | 10 |
| Build prompts | 1 |
| Bug fix prompts | 2 |
| Repair patches | 3 |
| Documentation prompts | 3 |
| Queries | 1 |
| Files created/modified | 20+ |
| TypeScript errors at end | 0 |
| `llama3` references remaining | 0 |

---

*Generated: 2026-07-22 · RoleRadar AI · B.L.A.S.T. Protocol*
