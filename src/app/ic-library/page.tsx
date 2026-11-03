'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { ICComponent } from '@/types';
import {
  Library,
  Search,
  Cpu,
  Zap,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Info,
  Layers,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export default function IcLibraryPage() {
  const { ics } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [familyFilter, setFamilyFilter] = useState<string>('All');
  const [expandedIcId, setExpandedIcId] = useState<string | null>(ics[0]?.id || null);
  const [hoveredPin, setHoveredPin] = useState<{ pin: number; label: string; desc: string } | null>(null);

  const filteredIcs = ics.filter(ic => {
    const matchesSearch = ic.icNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          ic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          ic.functionDescription.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFamily = familyFilter === 'All' || ic.family === familyFilter;
    return matchesSearch && matchesFamily;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
      {/* Page Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400 text-xs font-mono">
          <Library className="w-3.5 h-3.5" />
          <span>Datasheet-Verified Hardware Component Database</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Digital Integrated Circuit (IC) Library
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
          Comprehensive reference guide for standard TTL (74LSxx), High-Speed CMOS (74HCxx), and 4000-series integrated circuits. Includes verified DIP pin configurations, voltage tolerances, propagation delays, and breadboard interfacing guidelines.
        </p>
      </div>

      {/* Search & Filter Controls */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search IC (e.g. 7408, 7400, 7447, 4511)..."
            className="w-full pl-10 pr-4 py-2 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:border-cyan-500"
          />
        </div>

        {/* Family Filters */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          {['All', '74xx TTL', '74HC CMOS', '4000 CMOS'].map(fam => (
            <button
              key={fam}
              onClick={() => setFamilyFilter(fam)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                familyFilter === fam
                  ? 'bg-cyan-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {fam}
            </button>
          ))}
        </div>
      </div>

      {/* IC Cards List */}
      <div className="space-y-6">
        {filteredIcs.map(ic => {
          const isExpanded = expandedIcId === ic.id;

          return (
            <div
              key={ic.id}
              id={ic.id}
              className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-all"
            >
              {/* Header Bar */}
              <div
                onClick={() => setExpandedIcId(isExpanded ? null : ic.id)}
                className="p-6 cursor-pointer flex items-center justify-between gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-850/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-50 dark:bg-cyan-950/80 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-bold text-base font-mono border border-cyan-200 dark:border-cyan-900 shrink-0">
                    {ic.icNumber.split('/')[0].trim()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                        {ic.icNumber} — {ic.name}
                      </h2>
                      <span className="text-[10px] uppercase font-semibold font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        {ic.family}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300">
                        DIP-{ic.pinCount}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                      {ic.functionDescription}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs text-slate-400 font-mono hidden md:inline">
                    {ic.supplyVoltageRange}
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  )}
                </div>
              </div>

              {/* Expanded Detailed Content */}
              {isExpanded && (
                <div className="p-6 pt-0 border-t border-slate-100 dark:border-slate-800 space-y-6">
                  {/* Detailed Description */}
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed pt-4">
                    {ic.functionDescription}
                  </p>

                  {/* Electrical Specs Bar */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                      <span className="text-slate-400 block text-[10px] uppercase">Supply Voltage (Vcc/Vdd)</span>
                      <span className="font-bold text-cyan-600 dark:text-cyan-400 text-sm">{ic.supplyVoltageRange}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                      <span className="text-slate-400 block text-[10px] uppercase">Propagation Delay</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">{ic.propagationDelay}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                      <span className="text-slate-400 block text-[10px] uppercase">Fan-Out Capability</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">{ic.fanOut}</span>
                    </div>
                  </div>

                  {/* Interactive DIP Pin Diagram Visualizer */}
                  <div className="p-6 rounded-2xl bg-slate-950 text-white border border-slate-800 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Cpu className="w-4 h-4 text-cyan-400" />
                        <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono">
                          DIP-{ic.pinCount} Pinout Schematic
                        </h4>
                      </div>
                      {hoveredPin ? (
                        <span className="text-xs font-mono text-cyan-300">
                          Pin {hoveredPin.pin} ({hoveredPin.label}): {hoveredPin.desc}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-500 font-mono">
                          Hover pin to view exact terminal function
                        </span>
                      )}
                    </div>

                    {/* Dual In-line Package Rendering */}
                    <div className="relative border-2 border-slate-700 bg-slate-900 rounded-lg p-6 flex items-center justify-between max-w-xl mx-auto min-h-[220px]">
                      {/* Notch */}
                      <div className="absolute left-[-10px] top-1/2 -translate-y-1/2 w-5 h-8 bg-slate-950 border-2 border-slate-700 rounded-r-full" />

                      {/* Left Pins (1 to N/2) */}
                      <div className="space-y-2">
                        {ic.pins.slice(0, ic.pinCount / 2).map(pin => (
                          <div
                            key={pin.pin}
                            onMouseEnter={() => setHoveredPin(pin)}
                            onMouseLeave={() => setHoveredPin(null)}
                            className="flex items-center gap-2 cursor-pointer group"
                          >
                            <div className="w-5 h-3 bg-slate-500 rounded-l group-hover:bg-cyan-400" />
                            <span className="font-mono text-xs w-5 text-slate-400">{pin.pin}</span>
                            <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-semibold ${
                              pin.type === 'vcc' ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                              pin.type === 'gnd' ? 'bg-blue-950 text-blue-300 border border-blue-800' :
                              pin.type === 'output' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                              'bg-slate-800 text-slate-300'
                            }`}>
                              {pin.label}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* IC Branding in Center */}
                      <div className="text-center font-mono select-none px-4">
                        <div className="text-xs tracking-widest text-slate-500">TEXAS INSTRUMENTS</div>
                        <div className="text-base font-extrabold text-white mt-1">
                          {ic.icNumber.split('/')[0].trim()}
                        </div>
                        <div className="text-[10px] text-slate-600">DUAL IN-LINE PACKAGE</div>
                      </div>

                      {/* Right Pins (N down to N/2 + 1) */}
                      <div className="space-y-2">
                        {ic.pins.slice(ic.pinCount / 2).reverse().map(pin => (
                          <div
                            key={pin.pin}
                            onMouseEnter={() => setHoveredPin(pin)}
                            onMouseLeave={() => setHoveredPin(null)}
                            className="flex items-center justify-end gap-2 cursor-pointer group"
                          >
                            <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-semibold ${
                              pin.type === 'vcc' ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                              pin.type === 'gnd' ? 'bg-blue-950 text-blue-300 border border-blue-800' :
                              pin.type === 'output' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                              'bg-slate-800 text-slate-300'
                            }`}>
                              {pin.label}
                            </span>
                            <span className="font-mono text-xs w-5 text-slate-400 text-right">{pin.pin}</span>
                            <div className="w-5 h-3 bg-slate-500 rounded-r group-hover:bg-cyan-400" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Breadboard Tips & Typical Applications Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                      <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-500" />
                        <span>Breadboard Wiring Guidelines & Pitfalls</span>
                      </div>
                      <ul className="space-y-1.5 text-slate-600 dark:text-slate-400">
                        {ic.breadboardTips.map((tip, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                      <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                        <Layers className="w-4 h-4 text-cyan-500" />
                        <span>Typical Digital Engineering Applications</span>
                      </div>
                      <ul className="space-y-1.5 text-slate-600 dark:text-slate-400">
                        {ic.typicalApplications.map((app, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-1.5 shrink-0" />
                            <span>{app}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Datasheet Link */}
                  {ic.datasheetUrl && (
                    <div className="pt-2 flex justify-end">
                      <a
                        href={ic.datasheetUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors"
                      >
                        <span>Official Manufacturer Datasheet (PDF)</span>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
