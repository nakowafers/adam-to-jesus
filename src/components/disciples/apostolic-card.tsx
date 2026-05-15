'use client';

import { Disciple } from "@/lib/disciples";
import { motion } from "framer-motion";
import { MapPin, Info } from "lucide-react";
import { ApostolicIcon } from "./apostolic-icon";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipTrigger,
  TooltipProvider
} from "@/components/ui/tooltip";

interface ApostolicCardProps {
  disciple: Disciple;
  onSelect: (disciple: Disciple) => void;
  isSelected: boolean;
}

export function ApostolicCard({ disciple, onSelect, isSelected }: ApostolicCardProps) {
  const normalizedScore = disciple.reliability_score <= 1 
    ? disciple.reliability_score * 100 
    : disciple.reliability_score;
  const roundedScore = Math.round(normalizedScore);

  return (
    <motion.button
      onClick={() => onSelect(disciple)}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      className={`
        relative w-full p-6 flex flex-col gap-4
        bg-[#18181B] border transition-all duration-200 rounded-lg group text-left
        ${isSelected 
          ? 'border-[#D4AF37] ring-1 ring-[#D4AF37]' 
          : 'border-[#27272A] hover:border-[#D4AF37]/40'}
      `}
      aria-pressed={isSelected}
    >
      <div className="flex items-start gap-5">
        <div className="flex-shrink-0 mt-1">
          <div className="w-12 h-12 flex items-center justify-center bg-[#0A0A0A] border border-[#27272A] rounded-md group-hover:border-[#D4AF37]/50 transition-colors">
            <ApostolicIcon 
              name={disciple.name} 
              className="w-7 h-7 text-[#D4AF37] group-hover:scale-110 transition-transform" 
            />
          </div>
        </div>
        <div className="flex flex-col min-w-0">
          <h3 className="text-lg font-bold text-[#FAFAFA] leading-tight mb-0.5 truncate">
            {disciple.name}
          </h3>
          <p className="text-sm text-[#A1A1AA] leading-snug line-clamp-1">
            {disciple.method_of_death}
          </p>
          <div className="flex items-center gap-1.5 mt-2.5 text-[#A1A1AA]">
            <MapPin size={12} className="text-[#D4AF37]" />
            <span className="text-[10px] font-bold uppercase tracking-widest">
              {disciple.location_of_death.split(',')[0]}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-2 pt-4 border-t border-[#27272A]">
        <div className="flex justify-between items-end mb-2">
          <div className="flex items-center gap-1.5 group/info">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#A1A1AA]">
              Archive Reliability
            </span>
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
                    aria-label="Reliability info"
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
          <span className="text-[10px] font-medium text-[#D4AF37]">
            {disciple.certainty_level}
          </span>
        </div>
        <div className="h-1 w-full bg-[#0A0A0A] rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${roundedScore}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full bg-[#D4AF37]"
          />
        </div>
      </div>

      {isSelected && (
        <motion.div 
          layoutId="active-indicator"
          className="absolute top-3 right-3 w-1.5 h-1.5 bg-[#D4AF37] rounded-full"
        />
      )}
    </motion.button>
  );
}
