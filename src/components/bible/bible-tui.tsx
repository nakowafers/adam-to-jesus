"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Terminal as TermIcon,
  Columns,
  Search as SearchIcon,
  BookOpen,
  Bookmark as BookmarkIcon,
  Sparkles,
  Loader2,
} from "lucide-react";
import { AsciiLogo } from "@/components/bible/ascii-logo";
import { SearchOverlay } from "@/components/bible/search-overlay";
import { useTuiTheme, TuiThemeName, THEME_LIST, TUI_THEMES } from "@/components/bible/use-tui-theme";

interface Verse {
  verse: number;
  text: string;
}

export interface Bookmark {
  key: string;
  passage: string;
  verse: number;
  reference: string;
  text: string;
}

interface HistoryEntry {
  id: string;
  text: string;
  passage?: string;
  verseIdx?: number;
}

interface PassageData {
  book: string;
  chapter: number;
  verses: Verse[];
}

const STATIC_BIBLE_DATA: Record<string, Record<string, PassageData>> = {
  KJV: {
    "JOHN.3": {
      book: "John",
      chapter: 3,
      verses: [
        { verse: 1, text: "There was a man of the Pharisees, named Nicodemus, a ruler of the Jews:" },
        { verse: 2, text: "The same came to Jesus by night, and said unto him, Rabbi, we know that thou art a teacher come from God..." },
        { verse: 3, text: "Jesus answered and said unto him, Verily, verily, I say unto thee, Except a man be born again, he cannot see the kingdom of God." },
        { verse: 16, text: "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life." },
        { verse: 17, text: "For God sent not his Son into the world to condemn the world; but that the world through him might be saved." },
      ],
    },
    "GEN.1": {
      book: "Genesis",
      chapter: 1,
      verses: [
        { verse: 1, text: "In the beginning God created the heaven and the earth." },
        { verse: 2, text: "And the earth was without form, and void; and darkness was upon the face of the deep." },
        { verse: 3, text: "And God said, Let there be light: and there was light." },
        { verse: 4, text: "And God saw the light, that it was good: and God divided the light from the darkness." },
        { verse: 5, text: "And God called the light Day, and the darkness he called Night." },
      ],
    },
    "ISA.6": {
      book: "Isaiah",
      chapter: 6,
      verses: [
        { verse: 1, text: "In the year that king Uzziah died I saw also the Lord sitting upon a throne, high and lifted up, and his train filled the temple." },
        { verse: 2, text: "Above it stood the seraphims: each one had six wings; with twain he covered his face, and with twain he covered his feet, and with twain he did fly." },
        { verse: 3, text: "And one cried unto another, and said, Holy, holy, holy, is the LORD of hosts: the whole earth is full of his glory." },
        { verse: 4, text: "And the posts of the door moved at the voice of him that cried, and the house was filled with smoke." },
        { verse: 5, text: "Then said I, Woe is me! for I am undone; because I am a man of unclean lips, and I dwell in the midst of a people of unclean lips: for mine eyes have seen the King, the LORD of hosts." },
        { verse: 6, text: "Then flew one of the seraphims unto me, having a live coal in his hand, which he had taken with the tongs from off the altar:" },
        { verse: 7, text: "And he laid it upon my mouth, and said, Lo, this hath touched thy lips; and thine iniquity is taken away, and thy sin purged." },
        { verse: 8, text: "Also I heard the voice of the Lord, saying, Whom shall I send, and who will go for us? Then said I, Here am I; send me." },
        { verse: 9, text: "And he said, Go, and tell this people, Hear ye indeed, but understand not; and see ye indeed, but perceive not." },
      ],
    },
    "MAT.1": {
      book: "Matthew",
      chapter: 1,
      verses: [
        { verse: 1, text: "The book of the generation of Jesus Christ, the son of David, the son of Abraham." },
        { verse: 2, text: "Abraham begat Isaac; and Isaac begat Jacob; and Jacob begat Judas and his brethren..." },
        { verse: 17, text: "So all the generations from Abraham to David are fourteen generations; and from David until the carrying away into Babylon are fourteen generations; and from the carrying away into Babylon unto Christ are fourteen generations." },
      ],
    },
    "PSA.23": {
      book: "Psalms",
      chapter: 23,
      verses: [
        { verse: 1, text: "The LORD is my shepherd; I shall not want." },
        { verse: 2, text: "He maketh me to lie down in green pastures: he leadeth me beside the still waters." },
        { verse: 3, text: "He restoreth my soul: he leadeth me in the paths of righteousness for his name's sake." },
      ],
    },
  },
};

const BOOKMARK_STORAGE_KEY = "bible_tui_bookmarks";

function parsePassageInput(input: string): { book: string; chapter: number } | null {
  const clean = input.trim().toLowerCase().replace(/^:read\s*/, "").replace(/^read\s*/, "").replace(/^:goto\s*/, "");
  
  const match = clean.match(/^([a-z0-9\s]+?)[\s\.:]+(\d+)/i);
  if (match) {
    const bookStr = match[1].trim();
    const chNum = parseInt(match[2], 10);
    return { book: bookStr, chapter: chNum };
  }

  if (clean.includes("isaiah") || clean.startsWith("isa")) return { book: "ISA", chapter: 6 };
  if (clean.includes("genesis") || clean.startsWith("gen")) return { book: "GEN", chapter: 1 };
  if (clean.includes("john") || clean.startsWith("jhn")) return { book: "JHN", chapter: 3 };
  if (clean.includes("matthew") || clean.startsWith("mat")) return { book: "MAT", chapter: 1 };
  if (clean.includes("psalm") || clean.startsWith("psa") || clean.startsWith("ps")) return { book: "PSA", chapter: 23 };
  
  return null;
}

export function BibleTui() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { theme, themeConfig, setTheme, cycleTheme } = useTuiTheme();

  // URL state synchronization (BibleTuiSession)
  const currentPassage = searchParams.get("passage") || "JOHN.3";
  const currentTranslation = (searchParams.get("translation") || "KJV").toUpperCase();

  const [selectedVerseIdx, setSelectedVerseIdx] = useState(0);
  const [compareMode, setCompareMode] = useState(false);
  const [secondaryTranslation, setSecondaryTranslation] = useState<"WEB" | "ASV">("WEB");
  const [commandInput, setCommandInput] = useState("");
  const [commandHistory, setCommandHistory] = useState<HistoryEntry[]>([
    { id: "init-1", text: "Cloudflare D1 Edge Bible Engine initialized." },
    { id: "init-2", text: "Type :read Isaiah 6, :read John 3, :search light, :theme [name], or press / to focus CLI prompt." },
  ]);
  const [isCommandFocused, setIsCommandFocused] = useState(false);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [dynamicPassages, setDynamicPassages] = useState<Record<string, PassageData>>({});
  const [loadingPassage, setLoadingPassage] = useState(false);

  // Search Overlay State (Issue #32)
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchInitialQuery, setSearchInitialQuery] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch passage dynamically if not in static cache
  const getPassageData = (translation: string, passageKey: string): PassageData => {
    if (dynamicPassages[passageKey]) return dynamicPassages[passageKey];
    if (STATIC_BIBLE_DATA[translation]?.[passageKey]) return STATIC_BIBLE_DATA[translation][passageKey];
    if (STATIC_BIBLE_DATA["KJV"]?.[passageKey]) return STATIC_BIBLE_DATA["KJV"][passageKey];

    return (
      STATIC_BIBLE_DATA["KJV"]["JOHN.3"]
    );
  };

  const primaryData = getPassageData(currentTranslation, currentPassage);
  const secondaryData = getPassageData(secondaryTranslation, currentPassage);

  // Hydrate bookmarks from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(BOOKMARK_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setBookmarks(parsed);
        }
      }
    } catch (e) {
      console.error("Failed to load bookmarks from localStorage", e);
    }
  }, []);

  const fetchPassageFromApi = async (book: string, chapter: number, translation: string) => {
    setLoadingPassage(true);
    try {
      const res = await fetch(`/api/bible/${translation}/${encodeURIComponent(book)}/${chapter}`);
      if (res.ok) {
        const data = await res.json();
        const pKey = data.passageKey || `${data.bookId || book.toUpperCase()}.${chapter}`;
        const newPassage: PassageData = {
          book: data.book,
          chapter: data.chapter,
          verses: data.verses || [],
        };
        setDynamicPassages((prev) => ({ ...prev, [pKey]: newPassage }));
        updateUrlState(pKey, translation);
        setSelectedVerseIdx(0);
        addHistoryLine(`Loaded passage ${data.book} Chapter ${data.chapter} via D1 API.`);
      } else {
        addHistoryLine(`Failed to fetch ${book} ${chapter}.`);
      }
    } catch (err) {
      console.error("Passage API error:", err);
    } finally {
      setLoadingPassage(false);
    }
  };

  const saveBookmarks = (updated: Bookmark[]) => {
    setBookmarks(updated);
    try {
      localStorage.setItem(BOOKMARK_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to save bookmarks to localStorage", e);
    }
  };

  const toggleBookmarkForVerse = (passageKey: string, v: Verse, bookName: string, chNum: number) => {
    const bookmarkKey = `${passageKey}:${v.verse}`;
    const isBookmarked = bookmarks.some((b) => b.key === bookmarkKey);
    let updated: Bookmark[];

    if (isBookmarked) {
      updated = bookmarks.filter((b) => b.key !== bookmarkKey);
      addHistoryLine(`[BOOKMARK] Removed ${bookName} ${chNum}:${v.verse}`);
    } else {
      const newBm: Bookmark = {
        key: bookmarkKey,
        passage: passageKey,
        verse: v.verse,
        reference: `${bookName} ${chNum}:${v.verse}`,
        text: v.text,
      };
      updated = [...bookmarks, newBm];
      addHistoryLine(`[BOOKMARK] Saved ${bookName} ${chNum}:${v.verse} to localStorage.`);
    }
    saveBookmarks(updated);
  };

  const updateUrlState = (passage: string, translation: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("passage", passage);
    params.set("translation", translation);
    router.replace(`/bible?${params.toString()}`);
  };

  const addHistoryLine = (text: string, passage?: string, verseIdx?: number) => {
    setCommandHistory((prev) => [
      ...prev,
      { id: `hist-${Date.now()}-${Math.random()}`, text, passage, verseIdx },
    ]);
  };

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = commandInput.trim();
    if (!cmd) return;

    addHistoryLine(`> ${cmd}`);
    const lower = cmd.toLowerCase();

    if (lower.startsWith(":search")) {
      const queryStr = cmd.replace(/^:search\s*/i, "").trim();
      setSearchInitialQuery(queryStr);
      setIsSearchOpen(true);
      addHistoryLine(`Opening FTS5 Search Overlay for "${queryStr}"...`);
    } else if (lower.startsWith(":theme")) {
      const parts = cmd.split(/\s+/);
      const themeArg = parts[1]?.toLowerCase();
      if (!themeArg) {
        addHistoryLine(`Current theme: ${theme} (${themeConfig.label}). Themes: ${THEME_LIST.join(", ")}`);
      } else if (THEME_LIST.includes(themeArg as TuiThemeName)) {
        setTheme(themeArg as TuiThemeName);
        addHistoryLine(`Theme switched to ${themeArg} (${TUI_THEMES[themeArg as TuiThemeName].label}).`);
      } else {
        addHistoryLine(`Unknown theme "${themeArg}". Available themes: ${THEME_LIST.join(", ")}`);
      }
    } else if (lower.startsWith(":read") || lower.startsWith("read ") || lower.startsWith(":goto") || lower.includes(" ")) {
      const parsed = parsePassageInput(cmd);
      if (parsed) {
        fetchPassageFromApi(parsed.book, parsed.chapter, currentTranslation);
      } else {
        addHistoryLine(`Could not parse passage for "${cmd}". Usage: :read Isaiah 6, :read John 3, :read Gen 1.`);
      }
    } else if (lower.startsWith(":lineage")) {
      const name = cmd.split(" ")[1] || "david";
      addHistoryLine(`Navigating to Genealogy tree for ancestor: ${name}...`);
      router.push(`/lineage?ancestor=${name.toLowerCase()}`);
    } else if (lower.startsWith(":martyrdom")) {
      const name = cmd.split(" ")[1] || "peter";
      addHistoryLine(`Navigating to Disciples archive for apostle: ${name}...`);
      router.push(`/disciples/martyrdom?disciple=${name.toLowerCase()}`);
    } else if (lower === ":compare") {
      setCompareMode(!compareMode);
      addHistoryLine(`Dual-pane comparison mode ${!compareMode ? "enabled" : "disabled"}.`);
    } else if (lower === ":bookmarks") {
      if (bookmarks.length === 0) {
        addHistoryLine("=== SAVED BIBLE VERSE BOOKMARKS ===");
        addHistoryLine("No bookmarked verses found. Press 'b' or click the bookmark icon on any verse.");
      } else {
        addHistoryLine("=== SAVED BIBLE VERSE BOOKMARKS (Click to Jump) ===");
        bookmarks.forEach((bm, idx) => {
          const passageData = getPassageData(currentTranslation, bm.passage);
          const vIdx = passageData ? passageData.verses.findIndex((v) => v.verse === bm.verse) : 0;
          addHistoryLine(
            `  ${idx + 1}. [${bm.reference}] "${bm.text.slice(0, 45)}..."`,
            bm.passage,
            vIdx >= 0 ? vIdx : 0
          );
        });
      }
    } else if (lower === ":clear") {
      setCommandHistory([{ id: "clear-1", text: "Command history cleared." }]);
    } else if (lower === ":help") {
      addHistoryLine("=== BIBLE TUI COMMAND DSL SPECIFICATION ===");
      addHistoryLine("  :read [book] [chapter]   — Read ANY passage (e.g. :read Isaiah 6, :read Exodus 20, :read John 3)");
      addHistoryLine("  :search [query]          — Open FTS5 Search Overlay modal (e.g., :search light)");
      addHistoryLine("  :theme [name]            — Switch theme (cyan, amber, matrix, monokai)");
      addHistoryLine("  :bookmarks               — List saved bookmarks in console buffer");
      addHistoryLine("  :compare                 — Toggle dual-pane parallel translation view");
      addHistoryLine("  :lineage [name]          — Search & jump to genealogy lineage ancestor");
      addHistoryLine("  :martyrdom [name]        — Search & jump to apostle martyrdom record");
      addHistoryLine("  :clear                   — Clear console output buffer");
      addHistoryLine("  b                        — Bookmark / highlight currently selected verse");
      addHistoryLine("  t                        — Cycle through color themes");
      addHistoryLine("  j / k                    — Move verse selection cursor down / up");
      addHistoryLine("  Tab                      — Toggle dual-pane comparison pane");
      addHistoryLine("  /                        — Focus CLI input buffer");
      addHistoryLine("  Esc                      — Blur CLI input focus trap");
    } else {
      addHistoryLine(`Unknown command: ${cmd}. Type :help for commands.`);
    }

    setCommandInput("");
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = document.activeElement?.tagName?.toLowerCase();
      const isInput = activeTag === "input" || activeTag === "textarea" || (document.activeElement as HTMLElement)?.isContentEditable;

      if (isInput) {
        if (e.key === "Escape") {
          inputRef.current?.blur();
        }
        return;
      }

      if (e.key === "j") {
        setSelectedVerseIdx((prev) => Math.min(prev + 1, primaryData.verses.length - 1));
      } else if (e.key === "k") {
        setSelectedVerseIdx((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "b" || e.key === "B") {
        e.preventDefault();
        const currentVerse = primaryData.verses[selectedVerseIdx];
        if (currentVerse) {
          toggleBookmarkForVerse(currentPassage, currentVerse, primaryData.book, primaryData.chapter);
        }
      } else if (e.key === "t" || e.key === "T") {
        e.preventDefault();
        cycleTheme();
      } else if (e.key === "/") {
        e.preventDefault();
        inputRef.current?.focus();
      } else if (e.key === "Tab") {
        e.preventDefault();
        setCompareMode((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [primaryData, selectedVerseIdx, currentPassage, bookmarks, cycleTheme]);

  return (
    <div
      data-testid="bible-tui"
      data-theme={theme}
      style={{
        backgroundColor: themeConfig.bg,
        color: themeConfig.fg,
      }}
      className="w-full max-w-6xl mx-auto flex flex-col justify-between min-h-[calc(100vh-100px)] transition-colors duration-300"
    >
      <div>
        {/* Stylish ASCII Header */}
        <AsciiLogo />

        {/* Top Control & Mode Status Bar */}
        <div
          style={{
            borderColor: themeConfig.border,
            backgroundColor: themeConfig.cardBg,
          }}
          className="border p-4 rounded-t-lg backdrop-blur flex flex-wrap items-center justify-between gap-4 mb-4"
        >
          <div className="flex items-center gap-3">
            <div
              style={{
                borderColor: themeConfig.border,
                backgroundColor: `${themeConfig.fg}15`,
              }}
              className="p-2 border rounded"
            >
              <TermIcon className="w-5 h-5" style={{ color: themeConfig.fg }} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold uppercase tracking-widest" style={{ color: themeConfig.fg }}>
                  {primaryData.book} {primaryData.chapter}
                </span>
                <span
                  style={{
                    backgroundColor: `${themeConfig.fg}20`,
                    color: themeConfig.fg,
                  }}
                  className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold"
                >
                  {currentTranslation}
                </span>
                {loadingPassage && <Loader2 className="w-3.5 h-3.5 animate-spin text-[#00f0ff]" />}
              </div>
              <p className="text-[11px] font-mono opacity-80" style={{ color: themeConfig.fg }}>
                {primaryData.verses.length} Verses loaded via Cloudflare D1 API
              </p>
            </div>
          </div>

          {/* Quick Passage Jump Buttons */}
          <div className="flex items-center gap-1.5 text-xs font-mono">
            {[
              { key: "ISA.6", name: "Isa 6", book: "ISA", ch: 6 },
              { key: "GEN.1", name: "Gen 1", book: "GEN", ch: 1 },
              { key: "JOHN.3", name: "John 3", book: "JHN", ch: 3 },
              { key: "MAT.1", name: "Mat 1", book: "MAT", ch: 1 },
              { key: "PSA.23", name: "Ps 23", book: "PSA", ch: 23 },
            ].map((p) => {
              const isActive = currentPassage === p.key;
              return (
                <button
                  key={p.key}
                  onClick={() => fetchPassageFromApi(p.book, p.ch, currentTranslation)}
                  style={{
                    borderColor: isActive ? themeConfig.fg : themeConfig.border,
                    backgroundColor: isActive ? `${themeConfig.fg}30` : "transparent",
                    color: themeConfig.fg,
                  }}
                  className={`px-2 py-1 rounded border text-[11px] font-bold transition cursor-pointer ${
                    isActive ? "shadow-[0_0_8px_rgba(0,240,255,0.4)]" : "opacity-70 hover:opacity-100"
                  }`}
                >
                  {p.name}
                </button>
              );
            })}
          </div>

          {/* Mode Pill Indicators, Theme Switcher & Action Selectors */}
          <div className="flex items-center gap-2 text-xs font-mono">
            <button
              onClick={() => cycleTheme()}
              title="Click or press 't' to cycle theme"
              style={{
                borderColor: themeConfig.border,
                backgroundColor: `${themeConfig.fg}15`,
                color: themeConfig.fg,
              }}
              className="px-2.5 py-1 rounded font-bold border transition flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              THEME [{theme.toUpperCase()}]
            </button>

            <button
              onClick={() => {
                setIsSearchOpen(true);
              }}
              style={{
                borderColor: themeConfig.border,
                backgroundColor: `${themeConfig.fg}15`,
                color: themeConfig.fg,
              }}
              className="px-2.5 py-1 rounded font-bold border transition flex items-center gap-1.5 cursor-pointer"
            >
              <SearchIcon className="w-3.5 h-3.5" />
              SEARCH FTS
            </button>

            <button
              onClick={() => {
                addHistoryLine("=== SAVED BIBLE VERSE BOOKMARKS ===");
                if (bookmarks.length === 0) {
                  addHistoryLine("No bookmarked verses. Press 'b' to bookmark selected verse.");
                } else {
                  bookmarks.forEach((bm, i) => {
                    const passageData = getPassageData(currentTranslation, bm.passage);
                    const vIdx = passageData ? passageData.verses.findIndex((v) => v.verse === bm.verse) : 0;
                    addHistoryLine(`  ${i + 1}. [${bm.reference}] "${bm.text.slice(0, 45)}..."`, bm.passage, vIdx >= 0 ? vIdx : 0);
                  });
                }
              }}
              className="px-2.5 py-1 rounded font-bold border border-amber-400/40 bg-amber-400/10 hover:bg-amber-400/20 text-amber-400 transition flex items-center gap-1.5"
            >
              <BookmarkIcon className="w-3.5 h-3.5 fill-amber-400" />
              BOOKMARKS [{bookmarks.length}]
            </button>

            <button
              onClick={() => updateUrlState(currentPassage, currentTranslation === "KJV" ? "WEB" : "KJV")}
              style={{
                borderColor: themeConfig.border,
                backgroundColor: `${themeConfig.fg}15`,
                color: themeConfig.fg,
              }}
              className="px-2.5 py-1 rounded font-bold border transition"
            >
              TRANSLATION [{currentTranslation}]
            </button>

            <button
              onClick={() => setCompareMode(!compareMode)}
              style={{
                backgroundColor: compareMode ? themeConfig.fg : "transparent",
                color: compareMode ? themeConfig.bg : themeConfig.fg,
                borderColor: themeConfig.border,
              }}
              className="px-3 py-1 rounded font-bold border transition flex items-center gap-1.5"
            >
              <Columns className="w-3.5 h-3.5" />
              DUAL-PANE [{compareMode ? "ON" : "OFF"}]
            </button>

            <span
              style={{
                backgroundColor: `${themeConfig.fg}20`,
                borderColor: themeConfig.border,
                color: themeConfig.fg,
              }}
              className="border px-2 py-1 rounded text-[11px] font-bold uppercase"
            >
              MODE: {isCommandFocused ? "COMMAND" : "NORMAL"}
            </span>
          </div>
        </div>

        {/* Primary Viewport Grid */}
        <div className={`grid gap-4 ${compareMode ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"}`}>
          {/* Pane 01: Primary Translation Viewport */}
          <div
            style={{
              borderColor: themeConfig.border,
              backgroundColor: themeConfig.cardBg,
              boxShadow: themeConfig.glow,
            }}
            className="border p-5 rounded-lg flex flex-col justify-between min-h-[300px]"
          >
            <div>
              <div
                style={{ borderColor: themeConfig.border }}
                className="flex items-center justify-between border-b pb-2 mb-3 text-xs font-mono"
              >
                <span className="font-bold flex items-center gap-1.5" style={{ color: themeConfig.fg }}>
                  <BookOpen className="w-4 h-4" /> PANE 01 // {currentTranslation} — {primaryData.book} {primaryData.chapter}
                </span>
                <span
                  style={{
                    backgroundColor: `${themeConfig.fg}15`,
                    color: themeConfig.fg,
                  }}
                  className="text-[10px] px-2 py-0.5 rounded font-bold uppercase"
                >
                  PRIMARY
                </span>
              </div>

              <div className="space-y-2.5 font-mono">
                {primaryData.verses.map((v, idx) => {
                  const isSelected = idx === selectedVerseIdx;
                  const bookmarkKey = `${currentPassage}:${v.verse}`;
                  const isBookmarked = bookmarks.some((b) => b.key === bookmarkKey);

                  return (
                    <div
                      key={v.verse}
                      onClick={() => setSelectedVerseIdx(idx)}
                      style={{
                        backgroundColor: isSelected ? `${themeConfig.fg}20` : isBookmarked ? "rgba(251, 191, 36, 0.1)" : "transparent",
                        borderColor: isSelected ? themeConfig.fg : isBookmarked ? "#fbbf24" : "transparent",
                      }}
                      className={`p-3 rounded transition cursor-pointer text-xs sm:text-sm leading-relaxed flex items-start gap-2.5 ${
                        isSelected
                          ? "border-l-4 font-medium"
                          : isBookmarked
                          ? "border-l-2 text-amber-200"
                          : "hover:bg-white/5"
                      }`}
                    >
                      <button
                        type="button"
                        aria-label={`Bookmark ${primaryData.book} ${primaryData.chapter}:${v.verse}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleBookmarkForVerse(currentPassage, v, primaryData.book, primaryData.chapter);
                        }}
                        className="mt-0.5 p-0.5 rounded hover:bg-white/10 transition"
                      >
                        <BookmarkIcon
                          className={`w-4 h-4 transition ${
                            isBookmarked
                              ? "fill-amber-400 text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.8)]"
                              : "opacity-40 hover:opacity-100"
                          }`}
                        />
                      </button>
                      <div className="flex-1">
                        <span className="font-bold mr-2 text-xs" style={{ color: isBookmarked ? "#fbbf24" : themeConfig.fg }}>
                          {v.verse}:
                        </span>
                        <span>{v.text}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Pane 02: Secondary Comparison Viewport (Dual-Pane) */}
          {compareMode && (
            <div
              style={{
                borderColor: `${themeConfig.secondaryFg}40`,
                backgroundColor: themeConfig.cardBg,
              }}
              className="border p-5 rounded-lg flex flex-col justify-between min-h-[300px]"
            >
              <div>
                <div
                  style={{ borderColor: `${themeConfig.secondaryFg}30` }}
                  className="flex items-center justify-between border-b pb-2 mb-3 text-xs font-mono"
                >
                  <span className="font-bold flex items-center gap-1.5" style={{ color: themeConfig.secondaryFg }}>
                    <Columns className="w-4 h-4" /> PANE 02 // {secondaryTranslation} — {secondaryData.book} {secondaryData.chapter}
                  </span>
                  <span
                    style={{
                      backgroundColor: `${themeConfig.secondaryFg}15`,
                      color: themeConfig.secondaryFg,
                    }}
                    className="text-[10px] px-2 py-0.5 rounded font-bold uppercase"
                  >
                    COMPARISON
                  </span>
                </div>

                <div className="space-y-2.5 font-mono">
                  {secondaryData.verses.map((v, idx) => {
                    const isSelected = idx === selectedVerseIdx;
                    const bookmarkKey = `${currentPassage}:${v.verse}`;
                    const isBookmarked = bookmarks.some((b) => b.key === bookmarkKey);

                    return (
                      <div
                        key={v.verse}
                        onClick={() => setSelectedVerseIdx(idx)}
                        style={{
                          backgroundColor: isSelected ? `${themeConfig.secondaryFg}20` : isBookmarked ? "rgba(251, 191, 36, 0.1)" : "transparent",
                          borderColor: isSelected ? themeConfig.secondaryFg : isBookmarked ? "#fbbf24" : "transparent",
                        }}
                        className={`p-3 rounded transition cursor-pointer text-xs sm:text-sm leading-relaxed flex items-start gap-2.5 ${
                          isSelected
                            ? "border-l-4 font-medium"
                            : isBookmarked
                            ? "border-l-2 text-amber-200"
                            : "hover:bg-white/5"
                        }`}
                      >
                        <button
                          type="button"
                          aria-label={`Bookmark comparison ${secondaryData.book} ${secondaryData.chapter}:${v.verse}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleBookmarkForVerse(currentPassage, v, secondaryData.book, secondaryData.chapter);
                          }}
                          className="mt-0.5 p-0.5 rounded hover:bg-white/10 transition"
                        >
                          <BookmarkIcon
                            className={`w-4 h-4 transition ${
                              isBookmarked
                                ? "fill-amber-400 text-amber-400"
                                : "opacity-40 hover:opacity-100"
                            }`}
                          />
                        </button>
                        <div className="flex-1">
                          <span className="font-bold mr-2 text-xs" style={{ color: isBookmarked ? "#fbbf24" : themeConfig.secondaryFg }}>
                            {v.verse}:
                          </span>
                          <span>{v.text}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Console Log Buffer Output */}
        <div
          style={{
            borderColor: themeConfig.border,
            backgroundColor: `${themeConfig.bg}80`,
            color: themeConfig.fg,
          }}
          className="mt-4 p-3 border rounded text-xs font-mono max-h-32 overflow-y-auto space-y-1 opacity-90"
        >
          {commandHistory.slice(-8).map((line) => {
            const isClickable = Boolean(line.passage);
            return (
              <p
                key={line.id}
                onClick={() => {
                  if (line.passage) {
                    updateUrlState(line.passage, currentTranslation);
                    if (typeof line.verseIdx === "number") {
                      setSelectedVerseIdx(line.verseIdx);
                    }
                  }
                }}
                className={`leading-snug ${
                  isClickable
                    ? "cursor-pointer text-amber-300 hover:text-amber-100 hover:underline font-semibold"
                    : ""
                }`}
              >
                {line.text}
              </p>
            );
          })}
        </div>
      </div>

      {/* CLI Command Line Input Buffer & Keybinding Legend Footer */}
      <div className="mt-6 space-y-3">
        <form
          onSubmit={handleCommandSubmit}
          style={{
            borderColor: themeConfig.border,
            backgroundColor: themeConfig.cardBg,
            boxShadow: themeConfig.glow,
          }}
          className="border p-2.5 rounded-lg flex items-center gap-3"
        >
          <span
            style={{
              backgroundColor: themeConfig.fg,
              color: themeConfig.bg,
            }}
            className="text-xs font-bold font-mono px-2.5 py-1 rounded uppercase"
          >
            :PROMPT &gt;
          </span>
          <input
            ref={inputRef}
            type="text"
            value={commandInput}
            onChange={(e) => setCommandInput(e.target.value)}
            onFocus={() => setIsCommandFocused(true)}
            onBlur={() => setIsCommandFocused(false)}
            placeholder="Type :read Isaiah 6, :read John 3, :search light, :theme amber, :bookmarks, :compare, or :help..."
            style={{ color: themeConfig.fg }}
            className="flex-1 bg-transparent border-none outline-none text-xs sm:text-sm placeholder-white/40 font-mono"
          />
          <button
            type="submit"
            style={{
              borderColor: themeConfig.border,
              color: themeConfig.fg,
              backgroundColor: `${themeConfig.fg}15`,
            }}
            className="text-xs font-mono px-3 py-1 border rounded font-semibold transition"
          >
            EXECUTE
          </button>
        </form>

        {/* Lipgloss Keybinding Legend Bar */}
        <div
          style={{
            borderColor: themeConfig.border,
            backgroundColor: `${themeConfig.cardBg}80`,
            color: themeConfig.fg,
          }}
          className="flex flex-wrap items-center justify-between gap-2 px-2 py-1.5 border rounded text-[11px] font-mono opacity-80"
        >
          <div className="flex items-center gap-3">
            <span><kbd className="border px-1 rounded text-white" style={{ borderColor: themeConfig.border }}>b</kbd> Bookmark</span>
            <span><kbd className="border px-1 rounded text-white" style={{ borderColor: themeConfig.border }}>t</kbd> Theme</span>
            <span><kbd className="border px-1 rounded text-white" style={{ borderColor: themeConfig.border }}>j/k</kbd> Scroll</span>
            <span><kbd className="border px-1 rounded text-white" style={{ borderColor: themeConfig.border }}>/</kbd> Command</span>
            <span><kbd className="border px-1 rounded text-white" style={{ borderColor: themeConfig.border }}>Tab</kbd> Dual-Pane</span>
            <span><kbd className="border px-1 rounded text-white" style={{ borderColor: themeConfig.border }}>Esc</kbd> Blur</span>
          </div>
          <span className="text-[10px] opacity-75 font-bold uppercase">THEME: {theme}</span>
        </div>
      </div>

      {/* FTS5 Search Overlay Modal */}
      <SearchOverlay
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        initialQuery={searchInitialQuery}
        onSelectPassage={(passage) => {
          updateUrlState(passage, currentTranslation);
          setSelectedVerseIdx(0);
          addHistoryLine(`Jumped to passage ${passage} from search result.`);
        }}
      />
    </div>
  );
}
