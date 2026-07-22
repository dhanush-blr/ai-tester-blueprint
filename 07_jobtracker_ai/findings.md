# findings.md — RoleRadar AI: Constraints & Discoveries

> **Updated:** 2026-07-22

---

## 🔍 Technical Constraints

### IndexedDB (`idb`)
- Uses `idb` v8 wrapper for Promise-based IndexedDB access.
- The `openDB` call must specify version and `upgrade` callback for schema migrations.
- Auto-increment keys via `{ keyPath: 'id', autoIncrement: true }`.
- All reads/writes are async and must be awaited.
- IndexedDB is origin-bound — data persists between browser sessions on the same localhost origin.

### Ollama CORS
- Browser `fetch` to `http://localhost:11434` will fail with CORS errors in dev.
- **Solution:** Vite `server.proxy` rewrites `/api/ollama` → `http://localhost:11434`, stripping the prefix.
- In production (static files), users must either run a CORS-enabled Ollama or use a local HTTP server.
- Ollama must be running with `OLLAMA_ORIGINS=*` env var or the default localhost origin allowance.

### `@dnd-kit` Architecture
- `DndContext` wraps the entire board; `useDroppable` on columns; `useDraggable` on cards.
- Drag events provide `active.id` (card id) and `over.id` (target column/status).
- On `onDragEnd`, call `updateJobStatus(cardId, newStatus)` if column changed.
- `@dnd-kit/sortable` is used for within-column reordering (optional — implemented as bonus).

### Tailwind v3
- Using Tailwind v3 with JIT mode (default).
- Dark mode via `class` strategy — `<html class="dark">` applied always (forced dark).
- Custom colors added to `tailwind.config.js` extend.

---

## 📌 Key Decisions

| Decision | Rationale |
|----------|-----------|
| Vite over CRA | Faster HMR, native ESM, built-in proxy support |
| `idb` over raw IndexedDB | Promise-based API, typed, cleaner migration system |
| `@dnd-kit` over `react-dnd` | Modern, accessible, TypeScript-native, no HTML5 DnD backend quirks |
| Tailwind CSS | Rapid utility-first styling with dark mode support |
| `stream: false` for Ollama | Simplifies response handling — single JSON response vs streaming chunks |
| Forced dark mode | The target user (developer) prefers dark UI |
| JSON export format | Human-readable, importable, version-tagged for future migrations |

---

## ⚠️ Known Edge Cases

1. **Empty DB on First Load:** `getAllJobs()` returns `[]` — board renders empty columns gracefully.
2. **Ollama Unavailable:** All AI buttons show error toast "Ollama not running" — no app crash.
3. **Import Malformed JSON:** File reader catches parse errors, shows user-friendly error message.
4. **Long Job Descriptions:** Cards truncate `notes` to 2 lines with `line-clamp-2`.
5. **Tech Stack with Spaces:** Tags are trimmed before storage (`tag.trim().filter(Boolean)`).
6. **Drag to Same Column:** `onDragEnd` checks if source status === target status; no-op if same.
