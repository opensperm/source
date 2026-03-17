'use client';
import Image from 'next/image';
import Link from 'next/link';
import { usePrivy } from '@privy-io/react-auth';
import { LogIn, LogOut } from 'lucide-react';

export function Footer() {
  const { ready, authenticated, login, logout, user } = usePrivy();
  const email = user?.email?.address ?? '';
  const shortEmail = email.length > 20 ? email.slice(0, 18) + '…' : email;

  return (
    <footer className="bg-black text-white pt-24 pb-12 border-t border-white/10">
      <div className="max-w-6xl mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-24">
          <div className="col-span-1">
            <div className="flex items-center gap-4 mb-8">
              <Image src="/ghost-icon.png" alt="Opensperm" width={40} height={40} className="rounded-xl" />
            </div>
            <p className="text-white/50 text-sm leading-relaxed">Private AI agents for everyone.</p>
          </div>

          <div>
            <h4 className="font-display text-lg mb-8 tracking-wide">Explore</h4>
            <ul className="space-y-5 text-white/50 text-xs">
              <li><Link href="/#modules" className="hover:text-white transition-colors">Modules</Link></li>
              <li><Link href="/#features" className="hover:text-white transition-colors">Features</Link></li>
              <li><Link href="/#demo" className="hover:text-white transition-colors">Demo</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-lg mb-8 tracking-wide">Resources</h4>
            <ul className="space-y-5 text-white/50 text-xs">
              <li><Link href="/blogs" className="hover:text-white transition-colors">Blog</Link></li>
              <li><Link href="/docs" className="hover:text-white transition-colors">Documentation</Link></li>
              <li><Link href="/docs/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/docs/terms" className="hover:text-white transition-colors">Terms</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-lg mb-8 tracking-wide">Social</h4>
            <ul className="space-y-5 text-white/50 text-xs">
              <li><Link href="https://x.com/opensperm" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Twitter / X</Link></li>
              <li><Link href="/docs" className="hover:text-white transition-colors">Docs</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Telegram</Link></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-6 pt-10 border-t border-white/10">
          {!ready ? null : authenticated ? (
            <button
              onClick={logout}
              className="flex items-center gap-4 bg-black border border-white/20 rounded-full px-8 py-4 hover:bg-white/10 hover:border-white/40 hover:scale-105 transition-all duration-200 group"
            >
              <Image src="/ghost-icon.png" alt="Account" width={24} height={24} className="rounded-lg opacity-70 group-hover:opacity-100 transition-opacity" />
              <div className="text-left">
                <div className="text-[10px] text-white/50 uppercase tracking-widest mb-1">Logged in as</div>
                <div className="text-sm font-mono font-medium">{shortEmail}</div>
              </div>
              <LogOut size={14} className="text-white/40 group-hover:text-white/70 transition-colors ml-1" />
            </button>
          ) : (
            <button
              onClick={login}
              className="flex items-center gap-4 bg-black border border-white/20 rounded-full px-8 py-4 hover:bg-white/10 hover:border-white/40 hover:scale-105 transition-all duration-200 group"
            >
              <Image src="/ghost-icon.png" alt="Account" width={24} height={24} className="rounded-lg opacity-70 group-hover:opacity-100 transition-opacity" />
              <div className="text-left">
                <div className="text-[10px] text-white/50 uppercase tracking-widest mb-1">Account</div>
                <div className="text-sm font-mono font-medium">Sign In</div>
              </div>
              <LogIn size={14} className="text-white/40 group-hover:text-white/70 transition-colors ml-1" />
            </button>
          )}

          <button className="flex items-center gap-3 bg-black border border-white/20 rounded-full px-10 py-5 hover:bg-white/10 hover:border-white/40 hover:scale-105 transition-all duration-200 font-mono text-sm font-medium tracking-wider">
            $OPENSPERM
          </button>
        </div>
      </div>
    </footer>
  );
}
