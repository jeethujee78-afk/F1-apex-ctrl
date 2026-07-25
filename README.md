# 🏁 APEX CTRL

<div align="center">

## AI-Powered Formula 1 Race Intelligence Platform

**Transforming raw Formula 1 telemetry into immersive race intelligence experiences.**

![Status](https://img.shields.io/badge/status-production--ready-green.svg)
![React](https://img.shields.io/badge/react-18+-cyan.svg)
![TypeScript](https://img.shields.io/badge/typescript-5+-blue.svg)
![Python](https://img.shields.io/badge/python-3.10+-blue.svg)
![OpenF1](https://img.shields.io/badge/OpenF1-API-orange.svg)

### Formula 1 Telemetry • Cinematic Replay • AI Strategy Intelligence

</div>

---

# 🎯 Vision

Formula 1 generates thousands of telemetry data points every second, yet fans only experience a small fraction of the intelligence available to race engineers.

APEX CTRL was created to bridge this gap.

By combining telemetry analytics, race strategy intelligence, driver comparison systems, weather insights, tyre intelligence, AI-assisted recommendations, and cinematic replay experiences, APEX CTRL transforms raw racing data into actionable race intelligence.

---

# 💡 Why APEX CTRL?

What if Formula 1 fans could experience races with the same analytical depth used by professional race engineers?

Instead of building another statistics dashboard, APEX CTRL delivers:

* 📊 Actionable telemetry intelligence
* 🏎️ Driver performance analytics
* 🧠 AI-assisted strategic insights
* 🎬 Broadcast-inspired replay experiences
* 🌦️ Weather-aware race analysis
* 🛞 Tyre strategy intelligence
* 📈 Real-time race storytelling

---

# ✨ Key Features

## 📺 Cinematic Replay Intelligence

* Interactive replay controls
* Dynamic timeline progression
* Sector synchronization
* Driver battle visualization
* Gap evolution tracking
* Replay intelligence engine
* Broadcast-inspired race experience

## 📊 OpenF1 Telemetry Integration

* Live telemetry ingestion
* Historical race analysis
* GPS position processing
* Speed visualization
* Gear analytics
* Throttle and brake intelligence
* Session synchronization

## 🏎️ Race Strategy Analytics

* Pit stop intelligence
* Safety Car impact analysis
* Virtual Safety Car scenarios
* Sector performance breakdowns
* Driver trend identification
* Strategic race insights

## 🤖 AI Race Intelligence

* Context-aware race summaries
* Driver advantage analysis
* Strategy recommendations
* Telemetry interpretation
* Race storytelling intelligence
* Predictive analytics

## 🛞 Tyre Intelligence

* Compound analysis
* Stint tracking
* Degradation insights
* Tyre performance comparison
* Strategy evaluation

## 🌦️ Weather Intelligence

* Session weather monitoring
* Track condition awareness
* Environmental race context
* Strategy impact evaluation

---

# 📸 Platform Modules

| Module                    | Purpose                          |
| ------------------------- | -------------------------------- |
| 📊 Dashboard              | Central race intelligence hub    |
| 📺 Cinematic Replay       | Broadcast-inspired replay engine |
| ⏱️ Live Timing            | Session timing and gap tracking  |
| 📈 Telemetry Analysis     | Performance visualization        |
| 🏁 Driver Comparison      | Head-to-head analytics           |
| 🛞 Tyre Intelligence      | Tyre strategy analysis           |
| 🌦️ Weather Intelligence  | Environmental insights           |
| 🤖 AI Strategist          | AI-powered recommendations       |
| ⚙️ Settings & Diagnostics | Platform monitoring              |

---

# 🏗️ Architecture

```text
OpenF1 API
        ↓
Data Acquisition Layer
        ↓
Telemetry Processing Engine
        ↓
Race Intelligence Engine
        ↓
Analytics Services
        ↓
React + TypeScript Frontend
        ↓
APEX CTRL Experience
```

---

# 🛠️ Technology Stack

## Frontend

* React
* TypeScript
* Vite
* Tailwind CSS

## Backend & Analytics

* Python
* Streamlit
* OpenF1 API
* Telemetry Processing Engine
* Strategy Engine
* Prediction Engine

## Infrastructure

* Node.js
* REST APIs
* Docker Ready
* Cloud Deployment Ready

---

# ⚡ Quick Start

## Prerequisites

* Python 3.10+
* Node.js 18+
* npm
* pip

## Monorepo Architecture

The project is structured as a modern monorepo using **npm Workspaces**:

- `/frontend`: React + Vite client application (Vercel deployment compatible)
- `/backend`: Node.js Express server + Python Streamlit analytics engine (AWS ECS deployment compatible)

The root folder acts as the orchestrator to install, run, build, and lint both applications concurrently.

## Installation

To install all dependencies for both applications, simply run from the repository root:
```bash
npm install
```
This single command hoists dependencies and configures workspace symlinks.

For Python analytics dependencies:
```bash
cd backend
pip install -r requirements.txt
```

## Running the Applications

### Local Development
Start both frontend and backend development servers concurrently with a single command from the root folder:
```bash
npm run dev
```
* **Frontend** runs on `http://localhost:5173`
* **Backend** runs on `http://localhost:3000` (API calls are proxied from the frontend automatically)

### Production Build
Build both frontend and backend:
```bash
npm run build
```

### Production Start
Start the production backend Express server:
```bash
npm run start
```

### Linting
Lint the frontend code:
```bash
npm run lint
```

### Run Streamlit Analytics
The Streamlit dashboard can be run independently from the backend folder:
```bash
cd backend
streamlit run streamlit_app.py
```

---

# 📂 Project Structure

```text
APEX-CTRL/
├── package.json              # Root monorepo configuration (npm Workspaces)
├── package-lock.json         # Unified dependency lockfile
├── docker-compose.yml        # Orchestrated development composition
├── README.md
├── .gitignore
│
├── frontend/
│   ├── src/                  # React + TypeScript client codebase
│   ├── index.html            # Main SPA mount HTML
│   ├── package.json          # Client dependencies
│   ├── vite.config.ts        # Vite client configuration
│   └── tsconfig.json         # Client TypeScript configuration
│
└── backend/
    ├── api/                  # Serverless function router (api/index.ts)
    ├── analytics/            # Python telemetry metrics models
    ├── services/             # Python data acquisition client services
    ├── ui/                   # Python Streamlit interface modules
    ├── utils/                # Python constants rosters
    ├── server.ts             # Express API application server
    ├── package.json          # Server dependencies
    ├── tsconfig.json         # Server TypeScript compilation config
    ├── requirements.txt      # Python environment requirements
    ├── streamlit_app.py      # Streamlit dashboard entrypoint
    └── Dockerfile            # Server docker deployment spec
```


---

# 🚀 Roadmap

| Version | Feature                      | Status |
| ------- | ---------------------------- | ------ |
| v1.0    | OpenF1 Telemetry Integration | ✅      |
| v1.0    | Driver Comparison Engine     | ✅      |
| v1.0    | Cinematic Replay Experience  | ✅      |
| v1.0    | Race Intelligence Dashboard  | ✅      |
| v1.1    | Enhanced AI Strategy Engine  | 🚧     |
| v1.2    | Advanced TV Director Cameras | 📅     |
| v1.3    | AI Race Commentary           | 📅     |
| v2.0    | Multi-Driver Battle Analysis | 📅     |
| v2.0    | Session Export & Sharing     | 📅     |
| v2.1    | Mobile Optimization          | 📅     |

---

# 🎓 Engineering Highlights

APEX CTRL demonstrates practical experience across multiple software engineering domains:

* Full-Stack Development
* API Integration
* Telemetry Processing
* Data Visualization
* AI-Assisted Analytics
* Predictive Systems
* User Experience Design
* Real-Time Data Handling
* Broadcast-Inspired Interfaces
* Data-Driven Storytelling

---

# ⚠️ Disclaimer

APEX CTRL is an independent and unofficial software project.

It is not affiliated with, endorsed by, sponsored by, or associated with Formula 1, Formula One Licensing B.V., FIA, OpenF1, or any Formula 1 team.

This project is intended for educational, research, portfolio, demonstration, and future commercial development purposes.

All trademarks, team names, driver names, and motorsport branding belong to their respective owners.

---

# 👨‍💻 Author

### Jeethu G

Passionate about Formula 1, cloud technologies, intelligent systems, data engineering, and immersive analytics experiences.

GitHub:
https://github.com/jeethujee78-afk

---

# 📄 License & Ownership

Copyright © 2026 Jeethu G.

All Rights Reserved.

APEX CTRL and all associated source code, software architecture, user interfaces, analytics engines, replay systems, AI-assisted intelligence modules, documentation, visual assets, and intellectual property are the exclusive property of Jeethu G.

Unauthorized copying, modification, distribution, sublicensing, reverse engineering, resale, or commercial use without prior written permission is prohibited.

---

<div align="center">

# 🏁 Turning Telemetry Into Intelligence

### Built for Formula 1 fans. Inspired by engineers.

</div>
