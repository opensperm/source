'use client';
import { Play } from 'lucide-react';
import { motion } from 'motion/react';

export function Demo() {
  return (
    <section className="relative bg-brand-yellow bg-noise py-32 text-black flex flex-col items-center">
      <div className="content-relative w-full max-w-6xl px-8 flex flex-col items-center">
        <h2 className="text-3xl md:text-4xl font-display mb-20 drop-shadow-md tracking-wider">Demo</h2>
        
        <div className="relative w-full aspect-video bg-black rounded-[2.5rem] p-3 shadow-[15px_15px_0px_0px_rgba(0,0,0,0.3)] hand-drawn-border overflow-hidden group cursor-pointer transform -rotate-1 hover:rotate-0 transition-transform duration-500">
          {/* Video Placeholder */}
          <div className="absolute inset-3 bg-brand-blue rounded-[2rem] flex flex-col items-center justify-center overflow-hidden">
            
            {/* Fake Video Content */}
            <div className="absolute inset-0 bg-gradient-to-br from-brand-blue to-blue-900 flex items-center justify-center">
              <h3 className="text-2xl md:text-3xl font-display text-white text-center px-4 drop-shadow-2xl tracking-widest z-10">
                OPENSPERM + LOCAL LLM
              </h3>
            </div>
            
            {/* Play Button Overlay */}
            <motion.div 
              whileHover={{ scale: 1.1 }}
              className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20"
            >
              <div className="w-24 h-24 bg-red-600 rounded-3xl flex items-center justify-center shadow-2xl border-4 border-white/20">
                <Play size={48} className="text-white ml-2" fill="white" />
              </div>
            </motion.div>
          </div>
          
          {/* Fake Video Controls */}
          <div className="absolute bottom-3 left-3 right-3 h-16 bg-gradient-to-t from-black/90 to-transparent flex items-end px-6 pb-4 rounded-b-[2rem] z-30">
            <div className="w-full flex items-center gap-6 text-white/90 text-sm font-medium">
              <Play size={20} fill="currentColor" className="hover:text-brand-accent transition-colors" />
              <div className="flex-1 h-1.5 bg-white/30 rounded-full overflow-hidden cursor-pointer">
                <div className="w-1/3 h-full bg-red-600 relative">
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow"></div>
                </div>
              </div>
              <span className="font-mono">0:00 / 1:04</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
