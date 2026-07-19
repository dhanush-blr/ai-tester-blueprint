# 🧪 AI Tester Blueprint Portfolio

[![Modules](https://img.shields.io/badge/modules-6-blue?style=for-the-badge)]()
[![Status](https://img.shields.io/badge/status-100%25_complete-brightgreen?style=for-the-badge)]()
[![LLM](https://img.shields.io/badge/LLM-Ollama_|_Groq_|_OpenAI--compat-orange?style=for-the-badge)]()
[![Framework](https://img.shields.io/badge/framework-RICE--POT_|_B.L.A.S.T.-purple?style=for-the-badge)]()

A unified QA engineering and AI testing learning repository — 6 production-grade modules spanning prompt engineering, automated API testing, full-stack dashboards, and n8n AI agent orchestration.

---

## 📋 Quick Nav

| | | |
|---|---|---|
| [📊 Portfolio Overview](#-portfolio-overview) | [📂 Module 01](#-module-01--ai-driven-test-plan-generator) | [📂 Module 04](#-module-04--jira-qa-test-plan-agent) |
| [🛠️ Architectures](#-architectures) | [📂 Module 02](#-module-02--ai-driven-test-case-generator) | [📂 Module 05](#-module-05--test-strategy-builder-agent) |
| [🚀 Getting Started](#-getting-started) | [📂 Module 03](#-module-03--playwright-api-test-framework) | [📂 Module 06](#-module-06--n8n-ai-orchestration-agents) |

---

## 📊 Portfolio Overview

<details open>
<summary><b>Click to expand: Full module comparison table</b></summary>

| # | Module | Engine | Approach | Input | Output | Type |
|:-:|:-------|:------:|:---------|:-----|:------|:----:|
| [01](#-module-01--ai-driven-test-plan-generator) | Test Plan Generator | Ollama `qwen2.5-coder:14b` | RICE-POT + Anti-Hallucination Rules | API Spec | `Final_Test_Plan.md` | 🧠 Prompt Pipeline |
| [02](#-module-02--ai-driven-test-case-generator) | Test Case Generator | Ollama `qwen2.5-coder:14b` | RICE-POT + Anti-Hallucination Rules | VWO PRD | `Final_Test_Cases.csv/.md` | 🧠 Prompt Pipeline |
| [03](#-module-03--playwright-api-test-framework) | Playwright API Framework | Playwright + TypeScript | Controller Pattern + Audit | `skill.md` spec | `playwright_api_framework/` | 📦 Code Framework |
| [04](#-module-04--jira-qa-test-plan-agent) | Jira QA Agent | Groq `gpt-oss-120b` | B.L.A.S.T. + Jira REST API | Jira Issue ADF | Dashboard + `test-plan-*.md` | 🌐 Full-Stack App |
| [05](#-module-05--test-strategy-builder-agent) | Strategy Builder | Groq `gpt-oss-120b` | B.L.A.S.T. + Jira REST API | Jira Issue ADF | Dashboard + `test-strategy-*.md` | 🌐 Full-Stack App |
| [06](#-module-06--n8n-ai-orchestration-agents) | n8n Agents | Ollama + Groq + OpenAI | n8n Agents + LangChain + Pipeline | Jira / PDF / Chat | JSON Blueprints + Sheets + ZIP | 🤖 n8n Orchestration |

</details>

---

## 🛠️ Architectures

Two architectural frameworks power the portfolio, evolving from prompt-only to full-stack to orchestrated pipelines.

<details>
<summary><b>🔍 RICE-POT — Prompt Engineering Framework</b> <code>Modules 01–03</code></summary>

Deterministic prompt pipeline ensuring high-fidelity extraction without generative AI inaccuracies.

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
<summary><b>🛡️ Anti-Hallucination Guardrails</b> <code>Modules 01–03</code></summary>

Audit layer by **Pramod Dutta (Principal SDET)** enforcing traceable, deterministic AI output:

| Rule | Description |
|:-----|:------------|
| **Zero invented features** | No made-up APIs, error codes, or UI elements |
| **Full traceability** | Every assertion maps back to provided input |
| **Honest fallbacks** | `"Insufficient information to determine"` when data is missing |
| **Confidence labeling** | Inferred details marked `"Inference (low confidence)"` |
| **Deterministic output** | Same input always produces same output |

Each module runs a **4-step self-validation audit**: Verified Facts → Missing/Unknown Info → Generated Output → Self-Validation Check.
</details>

<details>
<summary><b>🚀 B.L.A.S.T. — System Architecture Framework</b> <code>Modules 04–05</code></summary>

Decoupled full-stack design for test engines, proxy servers, and visual rendering:

| Letter | Component | Purpose |
|:------:|:----------|:--------|
| **B** | **Boundaries** | Decoupling presentation layers from proxy controllers (React UI + Express Backend) |
| **L** | **Links** | Standardizing secure API credential waterfalls and connection handshakes |
| **A** | **Assets** | Serving clean, formatted rendering panes (markdown lists, tables) |
| **S** | **Storage** | Syncing persistent user overlays without local token leakages |
| **T** | **Triggers** | Automating dev/prod bootstrap compilation routes concurrently |
</details>

<details>
<summary><b>🤖 n8n Agent & Pipeline Patterns</b> <code>Module 06</code></summary>

Three orchestration patterns for AI-driven STLC automation:

| Pattern | Workflow | Description |
|:--------|:--------:|:------------|
| **Chat Agent** | 6.1 | Reactive agent with memory, domain guardrails, and anti-apology enforcement |
| **Tool Agent** | 6.2 | Agent with Jira (read) + Google Sheets (write) tools following a mandatory 5-phase workflow |
| **Linear Pipeline** | 6.3 | Stateless DAG: Form → PDF → AI Generation (3 stages) → ZIP → Download |
</details>

---

## 📂 Modules

### 📦 Module 01 — AI-Driven Test Plan Generator
**[`01_test_plan_generator/`](./01_test_plan_generator/)** &nbsp; [![Status](https://img.shields.io/badge/status-complete-brightgreen)]() &nbsp; [![LLM](https://img.shields.io/badge/LLM-Ollama_14b-orange)]()

Parses a Restful Booker API spec into a production-grade, hallucination-free test plan.

<details>
<summary><b>Click to expand: Details & structure</b></summary>

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

| Milestone | Status |
|:----------|:------:|
| Data Extraction | 🟢 100% Complete |
| Anti-Hallucination Audit | 🟢 Passed |
| Artifact Generated | 🟢 `Final_Test_Plan.md` |

[→ View details](./01_test_plan_generator/README.md) &nbsp; [↑ Back to top](#-ai-tester-blueprint-portfolio)

</details>

---

### 📦 Module 02 — AI-Driven Test Case Generator
**[`02_test_case_generator/`](./02_test_case_generator/)** &nbsp; [![Status](https://img.shields.io/badge/status-complete-brightgreen)]() &nbsp; [![LLM](https://img.shields.io/badge/LLM-Ollama_14b-orange)]()

Parses a VWO Login Dashboard PRD into 20 traceable, hallucination-free test cases.

<details>
<summary><b>Click to expand: Details & structure</b></summary>

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

| Milestone | Status |
|:----------|:------:|
| Data Extraction | 🟢 100% Complete |
| Anti-Hallucination Audit | 🟢 Passed |
| Artifact Generated | 🟢 `Final_Test_Cases.csv` + `.md` |

[→ View details](./02_test_case_generator/README.md) &nbsp; [↑ Back to top](#-ai-tester-blueprint-portfolio)

</details>

---

### 📦 Module 03 — Playwright API Test Framework
**[`03_playwright_api_framework/`](./03_playwright_api_framework/)** &nbsp; [![Status](https://img.shields.io/badge/status-complete-brightgreen)]() &nbsp; [![Stack](https://img.shields.io/badge/stack-Playwright_|_TypeScript-blue)]()

Enterprise-grade, type-safe API testing framework with zero external HTTP clients, fixture-based auth, and CI-ready sharding.

<details>
<summary><b>Click to expand: Details & structure</b></summary>

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

| Milestone | Status |
|:----------|:------:|
| RICE-POT Scaffolding | 🟢 100% Complete |
| Anti-Hallucination Audit | 🟢 Passed |
| Framework Implementation | 🟢 Ready |

**Highlights:**
- Zero `any` types — every request/response has a dedicated interface
- Fixture-based auth — bearer token injected per-test via custom fixture
- Auto-failure logging — full request/response JSON on failure
- Parallel-safe — `fullyParallel: true`, no shared state
- CI-ready — 4-shard matrix with npm cache, secrets, HTML report artifact

[→ View details](./03_playwright_api_framework/README.md) &nbsp; [↑ Back to top](#-ai-tester-blueprint-portfolio)

</details>

---

### 📦 Module 04 — Jira QA Test Plan Agent
**[`04_jira_ai_agent/`](./04_jira_ai_agent/)** &nbsp; [![Status](https://img.shields.io/badge/status-complete-brightgreen)]() &nbsp; [![Stack](https://img.shields.io/badge/stack-React_|_Express_|_Groq-blue)]()

On-demand Jira issue fetcher and anti-hallucination QA test plan compiler with a glassmorphic dark dashboard.

<details>
<summary><b>Click to expand: Details & structure</b></summary>

```text
04_jira_ai_agent/
├── backend/                           # Express Server Module
│   ├── server.js                      # CORS proxy and routes
│   └── src/services/                  # Jira, Groq, & Test Plan services
├── client/                            # Vite React Client
│   ├── src/                           # App.jsx + index.css
│   └── vite.config.js                 # Dev proxy mapping
├── docs/
│   ├── B.L.A.S.T.md                   # Architecture specs
│   ├── images/                        # Dashboard screenshots
│   └── architecture/                  # Jira fetch & SOPs
├── .env.example
├── .gitignore
└── README.md
```

| Milestone | Status |
|:----------|:------:|
| Data Normalization (ADF to Text) | 🟢 100% Complete |
| Anti-Hallucination Audit | 🟢 Passed |
| Full-Stack Dashboard | 🟢 Vite React + Express |

**Highlights:** Decoupled architecture, glassmorphic UI, strict `.gitignore` boundaries, defensive filtering.

[→ View details](./04_jira_ai_agent/README.md) &nbsp; [↑ Back to top](#-ai-tester-blueprint-portfolio)

</details>

---

### 📦 Module 05 — Test Strategy Builder Agent
**[`05_test_strategy_builder/`](./05_test_strategy_builder/)** &nbsp; [![Status](https://img.shields.io/badge/status-complete-brightgreen)]() &nbsp; [![Stack](https://img.shields.io/badge/stack-React_|_Express_|_Groq-blue)]() &nbsp; [![Deploy](https://img.shields.io/badge/deployed-Vercel-success)]()

On-demand Jira issue parser and boardroom-ready QA Test Strategy compiler with Vercel production deployment.

<details>
<summary><b>Click to expand: Details & structure</b></summary>

```text
05_test_strategy_builder/
├── server/                            # Express Backend
│   └── server.js                      # CORS proxy, Jira fetcher, Groq executor
├── client/                            # Vite React Client
│   ├── vite.config.js
│   └── src/
├── docs/
│   ├── LLM.md, findings.md
│   ├── progress.md, task_plan.md
│   └── requirements_discovery.md
├── vercel.json                        # Deployment descriptor
├── .env.example
├── .gitignore
└── README.md
```

| Milestone | Status |
|:----------|:------:|
| Data Ingestion & Discovery | 🟢 100% Complete |
| Anti-Hallucination Schemas | 🟢 Passed |
| Glassmorphic UI + GFM Rendering | 🟢 Ready |
| Production Deployment | 🟢 Vercel |

**Highlights:** `remark-gfm` table rendering, Vercel serverless, zero-CORS token transit via custom headers.

[→ View details](./05_test_strategy_builder/README.md) &nbsp; [↑ Back to top](#-ai-tester-blueprint-portfolio)

</details>

---

### 📦 Module 06 — n8n AI Orchestration Agents
**[`06_AI_Agents_n8n/`](./06_AI_Agents_n8n/)** &nbsp; [![Status](https://img.shields.io/badge/status-complete-brightgreen)]() &nbsp; [![Ollama](https://img.shields.io/badge/Ollama-qwen2.5--coder:7b-orange)]() &nbsp; [![Groq](https://img.shields.io/badge/Groq-llama--3.3--70b-purple)]() &nbsp; [![OpenAI](https://img.shields.io/badge/OpenAI--compat-llama--3.3--70b-green)]()

3 production-grade n8n automation blueprints for STLC — from local guardrails to cloud tools to a full PRD-to-artifacts pipeline.

<details open>
<summary><b>Click to expand: Workflow catalog</b></summary>

```text
06_AI_Agents_n8n/
├── 6.1_local_ollama_qa_agent.json          # Chat agent with guardrails
├── 6.2_jira_prd_to_google_sheets.json      # Jira → Google Sheets
├── 6.3_stlc_artifact_generator.json        # PRD PDF → 3 artifacts
├── README.md                               # Interactive catalog
├── images/                                 # 6 proof screenshots
└── outputs/                                # Execution artifacts
    ├── Product_Requirements_Document_VWO.com.pdf
    └── 6.3_stlc_artifacts/
        ├── test_plan.md
        ├── test_cases.csv
        └── automation_tests.js
```

| # | Blueprint | LLM | Pattern | Nodes |
|:-:|:----------|:---:|:--------|:----:|
| [6.1](./06_AI_Agents_n8n/6.1_local_ollama_qa_agent.json) | Local QA Chat Agent | Ollama `qwen2.5-coder:7b` | Chat Agent + Guardrails | 4 |
| [6.2](./06_AI_Agents_n8n/6.2_jira_prd_to_google_sheets.json) | Jira → Google Sheets | Groq `llama-3.3-70b` | Tool Agent + 5-phase workflow | 6 |
| [6.3](./06_AI_Agents_n8n/6.3_stlc_artifact_generator.json) | PRD → Plan → Cases → Scripts | OpenAI `llama-3.3-70b` | Linear Pipeline (3 AI stages) | 11 |

**Highlights:**
- **6.1** — Anti-apology guardrails, out-of-scope refusal with fixed string
- **6.2** — Jira + Google Sheets integration, mandatory 5-phase agent workflow
- **6.3** — Upload PDF → AI generates Test Plan + CSV cases + Playwright scripts → ZIP download
- All 3 verified end-to-end with proof screenshots and generated artifacts

[→ View full catalog](./06_AI_Agents_n8n/README.md) &nbsp; [↑ Back to top](#-ai-tester-blueprint-portfolio)

</details>

---

## 🚀 Getting Started

<details open>
<summary><b>Click to expand: Prerequisites & quick-start per module</b></summary>

### Prerequisites

- [Ollama](https://ollama.ai/) — pull `qwen2.5-coder:14b` (`ollama pull qwen2.5-coder:14b`)
- [Node.js](https://nodejs.org/) 18+
- Target project documentation (PRD, API spec, screenshots)

### Module Quick-Start

| Module | Type | Quick Command |
|:-------|:----:|:--------------|
| **01–02** | 🧠 Prompt Pipeline | Clean source docs → Prompt LLM → Validate → Review `output/` |
| **03** | 📦 Code Framework | `npm install && cp .env.example .env && npm test` |
| **04** | 🌐 Full-Stack App | `npm install && cp .env.example .env && npm run dev` |
| **05** | 🌐 Full-Stack App | `npm install && cp .env.example .env && npm run dev` |
| **06** | 🤖 n8n Suite | Import JSON → Configure credentials → Trigger via Chat or Form |

</details>

---

## 📄 License

This project is for learning and portfolio purposes.
