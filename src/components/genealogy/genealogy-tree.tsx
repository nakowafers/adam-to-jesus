"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { fullAncestors as ancestors, type Ancestor } from "@/lib/lineage-data";
import { AncestorNode } from "./ancestor-node";
import { AncestorDrawer } from "./ancestor-drawer";
import { useIsMobile } from "@/hooks/use-mobile";

export function GenealogyTree() {
  const [selectedAncestor, setSelectedAncestor] = useState<Ancestor | null>(
    null
  );
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const isMobile = useIsMobile();

  const handleNodeClick = (ancestor: Ancestor) => {
    setSelectedAncestor(ancestor);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
  };

  // Separate ancestors by lineage
  const mainLineage = ancestors.filter(
    (a) => a.lineage === "main"
  );
  const royalLine = ancestors.filter((a) => a.lineage === "royal");
  const biologicalLine = ancestors.filter((a) => a.lineage === "biological");
  const jesus = ancestors.find((a) => a.id.startsWith("jesus"));

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
            onNodeClick={handleNodeClick}
          />
        ) : (
          <DesktopTree
            mainLineage={mainLineage}
            royalLine={royalLine}
            biologicalLine={biologicalLine}
            jesus={jesus}
            onNodeClick={handleNodeClick}
          />
        )}
      </div>

      <AncestorDrawer
        ancestor={selectedAncestor}
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
  onNodeClick: (ancestor: Ancestor) => void;
}

function MobileTree({
  mainLineage,
  royalLine,
  biologicalLine,
  jesus,
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
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6 flex items-center gap-2"
      >
        <div className="h-px w-8 bg-gradient-to-r from-transparent to-zinc-700" />
        <span className="text-[10px] font-medium uppercase tracking-widest text-zinc-500">
          Patriarchs to Kingdom
        </span>
        <div className="h-px w-8 bg-gradient-to-l from-transparent to-zinc-700" />
      </motion.div>

      {/* Main Lineage - Adam to David */}
      <div className="relative flex w-full max-w-sm flex-col items-center">
        {/* Vertical Progress Line */}
        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute left-6 top-0 h-full w-px origin-top bg-gradient-to-b from-zinc-600 via-zinc-500 to-zinc-600"
        />

        {mainLineage.map((ancestor, index) => (
          <motion.div
            key={ancestor.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: index * 0.12 }}
            className="relative flex w-full items-start gap-4"
          >
            {/* Timeline Node */}
            <div className="relative flex flex-col items-center pt-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.12 + 0.1 }}
                className="relative z-10"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900">
                  <span className="text-lg font-semibold text-zinc-400">
                    {ancestor.generation}
                  </span>
                </div>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.2, delay: index * 0.12 + 0.2 }}
                  className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900"
                >
                  <div className="h-2 w-2 rounded-full bg-zinc-500" />
                </motion.div>
              </motion.div>
              
              {/* Era Label */}
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: index * 0.12 + 0.3 }}
                className="mt-2 text-[9px] font-medium uppercase tracking-wider text-zinc-600"
              >
                {ancestor.id === "adam" && "Creation"}
                {ancestor.id === "noah" && "Flood"}
                {ancestor.id === "abraham" && "Covenant"}
                {ancestor.id === "judah" && "Blessing"}
                {ancestor.id === "jesse" && "Prophecy"}
                {ancestor.id === "david" && "Kingdom"}
              </motion.span>
            </div>

            {/* Card */}
            <div className="flex-1 pb-4">
              <AncestorNode
                ancestor={ancestor}
                onClick={onNodeClick}
                index={index}
              />
              
              {/* Connecting Arrow */}
              {index < mainLineage.length - 1 && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.12 + 0.4 }}
                  className="flex justify-center py-2"
                >
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
                </motion.div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Branch Split Indicator - Toggle */}
      <div className="relative my-4 flex w-full max-w-sm flex-col items-center">
        <div className="h-8 w-px bg-zinc-700" />
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.6, duration: 0.3 }}
          className="flex items-center gap-1 rounded-full border border-zinc-800 bg-zinc-900 p-1"
        >
          <button
            onClick={() => setActiveLineage("royal")}
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
        </motion.div>
        <div className="h-8 w-px bg-zinc-700" />
      </div>

      {/* Active Lineage View */}
      <div className="flex w-full max-w-sm flex-col">
        {/* Royal Line */}
        {activeLineage === "royal" && (
          <motion.div
            key="royal"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="relative flex flex-col"
          >
            {/* Line Header */}
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
            
            {/* Vertical Progress Line */}
            <div className="absolute bottom-0 left-[5px] top-14 w-0.5 rounded-full bg-amber-500/20" />
            
            {visibleRoyal.map((ancestor, index) => {
              const isFirst = index === 0;
              const showExpandButton = !royalExpanded && hiddenRoyalCount > 0 && isFirst;
              
              return (
                <div key={ancestor.id}>
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.08 }}
                    className="relative flex items-start gap-4 pb-3"
                  >
                    {/* Timeline Dot */}
                    <div className="relative z-10 mt-4 flex h-3 w-3 items-center justify-center">
                      <div className="h-3 w-3 rounded-full border-2 border-amber-500 bg-zinc-900" />
                    </div>
                    
                    {/* Card */}
                    <div className="flex-1">
                      <AncestorNode
                        ancestor={ancestor}
                        onClick={onNodeClick}
                        index={mainLineage.length + royalLine.indexOf(ancestor)}
                      />
                    </div>
                  </motion.div>

                  {/* Expand Button */}
                  {showExpandButton && (
                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
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
                    </motion.button>
                  )}
                </div>
              );
            })}
            
            {/* Collapse Button */}
            {royalExpanded && royalLine.length > 3 && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => setRoyalExpanded(false)}
                className="relative mb-3 ml-6 flex items-center gap-2 text-xs text-amber-500/70 hover:text-amber-500"
              >
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
                Show less
              </motion.button>
            )}
          </motion.div>
        )}

        {/* Biological Line */}
        {activeLineage === "biological" && (
          <motion.div
            key="biological"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="relative flex flex-col"
          >
            {/* Line Header */}
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
            
            {/* Vertical Progress Line */}
            <div className="absolute bottom-0 left-[5px] top-14 w-0.5 rounded-full bg-emerald-500/20" />
            
            {visibleBiological.map((ancestor, index) => {
              const isFirst = index === 0;
              const showExpandButton = !biologicalExpanded && hiddenBiologicalCount > 0 && isFirst;
              
              return (
                <div key={ancestor.id}>
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.08 }}
                    className="relative flex items-start gap-4 pb-3"
                  >
                    {/* Timeline Dot */}
                    <div className="relative z-10 mt-4 flex h-3 w-3 items-center justify-center">
                      <div className="h-3 w-3 rounded-full border-2 border-emerald-500 bg-zinc-900" />
                    </div>
                    
                    {/* Card */}
                    <div className="flex-1">
                      <AncestorNode
                        ancestor={ancestor}
                        onClick={onNodeClick}
                        index={mainLineage.length + royalLine.length + biologicalLine.indexOf(ancestor)}
                      />
                    </div>
                  </motion.div>

                  {/* Expand Button */}
                  {showExpandButton && (
                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
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
                    </motion.button>
                  )}
                </div>
              );
            })}
            
            {/* Collapse Button */}
            {biologicalExpanded && biologicalLine.length > 3 && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => setBiologicalExpanded(false)}
                className="relative mb-3 ml-6 flex items-center gap-2 text-xs text-emerald-500/70 hover:text-emerald-500"
              >
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
                Show less
              </motion.button>
            )}
          </motion.div>
        )}
      </div>

      {/* Convergence to Jesus */}
      {jesus && (
        <div className="mt-4 flex w-full max-w-sm flex-col items-center">
          {/* Convergence Line */}
          <div className={`h-8 w-px ${activeLineage === "royal" ? "bg-amber-500/30" : "bg-emerald-500/30"}`} />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            <AncestorNode
              ancestor={jesus}
              onClick={onNodeClick}
              index={mainLineage.length + royalLine.length + biologicalLine.length}
            />
          </motion.div>
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
  onNodeClick,
}: TreeProps) {
  return (
    <div className="relative w-full py-12">
      <div className="mx-auto flex max-w-2xl flex-col items-center px-8">
        {/* Era Label */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10 flex items-center gap-4"
        >
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-zinc-700" />
          <span className="text-sm font-medium uppercase tracking-widest text-zinc-500">
            The Patriarchs to the Kingdom
          </span>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-zinc-700" />
        </motion.div>

        {/* Main Vertical Timeline - Adam to David */}
        <div className="relative w-full max-w-md">
          {/* Vertical Progress Line */}
          <motion.div
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute left-8 top-0 h-full w-px origin-top bg-gradient-to-b from-zinc-600 via-zinc-500 to-zinc-600"
          />

          {/* Timeline Nodes */}
          {mainLineage.map((ancestor, index) => (
            <motion.div
              key={ancestor.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.12 }}
              className="relative flex items-start gap-6 pb-6"
            >
              {/* Timeline Node Marker */}
              <div className="relative flex flex-col items-center pt-3">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.12 + 0.1 }}
                  className="relative z-10"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900">
                    <span className="text-xl font-semibold text-zinc-400">
                      {ancestor.generation}
                    </span>
                  </div>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.2, delay: index * 0.12 + 0.2 }}
                    className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900"
                  >
                    <div className="h-2.5 w-2.5 rounded-full bg-zinc-500" />
                  </motion.div>
                </motion.div>

                {/* Era Label */}
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.12 + 0.3 }}
                  className="mt-2 text-[10px] font-medium uppercase tracking-wider text-zinc-600"
                >
                  {ancestor.id === "adam" && "Creation"}
                  {ancestor.id === "noah" && "Flood"}
                  {ancestor.id === "abraham" && "Covenant"}
                  {ancestor.id === "judah" && "Blessing"}
                  {ancestor.id === "jesse" && "Prophecy"}
                  {ancestor.id === "david" && "Kingdom"}
                </motion.span>
              </div>

              {/* Card */}
              <div className="flex-1 pt-2">
                <AncestorNode
                  ancestor={ancestor}
                  onClick={onNodeClick}
                  index={index}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Branch Split Indicator */}
        <div className="relative my-6 flex flex-col items-center">
          <div className="h-10 w-px bg-zinc-700" />
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.8, duration: 0.3 }}
            className="flex items-center gap-4 rounded-full border border-zinc-800 bg-zinc-900 px-6 py-3"
          >
            <span className="h-3 w-3 rounded-full bg-amber-500" />
            <span className="text-sm font-medium text-zinc-400">
              Lineage Split
            </span>
            <span className="h-3 w-3 rounded-full bg-emerald-500" />
          </motion.div>
          <div className="h-10 w-px bg-zinc-700" />
        </div>

        {/* Two Parallel Branches */}
        <div className="flex w-full max-w-2xl gap-8">
          {/* Royal Line (Matthew) */}
          <div className="flex flex-1 flex-col items-center">
            <div className="mb-5 flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-amber-500" />
              <span className="text-sm font-medium text-amber-500">
                Royal Line (Matthew 1)
              </span>
            </div>
            {royalLine.map((ancestor, index) => (
              <motion.div
                key={ancestor.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.9 + index * 0.1 }}
                className="flex w-full flex-col items-center"
              >
                <div className="w-full">
                  <AncestorNode
                    ancestor={ancestor}
                    onClick={onNodeClick}
                    index={mainLineage.length + index}
                  />
                </div>
                {index < royalLine.length - 1 && (
                  <div className="my-3 h-6 w-px bg-amber-500/30" />
                )}
              </motion.div>
            ))}
            <div className="mt-3 h-10 w-px bg-amber-500/30" />
          </div>

          {/* Biological Line (Luke) */}
          <div className="flex flex-1 flex-col items-center">
            <div className="mb-5 flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-emerald-500" />
              <span className="text-sm font-medium text-emerald-500">
                Biological Line (Luke 3)
              </span>
            </div>
            {biologicalLine.map((ancestor, index) => (
              <motion.div
                key={ancestor.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.9 + index * 0.1 }}
                className="flex w-full flex-col items-center"
              >
                <div className="w-full">
                  <AncestorNode
                    ancestor={ancestor}
                    onClick={onNodeClick}
                    index={mainLineage.length + royalLine.length + index}
                  />
                </div>
                {index < biologicalLine.length - 1 && (
                  <div className="my-3 h-6 w-px bg-emerald-500/30" />
                )}
              </motion.div>
            ))}
            <div className="mt-3 h-10 w-px bg-emerald-500/30" />
          </div>
        </div>

        {/* Convergence Point */}
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

        {/* Jesus - Final Node */}
        {jesus && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.2, duration: 0.4 }}
            className="w-full max-w-sm"
          >
            <AncestorNode
              ancestor={jesus}
              onClick={onNodeClick}
              index={mainLineage.length + royalLine.length + biologicalLine.length}
            />
          </motion.div>
        )}
      </div>
    </div>
  );
}
