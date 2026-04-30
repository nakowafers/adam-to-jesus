'use client'

import { GenealogyTree } from "@/components/genealogy/genealogy-tree";
import { fullAncestors } from "@/lib/lineage-data";
import { getGenealogyJsonLd } from "@/lib/json-ld";
import { KofiOverlay } from "@/components/ui/kofi-overlay";

export default function Home() {
  const jsonLd = getGenealogyJsonLd(fullAncestors);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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
