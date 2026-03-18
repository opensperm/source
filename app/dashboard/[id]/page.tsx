'use client';
import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, RefreshCw, Loader2 } from 'lucide-react';

interface Agent {
  id: number;
  name: string;
  description: string;
  llm_model: string;
  gpu_instance: string;
  status: string;
  agent_url: string;
  deploy_id: string;
  booting_started_at: string;
  created_at: string;
}

const LLM_DISPLAY: Record<string, string> = {
  'qwen3-8b': 'Qwen 3 8B',
  'phi4-mini': 'Phi-4 Mini',
  'llama3-8b': 'Llama 3.1 8B',
};

const GPU_DISPLAY: Record<string, string> = {
  'rtx3070': 'RTX 3070',
  'rtx3080': 'RTX 3080',
  'rtx3090': 'RTX 3090',
  'rtx4070ti': 'RTX 4070 Ti',
  'rtx4080': 'RTX 4080',
  'rtx4090': 'RTX 4090',
  'rtx5090': 'RTX 5090',
  'a40': 'A40',
  'rtx-a5000': 'RTX A5000',
};

export default function DashboardPage() {
  const { id } = useParams<{ id: string }>();
  const [agent, setAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(true);
  const [agentOnline, setAgentOnline] = useState(false);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    async function loadAgent() {
      try {
        const res = await fetch(`/api/agents/single?id=${id}`);
        const data = await res.json();
        if (data.agent) {
          setAgent(data.agent);
          if (data.agent.status === 'running') setAgentOnline(true);
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }
    loadAgent();
  }, [id]);

  const refreshAgent = useCallback(async () => {
    const res = await fetch(`/api/agents/single?id=${id}`);
    const data = await res.json();
    if (data.agent) {
      setAgent(data.agent);
      if (data.agent.status === 'running') setAgentOnline(true);
    }
  }, [id]);

  // Ping server every 5 minutes to keep agent alive (resets idle timer)
  const pingActive = useCallback(async () => {
    if (!agent?.id) return;
    try {
      await fetch('/api/agents/ping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentId: agent.id }),
      });
    } catch {}
  }, [agent?.id]);

  useEffect(() => {
    if (!agent?.id || agent.status === 'stopped') return;
    pingActive();
    const interval = setInterval(pingActive, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [agent?.id, agent?.status, pingActive]);

  // Auto-poll every 15s while booting
  useEffect(() => {
    if (!agent || agent.status !== 'booting') return;
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/agents/status?agentId=${agent.id}`);
        const data = await res.json();
        if (data.podReady || data.status === 'running') {
          await refreshAgent();
          clearInterval(interval);
        }
      } catch {}
    }, 15000);
    return () => clearInterval(interval);
  }, [agent, agent?.id, agent?.status, refreshAgent]);

  async function checkOnline() {
    if (!agent) return;
    setChecking(true);
    try {
      const res = await fetch(`/api/agents/status?agentId=${agent.id}`);
      const data = await res.json();
      if (data.podReady || data.status === 'running') {
        await refreshAgent();
      } else {
        setAgentOnline(false);
      }
    } catch {
      setAgentOnline(false);
    } finally {
      setChecking(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d0618] flex items-center justify-center">
        <div className="text-white/40 text-sm">Loading agent...</div>
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="min-h-screen bg-[#0d0618] flex items-center justify-center flex-col gap-4">
        <div className="text-white/40 text-sm">Agent not found.</div>
        <Link href="/" className="text-purple-400 text-sm hover:underline">← Back to home</Link>
      </div>
    );
  }

  const isRunning = agent.status === 'running' || agentOnline;

  return (
    <div className="min-h-screen bg-[#0d0618] text-white">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0d0618]/90 backdrop-blur-sm sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-white/40 hover:text-white transition-colors">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <div className="text-white font-display tracking-wide text-sm">{agent.name}</div>
            <div className="text-white/40 text-xs mt-0.5">
              {LLM_DISPLAY[agent.llm_model] || agent.llm_model} · {GPU_DISPLAY[agent.gpu_instance] || agent.gpu_instance} · RunPod
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={checkOnline}
            disabled={checking}
            className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white border border-white/15 hover:border-white/30 px-3 py-1.5 rounded-full transition-colors"
          >
            <RefreshCw size={11} className={checking ? 'animate-spin' : ''} />
            Check status
          </button>
          <span className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border ${
            isRunning
              ? 'bg-green-500/15 border-green-500/30 text-green-400'
              : 'bg-blue-500/10 border-blue-500/20 text-blue-300'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isRunning ? 'bg-green-400 animate-pulse' : 'bg-blue-400 animate-pulse'}`} />
            {isRunning ? 'Online' : 'Booting'}
          </span>
        </div>
      </div>

      {isRunning ? (
        /* ── RUNNING: embed Open WebUI ── */
        <div className="h-[calc(100vh-61px)]">
          <iframe
            src={agent.agent_url}
            className="w-full h-full border-0"
            allow="microphone; camera"
            title="Agent Dashboard"
          />
        </div>
      ) : (
        /* ── BOOTING: cloud deploy status ── */
        <div className="max-w-2xl mx-auto px-6 py-16">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto mb-4">
              <Loader2 size={28} className="text-blue-400 animate-spin" />
            </div>
            <h2 className="text-lg font-display text-white mb-2">Setting up your cloud server</h2>
            <p className="text-white/50 text-sm leading-relaxed">
              RunPod is allocating a GPU server, installing Ollama and Open WebUI,<br />
              and pulling your model. This takes about 5–10 minutes.
            </p>
            <button
              onClick={checkOnline}
              disabled={checking}
              className="mt-6 flex items-center gap-2 text-sm text-white/60 hover:text-white border border-white/15 hover:border-white/30 px-5 py-2.5 rounded-full transition-colors mx-auto"
            >
              <RefreshCw size={13} className={checking ? 'animate-spin' : ''} />
              {checking ? 'Checking...' : 'Check if ready'}
            </button>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
            <p className="text-white/40 text-xs uppercase tracking-widest mb-4">What&apos;s happening</p>
            <div className="space-y-4">
              {[
                'RunPod allocates a dedicated GPU pod (' + (GPU_DISPLAY[agent.gpu_instance] || agent.gpu_instance) + ')',
                'Ollama installs and pulls ' + (LLM_DISPLAY[agent.llm_model] || agent.llm_model) + ' model (~3–5 GB)',
                'Open WebUI starts and connects to your Ollama instance',
                'RunPod assigns a live public URL to your server',
                'Dashboard appears here automatically when ready',
              ].map((text, i) => (
                <div key={i} className="flex items-start gap-4">
                  <span className="w-6 h-6 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-400 text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <p className="text-white/70 text-sm leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center">
            <p className="text-white/30 text-xs mb-1">Your agent URL (active when ready)</p>
            {agent.agent_url && agent.agent_url !== 'pending' ? (
              <a
                href={agent.agent_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-purple-400 hover:text-purple-300 text-sm font-mono transition-colors"
              >
                {agent.agent_url}
                <ExternalLink size={12} />
              </a>
            ) : (
              <span className="text-white/30 text-sm font-mono">Allocating URL...</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
