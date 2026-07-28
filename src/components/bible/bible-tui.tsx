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

export type BibleTranslation = "ESV" | "NLT" | "KJV" | "WEB";

const STATIC_BIBLE_DATA: Record<string, Record<string, PassageData>> = {
  ESV: {
    "JOHN.3": {
      book: "John",
      chapter: 3,
      verses: [
        { verse: 1, text: "Now there was a man of the Pharisees named Nicodemus, a ruler of the Jews." },
        { verse: 2, text: "This man came to Jesus by night and said to him, 'Rabbi, we know that you are a teacher come from God...'" },
        { verse: 3, text: "Jesus answered him, 'Truly, truly, I say to you, unless one is born again he cannot see the kingdom of God.'" },
        { verse: 16, text: "For God so loved the world, that he gave his only Son, that whoever believes in him should not perish but have eternal life." },
        { verse: 17, text: "For God did not send his Son into the world to condemn the world, but in order that the world might be saved through him." },
      ],
    },
    "ISA.6": {
      book: "Isaiah",
      chapter: 6,
      verses: [
        { verse: 1, text: "In the year that King Uzziah died I saw the Lord sitting upon a throne, high and lifted up; and the train of his robe filled the temple." },
        { verse: 2, text: "Above him stood the seraphim. Each had six wings: with two he covered his face, and with two he covered his feet, and with two he flew." },
        { verse: 3, text: "And one called to another and said: 'Holy, holy, holy is the LORD of hosts; the whole earth is full of his glory!'" },
        { verse: 8, text: "And I heard the voice of the Lord saying, 'Whom shall I send, and who will go for us?' Then I said, 'Here I am! Send me.'" },
      ],
    },
  },
  NLT: {
    "JOHN.3": {
      book: "John",
      chapter: 3,
      verses: [
        { verse: 1, text: "There was a man named Nicodemus, a Jewish religious leader who was a Pharisee." },
        { verse: 2, text: "After dark one evening, he came to speak with Jesus. 'Rabbi,' he said, 'we all know that God has sent you to teach us...'" },
        { verse: 3, text: "Jesus replied, 'I tell you the truth, unless you are born again, you cannot see the Kingdom of God.'" },
        { verse: 16, text: "For this is how God loved the world: He gave his one and only Son, so that everyone who believes in him will not perish but have eternal life." },
        { verse: 17, text: "God sent his Son into the world not to judge the world, but to save the world through him." },
      ],
    },
    "ISA.6": {
      book: "Isaiah",
      chapter: 6,
      verses: [
        { verse: 1, text: "It was the year King Uzziah died that I saw the Lord. He was sitting on a lofty throne, and the train of his robe filled the Temple." },
        { verse: 2, text: "Attending him were mighty seraphim, each having six wings. With two wings they covered their faces, with two they covered their feet, and with two they flew." },
        { verse: 3, text: "They were calling to each other, 'Holy, holy, holy is the LORD of Heaven’s Armies! The whole earth is filled with his glory!'" },
        { verse: 8, text: "Then I heard the Lord asking, 'Whom should I send as a messenger to this people? Who will go for us?' I said, 'Here I am. Send me.'" },
      ],
    },
  },
};

const BOOKMARK_STORAGE_KEY = "bible_tui_bookmarks";

function parsePassageInput(input: string): { book: string; chapter: number; verse?: number } | null {
  const clean = input.trim().toLowerCase().replace(/^:read\s*/, "").replace(/^read\s*/, "").replace(/^:goto\s*/, "");
  
  const matchWithVerse = clean.match(/^([a-z0-9\s]+?)[\s\.:]+(\d+)[\s\.:]+(\d+)/i);
  if (matchWithVerse) {
    const bookStr = matchWithVerse[1].trim();
    const chNum = parseInt(matchWithVerse[2], 10);
    const verseNum = parseInt(matchWithVerse[3], 10);
    return { book: bookStr, chapter: chNum, verse: verseNum };
  }

  const matchChapter = clean.match(/^([a-z0-9\s]+?)[\s\.:]+(\d+)/i);
  if (matchChapter) {
    const bookStr = matchChapter[1].trim();
    const chNum = parseInt(matchChapter[2], 10);
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
  const currentPassage = searchParams.get("passage") || "ISA.6";
  const currentTranslation = (searchParams.get("translation") || "ESV").toUpperCase() as BibleTranslation;
  const initialVerseParam = searchParams.get("verse");

  const [selectedVerseIdx, setSelectedVerseIdx] = useState(0);
  const [compareMode, setCompareMode] = useState(true);
  const [secondaryTranslation, setSecondaryTranslation] = useState<BibleTranslation>("NLT");
  const [commandInput, setCommandInput] = useState("");
  const [executedCommands, setExecutedCommands] = useState<string[]>([]);
  const [historyPointer, setHistoryPointer] = useState<number | null>(null);

  const [commandHistory, setCommandHistory] = useState<HistoryEntry[]>([
    { id: "init-1", text: "Cloudflare D1 Edge Bible Engine initialized." },
    { id: "init-2", text: "ESV vs NLT Dual-Pane Parallel Comparison Mode Active." },
    { id: "init-3", text: "Type :read John 3:16, :read Isaiah 6:8, press Up/Down for command history, or press / to focus CLI prompt." },
  ]);
  const [isCommandFocused, setIsCommandFocused] = useState(false);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [dynamicPassages, setDynamicPassages] = useState<Record<string, PassageData>>({});
  const [loadingPassage, setLoadingPassage] = useState(false);

  // Search Overlay State (Issue #32)
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchInitialQuery, setSearchInitialQuery] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);

  const getPassageData = (translation: string, passageKey: string): PassageData => {
    const dynKey = `${translation}.${passageKey}`;
    if (dynamicPassages[dynKey]) return dynamicPassages[dynKey];
    if (STATIC_BIBLE_DATA[translation]?.[passageKey]) return STATIC_BIBLE_DATA[translation][passageKey];
    if (STATIC_BIBLE_DATA["ESV"]?.[passageKey]) return STATIC_BIBLE_DATA["ESV"][passageKey];

    return (
      STATIC_BIBLE_DATA["ESV"]["ISA.6"] || STATIC_BIBLE_DATA["ESV"]["JOHN.3"]
    );
  };

  const primaryData = getPassageData(currentTranslation, currentPassage);
  const secondaryData = getPassageData(secondaryTranslation, currentPassage);

  // Auto-scroll to selected verse
  useEffect(() => {
    if (primaryData.verses[selectedVerseIdx]) {
      const vNum = primaryData.verses[selectedVerseIdx].verse;
      const elem = document.getElementById(`verse-${currentPassage}-${vNum}`);
      if (elem) {
        elem.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [selectedVerseIdx, currentPassage, primaryData]);

  // Initial verse param lookup
  useEffect(() => {
    if (initialVerseParam) {
      const vNum = parseInt(initialVerseParam, 10);
      if (!isNaN(vNum)) {
        const vIdx = primaryData.verses.findIndex((v) => v.verse === vNum);
        if (vIdx >= 0) {
          setSelectedVerseIdx(vIdx);
        }
      }
    }
  }, [initialVerseParam, primaryData]);

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

  const fetchPassageFromApi = async (book: string, chapter: number, translation: string, targetVerse?: number) => {
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
        const dynKey = `${translation}.${pKey}`;
        setDynamicPassages((prev) => ({ ...prev, [dynKey]: newPassage }));
        updateUrlState(pKey, translation, targetVerse);

        let targetIdx = 0;
        if (targetVerse) {
          const foundIdx = newPassage.verses.findIndex((v) => v.verse === targetVerse);
          if (foundIdx >= 0) targetIdx = foundIdx;
        }

        setSelectedVerseIdx(targetIdx);
        const verseRef = targetVerse ? `:${targetVerse}` : "";
        addHistoryLine(`Jumped to ${data.book} ${data.chapter}${verseRef} [${translation}] & highlighted verse.`);
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

  const updateUrlState = (passage: string, translation: string, verse?: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("passage", passage);
    params.set("translation", translation);
    if (verse) {
      params.set("verse", verse.toString());
    } else {
      params.delete("verse");
    }
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

    // Add to executed command history list for Up/Down arrow navigation
    setExecutedCommands((prev) => [...prev, cmd]);
    setHistoryPointer(null);

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
    } else if (lower.startsWith(":read") || lower.startsWith("read ") || lower.startsWith(":goto") || lower.includes(" ") || lower.includes(":")) {
      const parsed = parsePassageInput(cmd);
      if (parsed) {
        fetchPassageFromApi(parsed.book, parsed.chapter, currentTranslation, parsed.verse);
      } else {
        addHistoryLine(`Could not parse passage for "${cmd}". Usage: :read John 3:16, :read Isaiah 6:8, :read Gen 1:3.`);
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
      addHistoryLine("  :read [book] [ch]:[vs]   — Jump directly to verse (e.g. :read John 3:16, :read Isaiah 6:8)");
      addHistoryLine("  :search [query]          — Open FTS5 Search Overlay modal (e.g., :search light)");
      addHistoryLine("  :theme [name]            — Switch theme (cyan, amber, matrix, monokai)");
      addHistoryLine("  :bookmarks               — List saved bookmarks in console buffer");
      addHistoryLine("  :compare                 — Toggle ESV vs NLT dual-pane parallel view");
      addHistoryLine("  :lineage [name]          — Search & jump to genealogy lineage ancestor");
      addHistoryLine("  :martyrdom [name]        — Search & jump to apostle martyrdom record");
      addHistoryLine("  :clear                   — Clear console output buffer");
      addHistoryLine("  b                        — Bookmark / highlight currently selected verse");
      addHistoryLine("  t                        — Cycle through color themes");
      addHistoryLine("  j / k                    — Move verse selection cursor down / up");
      addHistoryLine("  Up / Down (Prompt)       — Navigate shell command history buffer");
      addHistoryLine("  Tab                      — Toggle dual-pane comparison pane");
      addHistoryLine("  /                        — Focus CLI input buffer");
      addHistoryLine("  Esc                      — Blur CLI input focus trap");
    } else {
      addHistoryLine(`Unknown command: ${cmd}. Type :help for commands.`);
    }

    setCommandInput("");
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (executedCommands.length === 0) return;

      if (historyPointer === null) {
        const nextPtr = executedCommands.length - 1;
        setHistoryPointer(nextPtr);
        setCommandInput(executedCommands[nextPtr]);
      } else if (historyPointer > 0) {
        const nextPtr = historyPointer - 1;
        setHistoryPointer(nextPtr);
        setCommandInput(executedCommands[nextPtr]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyPointer !== null) {
        if (historyPointer < executedCommands.length - 1) {
          const nextPtr = historyPointer + 1;
          setHistoryPointer(nextPtr);
          setCommandInput(executedCommands[nextPtr]);
        } else {
          setHistoryPointer(null);
          setCommandInput("");
        }
      }
    } else if (e.key === "Escape") {
      inputRef.current?.blur();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = document.activeElement?.tagName?.toLowerCase();
      const isInput = activeTag === "input" || activeTag === "textarea" || (document.activeElement as HTMLElement)?.isContentEditable;

      if (isInput) return;

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
                  PANE 1: {currentTranslation}
                </span>
                {compareMode && (
                  <span
                    style={{
                      backgroundColor: `${themeConfig.secondaryFg}20`,
                      color: themeConfig.secondaryFg,
                    }}
                    className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold"
                  >
                    PANE 2: {secondaryTranslation}
                  </span>
                )}
                {loadingPassage && <Loader2 className="w-3.5 h-3.5 animate-spin text-[#00f0ff]" />}
              </div>
              <p className="text-[11px] font-mono opacity-80" style={{ color: themeConfig.fg }}>
                {primaryData.verses.length} Verses loaded // ESV vs NLT Dual-Pane Active
              </p>
            </div>
          </div>

          {/* Translation Selectors: ESV, NLT, KJV, WEB */}
          <div className="flex items-center gap-1.5 text-xs font-mono">
            {(["ESV", "NLT", "KJV", "WEB"] as const).map((trans) => {
              const isPrimary = currentTranslation === trans;
              const isSecondary = secondaryTranslation === trans && compareMode;
              return (
                <button
                  key={trans}
                  onClick={() => {
                    if (isPrimary) {
                      setSecondaryTranslation(trans === "NLT" ? "ESV" : "NLT");
                    } else {
                      updateUrlState(currentPassage, trans);
                    }
                  }}
                  style={{
                    borderColor: isPrimary ? themeConfig.fg : isSecondary ? themeConfig.secondaryFg : themeConfig.border,
                    backgroundColor: isPrimary ? `${themeConfig.fg}30` : isSecondary ? `${themeConfig.secondaryFg}30` : "transparent",
                    color: isPrimary ? themeConfig.fg : isSecondary ? themeConfig.secondaryFg : themeConfig.fg,
                  }}
                  className={`px-2.5 py-1 rounded border text-[11px] font-bold transition cursor-pointer ${
                    isPrimary || isSecondary ? "shadow-[0_0_8px_rgba(0,240,255,0.4)]" : "opacity-70 hover:opacity-100"
                  }`}
                >
                  {trans}
                </button>
              );
            })}
          </div>

          {/* Mode Pill Indicators & Action Selectors */}
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
              onClick={() => setIsSearchOpen(true)}
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
              onClick={() => setCompareMode(!compareMode)}
              style={{
                backgroundColor: compareMode ? themeConfig.fg : "transparent",
                color: compareMode ? themeConfig.bg : themeConfig.fg,
                borderColor: themeConfig.border,
              }}
              className="px-3 py-1 rounded font-bold border transition flex items-center gap-1.5"
            >
              <Columns className="w-3.5 h-3.5" />
              ESV vs NLT [{compareMode ? "ON" : "OFF"}]
            </button>
          </div>
        </div>

        {/* Primary Viewport Grid */}
        <div className={`grid gap-4 ${compareMode ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"}`}>
          {/* Pane 01: Primary Translation Viewport (ESV) */}
          <div
            style={{
              borderColor: themeConfig.border,
              backgroundColor: themeConfig.cardBg,
              boxShadow: themeConfig.glow,
            }}
            className="border p-5 rounded-lg flex flex-col justify-between min-h-[320px] max-h-[500px] overflow-y-auto"
          >
            <div>
              <div
                style={{ borderColor: themeConfig.border }}
                className="flex items-center justify-between border-b pb-2 mb-3 text-xs font-mono sticky top-0 bg-[#0d1522]/95 z-10 backdrop-blur"
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
                  PRIMARY ({currentTranslation})
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
                      id={`verse-${currentPassage}-${v.verse}`}
                      onClick={() => setSelectedVerseIdx(idx)}
                      style={{
                        backgroundColor: isSelected ? `${themeConfig.fg}25` : isBookmarked ? "rgba(251, 191, 36, 0.1)" : "transparent",
                        borderColor: isSelected ? themeConfig.fg : isBookmarked ? "#fbbf24" : "transparent",
                        boxShadow: isSelected ? themeConfig.glow : "none",
                      }}
                      className={`p-3 rounded transition-all duration-300 cursor-pointer text-xs sm:text-sm leading-relaxed flex items-start gap-2.5 ${
                        isSelected
                          ? "border-l-4 font-semibold scale-[1.01]"
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
                        <span className="font-bold mr-2 text-xs" style={{ color: isSelected ? "#ffffff" : isBookmarked ? "#fbbf24" : themeConfig.fg }}>
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

          {/* Pane 02: Secondary Comparison Viewport (NLT) */}
          {compareMode && (
            <div
              style={{
                borderColor: `${themeConfig.secondaryFg}40`,
                backgroundColor: themeConfig.cardBg,
              }}
              className="border p-5 rounded-lg flex flex-col justify-between min-h-[320px] max-h-[500px] overflow-y-auto"
            >
              <div>
                <div
                  style={{ borderColor: `${themeConfig.secondaryFg}30` }}
                  className="flex items-center justify-between border-b pb-2 mb-3 text-xs font-mono sticky top-0 bg-[#0d1522]/95 z-10 backdrop-blur"
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
                    COMPARISON ({secondaryTranslation})
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
                          backgroundColor: isSelected ? `${themeConfig.secondaryFg}25` : isBookmarked ? "rgba(251, 191, 36, 0.1)" : "transparent",
                          borderColor: isSelected ? themeConfig.secondaryFg : isBookmarked ? "#fbbf24" : "transparent",
                        }}
                        className={`p-3 rounded transition-all duration-300 cursor-pointer text-xs sm:text-sm leading-relaxed flex items-start gap-2.5 ${
                          isSelected
                            ? "border-l-4 font-semibold scale-[1.01]"
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
                          <span className="font-bold mr-2 text-xs" style={{ color: isSelected ? "#ffffff" : isBookmarked ? "#fbbf24" : themeConfig.secondaryFg }}>
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
            onKeyDown={handleInputKeyDown}
            onFocus={() => setIsCommandFocused(true)}
            onBlur={() => setIsCommandFocused(false)}
            placeholder="Type :read John 3:16, :read Isaiah 6:8, :search light, :theme amber, or :help... (Press ↑/↓ for history)"
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
            <span><kbd className="border px-1 rounded text-white" style={{ borderColor: themeConfig.border }}>↑/↓</kbd> History</span>
            <span><kbd className="border px-1 rounded text-white" style={{ borderColor: themeConfig.border }}>b</kbd> Bookmark</span>
            <span><kbd className="border px-1 rounded text-white" style={{ borderColor: themeConfig.border }}>t</kbd> Theme</span>
            <span><kbd className="border px-1 rounded text-white" style={{ borderColor: themeConfig.border }}>j/k</kbd> Scroll</span>
            <span><kbd className="border px-1 rounded text-white" style={{ borderColor: themeConfig.border }}>/</kbd> Command</span>
            <span><kbd className="border px-1 rounded text-white" style={{ borderColor: themeConfig.border }}>Tab</kbd> Dual-Pane</span>
            <span><kbd className="border px-1 rounded text-white" style={{ borderColor: themeConfig.border }}>Esc</kbd> Blur</span>
          </div>
          <span className="text-[10px] opacity-75 font-bold uppercase">ESV vs NLT MODE ACTIVE</span>
        </div>
      </div>

      {/* FTS5 Search Overlay Modal */}
      <SearchOverlay
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        initialQuery={searchInitialQuery}
        onSelectPassage={(passage) => {
          const parts = passage.split(".");
          let pKey = passage;
          let verseNum: number | undefined = undefined;
          if (parts.length >= 3) {
            pKey = `${parts[0]}.${parts[1]}`;
            verseNum = parseInt(parts[2], 10);
          }

          updateUrlState(pKey, currentTranslation, verseNum);
          if (verseNum) {
            const passageData = getPassageData(currentTranslation, pKey);
            const foundIdx = passageData.verses.findIndex((v) => v.verse === verseNum);
            if (foundIdx >= 0) setSelectedVerseIdx(foundIdx);
          } else {
            setSelectedVerseIdx(0);
          }
          addHistoryLine(`Jumped to passage ${passage} from search result.`);
        }}
      />
    </div>
  );
}
