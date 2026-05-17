"use client";

import { motion } from "framer-motion";
import type { Ancestor } from "@/lib/genealogy-data";
import { memo } from "react";

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
export const AncestorNode = memo(function AncestorNode({ ancestor, onClick, index, compact = false, isSelected = false, id }: AncestorNodeProps) {
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

  if (compact) {
    return (
      <motion.button
        id={id}
        type="button"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.02 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onClick(ancestor)}
        aria-label={`View details for ${ancestor.name}, ${ancestor.title}`}
        aria-expanded={isSelected}
        className={`group relative w-full cursor-pointer rounded-lg border border-zinc-800 bg-zinc-900/80 px-3 py-2.5 text-left backdrop-blur-sm transition-all duration-300 hover:border-zinc-700 hover:bg-zinc-900 hover:shadow-lg ${getLineageGlow()}`}
      >
        <div className="flex items-center gap-2">
          <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-800">
            <span className="text-xs font-semibold text-zinc-300">
              {ancestor.name.charAt(0)}
            </span>
            <span
              className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-zinc-900 ${getLineageColor()}`}
            />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-semibold text-zinc-50 transition-colors group-hover:text-white">
              {ancestor.name}
            </h3>
          </div>
          <svg
            className="h-3 w-3 shrink-0 text-zinc-600 transition-colors group-hover:text-zinc-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </motion.button>
    );
  }

  return (
    <motion.button
      id={id}
      type="button"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.02 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick(ancestor)}
      aria-label={`View details for ${ancestor.name}, ${ancestor.title}`}
      aria-expanded={isSelected}
      className={`group relative w-full cursor-pointer rounded-lg border border-zinc-800 bg-zinc-900/80 p-4 text-left backdrop-blur-sm transition-all duration-300 hover:border-zinc-700 hover:bg-zinc-900 hover:shadow-lg ${getLineageGlow()}`}
    >
      <div className="flex items-center gap-3">
        <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-800">
          <span className="text-sm font-semibold text-zinc-300">
            {ancestor.name.charAt(0)}
          </span>
          <span
            className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-zinc-900 ${getLineageColor()}`}
          />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-semibold text-zinc-50 transition-colors group-hover:text-white">
            {ancestor.name}
          </h3>
          <p className="text-sm text-zinc-400">{ancestor.title}</p>
        </div>
        <svg
          className="h-4 w-4 shrink-0 text-zinc-600 transition-colors group-hover:text-zinc-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>
    </motion.button>
  );
});
