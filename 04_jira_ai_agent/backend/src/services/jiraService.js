const fs = require('fs');
const path = require('path');

// Self-contained dotenv parser to maintain zero-dependencies
function loadEnv() {
  const envPath = path.resolve(__dirname, '../../../.env');
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

// Flatten ADF (Atlassian Document Format) recursively to plain text
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

async function runHandshake(jiraUrl, email, token) {
  const cleanUrl = jiraUrl.replace(/\/+$/, '');
  const endpoint = `${cleanUrl}/rest/api/3/myself`;
  const authHeader = `Basic ${Buffer.from(`${email}:${token}`).toString('base64')}`;

  console.log(`[JIRA HANDSHAKE] Checking connectivity for user: ${email}...`);
  console.log(`[JIRA HANDSHAKE] Endpoint: ${endpoint}`);

  const response = await fetch(endpoint, {
    method: 'GET',
    headers: {
      'Authorization': authHeader,
      'Accept': 'application/json'
    }
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Jira connection failed (HTTP ${response.status}): ${errorText}`);
  }

  const user = await response.json();
  console.log(`[JIRA HANDSHAKE] Success! Authenticated as: ${user.displayName} (${user.emailAddress})`);
  return user;
}

async function fetchAndNormalizeIssue(jiraUrl, email, token, issueId) {
  const cleanUrl = jiraUrl.replace(/\/+$/, '');
  const endpoint = `${cleanUrl}/rest/api/3/issue/${issueId}`;
  const authHeader = `Basic ${Buffer.from(`${email}:${token}`).toString('base64')}`;

  console.log(`[JIRA FETCH] Retrieving issue: ${issueId}...`);

  const response = await fetch(endpoint, {
    method: 'GET',
    headers: {
      'Authorization': authHeader,
      'Accept': 'application/json'
    }
  });

  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage = `Failed to fetch issue ${issueId} (HTTP ${response.status}).`;
    try {
      const errJson = JSON.parse(errorText);
      if (errJson.errorMessages && errJson.errorMessages.length > 0) {
        errorMessage = `Failed to fetch issue ${issueId} (HTTP ${response.status}): ${errJson.errorMessages[0]}`;
      } else if (errJson.errors && Object.keys(errJson.errors).length > 0) {
        const errorDetails = Object.entries(errJson.errors).map(([key, val]) => `${key}: ${val}`).join(', ');
        errorMessage = `Failed to fetch issue ${issueId} (HTTP ${response.status}): ${errorDetails}`;
      }
    } catch (e) {
      if (errorText && errorText.trim().length > 0 && errorText.length < 150) {
        errorMessage += ` Details: ${errorText.trim()}`;
      }
    }
    throw new Error(errorMessage);
  }

  const rawIssue = await response.json();
  const normalized = normalizeJiraIssue(rawIssue);
  console.log(`[JIRA FETCH] Success! Normalized data for issue: ${normalized.key}`);
  return normalized;
}

// CLI Execution Handler
if (require.main === module) {
  loadEnv();

  const jiraUrl = process.env.JIRA_URL;
  const email = process.env.JIRA_EMAIL;
  const token = process.env.JIRA_TOKEN;

  if (!jiraUrl || !email || !token) {
    console.error('Error: JIRA_URL, JIRA_EMAIL, and JIRA_TOKEN must be defined in your .env file.');
    process.exit(1);
  }

  const targetIssue = process.argv[2];

  (async () => {
    try {
      await runHandshake(jiraUrl, email, token);

      if (targetIssue) {
        const issueData = await fetchAndNormalizeIssue(jiraUrl, email, token, targetIssue);
        console.log('\n--- Normalized Jira Issue Payload ---');
        console.log(JSON.stringify(issueData, null, 2));
      } else {
        console.log('\nNo target Issue ID provided as CLI arg. Skipping single issue retrieval check.');
        console.log('Usage: node backend/src/services/jiraService.js <ISSUE_ID> (e.g., node backend/src/services/jiraService.js VWO-48)');
      }
    } catch (err) {
      console.error('\n[JIRA CLIENT ERROR]', err.message);
      process.exit(1);
    }
  })();
}

module.exports = {
  loadEnv,
  runHandshake,
  fetchAndNormalizeIssue,
  normalizeJiraIssue
};
