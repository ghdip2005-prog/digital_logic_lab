import React from 'react';
import { BooleanExpressionData } from '@/types';
import { Sigma, GitBranch, Binary, ChevronDown, CheckCircle } from 'lucide-react';

interface Props {
  data?: BooleanExpressionData;
}

export default function SectionBooleanExpression({ data }: Props) {
  if (!data) return null;

  return (
    <section id="section-boolean" className="scroll-mt-24 space-y-6">
      <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold text-sm">
          D
        </div>
        <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
          Boolean Expression & Mathematical Derivation
        </h2>
      </div>

      {/* Primary Expression Hero Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-blue-500/10 border border-purple-200 dark:border-purple-900/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-400">
            Primary Output Expression
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900 dark:text-white mt-1">
            {data.primaryExpression}
          </div>
        </div>

        {data.algebraicLawsUsed && data.algebraicLawsUsed.length > 0 && (
          <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1">
            <span className="font-semibold text-slate-700 dark:text-slate-300">Axioms & Laws:</span>
            {data.algebraicLawsUsed.map((law, idx) => (
              <div key={idx} className="flex items-center gap-1.5 font-mono">
                <CheckCircle className="w-3 h-3 text-purple-500" />
                <span>{law}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SOP and POS Form Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* SOP */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            <Sigma className="w-4 h-4" />
            <span>Sum of Products (SOP) Form</span>
          </div>
          <div className="text-lg font-mono font-bold text-slate-900 dark:text-white">
            {data.sopForm || data.primaryExpression}
          </div>
          {data.canonicalSop && (
            <div className="text-xs font-mono text-slate-500 dark:text-slate-400 pt-1">
              Canonical: <span className="text-blue-600 dark:text-blue-400 font-semibold">{data.canonicalSop}</span>
            </div>
          )}
        </div>

        {/* POS */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            <Binary className="w-4 h-4" />
            <span>Product of Sums (POS) Form</span>
          </div>
          <div className="text-lg font-mono font-bold text-slate-900 dark:text-white">
            {data.posForm || 'N/A'}
          </div>
          {data.canonicalPos && (
            <div className="text-xs font-mono text-slate-500 dark:text-slate-400 pt-1">
              Canonical: <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{data.canonicalPos}</span>
            </div>
          )}
        </div>
      </div>

      {/* Step by Step Derivation Accordion */}
      {data.derivationSteps && data.derivationSteps.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Algebraic Derivation Steps
          </h3>
          <div className="space-y-2.5">
            {data.derivationSteps.map((step, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm"
              >
                <div className="space-y-1">
                  <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 text-xs flex items-center justify-center font-mono">
                      {step.step}
                    </span>
                    <span>{step.title}</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 pl-7">
                    {step.explanation}
                  </p>
                </div>

                <div className="shrink-0 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-xs font-semibold text-purple-600 dark:text-purple-400">
                  {step.equation}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
