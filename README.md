<div align="center">

🏁 APEX CTRL

AI-Powered Formula 1 Race Intelligence Platform

Turn race data into race intelligence.



<br/>

APEX CTRL is an Early Access race-intelligence experience that combines Formula 1 session data, telemetry visualisation, driver comparison, AI-assisted strategy analysis, weather and tyre intelligence, and cinematic replay in one interactive control center.

<br/>

🌐 Open Live Demo   •  💻 View Source

</div>

⚡ The Idea

Formula 1 produces an enormous amount of data during every session.

Lap times. Sector splits. Speed. Throttle. Braking. Tyres. Weather. Positions. Strategy.

The problem isn't the lack of data.

The problem is understanding it.

APEX CTRL was built around one simple principle:

Data → Context → Intelligence

Instead of making users interpret hundreds of disconnected numbers, APEX CTRL brings the race into one connected experience and uses visual analytics plus AI-assisted interpretation to make the data easier to understand.

🎯 What APEX CTRL Is Built To Do

Capability

What it provides

🛰️ Race Control Center

Select season, Grand Prix and session and move through the race environment

🏁 Race Overview

Circuit, session, driver and race context in one place

⏱️ Live Timing

Positions, intervals, laps, sectors and session timing

📡 Telemetry Diagnostics

Speed, throttle, braking and lap/driver traces

🤖 AI Race Strategist

AI-assisted strategy and race-context analysis

📈 Lap Analysis

Lap, sector and pace-level performance analysis

🆚 Driver Comparison

Compare drivers and identify performance differences

🌦️ Weather Intelligence

Bring available environmental conditions into the analysis

🛞 Tyre Analysis

Explore tyre behaviour, degradation and compound-level trends

🎥 Cinematic Replay

Experience session progression through an immersive track-focused view

🧠 The Core Experience

01 — 🛰️ Race Control Center

The Race Control Center is the starting point for the application.

Users can select:

Season / year

Grand Prix

Session

The selected session becomes the context for the rest of the experience.

The goal is simple:

Choose the race. Then let APEX CTRL build the race environment around it.

02 — 🏁 Race Overview

Once a session is selected, APEX CTRL brings together the available race context.

The experience can include:

Circuit information

Session information

Driver information

Race/session status

Track context

Key performance information

Instead of jumping between disconnected tools, the user gets a single race-control view.

03 — ⏱️ Live Timing

The Live Timing experience brings the field into one view.

Depending on the selected session and available OpenF1 data, users can explore:

Driver positions

Lap performance

Intervals and gaps

Sector information

Speed-related metrics

Session standings

The purpose isn't simply to show a leaderboard.

It's to give the user race context at a glance.

04 — 📡 Telemetry Diagnostics

This is where the application moves deeper into performance analysis.

Telemetry can be visualised through signals such as:

Speed

Throttle

Braking

Lap traces

Sector performance

Driver-to-driver telemetry

Instead of looking at raw telemetry payloads, users can visually identify:

Where was the time gained?

Where was the time lost?

How did the drivers differ through the lap?

🤖 AI Race Strategist

The intelligence layer of APEX CTRL

Traditional dashboards show data.

The AI Race Strategist attempts to explain it.

The selected race/session context can be used to generate structured analysis around areas such as:

Strategy observations

Pit-window considerations

Tyre progression

Pace interpretation

Overtake/strategic considerations

Session summaries

Driver-focused insights

The intention is not to replace the underlying data.

It is to put the data into race context.

AI flow

Selected Session
      │
      ▼
Race / Telemetry Context
      │
      ▼
Analysis Request
      │
      ▼
Google Gemini
      │
      ▼
Structured Race Intelligence
      │
      ▼
APEX CTRL AI Strategist

⚠️ AI Disclaimer: AI-generated insights are analytical assistance. They are not official Formula 1 team strategy, guaranteed predictions, or professional motorsport advice.

📈 Lap Analysis

Lap Analysis focuses on the details hidden inside a lap.

The experience can be used to examine:

Lap-level performance

Sector differences

Pace deltas

Ideal/theoretical lap calculations

Driver performance differences

The objective:

Don't just ask who was faster. Find where the difference happened.

🆚 Driver Comparison

APEX CTRL allows users to place drivers side by side within the selected race context.

Depending on available session data, comparisons can include:

Speed

Lap performance

Sector performance

Telemetry traces

Pace differences

This creates a visual answer to:

Where is one driver gaining time over another?

🌦️ Weather Intelligence

Race strategy doesn't happen in a vacuum.

Environmental conditions can change the entire shape of a session.

APEX CTRL brings available weather/session context into the analysis, including information such as:

Track temperature

Weather conditions

Rain/precipitation risk

Surface/track context

The purpose is to connect performance with conditions rather than analysing drivers in isolation.

🛞 Tyre Analysis

Tyres are one of the biggest strategic variables in Formula 1.

The tyre-analysis experience is designed to help users understand how tyre behaviour evolves through a session.

Depending on the available data and analysis path, it can surface:

Compound-level information

Estimated tyre life

Degradation trends

Graining/risk indicators

Lap-by-lap tyre behaviour

🎥 Cinematic Replay

Numbers tell you what happened.

Replay helps you see it.

The Cinematic Replay experience brings the selected session into a circuit-focused visual environment where users can follow race progression and explore the session through its data.

The objective is to make complex race information feel more intuitive and immersive.

🏗️ Architecture

APEX CTRL separates the user experience from the backend/data and AI layers so the application can evolve independently.

flowchart LR
    U[👤 User] --> V[⚛️ React + Vite Frontend]

    V --> B[🟢 Node.js + Express Backend]

    B --> O[🏁 OpenF1]
    B --> D[(🗄️ DynamoDB Cache)]
    B --> G[🤖 Google Gemini]
    B --> S[(📦 Amazon S3)]

    V --> F[🔐 Firebase Authentication]

    B --> C[🐳 Docker Container]
    C --> E[☁️ Amazon ECS]
    E --> CW[📊 CloudWatch]

    C --> R[📦 Amazon ECR]

High-level request flow

User
 │
 ▼
React / Vite
 │
 ▼
Backend API
 │
 ├──────────────► OpenF1
 │
 ├──────────────► DynamoDB
 │
 ├──────────────► Gemini
 │
 └──────────────► S3

🗃️ Real Data + Cache Strategy

APEX CTRL is designed around real Formula 1 session data rather than hard-coded race results.

OpenF1 is used as the Formula 1 data source.

Because external APIs can be rate-limited, the backend includes a cache and request-management layer.

Verified cache flow

Request
   │
   ▼
Check DynamoDB
   │
   ├── Fresh cache ─────────► Return cached data
   │
   └── Cache miss / stale
             │
             ▼
         Request OpenF1
             │
             ▼
       Build response
             │
             ▼
       Store in cache
             │
             ▼
       Return response

The relevant exact-results cache uses a 12-hour freshness window in the verified implementation.

This reduces unnecessary upstream requests and provides resilience when OpenF1 becomes temporarily unavailable or rate-limited.

🛡️ Reliability & Failure Handling

APEX CTRL was designed with real-world failure conditions in mind.

🏁 OpenF1 rate limiting

Caching and request deduplication reduce unnecessary upstream traffic and help protect the application from repeated 429 responses.

🧠 AI availability

The AI layer has fallback behaviour so an unavailable Gemini service does not have to make the entire application unusable.

☁️ Backend availability

The frontend can detect backend availability and use its supported fallback/direct-data path when the backend is unavailable.

📦 S3 archival

AI report archival is asynchronous, so an S3 upload issue does not have to block the user-facing AI response.

☁️ AWS & Cloud Architecture

APEX CTRL was designed with a production-oriented AWS deployment path.

AWS Service

Purpose

Amazon ECS

Containerized backend runtime

Amazon ECR

Docker image registry

Amazon DynamoDB

Persistent session/data cache

Amazon S3

AI/report archival

AWS IAM

Access control and permissions

Amazon CloudWatch

Logs and operational monitoring

Application Load Balancer

Public routing when the ECS service is exposed

Current deployment model

The frontend is currently deployed on Vercel.

The AWS ECS environment was used as the containerized backend deployment path, but the current showcase environment is intentionally not kept continuously running to avoid unnecessary infrastructure cost.

That means:

The live product and the cloud deployment architecture are intentionally separated.

This keeps the public demo available while avoiding unnecessary always-on AWS expenditure during the Early Access/showcase stage.

⚛️ Frontend

The frontend is built using:

React

TypeScript

Vite

Tailwind CSS

Framer Motion

Lucide React

React Markdown

The frontend is responsible for:

Race Control Center

Dashboard views

Session state

Telemetry visualisation

Driver comparison

AI Strategist UI

Lap analysis

Weather

Tyre analysis

Replay

Authentication

Responsive presentation

Backend availability handling

🟢 Backend

The backend uses:

Node.js

Express.js

TypeScript

REST APIs

OpenF1 integration

DynamoDB caching

Gemini orchestration

S3 archival

CORS

Environment-based configuration

Its role is to keep external services, data orchestration, caching and AI operations away from the browser wherever appropriate.

🔐 Authentication

APEX CTRL uses:

Firebase Authentication + Google Sign-In

Authentication is separated from the race-data pipeline so identity management does not become tightly coupled to OpenF1, Gemini or AWS data services.

🐳 Containerisation & CI/CD

The backend is containerized for cloud deployment.

Deployment concept

Git Push
   │
   ▼
GitHub
   │
   ▼
GitHub Actions
   │
   ├── Build
   ├── Docker Image
   ├── Push → Amazon ECR
   │
   ▼
Amazon ECS
   │
   ▼
CloudWatch

The frontend is connected to Vercel for its deployment workflow.

🧰 Technology Stack

Frontend

React · TypeScript · Vite · Tailwind CSS · Framer Motion

Backend

Node.js · Express.js · TypeScript

Data & Analytics

OpenF1 · Python · Pandas · NumPy · Plotly · scikit-learn

AI

Google Gemini

Authentication

Firebase Authentication · Google Sign-In

Cloud

Amazon ECS · Amazon ECR · DynamoDB · S3 · IAM · CloudWatch

DevOps

Docker · GitHub Actions · Vercel

📁 Project Structure

The project follows a frontend/backend separation so the application can be developed and deployed as independent layers.

F1-apex-ctrl/
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── vite.config.ts
│   └── ...
│
├── backend/
│   ├── controllers/
│   ├── services/
│   ├── analytics/
│   ├── api/
│   ├── config/
│   ├── utils/
│   ├── server.ts
│   ├── package.json
│   ├── Dockerfile
│   └── ...
│
├── docker-compose.yml
├── .gitignore
└── README.md

The exact internal files can evolve as the platform grows. The architectural boundary between the frontend and backend is intentional.

🚀 Running Locally

Prerequisites

Recommended:

Node.js 18+

npm

Python 3.10+

Git

Docker Desktop — optional for container testing

1. Clone

git clone https://github.com/jeethujee78-afk/F1-apex-ctrl.git
cd F1-apex-ctrl

2. Frontend

cd frontend
npm install
npm run dev

3. Backend

Open another terminal:

cd backend
npm install
npm run dev

4. Python environment

For the Python/Streamlit components:

cd backend
python -m venv .venv

Windows

.venv\Scripts\activate

macOS / Linux

source .venv/bin/activate

Then:

pip install -r requirements.txt

Run the Streamlit entry point defined by the current backend configuration.

🔑 Environment Variables

Never commit real credentials or API keys.

Use the project's environment-example files as the source for the variables required by the current release.

A typical local frontend configuration may contain:

VITE_API_BASE_URL=http://localhost:3000

A backend environment may contain values such as:

PORT=3000
GEMINI_API_KEY=your_key_here
AWS_REGION=your_region

Firebase configuration belongs in the frontend environment configuration used by the project.

Never commit

.env
.env.local
.env.production
AWS credentials
API keys
Firebase private credentials
service-account files

🐳 Docker

Build the containerized environment:

docker compose build

Run:

docker compose up

The resulting backend image can be pushed to Amazon ECR and deployed through ECS according to the configured AWS environment.

📸 Product Gallery

Add the final production screenshots to docs/ and uncomment the gallery below.

docs/
├── dashboard.png
├── live-timing.png
├── telemetry.png
├── ai-strategist.png
├── driver-comparison.png
├── weather.png
├── tyre-analysis.png
└── replay.png

Suggested README gallery:

![APEX CTRL Dashboard](docs/dashboard.png)

![AI Race Strategist](docs/ai-strategist.png)

![Telemetry Diagnostics](docs/telemetry.png)

![Cinematic Replay](docs/replay.png)

🎬 Product Demo

APEX CTRL — Launch Film

AI-powered Formula 1 race intelligence, demonstrated through the real application.

Add the final launch-film URL here after publishing:

YOUR_VIDEO_LINK

Live application

https://f1-apex-ctrl.vercel.app/

🧭 Roadmap

APEX CTRL is an Early Access release. The current platform establishes the foundation for a larger race-intelligence system.

🔵 Current

Race Control Center

Session-aware race experience

OpenF1 integration

Telemetry visualisation

Live/session timing

Driver comparison

Lap analysis

AI Race Strategist

Weather Intelligence

Tyre Analysis

Cinematic Replay

Google authentication

Caching and rate-limit resilience

Containerized backend architecture

AWS deployment path

🟣 Next

Deeper predictive strategy

More advanced AI race reasoning

Expanded historical analysis

More advanced driver/team comparisons

Additional telemetry intelligence

Expanded race-intelligence modules

Further performance and scalability improvements

📊 Engineering Principles

APEX CTRL follows a few principles throughout the architecture:

01 — Real data over fake data

Where the application expects race data, it should come from the available data pipeline rather than being silently replaced with invented values.

02 — Explain the data

Charts are useful.

Context is better.

03 — Fail gracefully

External APIs, AI providers and cloud services can fail. The application should degrade gracefully instead of collapsing completely.

04 — Separate the layers

Frontend, backend, data, AI and infrastructure have distinct responsibilities.

05 — Build for the next version

The Early Access release is intentionally modular so deeper intelligence can be added without rebuilding the entire platform.

⚠️ Current Limitations

APEX CTRL is an Early Access product.

External data availability depends on OpenF1/session coverage.

AI output is analytical assistance and is not official team strategy.

Backend-dependent capabilities require the backend to be available.

The public showcase does not keep the AWS ECS environment continuously running.

Advanced predictive and intelligence capabilities are planned for future releases.

🏎️ Why APEX CTRL?

Most dashboards stop at:

"Here is the data."

APEX CTRL aims to move one step further:

"Here is the data. Here is the context. Here is what it may mean."

That is the product idea behind APEX CTRL.

🔗 Links





🌐 Live Application

https://f1-apex-ctrl.vercel.app/

💻 GitHub Repository

https://github.com/jeethujee78-afk/F1-apex-ctrl

🏁 OpenF1

https://openf1.org/

🤖 Google Gemini

https://ai.google.dev/

☁️ AWS

https://aws.amazon.com/

⚖️ Disclaimer

APEX CTRL is an independent Formula 1 data-analysis and technology project.

It is not affiliated with, endorsed by, or sponsored by Formula 1, the FIA, or any Formula 1 team.

Formula 1 names, team names, driver names, logos and related marks remain the property of their respective owners.

AI-generated insights are provided for informational and analytical purposes only.

🙏 Built With

APEX CTRL brings together technologies and platforms including:

React & Vite

Node.js & Express

OpenF1

Google Gemini

Firebase Authentication

Python analytics

Docker

GitHub Actions

Amazon Web Services

Vercel

<div align="center">

🏁 APEX CTRL

See the race. Understand the data. Find the intelligence.

Early Access

More race intelligence is coming.

<br/>

Built by Jeethu G

🌐 Live Demo ·💻 GitHub

</div>
