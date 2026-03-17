import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function GET(req: NextRequest) {
  const deployId = req.nextUrl.searchParams.get('deployId');
  const platform = req.nextUrl.searchParams.get('platform') || 'mac';

  if (!deployId) return NextResponse.json({ error: 'Missing deployId' }, { status: 400 });

  const result = await pool.query(
    'SELECT * FROM agents WHERE deploy_id = $1 LIMIT 1',
    [deployId]
  );
  if (!result.rows.length) return NextResponse.json({ error: 'Agent not found' }, { status: 404 });

  const agent = result.rows[0];
  const model = {
    'qwen3-8b': 'qwen3:8b',
    'phi4-mini': 'phi4-mini',
    'llama3-8b': 'llama3.1:8b',
  }[agent.llm_model as string] ?? agent.llm_model;

  const agentUrl = agent.agent_url;

  if (platform === 'windows') {
    const script = `@echo off
echo ============================================
echo  Opensperm Agent Installer for Windows
echo ============================================
echo.

echo [1/4] Installing OpenClaw...
powershell -Command "iex ((New-Object System.Net.WebClient).DownloadString('https://openclaw.ai/install.ps1'))"

echo [2/4] Installing Ollama...
powershell -Command "iex ((New-Object System.Net.WebClient).DownloadString('https://ollama.ai/install.ps1'))"

echo [3/4] Pulling model ${model}...
ollama pull ${model}

echo [4/4] Starting your Opensperm agent...
openclaw onboard --model ollama/${model} --deploy-id ${deployId} --tunnel-url https://${agentUrl}

echo.
echo  Agent is live at: https://${agentUrl}
pause
`;
    return new NextResponse(script, {
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename="opensperm-install.bat"`,
      },
    });
  }

  if (platform === 'linux') {
    const script = `#!/usr/bin/env bash
set -e

echo "============================================"
echo " Opensperm Agent Installer for Linux"
echo "============================================"
echo

echo "[1/4] Installing OpenClaw..."
curl -fsSL https://openclaw.ai/install.sh | bash

echo "[2/4] Installing Ollama..."
curl -fsSL https://ollama.ai/install.sh | sh

echo "[3/4] Pulling model ${model}..."
ollama pull ${model}

echo "[4/4] Starting your Opensperm agent..."
openclaw onboard --model ollama/${model} --deploy-id ${deployId} --tunnel-url https://${agentUrl}

echo
echo " Agent is live at: https://${agentUrl}"
`;
    return new NextResponse(script, {
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename="opensperm-install.sh"`,
      },
    });
  }

  // macOS (.command = double-clickable in Finder)
  const script = `#!/usr/bin/env bash
set -e

echo "============================================"
echo " Opensperm Agent Installer for macOS"
echo "============================================"
echo

echo "[1/4] Installing OpenClaw..."
curl -fsSL https://openclaw.ai/install.sh | bash

echo "[2/4] Installing Ollama..."
curl -fsSL https://ollama.ai/install.sh | sh

echo "[3/4] Pulling model ${model}..."
ollama pull ${model}

echo "[4/4] Starting your Opensperm agent..."
openclaw onboard --model ollama/${model} --deploy-id ${deployId} --tunnel-url https://${agentUrl}

echo
echo " Agent is live at: https://${agentUrl}"
echo " Press any key to close..."
read -n 1
`;
  return new NextResponse(script, {
    headers: {
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': `attachment; filename="opensperm-install.command"`,
    },
  });
}
