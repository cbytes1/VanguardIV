# TrustShield Prototype

A clickable demo prototype for the **2026 High School Innovation Challenge**,
built by **Team Vanguard IV**.

## Overview

**TrustShield** is a concept for an AI-powered scam, fraud, and digital-trust
guardian for families, delivered as an app through your broadband provider.
Instead of asking people to juggle a password manager, an antivirus, a
breach-monitoring service, and a parental-controls app, TrustShield rolls
phishing defense, scam blocking, deepfake detection, breach monitoring, family
protection, and privacy controls into one place and sums it all up as a single
**Trust Score**.

This repo is a front-end prototype wired to **mock data**. It walks through one
fictional household — the **Johnson family** of Denver, CO (David, Sarah, teen
Alex, and 10-year-old Emma) — so judges can see the whole experience as a story.
It's meant as a starting point the Vanguard IV team can extend. The code is
commented throughout so you can read it, understand it, and change it.

Built with [Next.js](https://nextjs.org) 15 (App Router), React 19,
TypeScript (strict mode), and Tailwind CSS.

## How to run

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.
Start on the landing page and click **Start the tour**, or use the sidebar to
jump between screens.

### Scripts

- `npm run dev` — start the development server
- `npm run build` — create a production build (also type-checks and lints)
- `npm run start` — run the production build
- `npm run lint` — run ESLint

## The six-screen tour

The landing page (`/`) links into all six screens. Each one shows a different
part of how TrustShield protects the Johnson household:

1. **Dashboard** (`/dashboard`) — the household's safety at a glance: the Trust
   Score gauge, count-up stat cards (threats blocked, devices scanned, active
   risks, people protected), a recent-activity feed, and quick actions.
2. **Threat Monitor** (`/threat-monitor`) — a live-updating feed of phishing,
   scam, and breach events with an animated home-network map, running counters,
   and severity filters, so you can watch threats get caught in real time.
3. **Deepfake Checker** (`/deepfake-checker`) — an interactive demo scan: pick a
   sample video, image, or audio clip and watch TrustShield analyze it and
   return an authenticity verdict with a confidence score and reasoning.
4. **Family Protection** (`/family-protection`) — per-member cards for David,
   Sarah, Alex, and Emma that drill into each person's protections, plus a
   weekly trust digest and alert preferences.
5. **Privacy Center** (`/privacy-center`) — privacy and data-sharing controls
   built around the **"foggy glass"** model (see below), the project's
   signature idea.
6. **Trust Score** (`/trust-score`) — the single score broken into category
   segments (network, phishing, device health, privacy, family) with an
   animated ring, a score-history chart, and tailored recommendations.

## Project structure

```
app/                            App Router routes + layout
  page.tsx                      Landing page (hero + six-screen grid)
  layout.tsx                    Root layout (dark navy theme)
  globals.css                   Global styles and animation helpers
  dashboard/                    Screen 1 — page.tsx + DashboardClient.tsx
  threat-monitor/               Screen 2 — page.tsx + ThreatMonitorClient.tsx
  deepfake-checker/             Screen 3 — page.tsx + DeepfakeCheckerClient.tsx
  family-protection/            Screen 4 — page.tsx + FamilyProtectionClient.tsx
  privacy-center/               Screen 5 — page.tsx + PrivacyCenterClient.tsx
  trust-score/                  Screen 6 — page.tsx + TrustScoreClient.tsx
components/                     Reusable UI primitives
  AppShell.tsx, Sidebar.tsx     Layout + persistent navigation
  Card.tsx, PageHeader.tsx,     Building blocks used across screens
  StatCard.tsx, ThreatRow.tsx,
  ProgressBar.tsx, ScoreGauge.tsx, CircularGauge.tsx,
  SeverityBadge.tsx, AnimatedCounter.tsx, PageTransition.tsx
data/mock.ts                    All mock datasets (the Johnson Family household)
lib/types.ts                    Shared domain types
lib/utils.ts                    Presentation helpers (cn, formatDateTime, severityStyle, scoreTone)
```

Each screen uses a **server/client split**: the route's `page.tsx` is a server
component that owns the page `metadata` and wraps content in `<AppShell>`, while
anything interactive (filters, toggles, the deepfake scan, the foggy-glass
slider) lives in a sibling `*Client.tsx` marked `"use client"`.

### Design system

The Tailwind theme (`tailwind.config.ts`) exposes the TrustShield palette as
named color tokens:

| Token     | Usage                       |
| --------- | --------------------------- |
| `navy`    | Primary background          |
| `teal`    | Accent (teal/cyan)          |
| `emerald` | Safe / protected            |
| `amber`   | Warning                     |
| `threat`  | Threat / danger             |

Reuse these tokens and the existing component primitives rather than adding new
colors or libraries. Use the `cn()` helper in `lib/utils.ts` for conditional
classes.

## A note on the data

**All data in this prototype is mock and simulated.** Everything lives in
`data/mock.ts` — the Johnson family, their devices, threats, deepfake scans,
privacy items, and scores are invented for the demo and do not refer to real
people, companies, or events. There is **no backend, database, authentication,
or real AI/network call** anywhere in the app. "Live" feeds and the deepfake
"scan" are simulated with timers and pre-determined results so the demo behaves
the same every time.

## How this maps to the judging criteria

- **Innovation.** TrustShield reframes digital safety as a single, family-wide
  **Trust Score** delivered through the broadband provider that already sits in
  the home. The standout idea is the Privacy Center **"foggy glass"** model: a
  slider that visually fogs or clears a scene to show, at a glance, how much of
  your life data brokers and trackers can see. It turns an abstract,
  hard-to-grasp privacy setting into something you can literally watch get
  clearer — that's the piece that matters most and sets this project apart.
- **Feasibility.** The whole experience is built on today's web stack
  (Next.js, React, Tailwind) with no exotic dependencies, and the AI/analysis
  features map to services that already exist (breach monitoring, phishing
  detection, deepfake classifiers). A broadband provider is a realistic
  distribution channel because it already reaches the household network.
- **Privacy.** Privacy is a first-class screen, not an afterthought. The foggy
  glass makes data exposure understandable, and the controls emphasize data
  minimization and user choice over who sees what.
- **Family value.** Protection is modeled around a real household with
  guardians, a teen, and a child — different people with different needs — and
  rolls up into one score and one weekly digest a parent can actually act on.

## Extending the prototype

The code is organized and commented so the Vanguard IV team can modify it:
change the household in `data/mock.ts`, add a screen by creating a new folder
under `app/`, or restyle using the palette tokens in `tailwind.config.ts`. Run
`npm run build` after changes to catch TypeScript or lint errors before a demo.
