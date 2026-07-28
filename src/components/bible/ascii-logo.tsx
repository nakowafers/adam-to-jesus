import React from "react";

export function AsciiLogo() {
  return (
    <div className="font-mono text-[9px] sm:text-xs text-[#00f0ff] leading-tight select-none border-b border-[#00f0ff]/30 pb-3 mb-4">
      <pre className="font-bold tracking-tight text-shadow-[0_0_12px_rgba(0,240,255,0.6)] hidden sm:block">
{`
┌── BIBLE TUI ───────────────────────────────────────────────────────────────────────────── [v1.0] ──┐
│  ____  _____ ____  _     _____   _____ _   _ _____                                            │
│ | __ )|_   _| __ )| |   | ____| |_   _| | | |_   _|                                           │
│ |  _ \\  | | |  _ \\| |___|  _|     | | | |_| | | |                                            │
│ | |_) | | | | |_) | _____| |___   | | |  _  | | |                                            │
│ |____/  |_| |____/|_____|_____|   |_| |_| |_| |_|                                            │
└───────────────────────────────────────────────────── CHARM/LIPGLOSS ENGINE (D1 EDGE FTS5) ──┘
`}
      </pre>

      {/* Mobile Compact ASCII Header */}
      <div className="block sm:hidden border border-[#00f0ff]/40 p-2 rounded bg-[#0d1522]/80">
        <div className="flex items-center justify-between text-[11px] font-bold">
          <span className="text-[#00f0ff]">┌── BIBLE TUI ──┐</span>
          <span className="bg-[#00f0ff]/20 px-1.5 py-0.5 rounded text-[10px]">v1.0</span>
        </div>
      </div>
    </div>
  );
}
