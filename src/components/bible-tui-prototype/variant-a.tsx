"use client";

import React, { useState, useEffect, useRef } from "react";
import { Terminal, Scroll, Search, BookOpen, AlertCircle, HelpCircle } from "lucide-react";

interface Verse {
  verse: number;
  text: string;
}

const MOCK_CHAPTERS: Record<string, { book: string; chapter: number; verses: Verse[] }> = {
  "JOHN.3": {
    book: "John",
    chapter: 3,
    verses: [
      { verse: 1, text: "There was a man of the Pharisees, named Nicodemus, a ruler of the Jews:" },
      { verse: 2, text: "The same came to Jesus by night, and said unto him, Rabbi, we know that thou art a teacher come from God..." },
      { verse: 3, text: "Jesus answered and said unto him, Verily, verily, I say unto thee, Except a man be born again, he cannot see the kingdom of God." },
      { verse: 4, text: "Nicodemus saith unto him, How can a man be born when he is old?" },
      { verse: 5, text: "Jesus answered, Verily, verily, I say unto thee, Except a man be born of water and of the Spirit, he cannot enter into the kingdom of God." },
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
};

const ASCII_HEADER = `
 ____ _____ ____  _     _____   _____ _   _ _____ 
|  _ \\_   _| __ )| |   | ____| |_   _| | | |_   _|
| |_) || | |  _ \\| |   |  _|     | | | | | | | |  
|  _ < | | | |_) | |___| |___    | | | |_| | | |  
|_| \\_\\|_| |____/|_____|_____|   |_|  \\___/  |_|  
  -- VT100 Amber Phosphor Edition (KJV v1.0) --
`;

export function VariantA() {
  const [passageKey, setPassageKey] = useState("JOHN.3");
  const [selectedVerseIndex, setSelectedVerseIndex] = useState(0);
  const [commandInput, setCommandInput] = useState("");
  const [commandHistory, setCommandHistory] = useState<string[]>([
    "System initialized. Type :help for commands.",
    "Loaded KJV Bible dataset (Cloudflare D1 connection ready).",
  ]);
  const [isCommandFocused, setIsCommandFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentChapter = MOCK_CHAPTERS[passageKey] || MOCK_CHAPTERS["JOHN.3"];

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = commandInput.trim();
    if (!cmd) return;

    setCommandHistory((prev) => [...prev, `> ${cmd}`]);
    const lower = cmd.toLowerCase();

    if (lower.startsWith(":read gen 1") || lower === "gen 1") {
      setPassageKey("GEN.1");
      setSelectedVerseIndex(0);
      setCommandHistory((prev) => [...prev, "Loaded Genesis Chapter 1."]);
    } else if (lower.startsWith(":read john 3") || lower === "john 3") {
      setPassageKey("JOHN.3");
      setSelectedVerseIndex(0);
      setCommandHistory((prev) => [...prev, "Loaded John Chapter 3."]);
    } else if (lower === ":help") {
      setCommandHistory((prev) => [
        ...prev,
        "Available commands:",
        "  :read [book] [chapter] — Jump to passage (e.g. :read John 3, :read Gen 1)",
        "  j / k                 — Move selection down / up",
        "  /                     — Focus command line prompt",
      ]);
    } else {
      setPassageKey("JOHN.3");
      setCommandHistory((prev) => [...prev, `Executed: ${cmd}`]);
    }

    setCommandInput("");
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement === inputRef.current) return;

      if (e.key === "j") {
        setSelectedVerseIndex((prev) => Math.min(prev + 1, currentChapter.verses.length - 1));
      } else if (e.key === "k") {
        setSelectedVerseIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "/") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentChapter]);

  return (
    <div className="min-h-screen bg-[#0c0900] text-[#ffb000] font-mono p-4 sm:p-8 flex flex-col justify-between selection:bg-[#ffb000] selection:text-black relative overflow-hidden">
      {/* CRT Scanline & Glow Overlay */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] opacity-40 z-20"></div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_60%,rgba(0,0,0,0.8)_100%)] z-20"></div>

      {/* Header */}
      <div className="border-b border-[#ffb000]/40 pb-4 mb-4">
        <pre className="text-[10px] sm:text-xs text-[#ffb000] font-bold leading-none hidden sm:block">
          {ASCII_HEADER}
        </pre>
        <div className="flex items-center justify-between mt-2 text-xs">
          <span className="flex items-center gap-2">
            <Terminal className="w-4 h-4" /> BIBLE-TUI // VARIANT A (AMBER CRT)
          </span>
          <span className="bg-[#ffb000]/20 px-2 py-0.5 rounded text-[11px]">
            MODE: {isCommandFocused ? "COMMAND" : "NORMAL [j/k/slash]"}
          </span>
        </div>
      </div>

      {/* Main Split Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 flex-1 mb-4 z-10 overflow-hidden">
        {/* Left Column: Book Navigation Tree */}
        <div className="border border-[#ffb000]/30 rounded p-4 flex flex-col gap-3 bg-[#150e00]/60">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider border-b border-[#ffb000]/20 pb-2">
            <BookOpen className="w-4 h-4" /> Index / Books
          </div>
          <div className="space-y-1 text-xs">
            <button
              onClick={() => {
                setPassageKey("GEN.1");
                setSelectedVerseIndex(0);
              }}
              className={`w-full text-left px-2 py-1 rounded transition ${
                passageKey === "GEN.1" ? "bg-[#ffb000] text-black font-bold" : "hover:bg-[#ffb000]/10"
              }`}
            >
              [OT] Genesis 1
            </button>
            <button
              onClick={() => {
                setPassageKey("JOHN.3");
                setSelectedVerseIndex(0);
              }}
              className={`w-full text-left px-2 py-1 rounded transition ${
                passageKey === "JOHN.3" ? "bg-[#ffb000] text-black font-bold" : "hover:bg-[#ffb000]/10"
              }`}
            >
              [NT] John 3
            </button>
          </div>

          <div className="mt-auto border-t border-[#ffb000]/20 pt-3 text-[11px] opacity-80 space-y-1">
            <p className="font-bold">Hotkeys:</p>
            <p><kbd className="border border-[#ffb000]/40 px-1">j</kbd> Scroll Down</p>
            <p><kbd className="border border-[#ffb000]/40 px-1">k</kbd> Scroll Up</p>
            <p><kbd className="border border-[#ffb000]/40 px-1">/</kbd> Command Focus</p>
          </div>
        </div>

        {/* Right Column: Verse Viewport & Log */}
        <div className="md:col-span-3 border border-[#ffb000]/30 rounded p-4 bg-[#150e00]/60 flex flex-col justify-between overflow-y-auto">
          <div>
            <div className="flex items-center justify-between border-b border-[#ffb000]/30 pb-2 mb-4">
              <h2 className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                <Scroll className="w-4 h-4" /> {currentChapter.book} — Chapter {currentChapter.chapter} (KJV)
              </h2>
              <span className="text-xs opacity-75">{currentChapter.verses.length} Verses</span>
            </div>

            {/* Verses List */}
            <div className="space-y-3">
              {currentChapter.verses.map((v, idx) => {
                const isSelected = idx === selectedVerseIndex;
                return (
                  <div
                    key={v.verse}
                    onClick={() => setSelectedVerseIndex(idx)}
                    className={`p-2.5 rounded transition cursor-pointer text-xs sm:text-sm leading-relaxed ${
                      isSelected
                        ? "bg-[#ffb000]/20 border-l-4 border-[#ffb000] font-semibold"
                        : "hover:bg-[#ffb000]/5"
                    }`}
                  >
                    <span className="inline-block w-8 font-bold opacity-75">{v.verse}:</span>
                    <span>{v.text}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* History Output Trail */}
          <div className="mt-6 border-t border-[#ffb000]/20 pt-3 text-xs opacity-75 space-y-1 max-h-24 overflow-y-auto">
            {commandHistory.slice(-4).map((h, i) => (
              <p key={i} className="font-mono text-[11px]">{h}</p>
            ))}
          </div>
        </div>
      </div>

      {/* Command Buffer Input Prompt */}
      <form onSubmit={handleCommandSubmit} className="z-10 border border-[#ffb000]/50 bg-[#120a00] p-2 rounded flex items-center gap-3">
        <span className="text-xs font-bold px-2 py-1 bg-[#ffb000] text-black rounded">
          COMMAND:
        </span>
        <input
          ref={inputRef}
          type="text"
          value={commandInput}
          onChange={(e) => setCommandInput(e.target.value)}
          onFocus={() => setIsCommandFocused(true)}
          onBlur={() => setIsCommandFocused(false)}
          placeholder="Type :read John 3, :read Gen 1, or :help..."
          className="flex-1 bg-transparent border-none outline-none text-xs sm:text-sm text-[#ffb000] placeholder-[#ffb000]/40 font-mono"
        />
        <button type="submit" className="text-xs px-3 py-1 border border-[#ffb000]/40 hover:bg-[#ffb000]/20 rounded">
          EXECUTE
        </button>
      </form>
    </div>
  );
}
