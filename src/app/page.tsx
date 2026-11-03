'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import {
  Cpu,
  BookOpen,
  Sliders,
  Binary,
  Grid,
  FlaskConical,
  Library,
  HelpCircle,
  ArrowRight,
  CheckCircle2,
  Clock,
  Zap,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  Play
} from 'lucide-react';

export default function HomePage() {
  const { modules, topics, progress, ics, experiments } = useApp();

  // Mini Interactive Sandbox in Hero
  const [heroGateType, setHeroGateType] = useState<'AND' | 'OR' | 'XOR' | 'NAND'>('AND');
  const [heroSwitchA, setHeroSwitchA] = useState(1);
  const [heroSwitchB, setHeroSwitchB] = useState(0);

  // Evaluate hero output
  let heroOutput = 0;
  if (heroGateType === 'AND') heroOutput = (heroSwitchA === 1 && heroSwitchB === 1) ? 1 : 0;
  else if (heroGateType === 'OR') heroOutput = (heroSwitchA === 1 || heroSwitchB === 1) ? 1 : 0;
  else if (heroGateType === 'XOR') heroOutput = (heroSwitchA ^ heroSwitchB);
  else if (heroGateType === 'NAND') heroOutput = (heroSwitchA === 1 && heroSwitchB === 1) ? 0 : 1;

  const completedCount = progress.completedTopics.length;
  const totalCount = topics.length || 1;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  // Resume last visited or first topic
  const lastTopic = progress.lastVisitedTopic
    ? topics.find(t => t.id === progress.lastVisitedTopic?.topicId) || topics[0]
    : topics[0];

  const parentModOfLast = lastTopic
    ? modules.find(m => m.id === lastTopic.moduleId) || modules[0]
    : modules[0];

  return (
    <div className="flex-1 w-full space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 text-white pt-16 pb-20 border-b border-slate-800">
        {/* Subtle grid background */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, #06b6d4 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Mission & Identity */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>Comprehensive Digital Logic Design Platform</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
              Learn Logic. <br />
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
                Build Circuits.
              </span> <br />
              Understand Systems.
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed">
              A complete online Digital Logic Design course and virtual laboratory. Master truth tables, Boolean algebra, K-Map minimization, live gate simulation, and real physical IC breadboard wiring.
            </p>

            {/* CTA Buttons */}
            <div className="pt-2 flex items-center gap-4 flex-wrap">
              <Link
                href="/course"
                className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm shadow-lg shadow-cyan-500/25 transition-all hover:scale-105 active:scale-95"
              >
                <BookOpen className="w-4 h-4" />
                <span>Explore Complete Course</span>
              </Link>

              <Link
                href="/simulator"
                className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm border border-slate-700 transition-all hover:border-cyan-500"
              >
                <Sliders className="w-4 h-4 text-cyan-400" />
                <span>Open Virtual Simulator</span>
              </Link>
            </div>

            {/* Trust Points */}
            <div className="pt-4 flex items-center gap-6 text-xs text-slate-400 font-mono flex-wrap">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Verified IC Datasheet Pinouts</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>8 Modules · 60+ Topics</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Live Gate Hero Sandbox */}
          <div className="lg:col-span-5">
            <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-md space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                    Live Logic Testbench
                  </span>
                </div>
                {/* Gate selector */}
                <div className="flex items-center gap-1 p-0.5 rounded-xl bg-slate-950 border border-slate-800">
                  {(['AND', 'OR', 'XOR', 'NAND'] as const).map(g => (
                    <button
                      key={g}
                      onClick={() => setHeroGateType(g)}
                      className={`px-2 py-1 rounded-lg text-[11px] font-mono font-bold transition-all cursor-pointer ${
                        heroGateType === g
                          ? 'bg-cyan-500 text-slate-950'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Live Canvas Schematic */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-center justify-between">
                {/* Input Toggles */}
                <div className="space-y-4">
                  <button
                    onClick={() => setHeroSwitchA(heroSwitchA === 1 ? 0 : 1)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer ${
                      heroSwitchA === 1
                        ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
                        : 'bg-slate-900 text-slate-400 border border-slate-800'
                    }`}
                  >
                    <span>Input A:</span>
                    <span className="text-sm">{heroSwitchA}</span>
                  </button>

                  <button
                    onClick={() => setHeroSwitchB(heroSwitchB === 1 ? 0 : 1)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer ${
                      heroSwitchB === 1
                        ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
                        : 'bg-slate-900 text-slate-400 border border-slate-800'
                    }`}
                  >
                    <span>Input B:</span>
                    <span className="text-sm">{heroSwitchB}</span>
                  </button>
                </div>

                {/* Gate Graphic */}
                <div className="px-4 py-3 rounded-2xl bg-slate-900 border border-cyan-500/40 text-center font-mono font-black text-xl text-cyan-400 tracking-wider">
                  {heroGateType}
                </div>

                {/* Output LED */}
                <div className="flex flex-col items-center gap-1.5">
                  <div
                    className={`w-14 h-14 rounded-full flex items-center justify-center font-mono font-extrabold text-xl transition-all ${
                      heroOutput === 1
                        ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/50 scale-105'
                        : 'bg-slate-900 text-slate-600 border border-slate-800'
                    }`}
                  >
                    {heroOutput}
                  </div>
                  <span className="text-[10px] font-mono uppercase text-slate-400">
                    Output Y
                  </span>
                </div>
              </div>

              {/* Status explanation */}
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs font-mono text-slate-300 flex items-center justify-between">
                <span>Formula: Y = A {heroGateType === 'AND' ? '·' : heroGateType === 'OR' ? '+' : heroGateType === 'XOR' ? '⊕' : '⊼'} B</span>
                <span className="text-cyan-400 font-bold">State: {heroSwitchA}{heroSwitchB} → {heroOutput}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Resume Learning & Progress Quick Card */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-900/30 via-indigo-900/20 to-slate-900 border border-blue-500/30 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="text-xs uppercase font-mono font-bold tracking-wider text-cyan-400">
              Continue Your Curriculum
            </span>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {lastTopic ? `Resume: ${lastTopic.title}` : 'Start: Number Systems & Codes'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {parentModOfLast?.title} • {lastTopic?.estimatedMinutes || 25} minutes lesson
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-right">
              <span className="text-xs font-mono text-slate-400 block">{progressPercent}% Syllabus Completed</span>
              <span className="text-[11px] text-slate-500">{completedCount} of {topics.length} topics finished</span>
            </div>

            <Link
              href={lastTopic ? `/course/${parentModOfLast.slug}/${lastTopic.slug}` : '/course'}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md transition-all shrink-0"
            >
              <span>{completedCount > 0 ? 'Resume Lesson' : 'Start Learning'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Special Interactive Tools Shelf */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              <Zap className="w-6 h-6 text-cyan-500" />
              <span>Interactive Engineering Tools</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Virtual experimentation calculators and logic engines designed for students.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Tool 1: Circuit Simulator */}
          <Link
            href="/simulator"
            className="group p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-cyan-500 dark:hover:border-cyan-500 shadow-xs hover:shadow-xl transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-cyan-50 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Sliders className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-cyan-500 transition-colors">
                Circuit Simulator
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Wire switches, logic gates, and LEDs on an interactive schematic canvas. Includes auto-truth table synthesis.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-cyan-600 dark:text-cyan-400">
              <span>Launch Simulator</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Tool 2: Number Converter */}
          <Link
            href="/tools/converter"
            className="group p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 shadow-xs hover:shadow-xl transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Binary className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-blue-500 transition-colors">
                Number Converter
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Decimal, Binary, Octal, Hex, BCD, Gray code, and 1&apos;s/2&apos;s complement with step-by-step math.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400">
              <span>Open Converter</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Tool 3: K-Map Solver */}
          <Link
            href="/tools/kmap"
            className="group p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-500 dark:hover:border-purple-500 shadow-xs hover:shadow-xl transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Grid className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-purple-500 transition-colors">
                K-Map Solver
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                2, 3, and 4-variable Karnaugh Map minimization with don&apos;t cares, wraparound groups, and SOP/POS derivations.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-purple-600 dark:text-purple-400">
              <span>Solve K-Maps</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Tool 4: Practical Lab */}
          <Link
            href="/lab"
            className="group p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 shadow-xs hover:shadow-xl transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <FlaskConical className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-emerald-500 transition-colors">
                Practical Laboratory
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                14 experiments with hardware pinout tables, breadboard wiring steps, live observation tables, and troubleshooting.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <span>Enter Lab</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </section>

      {/* Course Curriculum Modules Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Course Syllabus & Modules
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              8 comprehensive academic modules covering fundamental and advanced digital electronics.
            </p>
          </div>
          <Link
            href="/course"
            className="text-xs font-semibold text-blue-600 dark:text-cyan-400 hover:underline flex items-center gap-1"
          >
            <span>View All Topics</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {modules.map(mod => {
            const modTopics = topics.filter(t => t.moduleId === mod.id);
            const done = modTopics.filter(t => progress.completedTopics.includes(t.slug)).length;
            const percent = modTopics.length > 0 ? Math.round((done / modTopics.length) * 100) : 0;

            return (
              <Link
                key={mod.id}
                href={`/course/${mod.slug}`}
                className="group p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold text-blue-600 dark:text-cyan-400 uppercase">
                      Module {mod.order}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      {mod.estimatedHours}h
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors">
                    {mod.title}
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                    {mod.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-500">
                    <span>{modTopics.length} Topics</span>
                    <span>{percent}%</span>
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
      </section>

      {/* Featured Digital IC Library Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              <Library className="w-6 h-6 text-amber-500" />
              <span>Digital IC Library Spotlight</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Datasheet-verified pinout diagrams, supply voltages, and breadboard hookups.
            </p>
          </div>
          <Link
            href="/ic-library"
            className="text-xs font-semibold text-blue-600 dark:text-cyan-400 hover:underline flex items-center gap-1"
          >
            <span>Browse All {ics.length} ICs</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ics.slice(0, 6).map(ic => (
            <Link
              key={ic.id}
              href={`/ic-library#${ic.id}`}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500 shadow-xs hover:shadow-md transition-all flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center font-mono font-bold text-sm border border-amber-200 dark:border-amber-900 shrink-0">
                {ic.icNumber.split('/')[0].trim()}
              </div>
              <div className="truncate">
                <span className="font-bold text-sm text-slate-900 dark:text-white block truncate">
                  {ic.name}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-mono block">
                  {ic.family} • DIP-{ic.pinCount}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
