'use client'

import Link from "next/link";
import { GitFork, Cross, Plus } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { KofiOverlay } from "@/components/ui/kofi-overlay";

const siteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "From Adam to Jesus",
  "url": "https://fromadamtojesus.com",
  "description":
    "Explore the biblical narrative through interactive history — the genealogy of Jesus, the twelve apostles, and more.",
};

const siteJsonLdString = JSON.stringify(siteJsonLd);

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: siteJsonLdString }}
      />
      <KofiOverlay />
      <main className="min-h-screen bg-black flex flex-col">
        {/* Hero */}
        <section className="flex flex-col items-center justify-center pt-32 pb-16 px-4">
          <h1 className="text-5xl md:text-7xl font-bold text-zinc-50 text-center tracking-tight">
            From Adam to Jesus
          </h1>
          <p className="mt-6 text-lg md:text-xl text-zinc-400 text-center max-w-xl leading-relaxed">
            Explore the biblical narrative through interactive history
          </p>
        </section>

        {/* Card Grid */}
        <section className="w-full max-w-5xl mx-auto px-4 pb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Lineage Card */}
            <Link href="/lineage" className="group block">
              <Card className="h-full border-zinc-800 bg-zinc-950 transition-all duration-300 group-hover:-translate-y-1 group-hover:border-amber-400/60 group-hover:shadow-lg group-hover:shadow-amber-900/10 cursor-pointer">
                <CardHeader>
                  <GitFork className="size-8 text-amber-400/80 mb-2" />
                  <CardTitle className="text-zinc-50 text-xl">
                    The Genealogy
                  </CardTitle>
                  <CardDescription className="text-zinc-400 text-sm leading-relaxed">
                    Trace the complete family tree from Adam to Jesus through the
                    royal and biological lines.
                  </CardDescription>
                </CardHeader>
                <CardContent />
              </Card>
            </Link>

            {/* Martyrdom Card */}
            <Link href="/disciples/martyrdom" className="group block">
              <Card className="h-full border-zinc-800 bg-zinc-950 transition-all duration-300 group-hover:-translate-y-1 group-hover:border-amber-400/60 group-hover:shadow-lg group-hover:shadow-amber-900/10 cursor-pointer">
                <CardHeader>
                  <Cross className="size-8 text-red-400/80 mb-2" />
                  <CardTitle className="text-zinc-50 text-xl">
                    The Disciples
                  </CardTitle>
                  <CardDescription className="text-zinc-400 text-sm leading-relaxed">
                    Explore the historical accounts of the twelve apostles and
                    their martyrdoms.
                  </CardDescription>
                </CardHeader>
                <CardContent />
              </Card>
            </Link>

            {/* Coming Soon Card */}
            <Card className="h-full border-zinc-800 bg-zinc-950 opacity-50 cursor-default">
              <CardHeader>
                <Plus className="size-8 text-zinc-600 mb-2" />
                <CardTitle className="text-zinc-500 text-xl">
                  More Coming Soon
                </CardTitle>
                <CardDescription className="text-zinc-600 text-sm leading-relaxed">
                  Additional resources and interactive studies are on the way.
                </CardDescription>
              </CardHeader>
              <CardContent />
            </Card>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 flex flex-col gap-6 justify-center items-center border-t border-zinc-900 bg-black/50 backdrop-blur-sm">
          <p className="text-zinc-500 text-sm font-medium tracking-wide">
            Created with faith, by Nicola{" "}
            <span
              role="img"
              aria-label="cross"
              className="ml-1 text-zinc-400"
            >
              ✝️
            </span>
          </p>
        </footer>
      </main>
    </>
  );
}
