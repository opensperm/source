
# Opensperm Source

A landing + dashboard for deploying private AI agents on dedicated GPUs (RunPod) with Ollama and Open WebUI. Auth uses Privy; backend is Next.js API routes backed by Postgres.

[![CI](https://github.com/opensperm/source/actions/workflows/ci.yml/badge.svg)](https://github.com/opensperm/source/actions/workflows/ci.yml)

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
# Optional: enable shared rate limit store
REDIS_URL=redis://user:pass@host:6379/0
# Optional: error tracking (set DSN to enable Sentry)
SENTRY_DSN=https://examplePublicKey@o0.ingest.sentry.io/0
# Optional: pin Open WebUI and verify installers
OPENWEBUI_VERSION=0.3.x
OLLAMA_INSTALL_SHA256=...
NODE_SETUP_SHA256=...
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
- `npm run typecheck` — TS type checking
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
- Missing or invalid env vars will break deploy/status flows; set all three (`DATABASE_URL`, `RUNPOD_API_KEY`, `NEXT_PUBLIC_PRIVY_APP_ID`). Use least-privilege DB credentials (schema-limited) and do not expose `DATABASE_URL` in UI/logs.
- RunPod startup script lives inline in `app/api/agents/deploy`; it installs Ollama, pulls the chosen model, and launches Open WebUI on port 4000 with Ollama at 11434. You can pin Open WebUI and verify installer checksums via env vars.
- Tailwind 4 is used (no `tailwind.config.js`); styles are largely utility-first with a few custom classes.
- Default port is 5000 for both dev and start.
