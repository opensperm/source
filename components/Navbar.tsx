'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { X, Menu } from 'lucide-react';

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="absolute top-0 left-0 right-0 z-50 px-6 py-6">
      {/* Desktop */}
      <div className="hidden md:flex items-center justify-center gap-12 text-white font-display text-sm tracking-wider">
        <Link href="/#modules" className="wavy-underline-hover">Modules</Link>
        <Link href="/#features" className="wavy-underline-hover">Features</Link>

        <div className="mx-8 relative group cursor-pointer">
          <div className="absolute -inset-6 bg-white rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
          <Image src="/logo.png" alt="Logo" width={132} height={132} className="relative drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]" />
        </div>

        <Link href="/docs" className="wavy-underline-hover">Docs</Link>
        <Link href="/blogs" className="wavy-underline-hover">Blogs</Link>
      </div>

      {/* Mobile */}
      <div className="flex md:hidden items-center justify-between">
        <Link href="/" className="relative">
          <Image src="/logo.png" alt="Logo" width={64} height={64} className="drop-shadow-[0_0_10px_rgba(255,255,255,0.7)]" />
        </Link>

        <button
          onClick={() => setOpen(!open)}
          className="text-white p-2"
          aria-label="Toggle menu"
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="md:hidden mt-4 flex flex-col items-center gap-6 bg-black/60 backdrop-blur-md rounded-2xl py-8 text-white font-display text-lg tracking-wider border border-white/10">
          <Link href="/#modules" onClick={() => setOpen(false)} className="wavy-underline-hover">Modules</Link>
          <Link href="/#features" onClick={() => setOpen(false)} className="wavy-underline-hover">Features</Link>
          <Link href="/docs" onClick={() => setOpen(false)} className="wavy-underline-hover">Docs</Link>
          <Link href="/blogs" onClick={() => setOpen(false)} className="wavy-underline-hover">Blogs</Link>
        </div>
      )}
    </nav>
  );
}
