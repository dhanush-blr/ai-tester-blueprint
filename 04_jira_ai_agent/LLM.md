# LLM.md - Project Constitution

## Data Schemas

### 1. Normalized Jira Issue Schema (Input)
This is the shape of the data returned by the Express proxy after fetching and parsing the Jira Issue via REST API:

```json
{
  "key": "VWO-48",
  "summary": "Implement new auth login flow",
  "description": "Plain text description flattened from ADF (Atlassian Document Format)",
  "issueType": "Story",
  "status": "In Progress",
  "priority": "Medium",
  "components": ["Authentication"],
  "labels": ["security", "refactor"],
  "fixVersions": ["v2.4.0"],
  "reporter": "dhanush",
  "assignee": "dhanush"
}
```

### 2. LLM Test Plan Payload Schema (Output)
The LLM must return a formal, deterministic JSON response of this exact shape. This will be parsed and rendered as Markdown in the React frontend:

```json
{
  "jiraId": "VWO-48",
  "generatedAt": "2026-07-15T13:22:53Z",
  "testPlan": {
    "summary": "string - Brief QA summary of the issue features",
    "scope": {
      "inScope": ["string - feature items under test"],
      "outOfScope": ["string - items excluded from testing"]
    },
    "testScenarios": [
      {
        "id": "QA-TS-001",
        "title": "string - Scenario title",
        "type": "string - e.g., Functional / Integration / Security",
        "preconditions": ["string"],
        "steps": ["string - step 1", "string - step 2"],
        "expectedResult": "string - expected behavior",
        "automationFeasibility": "High | Medium | Low"
      }
    ],
    "edgeCases": [
      {
        "id": "QA-EC-001",
        "scenario": "string - Edge case condition",
        "mitigation": "string - expected system handle/mitigation"
      }
    ],
    "gapsAndQuestions": [
      "string - explicit list of TBDs/data gaps in the source ticket"
    ]
  }
}
```

---

## Behavioral Rules

1. **Strict Development Freeze (Phase 1)**: Completed. Transitioning into Phase 2.
2. **Deterministic Response**: All LLM interactions must enforce `response_format: { type: "json_object" }` or structural system prompts to guarantee JSON parsing success on the backend proxy.
3. **Anti-Hallucination Guardrails**:
   - If technical specs, variables, or endpoints are not present in the Jira issue source data, the LLM must mark the field/scenario as `TBD` or document it in the `gapsAndQuestions` list.
   - Generative fabrication of mock endpoints, variables, database tables, or functional properties is strictly forbidden.
4. **SOP Templates**: The generated plan must structure sections strictly using QA templates defined in the Layer 1 SOP (located in `docs/architecture/`).

---

## Architectural Invariants

- **Credential Flow**: Local `.env` values are fallback parameters. Express routes must accept overrides via HTTP headers (`X-Jira-URL`, `X-Jira-Email`, `X-Jira-Token`, `X-Groq-Key`) passed from the client frontend Settings tab.
- **File System**: Local file writing (`/api/save`) is disabled in production to comply with serverless environments. Client downloads must occur inside the browser to save files as `output/test-plan-<jiraId>.md`.
- **Workbench Isolation**: Any backend temporary files must reside under `.tmp/`.

---

## Maintenance Log

| Date | Phase | File Paths / Changes | Description |
|:---|:---|:---|:---|
| 2026-07-15 | Protocol 0 | `task_plan.md`, `findings.md`, `progress.md`, `LLM.md` | Initialized tracking files and setup project constitution. |
| 2026-07-15 | Phase 2 | `tools/jiraClient.js`, `tools/groqClient.js`, `.env` | Created diagnostic scripts and template configurations; verified connection errors. |
| 2026-07-15 | Phase 3 | `architecture/jira_fetch_sop.md`, `architecture/test_plan_sop.md`, `tools/testPlan.js`, `server.js` | Drafted fetching and test planning SOPs; coded LLM core and Express proxy. |
| 2026-07-15 | Phase 4 | `client/src/App.jsx`, `client/src/index.css`, `client/vite.config.js` | Built glassmorphic React frontend with credential override settings panel, log load animation, and browser MD downloads. |
| 2026-07-15 | Phase 5 | `package.json` | Configured concurrency build and launch scripts. |
| 2026-07-15 | Phase 5 (Self-Annealing) | `client/src/App.jsx`, `tools/testPlan.js` | Applied empty-element list filtering to fix blank bullet point displays. |
| 2026-07-15 | Phase 4/5 (Stylize) | `client/src/App.jsx` | Integrated react-markdown package for high-fidelity Markdown parsing in UI. |
| 2026-07-15 | Phase 5 (Self-Annealing) | `tools/jiraClient.js` | Parsed JIRA's raw HTTP error JSON to show clean error statements in the UI. |
| 2026-07-15 | Phase 4/5 (Stylize) | `client/src/App.jsx` | Integrated renderErrorMessage sanitizer mapping failed issue requests to a polished glassmorphic layout. |
| 2026-07-15 | Phase 4/5 (Stylize) | `client/src/App.jsx` | Repositioned error box from the narrow control sidebar to the main output viewport card with a dedicated centered layout. |
| 2026-07-15 | Phase 4/5 (Stylize) | `client/src/index.css` | Applied vertical alignment properties (line-height, box-sizing, and matching padding) to inputs. |
| 2026-07-15 | Phase 4/5 (Stylize) | `client/src/App.jsx` | Updated initial JIRA ID state to empty string and added descriptive placeholder attribute. |
| 2026-07-15 | Phase 4/5 (Stylize) | `client/src/App.jsx` | Added a Settings modal Clear button and handleClearSettings state flush routine. |
| 2026-07-15 | Phase 4/5 (Stylize) | `client/src/App.jsx` | Completed final unified optimization to route clean error layouts to output card. |
| 2026-07-15 | Phase 4/5 (Stylize) | `client/src/App.jsx` | Replaced raw connection status text with premium colored badge indicators. |
| 2026-07-15 | Phase 4/5 (Stylize) | `client/src/App.jsx` | Optimized Active Configuration sidebar copy to use enterprise terms like Gateway and Instance. |
| 2026-07-15 | Phase 4/5 (Architect) | Full repository restructured to standard decoupled React (Vite) + Express layout | Migrated server and services to `backend/` and documentation to `docs/`. |
| 2026-07-15 | Phase 5 (Trigger) | `README.md` | Created a dedicated, isolated project setup manual at the workspace root. |
| 2026-07-15 | Phase 5 (Trigger) | `README.md` | Integrated interactive details, GFM badges, warning callouts, and dashboard screenshots under docs/images. |
| 2026-07-15 | Phase 5 (Trigger) | `docs/prompt.md` | Updated system prompts registry to chronicle all system prompts used to compile the project. |
| 2026-07-15 | Phase 5 (Security) | `.gitignore`, `backend/.gitignore`, `.env.example` | Established secret leakage exclusion filters and generated blank credentials templates. |
| 2026-07-15 | Phase 5 (Trigger) | `../README.md` | Registered Module 04 (Jira QA Test Plan Agent) in portfolio overview table, milestones, and setup scripts. |
| 2026-07-15 | Phase 5 (Trigger) | `../README.md` | Documented B.L.A.S.T. framework under parent Common Architecture details. |
| 2026-07-15 | Phase 5 (Trigger) | `README.md` | Documented RICE-POT and B.L.A.S.T. engineering methodologies and zero-hallucination pipelines. |
| 2026-07-15 | Phase 5 (Deployment) | Version Control | Committed all decoupled full stack developments and pushed to remote GitHub master branch. |




















