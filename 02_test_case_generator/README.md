# 🚀 Module 02: AI-Driven Test Case Generator

This module leverages local Large Language Models (LLMs) alongside structured prompt engineering frameworks to parse Product Requirements Documents (PRDs) and generate production-grade, hallucination-free test cases in CSV format.

---

## 📊 Quick Project Status

| Milestone                  |          Status          |        Engine        |      Framework      |
| :------------------------- | :-----------------------: | :------------------: | :-----------------: |
| Data Extraction            | 🟢**100% Complete** | `qwen2.5-coder:14b` |      RICE-POT       |
| Anti-Hallucination Audit   |    🟢**Passed**    |    Ollama (Local)    | Pramod Dutta Ruleset |
| Target Artifact Generated  |     🟢**Ready**     |     CSV Engine       | RICE-POT + STLC     |

---

## 🛠️ Architecture & Core Mechanics

<details>
<summary><b>🔍 Click to expand: Prompt Engineering Framework (RICE-POT)</b></summary>

The system operates as a deterministic pipeline that ensures high-fidelity test case generation without introducing common generative AI inaccuracies:

* **Role:** Expert QA Functional Tester with 15+ years of experience.
* **Instructions:** Read PRD and screenshots; write functional + non-functional test cases; cover positive/negative scenarios; minimum 10 test cases; trace every case to a specific requirement.
* **Context:** Strict binding to the PRD (VWO Login Dashboard), application screenshots, and supporting documents.
* **Examples:** Single-row CSV format mapping Scenario, TID, Test Data, Test Steps, Expected Result, Priority, etc.
* **Parameters:** Deterministic output, zero invented content, "Insufficient information to determine" fallback, inferred details labeled.
* **Output:** CSV only — no preamble, no commentary. Columns: Scenario, TID, Test Data, Test Case Description, Pre-Condition, Test Steps, Expected Result, Actual Result, Status, Executed By (QA Name), Misc (Comments), Priority, Is Automated.
* **Tone:** Technical, precise, and enterprise-grade.

</details>

<details>
<summary><b>🛡️ Click to expand: Anti-Hallucination Guardrails</b></summary>

An audit layer driven by the strict verification rulesets authored by Pramod Dutta (Principal SDET) ensures zero default template assumptions, full data traceability, and mandatory "Insufficient information to determine" fallbacks when data gaps appear.

</details>

---

## 📂 Repository File Blueprint

```text
02_test_case_generator/
├── README.md                  <-- Local Project Documentation & Showcase
├── docs/
│   ├── Anti_Hallucinations_Rules.md  <-- Strict verification gatekeeper guidelines
│   ├── Source_Context.md             <-- Cleaned ground-truth PRD details
│   └── execution_proof_screenshot.png  <-- Local IDE execution proof image
└── output/
    └── Final_Test_Cases.csv   <-- The finalized, hallucination-free test case CSV artifact
```
