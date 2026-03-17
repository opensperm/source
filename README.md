
# Opensperm Source

A landing + dashboard for deploying private AI agents on dedicated GPUs (RunPod) with Ollama and Open WebUI. Auth uses Privy; backend is Next.js API routes backed by Postgres.

## Architecture (what happens)
- **Frontend**: Next.js 15 / React 19, Tailwind CSS 4. Pages live in `app/`. Components for hero/deploy cards/etc. in `components/`.
- **Auth**: Privy email auth (`NEXT_PUBLIC_PRIVY_APP_ID`) via `components/PrivyProvider`.
- **State + data**: Agents stored in Postgres (`DATABASE_URL`) and served via API routes under `app/api/agents/*` and `app/api/installer`.
- **Compute**: RunPod GraphQL is used to spin up GPU pods. Startup script installs Ollama, pulls model, and boots Open WebUI.
- **Runtime target**: Pods expose 11434 (Ollama) and 4000 (Open WebUI) via RunPod proxy; UI displays the public URL.

## Folders
- `app/` — Next.js app router pages and API routes
  - `app/api/agents/*` — CRUD + deploy + status for agents
  - `app/api/installer` — helper installer endpoint
- `components/` — UI pieces (hero, deploy modal, cards, etc.)
- `hooks/`, `lib/`, `types/` — utilities and typings

## Requirements
- Node.js 20+
- Postgres instance reachable via `DATABASE_URL`
- RunPod API key (`RUNPOD_API_KEY`)
- Privy app ID (`NEXT_PUBLIC_PRIVY_APP_ID`)

## Environment variables (`.env.local`)
```
DATABASE_URL=postgres://user:pass@host:5432/dbname
RUNPOD_API_KEY=your_runpod_api_key
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id
```

## Quickstart (local)
```bash
npm install
npm run dev   # http://localhost:5000
```

## Scripts
- `npm run dev` — start dev server (port 5000)
- `npm run build` — production build
- `npm run start` — serve built app
- `npm run lint` — ESLint
- `npm run clean` — clear Next.js cache

## Core flows
- **Auth flow**: Privy widget handles email sign-in. When authenticated, UI shows agent list for the user email.
- **Agent listing**: `/api/agents?email=...` fetches agents from Postgres; UI renders cards.
- **Deploy flow** (`app/api/agents/deploy`):
  1) Read agent by `agentId` from Postgres.
  2) Map requested GPU + LLM to RunPod and Ollama model.
  3) Build startup script (install Ollama, pull model, install Open WebUI, start both).
  4) Call RunPod GraphQL `podFindAndDeployOnDemand` with script (base64) and ports 11434/4000 exposed.
  5) Persist `pod_id`, `agent_url` (RunPod proxy), status `booting`, `booting_started_at` in DB.
- **Status flow** (`app/api/agents/status`): poll RunPod for pod status; update DB.
- **Auto-shutdown** (`app/api/agents/auto-shutdown`): stops pods when criteria met.
- **Destroy** (`app/api/agents/route` DELETE): remove pod + DB row (see API for details).

## API reference (high level)
- `GET /api/agents?email=` — list agents for user
- `POST /api/agents` — create agent (expects email/name/config)
- `DELETE /api/agents?id=` — delete agent
- `POST /api/agents/deploy` — deploy an agent to RunPod
- `GET /api/agents/status?id=` — fetch + update pod status
- `POST /api/agents/auto-shutdown` — shutdown policy hook
- `GET /api/agents/ping` — health check
- `GET /api/agents/single?id=` — fetch single agent
- `POST /api/installer` — installer helper

## Notes
- Missing or invalid env vars will break deploy/status flows; set all three (`DATABASE_URL`, `RUNPOD_API_KEY`, `NEXT_PUBLIC_PRIVY_APP_ID`).
- RunPod startup script lives inline in `app/api/agents/deploy`; it installs Ollama, pulls the chosen model, and launches Open WebUI on port 4000 with Ollama at 11434.
- Tailwind 4 is used (no `tailwind.config.js`); styles are largely utility-first with a few custom classes.
- Default port is 5000 for both dev and start.
# Opensperm

Private AI agent infrastructure platform. Next.js 15 app running on port 5000.

## Stack

- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS v4
- **Animation:** Motion (Framer Motion)
- **Auth:** Privy (`@privy-io/react-auth`) — email login only
- **Database:** PostgreSQL (Replit built-in) via `pg`
- **Fonts:** Space Grotesk (sans), Henny Penny (display), Creepster

## Key Files

- `app/layout.tsx` — Root layout, wraps everything in PrivyProvider
- `app/page.tsx` — Home page (Navbar, Hero, Modules, Features, Demo, Integrations, Footer)
- `app/docs/` — Documentation pages with sidebar layout
- `app/blogs/page.tsx` — Blog listing page
- `app/api/agents/route.ts` — CRUD API for agents (GET, POST, PATCH, DELETE)
- `components/PrivyProvider.tsx` — Privy auth provider
- `components/Hero.tsx` — Main hero with agent dashboard (auth-gated)
- `components/DeployModal.tsx` — Agent creation form popup
- `components/BootingCard.tsx` — Animated boot progress card with steps, log, and OpenClaw dashboard link
- `components/Navbar.tsx` — Responsive navbar with hamburger mobile menu
- `components/Footer.tsx` — Footer with real auth account button

## Environment Variables

- `NEXT_PUBLIC_PRIVY_APP_ID=cmmt6mqpv022a0cjwqaf1n1os` — Privy app ID
- `DATABASE_URL` — PostgreSQL connection (auto-managed by Replit)

## Database Schema

```sql
CREATE TABLE agents (
  id SERIAL PRIMARY KEY,
  user_email VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  llm_model VARCHAR(50) DEFAULT 'qwen3-8b',
  gpu_instance VARCHAR(50) DEFAULT 'l4',
  status VARCHAR(20) DEFAULT 'stopped',  -- booting | running | stopped | destroyed
  agent_url VARCHAR(255),               -- e.g. agent-abc123.opensperm.pro
  deploy_id VARCHAR(50),
  booting_started_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Auth Flow

1. User clicks "Deploy Agent" or "Sign in with Email"
2. Privy email OTP modal appears
3. After login → `user.email.address` is the identifier
4. Agents are fetched from DB filtered by email
5. Footer and navbar show logged-in email + logout button

## Agent Deploy Flow

1. User fills DeployModal (name, description, LLM model, GPU)
2. POST `/api/agents` → creates agent with `status: 'booting'`, generates `agent_url` and `deploy_id`
3. BootingCard animates ~30s boot sequence (Cloudflare Tunnel, DNS, GPU, Ollama + OpenClaw, gateway)
4. After sequence → PATCH `/api/agents` updates status to `running`
5. Card shows "Settings" and "Open Dashboard" buttons (dashboard = agent's OpenClaw URL)

## Custom Images

- `/public/logo.png` — Navbar logo (angry ghost)
- `/public/ghost-icon.png` — Happy ghost (hero, features, footer, docs)
- `/public/ghost-gpu.png` — GPU ghost (Agent Pods module)
- `/public/ghost-angry.png` — Angry ghost (Agent Runtime module)
- `/public/ghost-laptop.png` — Laptop ghost (Agent Models module)

## Privy Dashboard

App ID: `cmmt6mqpv022a0cjwqaf1n1os`
Allowed origin: `https://37bec7ab-105e-4556-943d-4f8fe57af840-00-mzl412s9llsf.janeway.replit.dev`
