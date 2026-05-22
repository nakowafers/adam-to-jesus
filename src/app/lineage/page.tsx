import type { Metadata } from 'next'

import { GenealogyTree } from "@/components/genealogy/genealogy-tree";
import { fullAncestors } from "@/lib/lineage-data";
import { getGenealogyJsonLd } from "@/lib/json-ld";
import { KofiOverlay } from "@/components/ui/kofi-overlay";

const jsonLd = getGenealogyJsonLd(fullAncestors);
const jsonLdString = JSON.stringify(jsonLd);

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

export default function LineagePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString }}
      />
      <KofiOverlay />
      <main className="min-h-screen bg-black flex flex-col">
        <div className="flex-1">
          <GenealogyTree />
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
