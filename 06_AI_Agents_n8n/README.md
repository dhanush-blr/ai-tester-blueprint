# n8n AI Orchestration Agents

This folder houses localized, advanced AI Agent orchestrations and LangChain pipeline blueprints managed via n8n.

## 🤖 06_AI_Agents_n8n Blueprint Catalog

### 1. Local Ollama QA Agent (`6.1_local_ollama_qa_agent.json`)
- **Core Identity:** Senior QA and Test Automation Expert (15+ years experience).
- **Local LLM Engine:** Ollama (`qwen2.5-coder:7b`).
- **Parameter Tuning:** Temperature: `0`, Context Window (`Num Ctx`): `8192`.
- **Guardrail Constraints:** Zero-exception software testing domain alignment. Features an explicit anti-apology enforcement rule that blocks conversational filler and forces a verbatim corporate policy refusal block for out-of-scope prompts.
- **Memory State:** Sliding Window Buffer Memory.

<details>
<summary><b>📊 Click to Expand: Empirical Execution & Guardrail Proofs</b></summary>

##### Out-of-Scope Guardrail Interception
When an out-of-scope query (e.g., weather data) is processed, the agent bypasses conversational apologies and strictly returns the mandated corporate string:
![Guardrail Interception Proof](images/guardrail_refusal_proof.png)

##### In-Scope Domain Expertise Processing
When a QA-specific concept query (e.g., Regression Testing) is handled, the agent swiftly surfaces a modular, structured execution guide:
![In-Scope Domain Execution Proof](images/in_scope_execution_proof.png)

</details>

---

### 2. Jira PRD to Google Sheets Test Case Generator (`6.2_Read_PRD_TestCases_Excel.json`)
- **Core Identity:** Senior QA Automation Architect specializing in test engineering agent frameworks.
- **LLM Engine:** Groq Cloud (`llama-3.3-70b-versatile`).
- **Connected Integrations & Tools:**
  - **Jira Software Cloud Integration:** Employs the `Fetch PRD by ticket` tool to automatically retrieve issue payloads (Summary/Description) from target Jira keys parsed from the user chat.
  - **Google Sheets Integration:** Employs the `Append or update row in sheet` tool to serialize generated test cases as structured rows in the centralized spreadsheet.
  - **Active Spreadsheet Target:** [KAN PRD Test cases Google Sheet](https://docs.google.com/spreadsheets/d/19bPRiR3mLkfq0qDtqN2cNLhxV4vUKEvgcP--Y_xxlxc/edit?usp=sharing)
- **Mandatory Workflow Sequence:**
  1. **Phase 1: Extraction & Key Verification:** Parses and isolates target issue keys (e.g. `PROJ-101`) from input messages.
  2. **Phase 2: Jira Data Retrieval:** Queries Jira API to extract core requirement definitions.
  3. **Phase 3: Test Case Engineering:** Generates detailed test suites containing scenario definitions, steps, preconditions, priority, and expected results.
  4. **Phase 4: Spreadsheet Serialization:** Iterates and appends each generated case as a new row in the tracking sheet.
  5. **Phase 5: Chat Reporting:** Displays a high-level markdown summary table of generated test scenarios.
- **Memory State:** Sliding Window Buffer Memory.

<details>
<summary><b>📊 Click to Expand: Empirical Execution & Spreadsheet Logging Proofs</b></summary>

##### n8n AI Agent Workflow Execution
The visual execution path in n8n showcases the inputs, Groq chat model invocation, memory lookup, and tool orchestration:
![Jira PRD to Sheets Workflow](images/jira_prd_sheets_workflow_proof.png)

##### Google Sheets Output Record Generation
The generated test cases are successfully serialized and logged into the target Google Sheets tracking sheet:
![Google Sheets Test Cases Log](images/jira_prd_sheets_execution_proof.png)

</details>

---

### 3. STLC Artifact Generator (`6.3_STLC_n8n_Agent.json`)
- **Core Identity:** Multi-stage STLC pipeline that ingests a PRD PDF and produces 3 artifacts: Test Plan, Test Cases, and Playwright automation scripts.
- **LLM Engine:** OpenAI-compatible endpoint (`llama-3.3-70b-versatile`).
- **Trigger:** Web form with a file upload field for PRD PDF.
- **Pipeline Stages:**
  1. **Stage 1 — Test Plan Generation:** AI acts as an expert QA Manager, analyzes the PRD text, and generates a comprehensive Test Plan including Scope, Exclusions, Test Strategy, and Risk Analysis. Output is saved as `test_plan.md`.
  2. **Stage 2 — Test Case Generation:** AI acts as an expert QA Engineer, reviews the generated Test Plan, and produces a CSV suite of functional test cases with columns: Test Case ID, Module, Description, Pre-conditions, Execution Steps, Expected Result, Priority. Output is saved as `test_cases.csv`.
  3. **Stage 3 — Playwright Script Generation:** AI acts as an expert Automation Engineer, reviews the test cases, and generates Playwright JS automation scripts using POM patterns, `page.getByRole` locators, and `await expect(...)` assertions. Output is saved as `automation_tests.js`.
- **Artifact Delivery:** All 3 files are collected, compressed into `STLC_Artifacts.zip`, and served as a downloadable binary via a completion form.
- **Memory State:** Stateless (linear pipeline, no agent loop).
- **Input Used:** [VWO.com PRD PDF](../06_AI_Agents_n8n/outputs/Product_Requirements_Document_VWO.com.pdf)

<details>
<summary><b>📊 Click to Expand: Empirical Execution & Generated Artifacts</b></summary>

##### Generated Test Plan (`test_plan.md`)
Comprehensive STLC Test Plan covering VWO features (A/B testing, heatmaps, personalization), with Scope, Exclusions, Risk Analysis, Test Strategy, and Environment setup — produced directly from the PRD PDF.

##### Generated Test Cases (`test_cases.csv`)
16 test cases (VWO-001 to VWO-016) across 11 modules — including functional (A/B tests, multivariate, personalization), non-functional (performance, security, scalability), and UX (usability, accessibility, localization).

| Sample | Module | Priority |
|--------|--------|----------|
| VWO-001 | Experimentation & Testing | High |
| VWO-003 | Behavioral Insights | Medium |
| VWO-005 | Personalization | High |
| VWO-008 | Performance | Critical |
| VWO-009 | Security | Critical |

##### Generated Playwright Scripts (`automation_tests.js`)
Structured POM-based Playwright tests with page classes for `LoginPage`, `ExperimentationPage`, `BehavioralInsightsPage`, and `PersonalizationPage` — using `page.getByRole` locators and `await expect(...)` assertions.

→ **Output files:** [`outputs/6.3_stlc_artifacts/`](outputs/6.3_stlc_artifacts/)

</details>
