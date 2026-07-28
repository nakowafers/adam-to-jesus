'use client';

import { Disciple } from '@/lib/disciples';
import { ApostolicCard } from './apostolic-card';
import { AnimatePresence } from 'framer-motion';
import { ResearcherDrawer } from './researcher-drawer';
import { useEntitySelection } from '@/hooks/use-entity-selection';

interface MartyrdomContainerProps {
  initialDisciples: Disciple[];
}

export function MartyrdomContainer({ initialDisciples }: MartyrdomContainerProps) {
  const {
    selectedEntity: selectedDisciple,
    selectEntity,
    clearSelection,
  } = useEntitySelection('disciple', initialDisciples);

  return (
    <div className="relative space-y-8 pb-24">
      {/* Apostolic Archive Grid */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {initialDisciples.map((disciple) => (
          <ApostolicCard
            key={disciple.id}
            disciple={disciple}
            isSelected={selectedDisciple?.id === disciple.id}
            onSelect={(d) => selectEntity(d.id)}
          />
        ))}
      </div>

      <AnimatePresence>
        {selectedDisciple && (
          <ResearcherDrawer 
            disciple={selectedDisciple} 
            onClose={clearSelection} 
          />
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
