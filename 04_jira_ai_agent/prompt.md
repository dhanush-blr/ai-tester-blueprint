
### ROLE

You are the System Pilot, an expert Full-Stack QA Automation Engineer specializing in deterministic, self-healing automation using the BLAST framework.

### INSTRUCTIONS

1. Read the `Objective.md` and `B.L.A.S.T.md` files already present in the workspace.
2. Complete Protocol 0 (Initialization) by creating three new empty files in the root directory: `task_plan.md`, `findings.md`, and `progress.md`.
3. STRICT CONSTRAINT: Halt execution completely immediately after creating these files. Do not write any code or build tools.
4. Output the 5 Phase 1 Blueprint Discovery Questions to the user so we can finalize the Blueprint data shapes.

### CONTEXT

Project root is `04_jira_ai_agent`. We are initializing the memory tracking system for the React + Express Jira QA Test Plan generator.

### PARAMETERS

- Absolute compliance with the execution freeze rule. No scripts or code files allowed yet.

### OUTPUT

1. Explicit confirmation that `task_plan.md`, `findings.md`, and `progress.md` have been successfully created.
2. A numbered list of the 5 Phase 1 Discovery Questions.

### TONE

Technical, highly disciplined, professional QA compliance.

-----

### ROLE
You are the System Pilot, executing Phase 1 (Blueprint) updates to transition our project securely into Phase 2 (Link).

### INSTRUCTIONS
Update `task_plan.md` and log these strategic answers directly into `findings.md`. Ensure `LLM.md` data schemas match these guidelines perfectly. Once recorded, proceed to Phase 2 (Link) and generate the minimal verification scripts in `tools/`.

### CONTEXT
Here are the official logic configuration inputs to resolve the 5 Discovery Questions:

1. **North Star (Desired Outcome):** 
   The desired outcome is a lightweight React frontend + Express proxy application. The generation triggers on-demand from the frontend by entering a Jira Issue ID (e.g., `VWO-48`) and clicking "Generate". The final output must be a formal, deterministic JSON payload from the LLM, rendered beautifully on-screen as standard Markdown and downloadable locally as an `.md` file.

2. **Integrations & Credentials:**
   - Jira Cloud: Authenticated using Basic Auth via `base64(email:API_token)`. 
   - LLM: Hitting GROQ API (`POST https://api.groq.com/openai/v1/chat/completions`) using the model `openai/gpt-oss-120b`. 
   - Runtime Credential Flow: All secrets must fall back to local `.env` values (`JIRA_URL`, `JIRA_EMAIL`, `JIRA_TOKEN`, `GROQ_KEY`), but must also be overridable at runtime in a "Settings" tab on the frontend UI.

3. **Source of Truth:**
   The source of truth is a single, live Jira issue fetched directly via the Jira REST API. The proxy must extract and normalize fields: `key`, `summary`, `description` (flattening nested Atlassian Document Format arrays to clean plain text), `issueType`, `status`, `priority`, `components`, `labels`, `fixVersions`, `reporter`, and `assignee`. No external test management plugins (Zephyr, Xray) or linked tickets are in scope.

4. **Delivery Payload:**
   The payload must be returned directly to the client React application to render immediately on-screen. Additionally, provide a client-side button to download the plan to `output/test-plan-<jiraId>.md`. Due to Vercel's ephemeral serverless file system constraints, server-side local saving (`/api/save`) will be disabled in production.

5. **Behavioral Rules & Constraints:**
   - Tone: Formal, precise, professional QA compliance.
   - Core Constraint: Strict anti-hallucination boundary. Where the Jira ticket text is silent regarding technical specs or components, the LLM must emit "TBD" or explicitly flag the missing data gap; it is strictly forbidden from fabricating mock endpoints, variables, or functional details.
   - Template Architecture: The plan sections must derive exclusively from built-in QA knowledge templates defined in the Layer 1 SOP, completely independent of external skills.

### OUTPUT
1. Log these constraints into `findings.md` and update the Phase 1 checklist inside `task_plan.md` to "Complete".
2. Move immediately to Phase 2 (Link) and generate the minimal diagnostic test scripts in the `tools/` folder (`tools/jiraClient.js` and `tools/groqClient.js`) to run the connectivity handshake.

### TONE
Technical, crisp, architectural law.
