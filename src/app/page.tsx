import { GenealogyTree } from "@/components/genealogy/genealogy-tree";
import { fullAncestors } from "@/lib/lineage-data";
import { getGenealogyJsonLd } from "@/lib/json-ld";

export default function Home() {
  const jsonLd = getGenealogyJsonLd(fullAncestors);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="min-h-screen bg-black">
        <GenealogyTree />
      </main>
    </>
  );
}
