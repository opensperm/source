/* eslint-disable react/no-unescaped-entities */
export default function PrivateAccessPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:px-12 md:py-16 text-slate-800 font-sans">
      <h1 className="text-3xl font-bold mb-6 text-slate-900">Private Access</h1>
      <p className="text-base text-slate-600 mb-6 leading-relaxed">
        Interact with your agent securely from anywhere without exposing your data to the public internet.
      </p>
      <hr className="border-slate-100 mb-12" />
      <h2 className="text-2xl font-bold mb-6 text-slate-900">End-to-End Encryption</h2>
      <p className="text-slate-600 mb-6 leading-relaxed text-base">
        All communication between your devices (App Manager, Mobile App) and your Agent Pod is secured using end-to-end encryption (E2EE).
      </p>
      <ul className="list-disc pl-6 space-y-4 text-slate-600 mb-12">
        <li><strong>Secure Tunnels:</strong> We utilize WireGuard-based tunneling to create a direct, encrypted connection to your pod.</li>
        <li><strong>No Man-in-the-Middle:</strong> The Opensperm routing layer only sees encrypted packets; it cannot read your prompts or the agent's responses.</li>
        <li><strong>Key Management:</strong> Your private keys are generated and stored locally on your device.</li>
      </ul>

      <div className="text-center text-sm text-slate-500 pb-8">© 2026 Opensperm.io · Terms · Privacy · Disclaimer</div>
    </div>
  );
}
