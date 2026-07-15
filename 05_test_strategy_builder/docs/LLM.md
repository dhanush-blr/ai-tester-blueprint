# LLM.md - Project Constitution & Schemas

This document defines the strict data shapes, agent behavior rules, and architectural invariants for the Test Strategy Builder AI Agent.

---

## 📋 Data Schemas

### 1. Strategy Generation API Request Schema (Frontend → Express Backend)
Endpoint: `POST /api/generate-strategy`

**Headers:**
*   `x-jira-url`: Base URL for the Atlassian Jira Cloud instance.
*   `x-jira-email`: User login email for Jira.
*   `x-jira-token`: API token generated from Atlassian.
*   `x-groq-key`: Groq API Key.
*   `x-groq-model`: Groq target completion model.

**Request Body JSON:**
```json
{
  "jiraId": "KAN-4"
}
```

### 2. Strategy Generation Output Schema (Groq LLM → Express → React)
The LLM response must be a valid JSON object matching the schema below:

```json
{
  "jiraId": "string - Key of the target issue (e.g., KAN-4)",
  "summary": "string - Key summary of the Jira ticket",
  "generatedAt": "string - Current ISO timestamp",
  "testStrategy": {
    "title": "string - Descriptive boardroom-ready quality strategy title",
    "executiveSummary": "string - High-level summary of the QA mission and goals",
    "targetTechStack": {
      "frontend": ["string - detected frontend framework, language, or libraries"],
      "backend": ["string - detected backend language, runtime, or APIs"],
      "databases": ["string - detected persistent layers"],
      "integrations": ["string - detected external third-party services"]
    },
    "testLevels": [
      {
        "level": "string - e.g. Unit, Integration, System, Performance, Security",
        "inScope": true,
        "description": "string - what will be validated at this level",
        "tools": ["string - tool mapping matching the stack, e.g. Jest, Playwright, Supertest"]
      }
    ],
    "scopeBoundaries": {
      "inScope": ["string - specific feature scopes included for validation"],
      "outOfScope": ["string - explicit boundaries excluded from testing"]
    },
    "riskMatrix": [
      {
        "risk": "string - potential software failure mode or design risk",
        "impact": "High | Medium | Low",
        "likelihood": "High | Medium | Low",
        "mitigation": "string - concrete QA automation or manual verification strategy"
      }
    ],
    "corporateGovernance": {
      "complianceRequirements": ["string - compliance constraints, e.g. SOC2 audit logs, HIPAA encryption, WCAG accessibility"],
      "qualityGates": ["string - mandatory criteria for environment promoting/sign-off"]
    },
    "gapsAndQuestions": [
      "string - missing details or requirements from the Jira ticket context"
    ]
  }
}
```

---

## 🚫 Behavioral Rules & Anti-Hallucination Guidelines
1. **Zero-Hallucination Guardrails:** If any critical details required to formulate the strategy are missing from the Jira description, the LLM must output "TBD" or include a specific query inside the `gapsAndQuestions` collection. Under no circumstances should the LLM manufacture mock routes, parameters, or specifications not indicated by the ticket or target tech stack.
2. **Quality Tool Mapping:** Recommended validation tools must map precisely to the identified tech stack (e.g., if tech stack contains React, use Jest/RTL/Playwright; if Next.js, use Cypress/Playwright; if Express, use Supertest/Mocha).
3. **Structured Formats:** Outputs should be easily renderable as Markdown tables for structured tables like the risk matrix.

---

## 🏛️ Architectural Invariants
1. **Express Server Proxying:** All external endpoints (Atlassian Jira Cloud & Groq API) must go through the Express proxy server to keep credentials secure and prevent CORS preflight blocks.
2. **Dynamic Settings Override:** Runtime API keys and configuration parameters are input in the frontend's settings pane and sent on request using custom headers.
3. **Array Sanitization:** The parser on both client and server side must filter out null, undefined, or empty strings from generated collections.
