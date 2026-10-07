import { Suspense } from 'react';
import type { Metadata } from 'next';
import { PropheciesPrototypeView } from '@/components/scripture/prophecies-prototype-view';

export const metadata: Metadata = {
  title: 'PROTOTYPE: Old Testament Prophecies Fulfilled in the Gospels (ESV)',
  description: 'Interactive throwaway prototype comparing Old Testament prophecies and their Gospel fulfillments in the ESV with 3 UI switchable variants.',
};

interface PageProps {
  searchParams: Promise<{ variant?: string }>;
}

export default async function PropheciesPrototypePage(props: PageProps) {
  const searchParams = await props.searchParams;
  const initialVariant = searchParams.variant || 'A';

  return (
    <main className="min-h-screen bg-[#faf8f5]">
      {/* Prototype Indicator Banner */}
      <div className="bg-amber-500/10 border-b border-amber-500/20 py-1.5 px-4 text-center text-xs font-mono text-amber-800 tracking-wider flex items-center justify-center gap-2">
        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
        <span className="font-semibold">PROTOTYPE MODE</span> — Exploring 3 Mobile-Optimized Variations of Prototype C (?variant=C1 | C2 | C3). Switch via bottom bar or arrow keys.
      </div>

      <Suspense
        fallback={
          <div className="py-24 text-center w-full space-y-3">
            <div className="w-8 h-8 border-2 border-stone-300 border-t-stone-800 rounded-full animate-spin mx-auto" />
            <p className="text-stone-500 text-xs font-mono">Loading prophecies prototype...</p>
          </div>
        }
      >
        <PropheciesPrototypeView initialVariant={initialVariant} />
      </Suspense>
    </main>
  );
}
