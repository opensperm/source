# Opensperm Source

Private AI agent dashboard + landing built on Next.js. Provision GPU pods on RunPod, install Ollama + Open WebUI, and expose a simple UI for deploy/status/destroy. Auth via Privy; data in Postgres. CI enforces lint/typecheck/build across Node 20/22.

---
## Contents
- [Stack](#stack)
- [Features](#features)
- [Architecture](#architecture)
- [Diagrams](#diagrams)
- [Directory layout](#directory-layout)
- [Environment](#environment)
- [Quickstart](#quickstart)
- [Scripts](#scripts)
- [API overview](#api-overview)
- [CI/CD](#cicd)
- [Testing](#testing)
- [Docker](#docker)
- [Deploy previews](#deploy-previews)
- [Troubleshooting](#troubleshooting)

---
## Stack
- **Frontend**: Next.js 15 / React 19, Tailwind 4
- **Auth**: Privy (email)
- **Backend**: Next.js API routes, Postgres
- **GPU runtime**: RunPod GraphQL → deploy pods; installs Ollama + Open WebUI
- **Error tracking (optional)**: Sentry

## Features
- Email login (Privy) → personalized agent list
- Create/boot/destroy agents on RunPod; auto-shutdown hook
- Ollama model pull + Open WebUI bootstrap in startup script
- Status polling + logs for booting flow

## Architecture
**Flow**
1) User signs in (Privy) → fetch agents by email.
2) Deploy: API builds startup script (Ollama + Open WebUI), calls RunPod `podFindAndDeployOnDemand`, stores `pod_id`/`agent_url`/status.
3) Status: poll RunPod; update DB; UI reacts.
4) Destroy: delete pod + DB row.
5) Auto-shutdown: background endpoint to stop idle pods.

**Ports**
- Ollama: 11434 (RunPod proxy)
- Open WebUI: 4000 (RunPod proxy)

## Diagrams
### High-level architecture
```mermaid
graph TD
  U[User] -->|Auth| P[Privy]
  U --> FE[Next.js Frontend]
  FE --> API[/Next.js API Routes/]
  API --> DB[(Postgres)]
  API --> RP[RunPod GraphQL]
  RP --> POD[GPU Pod]
  POD -->|11434| Ollama
  POD -->|4000| OpenWebUI
  FE -.->|Status poll| API
```

### Deploy flow
```mermaid
sequenceDiagram
  participant User
  participant FE as Frontend
  participant API as API /agents/deploy
  participant RP as RunPod
  participant DB as Postgres
  User->>FE: Click Deploy
  FE->>API: POST agentId
  API->>DB: Read agent config
  API->>RP: podFindAndDeployOnDemand (startup script)
  RP-->>API: podId, proxy URL
  API->>DB: Persist podId, agent_url, status=booting
  API-->>FE: 200 booting
  FE->>API: Poll /status
  API->>RP: Query pod status
  RP-->>API: pod ready
  API->>DB: Update status=running
  API-->>FE: running + agent_url
```

### Integrations at a glance
- **Privy**: email auth (NEXT_PUBLIC_PRIVY_APP_ID)
- **RunPod**: GPU pods via GraphQL; ports 11434/4000
- **Ollama**: model serving inside pod
- **Open WebUI**: UI in pod
- **Sentry (opt)**: error tracking server-side
- **Redis (opt)**: shared rate limiting

## Directory layout
- `app/` — Next.js app router pages & API routes
  - `app/api/agents/*` — CRUD, deploy, status, destroy, auto-shutdown, ping
  - `app/api/installer` — installer helper
- `components/` — UI pieces (hero, deploy modal, status cards, etc.)
- `lib/`, `hooks/`, `types/` — utilities and typings
- `tests/` — Playwright smoke tests
- `.github/workflows/` — CI, typecheck, preview

## Environment
Copy `.env.example` → `.env.local` and fill the required values.
```
# Required
DATABASE_URL=postgres://user:pass@host:5432/dbname
RUNPOD_API_KEY=your_runpod_api_key
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id

# Optional
REDIS_URL=redis://user:pass@host:6379/0
SENTRY_DSN=https://examplePublicKey@o0.ingest.sentry.io/0
OPENWEBUI_VERSION=0.3.x
OLLAMA_INSTALL_SHA256=...
NODE_SETUP_SHA256=...
```

> Tip: In CI we use dummy Privy ID; `PrivyProvider` will skip if app ID is missing/dummy.

## Quickstart
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
- `npm run test:e2e` — Playwright smoke tests
- `npm run clean` — clear Next.js cache

## API overview (high level)
- `GET /api/agents?email=` — list agents for user
- `POST /api/agents` — create agent (expects email/name/config)
- `DELETE /api/agents?id=` — delete agent
- `POST /api/agents/deploy` — deploy agent to RunPod
- `GET /api/agents/status?id=` — poll RunPod + update DB
- `POST /api/agents/auto-shutdown` — shutdown policy hook
- `GET /api/agents/ping` — keep-alive hook
- `GET /api/agents/single?id=` — fetch one agent
- `POST /api/installer` — installer helper

## CI/CD
- **CI**: `.github/workflows/ci.yml`
  - Matrix Node 20/22
  - npm ci → Next cache restore → lint → typecheck → build (env dummy)
- **Typecheck**: `.github/workflows/typecheck.yml`
  - Matrix Node 20/22
  - npm ci → Next cache → typecheck → build (env dummy)
- **Preview**: `.github/workflows/preview.yml`
  - Builds and uploads `.next` artifact (placeholder to integrate hosting deploy)
- **Dependabot**: npm + GitHub Actions weekly
- **CODEOWNERS**: `@opensperm` owns all paths

## Testing
- **Playwright smoke**: `npm run test:e2e`
  - Config: `playwright.config.ts`
  - Tests: `tests/smoke.spec.ts` (home, docs load)

## Docker
Basic production image:
```bash
docker build -t opensperm-app .
docker run -p 3000:3000 \
  -e DATABASE_URL=... \
  -e RUNPOD_API_KEY=... \
  -e NEXT_PUBLIC_PRIVY_APP_ID=... \
  opensperm-app
```
Image uses `npm ci --omit=dev` and `npm run start` after `npm run build`.

## Deploy previews
`preview.yml` uploads the `.next` build artifact. Integrate your host (e.g., Vercel action, Netlify, Render) by replacing the placeholder step with your deploy action/token.

## Troubleshooting
- **Privy app ID invalid**: Set `NEXT_PUBLIC_PRIVY_APP_ID` (non-dummy) in env. In CI it’s intentionally dummy; provider skips when dummy.
- **RunPod deploy fails**: Ensure `RUNPOD_API_KEY` valid and GPU/LLM mapping exists; check startup script in `app/api/agents/deploy`.
- **Postgres connection**: Verify `DATABASE_URL`; use least-privilege creds; allow network from runtime.
- **Next build warning (opentelemetry)**: Comes from `@sentry/node` dep; safe to ignore unless you enable Sentry. Set Sentry DSN only in prod.
- **Cache root warning**: If using multiple lockfiles, set `outputFileTracingRoot` in `next.config.js` to the repo root.

---
Happy hacking. For contributions, see [CONTRIBUTING.md](./CONTRIBUTING.md). For security issues, see [SECURITY.md](./SECURITY.md).
