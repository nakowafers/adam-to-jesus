'use client';

import { Disciple } from "@/lib/disciples";
import { motion } from "framer-motion";
import { X, BookOpen, ScrollText, Share2, ShieldCheck, Info } from "lucide-react";
import { ApostolicIcon } from "./apostolic-icon";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipTrigger,
  TooltipProvider
} from "@/components/ui/tooltip";

interface ResearcherDrawerProps {
  disciple: Disciple;
  onClose: () => void;
}

export function ResearcherDrawer({ disciple, onClose }: ResearcherDrawerProps) {
  const sources: string[] = JSON.parse(disciple.sources || "[]");
  const normalizedScore = disciple.reliability_score <= 1 
    ? disciple.reliability_score * 100 
    : disciple.reliability_score;
  const roundedScore = Math.round(normalizedScore);

  return (
    <motion.div
      initial={{ y: "100%", x: 0 }}
      animate={{ y: 0, x: 0 }}
      exit={{ y: "100%", x: 0 }}
      variants={{
        desktop: { x: 0, y: 0 },
        mobile: { x: 0, y: 0 }
      }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="fixed inset-x-0 bottom-0 md:inset-y-0 md:right-0 md:left-auto md:w-[480px] bg-[#0A0A0A] border-t md:border-t-0 md:border-l border-[#27272A] z-50 shadow-2xl flex flex-col rounded-t-2xl md:rounded-none max-h-[92vh] md:max-h-screen"
    >
      {/* Mobile Drag Handle */}
      <div className="flex justify-center py-3 md:hidden">
        <div className="w-12 h-1 bg-[#27272A] rounded-full"></div>
      </div>

      <header className="px-6 pb-4 md:py-6 border-b border-[#18181B] flex justify-between items-center bg-[#0A0A0A]">
        <div>
          <h2 className="text-sm font-bold tracking-widest text-[#D4AF37] uppercase mb-0.5">Context View</h2>
          <p className="text-[10px] font-bold text-[#A1A1AA] uppercase tracking-widest">Academic Deep Dive</p>
        </div>
        <button 
          onClick={onClose}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-[#18181B] text-[#A1A1AA] hover:text-[#FAFAFA] transition-colors border border-[#27272A]"
          aria-label="Close details"
        >
          <X size={18} />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-10 custom-scrollbar">
        {/* Profile Section */}
        <section className="flex items-center gap-6">
          <div className="relative">
            <div className="w-20 h-20 bg-[#18181B] border border-[#D4AF37]/20 rounded-xl flex items-center justify-center">
              <ApostolicIcon name={disciple.name} className="w-10 h-10 text-[#D4AF37]" />
            </div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#0A0A0A] border border-[#27272A] rounded-full flex items-center justify-center shadow-lg">
              <ShieldCheck size={14} className="text-[#D4AF37]" />
            </div>
          </div>
          <div className="space-y-1.5 min-w-0">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#FAFAFA] truncate">
              {disciple.name}
            </h1>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[9px] font-black bg-[#D4AF37]/10 text-[#D4AF37] px-2 py-0.5 rounded border border-[#D4AF37]/20 uppercase tracking-tighter">
                D. {disciple.year_of_death}
              </span>
              <span className="text-[10px] font-medium text-[#A1A1AA] uppercase tracking-wider truncate">
                {disciple.location_of_death}
              </span>
            </div>
          </div>
        </section>

        {/* Evidence Repository */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-[#D4AF37]">
            <BookOpen size={14} />
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em]">Evidence Repository</h3>
          </div>
          <div className="border-l-2 border-[#D4AF37] pl-6 py-2 bg-[#18181B]/40 rounded-r-lg">
            <blockquote className="italic text-base md:text-lg text-[#FAFAFA] leading-relaxed font-serif">
              &quot;{disciple.scripture_reference}&quot;
            </blockquote>
          </div>
        </section>

        {/* Reliability Analysis */}
        <section className="p-6 bg-[#18181B]/50 border border-[#27272A] rounded-xl space-y-6">
          <div className="flex justify-between items-end">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5 group/info">
                <h3 className="text-[10px] font-bold text-[#A1A1AA] uppercase tracking-widest">Historical Consensus</h3>
                <TooltipProvider>
                  <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        onPointerDown={(e) => e.stopPropagation()}
                        className="p-1 -m-1 text-[#3F3F46] hover:text-[#D4AF37] transition-colors touch-none"
                      >
                        <Info size={12} />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-[240px] text-[10px] leading-relaxed bg-[#18181B] border-[#27272A] text-[#FAFAFA] z-[60]">
                      Calculated based on the convergence of early scriptural accounts, archaeological evidence, and historical ecclesiastical tradition.
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <p className="text-lg font-bold text-[#FAFAFA]">{disciple.certainty_level} Reliability</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold text-[#D4AF37]">{roundedScore}% Verified</span>
            </div>
          </div>
          
          <div className="relative h-10 flex items-center">
            <div className="absolute inset-0 flex">
              <div className="flex-1 h-1.5 bg-[#27272A] rounded-l-full my-auto opacity-50"></div>
              <div className="flex-1 h-1.5 bg-[#27272A] my-auto opacity-50"></div>
              <div className="flex-1 h-1.5 bg-[#27272A] rounded-r-full my-auto opacity-50"></div>
            </div>
            <div className="absolute inset-0 flex justify-between px-1 items-center">
              <div className="text-[8px] font-bold text-[#3F3F46] mt-7 uppercase">Low</div>
              <div className="text-[8px] font-bold text-[#3F3F46] mt-7 uppercase">Medium</div>
              <div className="text-[8px] font-bold text-[#3F3F46] mt-7 uppercase">High</div>
            </div>
            <motion.div 
              initial={{ left: 0 }}
              animate={{ left: `${roundedScore}%` }}
              transition={{ duration: 1.5, type: "spring" }}
              className="absolute -translate-x-1/2 flex flex-col items-center"
            >
              <div className="w-0.5 h-6 bg-[#D4AF37] shadow-[0_0_12px_rgba(212,175,55,0.6)]"></div>
              <div className="w-2.5 h-2.5 bg-[#D4AF37] rounded-full -mt-0.5 ring-4 ring-[#D4AF37]/20"></div>
            </motion.div>
          </div>
        </section>

        {/* Historical Narrative */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-[#A1A1AA]">
            <ScrollText size={14} />
            <h3 className="text-[10px] font-bold uppercase tracking-widest">Academic Analysis</h3>
          </div>
          <div className="space-y-4">
            <p className="text-sm md:text-base text-[#A1A1AA] leading-relaxed">
              {disciple.narrative}
            </p>
            <div className="p-4 bg-[#18181B] rounded-lg border border-[#27272A]">
              <p className="text-xs font-medium text-[#D4AF37] mb-1 uppercase tracking-tighter">Method of Martyrdom</p>
              <p className="text-sm text-[#FAFAFA] font-bold">{disciple.method_of_death}</p>
            </div>
          </div>
        </section>

        {/* Scholarly Citations */}
        <section className="space-y-4 pt-6 border-t border-[#27272A] pb-10">
          <span className="text-[10px] font-bold text-[#A1A1AA] uppercase tracking-[0.2em]">
            Scholarly Citations
          </span>
          <ul className="space-y-3">
            {sources.map((source, index) => (
              <li key={index} className="text-xs text-[#A1A1AA] flex gap-3 group">
                <span className="text-[#D4AF37] font-bold opacity-40 group-hover:opacity-100 transition-opacity">0{index + 1}</span>
                <span className="leading-relaxed">{source}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Export Action */}
      <footer className="p-4 md:p-6 bg-[#0A0A0A] border-t border-[#18181B]">
        <button className="w-full py-4 bg-[#D4AF37] text-[#0A0A0A] text-xs font-black uppercase tracking-[0.2em] rounded flex items-center justify-center gap-2 hover:bg-[#F2CA50] active:scale-[0.98] transition-all shadow-xl">
          <Share2 size={14} />
          Export Research File
        </button>
      </footer>
    </motion.div>
  );
}
