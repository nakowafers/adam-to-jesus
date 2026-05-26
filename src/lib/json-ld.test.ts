import { expect, test, describe } from "bun:test";
import { getGenealogyJsonLd } from "./json-ld";
import type { Ancestor } from "./lineage-data";

describe("getGenealogyJsonLd", () => {
  const baseJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "The Lineage of Jesus from Adam | Interactive Genealogy",
    description: "A comprehensive chronological flow of the genealogy of Jesus Christ starting from Adam, including the Royal and Biological lines as recorded in Matthew 1 and Luke 3 (NLT).",
  };

  test("handles empty array correctly", () => {
    const result = getGenealogyJsonLd([]);
    expect(result).toEqual({
      ...baseJsonLd,
      itemListElement: [],
    });
  });

  test("maps ancestor data correctly", () => {
    const mockAncestor: Ancestor = {
      id: "adam",
      name: "Adam",
      title: "The First Man",
      summary: "First human.",
      verse: "Then the Lord God formed the man...",
      verseReference: "Genesis 2:7",
      verseLink: "https://www.bible.com/...",
      lineage: "main",
      generation: 1,
    };

    const result = getGenealogyJsonLd([mockAncestor]);

    expect(result.itemListElement).toHaveLength(1);
    expect(result.itemListElement[0]).toEqual({
      "@type": "ListItem",
      position: 1,
      item: {
        "@type": "Person",
        name: "Adam",
        jobTitle: "The First Man",
        description: "First human. Scripture: Then the Lord God formed the man... — Genesis 2:7",
        url: "https://fromadamtojesus.com/#adam",
        identifier: "adam",
      },
    });
  });

  test("sorts ancestors by generation chronologically", () => {
    const ancestorGen3: Ancestor = {
      id: "enosh",
      name: "Enosh",
      title: "Patriarch",
      summary: "Son of Seth.",
      verse: "...",
      verseReference: "...",
      verseLink: "...",
      lineage: "main",
      generation: 3,
    };

    const ancestorGen1: Ancestor = {
      id: "adam",
      name: "Adam",
      title: "The First Man",
      summary: "First human.",
      verse: "...",
      verseReference: "...",
      verseLink: "...",
      lineage: "main",
      generation: 1,
    };

    const ancestorGen2: Ancestor = {
      id: "seth",
      name: "Seth",
      title: "Patriarch",
      summary: "Son of Adam.",
      verse: "...",
      verseReference: "...",
      verseLink: "...",
      lineage: "main",
      generation: 2,
    };

    const result = getGenealogyJsonLd([ancestorGen3, ancestorGen1, ancestorGen2]);

    expect(result.itemListElement).toHaveLength(3);

    // Check positions and correct sorting
    expect(result.itemListElement[0].position).toBe(1);
    expect(result.itemListElement[0].item.identifier).toBe("adam");

    expect(result.itemListElement[1].position).toBe(2);
    expect(result.itemListElement[1].item.identifier).toBe("seth");

    expect(result.itemListElement[2].position).toBe(3);
    expect(result.itemListElement[2].item.identifier).toBe("enosh");
  });
});
