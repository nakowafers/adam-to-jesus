import type { Metadata } from 'next';
import { Suspense } from 'react';

import { GenealogyTree } from "@/components/genealogy/genealogy-tree";
import { lineageRepository } from "@/lib/lineage-repository";
import { getGenealogyJsonLd } from "@/lib/json-ld";
import { KofiOverlay } from "@/components/ui/kofi-overlay";

export const metadata: Metadata = {
  title: 'The Lineage of Jesus from Adam',
  description: 'Explore the complete biblical family tree from Adam to Jesus Christ. Trace the Royal line through Matthew 1 and the Biological line through Luke 3 in this interactive visualization. All scripture references use the New Living Translation (NLT).',
  keywords: [
    'Genealogy of Jesus',
    'Adam to Jesus timeline',
    'Biblical family tree',
    'Matthew 1',
    'Luke 3',
    'Bible genealogy',
    'Jesus lineage',
    'Royal line of David',
    'Biological line of Jesus',
    'NLT Bible genealogy',
    'interactive genealogy',
    'biblical ancestry',
  ],
  openGraph: {
    title: 'The Lineage of Jesus from Adam',
    description: 'Explore the complete biblical family tree from Adam to Jesus Christ. Trace the Royal line through Matthew 1 and the Biological line through Luke 3 in this interactive visualization.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Lineage of Jesus from Adam',
    description: 'Explore the complete biblical family tree from Adam to Jesus Christ. Trace the Royal line through Matthew 1 and the Biological line through Luke 3 in this interactive visualization.',
  },
};

export default async function LineagePage() {
  const graph = await lineageRepository.getLineageGraph();
  const allAncestors = await lineageRepository.getAllAncestors();
  const jsonLd = getGenealogyJsonLd(allAncestors);
  const jsonLdString = JSON.stringify(jsonLd);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString }}
      />
      <KofiOverlay />
      <main className="min-h-screen bg-black flex flex-col">
        <div className="flex-1">
          <Suspense fallback={
            <div className="py-24 text-center w-full space-y-4">
              <div className="w-10 h-10 border-2 border-amber-500/20 border-t-amber-500 rounded-full animate-spin mx-auto" />
            </div>
          }>
            <GenealogyTree initialGraph={graph} />
          </Suspense>
        </div>
        <footer className="py-12 flex flex-col gap-6 justify-center items-center border-t border-zinc-900 bg-black/50 backdrop-blur-sm">
          <p className="text-zinc-500 text-sm font-medium tracking-wide">
            Created with faith, by Nicola <span role="img" aria-label="cross" className="ml-1 text-zinc-400">✝️</span>
          </p>
        </footer>
      </main>
    </>
  );
}
