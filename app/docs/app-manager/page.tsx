export default function AppManagerPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:px-12 md:py-16 text-slate-800 font-sans">
      <h1 className="text-3xl font-bold mb-6 text-slate-900">App Manager</h1>
      <p className="text-base text-slate-600 mb-6 leading-relaxed">
        The App Manager is your centralized dashboard for deploying, monitoring, and interacting with all your private AI agents.
      </p>
      <hr className="border-slate-100 mb-12" />
      <h2 className="text-2xl font-bold mb-6 text-slate-900">Command Center</h2>
      <p className="text-slate-600 mb-6 leading-relaxed text-base">
        Designed for ease of use without compromising on advanced features, the App Manager is a local-first web application.
      </p>
      <ul className="list-disc pl-6 space-y-4 text-slate-600 mb-12">
        <li><strong>Fleet Management:</strong> View the status, resource usage (CPU/RAM/GPU), and logs of all your active Agent Pods.</li>
        <li><strong>Chat Interface:</strong> A clean, intuitive chat UI to interact with your agents directly over secure E2EE tunnels.</li>
        <li><strong>Skill Configuration:</strong> Install new skills, manage API keys, and configure agent behaviors.</li>
      </ul>

      <div className="text-center text-sm text-slate-500 pb-8">© 2026 Opensperm.io · Terms · Privacy · Disclaimer</div>
    </div>
  );
}
