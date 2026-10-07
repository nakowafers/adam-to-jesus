'use client';

import { useState, useMemo } from 'react';
import { 
  Search, 
  ArrowRight, 
  BookmarkCheck, 
  ChevronDown, 
  Sparkles 
} from 'lucide-react';
import { 
  THEME_LIST, 
  type ProphecyItem 
} from '@/lib/scripture/prophecies-data';

export interface PropheciesLedgerViewProps {
  initialProphecies: ProphecyItem[];
}

export function PropheciesLedgerView({ initialProphecies }: PropheciesLedgerViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTheme, setSelectedTheme] = useState<string>('All Themes');

  const filteredItems = useMemo(() => {
    return initialProphecies.filter((item) => {
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
  }, [initialProphecies, searchQuery, selectedTheme]);

  const grouped = useMemo(() => {
    const groups: Record<string, ProphecyItem[]> = {};
    for (const item of filteredItems) {
      if (!groups[item.theme]) {
        groups[item.theme] = [];
      }
      groups[item.theme].push(item);
    }
    return groups;
  }, [filteredItems]);

  // Expand the first two items initially for an engaging landing experience
  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    () => new Set(initialProphecies.slice(0, 2).map((i) => i.id))
  );

  const toggleItem = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const expandAll = () => setExpandedIds(new Set(filteredItems.map((i) => i.id)));
  const collapseAll = () => setExpandedIds(new Set());

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
                Canonical messianic promises and their exact fulfillment recorded by the Gospel writers.
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="flex items-center gap-2 text-xs font-mono text-stone-500 bg-stone-50 border border-stone-200 rounded-lg px-3 py-1.5 self-start sm:self-auto shrink-0">
              <span className="font-semibold text-stone-800">{filteredItems.length}</span>
              <span>of</span>
              <span>{initialProphecies.length} Prophecies</span>
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
                className="absolute right-1 top-1 text-stone-400 hover:text-stone-700 min-w-[44px] min-h-[44px] flex items-center justify-center text-sm font-mono touch-manipulation"
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Ledger Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-5">
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
                    onClick={() => setSelectedTheme(theme)}
                    className={`min-h-[44px] px-3 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-colors touch-manipulation flex items-center justify-center ${
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
                className="min-h-[44px] inline-flex items-center hover:text-stone-900 underline underline-offset-2 p-1 touch-manipulation"
              >
                Expand All
              </button>
              <span>•</span>
              <button
                onClick={collapseAll}
                className="min-h-[44px] inline-flex items-center hover:text-stone-900 underline underline-offset-2 p-1 touch-manipulation"
              >
                Collapse All
              </button>
            </div>
          </div>

          {filteredItems.length === 0 ? (
            <div className="text-center py-16 bg-white border border-stone-200 rounded-2xl p-8 space-y-3">
              <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
                <Search className="w-5 h-5" />
              </div>
              <h3 className="text-base font-serif font-bold text-stone-800">No prophecies match your search</h3>
              <p className="text-xs sm:text-sm text-stone-500 max-w-sm mx-auto">
                Try modifying your keywords or clear your theme filter.
              </p>
              <button
                onClick={() => {
                  setSelectedTheme('All Themes');
                  setSearchQuery('');
                }}
                className="min-h-[44px] inline-flex items-center mt-2 text-xs font-semibold text-amber-800 underline hover:text-amber-900 touch-manipulation"
              >
                Reset filters to All Themes
              </button>
            </div>
          ) : (
            /* Accordion Sections */
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
                          id={item.id}
                          className="bg-white border border-stone-200/90 rounded-2xl shadow-xs overflow-hidden transition-all hover:border-stone-300"
                        >
                          {/* Header Click Target with 44px+ mobile touch height */}
                          <button
                            onClick={() => toggleItem(item.id)}
                            className="w-full min-h-[44px] text-left p-4 sm:p-5 flex items-start justify-between gap-3 hover:bg-stone-50/50 transition-colors touch-manipulation"
                            aria-expanded={isExpanded}
                            aria-controls={`prophecy-panel-${item.id}`}
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
                            <div
                              id={`prophecy-panel-${item.id}`}
                              className="px-4 pb-5 sm:px-6 sm:pb-6 pt-1 border-t border-stone-100 space-y-4 bg-[#faf9f6]/30 animate-fadeIn"
                            >
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
          )}
        </div>
      </main>
    </div>
  );
}
