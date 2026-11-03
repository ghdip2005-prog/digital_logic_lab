'use client';

import React from 'react';
import Link from 'next/link';
import { Topic, Module } from '@/types';
import { useApp } from '@/context/AppContext';
import {
  List,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  BookOpen,
  Info,
  Table,
  Sigma,
  Sliders,
  Cpu,
  HelpCircle
} from 'lucide-react';

interface Props {
  currentTopic: Topic;
  module?: Module;
}

export default function TopicSidebar({ currentTopic, module }: Props) {
  const { topics, progress } = useApp();

  const moduleTopics = topics.filter(t => t.moduleId === currentTopic.moduleId);
  const currentIndex = moduleTopics.findIndex(t => t.id === currentTopic.id);
  const prevTopic = currentIndex > 0 ? moduleTopics[currentIndex - 1] : null;
  const nextTopic = currentIndex >= 0 && currentIndex < moduleTopics.length - 1 ? moduleTopics[currentIndex + 1] : null;

  const sections = [
    { id: 'section-intro', label: 'A. Introduction', icon: Info },
    { id: 'section-explanation', label: 'B. Detailed Explanation', icon: BookOpen },
    { id: 'section-truthtable', label: 'C. Truth Table', icon: Table },
    { id: 'section-boolean', label: 'D. Boolean Expression', icon: Sigma },
    { id: 'section-circuit', label: 'E & F. Circuit & Simulation', icon: Sliders },
    { id: 'section-hardware', label: 'G. Hardware Implementation', icon: Cpu },
    { id: 'section-practice', label: 'H. Practice Problems', icon: HelpCircle }
  ];

  return (
    <aside className="w-full lg:w-72 shrink-0 space-y-6">
      {/* Table of Contents Inside Lesson */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs sticky top-20">
        <div className="flex items-center gap-2 pb-3 mb-3 border-b border-slate-100 dark:border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-500">
          <List className="w-4 h-4 text-blue-500" />
          <span>Lesson Contents</span>
        </div>

        <nav className="space-y-1">
          {sections.map(sec => {
            const Icon = sec.icon;
            return (
              <a
                key={sec.id}
                href={`#${sec.id}`}
                className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-cyan-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
              >
                <Icon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{sec.label}</span>
              </a>
            );
          })}
        </nav>

        {/* Module Topic Navigation */}
        {module && (
          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
              <span>{module.title}</span>
              <span className="text-[11px] text-slate-400 font-mono">
                {currentIndex + 1} / {moduleTopics.length}
              </span>
            </div>

            <div className="space-y-1 max-h-48 overflow-y-auto">
              {moduleTopics.map(t => {
                const isCurrent = t.id === currentTopic.id;
                const isDone = progress.completedTopics.includes(t.slug);
                return (
                  <Link
                    key={t.id}
                    href={`/course/${module.slug}/${t.slug}`}
                    className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                      isCurrent
                        ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-semibold'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <span className="truncate">{t.title}</span>
                    {isDone && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 ml-1.5" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Next & Previous Buttons */}
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
          {nextTopic && module && (
            <Link
              href={`/course/${module.slug}/${nextTopic.slug}`}
              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-all"
            >
              <div className="text-left truncate">
                <span className="text-[10px] text-blue-200 uppercase block font-normal">Next Topic</span>
                <span className="truncate block">{nextTopic.title}</span>
              </div>
              <ChevronRight className="w-4 h-4 shrink-0 ml-1" />
            </Link>
          )}

          {prevTopic && module && (
            <Link
              href={`/course/${module.slug}/${prevTopic.slug}`}
              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-750 text-xs font-medium transition-all"
            >
              <ChevronLeft className="w-4 h-4 shrink-0 mr-1" />
              <div className="text-right truncate">
                <span className="text-[10px] text-slate-400 uppercase block font-normal">Previous</span>
                <span className="truncate block">{prevTopic.title}</span>
              </div>
            </Link>
          )}
        </div>
      </div>
    </aside>
  );
}
