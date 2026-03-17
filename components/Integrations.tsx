'use client';

const partners = [
  {
    name: "NVIDIA",
    src: "https://cdn.simpleicons.org/nvidia/ffffff",
    type: "icon",
  },
  {
    name: "RunPod",
    src: "https://github.com/runpod.png",
    type: "avatar",
  },
  {
    name: "Docker",
    src: "https://cdn.simpleicons.org/docker/ffffff",
    type: "icon",
  },
  {
    name: "Ollama",
    src: "https://github.com/ollama.png",
    type: "avatar",
  },
  {
    name: "Cloudflare",
    src: "https://cdn.simpleicons.org/cloudflare/f48120",
    type: "icon",
  },
  {
    name: "Vercel",
    src: "https://cdn.simpleicons.org/vercel/ffffff",
    type: "icon",
  },
  {
    name: "Privy",
    src: "https://github.com/privy-io.png",
    type: "avatar",
  },
  {
    name: "STORJ",
    src: "https://cdn.simpleicons.org/storj/1572a3",
    type: "icon",
  },
  {
    name: "Solana",
    src: "https://cdn.simpleicons.org/solana/9945ff",
    type: "icon",
  },
  {
    name: "Arcium",
    src: "https://github.com/arcium-hq.png",
    type: "avatar",
  },
];

export function Integrations() {
  return (
    <section className="bg-black py-32 text-white/50">
      <div className="max-w-6xl mx-auto px-8 flex flex-col items-center">
        <h3 className="text-xs tracking-[0.4em] uppercase mb-20 font-medium text-white/40">
          Integrated & Powered By
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-x-16 gap-y-14 w-full place-items-center">
          {partners.map((partner, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-3 opacity-50 hover:opacity-100 transition-all duration-300 hover:scale-110 cursor-pointer group"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={partner.src}
                alt={partner.name}
                width={partner.type === 'avatar' ? 40 : 48}
                height={partner.type === 'avatar' ? 40 : 48}
                className={
                  partner.type === 'avatar'
                    ? 'rounded-lg object-contain'
                    : 'object-contain'
                }
                style={{ height: '40px', width: 'auto' }}
              />
              <span className="text-[10px] tracking-widest uppercase text-white/40 group-hover:text-white/70 transition-colors font-medium">
                {partner.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
