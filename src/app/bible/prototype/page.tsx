import React, { Suspense } from "react";
import { VariantA } from "@/components/bible-tui-prototype/variant-a";
import { VariantB } from "@/components/bible-tui-prototype/variant-b";
import { VariantC } from "@/components/bible-tui-prototype/variant-c";
import { PrototypeSwitcher, VariantOption } from "@/components/prototype-switcher";

const VARIANTS: VariantOption[] = [
  {
    key: "A",
    name: "VT100 Amber Phosphor CRT Terminal",
    description: "Monospace amber phosphor theme, ASCII headers, split book index tree & Vim status bar.",
  },
  {
    key: "B",
    name: "Matrix Green Terminal",
    description: "Matrix hacker green CRT canvas, FTS5 inline search highlights & quick action tabs.",
  },
  {
    key: "C",
    name: "Cyberpunk Dual-Pane Scholar Terminal",
    description: "Cyberpunk slate/cyan theme, dual-pane parallel translation comparison (KJV vs WEB vs ASV).",
  },
];

interface PageProps {
  searchParams: Promise<{ variant?: string }>;
}

async function PrototypeContent({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const variant = (resolvedParams?.variant || "A").toUpperCase();

  return (
    <div className="relative min-h-screen bg-black">
      {variant === "A" && <VariantA />}
      {variant === "B" && <VariantB />}
      {variant === "C" && <VariantC />}
      {variant !== "A" && variant !== "B" && variant !== "C" && <VariantA />}

      <PrototypeSwitcher variants={VARIANTS} currentVariant={variant} />
    </div>
  );
}

export default function PrototypePage(props: PageProps) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black text-zinc-400 font-mono p-8">Loading TUI Prototype...</div>}>
      <PrototypeContent {...props} />
    </Suspense>
  );
}
