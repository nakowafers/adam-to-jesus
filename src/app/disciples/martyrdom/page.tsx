import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getDisciples, type Disciple } from '@/lib/disciples';
import { MartyrdomContainer } from '@/components/disciples/martyrdom-container';
import { History, Bookmark, ChevronRight } from 'lucide-react';
import { getCloudflareContext } from '@opennextjs/cloudflare';

// export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Martyrdom of the Disciples',
  description: 'An interactive historical study of the 12 Disciples of Jesus and their martyrdom.',
};

export default async function MartyrdomPage() {
  let disciples: any[] = [];
  try {
    const context = await getCloudflareContext({ async: true });
    const env = context.env as { DB: any };
    console.log("Cloudflare Context DB:", !!env?.DB);
    disciples = await getDisciples(env?.DB);
  } catch (e) {
    console.error("Failed to fetch from D1, using fallback:", e);
    // Fallback data for debugging
    disciples = [
      { id: 'peter', name: 'Simon Peter', year_of_death: '64 AD', location_of_death: 'Rome', narrative: 'Fallback data', sources: '[]', reliability_score: 90, certainty_level: 'High' }
    ];
  }

  // If still empty after trying D1, use the debug fallback
  if (disciples.length === 0) {
    disciples = [
      { id: 'peter', name: 'Simon Peter', year_of_death: '64 AD', location_of_death: 'Rome', narrative: 'Fallback data', sources: '[]', reliability_score: 90, certainty_level: 'High' }
    ];
  }

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-[#FAFAFA] selection:bg-[#D4AF37]/30 selection:text-[#0A0A0A]">
      <header className="sticky top-[44px] z-40 bg-black/80 backdrop-blur-xl border-b border-[#18181B] py-6 px-6 md:px-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="space-y-1">
            <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#A1A1AA]">
              <span className="hover:text-[#FAFAFA] cursor-pointer transition-colors">Apostles</span>
              <ChevronRight size={10} className="text-[#3F3F46]" />
              <span className="text-[#D4AF37]">Martyrdom</span>
            </nav>
            <h1 className="text-2xl md:text-3xl font-black tracking-tighter text-white">
              The Great Commission&apos;s Price
            </h1>
          </div>
          <div className="hidden md:flex items-center gap-5 text-[#D4AF37]">
            <button
              aria-label="View history"
              title="View history"
              className="p-2.5 bg-[#18181B] border border-[#27272A] rounded-full hover:border-[#D4AF37]/50 transition-all active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0A]"
            >
              <History size={18} />
            </button>
            <button
              aria-label="View bookmarks"
              title="View bookmarks"
              className="p-2.5 bg-[#18181B] border border-[#27272A] rounded-full hover:border-[#D4AF37]/50 transition-all active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0A]"
            >
              <Bookmark size={18} />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <section className="mb-16">
          <p className="text-base md:text-lg text-[#A1A1AA] max-w-2xl leading-relaxed font-medium">
            Explore the historical and scriptural records of the twelve apostles&apos; journeys and their ultimate witness to the faith, preserved within the <span className="text-[#FAFAFA]">Apostolic Archive</span>.
          </p>
        </section>

        <section>
          <Suspense fallback={
            <div className="py-24 text-center w-full space-y-4">
              <div className="w-10 h-10 border-2 border-[#D4AF37]/20 border-t-[#D4AF37] rounded-full animate-spin mx-auto" />
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#D4AF37] animate-pulse">
                Accessing Apostolic Records...
              </p>
            </div>
          }>
            <MartyrdomContainer initialDisciples={disciples} />
          </Suspense>
        </section>
      </div>
    </main>
  );
}
