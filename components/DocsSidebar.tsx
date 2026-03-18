"use client";
import { Sparkles, Menu, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const navGroups = [
  {
    title: "GETTING STARTED",
    links: [
      { name: "Welcome", href: "/docs" },
      { name: "Architecture", href: "/docs/architecture" },
      { name: "Roadmap", href: "/docs/roadmap" },
    ]
  },
  {
    title: "OPENSPERM MODULES",
    links: [
      { name: "Agent Pod", href: "/docs/agent-pod" },
      { name: "Agent Runtime", href: "/docs/agent-runtime" },
      { name: "Agent Models", href: "/docs/agent-models" },
    ]
  },
  {
    title: "PLATFORM FEATURES",
    links: [
      { name: "Private Skills", href: "/docs/private-skills" },
      { name: "Private Access", href: "/docs/private-access" },
      { name: "Private Payment", href: "/docs/private-payment" },
      { name: "Private Memory", href: "/docs/private-memory" },
      { name: "Private Backup", href: "/docs/private-backup" },
      { name: "App Manager", href: "/docs/app-manager" },
    ]
  },
  {
    title: "TOKEN",
    links: [
      { name: "Token Info", href: "/docs/token-info" },
    ]
  },
  {
    title: "RESOURCES",
    links: [
      { name: "FAQ", href: "/docs/faq" },
      { name: "Terms of Service", href: "/docs/terms" },
      { name: "Privacy Policy", href: "/docs/privacy" },
    ]
  }
];

const NavContent = ({ onLinkClick, pathname }: { onLinkClick?: () => void; pathname: string }) => (
  <>
    <Link href="/" className="flex items-center gap-3 mb-12 pl-2">
      <div className="relative">
        <Image src="/ghost-icon.png" alt="Opensperm" width={36} height={36} className="rounded-xl" />
        <Sparkles size={16} className="text-yellow-400 absolute -top-2 -right-4" />
      </div>
    </Link>

    <nav className="flex flex-col gap-8">
      {navGroups.map((group, idx) => (
        <div key={idx}>
          <h3 className="text-white font-creepster tracking-widest text-sm mb-2 pl-2">{group.title}</h3>
          <div className="w-full h-[2px] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjIiPjxwYXRoIGQ9Ik0wIDEgUSA1MCAwLCAxMDAgMSBUIDIwMCAxIFQgMzAwIDEgVCA0MDAgMSBUIDUwMCAxIFQgNjAwIDEgVCA3MDAgMSBUIDgwMCAxIFQgOTAwIDEgVCAxMDAwIDEiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjMpIiBmaWxsPSJub25lIiBzdHJva2Utd2lkdGg9IjIiLz48L3N2Zz4=')] bg-repeat-x mb-4"></div>
          <ul className="space-y-1">
            {group.links.map((link, lIdx) => {
              const isActive = pathname === link.href;
              return (
                <li key={lIdx}>
                  <Link
                    href={link.href}
                    onClick={onLinkClick}
                    className={`block px-4 py-2 rounded-lg text-sm transition-colors ${isActive ? 'bg-white/10 text-pink-300 font-medium' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
                  >
                    {link.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  </>
);

export function DocsSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-72 flex-shrink-0 h-screen sticky top-0 overflow-y-auto custom-scrollbar py-8 px-6 flex-col z-10">
        <NavContent pathname={pathname} />
      </aside>

      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-[#111111] border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative">
            <Image src="/ghost-icon.png" alt="Opensperm" width={28} height={28} className="rounded-lg" />
            <Sparkles size={12} className="text-yellow-400 absolute -top-1 -right-3" />
          </div>
          <span className="text-white text-sm font-medium ml-1">Docs</span>
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-white/70 hover:text-white p-1"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/60"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <div className={`md:hidden fixed top-0 left-0 h-full w-72 z-50 bg-[#111111] py-8 px-6 overflow-y-auto transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <NavContent pathname={pathname} onLinkClick={() => setMobileOpen(false)} />
      </div>
    </>
  );
}
