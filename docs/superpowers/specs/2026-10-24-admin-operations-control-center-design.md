# Admin Operations Control Center Design

## Intent

Redesign the Sam Ratulangi Airport `/admin` experience into a clear, shift-ready operations control center. Admin staff should be able to understand airport activity quickly, find exceptions, and take the existing operational actions without navigating a visually crowded screen.

## Current state

The app has one protected `/admin` route. `src/pages/AdminDashboard.tsx` currently renders overview, flight monitor, and event log views. Reusable components cover vitals, conflict detection and resolution, priority actions, radar, traffic, gate status, airline ranking, notices, and dialogs. Flight, notice, and authentication behavior is provided through existing React contexts. The route imports `src/components/admin/ops-theme.css`; `src/pages/admin-dashboard.css` is a separate legacy stylesheet and is not used by this route.

The current interface uses a dense, technical visual language, a horizontal top bar and tabs, and a multi-column overview. This redesign may replace the shell, information hierarchy, layout, and styling from scratch, while retaining existing behavior and domain logic wherever suitable.

## Goals

- Make urgent flight and gate exceptions the first things staff can find.
- Give staff a readable shift summary and clear paths to overview, flights, and activity.
- Keep core actions available: add flight, publish notice, advance/delay/cancel flights, reassign gates, review conflicts, and mark notices read.
- Preserve the live WITA clock, airport identity, signed-in admin context, sign-out, theme preference, and current session-backed demo behavior.
- Make the interface responsive and usable at desktop, tablet, and mobile widths.
- Improve visual hierarchy, legibility, and accessible focus/selection states while keeping a recognizable airport operations character.

## Non-goals

- Adding real-time backend feeds, persistence, APIs, or new roles and permissions.
- Changing flight validation, conflict rules, gate assignment rules, status transitions, notification semantics, or demo data.
- Adding separate route-level workspaces for unrelated admin departments; the current project has one operations admin route.
- Redesigning the public airport site or login flow.

## Anti-goals

- Do not make the dashboard look like a consumer booking site.
- Do not bury conflicts, delays, or critical actions under decorative charts.
- Do not communicate operational state using color alone.
- Do not make destructive actions one-click without the current confirmation behavior.
- Do not imply a connected live feed when the application is still running on demo/session data.

## Constraints

- Continue using the existing React, TypeScript, Tailwind, lucide-react, Recharts, and current local UI patterns; do not add dependencies without a demonstrated need.
- Keep the `/admin` route protected and preserve the existing flight/auth context interfaces.
- Preserve dark and light theme support and the saved `mdc-ops-theme` preference.
- Continue to label all displayed operational times as WITA where appropriate.
- Use existing operational data and behavior; no invented metrics or integrations.

## Approaches

1. **Operations control center (selected).** Replace the current tabbed dashboard shell with a clear admin navigation rail/header and an overview organized around shift status, attention items, and high-value operations panels. Keep flight monitoring and event history reachable as focused views. This fully refreshes the interface while matching the single operations workflow that exists today.
2. **Separate admin workspaces.** Add distinct pages for flights, gates, alerts, and activity under a new sidebar. This would support future department-specific workflows, but the project currently has only one admin domain and the added navigation would create empty or overlapping workspaces.
3. **Visual restyle in place.** Keep the existing top bar, tabs, and dashboard grid, but change the tokens and component styling. This is less disruptive, but does not address the crowded hierarchy or make the page feel like a rebuilt admin tool.

The user selected the operations control center direction and authorized replacing the current layout from scratch if needed.

## Design direction

Use an operations-first admin shell with persistent, compact navigation, a focused page heading, and a clear shift summary. Lead the overview with attention status and actionable conflicts or delayed flights. Arrange the remaining modules in a deliberate hierarchy: priority flight actions and flight monitor first, followed by gate occupancy and traffic context, with airline ranking and notices/activity as supporting information. Keep charts subordinate to work queues and make their labels and empty states clear.

The overview, flight monitor, and event log remain the initial focused destinations unless implementation finds a strong reason to add a dedicated gate view using existing gate data. Navigation should show active destination and meaningful attention counts without excessive badges. On narrow screens, navigation and dense tables must adapt without clipping essential actions or making the dashboard unusable.

The default visual treatment is a calm, high-contrast operations interface: restrained surfaces, strong type hierarchy, consistent spacing, and semantic status colors with text labels. Keep both themes. Retain airport-specific identity and useful operational density, but remove ornamental effects that compete with flight and alert information. The exact component composition, breakpoints, and token values are implementation calls within these constraints.

## Behavior to preserve

- Overview metrics and wing filter update from the current flight state.
- Conflicts are computed from the selected wing and can be reviewed or resolved through existing gate reassignment behavior.
- Priority flight actions preserve current advance, delay, cancellation confirmation, and notice publication behavior.
- Flight monitor keeps search, arrival/departure filtering, sorting, status editing, gate/time validation, and conflict indicators.
- Event log displays notices and marking the log read updates its unread state.
- Add-flight and broadcast-notice dialogs retain existing validation and session-backed behavior.
- Theme changes update and persist through the current theme hook.
- Sign-out returns the user to `/login`; public-site navigation remains available.

## Builder decisions

- Reuse existing components when their behavior and structure fit the new hierarchy; reshape or replace presentational components where they constrain the design.
- Prefer semantic HTML and existing utility/component conventions; add focused CSS tokens only when it materially improves maintainability.
- Keep domain calculations in the existing library/state modules; avoid moving business rules into presentational components.
- Update or remove the unused legacy `admin-dashboard.css` only if repository inspection confirms no other consumer.
- Do not add tests unless requested; perform build/lint verification after implementation.

## Acceptance criteria

- The `/admin` route reads immediately as an airport operations admin tool and gives attention items clear priority.
- Staff can reach all preserved operations actions from the redesigned views and their current behavior remains intact.
- Overview, flight monitor, and event log are navigable with clear current-page indication.
- Desktop layout uses available space well; tablet and mobile layouts retain access to navigation, filters, key actions, and flight information.
- Light and dark themes remain readable and the selected theme persists.
- No new dependency or backend requirement is introduced.
