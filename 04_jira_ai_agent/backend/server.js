const express = require('express');
const cors = require('cors');
const path = require('path');
const { loadEnv, fetchAndNormalizeIssue } = require('./src/services/jiraService');
const { generateTestPlan } = require('./src/services/testPlanService');

// Load environment variables initially
loadEnv();

const app = express();
const PORT = process.env.PORT || 5001;

// Enable CORS and JSON body parser middlewares
app.use(cors());
app.use(express.json());

// API Generation Endpoint
app.post('/api/generate', async (req, res) => {
  try {
    const { jiraId } = req.body;
    if (!jiraId) {
      return res.status(400).json({ error: 'Jira Issue ID is required (e.g., VWO-48).' });
    }

    // Resolve credentials prioritizing Headers -> Request Body -> Local Env defaults
    const jiraUrl = req.headers['x-jira-url'] || req.body.jiraUrl || process.env.JIRA_URL;
    const jiraEmail = req.headers['x-jira-email'] || req.body.jiraEmail || process.env.JIRA_EMAIL;
    const jiraToken = req.headers['x-jira-token'] || req.body.jiraToken || process.env.JIRA_TOKEN;
    const groqKey = req.headers['x-groq-key'] || req.body.groqKey || process.env.GROQ_KEY;
    const modelOverride = req.headers['x-groq-model'] || req.body.modelOverride || 'openai/gpt-oss-120b';

    // Validation step
    if (!jiraUrl || !jiraEmail || !jiraToken) {
      return res.status(400).json({ 
        error: 'Jira URL, email, and API token are required. Configure them in Settings or verify local .env file.' 
      });
    }
    if (!groqKey) {
      return res.status(400).json({ 
        error: 'Groq API Key is required. Configure it in Settings or verify local .env file.' 
      });
    }

    // Phase 2 Link / Phase 3 Architect pipeline execution
    console.log(`[SERVER] Processing test plan generation for Issue: ${jiraId}`);
    
    // Step 1: Fetch and normalize JIRA Issue Details
    const normalizedIssue = await fetchAndNormalizeIssue(jiraUrl, jiraEmail, jiraToken, jiraId);

    // Step 2: Trigger LLM completions
    const testPlanPayload = await generateTestPlan(normalizedIssue, groqKey, modelOverride);

    // Step 3: Return payload back to the client React application
    return res.status(200).json(testPlanPayload);

  } catch (err) {
    console.error('[SERVER ERROR]', err.message);
    
    // Capture specific JIRA/GROQ auth or network failures
    const statusCode = err.message.includes('401') || err.message.includes('auth') ? 401 : 500;
    return res.status(statusCode).json({ 
      error: err.message || 'An unexpected error occurred during test plan generation.' 
    });
  }
});

// Diagnostic API Connection Verification Endpoint
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
        const { runHandshake } = require('./src/services/jiraService');
        await runHandshake(jiraUrl, jiraEmail, jiraToken);
        jiraStatus = 'Connected';
      } catch (e) {
        jiraStatus = `Failed: ${e.message}`;
      }
    }

    if (groqKey) {
      try {
        const { runHandshake } = require('./src/services/groqService');
        await runHandshake(groqKey, modelOverride);
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


// Serve static assets from the React client's build folder
const clientBuildPath = path.resolve(__dirname, '../client/dist');
app.use(express.static(clientBuildPath));

// Catch-all route using negative-lookahead regex to serve client index.html for UI routes
app.get(/^(?!\/api).*/, (req, res) => {
  const indexPath = path.join(clientBuildPath, 'index.html');
  res.sendFile(indexPath);
});

// Start Express Server
app.listen(PORT, () => {
  console.log(`[SERVER] Ready. Listening on port ${PORT}...`);
});
