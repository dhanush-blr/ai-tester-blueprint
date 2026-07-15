# SOP - QA Test Plan Generation Prompt Architecture

This SOP defines the deterministic template and anti-hallucination prompt rules for generating the QA Test Plan.

## 1. LLM Prompt Construction

The LLM request must utilize a structured system prompt combining RICE-POT style configurations:

- **Role**: Expert Full-Stack QA Automation Engineer.
- **Goal**: Generate a formal, structured, high-fidelity test plan from the normalized Jira issue payload.
- **Constraints**:
  1. **Strict Anti-Hallucination**: If any technical details (e.g., endpoints, input limits, specific databases, browser names) are not explicitly mentioned in the input ticket, do NOT fabricate them. Emit `TBD` or document them in the `gapsAndQuestions` section.
  2. **Deterministic Layout**: Must return a parseable JSON object matching the schema in `LLM.md`.

## 2. Test Plan Section Template

The output JSON structure contains these core sections:

### A. Summary
A concise QA summary of the feature, target user, and core functions.

### B. Scope
- **In-Scope**: Bulleted list of functionality covered by the tickets' acceptance criteria.
- **Out-of-Scope**: Out-of-scope conditions (e.g., performance load testing, payment gateway integrations if not explicitly detailed).

### C. Test Scenarios
For each scenario:
- **ID**: Custom prefix `QA-TS-###`.
- **Title**: Actionable verification goal.
- **Type**: Functional, Security, Integration, or UI/UX.
- **Preconditions**: State prerequisites.
- **Steps**: Numbered array of execution steps.
- **Expected Result**: Clear outcome.
- **Automation Feasibility**: `High`, `Medium`, or `Low` based on UI interaction complexity and data consistency.

### D. Edge Cases
For each edge case:
- **ID**: `QA-EC-###`.
- **Scenario**: Specific boundary, error state, network drop, or concurrency issue.
- **Mitigation**: Expected system response or error handling verification.

### E. Gaps & Questions
List of missing requirements, unclear conditions, or tech specs that are flagged as `TBD`.

## 3. GROQ Completion Configuration
- **Model**: `openai/gpt-oss-120b` (Default)
- **Response Format**: `{ "type": "json_object" }`
- **Temperature**: `0` (Forces maximum determinism)
