'use client';

import { useState, useMemo } from 'react';
import { 
  Search, 
  ArrowRight, 
  BookOpen, 
  CheckCircle2, 
  Sparkles,
  BookmarkCheck,
  ChevronDown,
  Layers,
  Compass,
  LayoutList,
  Check,
  Maximize2,
  Minimize2,
  Copy,
  ExternalLink,
  Tag
} from 'lucide-react';
import { 
  MESSIANIC_PROPHECIES, 
  THEME_LIST, 
  type ProphecyItem 
} from '@/lib/scripture/prophecies-data';
import { PrototypeFloatingSwitcher } from '@/components/ui/prototype-floating-switcher';

interface PropheciesPrototypeViewProps {
  initialVariant: string;
}

const VARIANTS = [
  { 
    key: 'C1', 
    name: 'Editorial Ledger', 
    description: 'Clean serif typography, generous touch targets, inline dual-scripture parchment cards' 
  },
  { 
    key: 'C2', 
    name: 'Segmented Pill Tabs', 
    description: 'Sticky horizontal theme bar, compact mobile accordion cards with scripture badges' 
  },
  { 
    key: 'C3', 
    name: 'Reader Timeline', 
    description: 'Continuous vertical chronological spine with expanding node drawers and theological callouts' 
  },
];

export function PropheciesPrototypeView({ initialVariant }: PropheciesPrototypeViewProps) {
  // Normalize variant key: C1, C2, C3. Fallback to C1 if invalid or if 'C' was passed
  const normalizedVariant = (() => {
    const raw = (initialVariant || 'C1').toUpperCase();
    if (raw === 'C' || raw === 'C1' || raw === '1') return 'C1';
    if (raw === 'C2' || raw === '2') return 'C2';
    if (raw === 'C3' || raw === '3') return 'C3';
    return 'C1';
  })();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTheme, setSelectedTheme] = useState<string>('All Themes');

  const filteredItems = useMemo(() => {
    return MESSIANIC_PROPHECIES.filter((item) => {
      const matchesTheme = selectedTheme === 'All Themes' || item.theme === selectedTheme;
      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesTheme;

      const matchesSearch =
        item.prophecyTitle.toLowerCase().includes(q) ||
        item.prophecyDescription.toLowerCase().includes(q) ||
        item.otReference.toLowerCase().includes(q) ||
        item.ntReference.toLowerCase().includes(q) ||
        item.otEsvText.toLowerCase().includes(q) ||
        item.ntEsvText.toLowerCase().includes(q) ||
        item.significance.toLowerCase().includes(q);

      return matchesTheme && matchesSearch;
    });
  }, [searchQuery, selectedTheme]);

  return (
    <div className="min-h-screen bg-[#faf8f5] text-stone-900 font-sans selection:bg-amber-200/60 selection:text-amber-950 pb-32">
      {/* Top Editorial Bar */}
      <header className="border-b border-stone-200/90 bg-white/95 backdrop-blur-md sticky top-11 z-20 transition-all">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200/80 text-amber-900 text-xs font-medium tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Scriptural Fulfillment • English Standard Version</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 tracking-tight mt-1">
                Old Testament Prophecies in the Gospels
              </h1>
              <p className="text-xs sm:text-sm text-stone-600 mt-0.5 font-normal leading-relaxed">
                20 canonical messianic promises and their exact fulfillment recorded by the Gospel writers.
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="flex items-center gap-2 text-xs font-mono text-stone-500 bg-stone-50 border border-stone-200 rounded-lg px-3 py-1.5 self-start sm:self-auto shrink-0">
              <span className="font-semibold text-stone-800">{filteredItems.length}</span>
              <span>of</span>
              <span>{MESSIANIC_PROPHECIES.length} Prophecies</span>
            </div>
          </div>

          {/* Search Input */}
          <div className="mt-3 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-stone-400" />
            <input
              type="text"
              placeholder="Search by topic, reference (e.g. Isaiah 53, Luke 2), or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-stone-50/70 border border-stone-200 rounded-xl pl-10 pr-9 py-2 text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-700 text-sm font-mono p-0.5"
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Container rendering active Variant */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-5">
        {normalizedVariant === 'C1' && (
          <VariantC1EditorialLedger 
            items={filteredItems}
            selectedTheme={selectedTheme}
            onSelectTheme={setSelectedTheme}
          />
        )}
        {normalizedVariant === 'C2' && (
          <VariantC2SegmentedTabs 
            items={filteredItems}
            selectedTheme={selectedTheme}
            onSelectTheme={setSelectedTheme}
          />
        )}
        {normalizedVariant === 'C3' && (
          <VariantC3ReaderTimeline 
            items={filteredItems}
            selectedTheme={selectedTheme}
            onSelectTheme={setSelectedTheme}
          />
        )}
      </main>

      {/* Floating UI Prototype Switcher */}
      <PrototypeFloatingSwitcher
        variants={VARIANTS}
        currentVariant={normalizedVariant}
      />
    </div>
  );
}

// ============================================================================
// VARIANT C1: Editorial Ledger (Bookish, High Legibility, Card Accordion)
// ============================================================================
function VariantC1EditorialLedger({
  items,
  selectedTheme,
  onSelectTheme,
}: {
  items: ProphecyItem[];
  selectedTheme: string;
  onSelectTheme: (t: string) => void;
}) {
  const grouped = useGroupedByTheme(items);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    () => new Set(items.slice(0, 2).map((i) => i.id))
  );

  const toggleItem = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const expandAll = () => setExpandedIds(new Set(items.map((i) => i.id)));
  const collapseAll = () => setExpandedIds(new Set());

  if (items.length === 0) return <EmptyState onReset={() => onSelectTheme('All Themes')} />;

  return (
    <div className="space-y-6">
      {/* Sub-header info & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-stone-200 text-xs">
        {/* Horizontal Theme Pill Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none w-full sm:w-auto">
          {THEME_LIST.map((theme) => {
            const active = selectedTheme === theme;
            return (
              <button
                key={theme}
                onClick={() => onSelectTheme(theme)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors touch-manipulation ${
                  active
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {theme}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 text-stone-500 font-mono text-[11px] ml-auto">
          <button
            onClick={expandAll}
            className="hover:text-stone-900 underline underline-offset-2 p-1"
          >
            Expand All
          </button>
          <span>•</span>
          <button
            onClick={collapseAll}
            className="hover:text-stone-900 underline underline-offset-2 p-1"
          >
            Collapse All
          </button>
        </div>
      </div>

      {/* Accordion Sections */}
      <div className="space-y-8">
        {Object.entries(grouped).map(([themeName, themeItems]) => (
          <section key={themeName} className="space-y-3">
            <div className="flex items-baseline justify-between gap-2 border-b-2 border-stone-300 pb-1.5">
              <h2 className="text-lg font-serif font-bold text-stone-900 tracking-tight flex items-center gap-2">
                <BookmarkCheck className="w-4 h-4 text-amber-700 shrink-0" />
                {themeName}
              </h2>
              <span className="text-xs font-mono font-medium text-stone-500">
                {themeItems.length} {themeItems.length === 1 ? 'prophecy' : 'prophecies'}
              </span>
            </div>

            <div className="space-y-3">
              {themeItems.map((item) => {
                const isExpanded = expandedIds.has(item.id);
                return (
                  <article
                    key={item.id}
                    className="bg-white border border-stone-200/90 rounded-2xl shadow-xs overflow-hidden transition-all hover:border-stone-300"
                  >
                    {/* Header Click Target */}
                    <button
                      onClick={() => toggleItem(item.id)}
                      className="w-full text-left p-4 sm:p-5 flex items-start justify-between gap-3 hover:bg-stone-50/50 transition-colors touch-manipulation"
                      aria-expanded={isExpanded}
                    >
                      <div className="space-y-1 pr-2">
                        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                          <span className="font-semibold text-stone-700 bg-stone-100 px-2 py-0.5 rounded">
                            {item.otReference.replace(' (ESV)', '')}
                          </span>
                          <ArrowRight className="w-3 h-3 text-amber-600 shrink-0" />
                          <span className="font-semibold text-amber-900 bg-amber-50 border border-amber-200/70 px-2 py-0.5 rounded">
                            {item.ntReference.replace(' (ESV)', '')}
                          </span>
                        </div>

                        <h3 className="text-base sm:text-lg font-serif font-bold text-stone-900 leading-snug pt-0.5">
                          {item.prophecyTitle}
                        </h3>

                        {!isExpanded && (
                          <p className="text-xs sm:text-sm text-stone-500 line-clamp-1 italic font-serif">
                            &ldquo;{item.ntEsvText}&rdquo;
                          </p>
                        )}
                      </div>

                      <div className="p-1 rounded-full bg-stone-100 text-stone-500 shrink-0 mt-1">
                        <ChevronDown
                          className={`w-4 h-4 transition-transform duration-200 ${
                            isExpanded ? 'rotate-180 text-stone-900' : ''
                          }`}
                        />
                      </div>
                    </button>

                    {/* Expandable Disclosure Body */}
                    {isExpanded && (
                      <div className="px-4 pb-5 sm:px-6 sm:pb-6 pt-1 border-t border-stone-100 space-y-4 bg-[#faf9f6]/30 animate-fadeIn">
                        <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-sans">
                          {item.prophecyDescription}
                        </p>

                        {/* Dual Scripture Comparison Blocks */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                          {/* Old Testament Card */}
                          <div className="p-4 rounded-xl bg-white border border-stone-200 space-y-2 shadow-2xs">
                            <div className="flex items-center justify-between pb-1.5 border-b border-stone-100">
                              <span className="text-xs font-bold text-stone-600 uppercase tracking-wider font-mono">
                                Old Testament
                              </span>
                              <span className="text-xs font-mono font-semibold text-stone-800 bg-stone-100 px-2 py-0.5 rounded">
                                {item.otReference}
                              </span>
                            </div>

                            <blockquote className="border-l-2 border-stone-400 pl-3 py-1 my-1">
                              <p className="font-serif text-sm sm:text-base text-stone-900 leading-relaxed italic">
                                &ldquo;{item.otEsvText}&rdquo;
                              </p>
                            </blockquote>

                            <p className="text-xs text-stone-500 leading-relaxed pt-1">
                              <span className="font-semibold text-stone-700">Historical Setting:</span> {item.otContext}
                            </p>
                          </div>

                          {/* New Testament Card */}
                          <div className="p-4 rounded-xl bg-amber-50/40 border border-amber-200/80 space-y-2 shadow-2xs">
                            <div className="flex items-center justify-between pb-1.5 border-b border-amber-200/50">
                              <span className="text-xs font-bold text-amber-900 uppercase tracking-wider font-mono">
                                Gospel Fulfillment
                              </span>
                              <span className="text-xs font-mono font-semibold text-amber-950 bg-amber-100 px-2 py-0.5 rounded">
                                {item.ntReference}
                              </span>
                            </div>

                            <blockquote className="border-l-2 border-amber-500 pl-3 py-1 my-1">
                              <p className="font-serif text-sm sm:text-base text-stone-950 leading-relaxed italic font-medium">
                                &ldquo;{item.ntEsvText}&rdquo;
                              </p>
                            </blockquote>

                            <p className="text-xs text-stone-600 leading-relaxed pt-1">
                              <span className="font-semibold text-stone-800">Fulfillment Context:</span> {item.ntFulfillmentNotes}
                            </p>
                          </div>
                        </div>

                        {/* Theological Significance Banner */}
                        <div className="p-3.5 rounded-xl bg-stone-100/90 border border-stone-200 text-xs text-stone-700 leading-relaxed">
                          <strong className="text-stone-900 font-mono text-[11px] uppercase tracking-wider block mb-0.5">
                            Theological Significance
                          </strong>
                          {item.significance}
                        </div>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// VARIANT C2: Segmented Pill Tabs (Sticky Filter Bar & Clean Tap Accordion)
// ============================================================================
function VariantC2SegmentedTabs({
  items,
  selectedTheme,
  onSelectTheme,
}: {
  items: ProphecyItem[];
  selectedTheme: string;
  onSelectTheme: (t: string) => void;
}) {
  const [activeId, setActiveId] = useState<string | null>(items[0]?.id || null);

  const toggle = (id: string) => {
    setActiveId((prev) => (prev === id ? null : id));
  };

  if (items.length === 0) return <EmptyState onReset={() => onSelectTheme('All Themes')} />;

  return (
    <div className="space-y-4">
      {/* Sticky Category Ribbon */}
      <div className="sticky top-28 z-10 -mx-4 sm:-mx-6 px-4 sm:px-6 py-2.5 bg-[#faf8f5]/95 backdrop-blur-md border-b border-stone-200/80">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
          {THEME_LIST.map((theme) => {
            const active = selectedTheme === theme;
            return (
              <button
                key={theme}
                onClick={() => onSelectTheme(theme)}
                className={`text-xs px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition-all touch-manipulation ${
                  active
                    ? 'bg-amber-600 text-white font-semibold shadow-sm'
                    : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50'
                }`}
              >
                {theme}
              </button>
            );
          })}
        </div>
      </div>

      {/* Accordion Stream */}
      <div className="space-y-2.5 pt-1">
        {items.map((item, index) => {
          const isExpanded = activeId === item.id;
          return (
            <div
              key={item.id}
              className={`bg-white rounded-xl border transition-all overflow-hidden ${
                isExpanded
                  ? 'border-amber-400 ring-2 ring-amber-400/20 shadow-sm'
                  : 'border-stone-200 hover:border-stone-300'
              }`}
            >
              <button
                onClick={() => toggle(item.id)}
                className="w-full text-left p-3.5 sm:p-4 flex items-center justify-between gap-3 hover:bg-stone-50/50 transition-colors touch-manipulation"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-stone-100 text-stone-600 text-xs font-mono font-semibold flex items-center justify-center shrink-0">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="text-sm sm:text-base font-serif font-bold text-stone-900 leading-tight">
                      {item.prophecyTitle}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 text-[11px] font-mono text-stone-500">
                      <span className="text-stone-700">{item.otReference.replace(' (ESV)', '')}</span>
                      <span className="text-stone-300">➔</span>
                      <span className="text-amber-800 font-semibold">{item.ntReference.replace(' (ESV)', '')}</span>
                      <span className="hidden sm:inline text-stone-400">• {item.theme}</span>
                    </div>
                  </div>
                </div>

                <ChevronDown
                  className={`w-4 h-4 text-stone-400 shrink-0 transition-transform duration-200 ${
                    isExpanded ? 'rotate-180 text-amber-700' : ''
                  }`}
                />
              </button>

              {isExpanded && (
                <div className="p-4 sm:p-5 border-t border-stone-100 bg-stone-50/50 space-y-3.5 animate-fadeIn">
                  <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-sans">
                    {item.prophecyDescription}
                  </p>

                  {/* Dual verses in a stacked, mobile-first design */}
                  <div className="space-y-2.5">
                    {/* OT Verse */}
                    <div className="bg-white p-3.5 rounded-lg border border-stone-200 space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-mono text-stone-500 text-[11px] font-medium uppercase tracking-wider">
                          Prophecy: {item.otReference}
                        </span>
                      </div>
                      <blockquote className="font-serif italic text-sm text-stone-900 border-l-2 border-stone-300 pl-2.5 py-0.5">
                        &ldquo;{item.otEsvText}&rdquo;
                      </blockquote>
                      <p className="text-[11px] text-stone-500 leading-normal pt-0.5">
                        <span className="font-medium text-stone-700">Context:</span> {item.otContext}
                      </p>
                    </div>

                    {/* NT Verse */}
                    <div className="bg-amber-50/50 p-3.5 rounded-lg border border-amber-200 space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-mono text-amber-800 text-[11px] font-bold uppercase tracking-wider">
                          Fulfillment: {item.ntReference}
                        </span>
                      </div>
                      <blockquote className="font-serif italic text-sm text-stone-950 font-medium border-l-2 border-amber-500 pl-2.5 py-0.5">
                        &ldquo;{item.ntEsvText}&rdquo;
                      </blockquote>
                      <p className="text-[11px] text-stone-600 leading-normal pt-0.5">
                        <span className="font-medium text-stone-800">Fulfillment:</span> {item.ntFulfillmentNotes}
                      </p>
                    </div>
                  </div>

                  <div className="text-xs text-stone-600 bg-white p-3 rounded-lg border border-stone-200/80">
                    <span className="font-mono uppercase font-bold text-[10px] text-stone-400 block mb-0.5">
                      Significance
                    </span>
                    {item.significance}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================================
// VARIANT C3: Reader Timeline (Chronological Spine with Drawer Expansion)
// ============================================================================
function VariantC3ReaderTimeline({
  items,
  selectedTheme,
  onSelectTheme,
}: {
  items: ProphecyItem[];
  selectedTheme: string;
  onSelectTheme: (t: string) => void;
}) {
  const [openIds, setOpenIds] = useState<Set<string>>(() => new Set([items[0]?.id].filter(Boolean)));

  const toggle = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  if (items.length === 0) return <EmptyState onReset={() => onSelectTheme('All Themes')} />;

  return (
    <div className="space-y-6">
      {/* Category filter pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
        {THEME_LIST.map((theme) => {
          const active = selectedTheme === theme;
          return (
            <button
              key={theme}
              onClick={() => onSelectTheme(theme)}
              className={`px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition-colors touch-manipulation ${
                active
                  ? 'bg-amber-900 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {theme}
            </button>
          );
        })}
      </div>

      {/* Timeline with vertical continuous rail */}
      <div className="relative pl-6 sm:pl-8 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-stone-300 space-y-4">
        {items.map((item, idx) => {
          const isOpen = openIds.has(item.id);
          return (
            <div key={item.id} className="relative group">
              {/* Timeline Indicator Dot */}
              <div
                className={`absolute -left-6 sm:-left-8 top-4 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                  isOpen
                    ? 'border-amber-600 bg-amber-50 text-amber-800'
                    : 'border-stone-400 bg-white text-stone-500 group-hover:border-stone-600'
                }`}
              >
                <span className="text-[10px] font-mono font-bold">{idx + 1}</span>
              </div>

              {/* Main Card */}
              <div
                className={`bg-white rounded-2xl border transition-all overflow-hidden ${
                  isOpen
                    ? 'border-amber-500/80 shadow-md ring-1 ring-amber-500/20'
                    : 'border-stone-200 hover:border-stone-300 shadow-2xs'
                }`}
              >
                <button
                  onClick={() => toggle(item.id)}
                  className="w-full text-left p-4 sm:p-5 flex items-start justify-between gap-3 hover:bg-stone-50/40 transition-colors touch-manipulation"
                  aria-expanded={isOpen}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/50">
                        {item.theme}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-serif font-bold text-stone-900 leading-snug">
                      {item.prophecyTitle}
                    </h3>

                    <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-stone-600 pt-0.5">
                      <span className="text-stone-800 font-semibold">{item.otReference.replace(' (ESV)', '')}</span>
                      <span>foretells</span>
                      <span className="text-amber-900 font-semibold">{item.ntReference.replace(' (ESV)', '')}</span>
                    </div>
                  </div>

                  <div className="shrink-0 p-1 rounded-md text-stone-400 mt-1">
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-amber-800' : ''
                      }`}
                    />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-4 pb-5 sm:px-6 sm:pb-6 pt-1 border-t border-stone-100 bg-[#fbfaf8] space-y-4 animate-fadeIn">
                    <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-sans">
                      {item.prophecyDescription}
                    </p>

                    {/* Integrated Scripture Comparison */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {/* Old Testament */}
                      <div className="p-4 bg-white rounded-xl border border-stone-200 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-mono font-bold text-stone-600 uppercase text-[11px]">
                            Old Testament (ESV)
                          </span>
                          <span className="font-mono font-semibold text-stone-800">{item.otReference}</span>
                        </div>
                        <blockquote className="font-serif italic text-sm text-stone-900 border-l-2 border-stone-400 pl-3 py-0.5">
                          &ldquo;{item.otEsvText}&rdquo;
                        </blockquote>
                        <p className="text-xs text-stone-500 pt-1">
                          <strong className="text-stone-700 font-medium">Context:</strong> {item.otContext}
                        </p>
                      </div>

                      {/* New Testament */}
                      <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-200 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-mono font-bold text-amber-900 uppercase text-[11px]">
                            Gospel Fulfillment (ESV)
                          </span>
                          <span className="font-mono font-semibold text-amber-950">{item.ntReference}</span>
                        </div>
                        <blockquote className="font-serif italic text-sm text-stone-950 border-l-2 border-amber-500 pl-3 py-0.5 font-medium">
                          &ldquo;{item.ntEsvText}&rdquo;
                        </blockquote>
                        <p className="text-xs text-stone-600 pt-1">
                          <strong className="text-stone-800 font-medium">Fulfillment:</strong> {item.ntFulfillmentNotes}
                        </p>
                      </div>
                    </div>

                    {/* Significance */}
                    <div className="p-3 bg-white rounded-xl border border-stone-200 text-xs text-stone-700 leading-relaxed">
                      <strong className="text-stone-900 font-mono text-[10px] uppercase tracking-wider block mb-0.5">
                        Theological Significance
                      </strong>
                      {item.significance}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// Helpers & Utilities
// ----------------------------------------------------------------------------
function useGroupedByTheme(items: ProphecyItem[]) {
  return useMemo(() => {
    const groups: Record<string, ProphecyItem[]> = {};
    for (const item of items) {
      if (!groups[item.theme]) {
        groups[item.theme] = [];
      }
      groups[item.theme].push(item);
    }
    return groups;
  }, [items]);
}

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="text-center py-16 bg-white border border-stone-200 rounded-2xl p-8 space-y-3">
      <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
        <Search className="w-5 h-5" />
      </div>
      <h3 className="text-base font-serif font-bold text-stone-800">No prophecies match your search</h3>
      <p className="text-xs sm:text-sm text-stone-500 max-w-sm mx-auto">
        Try modifying your keywords or clear your theme filter.
      </p>
      <button
        onClick={onReset}
        className="mt-2 text-xs font-semibold text-amber-800 underline hover:text-amber-900"
      >
        Reset filters to All Themes
      </button>
    </div>
  );
}
