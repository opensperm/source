'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { CheckCircle2, Circle, Loader2, ExternalLink, Trash2, AlertCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const BOOT_STEPS = [
  { label: 'Allocating GPU on RunPod', duration: 8000 },
  { label: 'Installing Ollama on server', duration: 10000 },
  { label: 'Pulling LLM model', suffix: '~3–5 min', duration: 30000 },
  { label: 'Starting Open WebUI', duration: 8000 },
  { label: 'Waiting for pod to be reachable', duration: 4000 },
];

const TOTAL_BOOT_MS = BOOT_STEPS.reduce((a, s) => a + s.duration, 0);

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

const LLM_DISPLAY: Record<string, string> = {
  'qwen3-8b': 'qwen3:8b',
  'phi4-mini': 'phi4-mini',
  'llama3-8b': 'llama3.1:8b',
};

// Auto-shutdown after 2 hours of inactivity — ping server every 5 min to reset timer
const PING_INTERVAL_MS = 5 * 60 * 1000;

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

interface Props {
  agent: Agent;
  onStatusChange: (id: number, status: string) => void;
  onDestroy: (id: number) => void;
}

export function BootingCard({ agent, onStatusChange, onDestroy }: Props) {
  const [progress, setProgress] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const [done, setDone] = useState(agent.status === 'running');
  const [logLines, setLogLines] = useState<string[]>([]);
  const [logOpen, setLogOpen] = useState(false);
  const [deployError, setDeployError] = useState('');
  const [destroying, setDestroying] = useState(false);
  const completedRef = useRef(false);
  const deployedRef = useRef(false);
  const pollRef = useRef<NodeJS.Timeout | null>(null);
  const pingRef = useRef<NodeJS.Timeout | null>(null);

  const isBooting = agent.status === 'booting';

  const addLog = useCallback((line: string) => {
    setLogLines(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${line}`]);
  }, []);

  // Ping the server to reset idle timer while agent is in use
  const pingActive = useCallback(async () => {
    try {
      await fetch('/api/agents/ping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentId: agent.id }),
      });
    } catch {}
  }, [agent.id]);

  // Start ping interval when agent is running or booting
  useEffect(() => {
    pingActive(); // ping immediately on mount
    pingRef.current = setInterval(pingActive, PING_INTERVAL_MS);
    return () => { if (pingRef.current) clearInterval(pingRef.current); };
  }, [pingActive]);

  // Trigger real RunPod deploy on mount if booting and no pod yet
  useEffect(() => {
    if (!isBooting || deployedRef.current) return;
    deployedRef.current = true;

    async function triggerDeploy() {
      addLog('Requesting GPU pod from RunPod...');
      try {
        const res = await fetch('/api/agents/deploy', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ agentId: agent.id }),
        });
        const data = await res.json();
        if (!res.ok || data.error) {
          setDeployError(data.error || 'Failed to allocate GPU');
          addLog('Error: ' + (data.error || 'Failed to allocate GPU'));
          return;
        }
        addLog('Pod allocated — ID: ' + data.podId);
        addLog('Installing Ollama + Open WebUI on server...');
      } catch {
        setDeployError('Network error contacting RunPod');
        addLog('Network error. Please check your connection.');
      }
    }
    triggerDeploy();
  }, []);

  // Poll RunPod status until running — also checks auto-shutdown eligibility
  useEffect(() => {
    if (done || !isBooting) return;

    function pollStatus() {
      pollRef.current = setInterval(async () => {
        try {
          const res = await fetch(`/api/agents/status?agentId=${agent.id}`);
          const data = await res.json();
          if (data.podReady) {
            clearInterval(pollRef.current!);
            finishBoot();
          }
        } catch {}
      }, 10000);
    }
    pollStatus();
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [done, isBooting]);

  // Animated progress + steps (visual only)
  useEffect(() => {
    if (!isBooting || completedRef.current) return;

    const bootedAt = new Date(agent.booting_started_at).getTime();
    const elapsed = Date.now() - bootedAt;
    const startProgress = Math.min((elapsed / TOTAL_BOOT_MS) * 100, 95);
    setProgress(startProgress);

    let acc = 0;
    let currentStep = 0;
    for (let i = 0; i < BOOT_STEPS.length; i++) {
      if (elapsed < acc + BOOT_STEPS[i].duration) { currentStep = i; break; }
      acc += BOOT_STEPS[i].duration;
      currentStep = i + 1;
    }
    setStepIndex(Math.min(currentStep, BOOT_STEPS.length - 1));

    const remaining = TOTAL_BOOT_MS - elapsed;
    if (remaining <= 0) return;

    const progressInterval = setInterval(() => {
      setProgress(p => {
        const newP = p + (95 / (TOTAL_BOOT_MS / 100));
        if (newP >= 95) { clearInterval(progressInterval); return 95; }
        return newP;
      });
    }, 100);

    let stepAcc = 0;
    for (let i = 0; i < currentStep; i++) stepAcc += BOOT_STEPS[i].duration;
    const stepTimers: NodeJS.Timeout[] = [];
    for (let i = currentStep; i < BOOT_STEPS.length; i++) {
      const delay = stepAcc - elapsed + BOOT_STEPS.slice(currentStep, i).reduce((a, s) => a + s.duration, 0);
      stepTimers.push(setTimeout(() => setStepIndex(i + 1), Math.max(0, delay)));
    }

    const logMessages = [
      'Connecting to RunPod API...',
      'Searching for available ' + (GPU_DISPLAY[agent.gpu_instance] || 'GPU') + '...',
      'Pod allocated — starting container...',
      'Container running, installing dependencies...',
      'Installing Ollama runtime...',
      'ollama pull ' + (LLM_DISPLAY[agent.llm_model] || agent.llm_model) + '...',
      'Model layers downloading...',
      'Model loaded into VRAM',
      'Starting Open WebUI on port 4000...',
      'RunPod assigning public proxy URL...',
      'Running health check on pod endpoint...',
      'All services online — agent ready',
    ];
    logMessages.forEach((msg, i) => {
      stepTimers.push(setTimeout(() => addLog(msg), (remaining / logMessages.length) * i));
    });

    return () => {
      clearInterval(progressInterval);
      stepTimers.forEach(t => clearTimeout(t));
    };
  }, []);

  async function finishBoot() {
    if (completedRef.current) return;
    completedRef.current = true;
    setProgress(100);
    setStepIndex(BOOT_STEPS.length);
    setDone(true);
    addLog('Agent is live at ' + (agent.agent_url !== 'pending' ? agent.agent_url : 'pod endpoint'));
    onStatusChange(agent.id, 'running');
  }

  async function handleDestroy() {
    if (!confirm(`Destroy agent "${agent.name}"?\n\nThis will permanently terminate the RunPod GPU server and stop billing. This cannot be undone.`)) return;

    setDestroying(true);
    addLog('Terminating RunPod pod — this may take a few seconds...');

    try {
      const res = await fetch(`/api/agents?id=${agent.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        addLog('Pod terminated. No more charges will occur.');
        onDestroy(agent.id);
      } else {
        addLog('Destroy failed — please try again or check RunPod dashboard.');
        setDestroying(false);
      }
    } catch {
      addLog('Network error during destroy.');
      setDestroying(false);
    }
  }

  const gpuLabel = GPU_DISPLAY[agent.gpu_instance] || agent.gpu_instance;
  const llmLabel = LLM_DISPLAY[agent.llm_model] || agent.llm_model;

  return (
    <div className="w-full max-w-4xl bg-[#1a1228] border border-white/10 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <Image src="/logo.png" alt="Agent" width={28} height={28} className="rounded-lg opacity-90" />
          <div>
            <div className="text-white font-display tracking-wide text-sm">{agent.name}</div>
            {agent.description && (
              <div className="text-white/40 text-xs">{agent.description}</div>
            )}
          </div>
        </div>
        <div className={`flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full border ${
          destroying
            ? 'bg-red-500/15 border-red-500/30 text-red-300'
            : done
            ? 'bg-green-500/15 border-green-500/30 text-green-400'
            : deployError
            ? 'bg-red-500/15 border-red-500/30 text-red-400'
            : 'bg-blue-500/15 border-blue-500/30 text-blue-300'
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${
            destroying ? 'bg-red-400 animate-pulse'
            : done ? 'bg-green-400'
            : deployError ? 'bg-red-400'
            : 'bg-blue-400 animate-pulse'
          }`}></span>
          {destroying ? 'Terminating' : done ? 'Running' : deployError ? 'Failed' : 'Booting'}
        </div>
      </div>

      {/* Body */}
      <div className="px-6 py-5 space-y-4">
        {/* Status title */}
        <div className="flex items-center gap-3 text-white/80 text-sm">
          {destroying ? (
            <Loader2 size={18} className="text-red-400 animate-spin shrink-0" />
          ) : done ? (
            <CheckCircle2 size={18} className="text-green-400 shrink-0" />
          ) : deployError ? (
            <AlertCircle size={18} className="text-red-400 shrink-0" />
          ) : (
            <Loader2 size={18} className="text-pink-400 animate-spin shrink-0" />
          )}
          <span className="font-medium">
            {destroying
              ? 'Terminating RunPod pod...'
              : done
              ? 'AI agent is live on RunPod'
              : deployError
              ? deployError
              : 'Spinning up cloud GPU server...'}
          </span>
        </div>

        {/* Auto-shutdown notice */}
        <div className="flex items-center gap-2 text-xs text-yellow-400/70 bg-yellow-400/5 border border-yellow-400/15 rounded-xl px-4 py-2.5">
          <span>⏱</span>
          <span>Agent auto-shuts down after <strong>2 hours</strong> of inactivity to save RunPod credits.</span>
        </div>

        {/* Progress bar */}
        {!done && !deployError && !destroying && (
          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {/* Steps */}
        {!deployError && !destroying && (
          <div className="space-y-2">
            {BOOT_STEPS.map((step, i) => {
              const completed = stepIndex > i || done;
              const active = stepIndex === i && !done;
              return (
                <div key={i} className="flex items-center gap-3 text-sm">
                  {completed ? (
                    <CheckCircle2 size={15} className="text-green-400 shrink-0" />
                  ) : active ? (
                    <Loader2 size={15} className="text-pink-400 animate-spin shrink-0" />
                  ) : (
                    <Circle size={15} className="text-white/20 shrink-0" />
                  )}
                  <span className={completed ? 'text-green-300' : active ? 'text-white/90' : 'text-white/30'}>
                    {step.label}
                    {step.suffix && !completed && (
                      <span className="text-white/40 ml-1 text-xs">{step.suffix}</span>
                    )}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Log */}
        <div className="border border-white/10 rounded-xl overflow-hidden">
          <button
            onClick={() => setLogOpen(o => !o)}
            className="w-full flex items-center justify-between px-4 py-3 bg-white/5 hover:bg-white/8 transition-colors text-left"
          >
            <div className="flex items-center gap-2 text-xs font-mono text-white/70">
              <span className="text-white/40">&gt;_</span>
              Deploy Log ({logLines.length})
              {!done && !deployError && !destroying && (
                <span className="flex items-center gap-1 text-green-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                  LIVE
                </span>
              )}
            </div>
            <span className="text-white/30 text-xs">{logOpen ? '▲' : '▼'}</span>
          </button>
          {logOpen && (
            <div className="bg-black/40 px-4 py-3 max-h-36 overflow-y-auto font-mono text-xs text-white/60 space-y-1">
              {logLines.length === 0 ? (
                <span className="text-white/30">Starting...</span>
              ) : (
                logLines.map((line, i) => (
                  <div key={i} className="flex gap-2">
                    <span className="text-white/25 shrink-0">{'>'}</span>
                    <span>{line}</span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Meta info */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs text-white/50">
          <div className="flex items-center gap-2">
            <span className="text-white/30">🌐</span>
            <span className="font-mono truncate">
              {agent.agent_url && agent.agent_url !== 'pending' ? agent.agent_url : 'Allocating URL...'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-white/30">⚡</span>
            <span>{gpuLabel} · {llmLabel}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-white/30">☁️</span>
            <span>RunPod Cloud</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-white/30">🔑</span>
            <span className="font-mono">{agent.deploy_id}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-white/10">
        <button
          onClick={handleDestroy}
          disabled={destroying}
          className="flex items-center gap-2 text-xs text-red-400/60 hover:text-red-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {destroying ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
          {destroying ? 'Terminating...' : 'Destroy'}
        </button>

        <Link
          href={`/dashboard/${agent.id}`}
          className="flex items-center gap-2 text-xs bg-[#8b29f3] hover:bg-[#7a22e0] text-white px-4 py-2 rounded-full transition-colors font-medium"
        >
          <ExternalLink size={13} />
          {done ? 'Open Dashboard' : 'View Status'}
        </Link>
      </div>
    </div>
  );
}
