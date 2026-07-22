# 📦 Module 07 — RoleRadar AI Job Tracker

[![React](https://img.shields.io/badge/React-18+-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![Ollama](https://img.shields.io/badge/Ollama-deepseek--r1:8b-black?style=for-the-badge&logo=ollama&logoColor=white)](https://ollama.ai)
[![IndexedDB](https://img.shields.io/badge/Storage-IndexedDB-FF6B35?style=for-the-badge&logo=googlechrome&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
[![Privacy](https://img.shields.io/badge/Data-100%25_Local-success?style=for-the-badge&logo=lock&logoColor=white)]()

A local-first, privacy-focused, AI-powered job application tracker SPA. RoleRadar AI tracks tech job applications through a drag-and-drop Kanban pipeline with local AI insights powered by `deepseek-r1:8b` via Ollama — zero cloud, zero data egress.

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Directory Blueprint](#-directory-blueprint)
- [Architecture & Frameworks](#-architecture--frameworks)
- [Key Features](#-key-features)
- [Local Quick-Start](#-local-quick-start)
- [Documentation & Memory Specs](#-documentation--memory-specs)

---

## 🎯 Overview

RoleRadar AI solves the privacy concern of modern job hunting. Sensitive data — company names, salaries, application dates, and notes — stay 100% inside your browser's IndexedDB. AI features (JD skill extraction, technical interview prep, follow-up email drafting) run entirely locally using Ollama (`deepseek-r1:8b`).

```
┌─────────────────────────────────────────────────────────────────┐
│  Browser Client (localhost:5173)                                 │
│                                                                 │
│   React SPA UI ──► IndexedDB (idb)  ← Client-side persistence  │
│       │                                                         │
│       └──► /api/ollama (Vite proxy) ──► localhost:11434        │
│                                         (Local Ollama Engine)   │
│                                                                 │
│   🔒 100% Offline   🔒 Zero External APIs   🔒 Zero Data Egress   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🗂️ Directory Blueprint

```text
07_jobtracker_ai/
├── README.md                      # Module 07 Master Documentation
├── docs/                          # Architecture & project specifications
│   ├── B.L.A.S.T.md               # System Architecture protocol reference
│   ├── LLM.md                     # Data Schema & Invariants (Project Constitution)
│   ├── findings.md                # Engineering constraints & trade-offs
│   ├── progress.md                # Step-by-step execution log & patch history
│   ├── prompt.md                  # System prompt & anti-hallucination rules
│   └── task_plan.md               # B.L.A.S.T. build checklist & milestone log
└── roleradar-ai/                  # Single Page Application (Vite + React + TS)
    ├── README.md                  # Application technical guide & UI screenshots
    ├── package.json               # Dependencies (@dnd-kit, idb, lucide-react)
    ├── vite.config.ts             # Dev proxy (/api/ollama -> localhost:11434)
    ├── index.html
    └── src/
        ├── types/index.ts         # Centralized TypeScript interfaces
        ├── db/db.ts               # IndexedDB CRUD storage layer
        ├── services/ollama.ts     # Local AI service client
        └── components/            # KanbanBoard, JobModal, AIAssistant, etc.
```

---

## 🛠️ Architecture & Frameworks

### 1. B.L.A.S.T. System Architecture Framework
- **Boundaries**: Decoupled presentation layer (React SPA) from local AI inference (`/api/ollama` proxy).
- **Links**: Connection handshake to local Ollama (`localhost:11434`) with model fallback detection.
- **Assets**: Structured markdown rendering and visual Kanban card statuses.
- **Storage**: Browser IndexedDB (`idb` v8) — zero external server storage.
- **Triggers**: Reactive UI drag events, search filters, and single-click AI generation calls.

### 2. A.N.T. 3-Layer Storage Protocol
- **Layer 1 — App State**: In-memory React state for immediate UI feedback and drag animations.
- **Layer 2 — Native DB**: Transactional client-side persistence via IndexedDB (`roleradar_db`).
- **Layer 3 — Local LLM**: Offline AI inference via local Ollama daemon (`deepseek-r1:8b`).

---

## ✨ Key Features

- 📌 **6-Stage Kanban Pipeline**: Drag-and-drop cards between Wishlist, Applied, Follow-up, Interview, Offer, and Rejected.
- 🤖 **Local AI Assistant**: JD skill extractor, technical interview preparation, and follow-up email writer (runs 100% offline).
- ⚠️ **Smart Follow-Up Alerts**: Automated warning badge on applications in "Applied" state for $\ge 7$ days.
- 📊 **Dashboard Metrics**: Real-time stats for Active Applications, Follow-ups needed, Interviews, and Offer rate.
- 🔍 **Multi-Filter & Search**: Stack text search, status filters, and tech stack tags (`React`, `Node`, `Python`, etc.).
- 📦 **JSON Backup & Restore**: Full local export/import capability for data portability.

---

## 🚀 Local Quick-Start

### 1. Prerequisites
- [Node.js](https://nodejs.org/) v18+
- [Ollama](https://ollama.ai/) running locally with model pulled:
  ```bash
  ollama pull deepseek-r1:8b
  ```

### 2. Launch Application
```bash
cd roleradar-ai
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📖 Documentation & Memory Specs

Detailed architectural specifications and system tracking logs are stored in [`docs/`](./docs/):

- 📜 [**Project Constitution (`docs/LLM.md`)**](./docs/LLM.md) — Data schema contracts & behavioral invariants.
- 🚀 [**B.L.A.S.T. Framework (`docs/B.L.A.S.T.md`)**](./docs/B.L.A.S.T.md) — System architecture specifications.
- 🔍 [**Engineering Findings (`docs/findings.md`)**](./docs/findings.md) — Technical discovery, constraints, & decisions.
- 📈 [**Progress Tracker (`docs/progress.md`)**](./docs/progress.md) — Detailed execution log.
- 📋 [**Task Plan (`docs/task_plan.md`)**](./docs/task_plan.md) — Feature checklist & roadmap.
- 📱 [**Application README (`roleradar-ai/README.md`)**](./roleradar-ai/README.md) — Detailed UI guide & setup instructions.
