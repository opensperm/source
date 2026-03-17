'use client';
import { motion } from 'motion/react';
import Image from 'next/image';

const features = [
  {
    title: "Private Skills",
    description: "Run custom capabilities entirely inside your private agent."
  },
  {
    title: "Private Access",
    description: "Connect to your agent through a secure private tunnel."
  },
  {
    title: "Private Payment",
    description: "Process agent payments privately without public exposure."
  },
  {
    title: "Private Memory",
    description: "Keep your agent's knowledge stored securely and privately."
  },
  {
    title: "Private Backup",
    description: "Safely protect and restore your agent data anytime."
  },
  {
    title: "App Manager",
    description: "Control and manage your agent apps in one private place."
  }
];

export function Features() {
  return (
    <section id="features" className="relative bg-brand-orange bg-noise py-32 text-white">
      <div className="content-relative max-w-6xl mx-auto px-8 flex flex-col items-center">
        <h2 className="text-3xl md:text-4xl font-display text-center mb-24 max-w-4xl leading-tight drop-shadow-lg tracking-wide">
          Opensperm Can Perform Private Actions For You
        </h2>
        
        {/* Central Illustration */}
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          style={{ willChange: 'transform' }}
          className="mb-20"
        >
          <Image src="/ghost-icon.png" alt="Opensperm" width={220} height={220} className="drop-shadow-[0_0_40px_rgba(255,255,255,0.3)]" />
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
          {features.map((feat, i) => (
            <motion.div 
              key={i}
              whileHover={{ scale: 1.03, y: -8 }}
              className="bg-black/40 p-10 rounded-3xl border border-white/10 hover:border-white/30 transition-all duration-300 shadow-xl"
            >
              <h3 className="text-xl font-display mb-4 tracking-wide">{feat.title}</h3>
              <p className="text-white/80 leading-relaxed text-sm">{feat.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
