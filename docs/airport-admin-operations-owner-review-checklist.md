# Airport Admin Pilot — Operations Owner Review Checklist

> **Status:** Checklist setup complete; operational review and owner sign-off pending. Checklist answers and glossary candidates are proposals until the named operational owner records approval.
>
> **Pilot context:** Internal pilot, manual flight entry, synthetic data. D1 and D2 are confirmed. The dashboard is not an authoritative live feed or a replacement for approved airport procedures.

## Review record

- Airport / operating unit: ______________________________
- Operational owner (D3): ______________________________
- Review participants and roles: ______________________________
- Review date / shift simulated: ______________________________
- Checklist version: 0.1
- Decision record updated in: [implementation plan](airport-admin-dashboard-implementation-plan.md)

## How to use this checklist

Review the dashboard with representative operators using synthetic flights. For each item, mark **Approved**, **Revise**, or **Not applicable**; record the decision, owner, and evidence. Do not treat a proposed rule or glossary term as approved until it is recorded in the implementation plan's decision register.

## 1. Pilot boundaries and operating assumptions

- [ ] Confirm the pilot uses synthetic data only and starts with an empty flight database.
- [ ] Confirm flight records are entered manually; no external flight feed is selected or implied.
- [ ] Confirm the pilot is for workflow evaluation and does not replace airport, airline, ATC, or ground-handling systems or procedures.
- [ ] Identify the approved pilot environment, its users, and the person responsible for access provisioning.
- [ ] Define the current approved operating process to follow if the pilot is unavailable, displays conflicting information, or an operator is unsure what to do.
- [ ] Agree how operators will report errors and who can pause the pilot.
- [ ] Confirm which features and data must remain out of scope.

**Boundary decisions / evidence:**

| Item | Decision or evidence | Owner | Date |
| --- | --- | --- | --- |
| Pilot location and users |  |  |  |
| Fallback operating process |  |  |  |
| Pause / escalation contact |  |  |  |

## 2. Flight entry and edits

- [ ] Confirm required fields for a new flight: flight number, airline, route/city, operating date, arrival/departure, wing, gate, scheduled time, estimated time, and initial status.
- [ ] Confirm who may create a flight and whether a second-person check is needed for any field.
- [ ] Confirm which fields an operator may edit after creation and which changes require a reason.
- [ ] Confirm the expected workflow for delay, cancellation, status advancement, time correction, and gate reassignment.
- [ ] Agree how to handle duplicate flight numbers, corrected records, cancellations, and a flight entered under the wrong date or direction.
- [ ] Review stale-version/concurrent-edit feedback: operators should refresh and review the latest record before retrying a change.
- [ ] Confirm the audit record is sufficient: operator identity, timestamp, action, and before/after values.
- [ ] Confirm the operator can distinguish entered data from verified or externally sourced data; no source should be implied when none exists.

**Field/action permissions:**

| Field or action | Allowed for pilot operator? | Required checks / reason | Owner decision |
| --- | --- | --- | --- |
| Create flight |  |  |  |
| Edit route / airline / direction |  |  |  |
| Edit scheduled / estimated time |  |  |  |
| Change status / delay |  |  |  |
| Cancel flight |  |  |  |
| Reassign gate |  |  |  |

## 3. Gate and status rules — D7

### Gate rules

- [ ] Verify the gate inventory and each gate's Domestic / International wing mapping.
- [ ] Define when a gate counts as occupied, including arrival use, turnaround, boarding, and departure.
- [ ] Approve the time-overlap window used to flag a conflict: __________ minutes.
- [ ] Define turnaround buffers, exceptions, and who may approve an exception.
- [ ] Confirm whether out-of-wing gate assignments are prohibited or require an override and reason.
- [ ] Walk through a double-booking, an invalid-wing assignment, a gate change, and a conflict with no free gate.
- [ ] Confirm the conflict panel gives enough context and a safe operator path to review or resolve each case.

### Status transitions

- [ ] Confirm the allowed status sequence separately for arrivals and departures.
- [ ] Confirm who may skip or correct a status and what audit note is required.
- [ ] Confirm behavior for delayed, cancelled, departed, landed, and already-completed flights.
- [ ] Confirm that a rejected transition explains the problem and leaves the flight unchanged.

| Flight type | Current status | Allowed next status(es) | Exception / authority | Approved? |
| --- | --- | --- | --- | --- |
| Departure |  |  |  |  |
| Departure |  |  |  |  |
| Arrival |  |  |  |  |
| Arrival |  |  |  |  |

**Approved gate/status rule reference (D7):** ______________________________

## 4. WITA and overnight timing — D8

- [ ] Confirm WITA (`Asia/Makassar`) is the operating timezone shown throughout the dashboard.
- [ ] Confirm operators use a 24-hour clock and agree the date format shown in Indonesian.
- [ ] Confirm an operating date is entered alongside scheduled and estimated local times.
- [ ] Walk through a flight scheduled before midnight with an estimate after midnight; decide which operating date it belongs to and how it appears in filters and hourly charts.
- [ ] Confirm how date corrections, delays across midnight, and flights arriving after midnight are handled.
- [ ] If an external feed is considered later, record its timestamp timezone and conversion rule separately before integration.

**Approved date/time and overnight rule (D8):** ______________________________

## 5. KPI and chart definitions — D9

For every displayed metric, confirm its inclusion rules, denominator, date boundary, and empty-data behavior. Current formulas are pilot/prototype definitions, not approved operational measures.

| Metric | Definition to confirm | Owner-approved definition / notes | Approved? |
| --- | --- | --- | --- |
| Tracked flights | Which statuses and flight types are included? |  |  |
| Completion rate | Completed departures/arrivals ÷ tracked flights; define zero denominator. |  |  |
| Delay rate | Delayed flights ÷ tracked flights; define whether any delay or a minutes threshold counts. |  |  |
| Now boarding | Which statuses count? Is the denominator active flights? |  |  |
| Gate utilization | Occupied gates ÷ configured gates; define occupancy and wing scope. |  |  |
| Gate conflict count | Which overlap, turnaround, and wing rules count? Link to D7. |  |  |
| Hourly movements | Confirm use of estimated time, date boundary, and overnight grouping. |  |  |

- [ ] Confirm whether cancelled flights are excluded from each denominator and how corrections are represented.
- [ ] Compare each metric with a hand-calculated synthetic-shift example.
- [ ] Confirm the dashboard labels these figures as pilot metrics until approved.

**Approved KPI definition reference (D9):** ______________________________

## 6. Event log and shift handover — D6

- [ ] Confirm whether read/unread state is shared by the desk/shift or tracked per operator. Current proposal: shared state per operations desk/shift; per-user receipts are a possible later refinement.
- [ ] Confirm which events operators need to see, how severity is assigned, and whether any event requires acknowledgement rather than a simple read state.
- [ ] Confirm that operator-authored notice text remains unchanged when the UI language changes.
- [ ] Confirm system-generated flight events are understandable in both languages and retain the flight/time details needed at handover.
- [ ] Define what unresolved conflicts, pending edits, and important notices must be reviewed at shift change.
- [ ] Agree the process for correcting an event or recording a follow-up; do not silently rewrite the audit history.

**Read-state decision (D6):** ______________________________

## 7. Indonesian operator glossary and language behavior

The Indonesian entries below are **candidates for operator review**, not approved terminology. Agree on one preferred term per concept, including whether a familiar aviation term stays in English. Preserve flight numbers, airline names, gate identifiers, and IATA/ICAO codes as data.

| English UI term | Indonesian candidate | Keep English? | Operator-approved wording / usage note |
| --- | --- | --- | --- |
| Overview | Ringkasan operasional |  |  |
| Flight monitor | Pemantauan penerbangan |  |  |
| Event log | Log aktivitas |  |  |
| Gate | Gate / Pintu keberangkatan |  | Clarify whether “gate” also covers arrival-use gates. |
| Check-in | Check-in |  |  |
| Boarding | Boarding / Naik pesawat |  |  |
| Final call | Panggilan terakhir |  |  |
| Scheduled | Terjadwal |  |  |
| Delayed | Terlambat |  |  |
| Departed | Berangkat |  |  |
| Landed | Mendarat |  |  |
| Cancelled | Dibatalkan |  |  |
| Gate conflict | Konflik gate / Konflik penggunaan gate |  |  |
| Domestic / International | Domestik / Internasional |  |  |
| WITA | WITA |  | Keep the timezone abbreviation; explain it in help text if needed. |

- [ ] Confirm terminology with operators from the intended shift/team, not only a general-language reviewer.
- [ ] Review longer Indonesian labels in the navigation, filters, tables, and dialogs at narrow widths.
- [ ] Confirm generated system notices switch language while operator-authored messages remain as entered.
- [ ] Confirm the selected language survives reload and does not change the passenger site's language preference.
- [ ] Confirm the page and admin content expose the correct language to assistive technology; review screen-reader pronunciation of codes, times, and mixed English/Indonesian text.

**Glossary approver / date:** ______________________________

## 8. Accessibility and operator usability

- [ ] Complete keyboard-only navigation through the language toggle, views, filters, flight actions, and dialogs.
- [ ] Confirm active navigation, statuses, conflicts, and severity are communicated by text or shape as well as color.
- [ ] Review text contrast and control visibility in both light and dark themes, including low-light shift conditions.
- [ ] Confirm focus is visible, dialogs announce their title and errors, and closing a dialog returns focus appropriately.
- [ ] Review narrow-screen behavior: no page-level horizontal overflow; the flight table remains intentionally scrollable.
- [ ] Confirm time/date, airport codes, flight numbers, and status labels are read clearly by the screen reader.
- [ ] Record issues and their owner before pilot acceptance.

## 9. Review outcome and sign-off

| Role | Name | Decision (approve / revise / defer) | Date | Notes / conditions |
| --- | --- | --- | --- | --- |
| Operational owner (D3) |  |  |  |  |
| Flight operations representative |  |  |  |  |
| Gate / terminal representative |  |  |  |  |
| Pilot administrator / technical owner |  |  |  |  |

- [ ] D6–D9 outcomes and approver/date are recorded in the implementation plan's decision register.
- [ ] Open findings have an owner and due date.
- [ ] Any required changes have been implemented and reviewed against this checklist.
- [ ] Pilot boundaries, fallback procedure, and pause/escalation contact are confirmed.
- [ ] The operational owner has explicitly approved the next pilot step.

**Overall outcome:** ☐ Approved for the defined synthetic-data pilot  ☐ Revise and review again  ☐ Deferred

**Conditions / follow-up actions:**

| Action | Owner | Due date | Status |
| --- | --- | --- | --- |
|  |  |  |  |

**Operational owner signature / approval reference:** ______________________________
