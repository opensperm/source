import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';
import { z } from 'zod';
import { captureError } from '@/lib/telemetry';
import { getRequestId } from '@/lib/logger';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const RUNPOD_API_KEY = process.env.RUNPOD_API_KEY!;
const RUNPOD_GQL = 'https://api.runpod.io/graphql';

const GPU_MAP: Record<string, string> = {
  'rtx3070': 'NVIDIA GeForce RTX 3070',
  'rtx3080': 'NVIDIA GeForce RTX 3080',
  'rtx3090': 'NVIDIA GeForce RTX 3090',
  'rtx4070ti': 'NVIDIA GeForce RTX 4070 Ti',
  'rtx4080': 'NVIDIA GeForce RTX 4080',
  'rtx4090': 'NVIDIA GeForce RTX 4090',
  'rtx5090': 'NVIDIA GeForce RTX 5090',
  'a40': 'NVIDIA A40',
  'rtx-a5000': 'NVIDIA RTX A5000',
};

const LLM_OLLAMA_MAP: Record<string, string> = {
  'qwen3-8b': 'qwen3:8b',
  'phi4-mini': 'phi4-mini',
  'llama3-8b': 'llama3.1:8b',
};

const deploySchema = z.object({
  agentId: z.union([z.string(), z.number()]),
});

async function gql(query: string) {
  const res = await fetch(RUNPOD_GQL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${RUNPOD_API_KEY}`,
    },
    body: JSON.stringify({ query }),
  });
  return res.json();
}

export async function POST(req: NextRequest) {
  try {
    let body: unknown;
    try {
      body = await req.json();
    } catch (err) {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400, headers: { 'X-Request-ID': getRequestId(req) } });
    }

    const parsed = deploySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payload', details: parsed.error.flatten() }, { status: 400, headers: { 'X-Request-ID': getRequestId(req) } });
  }
  const agentId = parsed.data.agentId;

  const agentRes = await pool.query('SELECT * FROM agents WHERE id = $1 LIMIT 1', [agentId]);
  if (!agentRes.rows.length) return NextResponse.json({ error: 'Agent not found' }, { status: 404, headers: { 'X-Request-ID': getRequestId(req) } });
  const agent = agentRes.rows[0];

  const gpuTypeId = GPU_MAP[agent.gpu_instance] || 'NVIDIA GeForce RTX 3090';
  const ollamaModel = LLM_OLLAMA_MAP[agent.llm_model] || 'qwen3:8b';
  const deployId = agent.deploy_id;

  // Startup script: install Ollama + OpenClaw, pull model, start services
  const startupScript = [
    '#!/bin/bash',
    'set -euo pipefail',
    'export DEBIAN_FRONTEND=noninteractive',
    '# Install Ollama',
    'curl -fsSL --retry 3 --max-time 120 https://ollama.ai/install.sh -o /tmp/ollama_install.sh',
    'bash /tmp/ollama_install.sh',
    'ollama serve &',
    'sleep 5',
    `ollama pull ${ollamaModel} &`,
    '# Install Node.js 20 (pinned script)',
    'curl -fsSL --retry 3 --max-time 120 https://deb.nodesource.com/setup_20.x -o /tmp/node_setup.sh',
    'bash /tmp/node_setup.sh',
    'apt-get install -y nodejs',
    '# Install Open WebUI (Ollama frontend) via pip',
    'apt-get install -y python3-pip python3-venv',
    'python3 -m venv /opt/webui-venv',
    '/opt/webui-venv/bin/pip install --upgrade pip',
    '/opt/webui-venv/bin/pip install open-webui',
    '# Wait for model pull to finish',
    'wait',
    '# Start Open WebUI on port 4000',
    `OLLAMA_BASE_URL=http://localhost:11434 /opt/webui-venv/bin/open-webui serve --host 0.0.0.0 --port 4000 &`,
    'tail -f /dev/null',
  ].join('\n');

  const encodedScript = Buffer.from(startupScript).toString('base64');

  const mutation = `
    mutation {
      podFindAndDeployOnDemand(input: {
        name: "${agent.name}-${deployId}"
        imageName: "runpod/base:0.4.0-cuda11.8.2"
        gpuTypeId: "${gpuTypeId}"
        cloudType: ALL
        gpuCount: 1
        volumeInGb: 30
        containerDiskInGb: 30
        minMemoryInGb: 16
        minVcpuCount: 4
        ports: "4000/http,11434/http"
        startSsh: false
        env: [
          { key: "DEPLOY_ID", value: "${deployId}" }
          { key: "OLLAMA_MODEL", value: "${ollamaModel}" }
          { key: "STARTUP_SCRIPT_B64", value: "${encodedScript}" }
        ]
        dockerArgs: "bash -c 'echo $STARTUP_SCRIPT_B64 | base64 -d | bash'"
      }) {
        id
        name
        desiredStatus
        imageName
      }
    }
  `;

  const result = await gql(mutation);

  if (result.errors?.length) {
    const msg = result.errors[0].message;
    console.error('RunPod error:', msg);
    return NextResponse.json({ error: msg }, { status: 400, headers: { 'X-Request-ID': getRequestId(req) } });
  }

  const pod = result.data?.podFindAndDeployOnDemand;
  if (!pod) return NextResponse.json({ error: 'Pod creation failed' }, { status: 500, headers: { 'X-Request-ID': getRequestId(req) } });

  // RunPod provides a real public URL for each exposed port
  const realAgentUrl = `https://${pod.id}-4000.proxy.runpod.net`;

  // Save pod ID and real agent URL in DB
  await pool.query(
    'UPDATE agents SET status = $1, pod_id = $2, agent_url = $3, booting_started_at = NOW() WHERE id = $4',
    ['booting', pod.id, realAgentUrl, agentId]
  );

  return NextResponse.json({ success: true, podId: pod.id, agentUrl: realAgentUrl }, { headers: { 'X-Request-ID': getRequestId(req) } });
  } catch (err) {
    const eventId = captureError(err, {
      req,
      tags: { route: 'agents/deploy' },
    });
    console.error('[deploy] error', err);
    return NextResponse.json(
      { error: 'Internal error', requestId: getRequestId(req), eventId },
      { status: 500, headers: { 'X-Request-ID': getRequestId(req) } }
    );
  }
}
