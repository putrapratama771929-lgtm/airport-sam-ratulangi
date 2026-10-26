# Admin Dashboard Indonesian i18n Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a persistent admin-only English/Indonesian language toggle and translate the complete `/admin` dashboard without changing the passenger site preference.

**Architecture:** Extend the existing typed `en` / `id` dictionaries with an admin namespace. Add a route-scoped locale provider using the separate `mdc-admin-lang` key, then consume its hook throughout the shell and three views. Keep domain values, API values, records, and public-site language state unchanged.

**Tech Stack:** React 19, TypeScript, existing context hooks, existing English/Indonesian dictionary files, localStorage, Tailwind/scoped admin styles.

**Spec:** `docs/superpowers/specs/2026-10-25-admin-dashboard-i18n-design.md`

## Global Constraints

- Keep the admin preference independent from the passenger site's `mdc-lang` preference.
- Default to English if no supported admin language is stored.
- Do not add dependencies or change API/domain codes, workflows, or public-site copy.
- Translate operator-facing copy in Overview, Flight monitor, Event log, dialogs, accessible labels, and recoverable error states.
- Keep flight statuses/actions/API values stable; localize only their displayed labels.
- Do not translate operator-authored notice messages or flight/customer data; localize generated system-event messages from stable codes and parameters.

## Review Focus

- Missing, malformed, or unavailable `localStorage`: provider defaults to English without crashing; implement through provider's safe storage reads/writes.
- Passenger preference isolation: changing admin locale leaves `mdc-lang` unchanged; implement in the locale provider and include a manual acceptance step.
- Domain status/action stability: localized labels never replace values sent to APIs; retain typed status/action maps in presentation components.
- Dynamic API error codes: known codes resolve to localized copy and unknown failures use a localized generic message; implement in the admin API context.
- Long Indonesian labels on small screens: preserve existing wrapping/overflow behavior; inspect the changed toggle, filter, table, and dialog layouts at a narrow viewport.

---

### Task 1: Add the admin translation contract and copy

**Files:**
- Modify: `src/i18n/types.ts`
- Modify: `src/i18n/en.ts`
- Modify: `src/i18n/id.ts`

**Interfaces:**
- Produce `Translations.admin` with nested copy for shell, navigation, dashboard, vitals, flight actions/statuses, conflicts, gates, chart, airline ranking, notices, event log, flight dialogs, filters, and API error messages.
- Provide all required keys in both `en` and `id`; keep status/action keys aligned with the existing domain unions.

- [x] Add `Translations.admin` and nested interfaces, defining stable keys for every admin label and message.
- [x] Add English admin strings matching current UI copy and Indonesian translations for the same keys; preserve dynamic placeholders as typed functions where counts/flight identifiers are inserted.
- [x] Review the two dictionaries side-by-side for matching key/value shapes; use the compiler check in the final verification task.

### Task 2: Add isolated admin locale state

**Files:**
- Create: `src/state/admin-language-context.ts`
- Create: `src/state/admin-language.tsx`
- Create: `src/state/use-admin-language.ts`
- Modify: `src/App.tsx`
- Modify: `src/components/RequireAdmin.tsx`

**Interfaces:**
- `AdminLang = 'en' | 'id'`.
- `AdminLanguageContextValue = { lang: AdminLang; setLang(lang: AdminLang): void; t: Translations['admin'] }`.
- `AdminLanguageProvider` reads/writes only `mdc-admin-lang`; wraps the `/admin` guard and dashboard, but does not wrap `/` or `/login`.
- `useAdminLanguage()` returns the admin context.

- [x] Create a context with an English fallback and a typed admin translation value.
- [x] Create the provider with safe localStorage access, separate key `mdc-admin-lang`, supported-value validation, and dictionary selection.
- [x] Add the hook and wrap the `/admin` guard/dashboard route with `AdminLanguageProvider` so session-check/loading copy can use the admin locale.
- [x] Localize the `/admin` session-check state in `RequireAdmin`; keep login copy unchanged.
- [x] Confirm the public `LanguageProvider` and its `mdc-lang` behavior are untouched.

### Task 3: Localize admin shell and navigation

**Files:**
- Modify: `src/components/admin/TopBar.tsx`
- Modify: `src/components/admin/AdminNavigation.tsx`
- Modify: `src/pages/AdminDashboard.tsx`

**Interfaces:**
- Use `useAdminLanguage()` in each component.
- Add an accessible `EN / ID` toggle in `TopBar`; it calls `setLang` and marks the active choice with `aria-pressed`.

- [x] Replace shell, internal-pilot, clock, theme, event-log, sign-out, sidebar, page title/description, date/wing filter, action buttons, loading/error, and metric-pending labels with dictionary entries.
- [x] Add the compact language toggle without changing theme, auth, WITA, notification, or navigation behavior.
- [x] Ensure all toggle controls have translated accessible names and visible active state using existing button tokens.

### Task 4: Localize overview panels and operations labels

**Files:**
- Modify: `src/components/admin/VitalsStrip.tsx`
- Modify: `src/components/admin/ActionQueue.tsx`
- Modify: `src/components/admin/ConflictCenter.tsx`
- Modify: `src/components/admin/GateMatrix.tsx`
- Modify: `src/components/admin/TrafficChart.tsx`
- Modify: `src/components/admin/StatusMix.tsx`
- Modify: `src/components/admin/AirlineRanking.tsx`
- Modify: `src/components/admin/NoticeList.tsx`
- Modify: `src/components/admin/OpsStatus.tsx`

**Interfaces:**
- Consume `Translations['admin']` using `useAdminLanguage()`.
- Render localized status/severity labels while preserving `FlightStatus`, `Notif['type']`, and color-map keys.
- Replace presentation use of the English `actionLabel()` string with a typed localized action-label map; do not change `src/lib/flight-flow.ts` behavior.

- [x] Translate panel titles, legends, headings, search/scope/filter copy, empty states, conflict descriptions, actions, confirmations, and accessible labels.
- [x] Keep metric calculations, conflict detection, colors, and callbacks unchanged.
- [x] Translate dynamic counts and plural forms through dictionary functions so Bahasa Indonesia copy remains grammatical.

### Task 5: Localize flight monitor, event log, dialogs, and API errors

**Files:**
- Modify: `src/components/admin/FlightMonitor.tsx`
- Modify: `src/components/admin/EventLog.tsx`
- Modify: `src/components/admin/FlightDialogs.tsx`
- Modify: `src/state/admin-flights.tsx`

**Interfaces:**
- Use `useAdminLanguage()` for filters, column headings, pagination, field labels, button text, validation/fallback copy, and dialog descriptions.
- Extend `ApiError` to retain the server error `code`; map known codes through `t.admin.errors`, and use its localized generic fallback for unknown errors.
- Preserve `NewAdminFlight`, field values, status enum values, API calls, and audit behavior.

- [x] Translate monitor filters, sort labels, table labels, empty state, and pagination copy.
- [x] Translate event-log filters, severity labels, count copy, empty states, and generated system messages without altering operator-entered event messages.
- [x] Translate add/edit flight and internal notice dialog fields, validation states, pending labels, and confirmation buttons.
- [x] Keep API and domain enum values stable and localize only display strings.
- [x] Map known API error codes to English/Indonesian client messages and retain the generic fallback when a code is unknown.

### Task 6: Final verification and acceptance

**Files:**
- Verify: all files above
- Update: `docs/superpowers/specs/2026-10-25-admin-dashboard-i18n-design.md` only if implementation decisions change

- [x] Run `npm run build`; expect TypeScript and Vite build to pass with both dictionaries satisfying the same contract.
- [x] Run `npm run lint`; expect no lint errors.
- [ ] Manually inspect English and Indonesian in Overview, Flight monitor, Event log, add/edit/notice dialogs, and loading/error/empty states.
- [ ] Reload `/admin` and confirm `mdc-admin-lang` persists while `mdc-lang` remains unchanged.
- [ ] Inspect the toggle, filters, flight table, and dialogs at desktop and narrow viewport widths; confirm no page-level horizontal overflow.
