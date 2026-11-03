'use client';

import React, { useState } from 'react';
import { TruthTableData } from '@/types';
import { Table, ToggleLeft, ToggleRight, CheckCircle2, RotateCcw } from 'lucide-react';

interface Props {
  truthTable?: TruthTableData;
  activeInputs?: number[];
  onInputChange?: (newInputs: number[]) => void;
}

export default function InteractiveTruthTable({ truthTable, activeInputs, onInputChange }: Props) {
  if (!truthTable) return null;

  const [localInputs, setLocalInputs] = useState<number[]>(
    activeInputs || truthTable.inputs.map(() => 0)
  );

  const currentInputs = activeInputs || localInputs;

  const handleToggle = (inputIndex: number) => {
    const updated = [...currentInputs];
    updated[inputIndex] = updated[inputIndex] === 0 ? 1 : 0;
    if (onInputChange) {
      onInputChange(updated);
    } else {
      setLocalInputs(updated);
    }
  };

  const handleReset = () => {
    const resetVals = truthTable.inputs.map(() => 0);
    if (onInputChange) {
      onInputChange(resetVals);
    } else {
      setLocalInputs(resetVals);
    }
  };

  // Find currently matching row index
  const activeRowIndex = truthTable.rows.findIndex(row =>
    row.inputs.every((val, idx) => val === currentInputs[idx])
  );

  return (
    <section id="section-truthtable" className="scroll-mt-24 space-y-6">
      <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-sm">
            C
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Mathematically Verified Truth Table
            </h2>
            {truthTable.description && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {truthTable.description}
              </p>
            )}
          </div>
        </div>

        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Inputs</span>
        </button>
      </div>

      {/* Live Interactive Input Bar */}
      <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Live Input Toggles:
          </span>
          <div className="flex items-center gap-2 flex-wrap">
            {truthTable.inputs.map((inp, idx) => {
              const val = currentInputs[idx] || 0;
              return (
                <button
                  key={idx}
                  onClick={() => handleToggle(idx)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all shadow-xs cursor-pointer ${
                    val === 1
                      ? 'bg-cyan-500 text-white shadow-cyan-500/30'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700'
                  }`}
                >
                  <span>{inp}:</span>
                  <span className="text-sm">{val}</span>
                </button>
              );
            })}
          </div>
        </div>

        {activeRowIndex >= 0 && (
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Active State: Row {activeRowIndex + 1}</span>
          </div>
        )}
      </div>

      {/* Structured Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-xs">
        <table className="w-full text-left text-sm font-mono border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 text-xs">
              <th className="py-3 px-4 font-semibold text-center w-12">#</th>
              {/* Input Headers */}
              {truthTable.inputs.map((inp, idx) => (
                <th key={`in-${idx}`} className="py-3 px-4 font-bold text-blue-600 dark:text-blue-400 bg-blue-50/40 dark:bg-blue-950/30 text-center">
                  {inp} (Input)
                </th>
              ))}
              {/* Output Headers */}
              {truthTable.outputs.map((out, idx) => (
                <th key={`out-${idx}`} className="py-3 px-4 font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50/40 dark:bg-emerald-950/30 text-center">
                  {out} (Output)
                </th>
              ))}
              <th className="py-3 px-4 font-semibold text-slate-500 text-left">Condition / State Label</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {truthTable.rows.map((row, rowIdx) => {
              const isActiveRow = rowIdx === activeRowIndex;
              return (
                <tr
                  key={rowIdx}
                  onClick={() => {
                    if (onInputChange) onInputChange(row.inputs);
                    else setLocalInputs(row.inputs);
                  }}
                  className={`transition-colors cursor-pointer ${
                    isActiveRow
                      ? 'bg-blue-500/15 dark:bg-blue-500/20 font-bold border-l-4 border-blue-500 text-slate-900 dark:text-white'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-900/60 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <td className="py-3 px-4 text-center text-xs text-slate-400">
                    {rowIdx + 1}
                  </td>
                  {/* Inputs */}
                  {row.inputs.map((inVal, inIdx) => (
                    <td key={`inval-${inIdx}`} className="py-3 px-4 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded text-xs ${
                        inVal === 1
                          ? 'bg-blue-100 dark:bg-blue-900/70 text-blue-700 dark:text-blue-200'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                      }`}>
                        {inVal}
                      </span>
                    </td>
                  ))}
                  {/* Outputs */}
                  {row.outputs.map((outVal, outIdx) => (
                    <td key={`outval-${outIdx}`} className="py-3 px-4 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${
                        outVal === 1
                          ? 'bg-emerald-100 dark:bg-emerald-900/70 text-emerald-700 dark:text-emerald-300'
                          : 'bg-rose-100 dark:bg-rose-950/70 text-rose-700 dark:text-rose-400'
                      }`}>
                        {outVal}
                      </span>
                    </td>
                  ))}
                  {/* Label / Meaning */}
                  <td className="py-3 px-4 text-xs font-sans text-slate-500 dark:text-slate-400">
                    {row.label || 'Standard state'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
