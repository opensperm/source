'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, Plus } from 'lucide-react';

const LLM_MODELS = [
  { id: 'qwen3-8b', name: 'Qwen 3 8B', desc: '~5 GB · All-rounder', star: true },
  { id: 'phi4-mini', name: 'Phi-4 Mini', desc: '~2.5 GB · Fast & light', star: false },
  { id: 'llama3-8b', name: 'Llama 3.1 8B', desc: '~4.7 GB · Strong reasoning', star: false },
];

const GPU_PRESETS = [
  { id: 'rtx3060', name: 'RTX 3060', desc: '12 GB · Budget', star: false },
  { id: 'rtx3090', name: 'RTX 3090', desc: '24 GB · Recommended', star: true },
  { id: 'rtx4090', name: 'RTX 4090', desc: '24 GB · High-end', star: false },
  { id: 'rtx-a5000', name: 'RTX A5000', desc: '24 GB · Workstation', star: false },
  { id: 'apple-m3', name: 'Apple M3', desc: 'Unified · Mac only', star: false },
];

interface Props {
  email: string;
  onClose: () => void;
  onDeployed: () => void;
}

export function DeployModal({ email, onClose, onDeployed }: Props) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedLLM, setSelectedLLM] = useState('qwen3-8b');
  const [selectedGPU, setSelectedGPU] = useState('rtx3090');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleDeploy() {
    if (!name.trim()) { setError('Agent name is required'); return; }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          name: name.trim(),
          description,
          llm_model: selectedLLM,
          gpu_instance: selectedGPU,
        }),
      });
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      onDeployed();
      onClose();
      router.push(`/dashboard/${data.agent.id}`);
    } catch {
      setError('Failed to create agent. Please try again.');
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className="relative bg-[#2a1a3e] border border-white/10 rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-xl font-display text-white tracking-wide">Deploy New Agent</h2>
              <p className="text-white/60 text-sm mt-2 leading-relaxed">
                Your agent runs on your own machine — private, zero cloud cost.
              </p>
            </div>
            <button onClick={onClose} className="text-white/40 hover:text-white transition-colors ml-4 mt-1">
              <X size={20} />
            </button>
          </div>

          {/* Agent Name */}
          <div className="mb-5">
            <label className="block text-sm font-semibold text-white mb-2">Agent Name</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="my-agent"
              className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#8b29f3] transition-colors"
            />
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-white mb-2">
              Description <span className="text-white/40 font-normal">(optional)</span>
            </label>
            <input
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="What will this agent do?"
              className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#8b29f3] transition-colors"
            />
          </div>

          {/* LLM Model */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-white mb-3">LLM Model</label>
            <div className="grid grid-cols-2 gap-2">
              {LLM_MODELS.map(m => (
                <button
                  key={m.id}
                  onClick={() => setSelectedLLM(m.id)}
                  className={`text-left rounded-xl px-4 py-3 border transition-all ${
                    selectedLLM === m.id
                      ? 'bg-white/15 border-white/40'
                      : 'bg-white/5 border-white/10 hover:border-white/25'
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-sm font-bold text-white">{m.name}</span>
                    {m.star && <span className="text-green-400 text-xs">★</span>}
                  </div>
                  <div className="text-xs text-white/50">{m.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* GPU Preset */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-white mb-1">Your GPU</label>
            <p className="text-white/40 text-xs mb-3">Select your local GPU — the agent runs on your own machine.</p>
            <div className="grid grid-cols-2 gap-2">
              {GPU_PRESETS.map(g => (
                <button
                  key={g.id}
                  onClick={() => setSelectedGPU(g.id)}
                  className={`text-left rounded-xl px-4 py-3 border transition-all ${
                    selectedGPU === g.id
                      ? 'bg-white/15 border-white/40'
                      : 'bg-white/5 border-white/10 hover:border-white/25'
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-sm font-bold text-white">{g.name}</span>
                    {g.star && <span className="text-green-400 text-xs">★</span>}
                  </div>
                  <div className="text-xs text-white/50">{g.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6 text-sm text-white/70">
            <p className="font-semibold text-white mb-2">What you&apos;ll get:</p>
            <ul className="space-y-1 list-disc list-inside">
              <li>OpenClaw agent on your {GPU_PRESETS.find(g => g.id === selectedGPU)?.name}</li>
              <li>Ollama + {LLM_MODELS.find(m => m.id === selectedLLM)?.name} as the LLM backend</li>
              <li>Public HTTPS dashboard via Cloudflare Tunnel</li>
              <li>Telegram, Discord, WhatsApp via OpenClaw channels</li>
              <li>Zero cloud cost — runs 100% on your machine</li>
            </ul>
          </div>

          {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

          {/* Actions */}
          <div className="flex items-center justify-between gap-3">
            <button onClick={onClose} className="px-6 py-3 text-white/60 hover:text-white text-sm transition-colors font-medium">
              Cancel
            </button>
            <button
              onClick={handleDeploy}
              disabled={loading || !name.trim()}
              className="brutalist-btn px-6 py-3 flex items-center gap-2 text-sm font-medium tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus size={16} strokeWidth={3} />
              {loading ? 'Creating...' : 'Create Agent'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
