import React from 'react';
import { Topic } from '@/types';
import { BookOpen, CheckCircle, Sparkles, Sigma } from 'lucide-react';

interface Props {
  topic: Topic;
}

export default function SectionExplanation({ topic }: Props) {
  const { explanation } = topic;

  return (
    <section id="section-explanation" className="scroll-mt-24 space-y-6">
      <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-sm">
          B
        </div>
        <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
          Detailed Technical Explanation
        </h2>
      </div>

      {/* Step by step cards */}
      <div className="space-y-4">
        {explanation.stepByStep.map((step, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 transition-colors"
          >
            <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white text-base">
              <span className="w-6 h-6 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 text-xs flex items-center justify-center font-mono">
                {idx + 1}
              </span>
              <h3>{step.stepTitle}</h3>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line pl-8">
              {step.content}
            </p>

            {step.formula && (
              <div className="ml-8 p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-xs sm:text-sm text-blue-600 dark:text-cyan-400 flex items-center gap-2.5 overflow-x-auto">
                <Sigma className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{step.formula}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Key Takeaways Callout */}
      {explanation.keyTakeaways && explanation.keyTakeaways.length > 0 && (
        <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-500/5 via-blue-500/5 to-cyan-500/5 border border-indigo-200/50 dark:border-indigo-900/50 space-y-3">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold text-sm">
            <Sparkles className="w-4 h-4" />
            <span>Key Takeaways to Remember</span>
          </div>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
            {explanation.keyTakeaways.map((point, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
