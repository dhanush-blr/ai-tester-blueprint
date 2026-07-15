# Findings & Discovery

## Phase 1 Discovery Answers

1. **North Star (Desired Outcome):** 
   - Lightweight React frontend + Express proxy application.
   - Triggers on-demand from the frontend by entering a Jira Issue ID (e.g., `VWO-48`) and clicking "Generate".
   - Output: Formal, deterministic JSON payload from the LLM, rendered on-screen as standard Markdown and downloadable locally as an `.md` file.

2. **Integrations & Credentials:**
   - Jira Cloud: Basic Auth using `base64(email:API_token)`.
   - LLM: Groq API (`POST https://api.groq.com/openai/v1/chat/completions`) using the model `openai/gpt-oss-120b`.
   - Credential Flow: Fallback to local `.env` variables (`JIRA_URL`, `JIRA_EMAIL`, `JIRA_TOKEN`, `GROQ_KEY`), overridable at runtime in a frontend "Settings" tab.

3. **Source of Truth:**
   - Single, live Jira issue fetched directly via Jira REST API.
   - Proxy extracts and normalizes fields: `key`, `summary`, `description` (Atlassian Document Format flattened to clean plain text), `issueType`, `status`, `priority`, `components`, `labels`, `fixVersions`, `reporter`, and `assignee`.
   - External plugins/linked tickets are out of scope.

4. **Delivery Payload:**
   - Returned directly to client React app for immediate rendering.
   - Client-side download button to save to `output/test-plan-<jiraId>.md`.
   - Server-side local saving (`/api/save`) is disabled in production due to Vercel serverless environment limits.

5. **Behavioral Rules & Constraints:**
   - Tone: Formal, precise, professional QA compliance.
   - Strict Anti-Hallucination: If technical details/specs are missing from the issue description, LLM must output "TBD" or explicitly flag the missing data gap. Synthesized mock endpoints, variables, or functional details are forbidden.
   - Templates: Derive sections exclusively from built-in QA knowledge templates defined in Layer 1 SOP, independent of external skills.

---

## Technical Discoveries & Learnings

### Atlassian Document Format (ADF) Flattening
- Jira v3 API returns description as a rich-text JSON array. Recursively mapping over nodes of type `text` and inserting newlines on structural block elements (like `paragraph`, `heading`, `listItem`) generates a clean, readable text description suitable for feeding standard LLM text completions.

### Real-Time Diagnostics
- Created a custom diagnostic route (`POST /api/test-connection`) allowing the client frontend Settings tab to check credentials before trigger actions, reducing the rate of LLM completions failures due to malformed header overrides.

### Zero-CORS Proxy Layout
- Passing settings overrides via HTTP headers (`X-Jira-URL`, `X-Jira-Email`, etc.) from React to Express prevents browser-side CORS preflight blockages on Jira Cloud endpoints.

### Anti-Hallucination Prompting Outcomes
- Enforcing `temperature: 0` and strict JSON schemas with `TBD` fallbacks in the prompt results in deterministic QA plans that reflect the actual user story state without hallucinating endpoint routes or external dependencies.

### Defensive List Filtering (Self-Annealing)
- **Problem**: Blank entries or format discrepancies (empty strings, whitespaces, nulls, or unexpected non-string objects) inside JSON arrays resulted in alternating empty list bullets in UI templates and Markdown files.
- **Solution**: Implemented strict defensive type check checks: `typeof item === 'string' && item.trim() !== ""` on all array collections (including `inScope`, `outOfScope`, `preconditions`, `steps`, `edgeCases`, and `gapsAndQuestions`).
- **Outcome**: Isolates valid text content and safely discards empty or corrupted fields without crashing processing loops.

### Rich Markdown Rendering
- **Problem**: The custom regex-based markdown parser was limited to simple rules and prone to parsing bugs under complex nested Markdown structures.
- **Solution**: Installed and integrated the standard `react-markdown` library in the client frontend React workspace.
- **Outcome**: Ensures true, high-fidelity compilation of tables, blocks, blockquotes, and lists in the UI preview pane, eliminating the use of raw `dangerouslySetInnerHTML` injections.

### Polished JIRA Error Handling
- **Problem**: When JIRA issue fetches failed (e.g. 404 Not Found), the application returned raw JSON responses from the Atlassian API directly to the user screen.
- **Solution**: Implemented a JSON error extractor in `tools/jiraClient.js` that checks for `errorMessages` or specific validation mapping blocks.
- **Outcome**: Strips raw brackets and exports clean user-facing feedback statements (e.g. "Issue does not exist or you do not have permission to see it").

### Polished JIRA Error UI Render
- **Problem**: In addition to extracting the API string, the frontend React container rendered raw response text under JIRA 404/403 states, cluttering the UI.
- **Solution**: Programmed a fallback parser `renderErrorMessage` in `App.jsx` to map JIRA error keywords (like "HTTP 404" and "Issue does not exist") to a clean UX message, while shielding raw stack traces.
- **Outcome**: Displays a structured warning: *"🔍 Issue Not Found: The Jira ID you entered does not exist or your API token lacks permissions to see it. Verify the key prefix and project boards."*

### Repositioned UI Error Notification Layout
- **Problem**: Displaying error blocks directly within the narrow control sidebar squished control actions and disrupted dashboard balance.
- **Solution**: Shifted the error rendering block from the sidebar to the right-hand preview card column (`output-card`).
- **Outcome**: Failed generation states now dynamically replace the "No Test Plan Generated Yet" empty state template with a wide, centered glassmorphic alert panel.

### Settings Input Alignment
- **Problem**: Text within modal input fields sat off-center vertically, disrupting design system aesthetics.
- **Solution**: Modified `.input-field` styles in `client/src/index.css` to use matching paddings (`0.75rem 1rem`), `box-sizing: border-box`, and clean `line-height: 1.5` settings.
- **Outcome**: Ensures clean, consistent vertical baseline alignment for all parameters (URLs, passwords, model names) inside configuration panel boxes.

### Empty Default Input State & Placeholders
- **Problem**: Pre-populating the input with "VWO-48" forced users to manually clear the input before searching.
- **Solution**: Reset the initial state hook value to `""` in `App.jsx` and added a clean, descriptive placeholder attribute: `placeholder="Enter Jira Issue ID (e.g., KAN-4)"`.
- **Outcome**: Yields a clean, intuitive form state on loading without requiring manual field clearing.

### Settings Modal Reset Option
- **Problem**: Resetting configuration settings required users to manually highlight and clear five individual input boxes.
- **Solution**: Added a left-aligned `"Clear Settings"` button in the modal footer that triggers a `handleClearSettings` state flushing routine.
- **Outcome**: Safely clears all form parameters on the screen without affecting persistent `localStorage` values unless explicitly saved.

### Unified Viewport Error Routing & Rich Rendering Sweep
- **Problem**: Need to verify layout separation of the control panel form from primary output execution areas.
- **Solution**: Audited code blocks in `client/src/App.jsx` to verify complete sidebar error block removal, active `<ReactMarkdown>` rendering, and centered card error panels.
- **Outcome**: Maintains a balanced dashboard experience separating input parameters from final pipeline feedback details.

### Premium Configuration Status Badges
- **Problem**: Raw text messages in the Active Configuration panel disrupted the visual layout and did not align cleanly.
- **Solution**: Defined `renderStatusBadge` in `App.jsx` to parse status strings and return color-coded labels (e.g., `🟢 Connected`, `🔴 Unauthenticated`, or `🔴 Offline`) inside balanced flex row elements.
- **Outcome**: Improves sidebar dashboard aesthetics, preventing text overflows and unifying layout styles.

### Active Configuration Copy Refactoring
- **Problem**: Sidebar parameters relied on engineering developer shorthands (e.g. "Jira URL", "Groq Model") which did not project enterprise QA system quality.
- **Solution**: Refactored JSX dashboard text in `App.jsx` to show: `Target Instance`, `[Environment Defaults]`, `AI Engine`, `Jira Gateway`, and `LLM Gateway`.
- **Outcome**: Integrates professional baseline labels, fitting perfectly inside balanced sidebar grid rows.

### Full-Stack Architecture Restructuring
- **Problem**: Mixing source files, diagnostic scripts, documentation SOPs, and static config assets in the project root disrupted proper project architecture bounds.
- **Solution**: Organized the codebase under decoupled architectural boundaries: `/backend` handles port configurations and route listening, `/backend/src/services` manages API bindings (`jiraService`, `groqService`, `testPlanService`), and `/docs` structures compliance standards.
- **Outcome**: Ensures a clean directory mapping with standardized dependency flows, clean relative paths, and unified scripts.

### Dedicated Workspace Documentation (README)
- **Problem**: Organizing decoupled layers created new path mappings, which required a clear guide to prevent developer setup friction.
- **Solution**: Formulated a root `README.md` covering the system workflow, UI design evolutions, dynamic credentials waterfall, and dual-layer bootstrap startup scripts.
- **Outcome**: Streamlines local environment launches by providing a comprehensive, clean system manual.

### README Visual & Interactive Enhancements
- **Problem**: The text manual was flat and lacked real UI visuals, which made feature verification difficult without launching the app.
- **Solution**: Migrated uploaded screenshots to `/docs/images/` and integrated GFM badges, warning alerts, and collapsible screenshot panels mapping the dashboard.
- **Outcome**: Delivers a highly visual, interactive codebase summary highlighting settings configurations and generated outputs.

### Chronological Prompt Registry
- **Problem**: Context instructions were historically separated across chat boundaries, presenting a gap in reproducibility.
- **Solution**: Created a central document in `docs/prompt.md` mapping BLAST instructions, settings parameters, error bounds, full-stack migrations, and media uploads.
- **Outcome**: Retains complete code history records, assisting future developers in executing corresponding steps.

### Version Control Security & Secret Exposure Controls
- **Problem**: Deploying decoupled source trees to public repositories creates risk of leaking raw credentials, local tokens, or system debug logs.
- **Solution**: Created root-level `.gitignore` and Express-level `backend/.gitignore` templates targeting `.env`, `node_modules/`, `dist/`, and local target output plans. Generated a pristine `.env.example` template with dummy credential placeholders.
- **Outcome**: Completely blocks private tokens from tracking in Git indexes, securing local credential configuration states.

### Portfolio Index Registration
- **Problem**: The unified portfolio index `README.md` at the workspace root lacked setup instructions and directories tracking for Module 04.
- **Solution**: Integrated Module 04 into the master portfolio overview table, mapped its directory tree, and added concurrent development setup bootstrap commands.
- **Outcome**: Centralizes documentation and ensures the entire AI testing portfolio is fully unified.

### Engineering Methodology Documentation
- **Problem**: Developers onboarding to Module 04 lacked details on prompt designs and system architectures that guarantee zero hallucinations.
- **Solution**: Documented RICE-POT prompt parameters and B.L.A.S.T. decoupled framework structures in the module's `README.md`.
- **Outcome**: Formalizes the engineering rigor and deterministic execution standards under a single methodology section.

### Parent README B.L.A.S.T. Framework Registration
- **Problem**: The master portfolio index `README.md` lacked detailed explanations of the B.L.A.S.T. framework under its common architecture sections.
- **Solution**: Added a collapsible explanation panel detailing BLAST (Boundaries, Links, Assets, Storage, Triggers) components alongside RICE-POT.
- **Outcome**: Standardizes framework architectural knowledge at the portfolio root level.

### Version Control Distribution
- **Problem**: Code developments had to be securely packaged, staged, and synchronized against remote tracking streams.
- **Solution**: Added all modified and untracked full-stack files (omitting env values), resolved branch divergence flags, and pushed changes to the remote origin.
- **Outcome**: Safely synchronizes visual readme changes, prompt historical records, and code adjustments.




















