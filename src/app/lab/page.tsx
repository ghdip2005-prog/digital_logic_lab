'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import {
  FlaskConical,
  Search,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldAlert,
  Cpu,
  Layers,
  Sparkles,
  Zap,
  Wrench
} from 'lucide-react';

export default function PracticalLabCatalogPage() {
  const { experiments, progress } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');

  const filteredExperiments = experiments.filter(exp => {
    const matchesSearch = exp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          exp.objective.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          exp.icNumbers.some(ic => ic.includes(searchTerm));
    const matchesType = typeFilter === 'All' || exp.circuitType === typeFilter;
    return matchesSearch && matchesType;
  });

  const completedCount = progress.experimentCompletions.length;
  const totalCount = experiments.length;
  const labPercent = Math.round((completedCount / (totalCount || 1)) * 100);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
      {/* Laboratory Hero */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 text-white shadow-xl border border-emerald-900/60 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
            <FlaskConical className="w-3.5 h-3.5" />
            <span>Virtual Breadboard Laboratory</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Digital Electronics Practical Laboratory
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Perform 14 complete hands-on experiments matching university and polytechnic syllabi. Practice IC breadboard pin wiring, test logic behaviors, record observation tables, and troubleshoot real hardware circuits.
          </p>
        </div>

        {/* Progress summary card */}
        <div className="w-full lg:w-72 p-5 rounded-2xl bg-slate-900/90 border border-slate-700/80 space-y-3 shrink-0 shadow-lg">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-400 uppercase tracking-wider">Lab Completion</span>
            <span className="text-emerald-400 font-mono font-bold text-sm">{labPercent}%</span>
          </div>

          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-700"
              style={{ width: `${labPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-1 font-mono">
            <span>{completedCount} Verified</span>
            <span>{totalCount} Total Labs</span>
          </div>
        </div>
      </div>

      {/* Safety & Protocol Card */}
      <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
          <div className="space-y-0.5">
            <span className="font-bold text-slate-900 dark:text-white">
              Laboratory Golden Rule:
            </span>
            <p className="text-slate-600 dark:text-slate-300">
              Never insert, remove, or rewire IC connections while the +5V power supply is turned on. Always place a 0.1µF decoupling capacitor between VCC and GND.
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search experiments by title or IC (e.g. 7408, Adder)..."
            className="w-full pl-10 pr-4 py-2 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:border-emerald-500"
          />
        </div>

        {/* Filter categories */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          {['All', 'basic-gate', 'combinational', 'sequential', 'display'].map(type => (
            <button
              key={type}
              onClick={() => setTypeFilter(type)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap capitalize ${
                typeFilter === type
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {type.replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Experiment Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredExperiments.map(exp => {
          const isDone = progress.experimentCompletions.includes(exp.id);

          return (
            <Link
              key={exp.id}
              href={`/lab/${exp.slug}`}
              className="group p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-mono font-bold text-xs border border-emerald-200 dark:border-emerald-900">
                      #{exp.experimentNumber}
                    </span>
                    <span className="text-[10px] font-mono uppercase font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
                      {exp.circuitType}
                    </span>
                  </div>

                  {isDone && (
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="w-4 h-4" /> Verified
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {exp.title}
                </h3>

                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {exp.objective}
                </p>

                {/* ICs Used */}
                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                  {exp.icNumbers.map(ic => (
                    <span
                      key={ic}
                      className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 font-mono text-[11px] text-blue-700 dark:text-blue-300 font-bold"
                    >
                      IC {ic}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
                <span>{exp.procedureSteps.length} Steps Procedure</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Launch Lab <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
