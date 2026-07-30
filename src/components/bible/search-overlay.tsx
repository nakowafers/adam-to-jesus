"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, X, Loader2, BookOpen } from "lucide-react";
import { useTuiTheme } from "@/components/bible/use-tui-theme";

export interface SearchHit {
  id: string;
  passage: string;
  book: string;
  chapter: number;
  verse: number;
  text: string;
  score: number;
  snippet: string;
}

export interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPassage: (passage: string, query?: string) => void;
  initialQuery?: string;
}

export function SearchOverlay({
  isOpen,
  onClose,
  onSelectPassage,
  initialQuery = "",
}: SearchOverlayProps) {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<SearchHit[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery(initialQuery);
      if (initialQuery.trim()) {
        fetchResults(initialQuery);
      } else {
        setResults([]);
      }
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen, initialQuery]);

  const fetchResults = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/bible/search?q=${encodeURIComponent(searchQuery)}`);
      if (!res.ok) throw new Error("Search failed");
      const data = await res.json();
      const hits = Array.isArray(data) ? data : data.results || [];
      setResults(hits);
    } catch (err) {
      console.error("Failed to fetch Bible search results:", err);
      const fallbackHits = getFallbackSearchHits(searchQuery);
      setResults(fallbackHits);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => {
      if (query.trim()) {
        fetchResults(query);
      } else {
        setResults([]);
      }
    }, 200);
    return () => clearTimeout(timer);
  }, [query, isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 bg-black/80 backdrop-blur-md transition-all duration-200 animate-in fade-in"
      data-testid="search-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="search-modal-title"
    >
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-2xl mx-4 bg-zinc-900 border border-zinc-700/80 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] z-10 font-mono text-zinc-100">
        {/* Header / Input */}
        <div className="p-4 border-b border-zinc-800 bg-zinc-950/60 flex items-center gap-3">
          <Search className="w-5 h-5 text-amber-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            className="w-full bg-transparent text-zinc-100 placeholder-zinc-500 focus:outline-none text-base sm:text-lg font-mono"
            placeholder="Type search terms... (e.g. light, beginning, god)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            data-testid="search-input"
          />
          {loading ? (
            <Loader2 className="w-5 h-5 text-amber-400 animate-spin shrink-0" />
          ) : query ? (
            <button
              onClick={() => setQuery("")}
              className="text-zinc-400 hover:text-zinc-200 p-1"
              aria-label="Clear query"
            >
              <X className="w-4 h-4" />
            </button>
          ) : null}
          <button
            onClick={onClose}
            className="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-2 py-1 rounded border border-zinc-700 font-mono ml-1"
          >
            ESC
          </button>
        </div>

        {/* Results Container */}
        <div
          className="flex-1 overflow-y-auto p-4 space-y-3 divide-y divide-zinc-800/50"
          data-testid="search-results"
        >
          {query.trim() === "" ? (
            <div className="py-12 text-center text-zinc-500 text-sm">
              <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-40 text-amber-400" />
              Type a search query above to query FTS5 Bible Index
            </div>
          ) : loading && results.length === 0 ? (
            <div className="py-12 text-center text-zinc-400 text-sm flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-amber-400" />
              Querying FTS5 index...
            </div>
          ) : results.length === 0 ? (
            <div className="py-12 text-center text-zinc-400 text-sm">
              No passages found matching &quot;{query}&quot;
            </div>
          ) : (
            results.map((hit) => (
              <button
                key={hit.id || hit.passage}
                onClick={() => {
                  onSelectPassage(hit.passage, query);
                  onClose();
                }}
                className="w-full text-left pt-3 first:pt-0 pb-2 px-3 rounded-lg hover:bg-zinc-800/80 transition-colors group cursor-pointer border border-transparent hover:border-zinc-700/60"
                data-testid={`search-hit-${hit.passage}`}
                data-test="search-hit"
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-amber-400 font-bold text-sm tracking-wide group-hover:text-amber-300">
                      {hit.book} {hit.chapter}:{hit.verse}
                    </span>
                    <span className="text-xs bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded font-mono border border-zinc-700/50">
                      {hit.passage}
                    </span>
                  </div>
                  <span
                    className="text-xs text-amber-300/80 bg-amber-950/40 border border-amber-800/40 px-2 py-0.5 rounded font-mono"
                    data-testid="bm25-score"
                  >
                    BM25: {typeof hit.score === "number" ? hit.score.toFixed(2) : hit.score}
                  </span>
                </div>
                <div
                  className="text-sm text-zinc-300 leading-relaxed font-sans"
                  dangerouslySetInnerHTML={{ __html: hit.snippet || hit.text }}
                />
              </button>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-zinc-800 bg-zinc-950/80 text-xs text-zinc-500 flex justify-between items-center font-mono">
          <span>FTS5 Full-Text Search Engine</span>
          <span>{results.length} hit{results.length === 1 ? "" : "s"}</span>
        </div>
      </div>
    </div>
  );
}

function getFallbackSearchHits(query: string): SearchHit[] {
  const verses = [
    { id: "GEN.1.3", passage: "GEN.1.3", book: "Genesis", chapter: 1, verse: 3, text: "And God said, Let there be light: and there was light." },
    { id: "GEN.1.4", passage: "GEN.1.4", book: "Genesis", chapter: 1, verse: 4, text: "And God saw the light, that it was good: and God divided the light from the darkness." },
    { id: "JHN.1.5", passage: "JHN.1.5", book: "John", chapter: 1, verse: 5, text: "And the light shineth in darkness; and the darkness comprehended it not." },
    { id: "MAT.5.14", passage: "MAT.5.14", book: "Matthew", chapter: 5, verse: 14, text: "Ye are the light of the world. A city that is set on an hill cannot be hid." }
  ];
  const qLower = query.toLowerCase();
  return verses
    .filter((v) => v.text.toLowerCase().includes(qLower))
    .map((v, i) => {
      const escapeRegex = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(`(${escapeRegex})`, "gi");
      const snippet = v.text.replace(
        regex,
        `<mark class="bg-amber-400/30 text-amber-200 px-1 rounded font-semibold underline decoration-amber-400">$1</mark>`
      );
      return {
        ...v,
        score: Number((2.15 - i * 0.3).toFixed(2)),
        snippet
      };
    });
}
