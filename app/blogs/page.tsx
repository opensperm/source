import Link from 'next/link';
import Image from 'next/image';

const posts = [
  {
    tag: "Infrastructure",
    title: "Why Every AI Agent Deserves Its Own Private Environment",
    excerpt: "Shared AI infrastructure is the norm — but it comes with serious privacy tradeoffs. Here's why we built Opensperm to give every agent its own isolated pod.",
    date: "Jan 2026",
    slug: "#"
  },
  {
    tag: "Privacy",
    title: "Running Local LLMs With Zero Data Leakage",
    excerpt: "With Opensperm's Agent Models module, models run entirely inside the agent. No API calls, no external endpoints — your prompts never leave the machine.",
    date: "Feb 2026",
    slug: "#"
  },
  {
    tag: "Product",
    title: "Introducing Agent Pods: Dedicated Compute for Private AI",
    excerpt: "Announcing Agent Pods — the first building block of the Opensperm platform. Every agent gets its own isolated compute environment.",
    date: "Mar 2026",
    slug: "#"
  }
];

export default function BlogsPage() {
  return (
    <main className="min-h-screen bg-[#8b29f3]">
      {/* Header */}
      <div className="flex items-center justify-between px-8 py-8 max-w-5xl mx-auto">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo.png" alt="Opensperm" width={56} height={56} className="drop-shadow-[0_0_10px_rgba(255,255,255,0.7)]" />
        </Link>
        <Link href="/" className="text-white/70 hover:text-white font-display text-sm tracking-wider transition-colors">
          ← Back
        </Link>
      </div>

      {/* Hero */}
      <div className="max-w-5xl mx-auto px-8 pt-12 pb-20 text-white">
        <p className="text-white/60 text-sm font-medium tracking-widest uppercase mb-4">Blog</p>
        <h1 className="text-4xl md:text-5xl font-display tracking-wide mb-6">Opensperm Updates</h1>
        <p className="text-white/70 text-base max-w-xl leading-relaxed">
          Thoughts on private AI infrastructure, agent architecture, and the future of personal AI.
        </p>
      </div>

      {/* Posts */}
      <div className="max-w-5xl mx-auto px-8 pb-32 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post, i) => (
          <Link
            key={i}
            href={post.slug}
            className="group flex flex-col bg-white/10 hover:bg-white/15 border border-white/10 hover:border-white/25 rounded-3xl p-8 transition-all duration-300"
          >
            <span className="text-xs font-bold tracking-widest uppercase text-white/50 mb-4">{post.tag}</span>
            <h2 className="text-lg font-display text-white leading-snug mb-4 group-hover:text-white/90 transition-colors">
              {post.title}
            </h2>
            <p className="text-white/60 text-sm leading-relaxed flex-1 mb-6">
              {post.excerpt}
            </p>
            <span className="text-xs text-white/40 font-medium">{post.date}</span>
          </Link>
        ))}
      </div>
    </main>
  );
}
