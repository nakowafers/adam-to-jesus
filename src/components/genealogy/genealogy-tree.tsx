"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { fullAncestors as ancestors, type Ancestor } from "@/lib/lineage-data";
import { AncestorNode } from "./ancestor-node";
import { AncestorDrawer } from "./ancestor-drawer";
import { useIsMobile } from "@/hooks/use-mobile";

// Separate ancestors by lineage outside the component to avoid recalculation on every render
const mainLineage = ancestors.filter(
  (a) => a.lineage === "main"
);
const royalLine = ancestors.filter((a) => a.lineage === "royal" && !a.id.startsWith("jesus"));
const biologicalLine = ancestors.filter((a) => a.lineage === "biological" && !a.id.startsWith("jesus"));
const jesus = ancestors.find((a) => a.id.startsWith("jesus"));

export function GenealogyTree() {
  const [selectedAncestor, setSelectedAncestor] = useState<Ancestor | null>(
    null
  );
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const isMobile = useIsMobile();

  const handleNodeClick = useCallback((ancestor: Ancestor) => {
    setSelectedAncestor(ancestor);
    setIsDrawerOpen(true);
  }, []);

  const handleCloseDrawer = useCallback(() => {
    setIsDrawerOpen(false);
  }, []);

  return (
    <>
      <div className="relative w-full">
        {/* Mobile Layout - Vertical Stack */}
        {isMobile ? (
          <MobileTree
            mainLineage={mainLineage}
            royalLine={royalLine}
            biologicalLine={biologicalLine}
            jesus={jesus}
            selectedAncestor={selectedAncestor}
            onNodeClick={handleNodeClick}
          />
        ) : (
          <DesktopTree
            mainLineage={mainLineage}
            royalLine={royalLine}
            biologicalLine={biologicalLine}
            jesus={jesus}
            selectedAncestor={selectedAncestor}
            onNodeClick={handleNodeClick}
          />
        )}
      </div>

      <AncestorDrawer
        ancestors={ancestors}
        selectedId={selectedAncestor?.id || null}
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
      />
    </>
  );
}

interface TreeProps {
  mainLineage: Ancestor[];
  royalLine: Ancestor[];
  biologicalLine: Ancestor[];
  jesus: Ancestor | undefined;
  selectedAncestor: Ancestor | null;
  onNodeClick: (ancestor: Ancestor) => void;
}

function MobileTree({
  mainLineage,
  royalLine,
  biologicalLine,
  jesus,
  selectedAncestor,
  onNodeClick,
}: TreeProps) {
  const [activeLineage, setActiveLineage] = useState<"royal" | "biological">("royal");
  const [royalExpanded, setRoyalExpanded] = useState(false);
  const [biologicalExpanded, setBiologicalExpanded] = useState(false);

  // Show first and last 2 ancestors when collapsed, all when expanded
  const getVisibleAncestors = (ancestors: Ancestor[], expanded: boolean) => {
    if (expanded || ancestors.length <= 3) return ancestors;
    return [ancestors[0], ancestors[ancestors.length - 1]];
  };

  const getHiddenCount = (ancestors: Ancestor[], expanded: boolean) => {
    if (expanded || ancestors.length <= 3) return 0;
    return ancestors.length - 2;
  };

  const visibleRoyal = getVisibleAncestors(royalLine, royalExpanded);
  const visibleBiological = getVisibleAncestors(biologicalLine, biologicalExpanded);
  const hiddenRoyalCount = getHiddenCount(royalLine, royalExpanded);
  const hiddenBiologicalCount = getHiddenCount(biologicalLine, biologicalExpanded);

  return (
    <div className="flex flex-col items-center px-4 py-8">
      {/* Era Label */}
      <div className="mb-6 flex items-center gap-2">
        <div className="h-px w-8 bg-gradient-to-r from-transparent to-zinc-700" />
        <span className="text-[10px] font-medium uppercase tracking-widest text-zinc-500">
          Patriarchs to Kingdom
        </span>
        <div className="h-px w-8 bg-gradient-to-l from-transparent to-zinc-700" />
      </div>

      {/* Main Lineage - Adam to David */}
      <ol role="list" className="relative flex w-full max-w-sm flex-col items-center">
        {/* Vertical Progress Line */}
        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute left-6 top-0 h-full w-px origin-top bg-gradient-to-b from-zinc-600 via-zinc-500 to-zinc-600"
        />

        {mainLineage.map((ancestor, index) => (
          <li key={ancestor.id} className="relative flex w-full items-start gap-4">
            {/* Timeline Node */}
            <div className="relative flex flex-col items-center pt-4">
              <div className="relative z-10">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900">
                  <span className="text-lg font-semibold text-zinc-400">
                    {ancestor.generation}
                  </span>
                </div>
                <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900">
                  <div className="h-2 w-2 rounded-full bg-zinc-500" />
                </div>
              </div>
              
              <span className="mt-2 text-[9px] font-medium uppercase tracking-wider text-zinc-600">
                {ancestor.id === "adam" && "Creation"}
                {ancestor.id === "noah" && "Flood"}
                {ancestor.id === "abraham" && "Covenant"}
                {ancestor.id === "judah" && "Blessing"}
                {ancestor.id === "jesse" && "Prophecy"}
                {ancestor.id === "david" && "Kingdom"}
              </span>
            </div>

            {/* Card */}
            <div className="flex-1 pb-4">
              <AncestorNode
                ancestor={ancestor}
                onClick={onNodeClick}
                index={index}
                isSelected={selectedAncestor?.id === ancestor.id}
                id={`ancestor-${ancestor.id}`}
              />
              
              {/* Connecting Arrow */}
              {index < mainLineage.length - 1 && (
                <div className="flex justify-center py-2">
                  <svg
                    className="h-4 w-4 text-zinc-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    />
                  </svg>
                </div>
              )}
            </div>
          </li>
        ))}
      </ol>

      {/* Branch Split Indicator - Toggle */}
      <div className="relative my-4 flex w-full max-w-sm flex-col items-center">
        <div className="h-8 w-px bg-zinc-700" />
        <div className="flex items-center gap-1 rounded-full border border-zinc-800 bg-zinc-900 p-1">
          <button
            onClick={() => setActiveLineage("royal")}
            aria-pressed={activeLineage === "royal"}
            className={`flex items-center gap-2 rounded-full px-4 py-2 transition-all ${
              activeLineage === "royal"
                ? "bg-amber-500/20 text-amber-500"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <span className={`h-2.5 w-2.5 rounded-full transition-all ${
              activeLineage === "royal" ? "bg-amber-500 scale-110" : "bg-amber-500/50"
            }`} />
            <span className="text-xs font-medium">Royal</span>
          </button>
          <button
            onClick={() => setActiveLineage("biological")}
            aria-pressed={activeLineage === "biological"}
            className={`flex items-center gap-2 rounded-full px-4 py-2 transition-all ${
              activeLineage === "biological"
                ? "bg-emerald-500/20 text-emerald-500"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <span className={`h-2.5 w-2.5 rounded-full transition-all ${
              activeLineage === "biological" ? "bg-emerald-500 scale-110" : "bg-emerald-500/50"
            }`} />
            <span className="text-xs font-medium">Biological</span>
          </button>
        </div>
        <div className="h-8 w-px bg-zinc-700" />
      </div>

      {/* Active Lineage View */}
      <div className="flex w-full max-w-sm flex-col">
        {/* Royal Line */}
        {activeLineage === "royal" && (
          <div className="relative flex flex-col">
            <div className="mb-4 flex items-center gap-3">
              <span className="h-3 w-3 rounded-full bg-amber-500" />
              <div className="flex flex-col">
                <span className="text-sm font-medium text-amber-500">
                  Royal Line (Matthew 1)
                </span>
                <span className="text-xs text-zinc-500">
                  {royalLine.length} generations to Jesus
                </span>
              </div>
              <div className="h-px flex-1 bg-amber-500/20" />
            </div>
            
            <div className="absolute bottom-0 left-[5px] top-14 w-0.5 rounded-full bg-amber-500/20" />
            
            <ol role="list">
              {visibleRoyal.map((ancestor, index) => {
                const isFirst = index === 0;
                const showExpandButton = !royalExpanded && hiddenRoyalCount > 0 && isFirst;
                
                return (
                  <li key={ancestor.id}>
                    <div className="relative flex items-start gap-4 pb-3">
                      <div className="relative z-10 mt-4 flex h-3 w-3 items-center justify-center">
                        <div className="h-3 w-3 rounded-full border-2 border-amber-500 bg-zinc-900" />
                      </div>
                      
                      <div className="flex-1">
                        <AncestorNode
                          ancestor={ancestor}
                          onClick={onNodeClick}
                          index={mainLineage.length + royalLine.indexOf(ancestor)}
                          isSelected={selectedAncestor?.id === ancestor.id}
                          id={`ancestor-${ancestor.id}`}
                        />
                      </div>
                    </div>

                    {showExpandButton && (
                      <button
                        onClick={() => setRoyalExpanded(true)}
                        className="relative mb-3 ml-6 flex items-center gap-3 rounded-lg border border-dashed border-amber-500/30 bg-amber-500/5 px-4 py-3 text-left transition-colors hover:border-amber-500/50 hover:bg-amber-500/10"
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-amber-500/30 bg-zinc-900">
                          <svg className="h-4 w-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12m6-6H6" />
                          </svg>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-amber-500">
                            Show {hiddenRoyalCount} more generations
                          </span>
                          <p className="text-xs text-zinc-500">
                            Including Rehoboam, Abijah, Zerubbabel...
                          </p>
                        </div>
                      </button>
                    )}
                  </li>
                );
              })}
            </ol>
            
            {royalExpanded && royalLine.length > 3 && (
              <button
                onClick={() => setRoyalExpanded(false)}
                className="relative mb-3 ml-6 flex items-center gap-2 text-xs text-amber-500/70 hover:text-amber-500"
              >
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
                Show less
              </button>
            )}
          </div>
        )}

        {/* Biological Line */}
        {activeLineage === "biological" && (
          <div className="relative flex flex-col">
            <div className="mb-4 flex items-center gap-3">
              <span className="h-3 w-3 rounded-full bg-emerald-500" />
              <div className="flex flex-col">
                <span className="text-sm font-medium text-emerald-500">
                  Biological Line (Luke 3)
                </span>
                <span className="text-xs text-zinc-500">
                  {biologicalLine.length} generations to Jesus
                </span>
              </div>
              <div className="h-px flex-1 bg-emerald-500/20" />
            </div>
            
            <div className="absolute bottom-0 left-[5px] top-14 w-0.5 rounded-full bg-emerald-500/20" />
            
            <ol role="list">
              {visibleBiological.map((ancestor, index) => {
                const isFirst = index === 0;
                const showExpandButton = !biologicalExpanded && hiddenBiologicalCount > 0 && isFirst;
                
                return (
                  <li key={ancestor.id}>
                    <div className="relative flex items-start gap-4 pb-3">
                      <div className="relative z-10 mt-4 flex h-3 w-3 items-center justify-center">
                        <div className="h-3 w-3 rounded-full border-2 border-emerald-500 bg-zinc-900" />
                      </div>
                      
                      <div className="flex-1">
                        <AncestorNode
                          ancestor={ancestor}
                          onClick={onNodeClick}
                          index={mainLineage.length + royalLine.length + biologicalLine.indexOf(ancestor)}
                          isSelected={selectedAncestor?.id === ancestor.id}
                          id={`ancestor-${ancestor.id}`}
                        />
                      </div>
                    </div>

                    {showExpandButton && (
                      <button
                        onClick={() => setBiologicalExpanded(true)}
                        className="relative mb-3 ml-6 flex items-center gap-3 rounded-lg border border-dashed border-emerald-500/30 bg-emerald-500/5 px-4 py-3 text-left transition-colors hover:border-emerald-500/50 hover:bg-emerald-500/10"
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-emerald-500/30 bg-zinc-900">
                          <svg className="h-4 w-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12m6-6H6" />
                          </svg>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-emerald-500">
                            Show {hiddenBiologicalCount} more generations
                          </span>
                          <p className="text-xs text-zinc-500">
                            Including Mattatha, Melea, Heli...
                          </p>
                        </div>
                      </button>
                    )}
                  </li>
                );
              })}
            </ol>
            
            {biologicalExpanded && biologicalLine.length > 3 && (
              <button
                onClick={() => setBiologicalExpanded(false)}
                className="relative mb-3 ml-6 flex items-center gap-2 text-xs text-emerald-500/70 hover:text-amber-500"
              >
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
                Show less
              </button>
            )}
          </div>
        )}
      </div>

      {/* Convergence to Jesus */}
      {jesus && (
        <div className="mt-4 flex w-full max-w-sm flex-col items-center">
          <div className={`h-8 w-px ${activeLineage === "royal" ? "bg-amber-500/30" : "bg-emerald-500/30"}`} />
          <div className="w-full">
            <AncestorNode
              ancestor={jesus}
              onClick={onNodeClick}
              index={mainLineage.length + royalLine.length + biologicalLine.length}
              isSelected={selectedAncestor?.id === jesus.id}
              id={`ancestor-${jesus.id}`}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function DesktopTree({
  mainLineage,
  royalLine,
  biologicalLine,
  jesus,
  selectedAncestor,
  onNodeClick,
}: TreeProps) {
  return (
    <div className="relative w-full py-12">
      <div className="mx-auto flex max-w-2xl flex-col items-center px-8">
        {/* Era Label */}
        <div className="mb-10 flex items-center gap-4">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-zinc-700" />
          <span className="text-sm font-medium uppercase tracking-widest text-zinc-500">
            The Patriarchs to the Kingdom
          </span>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-zinc-700" />
        </div>

        {/* Main Vertical Timeline - Adam to David */}
        <ol role="list" className="relative w-full max-w-md">
          <motion.div
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute left-8 top-0 h-full w-px origin-top bg-gradient-to-b from-zinc-600 via-zinc-500 to-zinc-600"
          />

          {mainLineage.map((ancestor, index) => (
            <li key={ancestor.id} className="relative flex items-start gap-6 pb-6">
              <div className="relative flex flex-col items-center pt-3">
                <div className="relative z-10">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900">
                    <span className="text-xl font-semibold text-zinc-400">
                      {ancestor.generation}
                    </span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900">
                    <div className="h-2.5 w-2.5 rounded-full bg-zinc-500" />
                  </div>
                </div>

                <span className="mt-2 text-[10px] font-medium uppercase tracking-wider text-zinc-600">
                  {ancestor.id === "adam" && "Creation"}
                  {ancestor.id === "noah" && "Flood"}
                  {ancestor.id === "abraham" && "Covenant"}
                  {ancestor.id === "judah" && "Blessing"}
                  {ancestor.id === "jesse" && "Prophecy"}
                  {ancestor.id === "david" && "Kingdom"}
                </span>
              </div>

              <div className="flex-1 pt-2">
                <AncestorNode
                  ancestor={ancestor}
                  onClick={onNodeClick}
                  index={index}
                  isSelected={selectedAncestor?.id === ancestor.id}
                  id={`ancestor-${ancestor.id}`}
                />
              </div>
            </li>
          ))}
        </ol>

        <div className="relative my-6 flex flex-col items-center">
          <div className="h-10 w-px bg-zinc-700" />
          <div className="flex items-center gap-4 rounded-full border border-zinc-800 bg-zinc-900 px-6 py-3">
            <span className="h-3 w-3 rounded-full bg-amber-500" />
            <span className="text-sm font-medium text-zinc-400">
              Lineage Split
            </span>
            <span className="h-3 w-3 rounded-full bg-emerald-500" />
          </div>
          <div className="h-10 w-px bg-zinc-700" />
        </div>

        <div className="flex w-full max-w-2xl gap-8">
          <div className="flex flex-1 flex-col items-center">
            <div className="mb-5 flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-amber-500" />
              <span className="text-sm font-medium text-amber-500">
                Royal Line (Matthew 1)
              </span>
            </div>
            <ol role="list" className="w-full">
              {royalLine.map((ancestor, index) => (
                <li key={ancestor.id} className="flex w-full flex-col items-center">
                  <div className="w-full">
                    <AncestorNode
                      ancestor={ancestor}
                      onClick={onNodeClick}
                      index={mainLineage.length + index}
                      isSelected={selectedAncestor?.id === ancestor.id}
                      id={`ancestor-${ancestor.id}`}
                    />
                  </div>
                  {index < royalLine.length - 1 && (
                    <div className="my-3 h-6 w-px bg-amber-500/30" />
                  )}
                </li>
              ))}
            </ol>
            <div className="mt-3 h-10 w-px bg-amber-500/30" />
          </div>

          <div className="flex flex-1 flex-col items-center">
            <div className="mb-5 flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-emerald-500" />
              <span className="text-sm font-medium text-emerald-500">
                Biological Line (Luke 3)
              </span>
            </div>
            <ol role="list" className="w-full">
              {biologicalLine.map((ancestor, index) => (
                <li key={ancestor.id} className="flex w-full flex-col items-center">
                  <div className="w-full">
                    <AncestorNode
                      ancestor={ancestor}
                      onClick={onNodeClick}
                      index={mainLineage.length + royalLine.length + index}
                      isSelected={selectedAncestor?.id === ancestor.id}
                      id={`ancestor-${ancestor.id}`}
                    />
                  </div>
                  {index < biologicalLine.length - 1 && (
                    <div className="my-3 h-6 w-px bg-emerald-500/30" />
                  )}
                </li>
              ))}
            </ol>
            <div className="mt-3 h-10 w-px bg-emerald-500/30" />
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div className="relative flex items-center">
            <div className="h-px w-16 bg-amber-500/30" />
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900">
              <div className="h-3 w-3 rounded-full bg-zinc-500" />
            </div>
            <div className="h-px w-16 bg-emerald-500/30" />
          </div>
          <div className="h-8 w-px bg-zinc-700" />
        </div>

        {jesus && (
          <div className="w-full max-w-sm">
            <AncestorNode
              ancestor={jesus}
              onClick={onNodeClick}
              index={mainLineage.length + royalLine.length + biologicalLine.length}
              isSelected={selectedAncestor?.id === jesus.id}
              id={`ancestor-${jesus.id}`}
            />
          </div>
        )}
      </div>
    </div>
  );
}
