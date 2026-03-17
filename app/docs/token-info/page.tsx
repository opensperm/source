export default function TokenInfoPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:px-12 md:py-16 text-slate-800 font-sans">
      <h1 className="text-3xl font-bold mb-6 text-slate-900">Token Info</h1>
      <p className="text-base text-slate-600 mb-6 leading-relaxed">
        The $OPENSPERM token is the utility and governance token powering the decentralized compute network.
      </p>
      <hr className="border-slate-100 mb-12" />
      <h2 className="text-2xl font-bold mb-6 text-slate-900">Utility & Economics</h2>
      <p className="text-slate-600 mb-6 leading-relaxed text-base">
        Our tokenomics are designed to align incentives between compute providers, agent developers, and end-users.
      </p>
      <ul className="list-disc pl-6 space-y-4 text-slate-600 mb-12">
        <li><strong>Compute Payments:</strong> Use $OPENSPERM to pay for Agent Pod hosting on the decentralized network.</li>
        <li><strong>Staking:</strong> Node operators must stake tokens to provide compute, ensuring high-quality service and slashing for malicious behavior.</li>
        <li><strong>Governance:</strong> Token holders can vote on protocol upgrades, supported models, and grant allocations.</li>
      </ul>

      <div className="text-center text-sm text-slate-500 pb-8">© 2026 Opensperm.io · Terms · Privacy · Disclaimer</div>
    </div>
  );
}
