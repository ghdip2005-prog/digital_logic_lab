'use client';

import React, { useState } from 'react';
import { CircuitDiagramData, TruthTableData } from '@/types';
import { Sliders, RotateCcw, Lightbulb, Play, CheckCircle2 } from 'lucide-react';

interface Props {
  circuit?: CircuitDiagramData;
  truthTable?: TruthTableData;
  externalInputs?: number[];
  onInputChange?: (inputs: number[]) => void;
}

export default function InteractiveCircuitViewer({
  circuit,
  truthTable,
  externalInputs,
  onInputChange
}: Props) {
  if (!circuit) return null;

  const [internalInputs, setInternalInputs] = useState<number[]>(
    circuit.inputs.map(i => i.defaultValue)
  );

  const inputs = externalInputs || internalInputs;

  const setInputs = (newInputs: number[]) => {
    if (onInputChange) {
      onInputChange(newInputs);
    } else {
      setInternalInputs(newInputs);
    }
  };

  const toggleInput = (idx: number) => {
    const next = [...inputs];
    next[idx] = next[idx] === 0 ? 1 : 0;
    setInputs(next);
  };

  const handleReset = () => {
    setInputs(circuit.inputs.map(() => 0));
  };

  // Evaluate output values
  const inputA = inputs[0] ?? 0;
  const inputB = inputs[1] ?? 0;
  const inputC = inputs[2] ?? 0;

  let outputs: { [name: string]: number } = {};

  if (circuit.type === 'basic-gate') {
    const gateType = circuit.gates[0]?.type || 'AND';
    if (gateType === 'AND') outputs['out_y'] = (inputA === 1 && inputB === 1) ? 1 : 0;
    else if (gateType === 'OR') outputs['out_y'] = (inputA === 1 || inputB === 1) ? 1 : 0;
    else if (gateType === 'NOT') outputs['out_y'] = (inputA === 1) ? 0 : 1;
    else if (gateType === 'NAND') outputs['out_y'] = (inputA === 1 && inputB === 1) ? 0 : 1;
    else if (gateType === 'NOR') outputs['out_y'] = (inputA === 0 && inputB === 0) ? 1 : 0;
    else if (gateType === 'XOR') outputs['out_y'] = (inputA ^ inputB);
    else if (gateType === 'XNOR') outputs['out_y'] = (inputA ^ inputB) ? 0 : 1;
  } else if (circuit.type === 'combinational') {
    // Check if Half Adder or Full Adder
    if (circuit.inputs.length === 2 && circuit.outputs.length === 2) {
      // Half Adder
      outputs['out_sum'] = inputA ^ inputB;
      outputs['out_carry'] = (inputA === 1 && inputB === 1) ? 1 : 0;
    } else if (circuit.inputs.length === 3) {
      // Full Adder (A, B, Cin)
      outputs['out_sum'] = inputA ^ inputB ^ inputC;
      outputs['out_cout'] = ((inputA && inputB) || (inputC && (inputA ^ inputB))) ? 1 : 0;
    }
  } else if (circuit.type === 'sequential') {
    // SR Latch: S=1, R=0 -> Q=1, Q'=0; S=0, R=1 -> Q=0, Q'=1
    if (inputA === 1 && inputB === 0) {
      outputs['out_q'] = 1;
      outputs['out_qbar'] = 0;
    } else if (inputA === 0 && inputB === 1) {
      outputs['out_q'] = 0;
      outputs['out_qbar'] = 1;
    } else if (inputA === 1 && inputB === 1) {
      outputs['out_q'] = 0;
      outputs['out_qbar'] = 0; // NOR invalid
    } else {
      outputs['out_q'] = 1; // Default memory state
      outputs['out_qbar'] = 0;
    }
  }

  // Active truth table matching row
  const activeRowIdx = truthTable
    ? truthTable.rows.findIndex(r => r.inputs.every((val, i) => val === inputs[i]))
    : -1;

  return (
    <section id="section-circuit" className="scroll-mt-24 space-y-6">
      <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-bold text-sm">
            E & F
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Interactive Logic Circuit & Virtual Simulation
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Toggle switches to trigger live signal propagation and observe output LEDs.
            </p>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Simulation</span>
        </button>
      </div>

      {/* Control Strip */}
      <div className="p-4 rounded-2xl bg-slate-900 text-white border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        {/* Toggle Switches */}
        <div className="flex items-center gap-4 flex-wrap">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Interactive Inputs:
          </span>
          {circuit.inputs.map((inp, idx) => {
            const val = inputs[idx] ?? 0;
            return (
              <button
                key={inp.id}
                onClick={() => toggleInput(idx)}
                className={`flex items-center gap-2.5 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                  val === 1
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/30 scale-105'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-400 border border-slate-700'
                }`}
              >
                <span>{inp.name}</span>
                <span className={`px-1.5 py-0.5 rounded text-[10px] ${val === 1 ? 'bg-white text-slate-900' : 'bg-slate-900 text-slate-400'}`}>
                  {val === 1 ? 'HIGH (1)' : 'LOW (0)'}
                </span>
              </button>
            );
          })}
        </div>

        {/* Quick Test Combination Pills */}
        {truthTable && (
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-slate-400 mr-1 hidden sm:inline">Test States:</span>
            {truthTable.rows.map((r, rIdx) => {
              const isMatch = rIdx === activeRowIdx;
              return (
                <button
                  key={rIdx}
                  onClick={() => setInputs(r.inputs)}
                  className={`px-2 py-1 rounded-lg text-[11px] font-mono transition-all cursor-pointer ${
                    isMatch
                      ? 'bg-cyan-500 text-white font-bold'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-400'
                  }`}
                  title={`Test inputs: ${r.inputs.join('')}`}
                >
                  {r.inputs.join('')}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* SVG Circuit Schematic Canvas */}
      <div className="relative rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-950 p-6 overflow-x-auto shadow-inner flex items-center justify-center min-h-[300px]">
        {/* Subtle engineering grid background */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, #38bdf8 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }}
        />

        <svg width="680" height="280" viewBox="0 0 680 280" className="relative select-none">
          <defs>
            <filter id="glow-cyan" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="glow-led" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Render Gates & Wiring based on type */}
          {circuit.type === 'basic-gate' && (
            <g>
              {/* Wire Input A */}
              <line
                x1="80"
                y1="100"
                x2="240"
                y2="100"
                stroke={inputA === 1 ? '#06b6d4' : '#334155'}
                strokeWidth="3.5"
                strokeLinecap="round"
                filter={inputA === 1 ? 'url(#glow-cyan)' : undefined}
              />
              <text x="70" y="105" fill="#94a3b8" fontSize="12" fontFamily="monospace" textAnchor="end">
                Input A ({inputA})
              </text>

              {/* Wire Input B (if applicable) */}
              {circuit.inputs.length > 1 && (
                <>
                  <line
                    x1="80"
                    y1="180"
                    x2="240"
                    y2="180"
                    stroke={inputB === 1 ? '#06b6d4' : '#334155'}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    filter={inputB === 1 ? 'url(#glow-cyan)' : undefined}
                  />
                  <text x="70" y="185" fill="#94a3b8" fontSize="12" fontFamily="monospace" textAnchor="end">
                    Input B ({inputB})
                  </text>
                </>
              )}

              {/* Gate Graphic */}
              {circuit.gates[0]?.type === 'AND' && (
                <g transform="translate(240, 70)">
                  <path
                    d="M 0 0 L 40 0 A 70 70 0 0 1 40 140 L 0 140 Z"
                    fill="#1e293b"
                    stroke="#0284c7"
                    strokeWidth="3"
                  />
                  <text x="35" y="75" fill="#38bdf8" fontSize="13" fontWeight="bold" textAnchor="middle">
                    AND
                  </text>
                </g>
              )}

              {circuit.gates[0]?.type === 'OR' && (
                <g transform="translate(240, 70)">
                  <path
                    d="M 0 0 Q 30 70 0 140 Q 55 140 90 70 Q 55 0 0 0 Z"
                    fill="#1e293b"
                    stroke="#0284c7"
                    strokeWidth="3"
                  />
                  <text x="35" y="75" fill="#38bdf8" fontSize="13" fontWeight="bold" textAnchor="middle">
                    OR
                  </text>
                </g>
              )}

              {circuit.gates[0]?.type === 'NOT' && (
                <g transform="translate(240, 70)">
                  <polygon points="0,20 60,70 0,120" fill="#1e293b" stroke="#0284c7" strokeWidth="3" />
                  <circle cx="68" cy="70" r="8" fill="#1e293b" stroke="#0284c7" strokeWidth="3" />
                  <text x="25" y="75" fill="#38bdf8" fontSize="12" fontWeight="bold" textAnchor="middle">
                    NOT
                  </text>
                </g>
              )}

              {circuit.gates[0]?.type === 'NAND' && (
                <g transform="translate(240, 70)">
                  <path
                    d="M 0 0 L 40 0 A 70 70 0 0 1 40 140 L 0 140 Z"
                    fill="#1e293b"
                    stroke="#0284c7"
                    strokeWidth="3"
                  />
                  <circle cx="95" cy="70" r="7" fill="#1e293b" stroke="#0284c7" strokeWidth="3" />
                  <text x="35" y="75" fill="#38bdf8" fontSize="12" fontWeight="bold" textAnchor="middle">
                    NAND
                  </text>
                </g>
              )}

              {/* Output Wire */}
              {(() => {
                const outVal = outputs['out_y'] ?? 0;
                const isHigh = outVal === 1;
                return (
                  <>
                    <line
                      x1="350"
                      y1="140"
                      x2="480"
                      y2="140"
                      stroke={isHigh ? '#10b981' : '#334155'}
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      filter={isHigh ? 'url(#glow-cyan)' : undefined}
                    />

                    {/* Output LED */}
                    <circle
                      cx="510"
                      cy="140"
                      r="18"
                      fill={isHigh ? '#10b981' : '#1e293b'}
                      stroke={isHigh ? '#34d399' : '#475569'}
                      strokeWidth="3"
                      filter={isHigh ? 'url(#glow-led)' : undefined}
                    />
                    <text
                      x="510"
                      y="145"
                      fill={isHigh ? '#ffffff' : '#64748b'}
                      fontSize="14"
                      fontWeight="bold"
                      fontFamily="monospace"
                      textAnchor="middle"
                    >
                      {outVal}
                    </text>
                    <text x="545" y="145" fill="#94a3b8" fontSize="12" fontFamily="monospace">
                      Output Y = {outVal}
                    </text>
                  </>
                );
              })()}
            </g>
          )}

          {/* Half Adder Schematic */}
          {circuit.type === 'combinational' && circuit.inputs.length === 2 && (
            <g>
              {/* Input A */}
              <line x1="80" y1="70" x2="240" y2="70" stroke={inputA === 1 ? '#06b6d4' : '#334155'} strokeWidth="3" filter={inputA === 1 ? 'url(#glow-cyan)' : undefined} />
              <line x1="140" y1="70" x2="140" y2="190" stroke={inputA === 1 ? '#06b6d4' : '#334155'} strokeWidth="3" />
              <line x1="140" y1="190" x2="240" y2="190" stroke={inputA === 1 ? '#06b6d4' : '#334155'} strokeWidth="3" filter={inputA === 1 ? 'url(#glow-cyan)' : undefined} />
              <text x="70" y="75" fill="#94a3b8" fontSize="12" fontFamily="monospace" textAnchor="end">A ({inputA})</text>

              {/* Input B */}
              <line x1="80" y1="110" x2="240" y2="110" stroke={inputB === 1 ? '#06b6d4' : '#334155'} strokeWidth="3" filter={inputB === 1 ? 'url(#glow-cyan)' : undefined} />
              <line x1="180" y1="110" x2="180" y2="230" stroke={inputB === 1 ? '#06b6d4' : '#334155'} strokeWidth="3" />
              <line x1="180" y1="230" x2="240" y2="230" stroke={inputB === 1 ? '#06b6d4' : '#334155'} strokeWidth="3" filter={inputB === 1 ? 'url(#glow-cyan)' : undefined} />
              <text x="70" y="115" fill="#94a3b8" fontSize="12" fontFamily="monospace" textAnchor="end">B ({inputB})</text>

              {/* XOR Gate (Sum) */}
              <g transform="translate(240, 50)">
                <path d="M 0 0 Q 25 40 0 80 Q 45 80 80 40 Q 45 0 0 0 Z" fill="#1e293b" stroke="#0284c7" strokeWidth="2.5" />
                <path d="M -8 0 Q 17 40 -8 80" fill="none" stroke="#0284c7" strokeWidth="2.5" />
                <text x="35" y="45" fill="#38bdf8" fontSize="11" fontWeight="bold" textAnchor="middle">XOR</text>
              </g>

              {/* AND Gate (Carry) */}
              <g transform="translate(240, 170)">
                <path d="M 0 0 L 30 0 A 40 40 0 0 1 30 80 L 0 80 Z" fill="#1e293b" stroke="#0284c7" strokeWidth="2.5" />
                <text x="30" y="45" fill="#38bdf8" fontSize="11" fontWeight="bold" textAnchor="middle">AND</text>
              </g>

              {/* Sum Output LED */}
              {(() => {
                const s = outputs['out_sum'] ?? 0;
                return (
                  <>
                    <line x1="330" y1="90" x2="480" y2="90" stroke={s === 1 ? '#10b981' : '#334155'} strokeWidth="3" filter={s === 1 ? 'url(#glow-cyan)' : undefined} />
                    <circle cx="510" cy="90" r="15" fill={s === 1 ? '#10b981' : '#1e293b'} stroke={s === 1 ? '#34d399' : '#475569'} strokeWidth="2.5" filter={s === 1 ? 'url(#glow-led)' : undefined} />
                    <text x="510" y="95" fill={s === 1 ? '#fff' : '#64748b'} fontSize="12" fontWeight="bold" textAnchor="middle">{s}</text>
                    <text x="540" y="95" fill="#94a3b8" fontSize="12" fontFamily="monospace">Sum (S)</text>
                  </>
                );
              })()}

              {/* Carry Output LED */}
              {(() => {
                const c = outputs['out_carry'] ?? 0;
                return (
                  <>
                    <line x1="320" y1="210" x2="480" y2="210" stroke={c === 1 ? '#ef4444' : '#334155'} strokeWidth="3" filter={c === 1 ? 'url(#glow-cyan)' : undefined} />
                    <circle cx="510" cy="210" r="15" fill={c === 1 ? '#ef4444' : '#1e293b'} stroke={c === 1 ? '#f87171' : '#475569'} strokeWidth="2.5" filter={c === 1 ? 'url(#glow-led)' : undefined} />
                    <text x="510" y="215" fill={c === 1 ? '#fff' : '#64748b'} fontSize="12" fontWeight="bold" textAnchor="middle">{c}</text>
                    <text x="540" y="215" fill="#94a3b8" fontSize="12" fontFamily="monospace">Carry (C)</text>
                  </>
                );
              })()}
            </g>
          )}

          {/* Full Adder Schematic */}
          {circuit.type === 'combinational' && circuit.inputs.length === 3 && (
            <g transform="translate(10, 0)">
              {/* Inputs */}
              <text x="60" y="55" fill="#94a3b8" fontSize="11" fontFamily="monospace">A={inputA}</text>
              <text x="60" y="95" fill="#94a3b8" fontSize="11" fontFamily="monospace">B={inputB}</text>
              <text x="60" y="185" fill="#94a3b8" fontSize="11" fontFamily="monospace">Cin={inputC}</text>

              {/* Block view for complex circuit */}
              <rect x="140" y="40" width="100" height="70" rx="8" fill="#1e293b" stroke="#0284c7" strokeWidth="2" />
              <text x="190" y="80" fill="#38bdf8" fontSize="12" fontWeight="bold" textAnchor="middle">Half Adder 1</text>

              <rect x="300" y="70" width="100" height="70" rx="8" fill="#1e293b" stroke="#0284c7" strokeWidth="2" />
              <text x="350" y="110" fill="#38bdf8" fontSize="12" fontWeight="bold" textAnchor="middle">Half Adder 2</text>

              <rect x="440" y="160" width="70" height="50" rx="8" fill="#1e293b" stroke="#0284c7" strokeWidth="2" />
              <text x="475" y="190" fill="#38bdf8" fontSize="12" fontWeight="bold" textAnchor="middle">OR Gate</text>

              {/* Final Output LEDs */}
              <circle cx="580" cy="105" r="16" fill={outputs['out_sum'] ? '#10b981' : '#1e293b'} stroke="#34d399" strokeWidth="2" filter={outputs['out_sum'] ? 'url(#glow-led)' : undefined} />
              <text x="580" y="110" fill="#fff" fontSize="13" fontWeight="bold" textAnchor="middle">{outputs['out_sum']}</text>
              <text x="605" y="110" fill="#94a3b8" fontSize="12">Sum</text>

              <circle cx="580" cy="185" r="16" fill={outputs['out_cout'] ? '#ef4444' : '#1e293b'} stroke="#f87171" strokeWidth="2" filter={outputs['out_cout'] ? 'url(#glow-led)' : undefined} />
              <text x="580" y="190" fill="#fff" fontSize="13" fontWeight="bold" textAnchor="middle">{outputs['out_cout']}</text>
              <text x="605" y="190" fill="#94a3b8" fontSize="12">Cout</text>
            </g>
          )}

          {/* Sequential / SR Latch */}
          {circuit.type === 'sequential' && (
            <g transform="translate(40, 20)">
              <rect x="180" y="40" width="120" height="60" rx="8" fill="#1e293b" stroke="#8b5cf6" strokeWidth="2" />
              <text x="240" y="75" fill="#c084fc" fontSize="12" fontWeight="bold" textAnchor="middle">NOR 1 (Reset)</text>

              <rect x="180" y="140" width="120" height="60" rx="8" fill="#1e293b" stroke="#8b5cf6" strokeWidth="2" />
              <text x="240" y="175" fill="#c084fc" fontSize="12" fontWeight="bold" textAnchor="middle">NOR 2 (Set)</text>

              {/* Feedback wires */}
              <path d="M 300 70 L 340 70 L 340 120 L 150 120 L 150 160 L 180 160" fill="none" stroke="#8b5cf6" strokeWidth="2" />
              <path d="M 300 170 L 330 170 L 330 130 L 160 130 L 160 80 L 180 80" fill="none" stroke="#8b5cf6" strokeWidth="2" />

              {/* Output LEDs */}
              <circle cx="460" cy="70" r="16" fill={outputs['out_q'] ? '#10b981' : '#1e293b'} stroke="#34d399" strokeWidth="2" />
              <text x="460" y="75" fill="#fff" fontSize="12" fontWeight="bold" textAnchor="middle">{outputs['out_q']}</text>
              <text x="490" y="75" fill="#94a3b8" fontSize="12">Q (State)</text>

              <circle cx="460" cy="170" r="16" fill={outputs['out_qbar'] ? '#ef4444' : '#1e293b'} stroke="#f87171" strokeWidth="2" />
              <text x="460" y="175" fill="#fff" fontSize="12" fontWeight="bold" textAnchor="middle">{outputs['out_qbar']}</text>
              <text x="490" y="175" fill="#94a3b8" fontSize="12">Q&apos; (Inverted)</text>
            </g>
          )}
        </svg>
      </div>

      {/* Wiring Notes Callout */}
      {circuit.wiringNotes && (
        <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 font-mono">
          <span className="font-bold text-slate-800 dark:text-slate-200">Wiring Note:</span> {circuit.wiringNotes}
        </div>
      )}
    </section>
  );
}
