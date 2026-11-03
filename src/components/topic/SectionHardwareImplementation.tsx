'use client';

import React, { useState } from 'react';
import { HardwareImplementationData, ICComponent } from '@/types';
import { useApp } from '@/context/AppContext';
import {
  Cpu,
  Zap,
  Layers,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  ListOrdered,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

interface Props {
  hardware?: HardwareImplementationData;
}

export default function SectionHardwareImplementation({ hardware }: Props) {
  const { ics } = useApp();
  const [activePin, setActivePin] = useState<{ pin: number; label: string; desc: string } | null>(null);

  if (!hardware) return null;

  // Find corresponding IC in the library if available
  const primaryIcNumber = hardware.icNumbers[0] || '7408';
  const icData: ICComponent | undefined = ics.find(
    i => i.icNumber.includes(primaryIcNumber) || i.id.includes(primaryIcNumber.replace(/\D/g, ''))
  );

  return (
    <section id="section-hardware" className="scroll-mt-24 space-y-8">
      <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-sm">
          G
        </div>
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            Real Hardware Breadboard Implementation
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Datasheet-verified pinout, exact wiring instructions, power limits, and troubleshooting.
          </p>
        </div>
      </div>

      {/* Bill of Materials (Required Components) */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-200">
            <Layers className="w-4 h-4 text-blue-500" />
            <span>Required Components (Bill of Materials)</span>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            Standard Laboratory Kit
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {hardware.requiredComponents.map((comp, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs"
            >
              <div>
                <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                  {comp.name}
                </span>
                {comp.spec && (
                  <span className="text-[11px] text-slate-400">{comp.spec}</span>
                )}
              </div>
              <span className="font-mono font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300">
                ×{comp.quantity}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive DIP IC Pinout Diagram */}
      {icData && (
        <div className="p-6 rounded-2xl bg-slate-900 text-white border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-400 font-mono">
                  IC {icData.icNumber} Pinout Diagram ({icData.pinCount}-Pin DIP)
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-1">{icData.name}</p>
            </div>
            <div className="text-xs font-mono text-slate-400">
              Supply: <span className="text-cyan-300 font-bold">{icData.supplyVoltageRange}</span>
            </div>
          </div>

          {/* DIP Package Visualizer */}
          <div className="py-4 flex flex-col items-center justify-center">
            {/* Active Pin Info Card */}
            <div className="h-10 mb-3 text-center">
              {activePin ? (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950 border border-cyan-800 text-xs font-mono text-cyan-300 animate-in fade-in">
                  <span className="font-bold">Pin {activePin.pin} ({activePin.label}):</span>
                  <span>{activePin.desc}</span>
                </div>
              ) : (
                <span className="text-xs text-slate-500 font-mono">
                  Hover or tap any pin to inspect its hardware connection
                </span>
              )}
            </div>

            {/* Chip Body */}
            <div className="relative bg-slate-950 border-2 border-slate-700 rounded-lg p-6 shadow-2xl flex items-center justify-between w-full max-w-lg min-h-[220px]">
              {/* Notch */}
              <div className="absolute left-[-10px] top-1/2 -translate-y-1/2 w-5 h-8 bg-slate-900 border-2 border-slate-700 rounded-r-full" />

              {/* Left Column Pins (1 to 7 or 1 to 8) */}
              <div className="space-y-2">
                {icData.pins.slice(0, icData.pinCount / 2).map(pin => (
                  <div
                    key={pin.pin}
                    onMouseEnter={() => setActivePin(pin)}
                    onMouseLeave={() => setActivePin(null)}
                    className="flex items-center gap-2 cursor-pointer group"
                  >
                    <div className="w-6 h-3 bg-slate-400 rounded-l group-hover:bg-cyan-400 transition-colors" />
                    <span className="font-mono text-xs w-6 text-slate-400 font-bold">
                      {pin.pin}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-semibold transition-all ${
                      pin.type === 'vcc'
                        ? 'bg-rose-950 text-rose-300 border border-rose-800'
                        : pin.type === 'gnd'
                        ? 'bg-blue-950 text-blue-300 border border-blue-800'
                        : pin.type === 'output'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : 'bg-slate-800 text-slate-300 group-hover:bg-cyan-900 group-hover:text-cyan-200'
                    }`}>
                      {pin.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Center Part Number */}
              <div className="text-center font-mono select-none px-4">
                <div className="text-xs tracking-widest text-slate-500">TEXAS INST</div>
                <div className="text-base font-extrabold text-slate-300 tracking-wider">
                  SN{primaryIcNumber.replace(/\D/g, '')}N
                </div>
                <div className="text-[10px] text-slate-600 mt-1">DIP-{icData.pinCount}</div>
              </div>

              {/* Right Column Pins (14 to 8 or 16 to 9) */}
              <div className="space-y-2">
                {icData.pins.slice(icData.pinCount / 2).reverse().map(pin => (
                  <div
                    key={pin.pin}
                    onMouseEnter={() => setActivePin(pin)}
                    onMouseLeave={() => setActivePin(null)}
                    className="flex items-center justify-end gap-2 cursor-pointer group"
                  >
                    <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-semibold transition-all ${
                      pin.type === 'vcc'
                        ? 'bg-rose-950 text-rose-300 border border-rose-800'
                        : pin.type === 'gnd'
                        ? 'bg-blue-950 text-blue-300 border border-blue-800'
                        : pin.type === 'output'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : 'bg-slate-800 text-slate-300 group-hover:bg-cyan-900 group-hover:text-cyan-200'
                    }`}>
                      {pin.label}
                    </span>
                    <span className="font-mono text-xs w-6 text-slate-400 font-bold text-right">
                      {pin.pin}
                    </span>
                    <div className="w-6 h-3 bg-slate-400 rounded-r group-hover:bg-cyan-400 transition-colors" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Power Supply & Decoupling Requirements */}
      <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 space-y-3">
        <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-bold text-sm">
          <Zap className="w-4 h-4" />
          <span>Electrical Specifications: 5V TTL vs. 3.3V CMOS</span>
        </div>
        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          {hardware.powerConsiderations}
        </p>
        <div className="flex items-center gap-2 text-xs font-mono text-amber-800 dark:text-amber-300 pt-1">
          <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
          <span>Supply Voltage Standard: {hardware.supplyVoltage}</span>
        </div>
      </div>

      {/* Exact Pin-to-Pin Interconnection Matrix */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
          Exact Breadboard Pin Connections
        </h3>
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-500">
                <th className="py-2.5 px-4 font-semibold">Origin Terminal</th>
                <th className="py-2.5 px-4 font-semibold text-center w-10">→</th>
                <th className="py-2.5 px-4 font-semibold">Destination Terminal</th>
                <th className="py-2.5 px-4 font-semibold">Circuit Function / Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {hardware.exactPinConnections.map((conn, idx) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-2.5 px-4 font-bold text-blue-600 dark:text-blue-400">
                    {conn.from}
                  </td>
                  <td className="py-2.5 px-4 text-center text-slate-400">→</td>
                  <td className="py-2.5 px-4 font-bold text-cyan-600 dark:text-cyan-400">
                    {conn.to}
                  </td>
                  <td className="py-2.5 px-4 text-slate-600 dark:text-slate-400 font-sans">
                    {conn.note || 'Direct jumper wire'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Step-by-Step Assembly Instructions */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
          <ListOrdered className="w-4 h-4 text-indigo-500" />
          <span>Step-by-Step Breadboard Wiring Procedure</span>
        </h3>
        <div className="space-y-2">
          {hardware.breadboardWiringSteps.map((step, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-700 dark:text-slate-300 flex items-start gap-3"
            >
              <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
              <span>{step}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Testing Protocol & Expected Output */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Testing Protocol
          </h4>
          <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
            {hardware.testingProcedure.map((test, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                <span>{test}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60 shadow-xs space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
            Expected Physical Output
          </h4>
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-mono">
            {hardware.expectedOutput}
          </p>
        </div>
      </div>

      {/* Common Mistakes and Troubleshooting */}
      <div className="p-5 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 space-y-3">
        <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-bold text-sm">
          <AlertTriangle className="w-4 h-4" />
          <span>Common Mistakes & Hardware Troubleshooting Guide</span>
        </div>
        <div className="space-y-2.5">
          {hardware.commonMistakesAndTroubleshooting.map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900/40 text-xs sm:text-sm space-y-1"
            >
              <div className="font-semibold text-rose-600 dark:text-rose-400">
                Issue: {item.mistake}
              </div>
              <div className="text-slate-600 dark:text-slate-300 pl-4 border-l-2 border-emerald-500">
                Fix: {item.solution}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
