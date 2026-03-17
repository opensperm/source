export default function AgentModelsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:px-12 md:py-16 text-slate-800 font-sans">
      <h1 className="text-3xl font-bold mb-6 text-slate-900">Agent Models</h1>
      <p className="text-base text-slate-600 mb-6 leading-relaxed">
        Opensperm supports a wide variety of open-weight and proprietary models that can be run locally within your Agent Pod.
      </p>
      <hr className="border-slate-100 mb-12" />
      <h2 className="text-2xl font-bold mb-6 text-slate-900">Supported Architectures</h2>
      <p className="text-slate-600 mb-6 leading-relaxed text-base">
        You can hot-swap models depending on the task requirements. We provide optimized inference engines (like vLLM and llama.cpp) pre-installed in the runtime.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="border border-slate-200 p-6 rounded-xl">
          <h4 className="font-bold text-slate-900 mb-2">Large Language Models (LLMs)</h4>
          <p className="text-sm text-slate-600">Llama 3 (8B, 70B), Mistral, Mixtral, Qwen, and custom fine-tunes.</p>
        </div>
        <div className="border border-slate-200 p-6 rounded-xl">
          <h4 className="font-bold text-slate-900 mb-2">Vision Models</h4>
          <p className="text-sm text-slate-600">LLaVA, Qwen-VL, and Stable Diffusion for image generation.</p>
        </div>
      </div>

      <div className="text-center text-sm text-slate-500 pb-8">© 2026 Opensperm.io · Terms · Privacy · Disclaimer</div>
    </div>
  );
}
