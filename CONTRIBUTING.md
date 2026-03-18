# Contributing

## Setup
1. `cp .env.example .env.local` and fill required values.
2. `npm install`
3. Development: `npm run dev`

## Checks (run before PR)
- `npm run lint`
- `npm run typecheck`
- `npm run build`

## Branch & PR
- Main is protected; push to a feature branch and open a PR.
- Keep changes small and described in the PR body.
- Include screenshots for UI changes when relevant.

## Security
- Do not commit secrets. Use `.env.local` (gitignored).
- If you find a vulnerability, follow `SECURITY.md`.
