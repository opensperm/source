export default function PrivateMemoryPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:px-12 md:py-16 text-slate-800 font-sans">
      <h1 className="text-3xl font-bold mb-6 text-slate-900">Private Memory</h1>
      <p className="text-base text-slate-600 mb-6 leading-relaxed">
        Give your agent long-term recall without sending your personal data to a third-party vector database.
      </p>
      <hr className="border-slate-100 mb-12" />
      <h2 className="text-2xl font-bold mb-6 text-slate-900">Local Vector Storage</h2>
      <p className="text-slate-600 mb-6 leading-relaxed text-base">
        Opensperm integrates a lightweight, high-performance vector database directly into the Agent Runtime.
      </p>
      <ul className="list-disc pl-6 space-y-4 text-slate-600 mb-12">
        <li><strong>RAG on the Edge:</strong> Retrieval-Augmented Generation happens entirely within your pod. Documents, chat history, and context are embedded and stored locally.</li>
        <li><strong>Encrypted at Rest:</strong> The memory volume is encrypted. If the pod is spun down, the data remains secure.</li>
        <li><strong>Granular Control:</strong> Easily view, edit, or delete specific memories through the App Manager interface.</li>
      </ul>

      <div className="text-center text-sm text-slate-500 pb-8">© 2026 Opensperm.io · Terms · Privacy · Disclaimer</div>
    </div>
  );
}
