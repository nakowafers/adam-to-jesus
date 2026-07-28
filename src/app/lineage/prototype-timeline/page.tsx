import { Suspense } from 'react';
import type { Metadata } from 'next';
import { lineageRepository } from '@/lib/lineage-repository';
import { PrototypeTimelineView } from '@/components/genealogy/prototype-timeline-view';

export const metadata: Metadata = {
  title: 'PROTOTYPE: Flat & Simplified Lineage Timeline',
  description: 'Throwaway UI prototype answering Issue #23: How should the responsive parallel timeline and side-by-side detail panel behave?',
};

export default async function PrototypeTimelinePage() {
  const graph = await lineageRepository.getLineageGraph();

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col relative selection:bg-amber-500/30 selection:text-amber-200">
      {/* Prototype Warning Banner */}
      <div className="bg-amber-500/10 border-b border-amber-500/20 py-2 px-4 text-center text-xs font-mono text-amber-400 tracking-wider uppercase flex items-center justify-center gap-2">
        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
        PROTOTYPE MODE — Throwaway UI Exploration for Issue #23 (Delete or absorb when validated)
      </div>

      <Suspense fallback={
        <div className="py-24 text-center w-full space-y-4">
          <div className="w-10 h-10 border-2 border-amber-500/20 border-t-amber-500 rounded-full animate-spin mx-auto" />
          <p className="text-zinc-400 text-sm font-mono">Loading prototype lineage graph...</p>
        </div>
      }>
        <PrototypeTimelineView initialGraph={graph} />
      </Suspense>
    </main>
  );
}
