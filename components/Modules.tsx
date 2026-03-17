'use client';
import { motion } from 'motion/react';
import { CheckSquare } from 'lucide-react';
import Image from 'next/image';

const modules = [
  {
    title: "Agent Pods",
    description: "Dedicated private compute environment for each AI agent.",
    features: [
      "Private compute dedicated to your agent",
      "Fully isolated runtime environment",
      "No shared infrastructure with other agents"
    ],
    imageAlign: "right",
    image: "/ghost-gpu.png"
  },
  {
    title: "Agent Runtime",
    description: "Secure execution environment where agents run models, tools, and workflows.",
    features: [
      "Run local AI models privately inside the agent",
      "Execute tools, scripts, and automated workflows",
      "Fully private runtime with isolated processes"
    ],
    imageAlign: "left",
    image: "/ghost-angry.png"
  },
  {
    title: "Agent Models",
    description: "Run AI models directly inside your private agent.",
    features: [
      "Load and run local LLM models privately",
      "No dependency on external AI APIs",
      "Full control over models and inference"
    ],
    imageAlign: "right",
    image: "/ghost-laptop.png"
  }
];

export function Modules() {
  return (
    <section id="modules" className="relative bg-brand-dark bg-noise py-32 text-white overflow-hidden">
      <div className="content-relative max-w-6xl mx-auto px-8">
        <div className="text-center mb-24">
          <h2 className="text-3xl md:text-4xl font-creepster text-white mb-6 tracking-widest drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">OPENSPERM MODULES</h2>
          <p className="text-sm text-white/70 font-medium">Core infrastructure that powers every Opensperm agent</p>
        </div>

        <div className="flex flex-col">
          {modules.map((mod, index) => (
            <div key={index} className="relative">
              {index > 0 && (
                <div className="absolute top-0 left-0 w-full h-[2px] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjIiPjxwYXRoIGQ9Ik0wIDEgUSA1MCAwLCAxMDAgMSBUIDIwMCAxIFQgMzAwIDEgVCA0MDAgMSBUIDUwMCAxIFQgNjAwIDEgVCA3MDAgMSBUIDgwMCAxIFQgOTAwIDEgVCAxMDAwIDEiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjMpIiBmaWxsPSJub25lIiBzdHJva2Utd2lkdGg9IjIiLz48L3N2Zz4=')] bg-repeat-x -mt-[1px]"></div>
              )}
              
              <div className={`py-20 flex flex-col md:flex-row items-center gap-16 ${mod.imageAlign === 'left' ? 'md:flex-row-reverse' : ''}`}>
                <div className="flex-1 space-y-6">
                  <h3 className="text-2xl font-display tracking-wide">{mod.title}</h3>
                  <p className="text-white/70 text-sm leading-relaxed">{mod.description}</p>
                  <ul className="space-y-5 mt-8">
                    {mod.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-4">
                        <div className="mt-1 text-brand-yellow">
                          <CheckSquare size={20} />
                        </div>
                        <span className="text-white/90 text-sm">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="flex-1 flex justify-center items-center h-80 w-full">
                  <motion.div
                    animate={{ y: [0, -16, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    style={{ willChange: 'transform' }}
                  >
                    <Image src={mod.image} alt={mod.title} width={200} height={200} className="drop-shadow-[0_0_30px_rgba(255,255,255,0.15)]" />
                  </motion.div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
