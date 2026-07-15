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

async function runHandshake(apiKey, model = 'openai/gpt-oss-120b') {
  const endpoint = 'https://api.groq.com/openai/v1/chat/completions';
  
  console.log(`[GROQ HANDSHAKE] Checking connectivity with model: ${model}...`);
  
  const payload = {
    model: model,
    messages: [
      {
        role: 'user',
        content: 'Respond with the single word "READY" to verify API connection.'
      }
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
    const errorText = await response.text();
    throw new Error(`Groq connection failed (HTTP ${response.status}): ${errorText}`);
  }

  const result = await response.json();
  const content = result.choices && result.choices[0] && result.choices[0].message && result.choices[0].message.content;
  
  if (!content) {
    throw new Error('Groq returned an empty choice selection payload.');
  }

  console.log(`[GROQ HANDSHAKE] Success! API Response: ${content.trim()}`);
  return result;
}

// CLI Execution Handler
if (require.main === module) {
  loadEnv();

  const apiKey = process.env.GROQ_KEY;
  if (!apiKey) {
    console.error('Error: GROQ_KEY must be defined in your .env file.');
    process.exit(1);
  }

  (async () => {
    try {
      await runHandshake(apiKey);
    } catch (err) {
      console.error('\n[GROQ CLIENT ERROR]', err.message);
      process.exit(1);
    }
  })();
}

module.exports = {
  loadEnv,
  runHandshake
};
