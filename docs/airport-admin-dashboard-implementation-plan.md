# Airport Operations Admin Dashboard — Implementation Plan

> **Status:** Draft v0.3 — D1/D2 confirmed; local pilot code implemented; operational validation and deployment decisions remain open
> **Purpose:** Adapt the generic admin-dashboard plan to the existing airport website and its current operations prototype.
> **Important:** This is a planning document. Proposed backend, database, authentication, and live-data work requires separate requirements and implementation approval.

> **Implementation note:** D1/D2 were confirmed by the requester for an internal pilot with manual entry and audited operator actions. Local pilot API, SQLite storage, session auth, and dashboard workflows are implemented. This does not complete Phase 1's operational-owner requirement: an airport owner has not been named, and D3/D7/D9/D10 plus hosting, backup, and recovery decisions remain open. Do not use with real operational data or deploy until the relevant owner approves those items.

## 1. Project Context and Current Baseline

This repository contains a public Sam Ratulangi International Airport website and a React admin experience for airport operations. The `/admin` experience has three destinations:

1. **Overview** — shift vitals, gate conflicts, priority actions, movement chart, airline ranking, gate matrix, status mix, and live notices.
2. **Flight monitor** — search and filter flights, edit gate/time/status, and advance flight status.
3. **Event log** — review and filter operational notices.

The admin visual system uses React 19, TypeScript, Vite, Tailwind CSS, scoped CSS, React Router, Lucide icons, and Recharts. Forms and validation use React Hook Form and Zod where applicable.

Before the pilot implementation, operational data was a frontend simulation in `FlightsProvider`, edits and notices were held in React state, and login used a demo `sessionStorage` session. The public passenger site continues to use its separate sample feed. The admin pilot now has a separate Node API, SQLite persistence, provisioned operator sessions, and audited manual entries; it starts with an empty flight database and does not consume or publish the public sample feed.

The admin visual overhaul retains only the three destinations above. The Airspace radar was removed. The UI shows time in WITA (Asia/Makassar) and supports a persisted light/dark theme preference.

## 2. Goal

Evolve the prototype into a secure and reliable airport-operations dashboard using the project's existing frontend stack, while keeping operational data authoritative, auditable, and understandable to the people who use it.

The system of record for flight data, source-of-truth rules, user roles, and operational permissions must be agreed before connecting real data or enabling production actions. The current simulation must not be represented as a live airport feed.

## 3. Scope and Guardrails

### In scope for this roadmap

- The existing Overview, Flight monitor, and Event log workflows.
- Airport-specific flight, gate, status, notice, and operational-activity data.
- Backend-enforced authentication and permissions if the dashboard is connected to production data.
- Server-side validation, durable persistence, and auditability for authorized changes.
- Airport-specific KPIs and reporting after definitions and data sources are agreed.

### Out of scope unless separately specified

- Safety-compliance and apron-logistics modules.
- Generic product, order, article, or application-management modules.
- External airline, ATC, airport, identity-provider, or alerting integrations before their owners and contracts are confirmed.
- A new analytics vendor, database, backend framework, or visualization dependency without a measured reason.
- Presenting simulated data as live, authoritative operational data.

## 4. Feature Priorities

### P0 — Data authority, security, and operational integrity

- Identify the authoritative flight-data source and whether operations staff may create or edit records.
- Replace demo-only sign-in with an approved identity/session system before production use.
- Define roles and permissions; enforce authorization on the server for every admin read and write.
- Persist flight records and operational notices through an approved backend, if production persistence is required.
- Preserve current workflows: add a flight, update estimated time/status, reassign a gate, delay/cancel, advance an allowed status, publish a notice, and read the event log.
- Validate flight number, route, direction, wing, gate, times, duplicate active records, and allowed status transitions on the server.
- Define conflict handling and concurrent-edit behavior; avoid silently overwriting a newer update.
- Record important admin actions with actor, timestamp, target, action, and a redacted change summary.
- Keep demo mode visibly distinct from live/connected mode.

### P1 — Operational overview and reporting

- Serve the existing overview metrics and panels from the agreed source of truth.
- Add consistent filters for wing, status, flight direction, and time period where useful.
- Define metric names, denominators, cancellation handling, and time-zone rules before exposing production comparisons.
- Add recent operational activity and notices with clear loading, empty, stale-data, and error states.
- Add exports only for reports with an identified audience, permission model, and retention policy.
- Show data freshness and source status only when there is a trustworthy signal for them.

### P2 — Scale and advanced operations

- Measure query and feed performance before introducing caching, queues, or aggregate tables.
- Add scheduled reports, historical trend comparisons, or anomaly detection only after stakeholders identify a need and data quality is sufficient.
- Add additional airport modules only with separate data definitions, permissions, workflows, and acceptance criteria.

## 5. Sidebar and UI Structure

Keep the current navigation until additional airport workflows are specified:

1. **Overview** — shift summary and operational exceptions.
2. **Flight monitor** — searchable and filterable flight board with permitted actions.
3. **Event log** — operational notices and updates.

Do not add generic Users, Reports, Roles & Permissions, Settings, or System Health destinations solely because they appear in the generic draft. Introduce a destination only when its data, users, and behavior are defined.

### Existing UI surfaces to retain and connect to real data

- Airport identity, signed-in user context, WITA clock, theme preference, and sign-out.
- Wing selector for Domestic, International, or all wings.
- Shift summary: completion, delay rate, boarding, gate utilization, and active-flight counts.
- Gate-conflict review and reassignment path.
- Priority flight queue and authorized quick actions.
- Hourly movements, airline ranking, gate status, status mix, and live notices.
- Flight search, direction filter, editable operational fields, validation feedback, and contained table scrolling.
- Event-log type filters, severity, timestamps, and read state.
- Loading, empty, stale-data, permission-denied, and recoverable error states when backed by an API.

The existing light/dark theme, responsive layout, and compact operational typography should remain consistent as data states are added.

## 6. Airport-Specific API Proposal

These routes are proposals, not existing endpoints. Final routes, auth mechanism, response shape, and pagination style depend on the selected backend and source-of-truth model.

| Proposed endpoint | Responsibility |
| --- | --- |
| `GET /api/admin/session` | Return the authenticated admin identity and effective permissions. |
| `GET /api/admin/overview?wing=` | Return scoped shift metrics, conflicts, and data freshness. |
| `GET /api/admin/flights` | Search/filter/sort/paginate by wing, direction, status, route, or flight number. |
| `POST /api/admin/flights` | Create an operations-entered flight only if manual creation is approved. |
| `PATCH /api/admin/flights/{id}` | Apply validated editable fields with version/concurrency checks. |
| `POST /api/admin/flights/{id}/actions` | Apply an allowed operation such as advance, delay, cancel, or reassign gate. |
| `GET /api/admin/events` | Return filterable operational notices/events and read-state metadata. |
| `POST /api/admin/notices` | Publish an authorized operational notice. |
| `POST /api/admin/events/{id}/read` | Update the authenticated user's read state, if per-user read state is required. |
| `GET /api/admin/audit-log` | Return restricted audit records to roles explicitly allowed to inspect them. |

### API requirements

- Authenticate and authorize every admin endpoint on the server; a hidden or disabled UI control is not an access check.
- Validate inputs and allowed state transitions server-side and return stable, non-sensitive error codes/messages.
- Apply pagination limits and stable sorting to list endpoints.
- Define idempotency and concurrency behavior for actions that may be retried or submitted by multiple operators.
- Define how upstream flight feeds interact with operator edits, including conflict precedence and freshness reporting.
- Store instants in a consistent canonical form (prefer UTC timestamps) and render operational schedules in the agreed airport time zone, currently WITA / `Asia/Makassar`.
- Log actor and change metadata without logging credentials, tokens, or unnecessary personal data.

## 7. Data Model Proposal

Choose a database only after confirming hosting, operational ownership, backup, and recovery requirements. PostgreSQL or MySQL may be suitable; neither is currently selected by the repository.

### Candidate entities

- **Flight:** stable ID, flight number, airline/carrier, route or city, arrival/departure direction, wing, gate, WITA operating date, scheduled time, estimated time, status, source, freshness/sync metadata, version, and timestamps.
- **Operational event/notice:** ID, type, severity, message, related flight (optional), source/actor, created time, and visibility/read-state rules.
- **Audit record:** actor, action, target type/ID, timestamp, safe before/after summary, and request/correlation ID where appropriate.
- **User/role/permission:** include only what is not already provided by the selected identity system; do not duplicate credentials or identity-provider data without a requirement.
- **Airline, airport, gate reference data:** normalize into reference tables only if those values need managed updates or referential constraints; current values are static frontend data.

Do not create generic analytics-event, daily-metrics, settings, or notification tables in advance. Add them only when a defined feature needs durable storage and the operational owner approves retention and access rules.

## 8. Metric Definitions to Confirm

The current prototype computes these figures in the frontend. Before production use, airport operations stakeholders must confirm that the same definitions are operationally meaningful:

- **Tracked flights:** all in-scope flights except cancelled flights.
- **Completed:** departures in `DEPARTED` and arrivals in `LANDED`.
- **Completion rate:** completed flights divided by tracked flights; define behavior when the denominator is zero.
- **Delay rate:** flights in `DELAYED` divided by tracked flights; agree whether delay means any delay or a threshold such as minutes late.
- **Now boarding:** flights in `BOARDING` or `FINAL CALL`; define whether the denominator is active flights.
- **Gate utilization:** occupied gates divided by configured gates for the selected wing; define whether occupancy includes arrivals, turnaround windows, and conflicts.
- **Gate conflict:** the current prototype detects overlapping active assignments within a time window and gates outside their wing's allowed range. The approved time window, turnaround rules, exceptions, and enforcement source are Decision D7 in Section 12; record the final rule there.
- **Hourly movements:** arrival/departure buckets currently use estimated times; confirm date boundaries and how overnight schedules are grouped.

Document cancellation, duplicate-flight, correction, late-feed, and time-zone handling alongside the agreed metric definitions.

## 9. Phased Implementation

### Phase 1 — Project and operations audit

- Resolve **D1 (intended deployment)** and **D2 (authoritative flight source and operator write boundary)** first. These are the go/no-go decisions for backend, authentication, persistence, and API work.
- If D1 selects visual prototype/training only, keep demo data explicit and defer Phases 2–6; continue only prototype-quality and UI-state work that fits that decision.
- If D1 selects a pilot or production path, name the operational owner and confirm which parts of D3–D10 must be decided before each phase begins. Discovery of roles, metrics, time rules, backend options, retention, and read-state behavior can proceed in parallel.
- Confirm backend hosting, database, identity provider, network constraints, and integration owners before Phase 2, without treating a proposed technology as selected.
- Validate flight status transitions, gate inventory, wing mapping, conflict rules, metric definitions, WITA behavior, and event retention with the responsible owner before enabling the corresponding production behavior.

**Complete when:** D1 and D2 have explicit outcomes, an operational owner is named, and all remaining decisions have an owner, target phase, and recorded status. If they remain unanswered, the default is the clearly labeled prototype path; no live-data or production-write assumptions are made.

### Phase 2 — Security and backend foundation

- Select the backend and identity/session approach compatible with project hosting.
- Implement server-side authentication, authorization, validation, audit hooks, and consistent error responses.
- Define migrations and data ownership; do not create speculative generic modules.
- Verify permitted and denied requests for each role.

**Complete when:** protected endpoints reject unauthenticated and unauthorized actions regardless of frontend state.

**Start gate:** do not begin backend/security implementation until D1 authorizes a pilot or production path and D2 establishes the data source and write boundary. If D1 remains prototype-only, defer this phase.

### Phase 3 — Flight operations data and actions

- Implement the approved flight data adapter and persistence model.
- Connect flight monitor search, filters, pagination, and detail updates.
- Implement authorized gate/time/status changes, status advancement, delay, cancellation, and flight creation only where approved.
- Enforce gate range, duplicate, transition, and concurrency rules server-side.
- Decide how externally sourced flight updates interact with manual changes.

**Complete when:** an authorized workflow updates the authoritative record, invalid actions are rejected, and the result is auditable.

### Phase 4 — Overview and event log

- Serve overview metrics and conflicts from authoritative data using the agreed definitions.
- Connect notices/events and read state to their approved source.
- Add loading, empty, stale, offline, permission-denied, and recoverable-error states.
- Verify displayed counts against source queries and show data freshness accurately.

**Complete when:** all displayed production metrics can be traced to defined source queries and current feed state.

### Phase 5 — Analytics and reporting

- Add date-range and wing filters where operations staff need them.
- Implement historical aggregates only after query performance is measured.
- Test midnight/WITA date boundaries, empty periods, late-arriving corrections, and status changes.
- Add exports only after access, redaction, and retention are defined.

**Complete when:** report results match known source data and filters do not imply unsupported precision.

### Phase 6 — Notifications, audit, and service visibility

- Define which operational events generate notices and their severity.
- Separate operator-facing event history from restricted audit records when required.
- Add safe service/feed health indicators based on monitored signals.
- Define retention, access, and redaction policies.

**Complete when:** authorized staff can trace changes and the UI never presents missing/stale data as current.

### Phase 7 — Quality, rollout, and recovery

- Test desktop, tablet, and mobile layouts, keyboard use, and basic accessibility.
- Test authorization, validation, concurrency, status transitions, gate constraints, and error states.
- Measure response size and query latency under expected operating load.
- Document deployment, monitoring, backup, restore, and rollback procedures.
- Roll out first in a non-production environment using clearly labeled test data.

**Complete when:** operational owners accept tested workflows, recovery is rehearsed, and the production cutover is explicitly approved.

## 10. Testing Strategy

- **Unit:** flight validation, allowed status transitions, gate validation/conflicts, and KPI definitions.
- **Integration:** API authorization, persistence, transactions, feed reconciliation, filtering, pagination, and audit records.
- **Concurrency:** simultaneous updates, stale versions, repeated/retried actions, and conflict resolution.
- **Time:** WITA rendering, UTC storage, midnight boundaries, date-range inclusivity, and late-arriving schedule corrections.
- **UI:** loading/empty/stale/error states, responsive layout, table scrolling, keyboard navigation, and permission-based actions.
- **Security:** session handling, server-side authorization, input validation, CSRF/XSS/injection protections appropriate to the selected framework, and log redaction.
- **Operational acceptance:** compare sample dashboard figures and gate conflicts with an operations-approved reference for a known shift.

## 11. Risks and Mitigations

1. **Unclear source of truth:** conflicting schedule edits can mislead operators. Decide ownership and reconciliation before integrations.
2. **Prototype mistaken for live operations:** label demo/simulated data and show feed freshness only when measured.
3. **Unsafe or unauthorized changes:** enforce roles, state transitions, and validations in the backend; audit approved edits.
4. **Incorrect operational metrics:** approve definitions and denominators with operations staff before production reporting.
5. **Concurrent operator/feed updates:** use versions or equivalent conflict detection and make failed updates visible.
6. **Over-expansion:** retain the three existing destinations and add modules only when a real workflow and data owner are defined.
7. **Sensitive data in logs or health panels:** minimize, redact, and restrict access; never expose secrets or stack traces.

## 12. Decisions Still Required

Resolve decisions in priority order. **D1 and D2 are the two project-shaping gates**; the other decisions can be investigated in parallel, then closed before the phase that depends on them. Recommendations below come from the attached decision brief and remain proposals until an airport stakeholder confirms them.

| ID / priority | Decision | Current proposal or default if unanswered | Blocks | Status / owner / date |
| --- | --- | --- | --- | --- |
| **D1 — Gate 0** | Intended use: visual prototype/training, internal pilot, or production operations? | **Confirmed: internal pilot, designed to grow toward production.** | Whether Phases 2–6 start; security, operations, and rollout scope. | Confirmed by requester / airport approver not named / 2026-10-25 |
| **D2 — Gate 0** | What is the authoritative flight source, and which flight fields/actions may operators create or change? Decide manual entry, external read-only feed, or hybrid; explicitly answer create, delay, cancel, reassign gate, and read-only fields. | **Confirmed: manual operations entry. Pilot operators may create flights and change fields, including delay, cancel, status, time, and gate; all changes must be audited. No external feed is currently selected.** | Flight data model, API actions, persistence, audit, and concurrency behavior. | Confirmed by requester using brief recommendation / airport approver not named / 2026-10-25 |
| **D3 — P1** | Who is the named operational owner for flight rules, gate conflicts, and metric approval? | Required for any pilot or production path. | Operational acceptance and confirmation of D7–D9. | Open / — / — |
| **D4 — P1** | Which backend, database, hosting/network environment, and identity provider are approved? | Pilot code choice: Node built-in HTTP server and `node:sqlite` on the existing Node 24 runtime, avoiding new packages for a single-instance pilot. Pilot accounts are provisioned out of band and stored as scrypt hashes. Deployment host, persistent volume/backup, HTTPS termination, and any future external identity provider remain unconfirmed. | Phase 2 implementation and any deployment. | Local code choice / deployment open / — |
| **D5 — P1** | Which operator/admin roles exist, and which reads and actions may each role perform? | Initial pilot implementation provisions one `operator` role with D2's full audited actions. No user-management UI or role editor; additional roles require owner approval. | Server authorization and UI action availability. | Initial pilot baseline / owner validation required / — |
| **D6 — P1** | Is Event log read state shared across an operations desk/shift, or tracked separately per user? | Proposed pilot default: one shared unread/read state per operations desk or shift, matching shift handover and avoiding per-user-per-event rows. Per-user read receipts can be considered as a P2 refinement. | Event-log schema, unread counts, and read-state API. | Proposed pilot default / owner validation required / — |
| **D7 — P1** | What are the allowed flight status transitions and gate-conflict rules, including overlap window, turnaround, and exceptions? | Current frontend rules are prototype behavior only; confirm with the operational owner before write actions are enabled. | Server validation and flight-action acceptance. | Open / — / — |
| **D8 — P1** | How are scheduled/estimated times entered and stored, and how are WITA-local dates and overnight schedules interpreted? | Local manual-entry pilot stores a WITA operating date (`YYYY-MM-DD`) with scheduled/estimated `HH:mm` values and filters the board by that date. This is a code-level choice for manual entry, pending operations-owner validation; any future feed must define offset/UTC conversion explicitly. | Schedule persistence, API filtering, and date-boundary tests. | Pilot code choice / owner validation required / — |
| **D9 — P1** | Which operational KPIs and historical periods are needed, and what are their approved definitions? | Section 8 lists current prototype definitions for review; they are not production-approved. | Production overview metrics and Phase 5 reporting. | Open / — / — |
| **D10 — P2** | What event/audit retention, notification delivery, exports, uptime, backup, and recovery requirements apply? | Decide only for the selected deployment level and actual workflows. | Phase 5 exports and Phase 6/7 operational readiness. | Open / — / — |

### Decision record rule

This table is the single canonical decision record for this plan. When a decision is confirmed, replace `Open` with the outcome and record the approving owner and date in the same row; link an ADR or approved policy there if more detail is needed. Other sections describe requirements and reference the decision ID, but must not maintain a conflicting second copy of the confirmed rule. In particular, Section 8's gate-conflict item is explanatory; D7 holds the approved rule.

## 13. Definition of Done

- Requirements and source ownership are approved by the operational data owner.
- Production data is not simulated or hard-coded, and freshness is represented honestly.
- Every protected read/write is authorized on the server and every action is validated server-side.
- Flight actions, concurrency behavior, gate rules, and status transitions match approved workflows.
- Dashboard metrics match documented definitions and verified source data.
- Events and sensitive audit records have approved access, redaction, and retention rules.
- Relevant automated and operational acceptance checks pass.
- Loading, empty, stale, permission-denied, and error states are understandable.
- Deployment, rollback, backup, and recovery procedures are documented and exercised.
- Production rollout is separately approved by the responsible airport stakeholders.
