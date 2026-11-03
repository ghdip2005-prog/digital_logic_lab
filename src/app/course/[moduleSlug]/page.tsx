'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import {
  BookOpen,
  Clock,
  CheckCircle2,
  ChevronRight,
  Cpu,
  Layers,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export default function ModulePage() {
  const params = useParams();
  const moduleSlug = params?.moduleSlug as string;
  const { modules, topics, progress } = useApp();

  const currentModule = modules.find(m => m.slug === moduleSlug);
  const moduleTopics = topics.filter(t => t.moduleId === currentModule?.id);

  if (!currentModule) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Module Not Found</h2>
        <Link href="/course" className="text-blue-500 hover:underline mt-4 inline-block">Return to Course Overview</Link>
      </div>
    );
  }

  const completedInModule = moduleTopics.filter(t => progress.completedTopics.includes(t.slug)).length;
  const modulePercent = moduleTopics.length > 0 ? Math.round((completedInModule / moduleTopics.length) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
      {/* Module Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 flex items-center justify-center">
          <Cpu className="w-64 h-64 text-cyan-400" />
        </div>

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-widest px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 font-mono border border-cyan-500/30">
              Module {currentModule.order}
            </span>
            <span className="text-xs text-slate-300 font-mono">
              • {currentModule.estimatedHours} Hours Coursework
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            {currentModule.title}
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            {currentModule.description}
          </p>

          <div className="pt-2 flex items-center gap-4 text-xs font-medium">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{completedInModule} of {moduleTopics.length} topics completed ({modulePercent}%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Topics List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-500" />
            <span>Curriculum Lessons & Topics</span>
          </h2>
          <span className="text-xs text-slate-500 font-mono">
            {moduleTopics.length} Topics
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {moduleTopics.map((topic, idx) => {
            const isCompleted = progress.completedTopics.includes(topic.slug);
            return (
              <Link
                key={topic.id}
                href={`/course/${currentModule.slug}/${topic.slug}`}
                className="group p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-slate-400 group-hover:text-blue-500 transition-colors">
                      Topic #{idx + 1}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        {topic.difficulty}
                      </span>
                      {isCompleted && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      )}
                    </div>
                  </div>

                  <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors">
                    {topic.title}
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {topic.subtitle}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-1.5 font-mono">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{topic.estimatedMinutes} min</span>
                  </div>

                  <span className="flex items-center gap-1 font-semibold text-blue-600 dark:text-cyan-400 group-hover:translate-x-1 transition-transform">
                    Start Topic <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
