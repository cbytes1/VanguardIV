# Vanguard IV — TrustShield

**2026 SCTE-RMC High School Innovation Challenge**
*Bridging the Trust Deficit: Designing Technologies That Restore Confidence in a Connected World*

---

## What's in this repo

| Folder / File | Description |
|---|---|
| `trustshield-prototype/` | Working Next.js web app prototype (6 interactive screens) |
| `presentation.html` | Self-contained HTML slide deck (23 slides, open in any browser) |

---

## The Concept

**TrustShield** is an AI-powered scam, fraud, and digital-trust guardian for families, delivered through a broadband provider's existing infrastructure (Wi-Fi gateway + app + web dashboard).

Instead of asking consumers to cobble together an antivirus, a password manager, a breach monitor, and parental controls, TrustShield unifies threat detection, deepfake checking, family protection, and privacy controls into one experience — summarized as a single **Trust Score**.

### Core Design Principle: "Foggy Glass"
TrustShield analyzes network *patterns and metadata* — never actual content. It can see the shape of a threat without reading your messages, browsing history, or files. This is the answer to the central tension of the challenge: a trust solution that *earns* trust by design.

---

## Running the Prototype

### Prerequisites
- [Node.js](https://nodejs.org) v20 or v22 LTS

### Steps
```bash
cd trustshield-prototype
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### The Six Screens
1. **Dashboard** (`/dashboard`) — Trust Score gauge, threat summary stats, recent activity feed, quick actions
2. **Threat Monitor** (`/threat-monitor`) — Animated network map, live threat feed, real-time counters, filters
3. **Deepfake Checker** (`/deepfake-checker`) — Content authenticity tool with 4 demo examples and animated analysis
4. **Family Protection** (`/family-protection`) — Per-member cards (Dad, Mom, Alex 16, Emma 10), controls, weekly trust digest
5. **Privacy Center** (`/privacy-center`) — Interactive "foggy glass" slider, data dashboard, toggle controls, audit log
6. **Trust Score** (`/trust-score`) — Animated score ring, 5-category breakdown, 6-month history chart, recommendations

All data is mock/simulated — this is a demo prototype, not a production security product.

---

## Viewing the Presentation

Open `presentation.html` in Chrome, Edge, or Firefox. Navigate with:
- **Arrow keys** (left/right)
- **Click** the left/right sides of the screen

23 slides covering all 10 required deliverables:
1. Problem Definition
2. Solution Concept & Customer Journey
3. Prototype / Demo
4. Trust Architecture (data flow)
5. Business Case ($288M revenue opportunity, Year 2 break-even)
6. Competitive & Ecosystem Analysis
7. Risk & Ethics Assessment
8. Implementation Roadmap (3 phases, 3 years)
9. Trust Scorecard (7 KPIs)
10. AI Utilization

---

## For the Vanguard IV Team

This repo is your **starting point**, not your final product. Make it yours:

- **Customize the prototype** — Change the family name, tweak colors, add your own ideas. The code is commented so you can follow along.
- **Edit the presentation** — It's a single HTML file. Change text directly, adjust the design, add your own slides.
- **Practice the demo** — Pick one team member to drive the prototype during the presentation. Know the click path cold. Practice 5+ times.
- **Own the Trust Paradox answer** — When judges ask "how did the broadband provider know what I was doing?" your answer is the foggy glass model. You designed for this from day one.
- **Don't apologize for what it doesn't do** — It's a prototype. Show what it demonstrates, not what's missing.

### Judging Criteria Alignment
| Criterion | Weight | Where We Address It |
|---|---|---|
| Trust-Building Impact | 25% | Privacy Center foggy glass model, explainable alerts, customer control |
| Innovation & Differentiation | 20% | Digital trust layer (not another antivirus), broadband provider advantage |
| Business Viability | 20% | Full case economics: 3M subs × $7.99/mo = ~$288M, Year 2 break-even |
| Technical & Operational Feasibility | 15% | Uses existing gateway hardware, phased 3-year rollout |
| Responsible Technology Design | 10% | 5 trust guardrails, data minimization, audit log, delete controls |
| Presentation & Use of AI | 10% | Transparent AI utilization section, 1+ minute of presentation time |

---

## Tech Stack
- **Next.js 15** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS** for styling
- **Lucide React** for icons
- Mock data only — no backend, no database, no authentication

---

*Built with ❤️ by Team Vanguard IV for the 2026 SCTE-RMC High School Innovation Challenge*
