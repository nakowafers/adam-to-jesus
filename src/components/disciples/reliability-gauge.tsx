'use client';

interface ReliabilityGaugeProps {
  score: number; // 0.0 to 1.0
  level: string; // 'Scriptural', 'Tradition', etc.
}

export function ReliabilityGauge({ score, level }: ReliabilityGaugeProps) {
  // Normalize score: handles both 0.85 and 85
  const percentage = score <= 1 ? score * 100 : score;
  const clampedPercentage = Math.min(Math.max(percentage, 0), 100);
  const roundedPercentage = Math.round(clampedPercentage);
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-end">
        <span className="text-[10px] font-semibold text-[#A1A1AA] uppercase tracking-widest">
          Historical Certainty
        </span>
        <span className="text-xs font-bold text-[#D4AF37]">
          {level}
        </span>
      </div>
      
      <div className="h-1.5 w-full bg-[#27272A] rounded-full overflow-hidden">
        <div 
          className="h-full bg-[#D4AF37] transition-all duration-1000 ease-out"
          style={{ width: `${roundedPercentage}%` }}
        />
      </div>
    </div>
  );
}
