'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { Search, X, BookOpen, Sliders, Binary, Grid, FlaskConical, Library, ArrowRight, CornerDownLeft } from 'lucide-react';

export default function GlobalSearchModal() {
  const router = useRouter();
  const { isSearchOpen, setIsSearchOpen, topics, modules, ics, experiments } = useApp();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  // Search logic across topics, ICs, and experiments
  const q = query.toLowerCase().trim();

  interface SearchResultItem {
    type: string;
    title: string;
    subtitle: string;
    url: string;
    icon: any;
    badge?: string;
  }

  const matchedTopics: SearchResultItem[] = topics
    .filter(t => t.title.toLowerCase().includes(q) || t.subtitle.toLowerCase().includes(q) || t.slug.includes(q))
    .slice(0, 5)
    .map(t => {
      const parentMod = modules.find(m => m.id === t.moduleId);
      return {
        type: 'Topic',
        title: t.title,
        subtitle: t.subtitle,
        url: `/course/${parentMod ? parentMod.slug : 'module-2'}/${t.slug}`,
        icon: BookOpen,
        badge: t.difficulty
      };
    });

  const matchedICs: SearchResultItem[] = ics
    .filter(i => i.icNumber.toLowerCase().includes(q) || i.name.toLowerCase().includes(q) || i.functionDescription.toLowerCase().includes(q))
    .slice(0, 3)
    .map(i => ({
      type: 'Digital IC',
      title: i.icNumber,
      subtitle: i.name,
      url: `/ic-library#${i.id}`,
      icon: Library,
      badge: i.family
    }));

  const matchedExperiments: SearchResultItem[] = experiments
    .filter(e => e.title.toLowerCase().includes(q) || e.objective.toLowerCase().includes(q))
    .slice(0, 3)
    .map(e => ({
      type: 'Lab Experiment',
      title: `Exp ${e.experimentNumber}: ${e.title}`,
      subtitle: e.objective,
      url: `/lab/${e.slug}`,
      icon: FlaskConical,
      badge: e.circuitType
    }));

  const staticTools: SearchResultItem[] = [
    { type: 'Tool', title: 'Logic Circuit Simulator', subtitle: 'Interactive drag-and-drop wire and gate simulation canvas', url: '/simulator', icon: Sliders, badge: 'Tool' },
    { type: 'Tool', title: 'Number System Converter', subtitle: 'Bidirectional Dec/Bin/Oct/Hex/BCD/Gray with 1s & 2s complement', url: '/tools/converter', icon: Binary, badge: 'Tool' },
    { type: 'Tool', title: 'K-Map Solver (2, 3, 4 Variables)', subtitle: 'Automated minimization, grouping, SOP & POS derivation', url: '/tools/kmap', icon: Grid, badge: 'Tool' }
  ].filter(t => t.title.toLowerCase().includes(q) || t.subtitle.toLowerCase().includes(q));

  const allResults: SearchResultItem[] = q ? [...matchedTopics, ...matchedICs, ...matchedExperiments, ...staticTools] : staticTools;

  const handleSelect = (url: string) => {
    setIsSearchOpen(false);
    router.push(url);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsSearchOpen(false);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % Math.max(1, allResults.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + allResults.length) % Math.max(1, allResults.length));
    } else if (e.key === 'Enter' && allResults[selectedIndex]) {
      e.preventDefault();
      handleSelect(allResults[selectedIndex].url);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[80vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search topics, ICs (e.g. 7408), experiments, or tools..."
            className="w-full bg-transparent text-slate-900 dark:text-white placeholder:text-slate-400 text-base focus:outline-hidden"
          />
          {query && (
            <button onClick={() => setQuery('')} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="text-xs px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 font-mono"
          >
            ESC
          </button>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-2 divide-y divide-slate-100 dark:divide-slate-800/60">
          {allResults.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-500 dark:text-slate-400">
              No matching results found for &quot;<span className="font-semibold text-slate-700 dark:text-slate-300">{query}</span>&quot;.
            </div>
          ) : (
            allResults.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={idx}
                  onClick={() => handleSelect(item.url)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-900 dark:text-white'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`p-2 rounded-lg ${isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                      <Icon className="w-4 h-4 shrink-0" />
                    </div>
                    <div className="truncate">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm truncate">{item.title}</span>
                        <span className="text-[10px] font-medium uppercase px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                          {item.type}
                        </span>
                        {item.badge && (
                          <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 pl-3">
                    {isSelected && (
                      <span className="hidden sm:flex items-center text-[10px] font-mono text-blue-600 dark:text-blue-400 gap-1">
                        Open <CornerDownLeft className="w-3 h-3" />
                      </span>
                    )}
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-slate-50 dark:bg-slate-950/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400 px-4">
          <div className="flex items-center gap-3">
            <span>↑↓ to navigate</span>
            <span>↵ to select</span>
            <span>esc to dismiss</span>
          </div>
          <span className="font-mono text-[11px]">Digital Logic Lab Index</span>
        </div>
      </div>
    </div>
  );
}
