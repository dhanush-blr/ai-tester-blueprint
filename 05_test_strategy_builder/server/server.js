const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// Self-contained environment variable parser
function loadEnv() {
  const envPath = path.resolve(__dirname, '../.env');
  if (fs.existsSync(envPath)) {
    const envFile = fs.readFileSync(envPath, 'utf8');
    envFile.split('\n').forEach(line => {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        const key = match[1];
        let value = match[2] || '';
        if (value.startsWith('"') && value.endsWith('"')) {
          value = value.slice(1, -1);
        } else if (value.startsWith("'") && value.endsWith("'")) {
          value = value.slice(1, -1);
        }
        process.env[key] = value;
      }
    });
  }
}

// Load environment variables
loadEnv();

const app = express();
const PORT = process.env.PORT || 5002; // Using 5002 to avoid conflicts with other modules

app.use(cors());
app.use(express.json());

// Recurse and flatten Jira's Atlassian Document Format (ADF) to plain text
function flattenADF(node) {
  if (!node) return '';
  if (typeof node === 'string') return node.trim();
  if (node.type === 'text') return node.text || '';
  if (Array.isArray(node)) {
    return node.map(flattenADF).join('');
  }
  
  let text = '';
  if (node.content) {
    text += flattenADF(node.content);
  }
  
  if (['paragraph', 'heading', 'listItem'].includes(node.type)) {
    text += '\n';
  }
  return text.trim();
}

// Normalize raw Jira API payload to standardized Schema
function normalizeJiraIssue(issue) {
  const fields = issue.fields || {};
  return {
    key: issue.key,
    summary: fields.summary || '',
    description: flattenADF(fields.description),
    issueType: fields.issuetype ? fields.issuetype.name : 'Unknown',
    status: fields.status ? fields.status.name : 'Unknown',
    priority: fields.priority ? fields.priority.name : 'Normal',
    components: fields.components ? fields.components.map(c => c.name) : [],
    labels: fields.labels || [],
    fixVersions: fields.fixVersions ? fields.fixVersions.map(v => v.name) : [],
    reporter: fields.reporter ? fields.reporter.displayName : 'None',
    assignee: fields.assignee ? fields.assignee.displayName : 'Unassigned'
  };
}

// Fetch helper from JIRA Cloud API
async function fetchJiraIssue(jiraUrl, email, token, issueId) {
  const cleanUrl = jiraUrl.replace(/\/+$/, '');
  const endpoint = `${cleanUrl}/rest/api/3/issue/${issueId}`;
  const authHeader = `Basic ${Buffer.from(`${email}:${token}`).toString('base64')}`;

  const response = await fetch(endpoint, {
    method: 'GET',
    headers: {
      'Authorization': authHeader,
      'Accept': 'application/json'
    }
  });

  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage = `Failed to fetch Jira issue ${issueId} (HTTP ${response.status}).`;
    try {
      const errJson = JSON.parse(errorText);
      if (errJson.errorMessages && errJson.errorMessages.length > 0) {
        errorMessage = `Failed to fetch issue ${issueId}: ${errJson.errorMessages[0]}`;
      }
    } catch (e) {}
    throw new Error(errorMessage);
  }

  const rawIssue = await response.json();
  return normalizeJiraIssue(rawIssue);
}

// Handshake verification tools
async function testJiraConnection(jiraUrl, email, token) {
  const cleanUrl = jiraUrl.replace(/\/+$/, '');
  const endpoint = `${cleanUrl}/rest/api/3/myself`;
  const authHeader = `Basic ${Buffer.from(`${email}:${token}`).toString('base64')}`;

  const response = await fetch(endpoint, {
    method: 'GET',
    headers: {
      'Authorization': authHeader,
      'Accept': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  return true;
}

async function testGroqConnection(apiKey, model) {
  const endpoint = 'https://api.groq.com/openai/v1/chat/completions';
  const payload = {
    model: model,
    messages: [
      { role: 'user', content: 'Respond with the single word "READY"' }
    ],
    temperature: 0
  };

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  return true;
}

// System instructions for Groq
const systemPrompt = `You are a Principal Quality Architect and Lead QA Automation Engineer.
Your task is to analyze the provided Jira ticket details and generate a comprehensive, formal, and boardroom-ready Quality Assurance Test Strategy document.

Strict Behavioral Rules & Constraints:
1. Tech Stack Detection & Tool Mapping: Analyze the issue context to detect the target technologies. Recommend specific validation tools precisely mapping to the tech stack (e.g., if React is used, recommend Jest/React Testing Library/Playwright; if Express, Supertest; if database SQL, pg-tester, etc.).
2. Risk & Mitigation Matrix: Identify concrete potential failure modes or architectural risks for this change. Document them in the riskMatrix. Mitigations must be concrete QA validation tasks.
3. Corporate Governance: Propose compliance requirements (e.g. security audits, accessibility checks, privacy compliance) and define Quality Gates for sign-off.
4. Strict Anti-Hallucination: Do not invent API endpoints, parameter names, or database schemas that are not explicitly mentioned in the ticket. If details are missing, write "TBD" or add them to "gapsAndQuestions".

Your output must be a valid JSON object matching the following structure:
{
  "jiraId": "string",
  "summary": "string",
  "generatedAt": "string (ISO timestamp)",
  "testStrategy": {
    "title": "string",
    "executiveSummary": "string",
    "targetTechStack": {
      "frontend": ["string"],
      "backend": ["string"],
      "databases": ["string"],
      "integrations": ["string"]
    },
    "testLevels": [
      {
        "level": "string",
        "inScope": true,
        "description": "string",
        "tools": ["string"]
      }
    ],
    "scopeBoundaries": {
      "inScope": ["string"],
      "outOfScope": ["string"]
    },
    "riskMatrix": [
      {
        "risk": "string",
        "impact": "High | Medium | Low",
        "likelihood": "High | Medium | Low",
        "mitigation": "string"
      }
    ],
    "corporateGovernance": {
      "complianceRequirements": ["string"],
      "qualityGates": ["string"]
    },
    "gapsAndQuestions": ["string"]
  }
}`;

// API: Verify Connections
app.post('/api/test-connection', async (req, res) => {
  try {
    const jiraUrl = req.headers['x-jira-url'] || req.body.jiraUrl || process.env.JIRA_URL;
    const jiraEmail = req.headers['x-jira-email'] || req.body.jiraEmail || process.env.JIRA_EMAIL;
    const jiraToken = req.headers['x-jira-token'] || req.body.jiraToken || process.env.JIRA_TOKEN;
    const groqKey = req.headers['x-groq-key'] || req.body.groqKey || process.env.GROQ_KEY;
    const modelOverride = req.headers['x-groq-model'] || req.body.modelOverride || 'openai/gpt-oss-120b';

    let jiraStatus = 'Not Configured';
    let groqStatus = 'Not Configured';

    if (jiraUrl && jiraEmail && jiraToken) {
      try {
        await testJiraConnection(jiraUrl, jiraEmail, jiraToken);
        jiraStatus = 'Connected';
      } catch (e) {
        jiraStatus = `Failed: ${e.message}`;
      }
    }

    if (groqKey) {
      try {
        await testGroqConnection(groqKey, modelOverride);
        groqStatus = 'Connected';
      } catch (e) {
        groqStatus = `Failed: ${e.message}`;
      }
    }

    return res.status(200).json({ jiraStatus, groqStatus });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// API: Generate Test Strategy
app.post('/api/generate-strategy', async (req, res) => {
  try {
    const { jiraId } = req.body;
    if (!jiraId) {
      return res.status(400).json({ error: 'Jira Issue ID is required.' });
    }

    const jiraUrl = req.headers['x-jira-url'] || req.body.jiraUrl || process.env.JIRA_URL;
    const jiraEmail = req.headers['x-jira-email'] || req.body.jiraEmail || process.env.JIRA_EMAIL;
    const jiraToken = req.headers['x-jira-token'] || req.body.jiraToken || process.env.JIRA_TOKEN;
    const groqKey = req.headers['x-groq-key'] || req.body.groqKey || process.env.GROQ_KEY;
    const modelOverride = req.headers['x-groq-model'] || req.body.modelOverride || 'openai/gpt-oss-120b';

    if (!jiraUrl || !jiraEmail || !jiraToken) {
      return res.status(400).json({ error: 'Jira authentication parameters are missing. Check Settings panel.' });
    }
    if (!groqKey) {
      return res.status(400).json({ error: 'Groq API Key is missing. Check Settings panel.' });
    }

    console.log(`[SERVER] Generating Strategy for Jira ID: ${jiraId}`);

    // 1. Fetch & normalize Jira issues
    const normalizedIssue = await fetchJiraIssue(jiraUrl, jiraEmail, jiraToken, jiraId);

    // 2. Call Groq Completion Endpoint
    const endpoint = 'https://api.groq.com/openai/v1/chat/completions';
    const userPrompt = `Generate a Quality Assurance Test Strategy for the following JIRA issue details:
${JSON.stringify(normalizedIssue, null, 2)}`;

    const payload = {
      model: modelOverride,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      response_format: { type: 'json_object' },
      temperature: 0
    };

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Groq API returned HTTP ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    const rawContent = result.choices && result.choices[0] && result.choices[0].message && result.choices[0].message.content;
    
    if (!rawContent) {
      throw new Error('Groq returned empty chat completion choices.');
    }

    const strategyJson = JSON.parse(rawContent);
    return res.status(200).json(strategyJson);

  } catch (err) {
    console.error('[SERVER ERROR]', err.message);
    const statusCode = err.message.includes('401') || err.message.includes('unauthorized') ? 401 : 500;
    return res.status(statusCode).json({ error: err.message });
  }
});

// Serve client assets in production
const clientBuildPath = path.resolve(__dirname, '../client/dist');
app.use(express.static(clientBuildPath));

app.get(/^(?!\/api).*/, (req, res) => {
  const indexPath = path.join(clientBuildPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send('Application build folder is empty. Run build first.');
  }
});

app.listen(PORT, () => {
  console.log(`[SERVER] Strategy Builder API running on port ${PORT}...`);
});

module.exports = app;

