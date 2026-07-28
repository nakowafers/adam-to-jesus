"use client";

import React, { useState } from "react";
import { Columns, Sparkles, Terminal, BookMarked, Command, Cpu } from "lucide-react";

export function VariantC() {
  const [selectedTranslation, setSelectedTranslation] = useState<"KJV" | "WEB" | "ASV">("KJV");
  const [compareMode, setCompareMode] = useState(true);

  return (
    <div className="min-h-screen bg-[#070a0f] text-[#00f0ff] font-mono p-4 sm:p-8 flex flex-col justify-between selection:bg-[#00f0ff] selection:text-black">
      {/* Header bar */}
      <div className="border border-[#00f0ff]/30 bg-[#0c121d] p-4 rounded-t-lg flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#00f0ff]/10 border border-[#00f0ff]/40 rounded">
            <Cpu className="w-5 h-5 text-[#00f0ff]" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-widest uppercase text-[#00f0ff] flex items-center gap-2">
              CYBERPUNK SCHOLAR TUI // VARIANT C
            </h1>
            <p className="text-[11px] text-[#00f0ff]/70">Dual-Pane Parallel Translation Terminal</p>
          </div>
        </div>

        {/* Translation Selector Controls */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-[11px] text-[#00f0ff]/60">TRANSLATION:</span>
          {(["KJV", "WEB", "ASV"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setSelectedTranslation(t)}
              className={`px-2.5 py-1 rounded font-bold border transition ${
                selectedTranslation === t
                  ? "bg-[#00f0ff] text-black border-[#00f0ff]"
                  : "border-[#00f0ff]/30 hover:bg-[#00f0ff]/10"
              }`}
            >
              {t}
            </button>
          ))}
          <button
            onClick={() => setCompareMode(!compareMode)}
            className={`px-3 py-1 rounded font-bold border ml-2 transition flex items-center gap-1 ${
              compareMode ? "bg-[#00f0ff]/20 border-[#00f0ff]" : "border-[#00f0ff]/20 text-[#00f0ff]/60"
            }`}
          >
            <Columns className="w-3.5 h-3.5" /> DUAL-PANE COMPARE
          </button>
        </div>
      </div>

      {/* Main Dual-Pane Workspace */}
      <div className="border-x border-b border-[#00f0ff]/30 bg-[#090e17] p-4 flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Pane 1: Primary Translation Viewport */}
        <div className="border border-[#00f0ff]/20 rounded p-4 bg-[#0d1522]/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#00f0ff]/20 pb-2 mb-3 text-xs">
              <span className="font-bold uppercase tracking-wider text-[#00f0ff] flex items-center gap-1.5">
                <BookMarked className="w-4 h-4" /> PRIMARY ({selectedTranslation}) — JOHN 3
              </span>
              <span className="text-[10px] bg-[#00f0ff]/10 px-2 py-0.5 rounded">PANE 01</span>
            </div>

            <div className="space-y-3 text-xs sm:text-sm leading-relaxed">
              <p className="p-2.5 rounded bg-[#101b2d] border-l-2 border-[#00f0ff]">
                <span className="font-bold mr-2 text-[#00f0ff]">3:16</span>
                For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.
              </p>
              <p className="p-2.5 rounded bg-[#101b2d] border-l-2 border-[#00f0ff]/40">
                <span className="font-bold mr-2 text-[#00f0ff]">3:17</span>
                For God sent not his Son into the world to condemn the world; but that the world through him might be saved.
              </p>
            </div>
          </div>

          <div className="mt-4 pt-2 border-t border-[#00f0ff]/20 text-[11px] text-[#00f0ff]/60 flex items-center justify-between">
            <span>KEYBOARD: [j] NEXT VERSE | [k] PREV VERSE</span>
            <span>STATUS: READY</span>
          </div>
        </div>

        {/* Pane 2: Parallel Translation / Command Console Output */}
        <div className="border border-[#00f0ff]/20 rounded p-4 bg-[#0d1522]/80 flex flex-col justify-between">
          {compareMode ? (
            <div>
              <div className="flex items-center justify-between border-b border-[#00f0ff]/20 pb-2 mb-3 text-xs">
                <span className="font-bold uppercase tracking-wider text-[#00f0ff] flex items-center gap-1.5">
                  <Columns className="w-4 h-4" /> COMPARISON (WEB) — JOHN 3
                </span>
                <span className="text-[10px] bg-[#00f0ff]/10 px-2 py-0.5 rounded">PANE 02</span>
              </div>

              <div className="space-y-3 text-xs sm:text-sm leading-relaxed">
                <p className="p-2.5 rounded bg-[#101b2d] border-l-2 border-emerald-400">
                  <span className="font-bold mr-2 text-emerald-400">3:16</span>
                  For God so loved the world, that he gave his only begotten Son, that whoever believes in him should not perish, but have eternal life.
                </p>
                <p className="p-2.5 rounded bg-[#101b2d] border-l-2 border-emerald-400/40">
                  <span className="font-bold mr-2 text-emerald-400">3:17</span>
                  For God didn&apos;t send his Son into the world to judge the world, but that the world should be saved through him.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-[#00f0ff]/20 pb-2 mb-3 text-xs">
                <span className="font-bold uppercase tracking-wider text-[#00f0ff] flex items-center gap-1.5">
                  <Terminal className="w-4 h-4" /> CONSOLE EXECUTION LOG
                </span>
              </div>
              <div className="space-y-1 text-xs text-[#00f0ff]/80">
                <p>&gt; :read John 3:16-17</p>
                <p>&gt; Fetching passage from D1 cache...</p>
                <p>&gt; D1 Response: 200 OK (1.8ms)</p>
              </div>
            </div>
          )}

          {/* Bottom Command Bar */}
          <div className="mt-4 pt-3 border-t border-[#00f0ff]/20 flex items-center gap-2">
            <Command className="w-4 h-4 text-[#00f0ff]" />
            <input
              type="text"
              placeholder="Enter :read, :compare, :search..."
              className="flex-1 bg-transparent outline-none text-xs text-[#00f0ff] placeholder-[#00f0ff]/40 font-mono"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
