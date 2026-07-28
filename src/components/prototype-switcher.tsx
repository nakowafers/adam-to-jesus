"use client";

import React, { useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface VariantOption {
  key: string;
  name: string;
  description: string;
}

interface PrototypeSwitcherProps {
  variants: VariantOption[];
  currentVariant: string;
}

export function PrototypeSwitcher({ variants, currentVariant }: PrototypeSwitcherProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const currentIndex = Math.max(
    0,
    variants.findIndex((v) => v.key.toUpperCase() === currentVariant.toUpperCase())
  );

  const activeVariant = variants[currentIndex] || variants[0];

  const switchVariant = (newKey: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("variant", newKey);
    router.replace(`${pathname}?${params.toString()}`);
  };

  const handlePrev = () => {
    const prevIndex = (currentIndex - 1 + variants.length) % variants.length;
    switchVariant(variants[prevIndex].key);
  };

  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % variants.length;
    switchVariant(variants[nextIndex].key);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = document.activeElement?.tagName?.toLowerCase();
      if (activeTag === "input" || activeTag === "textarea" || (document.activeElement as HTMLElement)?.isContentEditable) {
        return;
      }

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, variants]);

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-zinc-950/90 text-zinc-100 border border-zinc-700/80 backdrop-blur-md px-4 py-2 rounded-full shadow-2xl transition-all">
      <button
        onClick={handlePrev}
        className="p-1.5 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 transition"
        title="Previous Variant (←)"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <div className="flex flex-col items-center px-2 min-w-[200px]">
        <div className="flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider text-amber-400">
          <span>PROTOTYPE SWITCHER</span>
          <span className="bg-amber-400/20 text-amber-300 px-1.5 py-0.5 rounded text-[10px]">
            {activeVariant.key}
          </span>
        </div>
        <span className="text-xs font-mono text-zinc-300 truncate max-w-[260px]">
          {activeVariant.name}
        </span>
      </div>

      <button
        onClick={handleNext}
        className="p-1.5 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 transition"
        title="Next Variant (→)"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
