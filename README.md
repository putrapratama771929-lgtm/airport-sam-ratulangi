# 🛫 Sam Ratulangi International Airport (MDC) — Information & Operations Portal

A modern, responsive, and full-featured web portal for **Sam Ratulangi International Airport (MDC — Manado)**. This project includes both a **Public Passenger Information System** and an **Interactive Airport Operations Cockpit (Admin Dashboard)**.

---

## 🌟 Key Features

### 1. 👥 Passenger Information System (`/`)
- **Live Flight Information Display System (FIDS):** Real-time departure & arrival boards with search, sorting, and live status update flashes.
- **Interactive Airport Map:** SVG schematic of Apron, Runway 18/36, Domestic Gates (D1–D8), and International Gates (I1–I4).
- **Parking & Ground Transport:** Occupancy trackers and fare schedules for official taxis, DAMRI buses, ride-hailing services, and car rentals.
- **Interactive Airport Services:** Detailed guides for dining, lounges, medical clinics, and accessibility assistance.
- **Multilingual Support (i18n):** Full support for **Bahasa Indonesia** and **English**.
- **AI Airport Assistant:** Offline rule-based chatbot capable of answering passenger queries regarding flights, facilities, parking, and transportation.

### 2. 🎛️ Operations Control Center / Admin Dashboard (`/admin`)
- **Real-Time Simulation Engine:** Automatic flight lifecycle progression (`SCHEDULED` ➔ `CHECK-IN` ➔ `BOARDING` ➔ `DEPARTED`/`LANDED`), delay generation, and gate reassignments.
- **Airspace Radar Screen:** Interactive radar displaying aircraft based on actual flight bearing angles from MDC and time-until-arrival (ETA rings).
- **Conflict Center:** Automated clash detection identifying simultaneous gate conflicts within 30-minute intervals and wing mismatches.
- **Gate Matrix:** Live gate occupancy matrix with quick inspection.
- **Action Queue & Flight Control:** Operator controls to advance flight phases, broadcast urgent notices, reassign gates, and add/delay flights.

---

## 🛠️ Tech Stack

- **Core:** [React 19](https://react.dev/), [TypeScript 5.9](https://www.typescriptlang.org/), [Vite 7.2](https://vite.dev/)
- **Styling:** [Tailwind CSS 3.4](https://tailwindcss.com/) with aviation-themed dark UI tokens (`ops-theme.css`)
- **Icons & UI Primitives:** [Lucide React](https://lucide.dev/), [Radix UI](https://www.radix-ui.com/)
- **Routing:** [React Router 7](https://reactrouter.com/)
- **Testing:** Node.js native test runner (`node --test`) with Vite SSR module loader

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v20 or newer
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
   Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📜 Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts Vite dev server with HMR |
| `npm run build` | Type-checks with `tsc -b` and bundles with Vite |
| `npm run lint` | Runs ESLint 9 checks |
| `npm test` | Executes unit tests via `node --test` |
| `npm run preview` | Previews the production build locally |

---

## 🔒 Admin Access Demo

To access the operations dashboard:
1. Navigate to `/login` or click the lock/admin icon in the header.
2. Enter any valid email (e.g. `admin@mdc-airport.id`) and a password with at least 8 characters.

---

## 📄 License
This project is for demonstration and prototype purposes.
