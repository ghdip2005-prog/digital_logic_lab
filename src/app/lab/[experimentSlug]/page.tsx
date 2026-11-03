'use client';

import React, { useState } from 'react';
import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { toggleExperimentCompletion } from '@/lib/storage';
import {
  FlaskConical,
  CheckCircle2,
  ChevronRight,
  Printer,
  ShieldAlert,
  Zap,
  RotateCcw,
  ListOrdered,
  AlertTriangle,
  Award,
  Layers,
  ArrowRight
} from 'lucide-react';

export default function ExperimentDetailPage() {
  const params = useParams();
  const slug = params?.experimentSlug as string;
  const { experiments, progress, refreshData } = useApp();

  const experiment = experiments.find(e => e.slug === slug);

  // Local simulated inputs state for the lab testbench
  const [testInputs, setTestInputs] = useState<number[]>([0, 0, 0]);
  const [testedRows, setTestedRows] = useState<{ [rowIdx: number]: boolean }>({});

  if (!experiment) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold">Experiment Not Found</h2>
        <Link href="/lab" className="text-emerald-500 hover:underline mt-4 inline-block">Back to Lab Catalog</Link>
      </div>
    );
  }

  const isCompleted = progress.experimentCompletions.includes(experiment.id);

  const handleToggleComplete = () => {
    toggleExperimentCompletion(experiment.id);
    refreshData();
  };

  const handleTestRow = (rowIdx: number, rowInputs: (string | number)[]) => {
    // Convert first 2 or 3 columns to numbers
    const inVals = rowInputs.slice(0, rowInputs.length - 3).map(v => Number(v));
    setTestInputs(inVals);
    setTestedRows(prev => ({ ...prev, [rowIdx]: true }));
  };

  const allRowsVerified = experiment.observationTable.rows.every((_, idx) => testedRows[idx]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium flex-wrap">
        <Link href="/" className="hover:text-emerald-500">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/lab" className="hover:text-emerald-500">Practical Laboratory</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-900 dark:text-white font-semibold">Exp #{experiment.experimentNumber}</span>
      </nav>

      {/* Header Banner */}
      <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-3xl">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-mono font-bold">
              Experiment #{experiment.experimentNumber}
            </span>
            <span className="text-xs font-mono uppercase text-slate-400">
              • {experiment.circuitType}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {experiment.title}
          </h1>

          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {experiment.objective}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleToggleComplete}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              isCompleted
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-50 hover:text-emerald-600 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isCompleted ? 'Lab Report Verified' : 'Mark Completed'}</span>
          </button>

          <button
            onClick={() => window.print()}
            className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            title="Print Laboratory Worksheet"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Equipment Checklist */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200 flex items-center gap-2">
          <Layers className="w-4 h-4 text-emerald-500" />
          <span>Apparatus & Required Laboratory Equipment</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {experiment.requiredEquipment.map((eq, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs"
            >
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {eq.item}
              </span>
              <span className="font-mono px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-bold">
                ×{eq.quantity}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* IC Pin Connections Table */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200 flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500" />
            <span>Pin-by-Pin Hardware Wiring Table</span>
          </h2>
          <span className="text-xs font-mono text-slate-400">
            ICs Used: {experiment.icNumbers.join(', ')}
          </span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-500">
                <th className="py-2.5 px-4 font-semibold">IC Pin Reference</th>
                <th className="py-2.5 px-4 font-semibold text-center w-8">→</th>
                <th className="py-2.5 px-4 font-semibold">Target Connection</th>
                <th className="py-2.5 px-4 font-semibold">Terminal Function</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {experiment.pinConnections.map((conn, idx) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                  <td className="py-2.5 px-4 font-bold text-blue-600 dark:text-cyan-400">{conn.pin}</td>
                  <td className="py-2.5 px-4 text-center text-slate-400">→</td>
                  <td className="py-2.5 px-4 font-bold text-slate-900 dark:text-white">{conn.connectTo}</td>
                  <td className="py-2.5 px-4 text-slate-600 dark:text-slate-400 font-sans">{conn.functionDesc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Step by Step Procedure */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200 flex items-center gap-2">
          <ListOrdered className="w-4 h-4 text-indigo-500" />
          <span>Laboratory Step-by-Step Procedure</span>
        </h2>

        <div className="space-y-2.5">
          {experiment.procedureSteps.map((step, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-700 dark:text-slate-300 flex items-start gap-3"
            >
              <span className="w-6 h-6 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <span>{step}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Live Observation Table (Interactive Test Matrix) */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200 flex items-center gap-2">
              <FlaskConical className="w-4 h-4 text-emerald-500" />
              <span>Observation & Verification Table</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Click &quot;Verify Row&quot; to test each combination against expected datasheet behavior.
            </p>
          </div>

          {allRowsVerified && (
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 font-mono">
              <Award className="w-4 h-4" />
              <span>All states experimentally verified!</span>
            </div>
          )}
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400">
                <th className="py-3 px-4 text-center">#</th>
                {experiment.observationTable.headers.map((h, i) => (
                  <th key={i} className="py-3 px-4 font-bold text-center">
                    {h}
                  </th>
                ))}
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {experiment.observationTable.rows.map((row, rIdx) => {
                const isTested = testedRows[rIdx];

                return (
                  <tr
                    key={rIdx}
                    className={`transition-colors ${
                      isTested
                        ? 'bg-emerald-50/50 dark:bg-emerald-950/20 font-semibold'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-850/50'
                    }`}
                  >
                    <td className="py-3 px-4 text-center text-slate-400">{rIdx + 1}</td>
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="py-3 px-4 text-center">
                        <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800">
                          {cell}
                        </span>
                      </td>
                    ))}
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleTestRow(rIdx, row)}
                        className={`px-3 py-1 rounded-lg text-[11px] font-sans font-semibold transition-all cursor-pointer ${
                          isTested
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {isTested ? 'Verified ✓' : 'Verify Row'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Results & Troubleshooting Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Results */}
        <div className="p-6 rounded-3xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Experimental Results & Conclusion</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-mono">
            {experiment.resultsSummary}
          </p>
        </div>

        {/* Troubleshooting */}
        <div className="p-6 rounded-3xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            <span>Laboratory Troubleshooting Guide</span>
          </h3>
          <div className="space-y-2">
            {experiment.troubleshootingGuide.map((item, idx) => (
              <div key={idx} className="text-xs space-y-0.5">
                <span className="font-bold text-rose-600 dark:text-rose-400">
                  {item.problem}:
                </span>
                <p className="text-slate-600 dark:text-slate-300">
                  Check {item.check} → {item.remedy}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
