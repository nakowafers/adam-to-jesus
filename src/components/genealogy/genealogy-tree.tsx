"use client";

import { useState, useMemo, useCallback } from "react";
import { 
  Table, 
  Search, 
  BookOpen, 
  ExternalLink, 
  Info,
  Layers,
  Filter,
  CheckCircle2
} from "lucide-react";
import type { Ancestor } from "@/lib/lineage-data";
import type { LineageGraph } from "@/lib/lineage-repository";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEntitySelection } from "@/hooks/use-entity-selection";
import { AncestorDrawer } from "./ancestor-drawer";

interface GenealogyTreeProps {
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

export function GenealogyTree({ initialGraph }: GenealogyTreeProps) {
  const isMobile = useIsMobile();
  const { mainLineage, royalLine, biologicalLine, jesus } = initialGraph;

  const allAncestors = useMemo(() => {
    const list = [...mainLineage, ...royalLine, ...biologicalLine];
    if (jesus) list.push(jesus);
    return list;
  }, [mainLineage, royalLine, biologicalLine, jesus]);

  const {
    selectedEntity: selectedAncestor,
    selectedId,
    selectEntity,
    clearSelection,
  } = useEntitySelection("ancestor", allAncestors);

  const [activeEpoch, setActiveEpoch] = useState<string>("all");
  const [activeLineageFilter, setActiveLineageFilter] = useState<"all" | "main" | "royal" | "biological">("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredAncestors = useMemo(() => {
    return allAncestors.filter((a) => {
      const epoch = getEpochForAncestor(a);
      const matchesEpoch = activeEpoch === "all" || epoch === activeEpoch;
      const matchesLineage = activeLineageFilter === "all" || a.lineage === activeLineageFilter;
      const matchesSearch =
        !searchQuery ||
        a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.verseReference.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesEpoch && matchesLineage && matchesSearch;
    });
  }, [allAncestors, activeEpoch, activeLineageFilter, searchQuery]);

  const handleRowClick = useCallback(
    (id: string) => {
      selectEntity(id);
    },
    [selectEntity]
  );

  const handleCloseDrawer = useCallback(() => {
    clearSelection();
  }, [clearSelection]);

  const activeAncestor = selectedAncestor || (filteredAncestors.length > 0 ? filteredAncestors[0] : allAncestors[0]);

  return (
    <div className="min-h-[calc(100vh-44px)] bg-zinc-950 text-zinc-100 p-4 md:p-6 lg:p-8 space-y-6">
      {/* Header & Filter Controls Bar */}
      <header className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4 md:p-5 shadow-xl backdrop-blur-md flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Table className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg md:text-xl font-black tracking-tight text-zinc-100 flex items-center gap-2">
              Scholarly Genealogy Register
              <span className="text-xs font-mono font-medium px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                Adam to Jesus
              </span>
            </h1>
            <p className="text-xs text-zinc-400 mt-0.5">
              Interactive Master Register • Royal (Matthew 1) & Biological (Luke 3) Lineages
            </p>
          </div>
        </div>

        {/* Search Input & Lineage Segment Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px] sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-3 text-zinc-500" />
            <input
              type="text"
              placeholder="Search by name, title, verse..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-4 py-2 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all"
            />
          </div>

          <div className="flex items-center bg-zinc-950 border border-zinc-800 p-1 rounded-xl gap-1">
            <button
              onClick={() => setActiveLineageFilter("all")}
              className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-colors ${
                activeLineageFilter === "all"
                  ? "bg-amber-500 text-zinc-950 font-bold"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              All ({allAncestors.length})
            </button>
            <button
              onClick={() => setActiveLineageFilter("main")}
              className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-colors ${
                activeLineageFilter === "main"
                  ? "bg-amber-500 text-zinc-950 font-bold"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              Main Trunk
            </button>
            <button
              onClick={() => setActiveLineageFilter("royal")}
              className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-colors ${
                activeLineageFilter === "royal"
                  ? "bg-amber-500 text-zinc-950 font-bold"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              Matthew 1
            </button>
            <button
              onClick={() => setActiveLineageFilter("biological")}
              className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-colors ${
                activeLineageFilter === "biological"
                  ? "bg-emerald-500 text-zinc-950 font-bold"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              Luke 3
            </button>
          </div>
        </div>
      </header>

      {/* Epoch Pills Navigation Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        <Filter className="w-3.5 h-3.5 text-amber-500 shrink-0 mr-1" />
        {EPOCHS.map((epoch) => (
          <button
            key={epoch.id}
            onClick={() => setActiveEpoch(epoch.id)}
            className={`text-xs px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition-all border ${
              activeEpoch === epoch.id
                ? "bg-amber-500 text-zinc-950 font-bold border-amber-400 shadow-md shadow-amber-500/20"
                : "bg-zinc-900/60 text-zinc-400 border-zinc-800 hover:text-zinc-200 hover:bg-zinc-800"
            }`}
          >
            {epoch.label}
          </button>
        ))}
      </div>

      {/* Main Grid: Master Table (Left) + Detail Study Canvas (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Master Lineage Table */}
        <div className="lg:col-span-7 bg-zinc-900/60 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
          <div className="p-3 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" />
              Ancestral Register Entries
            </span>
            <span className="text-xs font-mono text-zinc-400">
              Showing {filteredAncestors.length} of {allAncestors.length}
            </span>
          </div>

          <div className="overflow-x-auto max-h-[72vh] scrollbar-thin">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-zinc-950/90 text-zinc-400 sticky top-0 border-b border-zinc-800 font-mono uppercase text-[10px] backdrop-blur-md z-10">
                <tr>
                  <th className="py-3 px-4">Gen</th>
                  <th className="py-3 px-4">Name / Title</th>
                  <th className="py-3 px-4">Branch</th>
                  <th className="py-3 px-4">Scripture</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50 text-zinc-300">
                {filteredAncestors.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-zinc-500">
                      No ancestral entries found matching your query or filters.
                    </td>
                  </tr>
                ) : (
                  filteredAncestors.map((ancestor) => {
                    const isSelected = activeAncestor?.id === ancestor.id;
                    return (
                      <tr
                        key={ancestor.id}
                        onClick={() => handleRowClick(ancestor.id)}
                        className={`cursor-pointer transition-colors ${
                          isSelected
                            ? "bg-amber-500/20 text-amber-200 font-semibold ring-1 ring-amber-500/40"
                            : "hover:bg-zinc-800/60"
                        }`}
                      >
                        <td className="py-3 px-4 font-mono text-amber-400/90 font-bold">
                          {ancestor.generation}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-zinc-100">{ancestor.name}</div>
                          <div className="text-[11px] text-zinc-400 line-clamp-1">{ancestor.title}</div>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase font-mono font-medium border ${
                              ancestor.lineage === "royal"
                                ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                : ancestor.lineage === "biological"
                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                : "bg-zinc-800 text-zinc-300 border-zinc-700"
                            }`}
                          >
                            {ancestor.lineage === "royal"
                              ? "Matthew 1"
                              : ancestor.lineage === "biological"
                              ? "Luke 3"
                              : "Main Trunk"}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono text-amber-400/80 text-[11px]">
                          {ancestor.verseReference}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Side-by-Side Research Canvas (Desktop) */}
        {!isMobile && (
          <div className="lg:col-span-5 sticky top-20">
            {activeAncestor && <DetailStudyPanel ancestor={activeAncestor} />}
          </div>
        )}
      </div>

      {/* Mobile Drawer when row clicked */}
      {isMobile && (
        <AncestorDrawer
          ancestors={allAncestors}
          selectedId={selectedId}
          isOpen={selectedId !== null}
          onClose={handleCloseDrawer}
        />
      )}
    </div>
  );
}

function DetailStudyPanel({ ancestor }: { ancestor: Ancestor }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 md:p-6 shadow-2xl space-y-5">
      {/* Header */}
      <div className="border-b border-zinc-800 pb-4 flex items-start justify-between">
        <div>
          <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest">
            {getEpochForAncestor(ancestor)} • Generation {ancestor.generation}
          </span>
          <h2 className="text-2xl font-black text-zinc-100 mt-1">{ancestor.name}</h2>
          <p className="text-xs text-amber-300/90 font-medium mt-0.5">{ancestor.title}</p>
        </div>
        <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono font-bold uppercase">
          {ancestor.lineage === "royal"
            ? "Royal Line"
            : ancestor.lineage === "biological"
            ? "Biological Line"
            : "Main Trunk"}
        </span>
      </div>

      {/* Historical Summary */}
      <div className="space-y-1.5">
        <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
          <Info className="w-4 h-4 text-amber-400" />
          Historical Overview
        </h3>
        <p className="text-xs text-zinc-300 leading-relaxed bg-zinc-950/70 p-3.5 rounded-xl border border-zinc-800/80">
          {ancestor.summary}
        </p>
      </div>

      {/* Scripture Reference */}
      <div className="space-y-2">
        <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
          <BookOpen className="w-4 h-4 text-amber-400" />
          Holy Scripture (NLT)
        </h3>

        <div className="p-4 bg-amber-950/20 border border-amber-500/20 rounded-xl space-y-3">
          <p className="text-xs text-amber-100 italic leading-relaxed">
            &ldquo;{ancestor.verse || "Generational scripture record provided in NLT text."}&rdquo;
          </p>
          <div className="flex items-center justify-between pt-2 border-t border-amber-500/10">
            <span className="text-xs font-mono text-amber-400 font-bold">
              {ancestor.verseReference}
            </span>
            <a
              href={ancestor.verseLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-amber-300 hover:text-amber-200 underline flex items-center gap-1.5 font-medium"
            >
              Read full chapter <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Academic Certainty & Metadata */}
      <div className="pt-3 border-t border-zinc-800 text-xs text-zinc-400 space-y-2">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-zinc-400">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            Historical Certainty:
          </span>
          <span className="text-emerald-400 font-semibold font-mono">Scriptural Record</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Branch Alignment:</span>
          <span className="text-zinc-200 font-medium">
            {ancestor.lineage === "main" ? "Patriarchal Trunk (Adam-David)" : `${ancestor.lineage} branch`}
          </span>
        </div>
      </div>
    </div>
  );
}
