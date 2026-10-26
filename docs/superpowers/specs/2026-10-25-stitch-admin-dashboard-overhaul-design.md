# Admin Dashboard Visual Overhaul Design

## Intent

Refresh the existing Sam Ratulangi Airport admin dashboard to match the supplied Stitch AeroOps references: a crisp, light, navy-and-slate control-room UI with compact telemetry, clear status colors, a persistent left navigation rail, and dense operational panels. The goal is to make the current admin workflows feel like one cohesive professional airport operations system.

## Current state

The protected `/admin` route has three in-page views (Overview, Flight monitor, Event log), a horizontal header and tabs, and existing components for flight statistics, gate status, conflicts, queues, charts, notices, and dialogs. Flight/auth state and domain actions already work through existing providers. The ZIP contains visual references for four work areas, but this app only has data and behavior for flight operations, gate status, conflicts, and event history.

## Goals

- Apply the reference visual language across the existing dashboard shell and views: navy navigation, light slate canvas, white bordered cards, compact labels and telemetry, and semantic blue/green/amber/red states.
- Use Inter-like UI typography and monospaced flight identifiers and operational values.
- Make the current Overview, Flight monitor, and Event log easy to find through a responsive navigation rail.
- Preserve all current dashboard data, controls, dialogs, validation, theme preference, and WITA clock.
- Keep the design legible and usable at desktop and narrow widths.

## Non-goals

- Adding new safety-compliance or apron-logistics modules that lack corresponding application data and behavior.
- Changing flight workflows, operational calculations, authentication, or the public airport site.
- Adding dependencies or backend integrations.

## Approaches

1. **Apply the reference system to the existing experience (assumed from the request).** Rework the shell, visual tokens, and existing admin panels to reflect the Stitch system, keeping the three existing destinations and behaviors. This directly fulfills an appearance overhaul without fabricating module behavior.
2. **Add all four reference workspaces as separate admin modules.** This would follow the ZIP navigation more literally, but safety and apron sections would need new data and functionality beyond the requested appearance change.
3. **Only change colors and component surfaces in the current layout.** This is lower effort but would retain the existing horizontal tab layout and visual hierarchy, so it would not resemble the reference as closely.

Approach 1 is recommended and used as the working assumption because the request is to overhaul the dashboard's appearance and the current app has a complete single operations workflow. If the user wants the broader set of modules, that requires a separate scope decision.

## Constraints and builder decisions

- Use the existing React, TypeScript, Tailwind, Lucide, and scoped admin styles; do not add dependencies.
- Match the light reference theme as the primary presentation while preserving the existing saved dark theme as a compatible option.
- Keep airport-specific identity, live WITA time, signed-in context, navigation, notifications, and sign-out.
- The exact component composition, responsive breakpoints, and CSS token mapping are implementation decisions. Reuse existing domain components where their behavior fits; reshape presentation without changing domain logic.

## Acceptance criteria

- `/admin` has a persistent AeroOps-style shell and a clear active state for each existing destination.
- Existing flight, gate, notice, conflict, event-log, and dialog workflows remain reachable and behave as before.
- The interface uses the reference's light neutral surfaces, navy structure, compact labels, operational status colors, and restrained borders.
- Narrow layouts retain access to navigation, key actions, and flight information without page-level horizontal overflow.
- Both supported themes remain readable and theme selection continues to persist.
