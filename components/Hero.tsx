'use client';
import { Plus, Terminal, LogOut } from 'lucide-react';
import Image from 'next/image';
import { usePrivy } from '@privy-io/react-auth';
import { useState, useEffect } from 'react';
import { DeployModal } from './DeployModal';
import { BootingCard } from './BootingCard';

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


export function Hero() {
  const { ready, authenticated, login, logout, user } = usePrivy();
  const [showDeploy, setShowDeploy] = useState(false);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loadingAgents, setLoadingAgents] = useState(false);

  function handleStatusChange(id: number, status: string) {
    setAgents(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  }

  function handleDestroy(id: number) {
    setAgents(prev => prev.filter(a => a.id !== id));
  }

  const email = user?.email?.address ?? '';

  async function fetchAgents() {
    if (!email) return;
    setLoadingAgents(true);
    try {
      const res = await fetch(`/api/agents?email=${encodeURIComponent(email)}`);
      const data = await res.json();
      setAgents(data.agents || []);
    } catch {
      setAgents([]);
    } finally {
      setLoadingAgents(false);
    }
  }

  useEffect(() => {
    if (authenticated && email) fetchAgents();
    else setAgents([]);
  }, [authenticated, email]);

  function handleDeployClick() {
    if (!authenticated) {
      login();
    } else {
      setShowDeploy(true);
    }
  }

  return (
    <>
      <section className="relative min-h-screen bg-[#8b29f3] bg-noise overflow-hidden flex flex-col items-center justify-center pt-32 pb-12">


        <div className="content-relative w-full max-w-6xl px-8 flex flex-col h-full z-10">
          {/* Top bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full mb-12 gap-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-display text-white mb-2 drop-shadow-md tracking-wide text-pink-300">Your Agents</h2>
              <p className="text-white/90 font-medium text-sm">Private AI on dedicated GPU.</p>
            </div>
            <div className="flex items-center gap-4">
              <Terminal className="text-white/80" size={20} />
              {ready && authenticated && (
                <button
                  onClick={logout}
                  className="flex items-center gap-2 text-white/60 hover:text-white text-xs transition-colors"
                >
                  <LogOut size={14} />
                  <span className="hidden sm:inline">{email.split('@')[0]}</span>
                </button>
              )}
              <button
                onClick={handleDeployClick}
                className="brutalist-btn px-5 py-2 flex items-center gap-2 text-sm font-medium tracking-wider"
              >
                <Plus size={16} strokeWidth={3} />
                Deploy Agent
              </button>
            </div>
          </div>

          {/* Content area */}
          <div className="flex-1 flex items-center justify-center w-full mt-8 relative z-10">
            {!ready ? (
              /* Not ready yet — show sign in box so user can click and trigger Privy */
              <div className="w-full max-w-4xl border-2 border-dashed border-white/40 rounded-[2rem] p-12 flex flex-col items-center text-center bg-white/5 relative z-10">
                <div className="absolute top-4 left-4 w-2 h-2 bg-white/40 rounded-full"></div>
                <div className="absolute top-4 right-4 w-2 h-2 bg-white/40 rounded-full"></div>
                <div className="absolute bottom-4 left-4 w-2 h-2 bg-white/40 rounded-full"></div>
                <div className="absolute bottom-4 right-4 w-2 h-2 bg-white/40 rounded-full"></div>
                <div className="mb-6">
                  <Image src="/ghost-icon.png" alt="Opensperm" width={120} height={120} className="drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]" />
                </div>
                <h3 className="text-xl font-display text-pink-300 mb-4 tracking-wider">No agents yet</h3>
                <p className="text-white/80 mb-4 max-w-lg text-sm leading-relaxed">
                  Deploy your first private AI agent with dedicated GPU, Ollama, and Opensperm — fully yours.
                </p>
                <p className="text-white/50 text-xs mb-8 font-medium tracking-wide">
                  1 agent per account · 1 deploy per day · 1 hour session · 10 users per day
                </p>
                <button onClick={() => login()} className="brutalist-btn px-6 py-3 flex items-center gap-2 text-sm font-medium tracking-wider">
                  Sign in with Email
                </button>
              </div>
            ) : !authenticated ? (
              /* Not logged in */
              <div className="w-full max-w-4xl border-2 border-dashed border-white/40 rounded-[2rem] p-12 flex flex-col items-center text-center bg-white/5 relative">
                <div className="absolute top-4 left-4 w-2 h-2 bg-white/40 rounded-full"></div>
                <div className="absolute top-4 right-4 w-2 h-2 bg-white/40 rounded-full"></div>
                <div className="absolute bottom-4 left-4 w-2 h-2 bg-white/40 rounded-full"></div>
                <div className="absolute bottom-4 right-4 w-2 h-2 bg-white/40 rounded-full"></div>
                <div className="mb-6">
                  <Image src="/ghost-icon.png" alt="Opensperm" width={120} height={120} className="drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]" />
                </div>
                <h3 className="text-xl font-display text-pink-300 mb-4 tracking-wider">Sign in to deploy agents</h3>
                <p className="text-white/80 mb-4 max-w-lg text-sm leading-relaxed">
                  Create an account with your email to deploy private AI agents with dedicated GPU, Ollama, and Opensperm — fully yours.
                </p>
                <p className="text-white/50 text-xs mb-8 font-medium tracking-wide">
                  1 agent per account · 1 deploy per day · 1 hour session · 10 users per day
                </p>
                <button onClick={login} className="brutalist-btn px-6 py-3 flex items-center gap-2 text-sm font-medium tracking-wider">
                  Sign in with Email
                </button>
              </div>
            ) : loadingAgents ? (
              <div className="text-white/50 text-sm">Loading agents...</div>
            ) : agents.length === 0 ? (
              /* Logged in, no agents */
              <div className="w-full max-w-4xl border-2 border-dashed border-white/40 rounded-[2rem] p-12 flex flex-col items-center text-center bg-white/5 relative">
                <div className="absolute top-4 left-4 w-2 h-2 bg-white/40 rounded-full"></div>
                <div className="absolute top-4 right-4 w-2 h-2 bg-white/40 rounded-full"></div>
                <div className="absolute bottom-4 left-4 w-2 h-2 bg-white/40 rounded-full"></div>
                <div className="absolute bottom-4 right-4 w-2 h-2 bg-white/40 rounded-full"></div>
                <div className="mb-6">
                  <Image src="/ghost-icon.png" alt="Opensperm" width={120} height={120} className="drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]" />
                </div>
                <h3 className="text-xl font-display text-pink-300 mb-4 tracking-wider">No agents yet</h3>
                <p className="text-white/80 mb-4 max-w-lg text-sm leading-relaxed">
                  Deploy your first private AI agent with dedicated GPU, Ollama, and Opensperm — fully yours.
                </p>
                <p className="text-white/50 text-xs mb-8 font-medium tracking-wide">
                  1 agent per account · 1 deploy per day · 1 hour session · 10 users per day
                </p>
                <button onClick={() => setShowDeploy(true)} className="brutalist-btn px-6 py-3 flex items-center gap-2 text-sm font-medium tracking-wider">
                  <Plus size={18} strokeWidth={3} />
                  Deploy Your First Agent
                </button>
              </div>
            ) : (
              /* Agent list */
              <div className="w-full max-w-4xl space-y-6">
                {agents.map(agent => (
                  <BootingCard
                    key={agent.id}
                    agent={agent}
                    onStatusChange={handleStatusChange}
                    onDestroy={handleDestroy}
                  />
                ))}
                <div className="flex justify-center pt-2">
                  <button onClick={() => setShowDeploy(true)} className="brutalist-btn px-5 py-2 flex items-center gap-2 text-sm font-medium tracking-wider">
                    <Plus size={16} strokeWidth={3} />
                    Deploy New Agent
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer text */}
          <div className="mt-12 text-center text-white/70 font-medium tracking-[0.2em] uppercase text-xs">
            Spawn. Inject. Deploy. Run.
          </div>
        </div>
      </section>

      {showDeploy && authenticated && (
        <DeployModal
          email={email}
          onClose={() => setShowDeploy(false)}
          onDeployed={fetchAgents}
        />
      )}
    </>
  );
}
