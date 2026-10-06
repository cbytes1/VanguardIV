# TrustShield Prototype — Implementation Plan

This plan upgrades the already-scaffolded Next.js 15 / React 19 / TypeScript /
Tailwind 3 app at `d:\Google Drive\Charter\SCTE\RMSCTE\trustshield-prototype`
into the full six-screen "TrustShield" demo described in the product spec.

## Context discovered during exploration

- Stack: Next.js 15.3.9 (App Router), React 19, TypeScript 5.7 (strict),
  Tailwind 3.4, lucide-react, no DB/auth. Path alias `@/*` -> project root.
- The scaffold already has: the design-system palette in `tailwind.config.ts`
  (`navy`/`navy-light`/`navy-lighter`, `teal`, `cyan`, `emerald`, `amber`,
  `threat`), a dark root layout, a landing page, a persistent `Sidebar` +
  `AppShell`, and reusable components (`Card`, `PageHeader`, `ProgressBar`,
  `ScoreGauge`, `SeverityBadge`, `StatCard`, `ThreatRow`). All six routes exist
  with working-but-generic content.
- The scaffold's domain is a *generic personal* safety app with the "Okafor"
  family and a data-broker focus. The spec requires the **Johnson Family**
  (Denver, CO), **12 devices**, a **month of threat history**, a **Trust Score
  of 87**, and specific per-screen content. Most work is replacing mock
  data/types and rebuilding screen bodies, reusing the existing primitives.
- `node_modules` is NOT installed yet. First step for any implementer:
  `npm install` inside the project directory.
- Verification for every item: `npm run build` (runs `next build`, which
  type-checks with strict TS and lints) must succeed with no errors. Where a
  screen is interactive, also `npm run dev` and visually confirm the behavior.
- Keep all timers (`setTimeout`/`setInterval`) inside `useEffect` with cleanup,
  and gate anything time/random-based so server and client first-render match
  (avoid hydration mismatches — see `formatDateTime` in `lib/utils.ts`, which
  already pins locale + UTC for this reason).

All paths below are absolute under the project root
`d:\Google Drive\Charter\SCTE\RMSCTE\trustshield-prototype\`.

---

- [ ] 1. Install dependencies and confirm the baseline builds.
      Run `npm install`, then `npm run build`, to establish a green starting point before changes.
      Files: (none — tooling only)
      Verify: `npm install` completes, then `npm run build` exits 0.

- [ ] 2. Rewrite shared domain types to match the spec's data model.
      Expand `lib/types.ts` with types for: `Device` (name, type, owner, status, lastSeen, firmwareOk), `ActivityEvent` (severity dot red/amber/green, title, domain/source, relativeTime, timestamp), `LiveThreat` (type phishing|malware|scam|suspicious, source, action blocked|warned|monitoring, aiExplanation, timestamp), `DeepfakeExample` (mediaType, label, verdict, confidence, indicators with issue markers, recommendation), family-member protection settings + per-member alerts/devices, privacy monitor/never-see items, privacy audit-log entries, data-dashboard figures, trust-score category breakdown (5 named categories), 6-month score history points, and improvement recommendations with point impact. Keep existing types that still fit (`Severity`, `ProgressBar` value shape).
      Files: `lib/types.ts`
      Verify: `npm run build` type-checks with no errors (types are consumed in step 3+).

- [ ] 3. Replace mock data with the "Johnson Family" household dataset.
      Rewrite `data/mock.ts` so all data is Johnson Family, Denver CO: 4 members (Dad/Account Owner, Mom, Alex teen 16, Emma child 10), 12 connected devices (phones, laptops, smart TV, 2 cameras, thermostat, smart speaker, tablet, etc.), ~1 month of threat history with fake-but-realistic domains (e.g. `fake-bank-login.com`, `secure-amaz0n-verify.com`), dashboard summary numbers (23 blocked this week, 156 scanned, 0 active risks, 4 protected), recent-activity events exactly matching the spec examples, deepfake examples (suspicious video 87% AI, authentic email, synthetic voice 92%, +1 more), privacy monitor vs never-see lists, data dashboard (2.3 MB anonymized, 30-day retention, 0 shared), audit-log entries, trust score 87 with the 5 category scores (Network 92, Phishing 85, Device 88, Privacy 90, Family 80), a 6-month upward history, and recommendations with point impact. Add clear comments. All exports typed against step 2.
      Files: `data/mock.ts`
      Verify: `npm run build` succeeds; `npm run dev` and spot-check the dashboard renders Johnson Family data.

- [ ] 4. Add animation + presentation helpers.
      Create a `useCountUp` hook (count-up on mount/in-view) and small helpers for pulse/progress animation, plus any shared Tailwind keyframes. Add keyframes (`pulse-slow`, `fade-in`, count transitions) to `tailwind.config.ts` `theme.extend.keyframes`/`animation`, and global helper classes if needed in `app/globals.css`. Build a reusable `AnimatedCounter` component and a `Gauge`/circular-ring component usable for both trust-score screens (extend or wrap existing `ScoreGauge`).
      Files: `lib/animation.ts` (or `hooks/useCountUp.ts`), `components/AnimatedCounter.tsx`, `components/CircularGauge.tsx`, `tailwind.config.ts`, `app/globals.css`
      Verify: `npm run build` succeeds; counters animate on screens that use them (checked in later steps).

- [ ] 5. Confirm sidebar branding and active highlighting meet spec.
      Update `components/Sidebar.tsx` header to show both "Vanguard IV" and "TrustShield" branding, keep active-page highlight (already implemented via `usePathname`), and ensure order matches the six screens. Add smooth page-transition styling (e.g. a fade-in wrapper in `AppShell`).
      Files: `components/Sidebar.tsx`, `components/AppShell.tsx`
      Verify: `npm run dev`; sidebar shows both brands, highlights the current route, transitions are smooth.

- [ ] 6. Build Screen 1 — Dashboard.
      Rebuild `app/dashboard/page.tsx` (keep it a server component; move interactivity to a client child if needed): large circular Trust gauge at 87/100 with "Protected" label + upward trend, four Threat-Summary cards (23 blocked this week / 156 scanned / 0 active risks / 4 protected) using animated counters, a scrollable color-coded Recent Activity feed matching the spec's example events, and three Quick-Action buttons (Run Security Scan, Check a Link, View Family Report). Reuse `Card`, `StatCard`, `CircularGauge`, `AnimatedCounter`.
      Files: `app/dashboard/page.tsx` (+ optional `app/dashboard/DashboardClient.tsx`)
      Verify: `npm run build` succeeds; `npm run dev` shows gauge, four cards count up, activity feed, three actions.

- [ ] 7. Build Screen 2 — Threat Monitor (live feed).
      Rebuild `app/threat-monitor/ThreatMonitorClient.tsx`: an animated home-network map (gateway center, 12 devices around it, pulsing scan traffic — mostly green, occasional red blocked) using SVG/CSS; a live threat feed that appends a new entry every few seconds via `setInterval` (in `useEffect`, cleaned up) from a pre-defined pool, each with timestamp/type/source/action/AI explanation; real-time counters (detected/blocked/warnings) that increment; and filter controls (threat type, severity, device). Keep `page.tsx` as the server wrapper.
      Files: `app/threat-monitor/ThreatMonitorClient.tsx` (page.tsx unchanged or minor)
      Verify: `npm run build` succeeds; `npm run dev` shows pulsing map, feed grows on an interval, counters move, filters work; no console hydration warnings.

- [ ] 8. Build Screen 3 — Deepfake Checker.
      Enhance `app/deepfake-checker/DeepfakeCheckerClient.tsx`: drag-and-drop styled upload zone + "Check Content" button, 3-4 pre-loaded examples (suspicious video 87% AI with inconsistent-lighting/audio-sync/facial-artifact markers; authentic email screenshot; synthetic voice 92% with voice-cloning markers; +1), an animated analysis progress bar while "checking" (`setTimeout`), a results panel with confidence meter + per-indicator breakdown + recommended actions, and a "How It Works" expandable section. Reuse `ProgressBar`, `Card`.
      Files: `app/deepfake-checker/DeepfakeCheckerClient.tsx`
      Verify: `npm run build` succeeds; `npm run dev` runs an example end-to-end with progress bar then detailed result; How-It-Works expands.

- [ ] 9. Build Screen 4 — Family Protection.
      Rebuild `app/family-protection/page.tsx` (+ client child for interactivity): four member cards (Dad/Account Owner, Mom, Alex teen 16, Emma child 10) with avatars/roles; clicking a member reveals their protection settings (toggles), member-specific recent alerts, and associated devices; a "Family Trust Digest" weekly-email preview (threats blocked per member, new risks, recommended actions, score changes); and an "Alert Preferences" section (per-member push/email/in-app + severity level).
      Files: `app/family-protection/page.tsx`, `app/family-protection/FamilyProtectionClient.tsx`
      Verify: `npm run build` succeeds; `npm run dev` shows 4 members, drill-in works, digest + alert prefs render.

- [ ] 10. Build Screen 5 — Privacy Center (foggy glass — most important).
      Rebuild `app/privacy-center/PrivacyCenterClient.tsx`: two-column "What We Analyze" vs "What We Never See" with icons; an interactive "Foggy Glass" slider visualization (frosted/blurred side labeled what TrustShield sees vs clear side it never sees — driven by a range input / CSS `blur()`); a Data Dashboard (2.3 MB anonymized traffic, auto-deleted after 30 days, 0 shared / on-device); controls (master toggle, per-feature toggles, "Download My Data", "Delete All My Data" with a confirmation dialog); and a timestamped Audit Log of data accesses (what + why). Reuse the existing `Toggle` pattern already in this file.
      Files: `app/privacy-center/PrivacyCenterClient.tsx` (page.tsx wrapper unchanged)
      Verify: `npm run build` succeeds; `npm run dev` — slider blurs/clears, toggles flip, delete shows a confirm dialog, audit log lists entries.

- [ ] 11. Build Screen 6 — Trust Score Details.
      Rebuild `app/trust-score/page.tsx` (+ client child for the animated ring/chart): large 87/100 animated ring with colored category segments; five category breakdown rows (Network Security 92, Phishing Protection 85, Device Health 88, Privacy Posture 90, Family Safety 80) each with its one-line explanation; a 6-month Score History line chart (SVG) trending up; Recommendations list each with a point-impact indicator; and the "safer than 78% of users in your area" comparison. Reuse `CircularGauge`/`ProgressBar`.
      Files: `app/trust-score/page.tsx`, `app/trust-score/TrustScoreClient.tsx`
      Verify: `npm run build` succeeds; `npm run dev` shows animated ring, 5 categories, history chart, recommendations, comparison.

- [ ] 12. Update landing page copy and README.
      Make `app/page.tsx` reflect the Johnson Family demo framing if needed, and rewrite `README.md`: project overview tied to the innovation-challenge judging criteria (innovation, feasibility, privacy, family value), how to run (`npm install && npm run dev`), the six-screen tour, project structure, and a note that all data is mock/simulated. Keep it approachable for a high-school team.
      Files: `app/page.tsx`, `README.md`
      Verify: `npm run build` succeeds; README accurately lists the routes/structure that now exist.

- [ ] 13. Final integration pass.
      Run the full build and click through all six screens plus landing to confirm navigation, animations, timers (with cleanup), and no console/hydration errors. Fix any seams between screens (shared data/types).
      Files: (any touched during fixes)
      Verify: `npm run build` exits 0; `npm run dev` — all six screens load from the sidebar with working interactions and no runtime errors.

## Assumptions

- The spec's "156 Devices Scanned" vs "12 connected devices" are intentionally
  different metrics (scans run many times across 12 devices); both are shown
  as given.
- Drag-and-drop on the deepfake checker is visual/demo only (no real file
  processing) — selecting a sample triggers the simulated analysis.
- The home-network map and charts are hand-rolled SVG/CSS to avoid adding chart
  dependencies, keeping `npm install` minimal and the code readable for the team.
