# Sam Ratulangi Airport Portal

A passenger information prototype and an internal airport-operations pilot for Sam Ratulangi International Airport (MDC), Manado.

> **Data boundary:** The passenger flight board uses simulated data. The admin dashboard uses manually entered pilot data in a local SQLite database. Neither is connected to a live airport or airline feed, and admin data is not published to the passenger site.

## What’s included

### Passenger site (`/`)

- Searchable sample departures and arrivals, with simulated status changes.
- An interactive airport map, parking and transport information, and service guides.
- English and Indonesian content, plus an offline rule-based airport assistant.

### Admin dashboard (`/admin`)

- Three work areas: Overview, Flight monitor, and Event log.
- Gate-conflict detection, gate occupancy, priority flights, and movement summaries.
- Manual flight creation and editing, status actions, delay and cancellation actions, and gate reassignment.
- Audited, version-checked writes and a shared event read state for the pilot desk.
- English and Indonesian UI, with saved language and theme preferences.

The admin interface is for local pilot validation. It does not authorize operational use or connect to live airport systems.

## Technology

- React 19, TypeScript 5.9, and Vite 7.
- Tailwind CSS 3.4, scoped dashboard styles, and Lucide icons.
- React Router 7 and Radix UI components.
- Node.js 24+ for the local HTTP API and built-in SQLite support.
- Node.js native test runner (`node --test`).

## Run locally

### Requirements

- Node.js 24 or newer
- npm 10 or newer

### Install and start

```bash
git clone https://github.com/putrapratama771929-lgtm/airport-sam-ratulangi.git
cd airport-sam-ratulangi
npm install
npm run dev
```

Open [http://127.0.0.1:3000](http://127.0.0.1:3000). The development command starts the Vite site and the local pilot API. The API binds to `127.0.0.1:3001` by default, and the SQLite database is created at `./var/airport-pilot.sqlite`.

The pilot database starts without flights. To load the synthetic demonstration flights, notices, and audit entries, run this once in a second terminal:

```bash
npm run pilot:seed-demo
```

The seed command refuses to mix demo records into a database that already contains flights. Seeded records are synthetic and should not be treated as live operations data.

### Create a pilot operator

There is no default account or public sign-up. Create the first operator locally:

1. Copy `.env.example` to `.env`.
2. Set `PILOT_ADMIN_EMAIL` and `PILOT_ADMIN_PASSWORD` to the operator credentials. Use a unique password with at least 12 characters.
3. Run `npm run pilot:create-operator`.
4. Remove `PILOT_ADMIN_PASSWORD` from `.env` after provisioning.
5. Sign in at `/login`.

Keep `.env` private; it is ignored by Git. Provision accounts out of band.

## Configuration

The development defaults are listed in `.env.example`:

| Variable | Purpose | Default |
| --- | --- | --- |
| `PILOT_DB_PATH` | SQLite database file | `./var/airport-pilot.sqlite` |
| `PILOT_HOST` | API/server bind address | `127.0.0.1` |
| `PILOT_API_PORT` | Pilot API port | `3001` |
| `VITE_PORT` | Vite development server port | `3000` |

Production also requires one exact HTTPS origin in `PILOT_APP_ORIGIN` and persistent database storage. Terminate TLS at the approved host or reverse proxy. The app does not configure production infrastructure or backups for you.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the local site and pilot API |
| `npm run build` | Type-check and create a production build in `dist/` |
| `npm run preview` | Preview the Vite production build locally |
| `npm start` | Serve the production build and API |
| `npm run pilot:seed-demo` | Add the synthetic pilot dataset to an empty flight database |
| `npm run pilot:create-operator` | Provision an operator from temporary environment variables |
| `npm test` | Run domain and pilot API tests |
| `npm run lint` | Run ESLint |

## Operational and deployment boundaries

- All pilot times are displayed in WITA (`Asia/Makassar`, UTC+8).
- Flight data is manually entered and stored locally; there is no live feed integration.
- Dashboard notices remain internal and are not sent to the passenger site.
- Production use requires airport-owner approval, an approved host and access policy, HTTPS, persistent storage, and a rehearsed backup/restore procedure.

## License

This project is for demonstration and internal pilot validation.
