# 🧪 AI Tester Blueprint Portfolio

Welcome to my unified QA engineering and AI testing learning repository. This dashboard tracks my modular learning track for advanced, hallucination-free validation frameworks powered by local LLMs and structured prompt engineering.

---

## 📊 Portfolio Overview

| Module | Status | Engine | Framework | Input | Output |
|:-------|:------:|:------:|:---------:|:-----:|:------:|
| **01** — AI-Driven Test Plan Generator | 🟢 **Complete** | `qwen2.5-coder:14b` via Ollama | RICE-POT + Pramod Dutta Ruleset | Restful Booker API Spec | `Final_Test_Plan.md` |
| **02** — AI-Driven Test Case Generator | 🟢 **Complete** | `qwen2.5-coder:14b` via Ollama | RICE-POT + Pramod Dutta Ruleset | VWO Login Dashboard PRD | `Final_Test_Cases.csv` + `Final_Test_Cases.md` |
| **03** — Playwright API Test Framework | 🟢 **Complete** | Playwright + TypeScript | RICE-POT + Controller Pattern + Anti-Hallucination Audit | `skill.md` specification | `playwright_api_framework/` |
| **04** — Jira QA Test Plan Agent | 🟢 **Complete** | `openai/gpt-oss-120b` via Groq | B.L.A.S.T. Framework + Architecture SOPs | JIRA Issue ADF description | `output/test-plan-*.md` + Dashboard |

---

## 🛠️ Common Architecture

<details>
<summary><b>🔍 Click to expand: RICE-POT Prompt Engineering Framework</b></summary>

Every module follows the **RICE-POT** deterministic pipeline to ensure high-fidelity extraction without generative AI inaccuracies:

| Letter | Component | Purpose |
|:------:|:----------|:--------|
| **R** | **Role** | The persona the AI adopts (Senior QA Lead, Expert Tester) |
| **I** | **Instructions** | Step-by-step commands + mandatory "Don't" rules |
| **C** | **Context** | Strict binding to the source data file |
| **E** | **Examples** | Sample row/format that guides the output style |
| **P** | **Parameters** | Quality, accuracy, and style constraints |
| **O** | **Output** | The exact artifact and format to produce |
| **T** | **Tone** | Technical, precise, enterprise-grade |

</details>

<details>
<summary><b>🛡️ Click to expand: Anti-Hallucination Guardrails</b></summary>

An audit layer driven by strict verification rulesets authored by **Pramod Dutta (Principal SDET)** ensures:

- **Zero invented features** — no made-up APIs, error codes, or UI elements
- **Full traceability** — every assertion maps back to provided input
- **Honest fallbacks** — `"Insufficient information to determine"` when data is missing
- **Confidence labeling** — inferred details marked `"Inference (low confidence)"`
- **Deterministic output** — same input always produces same output

Each module runs a **4-step self-validation audit**: Verified Facts → Missing/Unknown Info → Generated Output → Self-Validation Check.

</details>

<details>
<summary><b>🚀 Click to expand: B.L.A.S.T. System Architecture Framework</b></summary>

The **B.L.A.S.T.** system design framework governs how the testing engines, server proxies, and visual rendering cards operate under modular, decoupled boundaries:

| Letter | Component | Purpose |
|:------:|:----------|:--------|
| **B** | **Boundaries** | Decoupling presentation layers from proxy controllers (e.g., React UI + Express Backend). |
| **L** | **Links** | Standardizing secure API credential waterfalls and real-time connection handshakes. |
| **A** | **Assets** | Serving clean, formatted rendering panes (e.g., markdown lists, preconditions tables). |
| **S** | **Storage** | Syncing persistent user overlays without local token leakages. |
| **T** | **Triggers** | Automating dev/prod bootstrap compilation routes concurrently. |

</details>

---

## 📂 Modules

<details open>
<summary><b>📋 Module 01 — AI-Driven Test Plan Generator</b> <code>01_test_plan_generator/</code></summary>

<br>

Parses raw project documentation (Restful Booker API spec) into a production-grade, hallucination-free test plan.

**Milestones:**

| Milestone | Status | Framework |
|:----------|:------:|:---------:|
| Data Extraction | 🟢 **100% Complete** | RICE-POT |
| Anti-Hallucination Audit | 🟢 **Passed** | Pramod Dutta Ruleset |
| Target Artifact Generated | 🟢 **Ready** — `Final_Test_Plan.md` | Standard STLC |

```text
01_test_plan_generator/
├── README.md
├── docs/
│   ├── Anti_Hallucinations_Rules.md
│   ├── Source_Context.md
│   └── continue_execution_proof.jpg
└── output/
    └── Final_Test_Plan.md
```

👉 [View module details →](./01_test_plan_generator/README.md)

</details>

<details open>
<summary><b>📋 Module 02 — AI-Driven Test Case Generator</b> <code>02_test_case_generator/</code></summary>

<br>

Parses a Product Requirements Document (VWO Login Dashboard) into 20 traceable, hallucination-free test cases.

**Milestones:**

| Milestone | Status | Framework |
|:----------|:------:|:---------:|
| Data Extraction | 🟢 **100% Complete** | RICE-POT |
| Anti-Hallucination Audit | 🟢 **Passed** | Pramod Dutta Ruleset |
| Target Artifact Generated | 🟢 **Ready** — `Final_Test_Cases.csv` + `Final_Test_Cases.md` | RICE-POT + STLC |

```text
02_test_case_generator/
├── README.md
├── docs/
│   ├── Anti_Hallucinations_Rules.md
│   ├── Source_Context.md
│   ├── login_proof_screenshot.png
│   └── continue_execution_proof.png
└── output/
    ├── Final_Test_Cases.csv
    └── Final_Test_Cases.md
```

👉 [View module details →](./02_test_case_generator/README.md)

</details>

<details open>
<summary><b>📋 Module 03 — Playwright API Test Framework</b> <code>03_playwright_api_framework/</code></summary>

<br>

Enterprise-grade, type-safe API testing framework built on Playwright's native `APIRequestContext` with zero external HTTP clients. Scaffolded via the RICE-POT prompt framework using a `skill.md` specification and audited against the Anti-Hallucination Ruleset.

**Milestones:**

| Milestone | Status | Framework |
|:----------|:------:|:---------:|
| RICE-POT Scaffolding | 🟢 **100% Complete** | RICE-POT + `skill.md` |
| Anti-Hallucination Audit | 🟢 **Passed** | Pramod Dutta Ruleset |
| Framework Implementation | 🟢 **Ready** — `playwright_api_framework/` | Controller Pattern + Playwright |

```text
03_playwright_api_framework/
├── README.md
├── Anti_Hallucinations_Rules.md
├── skill.md
└── playwright_api_framework/
    ├── core/
    │   ├── base.client.ts       # Typed GET/POST/PUT/DELETE/PATCH
    │   └── env.config.ts        # Pre-flight env validator
    ├── api/
    │   ├── types/               # Request/response interfaces (no `any`)
    │   ├── auth.client.ts       # OAuth2 client-credentials grant
    │   └── user.client.ts       # /users controller
    ├── data/
    │   └── user.factory.ts      # Pure builder function
    ├── fixtures/
    │   └── api.fixture.ts       # Custom test base — auto-auth, auto-log on failure
    └── tests/
        ├── users.spec.ts        # Authenticated CRUD scenarios
        └── smoke.spec.ts        # Plumbing verification
```

**Key highlights:**

- **Zero `any` types** — every request/response has a dedicated interface
- **Fixture-based auth** — bearer token injected per-test via custom Playwright fixture
- **Auto-failure logging** — full request/response JSON attached to HTML report on failure
- **Parallel-safe** — `fullyParallel: true`, no shared state between tests
- **CI-ready** — 4-shard matrix with npm cache, secrets, and HTML report artifact

👉 [View module details →](./03_playwright_api_framework/README.md)

</details>

<details open>
<summary><b>📋 Module 04 — Jira QA Test Plan Agent</b> <code>04_jira_ai_agent/</code></summary>

<br>

On-demand Jira issue fetcher and anti-hallucination QA test plan compiler. Reorganized into a decoupled full-stack architecture (Vite + React frontend and Express server proxy) with secure local environment variables, visual screenshots walkthrough, and connection diagnostic handshakes.

**Milestones:**

| Milestone | Status | Framework |
|:----------|:------:|:---------:|
| Data Normalization (ADF to Text) | 🟢 **100% Complete** | Jira REST API v3 Client |
| Anti-Hallucination Audit | 🟢 **Passed** | B.L.A.S.T. framework prompts |
| Full-Stack Dashboard Implementation | 🟢 **Ready** — Vite React + Express | Glassmorphic Dark Design |

```text
04_jira_ai_agent/
├── backend/                             # Express Server Module
│   ├── server.js                        # CORS proxy and routes mapping
│   └── src/services/                    # Jira, Groq, & Test Plan services
├── client/                              # Decoupled Vite React Client
│   ├── src/                             # App.jsx viewport and index.css
│   └── vite.config.js                   # Client dev build proxy server mapping
├── docs/                                # BLAST guidelines and Architecture SOPs
│   ├── B.L.A.S.T.md                     # BLAST Protocol standards specs
│   ├── images/                          # Dashboard screenshots
│   └── architecture/                    # Jira fetch & Anti-hallucination SOPs
├── .env.example                         # Pristine configuration template
├── .gitignore                           # Exclusions matrix
└── README.md                            # Dedicated setup guide manual
```

**Key highlights:**

- **Decoupled Architecture** — Vite SPA frontend mapping proxy requests to Express service modules
- **Interactive Viewport** — Centered glassmorphic error panel overlays and live connection state badging
- **Security Exclusion Matrix** — Strict `.gitignore` boundaries blocking env configs and local temp files
- **Defensive Filtering** — Trim boundaries avoiding trailing empty bullet points in exported files

👉 [View module details →](./04_jira_ai_agent/README.md)

</details>

---

## 🚀 Getting Started

### Prerequisites

- [Ollama](https://ollama.ai/) installed locally
- `qwen2.5-coder:14b` model pulled (`ollama pull qwen2.5-coder:14b`)
- [Node.js](https://nodejs.org/) 18+ (for Module 03)
- Target project documentation (PRD, API spec, screenshots)

### Running a Module

**Modules 01–02** are **prompt engineering pipelines** — no code to run:

1. **Clean** your source documentation into `docs/Source_Context.md`
2. **Prompt** the local LLM using the RICE-POT template (included in each module's README)
3. **Validate** the output against `docs/Anti_Hallucinations_Rules.md`
4. **Review** the artifact in `output/`

**Module 03** is a **code framework** — run tests directly:

```bash
cd 03_playwright_api_framework/playwright_api_framework
npm install
cp .env.example .env        # Fill in your environment values
npm test                    # Run all tests
```

**Module 04** is a **full-stack application** — run dev servers concurrently:

```bash
cd 04_jira_ai_agent
npm install
cp .env.example .env        # Fill in your environment values
npm run dev                 # Start React and Express concurrently
```

---

## 📄 License

This project is for learning and portfolio purposes.
