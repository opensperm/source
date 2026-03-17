/* eslint-disable react/no-unescaped-entities */
export default function FAQPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:px-12 md:py-16 text-slate-800 font-sans">
      <h1 className="text-3xl font-bold mb-6 text-slate-900">Frequently Asked Questions</h1>
      <p className="text-base text-slate-600 mb-6 leading-relaxed">
        Find answers to common questions about Opensperm, private AI, and our platform.
      </p>
      <hr className="border-slate-100 mb-12" />
      
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Do you have access to my agent's data?</h3>
          <p className="text-slate-600">No. Your Agent Pods are isolated, and all communication is end-to-end encrypted. We cannot read your prompts, memory, or files.</p>
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">What models can I run?</h3>
          <p className="text-slate-600">You can run any open-weight model supported by our runtime (e.g., Llama 3, Mistral). You can also securely route requests to external APIs (like OpenAI) if you choose to.</p>
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">How much does it cost?</h3>
          <p className="text-slate-600">Pricing is based on the compute resources (GPU/RAM) allocated to your Agent Pod. You pay per hour of uptime using crypto or fiat.</p>
        </div>
      </div>


      <div className="text-center text-sm text-slate-500 pb-8">© 2026 Opensperm.io · Terms · Privacy · Disclaimer</div>
    </div>
  );
}
