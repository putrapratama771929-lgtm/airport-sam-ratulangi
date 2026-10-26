# 🛫 Sam Ratulangi International Airport (MDC) — Information & Operations Portal

A modern, responsive, and full-featured web portal for **Sam Ratulangi International Airport (MDC — Manado)**. This project includes both a **Public Passenger Information System** and an **Interactive Airport Operations Cockpit (Admin Dashboard)**.

---

## 🌟 Key Features

### 1. 👥 Passenger Information System (`/`)
- **Sample Flight Information Display System (FIDS):** Demonstration departure and arrival data with search, sorting, and simulated status changes. It is not connected to an airport or airline feed and must not be treated as live flight information.
- **Interactive Airport Map:** SVG schematic of Apron, Runway 18/36, Domestic Gates (D1–D8), and International Gates (I1–I4).
- **Parking & Ground Transport:** Occupancy trackers and fare schedules for official taxis, DAMRI buses, ride-hailing services, and car rentals.
- **Interactive Airport Services:** Detailed guides for dining, lounges, medical clinics, and accessibility assistance.
- **Multilingual Support (i18n):** Full support for **Bahasa Indonesia** and **English**.
- **AI Airport Assistant:** Offline rule-based chatbot capable of answering passenger queries regarding flights, facilities, parking, and transportation.

### 2. 🎛️ Operations Control Center / Admin Dashboard (`/admin`)
- **Internal pilot data:** Manually entered flights stored in a local SQLite database through a same-origin Node API. No live flight feed is configured.
- **Conflict Center:** Automated clash detection identifying simultaneous gate conflicts within 30-minute intervals and wing mismatches.
- **Gate Matrix:** Gate occupancy view based on manually entered pilot flights.
- **Action Queue & Flight Control:** Authenticated pilot operators can add, edit, advance, delay, cancel, and reassign flights; writes are version-checked and audited.
- **Event log:** Internal operations notices with shared read state for the pilot desk/shift.
- **No public-data bridge:** Pilot flights and internal notices are not sent to the public website.

---

## 🛠️ Tech Stack

- **Core:** [React 19](https://react.dev/), [TypeScript 5.9](https://www.typescriptlang.org/), [Vite 7.2](https://vite.dev/)
- **Styling:** [Tailwind CSS 3.4](https://tailwindcss.com/) with aviation-themed dark UI tokens (`ops-theme.css`)
- **Icons & UI Primitives:** [Lucide React](https://lucide.dev/), [Radix UI](https://www.radix-ui.com/)
- **Routing:** [React Router 7](https://reactrouter.com/)
- **Testing:** Node.js native test runner (`node --test`) with Vite SSR module loader
- **Pilot API / storage:** Node.js 24+ built-in HTTP and SQLite modules; no additional runtime packages

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v24 or newer
- [npm](https://www.npmjs.com/) v10 or newer

### Installation

1. Clone the repository:
   ```bash
   git clone <YOUR_REPOSITORY_URL>
   cd "Airport 2"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm run dev
   ```
   Open [http://127.0.0.1:3000](http://127.0.0.1:3000) in your browser. Vite proxies `/api` to the local pilot API. To use another local port, set `VITE_PORT` before `npm run dev` (for example `4173`); the API's allowed dev origin follows that port.

### Provisioning an internal pilot operator

1. Copy `.env.example` to `.env`.
2. Set `PILOT_ADMIN_EMAIL` and `PILOT_ADMIN_PASSWORD` to the first pilot operator's email and a unique password of at least 12 characters.
3. Run `npm run pilot:create-operator` once. This stores a scrypt password hash in SQLite; it does not store the plaintext password.
4. Remove `PILOT_ADMIN_PASSWORD` from `.env` immediately after provisioning.
5. Run `npm run dev` and sign in at `/login` using the provisioned account.

The local pilot database is created at `./var/airport-pilot.sqlite` by default. It starts empty; no sample flights are copied into the admin pilot.

---

## 📜 Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts Vite and the local SQLite-backed pilot API |
| `npm run build` | Type-checks with `tsc -b` and bundles with Vite |
| `npm run lint` | Runs ESLint 9 checks |
| `npm test` | Executes domain and pilot API tests via `node --test` |
| `npm run preview` | Previews the production build locally |
| `npm start` | Serves the production build and API; production requires an exact HTTPS `PILOT_APP_ORIGIN` and persistent database storage |
| `npm run pilot:create-operator` | Provision a pilot operator from temporary environment variables |

---

## 🔒 Pilot Access

There is no public sign-up or default account. Provision operator accounts out of band. All provisioned accounts receive the initial `operator` role and its audited pilot actions; additional roles and production deployment remain subject to airport-owner approval.

The Node API binds to loopback by default. Production deployment must use HTTPS, a persistent volume for SQLite, approved access controls, and a rehearsed backup/restore procedure. This code does not connect to live airport systems or authorize operational use by itself.

---

## 📄 License
This project is for demonstration and prototype purposes.
