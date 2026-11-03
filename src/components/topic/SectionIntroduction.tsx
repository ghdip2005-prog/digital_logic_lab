import React from 'react';
import { Topic } from '@/types';
import { Info, Lightbulb, Target, Wrench } from 'lucide-react';

interface Props {
  topic: Topic;
}

export default function SectionIntroduction({ topic }: Props) {
  const { introduction } = topic;

  return (
    <section id="section-intro" className="scroll-mt-24 space-y-6">
      <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-sm">
          A
        </div>
        <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
          Introduction & Overview
        </h2>
      </div>

      {/* Definition & Importance Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold text-sm">
            <Info className="w-4 h-4" />
            <span>Definition</span>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {introduction.definition}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-semibold text-sm">
            <Lightbulb className="w-4 h-4" />
            <span>Why It Is Important</span>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {introduction.importance}
          </p>
        </div>
      </div>

      {/* Practical Applications & Learning Objectives */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Applications */}
        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 font-semibold text-sm">
            <Wrench className="w-4 h-4" />
            <span>Practical Real-World Applications</span>
          </div>
          <ul className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            {introduction.practicalApplications.map((app, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-1.5 shrink-0" />
                <span>{app}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Learning Objectives */}
        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold text-sm">
            <Target className="w-4 h-4" />
            <span>Core Learning Objectives</span>
          </div>
          <ul className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            {introduction.learningObjectives.map((obj, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <span>{obj}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
