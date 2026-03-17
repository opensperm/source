export default function ArchitecturePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:px-12 md:py-16 text-slate-800 font-sans">
      <h1 className="text-3xl font-bold mb-6 text-slate-900">Architecture</h1>
      <p className="text-base text-slate-600 mb-6 leading-relaxed">
        Opensperm is built on a decentralized, privacy-first architecture designed to give you complete control over your AI agents.
      </p>
      <hr className="border-slate-100 mb-12" />
      <h2 className="text-2xl font-bold mb-6 text-slate-900">High-Level Overview</h2>
      <p className="text-slate-600 mb-6 leading-relaxed text-base">
        At its core, Opensperm separates the control plane from the execution environment. The App Manager acts as your control center, while Agent Pods serve as the isolated execution environments.
      </p>
      <ul className="list-disc pl-6 space-y-4 text-slate-600 mb-12">
        <li><strong>Control Plane:</strong> Manages routing, authentication, and billing without ever seeing your raw data or prompts.</li>
        <li><strong>Execution Plane (Agent Pods):</strong> Dedicated virtualized environments where your models and tools actually run.</li>
        <li><strong>Storage Layer:</strong> Encrypted volumes attached directly to your Agent Pods for memory and database storage.</li>
      </ul>

      <div className="text-center text-sm text-slate-500 pb-8">© 2026 Opensperm.io · Terms · Privacy · Disclaimer</div>
    </div>
  );
}
