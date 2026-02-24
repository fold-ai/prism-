// server.js — Claude API proxy for local development
// In production (Vercel), use api/claude.js serverless function instead
import express from 'express';
import { readFileSync } from 'fs';

const app = express();
app.use(express.json({ limit: '10mb' }));

// Load API key from .env
let ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
try {
  const env = readFileSync('.env', 'utf-8');
  const match = env.match(/ANTHROPIC_API_KEY=(.+)/);
  if (match) ANTHROPIC_API_KEY = match[1].trim();
} catch (e) {}

app.post('/api/claude', async (req, res) => {
  if (!ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: 'ANTHROPIC_API_KEY not set in .env' });
  }
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(req.body),
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Claude proxy running on http://localhost:${PORT}`));
