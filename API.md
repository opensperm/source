# API Overview

All endpoints live under `app/api/agents/*` unless noted. Responses are JSON.

## Authentication
Auth is via Privy on the frontend; backend trusts requests (no bearer token). If you add auth, gate these routes accordingly.

## Endpoints

### GET /api/agents?email={email}
List agents for a user.
- **Query**: `email`
- **Response**: `{ agents: Agent[] }`

### POST /api/agents
Create an agent.
- **Body**: `{ email, name, description?, llm_model, gpu_instance }`
- **Response**: `{ agent }`

### GET /api/agents/single?id={id}
Fetch a single agent.
- **Query**: `id`
- **Response**: `{ agent }`

### DELETE /api/agents?id={id}
Delete an agent (and terminate pod if applicable).
- **Query**: `id`
- **Response**: `{ success: boolean }`

### POST /api/agents/deploy
Deploy an agent to RunPod.
- **Body**: `{ agentId }`
- **Response**: `{ podId, agent_url, status }` (status starts as `booting`)

### GET /api/agents/status?id={id}
Poll pod status and update DB.
- **Query**: `id`
- **Response**: `{ podReady: boolean, status: string, agent_url?: string }`

### POST /api/agents/auto-shutdown
Apply shutdown policy to idle pods.
- **Body**: `{}` (policy is server-side)
- **Response**: `{ stopped: string[] }` (ids/urls)

### POST /api/agents/ping
Keep-alive hook (resets idle timer).
- **Body**: `{ agentId }`
- **Response**: `{ ok: true }`

### POST /api/installer
Installer helper for agents (details in route implementation).

## Status values
- `booting`, `running`, `stopped`



## Examples
### Create agent
Request:
```http
POST /api/agents
Content-Type: application/json

{
  "email": "user@example.com",
  "name": "My Agent",
  "description": "Test agent",
  "llm_model": "llama3-8b",
  "gpu_instance": "rtx4090"
}
```

Response (200):
```json
{
  "agent": {
    "id": 1,
    "name": "My Agent",
    "status": "stopped",
    "llm_model": "llama3-8b",
    "gpu_instance": "rtx4090"
  }
}
```

### Deploy agent
Request:
```http
POST /api/agents/deploy
Content-Type: application/json

{ "agentId": 1 }
```

Response (200):
```json
{
  "podId": "pod-123",
  "agent_url": "https://proxy.runpod.example/1234",
  "status": "booting"
}
```

### Status poll
Request:
```http
GET /api/agents/status?id=1
```

Response (200):
```json
{
  "podReady": true,
  "status": "running",
  "agent_url": "https://proxy.runpod.example/1234"
}
```

## Errors
- 400/404 for invalid agent id
- 500 for RunPod/API errors (check logs)

## Env dependencies
- `DATABASE_URL`, `RUNPOD_API_KEY`, `NEXT_PUBLIC_PRIVY_APP_ID`
- Optional: `REDIS_URL`, `SENTRY_DSN`, version pins for OpenWebUI/installer
