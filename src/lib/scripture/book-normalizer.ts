export interface BookMetadata {
  id: string;
  name: string;
}

export const CANONICAL_BOOKS: Record<string, BookMetadata> = {
  GEN: { id: "GEN", name: "Genesis" },
  EXO: { id: "EXO", name: "Exodus" },
  LEV: { id: "LEV", name: "Leviticus" },
  NUM: { id: "NUM", name: "Numbers" },
  DEU: { id: "DEU", name: "Deuteronomy" },
  PSA: { id: "PSA", name: "Psalms" },
  PRO: { id: "PRO", name: "Proverbs" },
  ISA: { id: "ISA", name: "Isaiah" },
  JER: { id: "JER", name: "Jeremiah" },
  MAT: { id: "MAT", name: "Matthew" },
  MRK: { id: "MRK", name: "Mark" },
  LUK: { id: "LUK", name: "Luke" },
  JHN: { id: "JHN", name: "John" },
  ACT: { id: "ACT", name: "Acts" },
  ROM: { id: "ROM", name: "Romans" },
  REV: { id: "REV", name: "Revelation" },
};

const BOOK_ALIAS_MAP: Record<string, string> = {
  GEN: "GEN",
  GENESIS: "GEN",
  EXO: "EXO",
  EXODUS: "EXO",
  LEV: "LEV",
  LEVITICUS: "LEV",
  NUM: "NUM",
  NUMBERS: "NUM",
  DEU: "DEU",
  DEUTERONOMY: "DEU",
  PSA: "PSA",
  PSALM: "PSA",
  PSALMS: "PSA",
  PRO: "PRO",
  PROVERBS: "PRO",
  ISA: "ISA",
  ISAIAH: "ISA",
  JER: "JER",
  JEREMIAH: "JER",
  MAT: "MAT",
  MATTHEW: "MAT",
  MRK: "MRK",
  MARK: "MRK",
  LUK: "LUK",
  LUKE: "LUK",
  JHN: "JHN",
  JN: "JHN",
  JOHN: "JHN",
  ACT: "ACT",
  ACTS: "ACT",
  ROM: "ROM",
  ROMANS: "ROM",
  REV: "REV",
  REVELATION: "REV",
  REVELATIONS: "REV",
};

/**
 * Normalizes any book input string or abbreviation into its canonical 3-letter USFM code.
 * Defaults to the uppercase 3-letter prefix if unrecognized.
 */
export function normalizeBookCode(input: string): string {
  const clean = (input || "").toUpperCase().trim().replace(/[^A-Z0-9]/g, "");
  if (BOOK_ALIAS_MAP[clean]) {
    return BOOK_ALIAS_MAP[clean];
  }

  // Prefix matching
  if (clean.startsWith("GEN")) return "GEN";
  if (clean.startsWith("EXO")) return "EXO";
  if (clean.startsWith("LEV")) return "LEV";
  if (clean.startsWith("NUM")) return "NUM";
  if (clean.startsWith("DEU")) return "DEU";
  if (clean.startsWith("PSA") || clean.startsWith("PS")) return "PSA";
  if (clean.startsWith("PRO")) return "PRO";
  if (clean.startsWith("ISA")) return "ISA";
  if (clean.startsWith("JER")) return "JER";
  if (clean.startsWith("MAT")) return "MAT";
  if (clean.startsWith("MRK") || clean.startsWith("MARK")) return "MRK";
  if (clean.startsWith("LUK") || clean.startsWith("LUKE")) return "LUK";
  if (clean.startsWith("JHN") || clean.startsWith("JOHN") || clean === "JN") return "JHN";
  if (clean.startsWith("ACT")) return "ACT";
  if (clean.startsWith("ROM")) return "ROM";
  if (clean.startsWith("REV")) return "REV";

  return clean.slice(0, 3) || "ISA";
}

/**
 * Retrieves the canonical BookMetadata (id and name) for a given book name or code.
 */
export function getBookMetadata(input: string): BookMetadata {
  const bookId = normalizeBookCode(input);
  if (CANONICAL_BOOKS[bookId]) {
    return CANONICAL_BOOKS[bookId];
  }
  return {
    id: bookId,
    name: input || "Isaiah",
  };
}

/**
 * Normalizes passage string with dot notation, e.g. "John.3" -> "JHN.3", "ISAIAH.6" -> "ISA.6".
 */
export function normalizePassageKey(passageStr: string): string {
  const parts = passageStr.split(".");
  if (parts.length < 2) return passageStr;
  const normBook = normalizeBookCode(parts[0]);
  return [normBook, ...parts.slice(1)].join(".");
}
