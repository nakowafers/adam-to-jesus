'use client';

import { useState } from 'react';
import { Disciple } from '@/lib/disciples';
import { ApostolicCard } from './apostolic-card';
import { AnimatePresence, motion } from 'framer-motion';
import { ResearcherDrawer } from './researcher-drawer';

interface MartyrdomContainerProps {
  initialDisciples: Disciple[];
}

export function MartyrdomContainer({ initialDisciples }: MartyrdomContainerProps) {
  const [selectedDisciple, setSelectedDisciple] = useState<Disciple | null>(null);

  return (
    <div className="relative space-y-8 pb-24">
      {/* Apostolic Archive Grid */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {initialDisciples.map((disciple) => (
          <ApostolicCard
            key={disciple.id}
            disciple={disciple}
            isSelected={selectedDisciple?.id === disciple.id}
            onSelect={setSelectedDisciple}
          />
        ))}
      </div>

      <AnimatePresence>
        {selectedDisciple && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedDisciple(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-40 transition-opacity"
            />
            <ResearcherDrawer 
              disciple={selectedDisciple} 
              onClose={() => setSelectedDisciple(null)} 
            />
          </>
        )}
      </AnimatePresence>
      
      {!selectedDisciple && initialDisciples.length === 0 && (
        <div className="py-32 text-center border border-dashed border-[#27272A] rounded-2xl bg-[#131316]">
          <p className="text-[#A1A1AA] italic font-medium tracking-wide">
            No apostolic records were retrieved from the D1 Archive.
          </p>
        </div>
      )}
    </div>
  );
}
