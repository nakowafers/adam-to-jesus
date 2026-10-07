"use client";

import { useState, useEffect } from "react";
import type { Ancestor } from "@/lib/lineage-data";
import { useIsMobile } from "@/hooks/use-mobile";
import { ResearchSheet } from "@/components/ui/research-sheet";

interface AncestorDrawerProps {
  ancestors: Ancestor[];
  selectedId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export function AncestorDrawer({
  ancestors,
  selectedId,
  isOpen,
  onClose,
}: AncestorDrawerProps) {
  const isMobile = useIsMobile();

  const [cachedAncestor, setCachedAncestor] = useState<Ancestor | null>(() => {
    return selectedId ? ancestors?.find((a) => a.id === selectedId) ?? null : null;
  });

  useEffect(() => {
    if (selectedId) {
      const found = ancestors?.find((a) => a.id === selectedId);
      if (found) {
        setCachedAncestor(found);
      }
    }
  }, [selectedId, ancestors]);

  const activeAncestor = selectedId
    ? ancestors?.find((a) => a.id === selectedId) ?? null
    : null;
  const displayAncestor = activeAncestor ?? cachedAncestor;

  const getLineageInfo = (ancestor: Ancestor | undefined) => {
    switch (ancestor?.lineage) {
      case "royal":
        return { text: "Royal Line (Matthew)", color: "text-amber-500" };
      case "biological":
        return { text: "Biological Line (Luke)", color: "text-emerald-500" };
      default:
        return { text: "Main Lineage", color: "text-zinc-400" };
    }
  };

  const lineageInfo = getLineageInfo(displayAncestor ?? undefined);

  return (
    <ResearchSheet
      isOpen={isOpen}
      onClose={onClose}
      ariaLabelledBy={displayAncestor ? "drawer-title" : undefined}
      direction={isMobile ? "bottom" : "right"}
      className={
        isMobile
          ? "inset-x-0 bottom-0 h-[85dvh] max-h-[85dvh] pb-[env(safe-area-inset-bottom)] rounded-t-2xl border-t border-l-0 max-w-none bg-zinc-950 border-zinc-800"
          : "right-0 top-0 h-full w-full max-w-md border-l bg-zinc-950 border-zinc-800"
      }
    >
      {/* Mobile drag handle */}
      {isMobile && (
        <div className="flex justify-center pb-2 pt-3 shrink-0">
          <div className="h-1 w-12 rounded-full bg-zinc-700" />
        </div>
      )}

      {displayAncestor && (
        <div className="relative flex-1 flex flex-col min-h-0">
          {/* Header */}
          <ResearchSheet.Header
            onClose={onClose}
            showCloseButton={true}
            className="bg-zinc-950/95"
          >
            <div>
              <p className={`text-xs font-medium ${lineageInfo.color}`}>
                {lineageInfo.text}
              </p>
              <h2 id="drawer-title" className="mt-1 text-2xl font-bold text-zinc-50">
                {displayAncestor.name}
              </h2>
              <p className="text-sm text-zinc-400">{displayAncestor.title}</p>
            </div>
          </ResearchSheet.Header>

          {/* Body Content */}
          <ResearchSheet.Body className="py-6 px-6">
            {/* Summary */}
            <div className="mb-8">
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Summary
              </h3>
              <p className="leading-relaxed text-zinc-300">
                {displayAncestor.summary}
              </p>
            </div>

            {/* Bible Verse */}
            <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-5">
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Scripture
              </h3>
              <blockquote className="mb-4 border-l-2 border-zinc-700 pl-4 italic leading-relaxed text-zinc-300">
                &ldquo;{displayAncestor.verse}&rdquo;
              </blockquote>
              <a
                href={displayAncestor.verseLink}
                target="_blank"
                rel="noopener noreferrer"
                tabIndex={isOpen ? 0 : -1}
                className="min-h-[44px] py-2 inline-flex items-center gap-2 text-sm font-medium text-zinc-300 transition-colors hover:text-zinc-100"
              >
                <span>{displayAncestor.verseReference}</span>
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            </div>
          </ResearchSheet.Body>
        </div>
      )}
    </ResearchSheet>
  );
}
