# Prism AI — Product Management Platform

AI-native product management tool with proprietary scoring algorithms.

## Features

- **Dashboard** — Anomaly Detection, Trend Analysis, Health Score, Correlation Engine, Forecasting
- **PRD Generator** — Readiness Score, Auto-Data Engine, Section Confidence, Impact Estimation, Cross-ref Validator
- **Roadmap Builder** — Dependency Resolution, Resource Balancing, Risk Assessment, Timeline Optimizer
- **Sprint Planner** — Composition Optimizer, Capacity Balancer, Velocity Forecaster, Risk Detector
- **Competitor Intelligence** — Web Search, Threat Scoring Engine, Feature Matrix, Market Positioning

## Quick Start (Local)

```bash
# 1. Install dependencies
npm install

# 2. Set up API key for AI features
cp .env.example .env
# Edit .env and add your Anthropic API key

# 3. Run (frontend + API proxy)
npm start
```

Opens at `http://localhost:5173`

## Deploy to Vercel

```bash
# 1. Push to GitHub
git init && git add . && git commit -m "Initial commit"
gh repo create prism-ai --public --push

# 2. Deploy
npx vercel

# 3. Set environment variable
npx vercel env add ANTHROPIC_API_KEY
```

Your app will be live at `prism-ai.vercel.app`

## Architecture

- **Frontend**: React + Vite + Recharts
- **API Proxy**: Express (local) / Vercel Serverless (production)
- **AI**: Claude API (narrative layer only — explains algorithm results)
- **Algorithms**: 20+ proprietary scoring engines (no AI dependency for core logic)

## API Key Note

AI features (AI Summary, AI Review, Explain Score) require an Anthropic API key.
The app works fully without it — all scoring, anomaly detection, and analytics
are powered by proprietary algorithms, not AI.
