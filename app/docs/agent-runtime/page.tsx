/* eslint-disable react/no-unescaped-entities */
export default function AgentRuntimePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:px-12 md:py-16 text-slate-800 font-sans">
      <h1 className="text-3xl font-bold mb-6 text-slate-900">Agent Runtime</h1>
      <p className="text-base text-slate-600 mb-6 leading-relaxed">
        The Agent Runtime is the software stack that executes inside your Agent Pod. It handles model loading, tool execution, and memory management.
      </p>
      <hr className="border-slate-100 mb-12" />
      <h2 className="text-2xl font-bold mb-6 text-slate-900">Execution Engine</h2>
      <p className="text-slate-600 mb-6 leading-relaxed text-base">
        Our runtime is optimized for low-latency inference and secure tool calling. It acts as the "brain stem" of your agent, translating your high-level goals into actionable steps.
      </p>
      <ul className="list-disc pl-6 space-y-4 text-slate-600 mb-12">
        <li><strong>Sandboxed Tools:</strong> When an agent uses a skill (like running Python code), it happens in a secondary WebAssembly sandbox.</li>
        <li><strong>State Management:</strong> Automatically checkpoints agent progress so long-running tasks can be paused and resumed.</li>
        <li><strong>Observability:</strong> Emits encrypted telemetry that only you can decrypt via the App Manager.</li>
      </ul>

      <div className="text-center text-sm text-slate-500 pb-8">© 2026 Opensperm.io · Terms · Privacy · Disclaimer</div>
    </div>
  );
}
