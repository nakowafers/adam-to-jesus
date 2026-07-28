import React, { Suspense } from "react";
import { Metadata } from "next";
import { BibleTui } from "@/components/bible/bible-tui";

export const metadata: Metadata = {
  title: "Browser Bible TUI | From Adam to Jesus",
  description: "A built-in retro browser terminal Bible reader powered by Cloudflare D1 with FTS5 search, Vim keybindings, and parallel translation comparison.",
};

export default function BiblePage() {
  return (
    <main className="min-h-[calc(100vh-44px)] bg-[#070a0f] text-[#00f0ff] p-4 sm:p-8 flex flex-col justify-between selection:bg-[#00f0ff] selection:text-black">
      <Suspense fallback={<div className="font-mono text-xs text-[#00f0ff] p-4">Initializing Bible TUI Terminal...</div>}>
        <BibleTui />
      </Suspense>
    </main>
  );
}
