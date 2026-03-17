export default function PrivatePaymentPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:px-12 md:py-16 text-slate-800 font-sans">
      <h1 className="text-3xl font-bold mb-6 text-slate-900">Private Payment</h1>
      <p className="text-base text-slate-600 mb-6 leading-relaxed">
        Enable your agents to transact autonomously while maintaining financial privacy.
      </p>
      <hr className="border-slate-100 mb-12" />
      <h2 className="text-2xl font-bold mb-6 text-slate-900">Agent Wallets</h2>
      <p className="text-slate-600 mb-6 leading-relaxed text-base">
        Every Agent Pod can be provisioned with a secure, non-custodial crypto wallet. The private keys are held securely within the pod's encrypted enclave.
      </p>
      <ul className="list-disc pl-6 space-y-4 text-slate-600 mb-12">
        <li><strong>Autonomous Transactions:</strong> Agents can pay for external APIs, compute resources, or other agent services autonomously.</li>
        <li><strong>Spending Limits:</strong> Configure strict daily or per-transaction spending limits via the App Manager.</li>
        <li><strong>Supported Chains:</strong> Initially supporting Solana, Base, and Ethereum for low-fee, high-speed transactions.</li>
      </ul>

      <div className="text-center text-sm text-slate-500 pb-8">© 2026 Opensperm.io · Terms · Privacy · Disclaimer</div>
    </div>
  );
}
