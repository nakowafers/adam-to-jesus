"use client";

import type { Ancestor } from "@/lib/genealogy-data";
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

  return (
    <ResearchSheet
      isOpen={isOpen}
      onClose={onClose}
      ariaLabelledBy={selectedId ? "drawer-title" : undefined}
      className={
        isMobile
          ? "inset-x-0 bottom-0 h-[85vh] rounded-t-2xl border-t border-l-0 max-w-none bg-zinc-950 border-zinc-800"
          : "right-0 top-0 h-full w-full max-w-md border-l bg-zinc-950 border-zinc-800"
      }
    >
      {/* Mobile drag handle */}
      {isMobile && (
        <div className="flex justify-center pb-2 pt-3 shrink-0">
          <div className="h-1 w-12 rounded-full bg-zinc-700" />
        </div>
      )}

      {/* Persistent Content Area for SEO */}
      <div className="relative h-full flex-1 flex flex-col">
        {ancestors.map((ancestor) => {
          const isActive = ancestor.id === selectedId;
          const lineageInfo = getLineageInfo(ancestor);

          return (
            <div
              key={ancestor.id}
              className={`absolute inset-0 flex flex-col transition-opacity duration-300 ${
                isActive ? "z-10 opacity-100" : "pointer-events-none opacity-0"
              }`}
              aria-hidden={!isActive}
            >
              {/* Header */}
              <ResearchSheet.Header
                onClose={onClose}
                showCloseButton={isActive}
                className="bg-zinc-950/95"
              >
                <div>
                  <p className={`text-xs font-medium ${lineageInfo.color}`}>
                    {lineageInfo.text}
                  </p>
                  <h2 id={isActive ? "drawer-title" : undefined} className="mt-1 text-2xl font-bold text-zinc-50">
                    {ancestor.name}
                  </h2>
                  <p className="text-sm text-zinc-400">{ancestor.title}</p>
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
                    {ancestor.summary}
                  </p>
                </div>

                {/* Bible Verse */}
                <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-5">
                  <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                    Scripture
                  </h3>
                  <blockquote className="mb-4 border-l-2 border-zinc-700 pl-4 italic leading-relaxed text-zinc-300">
                    &ldquo;{ancestor.verse}&rdquo;
                  </blockquote>
                  <a
                    href={ancestor.verseLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    tabIndex={isOpen && isActive ? 0 : -1}
                    className="inline-flex items-center gap-2 text-sm font-medium text-zinc-400 transition-colors hover:text-zinc-200"
                  >
                    <span>{ancestor.verseReference}</span>
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
          );
        })}
      </div>
    </ResearchSheet>
  );
}
