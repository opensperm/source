import { DocsSidebar } from '@/components/DocsSidebar';

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#111111] bg-noise md:flex font-sans">
      <DocsSidebar />

      {/* Main Content Area */}
      <main className="flex-1 bg-white md:rounded-3xl md:my-4 md:mr-4 overflow-y-auto relative z-10 md:shadow-2xl pt-14 md:pt-0">
        {children}
      </main>
    </div>
  );
}
