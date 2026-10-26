# Admin Operations Control Center Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the protected `/admin` interface as a responsive airport operations control center while preserving its current workflows.

**Architecture:** Keep flight/auth state and operational calculations in their existing providers and library modules. Replace the dashboard presentation with a reusable responsive admin shell and reorganize the existing overview, monitor, and event-log components inside it.

**Tech Stack:** React 19, TypeScript, Tailwind CSS, existing scoped operations CSS, lucide-react, Recharts.

**Spec:** `docs/superpowers/specs/2026-10-24-admin-operations-control-center-design.md`

## Global Constraints

- Keep the protected `/admin` route and existing auth/flight context interfaces.
- Preserve dark and light themes and the stored `mdc-ops-theme` preference.
- Keep operational times labeled as WITA where appropriate.
- Do not add dependencies, backend integrations, new metrics, or new domain rules.
- Preserve the existing flight validation, conflict, status transition, notification, and confirmation behaviors.
- Do not add or run tests unless requested; verify with the production build and lint commands.

## Review Focus

- No gate conflicts: show a clear healthy state without giving the conflict panel undue visual weight.
- Unresolvable gate conflict: retain the explanation and available flight review/delay path.
- Empty filtered flight list: keep search/filter context visible and show a useful empty state.
- Narrow viewport with dense flight data: preserve access to row details, filters, and actions without page-level horizontal overflow.
- Light and dark themes: maintain readable text, status labels, boundaries, focus rings, and action states in both.

---

### Task 1: Build the responsive admin shell and visual foundation

**Files:**
- Create: `src/components/admin/AdminNavigation.tsx`
- Modify: `src/components/admin/TopBar.tsx`
- Modify: `src/components/admin/ops-theme.css`

**Interfaces:**
- `AdminNavigation` consumes the active view (`overview | monitor | log`), view-change callback, and current conflict/unread counts; it renders semantic navigation with an active state and meaningful counts.
- `TopBar` continues to consume `email`, `unread`, `theme`, `onToggleTheme`, `onBell`, and `onSignOut`; retain the WITA clock, theme toggle, event-log shortcut, sign-out, and public-site link.

- [ ] Create `AdminNavigation` with desktop navigation and a compact mobile equivalent. Keep view selection controlled by the parent and provide `aria-current` or equivalent selected semantics.
- [ ] Rework `TopBar` as the admin shell header, retaining its existing time, theme, notification, sign-out, and public-site behaviors while improving hierarchy and responsive spacing.
- [ ] Replace the HUD-oriented visual tokens and component rules in `ops-theme.css` with the calm, high-contrast admin surfaces, typography, spacing, status, focus, and responsive shell styles specified in the design.
- [ ] Inspect at representative desktop and narrow widths and confirm navigation and header controls remain available without horizontal page overflow.

### Task 2: Rebuild the overview around shift status and urgent work

**Files:**
- Modify: `src/pages/AdminDashboard.tsx`
- Modify: `src/components/admin/VitalsStrip.tsx`
- Modify: `src/components/admin/ConflictCenter.tsx`
- Modify: `src/components/admin/ActionQueue.tsx`

**Interfaces:**
- `AdminDashboard` remains the owner of existing auth/flight state, theme, filters, dialogs, view state, conflict calculations, and actions.
- Existing operations components keep their current domain-facing props and callbacks unless a presentational prop is required to fit the shell.

- [ ] Replace the horizontal tab layout with the new admin shell and controlled overview/monitor/log navigation; retain the current single protected route and in-page view state.
- [ ] Reorganize overview content so shift vitals and actionable gate conflicts/delayed-flight queue lead; place gate status and traffic context next, with airline ranking and notices as supporting panels.
- [ ] Keep the wing filter available on overview and ensure it scopes vitals, gate conflicts, and related flight information as it does today.
- [ ] Restyle vitals, conflict, and priority-action panels to use clearer headings, readable status text, consistent spacing, and explicit empty/healthy states; keep the no-conflict state calm and the no-free-gate explanation and review/delay paths visible without changing domain calculations or action semantics.
- [ ] Confirm review actions still switch to the monitor with the selected flight query, and notice/log actions still select the log and mark notices read.

### Task 3: Fit the monitor and event log into the new admin experience

**Files:**
- Modify: `src/components/admin/FlightMonitor.tsx`
- Modify: `src/components/admin/EventLog.tsx`
- Modify: `src/components/admin/GateMatrix.tsx`
- Modify: `src/components/admin/Panel.tsx`
- Modify: `src/components/admin/FlightDialogs.tsx`

**Interfaces:**
- Preserve each component's current data and callback interfaces unless a presentational accessibility or layout prop is needed.
- Flight monitor remains responsible for search and arrival/departure filtering, table rendering, status editing, and gate/time validation feedback.

- [ ] Give each destination a clear page heading and selected navigation state while keeping the existing monitor search, filters, ordering, edit actions, validation, and conflict indicators intact.
- [ ] Make the flight table adapt to narrow widths without clipping priority details or actions; preserve a deliberate contained table-scroll region where a full card layout is not practical.
- [ ] Restyle event-log filtering and notices with readable severity labels, timestamps, and empty states; retain the existing filter behavior and read-state flow.
- [ ] Align gate matrix, shared panel, and dialogs with the new surface, spacing, focus, and responsive rules; preserve gate selection/review behavior and dialog validation/confirmation behavior.
- [ ] Check that flight creation, notice publishing, cancellation confirmation, and all existing navigation paths remain reachable at mobile widths.

### Task 4: Remove obsolete styling and verify the integrated dashboard

**Files:**
- Inspect references to: `src/pages/admin-dashboard.css`
- Modify or remove: `src/pages/admin-dashboard.css` only if no other consumer exists

- [ ] Confirm the legacy stylesheet has no consumers; remove it if unused, otherwise leave it untouched.
- [ ] Run `npm run build` and confirm TypeScript compilation and the production bundle complete successfully.
- [ ] Run `npm run lint` and resolve dashboard-related lint errors.
- [ ] Review the rendered overview, monitor, and event log in both themes and at desktop, tablet, and mobile widths against the spec's acceptance criteria.

---
