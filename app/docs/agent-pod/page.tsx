export default function AgentPodPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:px-12 md:py-16 text-slate-800 font-sans">
      <h1 className="text-3xl font-bold mb-6 text-slate-900">Agent Pod</h1>
      <p className="text-base text-slate-600 mb-6 leading-relaxed">
        The Agent Pod is the fundamental unit of compute in the Opensperm ecosystem. It is a secure, isolated container dedicated entirely to your agent.
      </p>
      <hr className="border-slate-100 mb-12" />
      <h2 className="text-2xl font-bold mb-6 text-slate-900">Isolation & Security</h2>
      <p className="text-slate-600 mb-6 leading-relaxed text-base">
        Unlike shared APIs (like OpenAI or Anthropic) where your prompts are processed on multi-tenant servers, an Agent Pod is a single-tenant environment. 
      </p>
      <ul className="list-disc pl-6 space-y-4 text-slate-600 mb-12">
        <li><strong>Dedicated RAM & GPU:</strong> Resources are not shared, ensuring consistent performance.</li>
        <li><strong>Network Isolation:</strong> Pods can be configured to have no outbound internet access, or strictly whitelisted access.</li>
        <li><strong>Ephemeral or Persistent:</strong> Choose whether your pod wipes its state after a task or maintains a persistent encrypted volume.</li>
      </ul>

      <div className="text-center text-sm text-slate-500 pb-8">© 2026 Opensperm.io · Terms · Privacy · Disclaimer</div>
    </div>
  );
}
