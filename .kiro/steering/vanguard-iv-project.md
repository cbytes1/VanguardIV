# Vanguard IV — TrustShield Project Context

## What This Project Is
This workspace contains deliverables for **Team Vanguard IV** competing in the **2026 SCTE-RMC High School Innovation Challenge**. The challenge theme is "Bridging the Trust Deficit: Designing Technologies That Restore Confidence in a Connected World."

The team's concept is **TrustShield** — an AI-powered scam, fraud, and digital-trust guardian for families, delivered through a broadband provider's existing infrastructure (Wi-Fi gateway + app + web dashboard).

## Key Files
- `vanguard-iv-presentation.html` — Self-contained 23-slide HTML presentation (all 10 deliverables)
- `trustshield-prototype/` — Next.js 15 + React 19 + TypeScript + Tailwind CSS web app prototype
- GitHub repo: https://github.com/cbytes1/VanguardIV/

## The Concept: TrustShield
Five core features:
1. **Real-Time Threat Detection** — AI monitors network patterns (NOT content) to flag phishing, scam calls, suspicious IoT behavior
2. **Deepfake & Content Authenticity Checker** — Users submit suspicious media to check if it's AI-generated
3. **Family Trust Dashboard** — Central hub with household threat summary, per-member protection status, weekly Trust Digest
4. **Smart Privacy Center** — Full transparency into what's monitored and what's NOT, toggle controls, data export/deletion
5. **Trust Score** — Household-level 0-100 score gamifying security posture

## Core Design Principle: "Foggy Glass"
TrustShield analyzes network *patterns and metadata* — never actual content. It sees the shape of a threat without reading messages, browsing history, or files. This is the answer to the challenge's central tension: a trust solution must *earn* trust by design.

## Prototype Tech Stack
- Next.js 15 (App Router) + React 19 + TypeScript (strict mode)
- Tailwind CSS for styling
- Lucide React icons
- Mock data only — no backend, no database, no authentication
- Color palette: Navy (#0F172A), Teal (#06B6D4), Emerald (#10B981), Amber (#F59E0B), Red (#EF4444)

## Prototype Structure
```
trustshield-prototype/
├── app/                        ← The 6 screens
│   ├── dashboard/              ← Trust Score gauge, stats, activity feed, quick actions
│   ├── threat-monitor/         ← Animated network map, live threat feed, filters
│   ├── deepfake-checker/       ← Content authenticity tool with 4 demo examples
│   ├── family-protection/      ← Per-member cards, controls, weekly digest
│   ├── privacy-center/         ← "Foggy glass" slider, data dashboard, toggles, audit log
│   ├── trust-score/            ← Score ring, 5-category breakdown, history chart
│   ├── page.tsx                ← Landing page
│   ├── layout.tsx              ← Shared layout
│   └── globals.css             ← Global styles
├── components/                 ← Reusable UI (Sidebar, Card, CircularGauge, etc.)
├── data/mock.ts                ← ALL mock data (Johnson Family, Denver CO, 12 devices)
├── lib/types.ts                ← TypeScript types
└── lib/utils.ts                ← Helper functions
```

## The Mock Household
- **The Johnson Family** of Denver, CO
- David (Dad, account owner), Sarah (Mom), Alex (teen, 16), Emma (child, 10)
- 12 connected devices (phones, laptops, smart TV, cameras, thermostat, etc.)
- Trust Score: 87/100 "Protected"
- ~1 month of simulated threat history

## Business Case Economics (from the challenge)
- 30M residential customers, 2.5M SMB customers
- $70/month avg residential broadband revenue ($840/year)
- 12% annual churn, $350 acquisition cost
- 75% use provider-managed Wi-Fi gateways
- TrustShield pricing: $7.99/month (moderate scenario)
- Target adoption: 10% (3M subscribers)
- Annual revenue: ~$288M
- Dev cost: $50M initial, $25M annual ops
- Break-even: ~Year 2

## Judging Criteria
1. Trust-Building Impact — 25%
2. Innovation & Differentiation — 20%
3. Business Viability — 20%
4. Technical & Operational Feasibility — 15%
5. Responsible Technology Design — 10%
6. Presentation & Use of AI — 10%

## Trust Guardrails (every proposal must address)
1. Data Minimization — collect only what's necessary
2. Meaningful Customer Control — users understand and control the technology
3. Explainability — plain-language explanations, not "AI determined this"
4. Security by Design — don't introduce new vulnerabilities
5. Human Accountability — know when automated decisions need human review

## The Trust Paradox (teams must be ready for this)
Scenario: A privacy advocacy org publishes a report questioning how much data TrustShield analyzes. Some customers worry the provider is "watching" them. Others defend the service.
Answer: The "foggy glass" model was designed from the start for this. Patterns not content. On-device processing. Full transparency in Privacy Center. Independent audits. This validates the design, it doesn't threaten it.

## Important Notes for AI Assistants
- The team members are **high school freshmen** — keep explanations simple and encouraging
- All data in the prototype is **mock/simulated** — this is a demo, not a real security product
- When making code changes, run `npm run build` to verify no errors before committing
- The presentation is a single self-contained HTML file — no external dependencies
- Preserve the "Team Vanguard IV" branding throughout
- Keep the dark navy/teal color scheme consistent
- The challenge document is at: `2026 SCTE-RMC High School Innovation Challenge.pdf`
