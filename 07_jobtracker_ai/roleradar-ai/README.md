<div align="center">

# 📡 RoleRadar AI

### Your Local-First, Privacy-Focused AI Job Command Center

[![React](https://img.shields.io/badge/React-18+-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Ollama](https://img.shields.io/badge/Ollama-deepseek--r1:8b-black?style=for-the-badge&logo=ollama&logoColor=white)](https://ollama.ai)
[![IndexedDB](https://img.shields.io/badge/Storage-IndexedDB-FF6B35?style=for-the-badge&logo=googlechrome&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)
[![Privacy](https://img.shields.io/badge/Data-100%25_Local-success?style=for-the-badge&logo=lock&logoColor=white)]()

<br/>

> **Track every application. Prepare for every interview. Draft every email. All offline. All yours.**

<br/>

**[🚀 Quick Start](#-quick-start) · [✨ Features](#-features) · [🏗️ Architecture](#️-architecture) · [🤖 AI Setup](#-ai-setup-ollama) · [📖 Usage Guide](#-usage-guide) · [🛠️ Tech Stack](#️-tech-stack)**

</div>

---

## 📋 Table of Contents

- [What is RoleRadar AI?](#-what-is-roleradar-ai)
- [Features](#-features)
- [Quick Start](#-quick-start)
- [AI Setup (Ollama)](#-ai-setup-ollama)
- [Usage Guide](#-usage-guide)
- [Architecture](#️-architecture)
- [Tech Stack](#️-tech-stack)
- [Project Memory (B.L.A.S.T.)](#-project-memory-blast)
- [Data Schema](#-data-schema)
- [FAQ](#-faq)
- [Roadmap](#-roadmap)

---

## 🎯 What is RoleRadar AI?

RoleRadar AI is a **100% browser-based, offline-first job application tracker** built for tech professionals who care about privacy. Every byte of your sensitive job data — salaries, companies, application status — stays in your browser's IndexedDB. Nothing ever touches an external server.

```
Your Data Flow:
┌─────────────────────────────────────────────────────────────────┐
│  Browser (localhost:5173)                                        │
│                                                                  │
│   React UI ──► IndexedDB (idb)   ← All CRUD operations          │
│       │                                                          │
│       └──► /api/ollama (Vite proxy) ──► localhost:11434         │
│                                         (Ollama - local AI)     │
│                                                                  │
│   ✅ Zero external API calls  ✅ Zero cloud storage              │
└─────────────────────────────────────────────────────────────────┘
```

---

## ✨ Features

<details>
<summary><b>📌 Kanban Board — Drag & Drop Pipeline</b></summary>

<br/>

Track every application through **6 hiring stages** with a visual Kanban board powered by `@dnd-kit`:

| Column | Status | Color |
|--------|--------|-------|
| ⭐ Wishlist | Jobs you want to apply to | 🟡 Amber |
| 📨 Applied | Applications submitted | 🔵 Blue |
| 🔔 Follow-up | Awaiting recruiter response | 🟣 Purple |
| 🎙️ Interview | Active interview process | 🟠 Orange |
| 🏆 Offer | Received an offer | 🟢 Emerald |
| 🚫 Rejected | Application closed | 🔴 Rose |

**Drag any card** between columns to instantly update its status — synced to IndexedDB in real-time.

</details>

<details>
<summary><b>🤖 Local AI Assistant (deepseek-r1:8b via Ollama)</b></summary>

<br/>

Click the 🤖 button on any job card to open the AI panel. Three AI-powered actions are available:

| Action | What it does |
|--------|-------------|
| 🔬 **Extract Top Skills** | Analyzes the JD and returns the top 10 technical skills as tags |
| 🎙️ **Interview Prep** | Generates 3 tailored, role-specific technical interview questions |
| 📧 **Draft Follow-Up Email** | Writes a professional recruiter follow-up email |

**All AI runs 100% locally** — `deepseek-r1:8b` via Ollama at `localhost:11434`. No API keys needed. No data sent to OpenAI/Anthropic/Google.

> **Graceful degradation:** If Ollama is not running, the app works perfectly — AI buttons simply show a helpful setup guide.

</details>

<details>
<summary><b>⚠️ Smart Follow-Up Alerts</b></summary>

<br/>

Cards automatically display a follow-up warning badge when:
- Status is **Applied**, AND
- **7+ days** have passed since `dateApplied`

```
┌─────────────────────────────────────┐
│ ⚠️ Follow Up — 9 days since applied │
├─────────────────────────────────────┤
│ Senior SDE-2                        │
│ Google                              │
│ [React] [TypeScript] [GCP]          │
└─────────────────────────────────────┘
```

</details>

<details>
<summary><b>📊 Dashboard Metrics</b></summary>

<br/>

Real-time KPI cards at the top of the board:

- 🚀 **Active Applications** — All non-rejected entries
- ⚠️ **Follow-Ups Needed** — Applied ≥ 7 days ago
- 🎯 **Interviews Scheduled** — Cards in Interview column
- 🏆 **Offers Received** — Cards in Offer column (with conversion rate)

</details>

<details>
<summary><b>🔍 Filter & Search</b></summary>

<br/>

- **Text search** — Filter by company name or role
- **Status filter** — Show only a specific pipeline stage
- **Tech tag filter** — Filter by any tech stack tag (React, AWS, etc.)
- Filters stack: combine all three for precise results
- **Clear all** button to reset in one click

</details>

<details>
<summary><b>💾 JSON Backup & Restore</b></summary>

<br/>

**Export:**
```
📤 Export button → Downloads roleradar-backup-YYYY-MM-DD.json
```

**Import:**
```
📥 Import button → Select .json file → Validates schema → Writes to IndexedDB
```

Backup format:
```json
{
  "exportedAt": "2026-07-22T00:00:00.000Z",
  "version": 1,
  "jobs": [ ...JobEntry[] ]
}
```

</details>

---

## 🚀 Quick Start

### Prerequisites

| Tool | Version | Install |
|------|---------|---------|
| Node.js | 18+ | [nodejs.org](https://nodejs.org) |
| npm | 9+ | Bundled with Node |
| Ollama | Latest | [ollama.ai](https://ollama.ai) *(optional — for AI features)* |

### 1. Install & Run

```bash
# Navigate to the project directory
cd 07_jobtracker_ai/roleradar-ai

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Open **http://localhost:5173** in your browser. That's it — no `.env` file, no API keys, no backend.

### 2. Build for Production

```bash
npm run build
# Output: dist/ — serve with any static file host
```

---

## 🤖 AI Setup (Ollama)

AI features are **optional** — the app works without them. To enable them:

### Step 1 — Install Ollama

```bash
# macOS
brew install ollama

# Or download from: https://ollama.ai/download
```

### Step 2 — Start the server

```bash
ollama serve
```

### Step 3 — Pull the model

```bash
# Default model (recommended — fast, smart)
ollama pull deepseek-r1:8b

# Alternative option
ollama pull qwen2.5-coder:7b
```

### Step 4 — Verify

```bash
ollama list
# Should show: deepseek-r1:8b    ...
```

> **To switch models:** Change `ACTIVE_MODEL` in `src/services/ollama.ts`. One constant, zero other changes needed.

<details>
<summary><b>🔧 Vite Proxy Configuration (CORS fix)</b></summary>

<br/>

The app proxies all Ollama requests through Vite to avoid CORS errors:

```
Browser fetch → /api/ollama/api/generate
                    ↓ (Vite proxy rewrites)
              → http://localhost:11434/api/generate
```

This is configured in `vite.config.ts`:
```typescript
server: {
  proxy: {
    '/api/ollama': {
      target: 'http://localhost:11434',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api\/ollama/, ''),
    },
  },
}
```

</details>

---

## 📖 Usage Guide

### Adding a Job

1. Click **`+ Add Job`** in the filter bar
2. Fill in **Company** and **Role** (required)
3. Add optional fields: salary, resume version, job URL, tech stack
4. Paste the full **Job Description** — this powers all AI features
5. Click **Add Job** → card appears in selected column

### Using the AI Assistant

1. Click **🤖** on any job card
2. If no JD is attached, an inline text editor appears — paste and click **💾 Save JD**
3. Choose an AI action:
   - **🔬 Extract Top Skills** → requires JD
   - **🎙️ Interview Prep** → requires JD
   - **📧 Draft Email** → works without JD (uses role + company + date)
4. Click **📋 Copy** to copy the result to clipboard

### Keyboard Shortcuts

| Action | Shortcut |
|--------|---------|
| Close any modal | `Esc` or click backdrop |
| Submit a form | `Enter` (when focused on submit button) |

### Drag & Drop Tips

- **Drag threshold:** Move 5px before drag activates (prevents accidental drags on click)
- **Cross-column drag:** Drag a card and drop onto any column header or empty space
- **Drop on card:** Drag onto another card — it adopts that card's column status

---

## 🏗️ Architecture

```
src/
├── types/
│   └── index.ts              # All TypeScript interfaces (JobEntry, JobStatus, OllamaResult...)
│
├── db/
│   └── db.ts                 # IndexedDB service layer (idb wrapper)
│                             # getAllJobs · addJob · updateJob · deleteJob
│                             # exportAllJobs · importJobs
│
├── services/
│   └── ollama.ts             # Local AI service (deepseek-r1:8b)
│                             # extractSkills · generateInterviewQuestions · draftFollowUpEmail
│
├── components/
│   ├── DashboardMetrics.tsx  # 4 KPI cards with ambient glow
│   ├── FilterBar.tsx         # Search + status/tech filters + import/export/add
│   ├── KanbanBoard.tsx       # DndContext — cross-column drag orchestration
│   ├── KanbanColumn.tsx      # Droppable column with SortableContext
│   ├── JobCard.tsx           # Card with status border accents + follow-up flag
│   ├── JobModal.tsx          # Create/Edit modal with full form validation
│   └── AIAssistant.tsx       # Ollama AI panel with inline JD editor
│
├── App.tsx                   # Root — state management, event handlers, toast system
├── main.tsx                  # React 18 entry point (StrictMode)
└── index.css                 # Tailwind v4 + custom scrollbars + animations
```

### Data Flow

```
User Action
    │
    ▼
Component (UI Event)
    │
    ▼
App.tsx (State Manager)
    │
    ├──► db.ts (IndexedDB) ──► Browser Storage (persistent)
    │
    └──► ollama.ts (AI) ──► Vite Proxy ──► localhost:11434
```

### A.N.T. 3-Layer Design

| Layer | Files | Responsibility |
|-------|-------|---------------|
| **Architecture** | `LLM.md`, `types/index.ts` | Schema, invariants, contracts |
| **Navigation** | `App.tsx` | State routing, event orchestration |
| **Tools** | `db.ts`, `ollama.ts` | Deterministic execution engines |

---

## 🛠️ Tech Stack

| Category | Technology | Why |
|----------|-----------|-----|
| **UI Framework** | React 18 + TypeScript | Typed components, concurrent features |
| **Build Tool** | Vite 8 | Sub-second HMR, native ESM, built-in proxy |
| **Styling** | Tailwind CSS v4 | Utility-first, dark mode, JIT |
| **Local Storage** | `idb` (IndexedDB wrapper) | Promise-based, typed, offline-persistent |
| **Drag & Drop** | `@dnd-kit/core` + `sortable` | Accessible, TypeScript-native, no HTML5 DnD bugs |
| **Local AI** | Ollama + deepseek-r1:8b | Local LLM, zero data egress, CORS-proxied |

---

## 📁 Project Memory (B.L.A.S.T.)

This project was built following the **B.L.A.S.T.** protocol — a deterministic agentic build system:

<details>
<summary><b>View B.L.A.S.T. Protocol Phases</b></summary>

<br/>

| Phase | Name | Description |
|-------|------|-------------|
| **B** | Blueprint | Define schema in `LLM.md` before writing code |
| **L** | Link | Scaffold project, install deps, configure Vite proxy |
| **A** | Architect | 3-layer build: Architecture → Navigation → Tools |
| **S** | Stylize | Dark UI, status accents, glassmorphism, animations |
| **T** | Trigger | Backup/restore, auto follow-up flags, TS zero errors |

Memory files (project constitution):

| File | Purpose |
|------|---------|
| [`LLM.md`](../LLM.md) | Project constitution — schema, invariants, rules |
| [`task_plan.md`](../task_plan.md) | B.L.A.S.T. build checklist |
| [`findings.md`](../findings.md) | Constraints, edge cases, architecture decisions |
| [`progress.md`](../progress.md) | Execution log, repair patches, test results |

</details>

---

## 📐 Data Schema

<details>
<summary><b>View full JobEntry schema (IndexedDB)</b></summary>

<br/>

```typescript
interface JobEntry {
  id?: number;            // Auto-incrementing primary key
  company: string;        // Required — e.g. "Google", "Flipkart"
  role: string;           // Required — e.g. "Senior SDE-2", "QA Lead"
  jobUrl: string;         // Clickable link to original JD
  resumeUsed: string;     // e.g. "Automation_Lead_v2"
  dateApplied: string;    // ISO 8601 — auto-set, editable
  expectedSalary: string; // e.g. "₹25-30 LPA", "$120k"
  status: JobStatus;      // Wishlist|Applied|Follow-up|Interview|Offer|Rejected
  techStack: string[];    // Tags — ["React", "Node.js", "AWS"]
  jobDescription: string; // Full JD text — used by AI assistant
  notes: string;          // Personal notes, recruiter contacts
  createdAt: string;      // ISO — set once on create
  updatedAt: string;      // ISO — updated on every save
}
```

**IndexedDB Config:**
- DB Name: `roleradar-db` | Version: `1`
- Store: `jobs` | KeyPath: `id` (autoIncrement)
- Indexes: `by-status`, `by-company`, `by-dateApplied`

</details>

---

## ❓ FAQ

<details>
<summary><b>Does my job data ever leave my computer?</b></summary>

**No.** All data is stored in your browser's IndexedDB — it's local to your machine and origin (`localhost`). The only external calls are to `localhost:11434` (Ollama running on your own machine). There is no analytics, no telemetry, no backend server.

</details>

<details>
<summary><b>What happens if I clear my browser data?</b></summary>

Your IndexedDB data will be deleted. **Always export a JSON backup** before clearing browser storage. Use the **📤 Export** button in the app — it downloads a `roleradar-backup-YYYY-MM-DD.json` file you can re-import later.

</details>

<details>
<summary><b>Can I use a different AI model?</b></summary>

Yes. Change the `ACTIVE_MODEL` constant in `src/services/ollama.ts`:

```typescript
// src/services/ollama.ts
const ACTIVE_MODEL = 'qwen2.5-coder:7b'; // ← change here
```

Then pull it: `ollama pull qwen2.5-coder:7b`. No other code changes needed.

</details>

<details>
<summary><b>Does it work on mobile?</b></summary>

The board renders on tablets but is optimized for desktop (the horizontal Kanban layout needs width). Drag and drop on mobile uses touch events — it works but is not the primary use case.

</details>

<details>
<summary><b>Can I deploy this to a server?</b></summary>

You can run `npm run build` and serve the `dist/` folder as a static site (Netlify, Vercel, GitHub Pages). However, the Ollama AI features will only work when accessed from the same machine running Ollama — they won't work for other users since `localhost:11434` is local to each machine.

</details>

<details>
<summary><b>The drag-and-drop card jumps to the wrong position. How do I fix it?</b></summary>

This is a known CSS `position: fixed` interaction issue. Ensure no parent element has an active CSS `transform` property — even `transform: translateY(0)` breaks `position: fixed` children. The app's animations are already configured to use opacity-only transitions to avoid this.

</details>

---

## 🗺️ Roadmap

- [x] Kanban board with drag-and-drop
- [x] IndexedDB local storage
- [x] Local AI assistant (Ollama)
- [x] Auto follow-up alerts (≥7 days)
- [x] JSON backup & restore
- [x] Inline JD editor in AI modal
- [x] Differentiated AI error handling (404 vs connection refused)
- [ ] Dark/light theme toggle
- [ ] Custom Kanban columns
- [ ] Resume version manager
- [ ] Calendar view (interview timeline)
- [ ] Salary negotiation tracker
- [ ] PWA support (install as desktop app)
- [ ] Multi-profile support

---

## 📄 License

MIT — use it, fork it, build on it. Just keep your data private. 🔒

---

<div align="center">

Built with the **B.L.A.S.T.** protocol · Powered by **Ollama deepseek-r1:8b** · Data stays **yours**

</div>
