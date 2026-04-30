"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import type { Ancestor } from "@/lib/genealogy-data";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const activeAncestor = ancestors.find(a => a.id === selectedId);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

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
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden="true"
      />

      {/* Drawer Container */}
      <div
        className={`fixed z-50 overflow-hidden border-zinc-800 bg-zinc-950 transition-transform duration-500 ease-in-out ${
          isMobile
            ? `inset-x-0 bottom-0 max-h-[85vh] rounded-t-2xl border-t ${
                isOpen ? "translate-y-0" : "translate-y-full"
              }`
            : `right-0 top-0 h-full w-full max-w-md border-l ${
                isOpen ? "translate-x-0" : "translate-x-full"
              }`
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
      >
        {/* Mobile drag handle */}
        {isMobile && (
          <div className="flex justify-center pb-2 pt-3">
            <div className="h-1 w-12 rounded-full bg-zinc-700" />
          </div>
        )}

        {/* Persistent Content Area for SEO */}
        <div className="relative h-full flex flex-col">
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
                <div className="sticky top-0 z-10 border-b border-zinc-800 bg-zinc-950/95 px-6 py-4 backdrop-blur-sm">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className={`text-xs font-medium ${lineageInfo.color}`}>
                        {lineageInfo.text}
                      </p>
                      <h2 id={isActive ? "drawer-title" : undefined} className="mt-1 text-2xl font-bold text-zinc-50">
                        {ancestor.name}
                      </h2>
                      <p className="text-sm text-zinc-400">{ancestor.title}</p>
                    </div>
                    <button
                      onClick={onClose}
                      aria-label="Close details"
                      className="rounded-lg p-2 text-zinc-500 transition-colors hover:bg-zinc-900 hover:text-zinc-300"
                    >
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto px-6 py-6">
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
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
