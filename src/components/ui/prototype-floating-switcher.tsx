'use client';

import { useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface VariantInfo {
  key: string;
  name: string;
  description: string;
}

interface PrototypeFloatingSwitcherProps {
  variants: VariantInfo[];
  currentVariant: string;
}

export function PrototypeFloatingSwitcher({
  variants,
  currentVariant,
}: PrototypeFloatingSwitcherProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentIndex = Math.max(
    0,
    variants.findIndex((v) => v.key.toLowerCase() === currentVariant.toLowerCase())
  );

  const selectVariant = useCallback(
    (key: string) => {
      const params = new URLSearchParams(searchParams?.toString() || '');
      params.set('variant', key);
      router.replace(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  const handlePrev = useCallback(() => {
    const prevIndex = (currentIndex - 1 + variants.length) % variants.length;
    selectVariant(variants[prevIndex].key);
  }, [currentIndex, variants, selectVariant]);

  const handleNext = useCallback(() => {
    const nextIndex = (currentIndex + 1) % variants.length;
    selectVariant(variants[nextIndex].key);
  }, [currentIndex, variants, selectVariant]);

  // Arrow key navigation (ignores inputs/editable elements)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return;
      }

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handlePrev, handleNext]);

  const current = variants[currentIndex] || variants[0];

  return (
    <nav
      aria-label="Prototype Variant Switcher"
      className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1.5 bg-neutral-900/90 text-neutral-100 backdrop-blur-xl border border-neutral-700/80 rounded-full px-3 py-1.5 shadow-2xl ring-1 ring-black/30 font-sans"
    >
      <button
        onClick={handlePrev}
        aria-label="Previous UI Variant (Arrow Left)"
        title="Previous Variant (←)"
        className="p-1 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      <div className="flex items-center gap-1 px-1.5">
        <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-semibold mr-1">
          UI:
        </span>
        {variants.map((v) => {
          const isActive = v.key.toLowerCase() === currentVariant.toLowerCase();
          return (
            <button
              key={v.key}
              onClick={() => selectVariant(v.key)}
              aria-pressed={isActive}
              className={`text-xs px-2.5 py-1 rounded-full font-medium transition-all ${
                isActive
                  ? 'bg-amber-500 text-neutral-950 font-bold shadow-md shadow-amber-500/20'
                  : 'text-neutral-300 hover:text-white hover:bg-neutral-800'
              }`}
            >
              {v.key} <span className="hidden sm:inline opacity-80 text-[11px]">({v.name})</span>
            </button>
          );
        })}
      </div>

      <button
        onClick={handleNext}
        aria-label="Next UI Variant (Arrow Right)"
        title="Next Variant (→)"
        className="p-1 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </nav>
  );
}
