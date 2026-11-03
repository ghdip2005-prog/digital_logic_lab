'use client';

import React from 'react';
import Link from 'next/link';
import { Cpu, Heart, BookOpen, Sliders, Binary, FlaskConical, Library, HelpCircle, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/80 text-slate-600 dark:text-slate-400 py-12 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Col 1: Identity & Mission */}
        <div className="space-y-4 md:col-span-1">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-xs">
              <Cpu className="w-4 h-4" />
            </div>
            <span className="font-bold text-slate-900 dark:text-white tracking-tight text-base">
              Digital Logic Lab
            </span>
          </div>
          <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
            A comprehensive, rigorous online learning environment and virtual laboratory dedicated to Digital Logic Design for HSC, Diploma, and University engineering students.
          </p>
          <div className="text-xs text-slate-400 font-mono flex items-center gap-1.5 pt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Datasheet-verified hardware specs</span>
          </div>
        </div>

        {/* Col 2: Course Modules */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200">
            Course Syllabus
          </h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/course/number-systems-and-codes" className="hover:text-blue-500 transition-colors">Module 1: Number Systems & Codes</Link></li>
            <li><Link href="/course/basic-logic-gates" className="hover:text-blue-500 transition-colors">Module 2: Basic Logic Gates</Link></li>
            <li><Link href="/course/boolean-algebra-and-kmap" className="hover:text-blue-500 transition-colors">Module 3: Boolean Algebra & K-Map</Link></li>
            <li><Link href="/course/combinational-logic-circuits" className="hover:text-blue-500 transition-colors">Module 4: Combinational Logic</Link></li>
            <li><Link href="/course/sequential-logic-circuits" className="hover:text-blue-500 transition-colors">Module 5: Sequential Circuits</Link></li>
            <li><Link href="/course/registers-and-counters" className="hover:text-blue-500 transition-colors">Module 6: Registers & Counters</Link></li>
          </ul>
        </div>

        {/* Col 3: Interactive Virtual Tools */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200">
            Interactive Tools
          </h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/simulator" className="hover:text-blue-500 flex items-center gap-1.5"><Sliders className="w-3 h-3 text-cyan-500" /> Circuit Simulator</Link></li>
            <li><Link href="/tools/converter" className="hover:text-blue-500 flex items-center gap-1.5"><Binary className="w-3 h-3 text-blue-500" /> Number Base Converter</Link></li>
            <li><Link href="/tools/kmap" className="hover:text-blue-500 flex items-center gap-1.5"><BookOpen className="w-3 h-3 text-purple-500" /> 2, 3, 4-Var K-Map Solver</Link></li>
            <li><Link href="/lab" className="hover:text-blue-500 flex items-center gap-1.5"><FlaskConical className="w-3 h-3 text-emerald-500" /> 14 Practical Experiments</Link></li>
            <li><Link href="/ic-library" className="hover:text-blue-500 flex items-center gap-1.5"><Library className="w-3 h-3 text-amber-500" /> Digital IC Library</Link></li>
            <li><Link href="/quiz" className="hover:text-blue-500 flex items-center gap-1.5"><HelpCircle className="w-3 h-3 text-rose-500" /> Practice & Quizzes</Link></li>
          </ul>
        </div>

        {/* Col 4: Platform & Pedagogy */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200">
            About & System
          </h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/about" className="hover:text-blue-500 transition-colors">About Digital Logic Lab</Link></li>
            <li><Link href="/admin" className="hover:text-blue-500 transition-colors">Admin Content Manager (CMS)</Link></li>
            <li className="pt-2">
              <span className="inline-block px-2 py-1 rounded bg-slate-200 dark:bg-slate-800 text-[11px] font-mono text-slate-700 dark:text-slate-300">
                Next.js 16 · React 19 · TypeScript · Tailwind v4
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
        <p>© {new Date().getFullYear()} Digital Logic Lab. Designed for educational excellence.</p>
        <div className="flex items-center gap-4">
          <Link href="/about" className="hover:underline">Documentation</Link>
          <Link href="/course" className="hover:underline">All Modules</Link>
          <Link href="/lab" className="hover:underline">Virtual Breadboard</Link>
        </div>
      </div>
    </footer>
  );
}
