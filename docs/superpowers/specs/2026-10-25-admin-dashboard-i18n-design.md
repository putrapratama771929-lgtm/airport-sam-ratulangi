# Admin Dashboard Indonesian i18n — Design

## Intent

Add Indonesian language support to the internal airport admin dashboard and a visible language toggle. The dashboard language preference must remain independent from the public passenger site's existing `mdc-lang` preference.

## Goals

- Translate all operator-facing text in Overview, Flight monitor, and Event log, including navigation, actions, dialogs, statuses, empty/loading/error states, chart labels, and accessible labels.
- Provide an English / Indonesia toggle in the admin shell.
- Persist the admin preference separately (proposed key: `mdc-admin-lang`) and keep domain/API values stable while localizing their displayed labels.
- Reuse the existing English/Indonesian translation content and TypeScript project conventions; add no dependency or language preference setting to the backend.

## Non-goals

- Changing the passenger site's language or its existing preference.
- Translating the separate login page, public site, or server logs/API messages.
- Changing airport workflows, status values, API routes, authentication, or domain logic.
- Translating operator-authored notice text; operators' own message content remains verbatim.

## Approaches considered

1. **Reuse the global language preference:** simplest, but an admin toggle would also change the passenger site. This conflicts with the requested admin-only scope.
2. **Admin-scoped locale provider using the existing dictionaries:** store a distinct admin preference and expose the matching English/Indonesian admin copy only under the `/admin` route. This keeps public behavior independent while reusing the current translation architecture. **Selected.**

## Design

- Add typed admin translation entries to the existing English and Indonesian dictionaries.
- Add an admin-scoped language context/provider that reads and writes `mdc-admin-lang`, defaults to English, and wraps the authenticated dashboard route.
- Add an accessible `EN / ID` toggle to the admin top bar.
- Replace hard-coded operator-facing strings in the three dashboard views and their composed components with translation keys. Translate display labels for flight statuses and actions, while leaving stored/API values unchanged.
- Store stable message codes and parameters with generated flight events so the Event log can render those system messages in the selected locale; leave operator-authored notices unchanged.
- Keep login and passenger-site copy/preferences unchanged.

## Acceptance

- Switching to Indonesian localizes the admin shell and all three destinations, including dialogs and accessible text.
- Reloading `/admin` retains the selected admin language.
- The passenger site's language and `mdc-lang` value do not change when the admin language is switched.
- English remains the default when there is no valid saved admin preference.
- TypeScript confirms English and Indonesian admin dictionaries have matching required keys.
