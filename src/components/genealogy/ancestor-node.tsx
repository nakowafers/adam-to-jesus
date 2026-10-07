"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import type { Ancestor } from "@/lib/lineage-data";

interface AncestorNodeProps {
  ancestor: Ancestor;
  onClick: (ancestor: Ancestor) => void;
  index: number;
  compact?: boolean;
  isSelected?: boolean;
  id?: string;
}

/**
 * ⚡ Bolt: Memoize AncestorNode to prevent unnecessary re-renders of the entire tree
 * when unrelated state changes (like drawer open/close) occur in the parent component.
 */
export const AncestorNode = memo(function AncestorNode({
  ancestor,
  onClick,
  index,
  compact = false,
  isSelected = false,
  id,
}: AncestorNodeProps) {
  const getLineageColor = () => {
    switch (ancestor.lineage) {
      case "royal":
        return "bg-amber-500";
      case "biological":
        return "bg-emerald-500";
      default:
        return "bg-zinc-500";
    }
  };

  const getLineageGlow = () => {
    switch (ancestor.lineage) {
      case "royal":
        return "shadow-amber-500/20";
      case "biological":
        return "shadow-emerald-500/20";
      default:
        return "shadow-zinc-500/20";
    }
  };

  const getLineageBadge = () => {
    switch (ancestor.lineage) {
      case "royal":
        return {
          label: "Royal / Matt 1",
          className: "bg-amber-500/10 text-amber-400 border-amber-500/20",
        };
      case "biological":
        return {
          label: "Bio / Luke 3",
          className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        };
      default:
        return {
          label: "Main",
          className: "bg-zinc-800 text-zinc-300 border-zinc-700",
        };
    }
  };

  if (compact) {
    return (
      <motion.button
        id={id}
        type="button"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: Math.min(index * 0.015, 0.3) }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onClick(ancestor)}
        aria-label={`View details for ${ancestor.name}, ${ancestor.title}`}
        aria-expanded={isSelected}
        className={`group relative flex min-h-[48px] w-full cursor-pointer items-center justify-between gap-2.5 rounded-lg border px-3 py-2.5 text-left backdrop-blur-sm transition-all duration-200 hover:border-zinc-700 hover:bg-zinc-900 hover:shadow-lg ${
          isSelected
            ? "border-amber-500/50 bg-zinc-900/95 ring-1 ring-amber-500/40"
            : "border-zinc-800 bg-zinc-900/80"
        } ${getLineageGlow()}`}
      >
        <div className="flex min-w-0 flex-1 items-center gap-2.5">
          <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-800">
            <span className="text-xs font-semibold text-zinc-300">
              {ancestor.name.charAt(0)}
            </span>
            <span
              className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-zinc-900 ${getLineageColor()}`}
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <h3 className="truncate text-sm font-semibold text-zinc-50 group-hover:text-white">
                {ancestor.name}
              </h3>
              <span className="shrink-0 rounded bg-amber-500/10 px-1.5 py-0.5 font-mono text-[10px] font-bold text-amber-400 border border-amber-500/20">
                Gen {ancestor.generation}
              </span>
            </div>
            <p className="truncate text-xs text-zinc-400">{ancestor.title}</p>
          </div>
        </div>
        <ChevronRight className="h-3.5 w-3.5 shrink-0 text-zinc-500 transition-colors group-hover:text-zinc-400" />
      </motion.button>
    );
  }

  const lineageBadge = getLineageBadge();

  return (
    <motion.button
      id={id}
      type="button"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.015, 0.3) }}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick(ancestor)}
      aria-label={`View details for ${ancestor.name}, ${ancestor.title}`}
      aria-expanded={isSelected}
      className={`group relative flex min-h-[48px] w-full cursor-pointer items-center justify-between gap-3.5 rounded-xl border p-3.5 sm:p-4 text-left backdrop-blur-sm transition-all duration-200 hover:border-zinc-700 hover:bg-zinc-900 hover:shadow-lg ${
        isSelected
          ? "border-amber-500/50 bg-zinc-900/95 ring-1 ring-amber-500/40 shadow-amber-500/10 shadow-lg"
          : "border-zinc-800 bg-zinc-900/80"
      } ${getLineageGlow()}`}
    >
      <div className="flex min-w-0 flex-1 items-center gap-3">
        {/* Avatar with initial letter and lineage color badge */}
        <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-800 border border-zinc-700/60">
          <span className="text-sm font-bold text-zinc-200">
            {ancestor.name.charAt(0)}
          </span>
          <span
            className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-zinc-900 ${getLineageColor()}`}
          />
        </div>

        {/* Ancestor Details */}
        <div className="min-w-0 flex-1 space-y-1">
          {/* Name & Generation Badge */}
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-base font-bold text-zinc-100 transition-colors group-hover:text-white truncate">
              {ancestor.name}
            </h3>
            <span className="shrink-0 font-mono text-[11px] font-bold text-amber-400/90 px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20">
              Gen {ancestor.generation}
            </span>
          </div>

          {/* Title and Lineage Badge */}
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-xs text-zinc-400 line-clamp-1">{ancestor.title}</p>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-mono font-medium border ${lineageBadge.className}`}
            >
              {lineageBadge.label}
            </span>
          </div>

          {/* Verse Reference */}
          {ancestor.verseReference && (
            <p className="text-xs font-mono text-amber-400/80 truncate">
              {ancestor.verseReference}
            </p>
          )}
        </div>
      </div>

      {/* Tap chevron */}
      <ChevronRight className="h-4 w-4 shrink-0 text-zinc-500 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-zinc-300" />
    </motion.button>
  );
});
