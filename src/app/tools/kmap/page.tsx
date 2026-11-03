'use client';

import React, { useState } from 'react';
import {
  VariableCount,
  FormType,
  solveKMap,
  KMapSolution,
  CellValue
} from '@/lib/logic-engine/kmap';
import {
  Grid,
  Sparkles,
  Layers,
  RotateCcw,
  CheckCircle2,
  Sliders,
  Cpu,
  Sigma,
  HelpCircle,
  Hash
} from 'lucide-react';

export default function KMapSolverPage() {
  const [varCount, setVarCount] = useState<VariableCount>(4);
  const [form, setForm] = useState<FormType>('SOP');
  const [mintermInput, setMintermInput] = useState('0, 2, 8, 10');
  const [dontCareInput, setDontCareInput] = useState('');
  
  // Custom cell values map: { [minterm: number]: 0 | 1 | 'X' }
  const [cellOverrides, setCellOverrides] = useState<{ [minterm: number]: CellValue }>({
    0: 1,
    2: 1,
    8: 1,
    10: 1
  });

  // Calculate total minterms for current variable count
  const maxMinterm = Math.pow(2, varCount) - 1;

  // Active minterms and don't cares based on overrides
  const activeMinterms: number[] = [];
  const activeDontCares: number[] = [];

  for (let m = 0; m <= maxMinterm; m++) {
    const val = cellOverrides[m] ?? 0;
    if (val === 1) activeMinterms.push(m);
    else if (val === 'X') activeDontCares.push(m);
  }

  // Run solver
  const solution: KMapSolution = solveKMap(
    varCount,
    activeMinterms,
    activeDontCares,
    form
  );

  // Toggle cell on click: 0 -> 1 -> X -> 0
  const handleCellClick = (minterm: number) => {
    const curr = cellOverrides[minterm] ?? 0;
    let next: CellValue = 1;
    if (curr === 0) next = 1;
    else if (curr === 1) next = 'X';
    else next = 0;

    const copy = { ...cellOverrides, [minterm]: next };
    setCellOverrides(copy);

    // Sync input box
    const mList = Object.entries(copy).filter(([_, v]) => v === 1).map(([k]) => k);
    const dList = Object.entries(copy).filter(([_, v]) => v === 'X').map(([k]) => k);
    setMintermInput(mList.join(', '));
    setDontCareInput(dList.join(', '));
  };

  const handleApplyInputBoxes = () => {
    const newOverrides: { [minterm: number]: CellValue } = {};
    const mNums = mintermInput
      .split(/[\s,]+/)
      .map(s => parseInt(s.trim(), 10))
      .filter(n => !isNaN(n) && n >= 0 && n <= maxMinterm);

    const dNums = dontCareInput
      .split(/[\s,]+/)
      .map(s => parseInt(s.trim(), 10))
      .filter(n => !isNaN(n) && n >= 0 && n <= maxMinterm);

    mNums.forEach(m => { newOverrides[m] = 1; });
    dNums.forEach(d => { newOverrides[d] = 'X'; });

    setCellOverrides(newOverrides);
  };

  const handleClearAll = () => {
    setCellOverrides({});
    setMintermInput('');
    setDontCareInput('');
  };

  const handleLoadPreset = (name: string, vars: VariableCount, minterms: number[], dCares: number[] = []) => {
    setVarCount(vars);
    const newOverrides: { [minterm: number]: CellValue } = {};
    minterms.forEach(m => { newOverrides[m] = 1; });
    dCares.forEach(d => { newOverrides[d] = 'X'; });
    setCellOverrides(newOverrides);
    setMintermInput(minterms.join(', '));
    setDontCareInput(dCares.join(', '));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
      {/* Page Title */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 text-xs font-mono">
          <Grid className="w-3.5 h-3.5" />
          <span>Interactive Boolean Optimization Engine</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Karnaugh Map (K-Map) Solver
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
          Solve 2, 3, and 4-variable K-Maps with automatic prime implicant detection, wraparound adjacency, essential grouping, and step-by-step mathematical explanations.
        </p>
      </div>

      {/* Control Bar */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Variable Count Selector */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Variables:
            </span>
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              {([2, 3, 4] as VariableCount[]).map(cnt => (
                <button
                  key={cnt}
                  onClick={() => {
                    setVarCount(cnt);
                    setCellOverrides({});
                    setMintermInput('');
                    setDontCareInput('');
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                    varCount === cnt
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {cnt} Variables ({Math.pow(2, cnt)} Cells)
                </button>
              ))}
            </div>
          </div>

          {/* Form Type Selector: SOP vs POS */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Target Form:
            </span>
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setForm('SOP')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  form === 'SOP'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                SOP (Sum of Products)
              </button>
              <button
                onClick={() => setForm('POS')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  form === 'POS'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                POS (Product of Sums)
              </button>
            </div>
          </div>

          <button
            onClick={handleClearAll}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Grid</span>
          </button>
        </div>

        {/* Text Input Row for Minterms and Don't Cares */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Active Minterms (0 to {maxMinterm}):
            </label>
            <input
              type="text"
              value={mintermInput}
              onChange={e => setMintermInput(e.target.value)}
              placeholder="e.g. 0, 2, 8, 10"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-hidden focus:border-purple-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Don&apos;t Care Terms (X):
            </label>
            <input
              type="text"
              value={dontCareInput}
              onChange={e => setDontCareInput(e.target.value)}
              placeholder="e.g. 5, 7, 13"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-hidden focus:border-purple-500"
            />
          </div>

          <button
            onClick={handleApplyInputBoxes}
            className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs transition-colors cursor-pointer shadow-xs"
          >
            Update Map From Inputs
          </button>
        </div>

        {/* Presets */}
        <div className="flex items-center gap-2 flex-wrap pt-2">
          <span className="text-xs text-slate-400">Classic Presets:</span>
          <button
            onClick={() => handleLoadPreset('4 Corners', 4, [0, 2, 8, 10])}
            className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-mono hover:text-purple-400 cursor-pointer"
          >
            4 Corners (m0, m2, m8, m10)
          </button>
          <button
            onClick={() => handleLoadPreset('Full Adder Sum', 3, [1, 2, 4, 7])}
            className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-mono hover:text-purple-400 cursor-pointer"
          >
            Full Adder Sum (3-Var)
          </button>
          <button
            onClick={() => handleLoadPreset('Full Adder Carry', 3, [3, 5, 6, 7])}
            className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-mono hover:text-purple-400 cursor-pointer"
          >
            Full Adder Carry (3-Var)
          </button>
          <button
            onClick={() => handleLoadPreset('Octet (8 Cells)', 4, [0, 1, 2, 3, 4, 5, 6, 7])}
            className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-mono hover:text-purple-400 cursor-pointer"
          >
            Octet Group of 8
          </button>
        </div>
      </div>

      {/* Main Solver Grid & Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Interactive K-Map Canvas (Left 7 Cols) */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Interactive K-Map Grid ({solution.variables.join(', ')})
              </h2>
              <p className="text-xs text-slate-400">
                Click any cell to toggle: 0 → 1 → X (Don&apos;t Care) → 0.
              </p>
            </div>
            <span className="text-xs font-mono text-purple-600 dark:text-purple-400 font-bold">
              {solution.canonicalExpression}
            </span>
          </div>

          {/* Grid Layout with Gray Headers */}
          <div className="overflow-x-auto py-4 flex flex-col items-center">
            <div className="inline-block">
              {/* Column Gray Headers */}
              <div className="flex items-center">
                <div className="w-16 h-10 flex items-center justify-center font-mono text-xs font-bold text-slate-400">
                  {varCount === 2 ? 'A \\ B' : varCount === 3 ? 'A \\ BC' : 'AB \\ CD'}
                </div>
                {solution.colLabels.map(colLabel => (
                  <div
                    key={colLabel}
                    className="w-16 h-10 flex items-center justify-center font-mono text-xs font-bold text-blue-600 dark:text-cyan-400"
                  >
                    {colLabel}
                  </div>
                ))}
              </div>

              {/* Rows */}
              {solution.cells.map((rowCells, rIdx) => (
                <div key={rIdx} className="flex items-center">
                  {/* Row Gray Label */}
                  <div className="w-16 h-16 flex items-center justify-center font-mono text-xs font-bold text-purple-600 dark:text-purple-400">
                    {solution.rowLabels[rIdx]}
                  </div>

                  {/* Cell Blocks */}
                  {rowCells.map(cell => {
                    // Check if cell is in any group
                    const coveringGroups = solution.groups.filter(g =>
                      g.minterms.includes(cell.minterm)
                    );
                    const isGrouped = coveringGroups.length > 0;
                    const groupColor = coveringGroups[0]?.color;

                    return (
                      <div
                        key={cell.minterm}
                        onClick={() => handleCellClick(cell.minterm)}
                        style={{
                          borderColor: isGrouped ? groupColor : undefined,
                          backgroundColor: isGrouped ? `${groupColor}25` : undefined
                        }}
                        className={`w-16 h-16 border-2 rounded-xl m-1 flex flex-col items-center justify-between p-1.5 cursor-pointer transition-all select-none hover:scale-105 active:scale-95 ${
                          !isGrouped
                            ? 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 hover:border-slate-400'
                            : 'shadow-xs'
                        }`}
                        title={`Minterm m${cell.minterm} (${cell.binaryString})`}
                      >
                        <span className="text-[10px] font-mono text-slate-400 self-start">
                          m{cell.minterm}
                        </span>

                        <span className={`text-xl font-bold font-mono ${
                          cell.value === 1
                            ? 'text-blue-600 dark:text-cyan-400'
                            : cell.value === 'X'
                            ? 'text-amber-500'
                            : 'text-slate-400 dark:text-slate-600'
                        }`}>
                          {cell.value}
                        </span>

                        <span className="text-[9px] font-mono text-slate-400">
                          {cell.binaryString}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Minimized Output & Explanation (Right 5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Result Equation Hero */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-purple-900/40 via-blue-900/30 to-slate-900 border border-purple-500/30 shadow-xl space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-purple-400">
              Minimized {form} Boolean Equation:
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white tracking-wide break-words">
              Y = {solution.simplifiedExpression}
            </div>
            <div className="text-xs font-mono text-slate-400 pt-1">
              Groups Formed: <span className="text-cyan-300 font-bold">{solution.groups.length}</span>
            </div>
          </div>

          {/* Groups List */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200 flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-500" />
              <span>Identified Prime Implicants</span>
            </h3>

            {solution.groups.length === 0 ? (
              <p className="text-xs text-slate-500">No active terms to group.</p>
            ) : (
              <div className="space-y-3">
                {solution.groups.map(group => (
                  <div
                    key={group.id}
                    className="p-3.5 rounded-xl border text-xs space-y-1.5"
                    style={{
                      borderColor: `${group.color}60`,
                      backgroundColor: `${group.color}15`
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: group.color }}
                        />
                        <span className="font-bold font-mono text-sm" style={{ color: group.color }}>
                          {group.termExpression}
                        </span>
                      </div>
                      <span className="font-mono text-[11px] text-slate-500">
                        Size: {group.size} cells
                      </span>
                    </div>

                    <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                      {group.explanation}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Derivation Steps */}
          {solution.explanationSteps.length > 0 && (
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200 flex items-center gap-2">
                <Sigma className="w-4 h-4 text-blue-500" />
                <span>Minimization Derivation Steps</span>
              </h3>
              <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                {solution.explanationSteps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
