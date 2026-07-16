# n8n AI Orchestration Agents

This folder houses localized, advanced AI Agent orchestrations and LangChain pipeline blueprints managed via n8n.

## 🤖 06_AI_Agents_n8n Blueprint Catalog

### 1. Local Ollama QA Agent (`local_ollama_qa_agent.json`)
- **Core Identity:** Senior QA and Test Automation Expert (15+ years experience).
- **Local LLM Engine:** Ollama (`qwen2.5-coder:7b`).
- **Parameter Tuning:** Temperature: `0`, Context Window (`Num Ctx`): `8192`.
- **Guardrail Constraints:** Zero-exception software testing domain alignment. Features an explicit anti-apology enforcement rule that blocks conversational filler and forces a verbatim corporate policy refusal block for out-of-scope prompts.
- **Memory State:** Sliding Window Buffer Memory.

### 📊 Empirical Execution & Guardrail Proof

#### A. Out-of-Scope Guardrail Interception
When an out-of-scope query (e.g., weather data) is processed, the agent bypasses conversational apologies and strictly returns the mandated corporate string:
![Guardrail Interception Proof](images/guardrail_refusal_proof.png)

#### B. In-Scope Domain Expertise Processing
When a QA-specific concept query (e.g., Regression Testing) is handled, the agent swiftly surfaces a modular, structured execution guide:
![In-Scope Domain Execution Proof](images/in_scope_execution_proof.png)
