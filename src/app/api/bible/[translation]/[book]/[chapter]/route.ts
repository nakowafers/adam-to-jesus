import { NextRequest, NextResponse } from "next/server";
import { scriptureRepository } from "@/lib/scripture/scripture-repository";

export const runtime = "edge";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ translation: string; book: string; chapter: string }> }
) {
  try {
    const { translation, book, chapter } = await params;
    const passage = await scriptureRepository.getPassage({
      book,
      chapter: parseInt(chapter, 10) || 1,
      translation,
    });

    return NextResponse.json(passage);
  } catch (fatalError) {
    console.error("Fatal error in passage API route:", fatalError);
    const fallbackPassage = await scriptureRepository.getPassage({
      book: "ISA",
      chapter: 6,
      translation: "ESV",
    });
    return NextResponse.json(fallbackPassage, { status: 200 });
  }
}
