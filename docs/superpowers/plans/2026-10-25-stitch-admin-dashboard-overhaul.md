# Stitch Admin Dashboard Visual Overhaul Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Restyle the existing protected `/admin` experience to match the supplied AeroOps reference while preserving all existing destinations and behavior.

**Architecture:** Keep auth, flight state, operational calculations, and action callbacks in their current providers and libraries. Add a responsive admin navigation rail and update the existing shared shell, CSS tokens, and dashboard components in place to adopt the approved reference system.

**Tech Stack:** React 19, TypeScript, Tailwind CSS, scoped admin CSS, lucide-react, Vite.

**Spec:** `docs/superpowers/specs/2026-10-25-stitch-admin-dashboard-overhaul-design.md`

## Global Constraints

- Use the existing React, TypeScript, Tailwind, Lucide, and scoped admin styles; do not add dependencies.
- Match the light reference theme as the primary presentation while preserving the existing saved dark theme as a compatible option.
- Keep airport-specific identity, live WITA time, signed-in context, navigation, notifications, and sign-out.
- Reuse existing domain components where their behavior fits; reshape presentation without changing domain logic.
- Do not add tests; perform build/lint and visual viewport verification.

## Review Focus

- Desktop layout: ensure shell uses available width and overview stays readable with useful hierarchy.
- Narrow viewport: ensure navigation, actions, filters, and flight details remain reachable without page-level horizontal overflow.
- Light and dark themes: ensure text, status labels, focus states, selected navigation, tables, dialogs, and notices remain readable.
- Empty and alert states: ensure no-conflict, no-flight-match, and unread-notice states stay understandable and visually balanced.
- Existing workflows: ensure flight review, status editing, gate reassignment, notices, log read-state, dialogs, and sign-out stay reachable.

---

### Task 1: Add the AeroOps shell and responsive navigation

**Files:**
- Create: `src/components/admin/AdminNavigation.tsx`
- Modify: `src/pages/AdminDashboard.tsx`
- Modify: `src/components/admin/TopBar.tsx`
- Modify: `src/components/admin/ops-theme.css`

**Interfaces:**
- `AdminNavigation` receives the active view (`overview | monitor | log`), a view-change callback, conflict count, and unread count. It renders only those three existing destinations with a semantic active state and useful counts.
- `TopBar` retains `email`, `unread`, `theme`, `onToggleTheme`, `onBell`, and `onSignOut` props, as well as the WITA clock and public-site link.
- `AdminDashboard` remains the owner of existing views, state, filters, dialogs, and flight callbacks.

- [x] Create the controlled navigation rail for the three existing views; show a compact mobile navigation treatment and current/attention states.
- [x] Rework the top bar into the reference's clean airport identity and status header; preserve WITA clock, notifications, theme toggle, sign-out, and public-site navigation.
- [x] Replace the HUD visual tokens in `ops-theme.css` with reference-aligned light surfaces, navy structure, Inter/monospace typography, restrained borders, semantic status colors, focus rings, and responsive shell rules. Keep dark theme tokens readable.
- [x] Integrate the shell around the current dashboard without changing view behavior or route protection.

### Task 2: Restyle and arrange the overview for operational scanning

**Files:**
- Modify: `src/pages/AdminDashboard.tsx`
- Modify as needed: `src/components/admin/VitalsStrip.tsx`, `ConflictCenter.tsx`, `ActionQueue.tsx`, `RadarMap.tsx`, `TrafficChart.tsx`, `AirlineRanking.tsx`, `GateMatrix.tsx`, `StatusMix.tsx`, `NoticeList.tsx`, `Panel.tsx`

**Interfaces:**
- Existing dashboard panel props and domain callbacks remain unchanged unless a presentational-only prop is needed.
- Overview continues to use the same wing-scoped flights, vitals, conflicts, notices, and callbacks.

- [x] Arrange the overview inside the new shell with a concise page heading, wing filter, shift summary, and clear hierarchy for active conflicts and flight actions.
- [x] Restyle vitals, shared panels, gate matrix, charts, airline ranking, status mix, notices, and empty states to use the approved typography, card surfaces, spacing, and semantic states.
- [x] Preserve the gate review path, conflict resolution behavior, priority actions, notice-to-log behavior, and existing metric calculations.
- [x] Check the overview at wide desktop, tablet, and narrow mobile widths in light and dark themes.

### Task 3: Apply the visual system to flight monitor, event log, and dialogs

**Files:**
- Modify: `src/components/admin/FlightMonitor.tsx`
- Modify as needed: `src/components/admin/EventLog.tsx`, `src/components/admin/FlightDialogs.tsx`, `src/components/admin/ConflictCenter.tsx`, `src/components/admin/ops-theme.css`

**Interfaces:**
- Flight monitor retains search, kind filtering, sorting, status editing, gate/time validation, conflict indicators, and next-action callbacks.
- Event log and dialogs retain current filter, read-state, validation, and publish/create/cancel confirmation behavior.

- [x] Restyle monitor filters, table, validation feedback, and row actions; keep the table in a contained horizontal-scroll region where narrow widths require it.
- [x] Restyle event log severity and timestamps, plus dialog surfaces and form controls, without changing their behaviors.
- [x] Check empty results, edited values, notices, and dialogs at narrow widths in both themes.

### Task 4: Remove obsolete presentation leftovers and verify

**Files:**
- Inspect references to: `src/pages/admin-dashboard.css`
- Modify or remove: `src/pages/admin-dashboard.css` only if no consumer remains

- [x] Confirm whether the legacy stylesheet has consumers; remove it only if unreferenced.
- [x] Run `npm run build`; expected result is successful TypeScript compilation and Vite production bundle.
- [x] Run `npm run lint`; expected result is no dashboard-related lint errors.
- [x] Review the final `/admin` experience at desktop and narrow widths in both themes, confirming navigation, dialogs, action paths, and tables remain usable.
