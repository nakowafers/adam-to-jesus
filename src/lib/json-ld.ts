import { Ancestor } from "./lineage-data";

/**
 * Formats the ancestor lineage into a Schema.org ItemList JSON-LD structure.
 * This provides search engines with structured data about the chronological flow
 * of the genealogy from Adam to Jesus.
 */
export function getGenealogyJsonLd(ancestors: Ancestor[]) {
  // Sort ancestors by generation to maintain chronological flow
  const sortedAncestors = [...ancestors].sort((a, b) => a.generation - b.generation);

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "The Lineage of Jesus from Adam | Interactive Genealogy",
    "description": "A comprehensive chronological flow of the genealogy of Jesus Christ starting from Adam, including the Royal and Biological lines as recorded in Matthew 1 and Luke 3 (NLT).",
    "itemListElement": sortedAncestors.map((ancestor, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Person",
        "name": ancestor.name,
        "jobTitle": ancestor.title,
        "description": `${ancestor.summary} Scripture: ${ancestor.verse} — ${ancestor.verseReference}`,
        "url": `https://fromadamtojesus.com/#${ancestor.id}`,
        "identifier": ancestor.id
      }
    }))
  };
}
