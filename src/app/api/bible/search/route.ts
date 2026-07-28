import { NextResponse } from "next/server";


export interface BibleVerse {
  id: string;
  passage: string;
  book: string;
  chapter: number;
  verse: number;
  text: string;
}

const BIBLE_VERSES: BibleVerse[] = [
  {
    id: "GEN.1.1",
    passage: "GEN.1.1",
    book: "Genesis",
    chapter: 1,
    verse: 1,
    text: "In the beginning God created the heaven and the earth.",
  },
  {
    id: "GEN.1.3",
    passage: "GEN.1.3",
    book: "Genesis",
    chapter: 1,
    verse: 3,
    text: "And God said, Let there be light: and there was light.",
  },
  {
    id: "GEN.1.4",
    passage: "GEN.1.4",
    book: "Genesis",
    chapter: 1,
    verse: 4,
    text: "And God saw the light, that it was good: and God divided the light from the darkness.",
  },
  {
    id: "GEN.1.27",
    passage: "GEN.1.27",
    book: "Genesis",
    chapter: 1,
    verse: 27,
    text: "So God created man in his own image, in the image of God created he him; male and female created he them.",
  },
  {
    id: "MAT.1.1",
    passage: "MAT.1.1",
    book: "Matthew",
    chapter: 1,
    verse: 1,
    text: "The book of the generation of Jesus Christ, the son of David, the son of Abraham.",
  },
  {
    id: "MAT.5.14",
    passage: "MAT.5.14",
    book: "Matthew",
    chapter: 5,
    verse: 14,
    text: "Ye are the light of the world. A city that is set on an hill cannot be hid.",
  },
  {
    id: "JHN.1.1",
    passage: "JHN.1.1",
    book: "John",
    chapter: 1,
    verse: 1,
    text: "In the beginning was the Word, and the Word was with God, and the Word was God.",
  },
  {
    id: "JHN.1.5",
    passage: "JHN.1.5",
    book: "John",
    chapter: 1,
    verse: 5,
    text: "And the light shineth in darkness; and the darkness comprehended it not.",
  },
  {
    id: "JHN.3.16",
    passage: "JHN.3.16",
    book: "John",
    chapter: 3,
    verse: 16,
    text: "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.",
  },
  {
    id: "PSA.23.1",
    passage: "PSA.23.1",
    book: "Psalms",
    chapter: 23,
    verse: 1,
    text: "The LORD is my shepherd; I shall not want.",
  },
  {
    id: "REV.22.21",
    passage: "REV.22.21",
    book: "Revelation",
    chapter: 22,
    verse: 21,
    text: "The grace of our Lord Jesus Christ be with you all. Amen.",
  },
];

export interface SearchHitResult extends BibleVerse {
  score: number;
  snippet: string;
}

function calculateBM25AndSnippet(
  verse: BibleVerse,
  terms: string[],
  avgDocLength: number
): { score: number; snippet: string } | null {
  const textLower = verse.text.toLowerCase();
  const words = textLower.match(/\b\w+\b/g) || [];
  const docLength = words.length;

  let totalScore = 0;
  let matchesCount = 0;

  const k1 = 1.2;
  const b = 0.75;

  for (const term of terms) {
    if (!term) continue;
    const termLower = term.toLowerCase();
    const termRegex = new RegExp(`\\b${termLower}`, "gi");
    const matches = verse.text.match(termRegex);
    const tf = matches ? matches.length : 0;

    if (tf > 0) {
      matchesCount += tf;
      const idf = 1.5 + Math.log(10 / (tf + 1));
      const numerator = tf * (k1 + 1);
      const denominator = tf + k1 * (1 - b + b * (docLength / avgDocLength));
      totalScore += idf * (numerator / denominator);
    }
  }

  if (matchesCount === 0) return null;

  const roundedScore = Math.round(totalScore * 100) / 100;

  let snippet = verse.text;
  for (const term of terms) {
    if (!term) continue;
    const escapeRegex = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(${escapeRegex})`, "gi");
    snippet = snippet.replace(
      regex,
      `<mark class="bg-amber-400/30 text-amber-200 px-1 rounded font-semibold underline decoration-amber-400">$1</mark>`
    );
  }

  return {
    score: Number(roundedScore.toFixed(2)),
    snippet,
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || "";

  if (!q.trim()) {
    return NextResponse.json({ query: q, total: 0, results: [] });
  }

  const terms = q
    .trim()
    .split(/\s+/)
    .filter((t) => t.length > 0);

  const avgDocLength =
    BIBLE_VERSES.reduce(
      (acc, v) => acc + (v.text.match(/\b\w+\b/g)?.length || 0),
      0
    ) / BIBLE_VERSES.length;

  const hits: SearchHitResult[] = [];

  for (const verse of BIBLE_VERSES) {
    const res = calculateBM25AndSnippet(verse, terms, avgDocLength);
    if (res) {
      hits.push({
        ...verse,
        score: res.score,
        snippet: res.snippet,
      });
    }
  }

  hits.sort((a, b) => b.score - a.score);

  return NextResponse.json({
    query: q,
    total: hits.length,
    results: hits,
  });
}
