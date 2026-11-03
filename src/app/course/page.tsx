'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import {
  BookOpen,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ArrowRight,
  ChevronRight,
  Layers,
  Sparkles,
  Cpu,
  Binary,
  GitMerge,
  Network,
  ListOrdered,
  Tv,
  Microchip
} from 'lucide-react';

export default function CourseOverviewPage() {
  const { modules, topics, progress } = useApp();
  const [searchFilter, setSearchFilter] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('All');

  const iconMap: { [key: string]: any } = {
    Binary,
    Cpu,
    GitMerge,
    Network,
    Clock,
    ListOrdered,
    Tv,
    Microchip
  };

  const filteredTopics = topics.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
                          t.subtitle.toLowerCase().includes(searchFilter.toLowerCase());
    const matchesDiff = difficultyFilter === 'All' || t.difficulty === difficultyFilter;
    return matchesSearch && matchesDiff;
  });

  const completedCount = progress.completedTopics.length;
  const totalCount = topics.length || 1;
  const totalPercent = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-10">
      {/* Course Hero & Overall Progress */}
      <div className="p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 border border-slate-800">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Complete Academic Digital Logic Design Curriculum</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Digital Logic Design Course
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            From Number Systems and Boolean Algebra to Arithmetic Logic Units, Sequential Latches, Counters, and Real Hardware IC implementations on breadboards.
          </p>
        </div>

        {/* Global Progress Card */}
        <div className="w-full lg:w-72 p-5 rounded-2xl bg-slate-900/90 border border-slate-700/80 space-y-3 shrink-0 shadow-lg">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-400 uppercase tracking-wider">Your Progress</span>
            <span className="text-cyan-400 font-mono font-bold text-sm">{totalPercent}%</span>
          </div>

          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-700"
              style={{ width: `${totalPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-1 font-mono">
            <span>{completedCount} Completed</span>
            <span>{topics.length} Total Topics</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchFilter}
            onChange={e => setSearchFilter(e.target.value)}
            placeholder="Search topics (e.g. Half Adder, NAND, K-Map)..."
            className="w-full pl-10 pr-4 py-2 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:border-blue-500"
          />
        </div>

        {/* Difficulty Filters */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          {['All', 'Beginner', 'Intermediate', 'Advanced'].map(diff => (
            <button
              key={diff}
              onClick={() => setDifficultyFilter(diff)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                difficultyFilter === diff
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {/* Course Modules Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-500" />
            <span>Course Modules ({modules.length})</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {modules.map(mod => {
            const modTopics = topics.filter(t => t.moduleId === mod.id);
            const done = modTopics.filter(t => progress.completedTopics.includes(t.slug)).length;
            const percent = modTopics.length > 0 ? Math.round((done / modTopics.length) * 100) : 0;
            const Icon = iconMap[mod.iconName] || BookOpen;

            return (
              <Link
                key={mod.id}
                href={`/course/${mod.slug}`}
                className="group p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-mono font-semibold text-slate-400">
                      Module {mod.order}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors">
                    {mod.title}
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                    {mod.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-500">
                    <span>{modTopics.length} Topics</span>
                    <span>{percent}% done</span>
                  </div>

                  <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Filtered Topics Section (if user is searching) */}
      {searchFilter && (
        <div className="space-y-4 pt-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Matching Topics ({filteredTopics.length})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTopics.map(t => {
              const parentMod = modules.find(m => m.id === t.moduleId);
              return (
                <Link
                  key={t.id}
                  href={`/course/${parentMod ? parentMod.slug : 'module-2'}/${t.slug}`}
                  className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 transition-colors block"
                >
                  <div className="text-xs text-blue-500 font-semibold mb-1">{parentMod?.title}</div>
                  <div className="font-bold text-sm text-slate-900 dark:text-white">{t.title}</div>
                  <div className="text-xs text-slate-500 truncate mt-1">{t.subtitle}</div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
