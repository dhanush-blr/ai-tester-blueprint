
# 🚀 Module 01: AI-Driven Test Plan Generator

This module leverages local Large Language Models (LLMs) alongside structured prompt engineering frameworks to parse raw project documentation and generate production-grade, hallucination-free test plans.

---

## 📊 Quick Project Status

| Milestone                 |          Status          |        Engine        |      Framework      |
| :------------------------ | :-----------------------: | :-------------------: | :------------------: |
| Data Extraction           | 🟢**100% Complete** | `qwen2.5-coder:14b` |       RICE-POT       |
| Anti-Hallucination Audit  |    🟢**Passed**    |    Ollama (Local)    | Pramod Dutta Ruleset |
| Target Artifact Generated |     🟢**Ready**     |    Markdown Engine    |    Standard STLC    |

---

## 🛠️ Architecture & Core Mechanics

<details>
<summary><b>🔍 Click to expand: Prompt Engineering Framework (RICE-POT)</b></summary>

The system operates as a deterministic pipeline that ensures high-fidelity documentation extraction without introducing common generative AI inaccuracies:

* **Role:** Senior QA Automation Lead.
* **Instructions:** Direct parsing and synthesis parameters.
* **Context:** Strict binding to the project's source data file.
* **Examples:** Mapping required header outputs explicitly.
* **Parameters:** Stripping out default template filler assumptions.
* **Output:** Pristine raw markdown configuration structures.
* **Tone:** Highly technical, precise, and authoritative.

</details>

<details>
<summary><b>🛡️ Click to expand: Anti-Hallucination Guardrails</b></summary>

An audit layer driven by the strict verification rulesets authored by Pramod Dutta (Principal SDET) ensures zero default template assumptions, full data traceability, and mandatory "Insufficient information to determine" fallbacks when data gaps appear.

</details>

---

## 📂 Repository File Blueprint

```text
01_test_plan_generator/
├── README.md               <-- Local Project Documentation & Showcase
├── docs/
│   ├── Anti_Hallucinations_Rules.md  <-- Strict verification gatekeeper guidelines
│   ├── Source_Context.md             <-- Cleaned ground-truth project details
│   └── continue_execution_proof.jpg  <-- Local IDE execution proof image
└── output/
    └── Final_Test_Plan.md            <-- The finalized, hallucination-free test plan artifact
```
