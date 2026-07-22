# LLM.md — RoleRadar AI: Project Constitution

> **Status:** Active | **Version:** 1.0.0 | **Last Updated:** 2026-07-22

---

## 🏛️ ARCHITECTURAL INVARIANTS (Laws — Never Break These)

1. **Local-First**: No data leaves the browser. No external API calls except to `localhost:11434` (Ollama).
2. **Data-First**: IndexedDB schema is defined and immutable before any component code is written.
3. **Deterministic State**: All state mutations go through the `db.ts` service layer. Components never write to IndexedDB directly.
4. **Type Safety**: Every function, prop, and event handler is fully typed in TypeScript. `any` is forbidden.
5. **Schema Migrations**: All IndexedDB version upgrades must use the `onupgradeneeded` pattern via `idb`.
6. **AI is Optional**: All AI features degrade gracefully if Ollama is not running. The app must be 100% functional without AI.
7. **Zero Console Errors**: Production build must emit zero TypeScript errors and zero console errors.
8. **Default Local LLM**: The default Ollama model endpoint must target `deepseek-r1:8b`. Switching models requires changing only the `ACTIVE_MODEL` constant in `src/services/ollama.ts`. Never hardcode model strings in prompt functions.

---

## 📐 DATA SCHEMA (IndexedDB — `roleradar-db`, Version 1)

### Store: `jobs`

```typescript
interface JobEntry {
  id?: number;                    // Auto-incrementing primary key (IDBKeyPath)
  company: string;                // Required. e.g., "Google", "Flipkart"
  role: string;                   // Required. e.g., "Senior SDE-2", "QA Lead"
  jobUrl: string;                 // Optional. Clickable link to JD
  resumeUsed: string;             // e.g., "Automation_Lead_v2", "DevOps_Resume"
  dateApplied: string;            // ISO 8601 timestamp. Auto-set on create, editable.
  expectedSalary: string;         // e.g., "₹25-30 LPA", "$120k"
  status: JobStatus;              // Enum — see below
  techStack: string[];            // Array of tags e.g., ["React", "Node", "AWS"]
  jobDescription: string;         // Full JD text (used for AI analysis)
  notes: string;                  // Free-form personal notes
  createdAt: string;              // ISO timestamp — set once on create, never editable
  updatedAt: string;              // ISO timestamp — updated on every save
}

type JobStatus =
  | 'Wishlist'
  | 'Applied'
  | 'Follow-up'
  | 'Interview'
  | 'Offer'
  | 'Rejected';
```

### IndexedDB Config
- **DB Name:** `roleradar-db`
- **Store Name:** `jobs`
- **Version:** `1`
- **KeyPath:** `id` (autoIncrement: true)
- **Indexes:**
  - `by-status` on `status` (non-unique) — for column queries
  - `by-company` on `company` (non-unique) — for search
  - `by-dateApplied` on `dateApplied` (non-unique) — for follow-up calculations

---

## 🤖 AI SERVICE SCHEMA (Ollama — Local llama3)

### Endpoint
```
POST http://localhost:11434/api/generate
(proxied via Vite → /api/ollama/api/generate)
```

### Request Shape
```typescript
interface OllamaRequest {
  model: 'llama3';
  prompt: string;
  stream: false;
}
```

### Response Shape
```typescript
interface OllamaResponse {
  model: string;
  response: string;
  done: boolean;
}
```

### AI Actions
| Action | Trigger | Prompt Template |
|--------|---------|-----------------|
| `extractSkills` | User clicks "Extract Skills" | Analyze JD, return top 10 technical skills as JSON array |
| `generateInterviewQuestions` | User clicks "Interview Prep" | Generate 3 tailored technical interview questions |
| `draftFollowUpEmail` | User clicks "Draft Email" | Write a professional recruiter follow-up email |

---

## 🎨 STATUS STYLE MAP

| Status | Border Color | Badge Color |
|--------|-------------|-------------|
| Wishlist | `border-l-amber-500` | `bg-amber-500/20 text-amber-300` |
| Applied | `border-l-blue-500` | `bg-blue-500/20 text-blue-300` |
| Follow-up | `border-l-purple-500` | `bg-purple-500/20 text-purple-300` |
| Interview | `border-l-orange-500` | `bg-orange-500/20 text-orange-300` |
| Offer | `border-l-emerald-500` | `bg-emerald-500/20 text-emerald-300` |
| Rejected | `border-l-rose-500` | `bg-rose-500/20 text-rose-300` |

---

## ⚙️ BUSINESS RULES

1. **Auto Follow-Up Flag:** If `status === 'Applied'` AND `daysSince(dateApplied) >= 7`, render `⚠️ Follow Up` badge on the card.
2. **Date Applied Default:** When creating a new job, `dateApplied` defaults to `new Date().toISOString()`.
3. **Tech Stack Input:** Tags are entered as comma-separated values and stored as `string[]`.
4. **Backup Format:** Export produces a `.json` file with structure `{ exportedAt: ISO, version: 1, jobs: JobEntry[] }`.
5. **Import Validation:** On JSON restore, validate that imported objects conform to the `JobEntry` shape before writing to DB.
6. **Drag and Drop:** Moving a card between columns updates only the `status` field (and `updatedAt`). No other fields change.

---

## 🔧 MAINTENANCE LOG

| Date | Change | Reason |
|------|--------|--------|
| 2026-07-22 | v1.0.0 — Initial constitution | Project inception |
