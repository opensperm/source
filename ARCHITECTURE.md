# Architecture

## Overview
- **Frontend**: Next.js 15 (App Router), React 19, Tailwind 4
- **Auth**: Privy email
- **Backend**: Next.js API routes
- **Data**: Postgres (`agents` table)
- **GPU runtime**: RunPod GraphQL → launches pods running Ollama + Open WebUI
- **Optional**: Redis (rate limit), Sentry (error tracking)

## Components
- `app/api/agents/*`: CRUD + deploy + status + auto-shutdown + ping
- `components/`:
  - `Hero`, `DeployModal`, `BootingCard`, `DocsSidebar`, etc.
- `lib/`:
  - `rate-limit`, `telemetry`, `logger`, `runpod` helpers (if present), etc.

## Deploy flow (detailed)
1) Client calls `POST /api/agents/deploy` with `agentId`.
2) API reads agent config from Postgres.
3) Builds startup script:
   - Installs Ollama
   - Pulls selected model (`agent.llm_model`)
   - Installs Open WebUI (port 4000)
   - Ensures Ollama on 11434
4) Calls RunPod `podFindAndDeployOnDemand` with exposed ports 11434/4000.
5) Persists `pod_id`, `agent_url` (RunPod proxy), `status=booting`, `booting_started_at`.
6) UI polls `/api/agents/status` until `podReady`; then status → `running` and shows URL.

## Auto-shutdown flow
- Trigger: scheduler (cron/heartbeat) hits `POST /api/agents/auto-shutdown`.
- API fetches agents + thresholds, queries RunPod for metrics/status.
- For idle/expired pods: call `stopPod`, update status in DB.

## Data model (agents table)
- `id`
- `email` (owner)
- `name`, `description`
- `llm_model`
- `gpu_instance`
- `deploy_id`
- `pod_id`
- `agent_url`
- `status` (booting/running/stopped)
- `booting_started_at`
- `created_at`

## Network / ports
- Ollama: 11434 (proxied by RunPod)
- Open WebUI: 4000 (proxied by RunPod)

## Runtime notes
- `PrivyProvider` skips when `NEXT_PUBLIC_PRIVY_APP_ID` is missing/dummy (for CI).
- Rate limiting uses Redis if `REDIS_URL` provided, otherwise in-memory.
- `outputFileTracingRoot` is set to repo root to avoid multi-lockfile warning.

## CI/CD snapshot
- Matrix Node 20/22: lint → typecheck → build (env dummy)
- Preview workflow builds and uploads `.next` artifact (integrate with hosting as needed)
- Dependabot: npm + GitHub Actions weekly
- Playwright smoke tests available via `npm run test:e2e` (not yet enforced in CI)
