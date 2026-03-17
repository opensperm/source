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
