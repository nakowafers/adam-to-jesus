"use client";

import { useState, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  Layers, 
  Table, 
  BookOpen, 
  ExternalLink, 
  CheckCircle2, 
  ChevronRight, 
  Columns3, 
  Search, 
  Filter, 
  ArrowDown, 
  Info,
  Calendar,
  Bookmark
} from "lucide-react";

import type { Ancestor } from "@/lib/lineage-data";
import type { LineageGraph } from "@/lib/lineage-repository";

interface PrototypeTimelineViewProps {
  initialGraph: LineageGraph;
}

const EPOCHS = [
  { id: "all", label: "All Epochs" },
  { id: "Patriarchs", label: "Patriarchs (Adam-Joseph)" },
  { id: "Exodus & Conquest", label: "Exodus & Judges" },
  { id: "United Monarchy", label: "United Monarchy (David)" },
  { id: "Divided Monarchy & Exile", label: "Exile Era" },
  { id: "Gospel Era", label: "Gospel Era (Jesus)" },
];

function getEpochForAncestor(ancestor: Ancestor): string {
  const gen = ancestor.generation;
  if (gen <= 20) return "Patriarchs";
  if (gen <= 32) return "Exodus & Conquest";
  if (gen === 33) return "United Monarchy";
  if (gen < 60) return "Divided Monarchy & Exile";
  return "Gospel Era";
}

export function PrototypeTimelineView({ initialGraph }: PrototypeTimelineViewProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const variantParam = searchParams?.get("variant") || "1";
  const activeVariant = parseInt(variantParam, 10) || 1;

  const { mainLineage, royalLine, biologicalLine, jesus } = initialGraph;

  const allAncestors = useMemo(() => {
    const list = [...mainLineage, ...royalLine, ...biologicalLine];
    if (jesus) list.push(jesus);
    return list;
  }, [mainLineage, royalLine, biologicalLine, jesus]);

  const [selectedId, setSelectedId] = useState<string>(allAncestors[0]?.id || "adam");
  const [activeEpoch, setActiveEpoch] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const selectedAncestor = useMemo(
    () => allAncestors.find((a) => a.id === selectedId) || allAncestors[0],
    [allAncestors, selectedId]
  );

  const filteredMain = useMemo(() => {
    return mainLineage.filter((a) => {
      const epoch = getEpochForAncestor(a);
      const matchesEpoch = activeEpoch === "all" || epoch === activeEpoch;
      const matchesSearch = !searchQuery || a.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesEpoch && matchesSearch;
    });
  }, [mainLineage, activeEpoch, searchQuery]);

  const filteredRoyal = useMemo(() => {
    return royalLine.filter((a) => {
      const epoch = getEpochForAncestor(a);
      const matchesEpoch = activeEpoch === "all" || epoch === activeEpoch;
      const matchesSearch = !searchQuery || a.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesEpoch && matchesSearch;
    });
  }, [royalLine, activeEpoch, searchQuery]);

  const filteredBiological = useMemo(() => {
    return biologicalLine.filter((a) => {
      const epoch = getEpochForAncestor(a);
      const matchesEpoch = activeEpoch === "all" || epoch === activeEpoch;
      const matchesSearch = !searchQuery || a.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesEpoch && matchesSearch;
    });
  }, [biologicalLine, activeEpoch, searchQuery]);

  const setVariant = (v: number) => {
    const params = new URLSearchParams(searchParams?.toString() || "");
    params.set("variant", v.toString());
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-33px)] bg-zinc-950 pb-24">
      {/* Sticky Header & Epoch Bar */}
      <header className="sticky top-0 z-30 bg-zinc-900/90 backdrop-blur-md border-b border-zinc-800 px-4 py-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Columns3 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-zinc-100 flex items-center gap-2">
              Genealogy Timeline
              <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-amber-400 border border-zinc-700">
                Variant {activeVariant}
              </span>
            </h1>
            <p className="text-xs text-zinc-400">Adam to Jesus Christ • NLT Biblical Lineage</p>
          </div>
        </div>

        {/* Search & Epoch Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-zinc-500" />
            <input
              type="text"
              placeholder="Search ancestor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-zinc-950 border border-zinc-800 rounded-md pl-8 pr-3 py-1 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-500/50 w-36 md:w-48"
            />
          </div>

          <div className="flex items-center gap-1 overflow-x-auto py-1 scrollbar-none">
            {EPOCHS.map((epoch) => (
              <button
                key={epoch.id}
                onClick={() => setActiveEpoch(epoch.id)}
                className={`text-xs px-2.5 py-1 rounded-full font-medium whitespace-nowrap transition-colors ${
                  activeEpoch === epoch.id
                    ? "bg-amber-500 text-zinc-950 font-semibold"
                    : "bg-zinc-800/60 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
                }`}
              >
                {epoch.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content Area based on Active Variant */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6">
        {activeVariant === 1 && (
          <VariantOne
            mainLineage={filteredMain}
            royalLine={filteredRoyal}
            biologicalLine={filteredBiological}
            jesus={jesus}
            selectedAncestor={selectedAncestor}
            onSelect={setSelectedId}
          />
        )}

        {activeVariant === 2 && (
          <VariantTwo
            allAncestors={allAncestors}
            mainLineage={filteredMain}
            royalLine={filteredRoyal}
            biologicalLine={filteredBiological}
            jesus={jesus}
            selectedAncestor={selectedAncestor}
            onSelect={setSelectedId}
          />
        )}

        {activeVariant === 3 && (
          <VariantThree
            allAncestors={allAncestors}
            selectedAncestor={selectedAncestor}
            onSelect={setSelectedId}
          />
        )}
      </div>

      {/* Floating Bottom Variant Switcher Bar */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 bg-zinc-900/95 border border-zinc-700/80 shadow-2xl rounded-full px-4 py-2 flex items-center gap-2 backdrop-blur-xl">
        <span className="text-xs font-mono text-zinc-400 mr-1 hidden sm:inline">VARIATION:</span>
        
        <button
          onClick={() => setVariant(1)}
          className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-medium transition-all ${
            activeVariant === 1
              ? "bg-amber-500 text-zinc-950 font-bold shadow-lg shadow-amber-500/20"
              : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
          }`}
        >
          <Columns3 className="w-3.5 h-3.5" />
          1. Split Deck
        </button>

        <button
          onClick={() => setVariant(2)}
          className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-medium transition-all ${
            activeVariant === 2
              ? "bg-amber-500 text-zinc-950 font-bold shadow-lg shadow-amber-500/20"
              : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          2. Stream & Tray
        </button>

        <button
          onClick={() => setVariant(3)}
          className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-medium transition-all ${
            activeVariant === 3
              ? "bg-amber-500 text-zinc-950 font-bold shadow-lg shadow-amber-500/20"
              : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
          }`}
        >
          <Table className="w-3.5 h-3.5" />
          3. Study Table
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// VARIANT 1: Dual-Column Parallel Timeline + Persistent Side Detail Panel
// ---------------------------------------------------------------------------
function VariantOne({
  mainLineage,
  royalLine,
  biologicalLine,
  jesus,
  selectedAncestor,
  onSelect,
}: {
  mainLineage: Ancestor[];
  royalLine: Ancestor[];
  biologicalLine: Ancestor[];
  jesus?: Ancestor;
  selectedAncestor: Ancestor;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Timeline Column (7 or 8 cols on desktop) */}
      <div className="lg:col-span-7 xl:col-span-8 space-y-8">
        {/* Single Trunk Header */}
        <div className="relative pl-6 border-l-2 border-amber-500/40 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider">
            Main Patriarchal Lineage (Adam ➔ David)
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {mainLineage.map((node) => (
              <AncestorCard
                key={node.id}
                node={node}
                isSelected={selectedAncestor?.id === node.id}
                onSelect={() => onSelect(node.id)}
              />
            ))}
          </div>
        </div>

        {/* Branching Divider */}
        <div className="relative py-4 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-800" />
          </div>
          <div className="relative inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-900 border border-zinc-700 text-xs font-bold text-zinc-300">
            <span>Branching after King David (Gen 33)</span>
            <ArrowDown className="w-3.5 h-3.5 text-amber-400" />
          </div>
        </div>

        {/* Dual Parallel Branch Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Royal Line Column */}
          <div className="space-y-3 pl-4 border-l-2 border-amber-500/60 bg-amber-950/10 p-3 rounded-r-xl border-y border-r border-amber-500/10">
            <div className="flex items-center justify-between pb-2 border-b border-amber-500/20">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                👑 Royal Line (Matthew 1)
              </span>
              <span className="text-[10px] text-zinc-500 font-mono">Via Solomon</span>
            </div>
            <div className="space-y-2">
              {royalLine.map((node) => (
                <AncestorCard
                  key={node.id}
                  node={node}
                  isSelected={selectedAncestor?.id === node.id}
                  onSelect={() => onSelect(node.id)}
                  compact
                />
              ))}
            </div>
          </div>

          {/* Biological Line Column */}
          <div className="space-y-3 pl-4 border-l-2 border-emerald-500/60 bg-emerald-950/10 p-3 rounded-r-xl border-y border-r border-emerald-500/10">
            <div className="flex items-center justify-between pb-2 border-b border-emerald-500/20">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                🌿 Biological Line (Luke 3)
              </span>
              <span className="text-[10px] text-zinc-500 font-mono">Via Nathan</span>
            </div>
            <div className="space-y-2">
              {biologicalLine.map((node) => (
                <AncestorCard
                  key={node.id}
                  node={node}
                  isSelected={selectedAncestor?.id === node.id}
                  onSelect={() => onSelect(node.id)}
                  compact
                />
              ))}
            </div>
          </div>
        </div>

        {/* Convergence Terminal */}
        {jesus && (
          <div className="relative p-6 rounded-2xl bg-gradient-to-br from-amber-950/30 via-zinc-900 to-amber-900/20 border-2 border-amber-500/50 shadow-2xl text-center space-y-3">
            <span className="inline-block px-3 py-1 rounded-full bg-amber-500 text-zinc-950 text-xs font-bold uppercase tracking-widest">
              Fulfillment of Lineage
            </span>
            <h2 className="text-2xl font-black text-amber-200 tracking-tight">{jesus.name}</h2>
            <p className="text-xs text-zinc-400 max-w-lg mx-auto leading-relaxed">{jesus.summary}</p>
            <button
              onClick={() => onSelect(jesus.id)}
              className="mt-2 text-xs font-semibold text-amber-400 underline underline-offset-4 hover:text-amber-300"
            >
              View Complete Prophetic References →
            </button>
          </div>
        )}
      </div>

      {/* Docked Side-by-Side Research Panel (Desktop) */}
      <div className="lg:col-span-5 xl:col-span-4 sticky top-20">
        <DetailPanel ancestor={selectedAncestor} />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// VARIANT 2: Synchronized Lineage Stream + Bottom Inspector Tray
// ---------------------------------------------------------------------------
function VariantTwo({
  allAncestors,
  mainLineage,
  royalLine,
  biologicalLine,
  jesus,
  selectedAncestor,
  onSelect,
}: {
  allAncestors: Ancestor[];
  mainLineage: Ancestor[];
  royalLine: Ancestor[];
  biologicalLine: Ancestor[];
  jesus?: Ancestor;
  selectedAncestor: Ancestor;
  onSelect: (id: string) => void;
}) {
  const [lineFilter, setLineFilter] = useState<"all" | "royal" | "bio">("all");

  const displayList = useMemo(() => {
    if (lineFilter === "royal") return [...mainLineage, ...royalLine, ...(jesus ? [jesus] : [])];
    if (lineFilter === "bio") return [...mainLineage, ...biologicalLine, ...(jesus ? [jesus] : [])];
    return allAncestors;
  }, [lineFilter, mainLineage, royalLine, biologicalLine, jesus, allAncestors]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Stream Lineage Switcher */}
      <div className="flex items-center justify-between bg-zinc-900 border border-zinc-800 p-2 rounded-xl">
        <span className="text-xs font-medium text-zinc-400 px-2">Lineage Filter:</span>
        <div className="flex gap-1">
          <button
            onClick={() => setLineFilter("all")}
            className={`text-xs px-3 py-1 rounded-lg font-medium transition-colors ${
              lineFilter === "all" ? "bg-amber-500 text-zinc-950 font-bold" : "text-zinc-400 hover:bg-zinc-800"
            }`}
          >
            All Generations ({allAncestors.length})
          </button>

          <button
            onClick={() => setLineFilter("royal")}
            className={`text-xs px-3 py-1 rounded-lg font-medium transition-colors ${
              lineFilter === "royal" ? "bg-amber-500 text-zinc-950 font-bold" : "text-zinc-400 hover:bg-zinc-800"
            }`}
          >
            Matthew 1 Royal Only
          </button>

          <button
            onClick={() => setLineFilter("bio")}
            className={`text-xs px-3 py-1 rounded-lg font-medium transition-colors ${
              lineFilter === "bio" ? "bg-emerald-500 text-zinc-950 font-bold" : "text-zinc-400 hover:bg-zinc-800"
            }`}
          >
            Luke 3 Bio Only
          </button>
        </div>
      </div>

      {/* Stream Cards */}
      <div className="space-y-3 relative before:absolute before:left-6 before:top-4 before:bottom-4 before:w-0.5 before:bg-zinc-800">
        {displayList.map((ancestor, index) => {
          const isSelected = selectedAncestor?.id === ancestor.id;
          const isRoyal = ancestor.lineage === "royal";
          const isBio = ancestor.lineage === "biological";

          return (
            <motion.div
              key={ancestor.id}
              onClick={() => onSelect(ancestor.id)}
              className={`relative pl-12 pr-4 py-3 rounded-xl border transition-all cursor-pointer ${
                isSelected
                  ? "bg-zinc-900 border-amber-500/80 shadow-lg shadow-amber-500/10 ring-1 ring-amber-500/50"
                  : "bg-zinc-900/60 border-zinc-800/80 hover:border-zinc-700"
              }`}
            >
              {/* Generation Indicator Dot */}
              <div
                className={`absolute left-4 top-4 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  isRoyal
                    ? "border-amber-400 bg-amber-950"
                    : isBio
                    ? "border-emerald-400 bg-emerald-950"
                    : "border-zinc-400 bg-zinc-900"
                }`}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-current text-white" />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-amber-400/80">
                    Gen {ancestor.generation}
                  </span>
                  <h3 className="text-sm font-bold text-zinc-100">{ancestor.name}</h3>
                  <span className="text-xs text-zinc-400 font-medium">({ancestor.title})</span>
                </div>

                <div className="flex items-center gap-2">
                  {isRoyal && (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      Matthew 1 Royal
                    </span>
                  )}
                  {isBio && (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Luke 3 Bio
                    </span>
                  )}
                  <span className="text-[10px] text-zinc-500 font-mono">{ancestor.verseReference}</span>
                </div>
              </div>

              <p className="text-xs text-zinc-400 line-clamp-1 mt-1">{ancestor.summary}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Floating Bottom Inspector Tray */}
      {selectedAncestor && (
        <div className="sticky bottom-16 bg-zinc-900/95 border border-amber-500/30 p-4 rounded-2xl shadow-2xl backdrop-blur-md">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider">
                Active Selection • Gen {selectedAncestor.generation}
              </span>
              <h2 className="text-lg font-bold text-zinc-100">{selectedAncestor.name}</h2>
              <p className="text-xs text-zinc-400 mt-1 max-w-2xl">{selectedAncestor.summary}</p>
            </div>
            <a
              href={selectedAncestor.verseLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 font-medium hover:bg-amber-500/20 flex items-center gap-1"
            >
              <BookOpen className="w-3.5 h-3.5" />
              {selectedAncestor.verseReference}
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// VARIANT 3: Master-Detail Academic Study Table
// ---------------------------------------------------------------------------
function VariantThree({
  allAncestors,
  selectedAncestor,
  onSelect,
}: {
  allAncestors: Ancestor[];
  selectedAncestor: Ancestor;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Master Timeline Table */}
      <div className="lg:col-span-7 bg-zinc-900/60 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-3 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between">
          <span className="text-xs font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-2">
            <Table className="w-4 h-4 text-amber-400" />
            Scholarly Genealogy Register
          </span>
          <span className="text-xs text-zinc-500">{allAncestors.length} Ancestor Entries</span>
        </div>

        <div className="overflow-x-auto max-h-[70vh] scrollbar-thin">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-zinc-950/80 text-zinc-400 sticky top-0 border-b border-zinc-800 font-mono uppercase text-[10px]">
              <tr>
                <th className="py-2.5 px-3">Gen</th>
                <th className="py-2.5 px-3">Name / Title</th>
                <th className="py-2.5 px-3">Lineage</th>
                <th className="py-2.5 px-3">Scripture</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
              {allAncestors.map((ancestor) => {
                const isSelected = selectedAncestor?.id === ancestor.id;
                return (
                  <tr
                    key={ancestor.id}
                    onClick={() => onSelect(ancestor.id)}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-amber-500/15 text-amber-200 font-semibold"
                        : "hover:bg-zinc-800/50"
                    }`}
                  >
                    <td className="py-2 px-3 font-mono text-zinc-400">{ancestor.generation}</td>
                    <td className="py-2 px-3">
                      <div className="font-bold text-zinc-100">{ancestor.name}</div>
                      <div className="text-[10px] text-zinc-400 line-clamp-1">{ancestor.title}</div>
                    </td>
                    <td className="py-2 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] uppercase font-mono font-medium ${
                          ancestor.lineage === "royal"
                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                            : ancestor.lineage === "biological"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-zinc-800 text-zinc-400"
                        }`}
                      >
                        {ancestor.lineage}
                      </span>
                    </td>
                    <td className="py-2 px-3 font-mono text-amber-400/80 text-[11px]">
                      {ancestor.verseReference}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Right Study Canvas */}
      <div className="lg:col-span-5 sticky top-20">
        <DetailPanel ancestor={selectedAncestor} academic />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Shared Side-by-Side Research Detail Panel
// ---------------------------------------------------------------------------
function AncestorCard({
  node,
  isSelected,
  onSelect,
  compact = false,
}: {
  node: Ancestor;
  isSelected: boolean;
  onSelect: () => void;
  compact?: boolean;
}) {
  return (
    <div
      onClick={onSelect}
      className={`p-3 rounded-xl border transition-all cursor-pointer ${
        isSelected
          ? "bg-zinc-900 border-amber-500/90 shadow-md shadow-amber-500/10 ring-1 ring-amber-500/50"
          : "bg-zinc-900/60 border-zinc-800 hover:border-zinc-700"
      }`}
    >
      <div className="flex items-center justify-between gap-1">
        <span className="text-[10px] font-mono font-semibold text-amber-400/90">Gen {node.generation}</span>
        <span className="text-[10px] text-zinc-500 font-mono truncate max-w-[120px]">
          {node.verseReference}
        </span>
      </div>

      <h4 className="text-xs font-bold text-zinc-100 mt-0.5">{node.name}</h4>
      {!compact && <p className="text-[11px] text-zinc-400 line-clamp-1 mt-1">{node.title}</p>}
    </div>
  );
}

function DetailPanel({ ancestor, academic = false }: { ancestor: Ancestor; academic?: boolean }) {
  if (!ancestor) return null;

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-2xl space-y-4">
      {/* Header */}
      <div className="border-b border-zinc-800 pb-3 flex items-start justify-between">
        <div>
          <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest">
            {getEpochForAncestor(ancestor)} • Gen {ancestor.generation}
          </span>
          <h2 className="text-xl font-black text-zinc-100 mt-0.5">{ancestor.name}</h2>
          <p className="text-xs text-amber-300 font-medium">{ancestor.title}</p>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono font-bold uppercase">
          {ancestor.lineage}
        </span>
      </div>

      {/* Summary */}
      <div className="space-y-1">
        <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-amber-400" />
          Historical Overview
        </h4>
        <p className="text-xs text-zinc-300 leading-relaxed bg-zinc-950/60 p-3 rounded-xl border border-zinc-800/80">
          {ancestor.summary}
        </p>
      </div>

      {/* Scripture Reference */}
      <div className="space-y-2">
        <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5 text-amber-400" />
          Holy Scripture (NLT)
        </h4>

        <div className="p-3 bg-amber-950/20 border border-amber-500/20 rounded-xl space-y-2">
          <p className="text-xs text-amber-100 italic leading-relaxed">
            &ldquo;{ancestor.verse || "Generational scripture record provided in NLT text."}&rdquo;
          </p>
          <div className="flex items-center justify-between pt-1 border-t border-amber-500/10">
            <span className="text-[11px] font-mono text-amber-400 font-bold">
              {ancestor.verseReference}
            </span>
            <a
              href={ancestor.verseLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] text-amber-300 hover:text-amber-200 underline flex items-center gap-1"
            >
              Read full chapter <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {academic && (
        <div className="pt-2 border-t border-zinc-800 text-[11px] text-zinc-400 space-y-1">
          <div className="flex justify-between">
            <span>Historical Certainty:</span>
            <span className="text-emerald-400 font-semibold">Scriptural Record</span>
          </div>
          <div className="flex justify-between">
            <span>Branch Alignment:</span>
            <span className="text-zinc-300">{ancestor.lineage === "main" ? "Unified Trunk" : ancestor.lineage}</span>
          </div>
        </div>
      )}
    </div>
  );
}
