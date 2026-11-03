'use client';

import React from 'react';
import Link from 'next/link';
import {
  Cpu,
  BookOpen,
  FlaskConical,
  ShieldCheck,
  Award,
  Layers,
  Sparkles,
  ExternalLink,
  Sliders,
  Binary,
  Grid
} from 'lucide-react';

export default function AboutPlatformPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-12">
      {/* Hero Banner */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400 text-xs font-mono">
          <Cpu className="w-4 h-4" />
          <span>Academic Virtual Laboratory & Courseware</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          About Digital Logic Lab
        </h1>

        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
          Learn Logic. Build Circuits. Understand Digital Systems. A next-generation interactive learning environment designed to bridge Boolean theory with physical digital electronics.
        </p>
      </div>

      {/* Core Mission Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Theory & Formal Derivation
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Step-by-step mathematical proofs, canonical SOP/POS expressions, and K-Map minimization with rigorous Boolean laws.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-50 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
            <Sliders className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Interactive Logic Simulation
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Interactive circuit schematic canvas where signals propagate dynamically, LEDs illuminate live, and truth tables are automatically synthesized.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <FlaskConical className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Physical Breadboard Lab
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Verified DIP pinout diagrams, 5V TTL vs. 3.3V CMOS electrical specs, decoupling capacitors, and real hardware troubleshooting procedures.
          </p>
        </div>
      </div>

      {/* Pedagogical Alignment */}
      <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-500" />
          <span>Curriculum & Academic Syllabus Alignment</span>
        </h2>

        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          Digital Logic Lab is calibrated to match undergraduate and diploma digital electronics courses:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1.5">
            <span className="font-bold text-slate-900 dark:text-white block text-sm">
              Higher Secondary (HSC) & Diploma
            </span>
            <p className="text-slate-500 dark:text-slate-400">
              Covers number base conversions, basic logic gates (AND, OR, NOT, NAND, NOR, XOR), universal gate synthesis, half adders, full adders, and 7-segment display interfacing.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1.5">
            <span className="font-bold text-slate-900 dark:text-white block text-sm">
              University Engineering (B.Sc. CSE / EEE)
            </span>
            <p className="text-slate-500 dark:text-slate-400">
              Covers 4-variable K-Maps with don&apos;t cares, flip-flop conversions, synchronous and asynchronous mod-N counters, shift registers, ALU architectures, and setup/hold timing analysis.
            </p>
          </div>
        </div>
      </div>

      {/* Tech Stack Callout */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white border border-slate-800 space-y-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-cyan-400" />
          <span>Built with Modern High-Performance Engineering</span>
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono pt-2">
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
            <span className="text-slate-500 block">Framework</span>
            <span className="text-white font-bold">Next.js 16 (App Router)</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
            <span className="text-slate-500 block">Language</span>
            <span className="text-white font-bold">TypeScript 5</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
            <span className="text-slate-500 block">Styling</span>
            <span className="text-white font-bold">Tailwind CSS v4</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
            <span className="text-slate-500 block">Logic Engine</span>
            <span className="text-white font-bold">Custom Graph Simulator</span>
          </div>
        </div>
      </div>
    </div>
  );
}
