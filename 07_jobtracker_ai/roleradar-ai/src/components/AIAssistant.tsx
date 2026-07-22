// ============================================================
// src/components/AIAssistant.tsx — RoleRadar AI: AI Panel
// Local Ollama (deepseek-r1:8b) integration. Degrades gracefully.
// Patch: Inline JD editor + differentiated validation vs network errors
// ============================================================

import { useState } from 'react';
import type { JobEntry, OllamaAction, OllamaResult } from '../types';
import {
  extractSkills,
  generateInterviewQuestions,
  draftFollowUpEmail,
} from '../services/ollama';
import { updateJob } from '../db/db';

interface AIAssistantProps {
  job: JobEntry;
  onClose: () => void;
  onUpdateJob: (updatedJob: JobEntry) => void; // notifies parent to refresh
}

interface AIResultState {
  isLoading: boolean;
  result: OllamaResult | null;
  activeAction: OllamaAction | null;
}

const ACTION_CONFIG: {
  action: OllamaAction;
  label: string;
  emoji: string;
  description: string;
  color: string;
  requiresJD: boolean;
}[] = [
  {
    action: 'extractSkills',
    label: 'Extract Top Skills',
    emoji: '🔬',
    description: 'Analyze the JD and extract the top 10 technical skills required',
    color: 'from-blue-600 to-cyan-600',
    requiresJD: true,
  },
  {
    action: 'generateInterviewQuestions',
    label: 'Interview Prep',
    emoji: '🎙️',
    description: 'Generate 3 tailored technical interview questions for this role',
    color: 'from-purple-600 to-indigo-600',
    requiresJD: true,
  },
  {
    action: 'draftFollowUpEmail',
    label: 'Draft Follow-Up Email',
    emoji: '📧',
    description: 'Write a professional recruiter follow-up email',
    color: 'from-emerald-600 to-teal-600',
    requiresJD: false, // email doesn't need JD
  },
];

export function AIAssistant({ job, onClose, onUpdateJob }: AIAssistantProps) {
  // Local JD state — initialized from job, editable inline without closing modal
  const [jdText, setJdText] = useState(job.jobDescription || '');
  const [isSavingJD, setIsSavingJD] = useState(false);
  const [jdSaved, setJdSaved] = useState(false);
  const [showJDEditor, setShowJDEditor] = useState(!job.jobDescription?.trim());

  const [state, setState] = useState<AIResultState>({
    isLoading: false,
    result: null,
    activeAction: null,
  });
  const [copied, setCopied] = useState(false);
  const [validationError, setValidationError] = useState('');

  // ---- Save JD inline without closing the modal ----
  const handleSaveJD = async () => {
    if (!jdText.trim()) return;
    setIsSavingJD(true);
    try {
      const updatedJob: JobEntry = { ...job, jobDescription: jdText };
      await updateJob(updatedJob);
      onUpdateJob(updatedJob);
      setJdSaved(true);
      setShowJDEditor(false);
      setValidationError('');
      setTimeout(() => setJdSaved(false), 2500);
    } finally {
      setIsSavingJD(false);
    }
  };

  // ---- Guard clause: validate before calling Ollama ----
  async function runAction(action: OllamaAction) {
    const cfg = ACTION_CONFIG.find((a) => a.action === action)!;

    // If action needs JD and it's empty, show inline editor instead of calling Ollama
    if (cfg.requiresJD && !jdText.trim()) {
      setValidationError(
        'This action needs a Job Description. Paste it below and click Save JD.'
      );
      setShowJDEditor(true);
      setState({ isLoading: false, result: null, activeAction: null });
      return;
    }

    setValidationError('');
    setState({ isLoading: true, result: null, activeAction: action });

    let result: OllamaResult;
    try {
      switch (action) {
        case 'extractSkills':
          result = await extractSkills(jdText);
          break;
        case 'generateInterviewQuestions':
          result = await generateInterviewQuestions(job.role, job.company, jdText);
          break;
        case 'draftFollowUpEmail':
          result = await draftFollowUpEmail(job.role, job.company, job.dateApplied);
          break;
      }
    } catch {
      result = {
        action,
        content: '',
        error: 'Unexpected error. Is Ollama running? Try: `ollama serve`',
        errorType: 'network',
      };
    }

    setState({ isLoading: false, result, activeAction: action });
  }

  const handleCopy = async () => {
    if (!state.result?.content) return;
    await navigator.clipboard.writeText(state.result.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const jdIsMissing = !jdText.trim();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" />

      {/* Panel */}
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-indigo-500/20 rounded-2xl shadow-2xl shadow-indigo-900/20">
        {/* Top glow */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />

        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/95 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 flex items-center justify-center rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-lg">
              🤖
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">AI Assistant</h2>
              <p className="text-xs text-slate-500">
                {job.role} @ {job.company} · Powered by deepseek-r1:8b
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="p-6 flex flex-col gap-5">
          {/* Ollama notice */}
          <div className="flex items-center gap-2.5 text-xs text-slate-500 bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-2.5">
            <span className="text-green-400">●</span>
            <span>
              Local AI — data never leaves your machine. Requires{' '}
              <code className="font-mono text-slate-400">ollama serve</code> +{' '}
              <code className="font-mono text-slate-400">ollama pull deepseek-r1:8b</code>
            </span>
          </div>

          {/* ── INFO BANNER: No Job Description (not an error) ── */}
          {jdIsMissing && !showJDEditor && (
            <div className="flex items-start gap-3 bg-blue-500/10 border border-blue-500/25 rounded-xl px-4 py-3">
              <span className="text-blue-400 text-lg shrink-0">📋</span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-blue-300">No Job Description Found</p>
                <p className="text-xs text-blue-400/70 mt-0.5">
                  Paste the JD below to unlock skill extraction and interview prep.
                </p>
              </div>
              <button
                onClick={() => setShowJDEditor(true)}
                className="text-xs font-semibold text-blue-400 hover:text-blue-200 bg-blue-500/15 hover:bg-blue-500/25 px-3 py-1.5 rounded-lg transition-colors shrink-0"
              >
                Add JD
              </button>
            </div>
          )}

          {/* ── Validation Error Banner ── */}
          {validationError && (
            <div className="flex items-center gap-2.5 bg-amber-500/10 border border-amber-500/25 rounded-xl px-4 py-3">
              <span className="text-amber-400">⚠️</span>
              <p className="text-xs text-amber-300">{validationError}</p>
            </div>
          )}

          {/* ── Inline JD Editor ── */}
          {showJDEditor && (
            <div className="flex flex-col gap-3 bg-slate-800/40 border border-slate-700/50 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-200">
                    {jdIsMissing ? '📋 Paste Job Description' : '✏️ Edit Job Description'}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Saved locally — used by all AI actions for this job
                  </p>
                </div>
                {!jdIsMissing && (
                  <button
                    onClick={() => setShowJDEditor(false)}
                    className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    ✕ Hide
                  </button>
                )}
              </div>

              <textarea
                value={jdText}
                onChange={(e) => setJdText(e.target.value)}
                placeholder="Paste the full job description here..."
                rows={7}
                className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all resize-y"
              />

              <div className="flex items-center gap-3">
                <button
                  onClick={handleSaveJD}
                  disabled={isSavingJD || !jdText.trim()}
                  className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSavingJD ? (
                    <>
                      <span className="w-3.5 h-3.5 border border-white/30 border-t-white rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : jdSaved ? (
                    '✅ Saved!'
                  ) : (
                    '💾 Save JD'
                  )}
                </button>
                <p className="text-xs text-slate-500">
                  {jdText.length > 0 ? `${jdText.length} chars` : 'No text yet'}
                </p>
              </div>
            </div>
          )}

          {/* ── Show/Edit JD toggle (when JD exists and editor is hidden) ── */}
          {!jdIsMissing && !showJDEditor && (
            <div className="flex items-center justify-between px-3 py-2 bg-slate-800/30 border border-slate-700/30 rounded-xl">
              <div className="flex items-center gap-2">
                <span className="text-xs text-emerald-400">✓</span>
                <span className="text-xs text-slate-400">
                  Job Description attached · {jdText.length} chars
                </span>
              </div>
              <button
                onClick={() => setShowJDEditor(true)}
                className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
              >
                Edit
              </button>
            </div>
          )}

          {/* ── Action Buttons ── */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {ACTION_CONFIG.map(({ action, label, emoji, description, color, requiresJD }) => (
              <button
                key={action}
                onClick={() => runAction(action)}
                disabled={state.isLoading}
                title={requiresJD && jdIsMissing ? 'Add a Job Description first' : label}
                className={`
                  relative flex flex-col items-center gap-2 p-4 rounded-xl border border-white/5
                  bg-gradient-to-br ${color} bg-opacity-10
                  hover:border-white/15 transition-all duration-200
                  hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed
                  ${state.activeAction === action && state.isLoading ? 'ring-1 ring-white/20 animate-pulse' : ''}
                `}
              >
                <span className="text-2xl">{emoji}</span>
                <span className="text-xs font-semibold text-slate-200 text-center">{label}</span>
                <span className="text-xs text-slate-500 text-center leading-relaxed">{description}</span>
                {requiresJD && jdIsMissing && (
                  <span className="absolute top-2 right-2 text-xs px-1.5 py-0.5 bg-amber-500/20 text-amber-400 rounded-md border border-amber-500/20">
                    JD needed
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* ── Loading State ── */}
          {state.isLoading && (
            <div className="flex flex-col items-center gap-3 py-8">
              <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
              <p className="text-sm text-slate-400">
                deepseek-r1:8b is thinking
                <span className="animate-pulse">...</span>
              </p>
              <p className="text-xs text-slate-600">This may take 15–60 seconds</p>
            </div>
          )}

          {/* ── Result Panel ── */}
          {!state.isLoading && state.result && (
            <div className="rounded-xl border border-slate-700/60 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2.5 bg-slate-800/60 border-b border-slate-700/60">
                <div className="flex items-center gap-2">
                  {ACTION_CONFIG.find((a) => a.action === state.result?.action)?.emoji}
                  <span className="text-xs font-semibold text-slate-300">
                    {ACTION_CONFIG.find((a) => a.action === state.result?.action)?.label}
                  </span>
                </div>
                {state.result.content && (
                  <button
                    onClick={handleCopy}
                    className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1.5 transition-colors"
                  >
                    {copied ? '✅ Copied!' : '📋 Copy'}
                  </button>
                )}
              </div>

              <div className="p-4 max-h-64 overflow-y-auto">
                {state.result.error ? (
                  // —— Network / model error (Ollama unreachable or 404) ——
                  state.result.errorType === 'network' ? (
                    <div className="flex items-start gap-3 text-rose-400">
                      <span className="text-lg shrink-0">⚠️</span>
                      <div className="flex-1">
                        {/* 404: model not found — show targeted pull command */}
                        {state.result.error.includes('not found') ? (
                          <>
                            <p className="text-sm font-semibold text-rose-300">Model Not Found</p>
                            <p className="text-xs mt-1 text-rose-400/80">{state.result.error}</p>
                            <div className="mt-3 p-3 bg-slate-800 rounded-lg font-mono text-xs text-slate-300 space-y-1">
                              <p className="text-slate-500"># Pull the model to fix this:</p>
                              <p className="text-emerald-400">$ ollama pull deepseek-r1:8b</p>
                              <p className="text-slate-500 mt-1"># Then restart the dev server</p>
                            </div>
                          </>
                        ) : (
                          /* Generic connection error — Ollama not running */
                          <>
                            <p className="text-sm font-semibold">Ollama Unavailable</p>
                            <p className="text-xs mt-1 text-rose-400/80">{state.result.error}</p>
                            <div className="mt-3 p-3 bg-slate-800 rounded-lg font-mono text-xs text-slate-300 space-y-1">
                              <p className="text-slate-500"># Run these in your terminal:</p>
                              <p>$ ollama serve</p>
                              <p>$ ollama pull deepseek-r1:8b</p>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  ) : (
                    // —— Generic error fallback ——
                    <p className="text-sm text-rose-400">{state.result.error}</p>
                  )
                ) : (
                  // ── Success ──
                  <pre className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed font-sans">
                    {state.result.content}
                  </pre>
                )}
              </div>
            </div>
          )}

          {/* ── Idle empty state ── */}
          {!state.isLoading && !state.result && !validationError && (
            <div className="text-center py-4 text-slate-600">
              <p className="text-sm">Select an action above to get AI-powered insights</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
