import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { Modules } from '@/components/Modules';
import { Features } from '@/components/Features';
import { Demo } from '@/components/Demo';
import { Integrations } from '@/components/Integrations';
import { Footer } from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen font-sans bg-black">
      <Navbar />
      <Hero />
      <Modules />
      <Features />
      <Demo />
      <Integrations />
      <Footer />
    </main>
  );
}
