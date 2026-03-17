export default function PrivateSkillsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:px-12 md:py-16 text-slate-800 font-sans">
      <h1 className="text-3xl font-bold mb-6 text-slate-900">Private Skills</h1>
      <p className="text-base text-slate-600 mb-6 leading-relaxed">
        Skills are tools and integrations that your agent can use to interact with the outside world. In Opensperm, these skills run privately within your Agent Pod.
      </p>
      <hr className="border-slate-100 mb-12" />
      <h2 className="text-2xl font-bold mb-6 text-slate-900">How it Works</h2>
      <p className="text-slate-600 mb-6 leading-relaxed text-base">
        When you grant an agent a skill (e.g., Twitter access, Web Browsing, or a custom API), the credentials and execution logic never leave your pod.
      </p>
      <ul className="list-disc pl-6 space-y-4 text-slate-600 mb-12">
        <li><strong>Local Execution:</strong> Python scripts or Node.js functions run in a secure sandbox inside the pod.</li>
        <li><strong>Secret Management:</strong> API keys are encrypted at rest and only decrypted in memory during execution.</li>
        <li><strong>Marketplace:</strong> Browse and install community-audited skills directly from the App Manager.</li>
      </ul>

      <div className="text-center text-sm text-slate-500 pb-8">© 2026 Opensperm.io · Terms · Privacy · Disclaimer</div>
    </div>
  );
}
