# AI Context File — TrustShield by Vanguard IV

> **What is this file?** This is a context file you can paste into any AI tool (Gemini, ChatGPT, Claude, Antigravity, Bolt, Copilot, etc.) so the AI understands your project without you having to explain everything from scratch. Copy the contents of this file and paste it at the start of your conversation with any AI assistant.

---

## Project Overview
I'm a member of **Team Vanguard IV**, a high school freshman team competing in the **2026 SCTE-RMC High School Innovation Challenge**. The challenge theme is "Bridging the Trust Deficit: Designing Technologies That Restore Confidence in a Connected World."

Our concept is **TrustShield** — an AI-powered scam, fraud, and digital-trust guardian for families, delivered through a broadband provider's existing infrastructure (Wi-Fi gateway + app + web dashboard).

Our GitHub repo: https://github.com/cbytes1/VanguardIV/

## What We've Built So Far
1. **A working web app prototype** — 6 interactive screens built with Next.js 15 + React 19 + TypeScript + Tailwind CSS
2. **A 23-slide HTML presentation** covering all 10 required deliverables

## The 5 Core Features of TrustShield
1. **Real-Time Threat Detection** — AI monitors network patterns (NOT content) to flag phishing, scam calls, suspicious IoT behavior
2. **Deepfake & Content Authenticity Checker** — Users submit suspicious videos/images/audio to check if they're AI-generated
3. **Family Trust Dashboard** — Central hub showing household threat summary, per-member protection, weekly Trust Digest
4. **Smart Privacy Center** — Full transparency into what's monitored vs. what's NOT, toggle controls, data export/deletion
5. **Trust Score** — A household-level 0-100 score that gamifies security posture

## Our Key Design Principle: "Foggy Glass"
TrustShield analyzes network *patterns and metadata* — never actual content. Think of looking through frosted glass — you can see shapes but can't read the text. The system can detect a phishing pattern without reading your emails.

## Tech Stack
- **Next.js 15** (App Router) + **React 19** + **TypeScript** (strict mode)
- **Tailwind CSS** for styling
- **Lucide React** for icons
- All data is mock/simulated — no backend, no database
- Color palette: Navy (#0F172A) primary, Teal (#06B6D4) accent, Emerald (#10B981) safe, Amber (#F59E0B) warning, Red (#EF4444) danger

## Project Structure
```
trustshield-prototype/
├── app/                        ← The 6 screens
│   ├── dashboard/              ← Trust Score gauge, stats, activity feed
│   ├── threat-monitor/         ← Animated network map, live threat feed
│   ├── deepfake-checker/       ← Content authenticity tool with demo examples
│   ├── family-protection/      ← Per-member cards, controls, digest
│   ├── privacy-center/         ← "Foggy glass" slider, data dashboard, toggles
│   ├── trust-score/            ← Score ring, category breakdown, history chart
│   ├── page.tsx                ← Landing page
│   ├── layout.tsx              ← Shared layout
│   └── globals.css             ← Global styles
├── components/                 ← Reusable UI (Sidebar, Card, CircularGauge, etc.)
├── data/mock.ts                ← ALL the mock data (change this to customize!)
├── lib/types.ts                ← TypeScript type definitions
└── lib/utils.ts                ← Helper functions
```

## The Mock Household
- **The Johnson Family** of Denver, CO
- David (Dad, account owner), Sarah (Mom), Alex (teen, 16), Emma (child, 10)
- 12 connected devices
- Trust Score: 87/100 "Protected"

## Business Case Numbers (from the challenge)
- 30M residential customers, 2.5M SMB customers
- $70/month avg broadband revenue, 12% annual churn, $350 acquisition cost
- TrustShield: $7.99/month, 10% adoption target (3M subs), ~$288M annual revenue
- $50M initial dev cost, $25M annual ops, break-even ~Year 2

## Judging Criteria
1. Trust-Building Impact — 25%
2. Innovation & Differentiation — 20%
3. Business Viability — 20%
4. Technical & Operational Feasibility — 15%
5. Responsible Technology Design — 10%
6. Presentation & Use of AI — 10%

## How to Run the Prototype
```bash
cd trustshield-prototype
npm install
npm run dev
# Open http://localhost:3000
```

## Instructions for the AI
- I'm a high school freshman — please keep explanations simple and clear
- When suggesting code changes, tell me which file to edit and show me the full updated code
- After changes, remind me to save and check if `npm run build` still works
- Keep the dark navy/teal/cyan color scheme consistent
- Keep "Team Vanguard IV" and "TrustShield" branding
- This is a demo prototype with mock data — don't add real backends or databases
- If I want to change data (family name, devices, threats), the file is `data/mock.ts`
