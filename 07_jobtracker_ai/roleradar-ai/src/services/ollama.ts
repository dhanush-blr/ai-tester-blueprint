// ============================================================
// src/services/ollama.ts — RoleRadar AI: Local Ollama Service
// Proxied via Vite: /api/ollama → http://localhost:11434
// Model: deepseek-r1:8b | Stream: false
// ============================================================

import type { OllamaAction, OllamaResult } from '../types';

const OLLAMA_BASE = '/api/ollama';

interface OllamaRawResponse {
  model: string;
  response: string;
  done: boolean;
}

// Active model — update here if switching local models
const ACTIVE_MODEL = 'deepseek-r1:8b';

async function callOllama(prompt: string): Promise<string> {
  const res = await fetch(`${OLLAMA_BASE}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: ACTIVE_MODEL,
      prompt,
      stream: false,
    }),
  });

  if (!res.ok) {
    // 404 = model not pulled locally — give an actionable message
    if (res.status === 404) {
      throw new Error(
        `Model '${ACTIVE_MODEL}' not found in local Ollama. ` +
        `Please run: ollama pull ${ACTIVE_MODEL}`
      );
    }
    throw new Error(`Ollama returned ${res.status}: ${res.statusText}`);
  }

  const data: OllamaRawResponse = await res.json();
  return data.response;
}

// ---- Action: Extract Skills ----
export async function extractSkills(jobDescription: string): Promise<OllamaResult> {
  // NOTE: empty-JD guard is handled in AIAssistant component (shows inline editor).
  // This function only handles Ollama network calls.
  const prompt = `You are a technical recruiter. Analyze the following job description and extract the top 10 most important technical skills required for this role.

Return ONLY a JSON array of strings. No explanation, no markdown, no extra text. Example: ["React", "TypeScript", "Node.js"]

Job Description:
${jobDescription}`;

  try {
    const raw = await callOllama(prompt);
    // Try to extract JSON array from response
    const match = raw.match(/\[[\s\S]*\]/);
    const parsed: string[] = match ? JSON.parse(match[0]) : [];
    return {
      action: 'extractSkills',
      content: parsed.length > 0 ? parsed.join(', ') : raw,
    };
  } catch (err) {
    return {
      action: 'extractSkills',
      content: '',
      error: err instanceof Error ? err.message : 'Failed to connect to Ollama. Is it running?',
      errorType: 'network',
    };
  }
}


// ---- Action: Generate Interview Questions ----
export async function generateInterviewQuestions(
  role: string,
  company: string,
  jobDescription: string
): Promise<OllamaResult> {
  const prompt = `You are a senior technical interviewer at ${company}. 

Generate exactly 3 tailored, challenging technical interview questions for a candidate applying for the "${role}" role.

The questions should be specific to the skills and context in the job description below. Format each question clearly numbered (1., 2., 3.) with a brief explanation of what the question tests.

Job Description:
${jobDescription || `${role} at ${company}`}`;

  try {
    const content = await callOllama(prompt);
    return { action: 'generateInterviewQuestions', content };
  } catch (err) {
    return {
      action: 'generateInterviewQuestions',
      content: '',
      error: err instanceof Error ? err.message : 'Failed to connect to Ollama. Is it running?',
      errorType: 'network',
    };
  }
}

// ---- Action: Draft Follow-Up Email ----
export async function draftFollowUpEmail(
  role: string,
  company: string,
  dateApplied: string
): Promise<OllamaResult> {
  const applied = new Date(dateApplied).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const prompt = `Write a professional, concise recruiter follow-up email for a job application.

Details:
- Role Applied: ${role}
- Company: ${company}
- Date Applied: ${applied}

Requirements:
- Tone: Professional but personable
- Length: 3–4 short paragraphs
- Include a subject line at the top
- Express continued interest and check on application status
- Do NOT be generic — reference the specific role and company`;

  try {
    const content = await callOllama(prompt);
    return { action: 'draftFollowUpEmail', content };
  } catch (err) {
    return {
      action: 'draftFollowUpEmail',
      content: '',
      error: err instanceof Error ? err.message : 'Failed to connect to Ollama. Is it running?',
      errorType: 'network',
    };
  }
}

export function getActionLabel(action: OllamaAction): string {
  const labels: Record<OllamaAction, string> = {
    extractSkills: 'Extract Skills',
    generateInterviewQuestions: 'Interview Questions',
    draftFollowUpEmail: 'Draft Follow-Up Email',
  };
  return labels[action];
}
