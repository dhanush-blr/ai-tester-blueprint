const fs = require('fs');
const path = require('path');
const { loadEnv, fetchAndNormalizeIssue } = require('./jiraService');

const systemPrompt = `You are a Senior Full-Stack QA Automation Engineer.
Your task is to generate a comprehensive, formal, and structured QA Test Plan for the given JIRA issue.

Strict Anti-Hallucination Constraints:
1. Do not invent any feature details, specifications, API endpoints, parameter names, or database structures that are not explicitly provided in the JIRA issue context.
2. If the issue context is silent about any detail required to construct a scenario or test, you MUST write "TBD" or list the query in the "gapsAndQuestions" field.
3. Every test scenario must be traceable back to the issue summary, description, or labels.

Your output must be a valid JSON object matching the following structure:
{
  "jiraId": "string - the key of the issue",
  "generatedAt": "string - current ISO timestamp",
  "testPlan": {
    "summary": "string - QA feature overview",
    "scope": {
      "inScope": ["string - features to test"],
      "outOfScope": ["string - exclusions"]
    },
    "testScenarios": [
      {
        "id": "QA-TS-001",
        "title": "string - scenario title",
        "type": "string - Functional | Security | Integration | UI/UX",
        "preconditions": ["string"],
        "steps": ["string"],
        "expectedResult": "string",
        "automationFeasibility": "High | Medium | Low"
      }
    ],
    "edgeCases": [
      {
        "id": "QA-EC-001",
        "scenario": "string",
        "mitigation": "string"
      }
    ],
    "gapsAndQuestions": [
      "string - list of TBD requirements or missing technical specifications"
    ]
  }
}`;

function jsonToMarkdown(payload) {
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

async function generateTestPlan(issueData, groqKey, modelOverride = 'openai/gpt-oss-120b') {
  const endpoint = 'https://api.groq.com/openai/v1/chat/completions';
  
  const userPrompt = `Generate a QA Test Plan for the following JIRA issue:
${JSON.stringify(issueData, null, 2)}`;

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
    throw new Error(`Groq API failure (HTTP ${response.status}): ${errorText}`);
  }

  const result = await response.json();
  const rawContent = result.choices && result.choices[0] && result.choices[0].message && result.choices[0].message.content;
  
  if (!rawContent) {
    throw new Error('Groq returned empty chat completion choices.');
  }

  try {
    return JSON.parse(rawContent);
  } catch (err) {
    throw new Error(`Failed to parse LLM response content as JSON: ${rawContent}`);
  }
}

// CLI Execution Handler
if (require.main === module) {
  loadEnv();

  const jiraUrl = process.env.JIRA_URL;
  const email = process.env.JIRA_EMAIL;
  const token = process.env.JIRA_TOKEN;
  const groqKey = process.env.GROQ_KEY;

  if (!jiraUrl || !email || !token || !groqKey) {
    console.error('Error: JIRA_URL, JIRA_EMAIL, JIRA_TOKEN, and GROQ_KEY must be defined in your .env file.');
    process.exit(1);
  }

  const targetIssue = process.argv[2];
  if (!targetIssue) {
    console.error('Error: Please provide a target Jira Issue ID (e.g. node backend/src/services/testPlanService.js VWO-48)');
    process.exit(1);
  }

  (async () => {
    try {
      const issueData = await fetchAndNormalizeIssue(jiraUrl, email, token, targetIssue);
      console.log('\nGenerating Test Plan from Groq...');
      const testPlanPayload = await generateTestPlan(issueData, groqKey);
      
      console.log('\n--- Generated JSON Payload ---');
      console.log(JSON.stringify(testPlanPayload, null, 2));

      const markdownOutput = jsonToMarkdown(testPlanPayload);
      console.log('\n--- Generated Markdown Test Plan ---');
      console.log(markdownOutput);

      // Create output directory and save file locally (local CLI check helper)
      const outputDir = path.resolve(__dirname, '../../../output');
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }
      const outputPath = path.join(outputDir, `test-plan-${targetIssue}.md`);
      fs.writeFileSync(outputPath, markdownOutput, 'utf8');
      console.log(`\nSuccessfully saved test plan to: ${outputPath}`);

    } catch (err) {
      console.error('\n[TEST PLAN GENERATION ERROR]', err.stack || err.message);
      process.exit(1);
    }
  })();
}

module.exports = {
  generateTestPlan,
  jsonToMarkdown
};
