export default function RoadmapPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:px-12 md:py-16 text-slate-800 font-sans">
      <h1 className="text-3xl font-bold mb-6 text-slate-900">Roadmap</h1>
      <p className="text-base text-slate-600 mb-6 leading-relaxed">
        Our vision for the future of private AI agents. This roadmap outlines our planned milestones and feature releases.
      </p>
      <hr className="border-slate-100 mb-12" />
      
      <div className="space-y-12">
        <div className="border-l-4 border-slate-900 pl-6">
          <h3 className="text-xl font-bold text-slate-900 mb-2">Q1 2026: Foundation</h3>
          <ul className="list-disc pl-5 text-slate-600 space-y-2">
            <li>Launch of Opensperm App Manager</li>
            <li>Release of basic Agent Pods with Llama 3 support</li>
            <li>Initial Token Generation Event (TGE)</li>
          </ul>
        </div>
        <div className="border-l-4 border-slate-300 pl-6">
          <h3 className="text-xl font-bold text-slate-900 mb-2">Q2 2026: Expansion</h3>
          <ul className="list-disc pl-5 text-slate-600 space-y-2">
            <li>Private Skills Marketplace Beta</li>
            <li>Advanced Agent Memory (Vector DB integration)</li>
            <li>Multi-agent orchestration capabilities</li>
          </ul>
        </div>
        <div className="border-l-4 border-slate-300 pl-6">
          <h3 className="text-xl font-bold text-slate-900 mb-2">Q3 2026: Ecosystem</h3>
          <ul className="list-disc pl-5 text-slate-600 space-y-2">
            <li>Decentralized Compute Network integration</li>
            <li>Zero-knowledge proof (ZKP) for private verification</li>
            <li>Mobile App for App Manager</li>
          </ul>
        </div>
      </div>


      <div className="text-center text-sm text-slate-500 pb-8">© 2026 Opensperm.io · Terms · Privacy · Disclaimer</div>
    </div>
  );
}
