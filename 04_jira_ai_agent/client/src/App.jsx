import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

// Client-side JSON to Markdown compiler (mirrors backend implementation)
function jsonToMarkdown(payload) {
  if (!payload || !payload.testPlan) return '';
  const tp = payload.testPlan || {};
  const scope = tp.scope || {};
  
  // Safe filtering ensuring non-empty string isolation (handles null/undefined/objects)
  const inScope = (scope.inScope || []).filter(item => typeof item === 'string' && item.trim() !== "");
  const outOfScope = (scope.outOfScope || []).filter(item => typeof item === 'string' && item.trim() !== "");
  const scenarios = (tp.testScenarios || []).filter(sc => sc && typeof sc.title === 'string' && sc.title.trim() !== "");
  const edgeCases = (tp.edgeCases || []).filter(ec => ec && typeof ec.scenario === 'string' && ec.scenario.trim() !== "");
  const gaps = (tp.gapsAndQuestions || []).filter(gap => typeof gap === 'string' && gap.trim() !== "");

  let md = `# QA Test Plan: ${payload.jiraId} - ${payload.summary || 'Jira Issue'}\n\n`;
  md += `* **Generated At**: ${payload.generatedAt || new Date().toISOString()}\n`;
  md += `* **Author**: Antigravity QA AI Agent\n\n`;

  md += `## 1. Feature Summary\n${tp.summary || 'TBD'}\n\n`;

  md += `## 2. Scope\n`;
  md += `### In-Scope\n`;
  if (inScope.length > 0) {
    inScope.forEach(item => { md += `- ${item}\n`; });
  } else {
    md += `- TBD\n`;
  }
  md += `\n### Out-of-Scope\n`;
  if (outOfScope.length > 0) {
    outOfScope.forEach(item => { md += `- ${item}\n`; });
  } else {
    md += `- TBD\n`;
  }
  md += `\n`;

  md += `## 3. Test Scenarios\n`;
  if (scenarios.length > 0) {
    scenarios.forEach(sc => {
      md += `### ${sc.id}: ${sc.title}\n`;
      md += `* **Type**: ${sc.type || 'Functional'}\n`;
      md += `* **Automation Feasibility**: ${sc.automationFeasibility || 'TBD'}\n\n`;
      
      md += `#### Preconditions\n`;
      const preconditions = (sc.preconditions || []).filter(p => typeof p === 'string' && p.trim() !== "");
      if (preconditions.length > 0) {
        preconditions.forEach(p => { md += `- ${p}\n`; });
      } else {
        md += `- None\n`;
      }
      md += `\n`;

      md += `#### Steps\n`;
      const steps = (sc.steps || []).filter(step => typeof step === 'string' && step.trim() !== "");
      if (steps.length > 0) {
        steps.forEach((step, idx) => { md += `${idx + 1}. ${step}\n`; });
      } else {
        md += `1. Execute scenario steps\n`;
      }
      md += `\n`;

      md += `#### Expected Result\n`;
      md += `${sc.expectedResult || 'TBD'}\n\n`;
      md += `---\n\n`;
    });
  } else {
    md += `*No scenarios generated.*\n\n`;
  }

  md += `## 4. Edge Cases\n`;
  if (edgeCases.length > 0) {
    edgeCases.forEach(ec => {
      md += `### ${ec.id}: ${ec.scenario}\n`;
      md += `* **Expected Mitigation**: ${ec.mitigation || 'TBD'}\n\n`;
    });
  } else {
    md += `*No edge cases identified.*\n\n`;
  }
  md += `\n`;

  md += `## 5. Gaps & Questions (Requirements Gaps / TBD)\n`;
  if (gaps.length > 0) {
    gaps.forEach(gap => { md += `- ${gap}\n`; });
  } else {
    md += `*No requirement gaps identified.*\n`;
  }

  return md;
}

export default function App() {
  const [jiraId, setJiraId] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [logs, setLogs] = useState([]);
  const [testPlanJson, setTestPlanJson] = useState(null);
  const [error, setError] = useState('');
  const [showSettings, setShowSettings] = useState(false);

  // Settings states loaded from localStorage or falling back to empty/defaults
  const [jiraUrl, setJiraUrl] = useState(localStorage.getItem('JIRA_URL') || '');
  const [jiraEmail, setJiraEmail] = useState(localStorage.getItem('JIRA_EMAIL') || '');
  const [jiraToken, setJiraToken] = useState(localStorage.getItem('JIRA_TOKEN') || '');
  const [groqKey, setGroqKey] = useState(localStorage.getItem('GROQ_KEY') || '');
  const [groqModel, setGroqModel] = useState(localStorage.getItem('GROQ_MODEL') || 'openai/gpt-oss-120b');

  // Connection diagnostics
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [jiraStatus, setJiraStatus] = useState('Unknown');
  const [groqStatus, setGroqStatus] = useState('Unknown');
  const [connectionMessage, setConnectionMessage] = useState('');

  // Formats and cleans JIRA / API error response text safely for presentation
  const renderErrorMessage = (err) => {
    if (!err) return null;
    const errStr = typeof err === 'string' ? err : err.message || JSON.stringify(err);
    
    if (errStr.includes("HTTP 404") || errStr.includes("Issue does not exist") || errStr.includes("IssueNot Found") || errStr.includes("not found")) {
      return (
        <span>
          🔍 <strong>Issue Not Found:</strong> The Jira ID you entered does not exist or your API token lacks permissions to see it. Verify the key prefix and project boards.
        </span>
      );
    }
    
    // Split and clean error statements to prevent raw stack trace exposures
    return <span>{errStr.split('\n')[0]}</span>;
  };

  // Helper to render premium status badges
  const renderStatusBadge = (status) => {
    if (status === 'Connected') {
      return (
        <span style={{ color: 'var(--accent-green)', fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          🟢 Connected
        </span>
      );
    }
    if (status === 'Testing' || status === 'Checking') {
      return (
        <span style={{ color: 'var(--accent-cyan)', fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          🟡 Checking...
        </span>
      );
    }
    if (status === 'Unauthenticated' || status === 'Unauthorized' || status === 'Failed') {
      return (
        <span style={{ color: 'var(--accent-red)', fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          🔴 Unauthenticated
        </span>
      );
    }
    if (status === 'Unknown') {
      return (
        <span style={{ color: 'var(--text-muted)', fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          ⚪ Unknown
        </span>
      );
    }
    return (
      <span style={{ color: 'var(--accent-red)', fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
        🔴 Offline
      </span>
    );
  };

  // Initial connection handshake check
  useEffect(() => {
    checkConnectionStatus();
  }, []);

  const checkConnectionStatus = async () => {
    try {
      const headers = {};
      if (jiraUrl) headers['x-jira-url'] = jiraUrl;
      if (jiraEmail) headers['x-jira-email'] = jiraEmail;
      if (jiraToken) headers['x-jira-token'] = jiraToken;
      if (groqKey) headers['x-groq-key'] = groqKey;
      headers['x-groq-model'] = groqModel;

      const res = await fetch('/api/test-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...headers }
      });
      if (res.ok) {
        const data = await res.json();
        setJiraStatus(data.jiraStatus);
        setGroqStatus(data.groqStatus);
      }
    } catch (e) {
      console.error('Failed to run pre-flight connectivity check', e);
    }
  };

  const handleSaveSettings = () => {
    localStorage.setItem('JIRA_URL', jiraUrl);
    localStorage.setItem('JIRA_EMAIL', jiraEmail);
    localStorage.setItem('JIRA_TOKEN', jiraToken);
    localStorage.setItem('GROQ_KEY', groqKey);
    localStorage.setItem('GROQ_MODEL', groqModel);
    setShowSettings(false);
    setConnectionMessage('');
    checkConnectionStatus();
  };

  const handleClearSettings = () => {
    setJiraUrl('');
    setJiraEmail('');
    setJiraToken('');
    setGroqKey('');
    setGroqModel('');
    setConnectionMessage('');
  };

  const handleTestConnection = async () => {
    setIsTestingConnection(true);
    setConnectionMessage('');
    try {
      const headers = {
        'x-jira-url': jiraUrl,
        'x-jira-email': jiraEmail,
        'x-jira-token': jiraToken,
        'x-groq-key': groqKey,
        'x-groq-model': groqModel
      };

      const res = await fetch('/api/test-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...headers }
      });

      if (!res.ok) {
        throw new Error(`Test endpoint failed with status ${res.status}`);
      }

      const data = await res.json();
      setJiraStatus(data.jiraStatus);
      setGroqStatus(data.groqStatus);
      
      const jiraOk = data.jiraStatus === 'Connected';
      const groqOk = data.groqStatus === 'Connected';
      
      if (jiraOk && groqOk) {
        setConnectionMessage('✅ Both JIRA and GROQ connections verified successfully!');
      } else {
        setConnectionMessage(`⚠️ Connectivity partial. Jira: ${data.jiraStatus}, Groq: ${data.groqStatus}`);
      }
    } catch (err) {
      setConnectionMessage(`❌ Connection check error: ${err.message}`);
    } finally {
      setIsTestingConnection(false);
    }
  };

  const handleGeneratePlan = async (e) => {
    e.preventDefault();
    if (!jiraId.trim()) {
      setError('Please input a valid Jira Issue ID.');
      return;
    }

    setError('');
    setTestPlanJson(null);
    setIsGenerating(true);
    setLogs([]);

    const logSteps = [
      '🚀 Initializing BLAST Generation pipeline...',
      '🔍 Resolving proxy authorization headers...',
      '📡 Querying Jira Cloud Issue API (rest/api/3/issue)...',
      '📦 Unpacking ADF response & flattening nested arrays into plain text...',
      '🛡️ Injecting strict Anti-Hallucination rules & built-in QA templates...',
      '🤖 dispatching prompt payload to GROQ API completions (openai/gpt-oss-120b)...',
      '⏳ Waiting for deterministic JSON parsing output...'
    ];

    // Trigger loader simulation
    let currentStep = 0;
    setLogs([logSteps[0]]);
    const interval = setInterval(() => {
      currentStep++;
      if (currentStep < logSteps.length) {
        setLogs(prev => [...prev, logSteps[currentStep]]);
      } else {
        clearInterval(interval);
      }
    }, 700);

    try {
      const headers = {
        'Content-Type': 'application/json',
        'x-jira-url': jiraUrl,
        'x-jira-email': jiraEmail,
        'x-jira-token': jiraToken,
        'x-groq-key': groqKey,
        'x-groq-model': groqModel
      };

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers,
        body: JSON.stringify({ jiraId })
      });

      clearInterval(interval);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Server rejected request or timed out.');
      }

      const data = await response.json();
      setLogs(prev => [...prev, '✅ QA Test Plan payload generated successfully!']);
      setTestPlanJson(data);
    } catch (err) {
      clearInterval(interval);
      setError(err.message || 'An error occurred during generation.');
      setLogs(prev => [...prev, `❌ Pipeline error: ${err.message}`]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadPlan = () => {
    if (!testPlanJson) return;
    const mdContent = jsonToMarkdown(testPlanJson);
    const blob = new Blob([mdContent], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `test-plan-${testPlanJson.jiraId || jiraId}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const markdownString = testPlanJson ? jsonToMarkdown(testPlanJson) : '';

  return (
    <>
      {/* App Header */}
      <header className="app-header glass-panel">
        <div className="brand-section">
          <div className="brand-logo">QA</div>
          <div>
            <h1>Jira QA Test Plan Agent</h1>
            <p className="brand-subtitle">Powered by B.L.A.S.T. & GROQ</p>
          </div>
        </div>
        <div className="header-actions">
          <div className="connection-pill">
            <span className={`pulse-dot ${(jiraStatus === 'Connected' && groqStatus === 'Connected') ? '' : 'error'}`}></span>
            Status: {jiraStatus === 'Connected' && groqStatus === 'Connected' ? 'Linked' : 'Credentials Offline'}
          </div>
          <button className="btn btn-secondary" onClick={() => setShowSettings(true)}>
            Settings
          </button>
        </div>
      </header>

      {/* Main Layout Grid */}
      <main className="app-grid">
        {/* Left Side: Control Panel */}
        <section className="control-panel glass-panel">
          <h2 style={{ fontSize: '18px', marginBottom: '20px', fontWeight: 600 }}>Jira Test Plan Generator</h2>
          
          <form onSubmit={handleGeneratePlan}>
            <div className="form-group">
              <label className="form-label">Jira Issue ID</label>
              <div className="input-container">
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="Enter Jira Issue ID (e.g., KAN-4)"
                  value={jiraId}
                  onChange={(e) => setJiraId(e.target.value)}
                  disabled={isGenerating}
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ width: '100%', marginTop: '8px' }}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  Generating <span className="terminal-spinner"></span>
                </>
              ) : 'Generate Test Plan'}
            </button>
          </form>

          {/* Configuration Summary in control panel */}
          <div style={{ marginTop: '30px', borderTop: '1px solid var(--border-glass)', paddingTop: '20px' }}>
            <h3 style={{ fontSize: '13px', textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '0.5px', marginBottom: '12px' }}>
              Active Configuration
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Target Instance:</span>
                <span style={{ color: jiraUrl ? 'var(--accent-cyan)' : 'var(--accent-red)', fontWeight: 500, maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {jiraUrl ? jiraUrl.replace(/^https?:\/\//, '') : '[Environment Defaults]'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>AI Engine:</span>
                <span style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
                  {groqModel || 'openai/gpt-oss-120b'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-muted)' }}>Jira Gateway:</span>
                {renderStatusBadge(jiraStatus)}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-muted)' }}>LLM Gateway:</span>
                {renderStatusBadge(groqStatus)}
              </div>
            </div>
          </div>
        </section>

        {/* Right Side: Output Results */}
        <section className="output-card glass-panel">
          <div className="output-header">
            <h2 className="output-title">
              🔍 Test Plan Output {testPlanJson && <span style={{ color: 'var(--accent-purple)', fontSize: '13px', background: 'rgba(139, 92, 246, 0.1)', padding: '2px 8px', borderRadius: '4px' }}>{testPlanJson.jiraId}</span>}
            </h2>
            {testPlanJson && (
              <button className="btn btn-secondary" onClick={handleDownloadPlan}>
                📥 Download Markdown
              </button>
            )}
          </div>

          {/* Renders simulated logs while generation pipeline is active */}
          {isGenerating && (
            <div className="terminal-loader">
              {logs.map((log, index) => (
                <div key={index} className="terminal-line">
                  <span className="terminal-prefix">&gt;</span>
                  <span>{log}</span>
                </div>
              ))}
              <div className="terminal-line" style={{ marginTop: '10px' }}>
                <span className="terminal-prefix">&gt;</span>
                <span style={{ color: 'var(--text-muted)' }}>Running BLAST Engine...</span>
                <span className="terminal-spinner"></span>
              </div>
            </div>
          )}

          {/* Displays markdown HTML once generated */}
          {!isGenerating && testPlanJson && (
            <div className="markdown-body">
              <ReactMarkdown>{markdownString}</ReactMarkdown>
            </div>
          )}

          {/* Displays error layout if caught */}
          {!isGenerating && error && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1,
              padding: '40px',
              textAlign: 'center',
              maxWidth: '600px',
              margin: 'auto',
              borderRadius: '16px',
              background: 'rgba(239, 68, 68, 0.03)',
              border: '1px solid rgba(239, 68, 68, 0.15)',
              boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)'
            }}>
              <span style={{ fontSize: '48px', marginBottom: '16px', display: 'block' }}>⚠️</span>
              <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#fca5a5', margin: '0 0 12px 0' }}>
                Pipeline Execution Failed
              </h3>
              <p style={{ fontSize: '14px', lineHeight: '1.6', color: 'var(--text-secondary)', margin: 0 }}>
                {renderErrorMessage(error)}
              </p>
            </div>
          )}

          {/* Default Wireframe Empty State */}
          {!isGenerating && !testPlanJson && !error && (
            <div className="output-empty">
              <span className="empty-icon">📋</span>
              <p style={{ fontSize: '16px', fontWeight: 500, color: 'var(--text-secondary)' }}>
                No Test Plan Generated Yet
              </p>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', maxWidth: '380px' }}>
                Enter a JIRA Issue ID on the left panel and trigger "Generate". The Express proxy will compile issue fields and output structured test plans here.
              </p>
            </div>
          )}
        </section>
      </main>

      {/* Settings Dialog Overlay */}
      {showSettings && (
        <div className="modal-overlay">
          <div className="modal-content glass-panel">
            <div className="modal-header">
              <h2 className="modal-title">Settings & Configuration</h2>
              <button className="close-btn" onClick={() => setShowSettings(false)}>×</button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Jira Base URL</label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="https://your-domain.atlassian.net"
                  value={jiraUrl}
                  onChange={(e) => setJiraUrl(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Jira Email Address</label>
                <input 
                  type="email" 
                  className="input-field" 
                  placeholder="you@example.com"
                  value={jiraEmail}
                  onChange={(e) => setJiraEmail(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Jira API Token</label>
                <input 
                  type="password" 
                  className="input-field mono" 
                  placeholder="Atlassian Basic auth token"
                  value={jiraToken}
                  onChange={(e) => setJiraToken(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Groq API Key</label>
                <input 
                  type="password" 
                  className="input-field mono" 
                  placeholder="gsk_..."
                  value={groqKey}
                  onChange={(e) => setGroqKey(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Groq LLM Model</label>
                <input 
                  type="text" 
                  className="input-field mono" 
                  placeholder="openai/gpt-oss-120b"
                  value={groqModel}
                  onChange={(e) => setGroqModel(e.target.value)}
                />
              </div>

              {connectionMessage && (
                <div className={`alert ${connectionMessage.startsWith('✅') ? 'alert-success' : connectionMessage.startsWith('⚠️') ? 'alert-error' : 'alert-error'}`} style={{ fontSize: '13px', margin: '8px 0 0' }}>
                  {connectionMessage}
                </div>
              )}

              <div style={{ display: 'flex', gap: '12px', marginTop: '20px', justifyContent: 'flex-end', width: '100%' }}>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  style={{ marginRight: 'auto', background: 'rgba(239, 68, 68, 0.05)', borderColor: 'rgba(239, 68, 68, 0.2)', color: '#fca5a5' }}
                  onClick={handleClearSettings}
                >
                  Clear Settings
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={handleTestConnection}
                  disabled={isTestingConnection}
                >
                  {isTestingConnection ? 'Testing...' : 'Test Connection'}
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary" 
                  onClick={handleSaveSettings}
                >
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="footer">
        Antigravity BLAST Engine © 2026. Structured Full-Stack QA Test Generation Proxy.
      </footer>
    </>
  );
}
