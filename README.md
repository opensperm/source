
# Opensperm Source

Landing + dashboard for deploying private AI agents on dedicated GPUs (RunPod) with Ollama and Open WebUI. Auth uses Privy, backend is Next.js API routes backed by Postgres.

## Stack
- Next.js 15 / React 19 / TypeScript
- Tailwind CSS 4
- Privy auth
- RunPod GraphQL (GPU pods), Ollama + Open WebUI bootstrap
- Postgres via `pg`

## Requirements
- Node.js 20+
- npm (bundled) or your preferred package manager
- Access to a Postgres database
- RunPod API key
- Privy app ID

## Setup
1) Install deps
```bash
npm install
```

2) Configure env vars in `.env.local` (example)
```bash
DATABASE_URL=postgres://user:pass@host:5432/dbname
RUNPOD_API_KEY=your_runpod_api_key
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id
```

3) Run locally
```bash
npm run dev    # starts on http://localhost:5000
```

## Scripts
- `npm run dev` — Next.js dev server (port 5000)
- `npm run build` — production build
- `npm run start` — start built app
- `npm run lint` — lint with ESLint
- `npm run clean` — clear Next.js cache

## Deployment notes
- API routes expect the env vars above; missing values will break deploy flows.
- RunPod startup script installs Ollama, pulls the selected model, and starts Open WebUI on port 4000; pods expose both 11434 (Ollama) and 4000 (UI).
- Auth is email-based via Privy; without `NEXT_PUBLIC_PRIVY_APP_ID`, the UI won’t render auth correctly.
