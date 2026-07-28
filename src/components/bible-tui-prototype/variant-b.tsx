"use client";

import React, { useState } from "react";
import { Search, Sparkles, Terminal as TermIcon, ShieldCheck, Zap } from "lucide-react";

export function VariantB() {
  const [activeTab, setActiveTab] = useState<"read" | "search">("read");
  const [searchQuery, setSearchQuery] = useState("light");
  const [commandInput, setCommandInput] = useState("");
  const [currentPassage, setCurrentPassage] = useState("MATTHEW 1");

  const searchResults = [
    { verseKey: "GEN.1.3", text: "And God said, Let there be light: and there was light.", book: "Genesis 1:3" },
    { verseKey: "MAT.5.14", text: "Ye are the light of the world. A city that is set on an hill cannot be hid.", book: "Matthew 5:14" },
    { verseKey: "JHN.1.5", text: "And the light shineth in darkness; and the darkness comprehended it not.", book: "John 1:5" },
  ];

  return (
    <div className="min-h-screen bg-[#020b04] text-[#00ff66] font-mono p-4 sm:p-8 flex flex-col justify-between selection:bg-[#00ff66] selection:text-black relative">
      {/* Matrix Glowing Border & Grid Background */}
      <div className="absolute inset-0 bg-[radial-gradient(#00ff66_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none"></div>

      {/* Top Banner Navigation & Quick Action Bar */}
      <div className="border border-[#00ff66]/40 bg-[#04190b]/80 p-4 rounded-t-lg backdrop-blur flex flex-wrap items-center justify-between gap-4 z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#00ff66]/10 border border-[#00ff66]/40 rounded">
            <TermIcon className="w-5 h-5 text-[#00ff66]" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-wider uppercase text-[#00ff66]">
              MATRIX BIBLE TUI // VARIANT B
            </h1>
            <p className="text-[11px] text-[#00ff66]/70">Cloudflare D1 High-Throughput Matrix Console</p>
          </div>
        </div>

        {/* Action Tabs */}
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => setActiveTab("read")}
            className={`px-3 py-1.5 rounded font-bold transition flex items-center gap-1.5 ${
              activeTab === "read" ? "bg-[#00ff66] text-black shadow-[0_0_15px_rgba(0,255,102,0.5)]" : "border border-[#00ff66]/30 hover:bg-[#00ff66]/10"
            }`}
          >
            <Zap className="w-3.5 h-3.5" /> [1] Passage Reader
          </button>
          <button
            onClick={() => setActiveTab("search")}
            className={`px-3 py-1.5 rounded font-bold transition flex items-center gap-1.5 ${
              activeTab === "search" ? "bg-[#00ff66] text-black shadow-[0_0_15px_rgba(0,255,102,0.5)]" : "border border-[#00ff66]/30 hover:bg-[#00ff66]/10"
            }`}
          >
            <Search className="w-3.5 h-3.5" /> [2] FTS5 Search
          </button>
        </div>
      </div>

      {/* Main Terminal Viewport Container */}
      <div className="border-x border-b border-[#00ff66]/40 bg-[#031408]/90 p-6 flex-1 flex flex-col justify-between z-10">
        {activeTab === "read" ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#00ff66]/30 pb-3 text-xs">
              <span className="font-bold tracking-widest text-sm flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" /> ACTIVE PASSAGE: {currentPassage} (KJV)
              </span>
              <span className="text-[11px] bg-[#00ff66]/20 px-2 py-0.5 rounded">
                D1 LATENCY: 3.2ms
              </span>
            </div>

            <div className="space-y-3 text-sm leading-relaxed max-w-4xl">
              <p className="p-3 border border-[#00ff66]/20 rounded bg-[#041a0b]/40 hover:border-[#00ff66]/60 transition">
                <span className="font-bold text-[#00ff66] mr-2">1:1</span>
                The book of the generation of Jesus Christ, the son of David, the son of Abraham.
              </p>
              <p className="p-3 border border-[#00ff66]/20 rounded bg-[#041a0b]/40 hover:border-[#00ff66]/60 transition">
                <span className="font-bold text-[#00ff66] mr-2">1:2</span>
                Abraham begat Isaac; and Isaac begat Jacob; and Jacob begat Judas and his brethren...
              </p>
              <p className="p-3 border border-[#00ff66]/20 rounded bg-[#041a0b]/40 hover:border-[#00ff66]/60 transition">
                <span className="font-bold text-[#00ff66] mr-2">1:17</span>
                So all the generations from Abraham to David are fourteen generations; and from David until the carrying away into Babylon are fourteen generations; and from the carrying away into Babylon unto Christ are fourteen generations.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter FTS5 search term..."
                className="flex-1 bg-[#020b04] border border-[#00ff66]/50 rounded px-3 py-2 text-sm text-[#00ff66] outline-none font-mono focus:ring-1 focus:ring-[#00ff66]"
              />
              <button className="bg-[#00ff66] text-black font-bold px-4 py-2 rounded text-xs">
                QUERY D1 FTS
              </button>
            </div>

            <div className="space-y-3">
              <p className="text-xs text-[#00ff66]/70">FOUND {searchResults.length} RESULTS FOR &quot;{searchQuery}&quot; (FTS5 RANK ORDER):</p>
              {searchResults.map((res) => (
                <div key={res.verseKey} className="p-3 border border-[#00ff66]/30 rounded bg-[#041a0b]/60">
                  <span className="text-xs font-bold bg-[#00ff66]/20 px-2 py-0.5 rounded mr-2">
                    {res.book}
                  </span>
                  <span className="text-sm">{res.text}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Matrix Command Prompt Dock */}
        <div className="mt-8 pt-4 border-t border-[#00ff66]/30 flex items-center gap-3">
          <span className="text-xs font-bold text-black bg-[#00ff66] px-2 py-1 rounded">
            MATRIX Prompt &gt;
          </span>
          <input
            type="text"
            value={commandInput}
            onChange={(e) => setCommandInput(e.target.value)}
            placeholder="Try :read Mat 1, :search light, :help..."
            className="flex-1 bg-transparent border-none outline-none text-sm text-[#00ff66] placeholder-[#00ff66]/40 font-mono"
          />
        </div>
      </div>
    </div>
  );
}
