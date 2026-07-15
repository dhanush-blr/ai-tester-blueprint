import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';


// Client-side JSON to boardroom-ready Markdown layout converter
function jsonToMarkdown(payload) {
  if (!payload || !payload.testStrategy) return '';
  
  const ts = payload.testStrategy || {};
  const tech = ts.targetTechStack || {};
  const boundaries = ts.scopeBoundaries || {};
  const gov = ts.corporateGovernance || {};
  
  const frontend = (tech.frontend || []).filter(item => typeof item === 'string' && item.trim() !== "");
  const backend = (tech.backend || []).filter(item => typeof item === 'string' && item.trim() !== "");
  const databases = (tech.databases || []).filter(item => typeof item === 'string' && item.trim() !== "");
  const integrations = (tech.integrations || []).filter(item => typeof item === 'string' && item.trim() !== "");
  
  const inScope = (boundaries.inScope || []).filter(item => typeof item === 'string' && item.trim() !== "");
  const outOfScope = (boundaries.outOfScope || []).filter(item => typeof item === 'string' && item.trim() !== "");
  
  const testLevels = (ts.testLevels || []).filter(tl => tl && typeof tl.level === 'string' && tl.level.trim() !== "");
  const riskMatrix = (ts.riskMatrix || []).filter(r => r && typeof r.risk === 'string' && r.risk.trim() !== "");
  const compliance = (gov.complianceRequirements || []).filter(c => typeof c === 'string' && c.trim() !== "");
  const qualityGates = (gov.qualityGates || []).filter(g => typeof g === 'string' && g.trim() !== "");
  const gaps = (ts.gapsAndQuestions || []).filter(gap => typeof gap === 'string' && gap.trim() !== "");

  let md = `# QA Test Strategy: ${payload.jiraId} - ${ts.title || payload.summary || 'Jira Issue'}\n\n`;
  md += `* **Generated At**: ${payload.generatedAt || new Date().toISOString()}\n`;
  md += `* **Author**: Antigravity QA AI Agent\n\n`;

  md += `## 1. Executive Summary\n${ts.executiveSummary || 'TBD'}\n\n`;

  md += `## 2. Target Tech Stack\n`;
  md += `| Layer | Technologies |\n`;
  md += `| :--- | :--- |\n`;
  md += `| **Frontend** | ${frontend.length > 0 ? frontend.join(', ') : 'TBD'} |\n`;
  md += `| **Backend & APIs** | ${backend.length > 0 ? backend.join(', ') : 'TBD'} |\n`;
  md += `| **Databases & Cache** | ${databases.length > 0 ? databases.join(', ') : 'TBD'} |\n`;
  md += `| **External Integrations** | ${integrations.length > 0 ? integrations.join(', ') : 'TBD'} |\n\n`;

  md += `## 3. Scope Boundaries\n`;
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

  md += `## 4. Test Levels & Methodology\n`;
  md += `| Level | Target Scope / Focus | Mapped Tools |\n`;
  md += `| :--- | :--- | :--- |\n`;
  if (testLevels.length > 0) {
    testLevels.forEach(tl => {
      md += `| **${tl.level}** | ${tl.description || 'TBD'} | ${Array.isArray(tl.tools) ? tl.tools.join(', ') : 'TBD'} |\n`;
    });
  } else {
    md += `| TBD | TBD | TBD |\n`;
  }
  md += `\n`;

  md += `## 5. Risk & Mitigation Matrix\n`;
  md += `| Risk / Failure Mode | Impact | Likelihood | Quality Mitigation |\n`;
  md += `| :--- | :--- | :--- | :--- |\n`;
  if (riskMatrix.length > 0) {
    riskMatrix.forEach(r => {
      md += `| ${r.risk} | **${r.impact}** | **${r.likelihood}** | ${r.mitigation} |\n`;
    });
  } else {
    md += `| TBD | TBD | TBD | TBD |\n`;
  }
  md += `\n`;

  md += `## 6. Enterprise Corporate Governance\n`;
  md += `### Compliance Requirements\n`;
  if (compliance.length > 0) {
    compliance.forEach(item => { md += `- ${item}\n`; });
  } else {
    md += `- TBD / Standard internal controls\n`;
  }
  md += `\n### Quality Gates\n`;
  if (qualityGates.length > 0) {
    qualityGates.forEach(item => { md += `- ${item}\n`; });
  } else {
    md += `- TBD\n`;
  }
  md += `\n`;

  md += `## 7. Gaps & Questions\n`;
  if (gaps.length > 0) {
    gaps.forEach(gap => { md += `- ${gap}\n`; });
  } else {
    md += `*No requirement gaps identified.*\n`;
  }

  return md;
}

export default function App() {
  // Config overrides states
  const [jiraUrl, setJiraUrl] = useState(localStorage.getItem('JIRA_URL') || '');
  const [jiraEmail, setJiraEmail] = useState(localStorage.getItem('JIRA_EMAIL') || '');
  const [jiraToken, setJiraToken] = useState(localStorage.getItem('JIRA_TOKEN') || '');
  const [groqKey, setGroqKey] = useState(localStorage.getItem('GROQ_KEY') || '');
  const [groqModel, setGroqModel] = useState(localStorage.getItem('GROQ_MODEL') || 'openai/gpt-oss-120b');

  // App running states
  const [jiraId, setJiraId] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Real-time diagnostics
  const [jiraStatus, setJiraStatus] = useState(localStorage.getItem('STATUS_JIRA') || 'Not Tested');
  const [groqStatus, setGroqStatus] = useState(localStorage.getItem('STATUS_GROQ') || 'Not Tested');

  // Strategy payloads
  const [strategyData, setStrategyData] = useState(null);
  const [markdownContent, setMarkdownContent] = useState('');

  // Auto-trigger test connection on initialization if credentials exist
  useEffect(() => {
    if (jiraUrl && jiraEmail && jiraToken && groqKey) {
      silentVerifyConnection();
    }
  }, []);

  const silentVerifyConnection = async () => {
    try {
      const response = await fetch('/api/test-connection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-jira-url': jiraUrl,
          'x-jira-email': jiraEmail,
          'x-jira-token': jiraToken,
          'x-groq-key': groqKey,
          'x-groq-model': groqModel
        }
      });
      if (response.ok) {
        const data = await response.json();
        setJiraStatus(data.jiraStatus);
        setGroqStatus(data.groqStatus);
        localStorage.setItem('STATUS_JIRA', data.jiraStatus);
        localStorage.setItem('STATUS_GROQ', data.groqStatus);
      }
    } catch (e) {}
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setErrorMsg('');
    try {
      const response = await fetch('/api/test-connection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-jira-url': jiraUrl,
          'x-jira-email': jiraEmail,
          'x-jira-token': jiraToken,
          'x-groq-key': groqKey,
          'x-groq-model': groqModel
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP Error ${response.status}`);
      }

      const data = await response.json();
      setJiraStatus(data.jiraStatus);
      setGroqStatus(data.groqStatus);
      localStorage.setItem('STATUS_JIRA', data.jiraStatus);
      localStorage.setItem('STATUS_GROQ', data.groqStatus);
    } catch (err) {
      setErrorMsg(`Connection Check Failed: ${err.message}`);
    } finally {
      setIsTesting(false);
    }
  };

  const handleSaveSettings = () => {
    localStorage.setItem('JIRA_URL', jiraUrl);
    localStorage.setItem('JIRA_EMAIL', jiraEmail);
    localStorage.setItem('JIRA_TOKEN', jiraToken);
    localStorage.setItem('GROQ_KEY', groqKey);
    localStorage.setItem('GROQ_MODEL', groqModel);
    setShowSettings(false);
  };

  const handleResetSettings = () => {
    setJiraUrl('');
    setJiraEmail('');
    setJiraToken('');
    setGroqKey('');
    setGroqModel('openai/gpt-oss-120b');
    setJiraStatus('Not Tested');
    setGroqStatus('Not Tested');
    localStorage.clear();
  };

  const handleGenerateStrategy = async (e) => {
    e.preventDefault();
    if (!jiraId.trim()) {
      setErrorMsg('Please enter a valid Jira Issue ID.');
      return;
    }

    setIsGenerating(true);
    setErrorMsg('');
    setStrategyData(null);
    setMarkdownContent('');

    try {
      const response = await fetch('/api/generate-strategy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-jira-url': jiraUrl,
          'x-jira-email': jiraEmail,
          'x-jira-token': jiraToken,
          'x-groq-key': groqKey,
          'x-groq-model': groqModel
        },
        body: JSON.stringify({ jiraId })
      });

      const resJson = await response.json();

      if (!response.ok) {
        throw new Error(resJson.error || `HTTP ${response.status} Server Failure`);
      }

      setStrategyData(resJson);
      const compiledMarkdown = jsonToMarkdown(resJson);
      setMarkdownContent(compiledMarkdown);
    } catch (err) {
      setErrorMsg(err.message || 'An unexpected error occurred during Strategy generation.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadMarkdown = () => {
    if (!markdownContent) return;
    const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `test-strategy-${jiraId || 'export'}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="app-container">
      {/* Header Bar */}
      <header className="app-header">
        <h1 className="brand-title">
          <span>⚡</span> Test Strategy Builder AI
        </h1>
        <button 
          className="btn-secondary" 
          onClick={() => setShowSettings(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          ⚙️ Settings Overlay
        </button>
      </header>

      {/* Main Split Layout */}
      <main className="main-layout">
        
        {/* Left Control Panel */}
        <section className="sidebar-panel glass-panel">
          <h2 style={{ fontSize: '1.2rem', color: '#ffffff', marginBottom: '8px' }}>Launch Control</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Enter a Jira Issue ID below to dynamically generate a boardroom-ready QA test strategy matching the technology and risk context.
          </p>

          <form onSubmit={handleGenerateStrategy} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '10px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-accent)' }}>JIRA ISSUE ID</label>
            <input 
              type="text" 
              placeholder="e.g. KAN-4" 
              value={jiraId}
              onChange={(e) => setJiraId(e.target.value.toUpperCase())}
              disabled={isGenerating}
            />
            <button 
              type="submit" 
              className="btn-primary" 
              disabled={isGenerating || !jiraId}
              style={{ marginTop: '5px' }}
            >
              {isGenerating ? 'Building Strategy...' : 'Generate QA Strategy'}
            </button>
          </form>

          <hr style={{ border: 0, height: '1px', background: 'var(--border-color)', margin: '10px 0' }} />

          {/* Active Settings Status Indicators */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <h3 style={{ fontSize: '0.9rem', color: '#ffffff' }}>Connections Status</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Atlassian Jira:</span>
              <span className={`badge ${jiraStatus === 'Connected' ? 'badge-success' : jiraStatus.startsWith('Failed') ? 'badge-danger' : 'badge-warning'}`}>
                {jiraStatus}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Groq LLM Gate:</span>
              <span className={`badge ${groqStatus === 'Connected' ? 'badge-success' : groqStatus.startsWith('Failed') ? 'badge-danger' : 'badge-warning'}`}>
                {groqStatus}
              </span>
            </div>
          </div>

          <hr style={{ border: 0, height: '1px', background: 'var(--border-color)', margin: '10px 0' }} />

          {/* Download Strategy button */}
          <button 
            className="btn-secondary" 
            onClick={handleDownloadMarkdown}
            disabled={!markdownContent}
            style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '8px' }}
          >
            💾 Download Strategy (.md)
          </button>
        </section>

        {/* Right Viewport Panel */}
        <section className="viewport-panel glass-panel">
          
          {/* Error display */}
          {errorMsg && (
            errorMsg.toLowerCase().includes('failed to fetch issue') || errorMsg.toLowerCase().includes('jira') ? (
              <div className="error-viewport">
                <div className="error-header">
                  <span>⚠️</span> Jira Resource Not Found
                </div>
                <p style={{ fontSize: '0.95rem', fontWeight: 'bold', color: 'var(--text-danger)' }}>
                  {errorMsg}
                </p>
                <div style={{ marginTop: '12px', paddingLeft: '4px', fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <p><strong>Troubleshooting Checkpoints:</strong></p>
                  <p>• <strong>Formatting Check:</strong> Verify the ticket structure is completely specified (e.g., use <code>KAN-5</code> instead of just <code>KAN</code>).</p>
                  <p>• <strong>Existence Verification:</strong> Confirm that the specified issue index physically exists inside your active Atlassian Jira Cloud project dashboard.</p>
                  <p>• <strong>Access Permissibility:</strong> Ensure your configured API Token belongs to an account possessing active read permissions for the target workspace board.</p>
                </div>
              </div>
            ) : (
              <div className="error-viewport">
                <div className="error-header">
                  <span>⚠️</span> Generation Exception Caught
                </div>
                <p style={{ fontSize: '0.9rem' }}>{errorMsg}</p>
              </div>
            )
          )}


          {/* Generating Loader */}
          {isGenerating && (
            <div className="pulse-loader">
              <div className="pulse-dot"></div>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-accent)', fontWeight: 600 }}>
                Fetching issue details & mapping technical test matrices...
              </p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                This takes a few seconds to run the Groq completion pipeline.
              </p>
            </div>
          )}

          {/* Empty state prompt */}
          {!isGenerating && !markdownContent && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, color: 'var(--text-muted)', gap: '10px' }}>
              <span style={{ fontSize: '2.5rem' }}>📋</span>
              <p style={{ fontWeight: 500 }}>No QA strategy generated yet.</p>
              <p style={{ fontSize: '0.8rem' }}>Enter a Jira ID on the left and click generate to load the preview panel.</p>
            </div>
          )}

          {/* Markdown strategy viewer */}
          {!isGenerating && markdownContent && (
            <div className="strategy-preview-card">
              <article className="markdown-body">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdownContent}</ReactMarkdown>
              </article>
            </div>
          )}

        </section>
      </main>

      {/* Settings Dialog Modal overlay */}
      {showSettings && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h2 style={{ fontSize: '1.4rem', color: '#ffffff', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>⚙️ Configuration Settings Overlay</span>
              <button 
                onClick={() => setShowSettings(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.2rem' }}
              >
                &times;
              </button>
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>JIRA BASE URL</label>
                <input 
                  type="text" 
                  placeholder="https://your-domain.atlassian.net" 
                  value={jiraUrl}
                  onChange={(e) => setJiraUrl(e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>JIRA EMAIL ID</label>
                  <input 
                    type="text" 
                    placeholder="email@example.com" 
                    value={jiraEmail}
                    onChange={(e) => setJiraEmail(e.target.value)}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>JIRA API TOKEN</label>
                  <input 
                    type="password" 
                    placeholder="Atlassian API token" 
                    value={jiraToken}
                    onChange={(e) => setJiraToken(e.target.value)}
                    style={{ background: 'rgba(0, 0, 0, 0.3)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-main)', padding: '10px 14px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '12px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>GROQ API KEY</label>
                  <input 
                    type="password" 
                    placeholder="gsk_..." 
                    value={groqKey}
                    onChange={(e) => setGroqKey(e.target.value)}
                    style={{ background: 'rgba(0, 0, 0, 0.3)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-main)', padding: '10px 14px' }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>GROQ MODEL</label>
                  <select 
                    value={groqModel}
                    onChange={(e) => setGroqModel(e.target.value)}
                  >
                    <option value="openai/gpt-oss-120b">openai/gpt-oss-120b (Free)</option>
                    <option value="llama3-70b-8192">Llama 3 70B</option>
                    <option value="llama3-8b-8192">Llama 3 8B</option>
                    <option value="mixtral-8x7b-32768">Mixtral 8x7B</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                <button 
                  type="button" 
                  className="btn-secondary" 
                  onClick={handleTestConnection}
                  disabled={isTesting}
                  style={{ flex: 1 }}
                >
                  {isTesting ? 'Testing connection...' : 'Test Connections'}
                </button>
                <button 
                  type="button" 
                  className="btn-primary" 
                  onClick={handleSaveSettings}
                  style={{ flex: 1 }}
                >
                  Save Settings
                </button>
              </div>

              <button 
                type="button" 
                onClick={handleResetSettings}
                style={{ background: 'none', border: 'none', color: 'var(--text-danger)', fontSize: '0.8rem', cursor: 'pointer', textAlign: 'center', marginTop: '10px', textDecoration: 'underline' }}
              >
                Reset All Saved Settings
              </button>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
