# Findings & Discovery - Test Strategy Builder AI Agent

This document compiles technical insights, environment discoveries, architectural constraints, and research details collected throughout the development lifecycle.

---

## Phase 0 & Phase 1 Ingestion Findings

### 1. Ingestion Audit
*   **B.L.A.S.T. Protocol Guidelines:** Fully parsed. Imposes a strict initialization check: coding of operational logic (e.g., React code, Express server routes, or integration connectors) is forbidden until discovery questions are completed and the input/output schemas are defined in `LLM.md`.
*   **Objective Specification Audit:** The original `Objective.md` file in `05_test_strategy_builder/` was empty. The project scope has been derived from the prompt description, specifying a full-stack, decoupled application:
    *   **Frontend configuration panel & Settings overlay**
    *   **Backend Express layer proxy**
    *   **Target Groq LLM pipeline**
    *   **Markdown preview rendering engine**

### 2. Architectural Constraints
*   **Decoupled Frontend/Backend:** The React frontend (client) and Express proxy (server) run on separate ports/processes, communicating via a proxy or clean API layer.
*   **Zero-CORS Client Communication:** To bypass browser-side CORS preflights or cross-domain issues when forwarding parameters, the React application communicates exclusively with the Express proxy server, which forwards authorized LLM completion commands to the external Groq endpoints.
*   **Settings State Persistence:** LLM configuration overlays (model selection, temperature, keys) persist across sessions, stored in local storage on the client side and passed via custom request headers to the backend proxy.

---

## Phase 2 Scaffolding & Integration Discoveries

### 3. Connection Diagnostics & Fallback Configuration
*   **Problem:** Hardcoding API keys or endpoints creates potential leakage risk and limits custom tenant configurations.
*   **Solution:** Built dynamic headers resolving flow in `server.js`: prioritizing incoming request headers (`x-jira-url`, `x-jira-email`, `x-jira-token`, `x-groq-key`, `x-groq-model`) over local process environment fallbacks (`process.env.JIRA_URL`, etc.). This isolates configurations in client memory (`localStorage`).
*   **Outcome:** Multiple testers can use the Strategy Builder simultaneously using their own API credentials without cross-contaminating environmental settings.

### 4. Single-Port Proxy Configuration
*   **Problem:** Handling local routing differences between Vite development client (`port 5173`) and Express backend (`port 5002`).
*   **Solution:** Embedded custom proxy directives in `client/vite.config.js` targeting `http://localhost:5002` for all `/api` calls. In production, the Express server catches non-api routes using negative-lookahead expressions and serves React's static production bundle from `client/dist`.

### 5. Markdown Table Rendering Resolution
*   **Problem:** The default configuration of `react-markdown` (specifically versions 9/10) parses tables as raw string blocks with vertical boundary lines (`|`), breaking structured boardroom-ready presentations.
*   **Solution:** Installed `remark-gfm` inside the client dependencies and passed it inside the `remarkPlugins` property array mapping of the `ReactMarkdown` component.
*   **Outcome:** Restores high-fidelity rendering of tabular data for the Tech Stack mapping, Test Methodology matrix, and Risk & Mitigation matrix blocks.

### 6. Security Isolation of Credentials
*   **Problem:** High risk of exposing Atlassian API tokens and Groq API keys if local environment variables are tracked by Git.
*   **Solution:** Standardized git exclusions inside a root `.gitignore` matrix mapping out `.env` variable overrides, client dependency subfolders, production output assets, and local generated strategy files. Generated a clean `.env.example` template matching parameter expectations.

### 7. Vercel Serverless & Monorepo Configuration
*   **Problem:** Routing requests dynamically to an Express backend proxy and a React frontend on a unified Vercel domain without port collisions.
*   **Solution:** Configured `vercel.json` defining `@vercel/node` build runner for the Express server and `@vercel/static-build` for the React client. Handled routing mapping `/api/*` requests to the serverless function and `/*` to static assets.
*   **Outcome:** Full-stack application compiled, bundled, and hosted in Washington D.C., USA (`iad1`). Live production alias set up at `https://05teststrategybuilder.vercel.app`. Finalized JIRA error-handling validation layouts successfully compiled and synced to the Vercel production edge.


### 8. Modular Documentation & Root Catalog Sync
*   **Problem:** Mismatches between independent application folder setups and parent repository tracking registries.
*   **Solution:** Authored modular documentation with architecture flowcharts and mock data shapes. Linked runtime port variables (`5002`) and Vercel production hosting targets directly in the root portfolio ledger.
*   **Outcome:** Embedded high-fidelity visual screenshot assets mapping the welcome state, credentials configuration overlay modal, and KAN-5 preview strategy output inside subproject README documentation.

### 10. Code Lifecycle Staging & Repository Git Synchronization
*   **Problem:** Managing untracked monorepo subprojects without missing configurations or manual ledgers.
*   **Solution:** Audited status maps via Git index validation commands, staged all source files, documentation manuals, and templates, and synced workspace states with remote repositories.



### 9. Enhanced JIRA Error UI Mappings
*   **Problem:** Generic React error cards outputting raw API messages do not assist users in debugging credential or JIRA ticket formatting parameters.
*   **Solution:** Scaffolded conditional check triggers in the error presentation card. Added distinct JIRA diagnostic checkpoints (Formatting checks, Existence verification, Access permissibility) mapping error strings to friendly troubleshooting lists.

### 10. High-Fidelity Light/Dark Theme Switcher
*   **Problem:** Hardcoded color assignments inside stylesheets block multi-theme support or create visual inconsistencies in light viewports.
*   **Solution:** Extracted hex/rgba properties to centralized root variables mapping body background gradients, card borders, scrollbars, inputs, buttons, and Markdown body overrides. Connected toggles using DOM attribute wrappers synced to active React hooks and localStorage cache.







