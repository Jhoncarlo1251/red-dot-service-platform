# red-dot-service-platform

**OSMOS: Universal AI Workflow Operating System & Offline-First Smart Kiosk Platform**

An investor-grade, multi-tenant enterprise operating system designed to digitize physical, manual, and on-site service workflows. Built with an **offline-first edge architecture**, OSMOS ensures physical establishments (government counters, academic institutions, healthcare clinics, retail spaces, manufacturing floors, and hospitality desks) maintain continuous zero-latency operations even during complete internet or cloud uplink outages.

---

## 🌟 Key Architecture & Capabilities

### 1. 📴 Offline-First Edge Resiliency (Zero-Downtime Guarantee)
- **Local Cache & Buffer Engines:** Captive-portal check-ins, ticketing queues, and cashless transactions are buffered locally in SQLite/browser cache storage during offline mode.
- **Automated Cloud Sync:** When uplink connectivity is re-established, the platform automatically triggers bidirectional delta batch synchronization to cloud databases.
- **Latency Optimization:** Sub-millisecond responsive interaction on local LAN mesh networks.

### 2. 🏛️ Multi-Industry Adaptability Matrix
Preconfigured workflows tailored for critical industry sectors:
- **Government & Civic Services:** Barangay clearances, civil registry, queue dispatch, tax assessment, paperless affidavits.
- **Academic Institutions:** Student enrollment, NFC/RFID gate attendance, transcript requests, registrar counters.
- **Healthcare & Medical Clinics:** Patient triage, vital-signs queue routing, consultation appointments, offline prescription logs.
- **Retail & Point-of-Sale:** Cashless catalog checkouts, barcode/item inventory, shift sales receipts.
- **Hospitality & Events:** Guest check-in desks, indoor positioning navigation, concierge requests.
- **Enterprise & Logistics:** Shift task checklists, hardware node tracking, operator telemetry.

### 3. 👥 Multi-Role Enterprise Workspaces
- **Customer / Visitor Portal:** Self-service digital ticket generation, live counter status scoreboard, indoor navigation floorplans, cashless shopping basket, and paperless request filing.
- **Staff / Desk Operator Desk:** Active queue dispatch terminal, counter calling, shift task checklist, and POS transaction logging.
- **Manager / Supervisor Console:** Real-time throughput metrics, latency bottleneck analysis, AI-assisted operational reports, and microservice status.
- **Root Administrator / Enterprise Owner:** Multi-tenant SaaS configuration, connected edge node telemetry, dynamic custom form builders, and automated rule engines.

### 4. 🤖 AI-Powered Operations Engine
- **Predictive Queue Flow:** AI forecasting of hourly peak loads and staffing bottlenecks.
- **Autonomous Recommendations:** Dynamic workflow automation rules with triggers, condition evaluations, and automated dispatch actions.
- **Multimodal Smart Assistant:** Instant assistance with natural language service discovery and operational diagnostics.

---

## 🚀 Tech Stack

- **Frontend & UI:** React 18, TypeScript, Tailwind CSS, Lucide Icons, Motion Animations
- **Backend & Middleware:** Express.js, Node.js, Vite Dev Server & Middleware
- **Build System:** Vite + esbuild bundled CJS server distribution
- **Data & Telemetry:** Multi-tier client/server sync architecture with offline buffering

---

## 🛠️ Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or later
- **npm** or **yarn** / **pnpm**

### Installation

```bash
# Clone the repository
git clone https://github.com/Jhoncarlo1251/red-dot-service-platform.git

# Navigate to project directory
cd red-dot-service-platform

# Install dependencies
npm install
```

### Running Development Server

```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### Building for Production

```bash
npm run build
npm start
```

---

## 📁 Project Structure

```
├── src/
│   ├── components/
│   │   ├── AIAssistantWidget.tsx   # AI Assistant interactive widget
│   │   └── RoleDashboards.tsx      # Multi-role dashboard consoles
│   ├── App.tsx                     # Main application layout & state machine
│   ├── industryData.ts             # Industry workflow presets & location mappings
│   ├── types.ts                    # TypeScript types & interface declarations
│   ├── main.tsx                    # React client entry point
│   └── index.css                   # Global styles & Tailwind configuration
├── server.ts                       # Express backend server with Vite middleware
├── package.json                    # Project metadata and dependencies
├── vite.config.ts                  # Vite build & plugin configuration
├── tsconfig.json                   # TypeScript compiler configuration
└── metadata.json                   # App manifest and platform capabilities
```

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
