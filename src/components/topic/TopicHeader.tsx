'use client';

import React from 'react';
import Link from 'next/link';
import { Topic, Module } from '@/types';
import { useApp } from '@/context/AppContext';
import {
  Clock,
  BarChart,
  Bookmark,
  CheckCircle2,
  Printer,
  Share2,
  ChevronRight
} from 'lucide-react';

interface TopicHeaderProps {
  topic: Topic;
  module?: Module;
}

export default function TopicHeader({ topic, module }: TopicHeaderProps) {
  const { progress, toggleCompletion, toggleBookmark } = useApp();
  const isCompleted = progress.completedTopics.includes(topic.slug);
  const isBookmarked = progress.bookmarkedTopics.includes(topic.slug);

  const handlePrint = () => {
    window.print();
  };

  const difficultyColors = {
    Beginner: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
    Intermediate: 'bg-blue-100 text-blue-800 dark:bg-blue-950/70 dark:text-blue-300 border-blue-300 dark:border-blue-800',
    Advanced: 'bg-purple-100 text-purple-800 dark:bg-purple-950/70 dark:text-purple-300 border-purple-300 dark:border-purple-800'
  };

  return (
    <div className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 pb-8 pt-6 px-4 sm:px-6 lg:px-8">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-4 font-medium flex-wrap">
        <Link href="/" className="hover:text-blue-500">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/course" className="hover:text-blue-500">Course</Link>
        {module && (
          <>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href={`/course/${module.slug}`} className="hover:text-blue-500">
              {module.title}
            </Link>
          </>
        )}
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-900 dark:text-white font-semibold">{topic.title}</span>
      </nav>

      {/* Main Topic Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="space-y-2.5 max-w-3xl">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${difficultyColors[topic.difficulty]}`}>
              {topic.difficulty}
            </span>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-mono">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{topic.estimatedMinutes} mins study</span>
            </div>
            {module && (
              <span className="text-xs text-cyan-600 dark:text-cyan-400 font-medium">
                • {module.title}
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {topic.title}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            {topic.subtitle}
          </p>
        </div>

        {/* User Interaction Buttons */}
        <div className="flex items-center gap-2 flex-wrap shrink-0">
          {/* Mark Complete */}
          <button
            onClick={() => toggleCompletion(topic.slug)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              isCompleted
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 hover:text-emerald-600 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <CheckCircle2 className={`w-4 h-4 ${isCompleted ? 'text-white' : 'text-slate-400'}`} />
            <span>{isCompleted ? 'Completed' : 'Mark Complete'}</span>
          </button>

          {/* Bookmark */}
          <button
            onClick={() => toggleBookmark(topic.slug)}
            className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
              isBookmarked
                ? 'bg-amber-50 dark:bg-amber-950/50 border-amber-300 dark:border-amber-700 text-amber-500'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 hover:text-amber-500'
            }`}
            title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Topic'}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
          </button>

          {/* Print Lesson */}
          <button
            onClick={handlePrint}
            className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
            title="Print Lesson Worksheet"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
