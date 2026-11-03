'use client';

import React, { useState } from 'react';
import {
  NumberBase,
  performConversion,
  ConversionResult
} from '@/lib/logic-engine/converter';
import {
  Binary,
  ArrowRightLeft,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  Info,
  HelpCircle,
  Hash,
  Sigma
} from 'lucide-react';

export default function NumberConverterPage() {
  const [sourceBase, setSourceBase] = useState<NumberBase>('decimal');
  const [targetBase, setTargetBase] = useState<NumberBase>('binary');
  const [inputValue, setInputValue] = useState('25.625');
  const [bitWidth, setBitWidth] = useState<number>(8);
  const [copied, setCopied] = useState(false);

  const result: ConversionResult = performConversion(
    inputValue,
    sourceBase,
    targetBase,
    bitWidth
  );

  const handleSwap = () => {
    setSourceBase(targetBase);
    setTargetBase(sourceBase);
    if (result.outputValue && result.isValid) {
      setInputValue(result.outputValue.replace(/\s+/g, ''));
    }
  };

  const handleCopy = () => {
    if (result.outputValue) {
      navigator.clipboard.writeText(result.outputValue);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const quickExamples = [
    { label: 'Decimal 25.625', val: '25.625', src: 'decimal' as NumberBase, tgt: 'binary' as NumberBase },
    { label: 'Binary 1101.101', val: '1101.101', src: 'binary' as NumberBase, tgt: 'hexadecimal' as NumberBase },
    { label: 'Hex 2F.8', val: '2F.8', src: 'hexadecimal' as NumberBase, tgt: 'decimal' as NumberBase },
    { label: 'BCD 0101 1001', val: '01011001', src: 'bcd' as NumberBase, tgt: 'decimal' as NumberBase },
    { label: 'Gray Code 1110', val: '1110', src: 'gray' as NumberBase, tgt: 'binary' as NumberBase }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
      {/* Page Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-cyan-400 text-xs font-mono">
          <Binary className="w-3.5 h-3.5" />
          <span>Interactive Computational Tool</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Number System & Codes Converter
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
          Convert seamlessly between Decimal, Binary, Octal, Hexadecimal, BCD, and Gray Code with complete step-by-step mathematical derivations, fractional radix conversion, and 1&apos;s / 2&apos;s complement calculation.
        </p>
      </div>

      {/* Main Converter Card */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
        {/* Base Selectors & Swap Button */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
          {/* Source Base */}
          <div className="md:col-span-2 space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Source Base / Code
            </label>
            <select
              value={sourceBase}
              onChange={e => setSourceBase(e.target.value as NumberBase)}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-semibold text-slate-900 dark:text-white text-sm focus:outline-hidden focus:border-blue-500"
            >
              <option value="decimal">Decimal (Base 10)</option>
              <option value="binary">Binary (Base 2)</option>
              <option value="octal">Octal (Base 8)</option>
              <option value="hexadecimal">Hexadecimal (Base 16)</option>
              <option value="bcd">BCD (Binary Coded Decimal 8421)</option>
              <option value="gray">Gray Code (Reflected Binary)</option>
            </select>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center md:col-span-1 pt-4 md:pt-6">
            <button
              onClick={handleSwap}
              className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-cyan-400 hover:scale-110 active:scale-95 transition-all shadow-xs cursor-pointer"
              title="Swap source and target bases"
            >
              <ArrowRightLeft className="w-5 h-5" />
            </button>
          </div>

          {/* Target Base */}
          <div className="md:col-span-2 space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Target Base / Code
            </label>
            <select
              value={targetBase}
              onChange={e => setTargetBase(e.target.value as NumberBase)}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-semibold text-slate-900 dark:text-white text-sm focus:outline-hidden focus:border-blue-500"
            >
              <option value="binary">Binary (Base 2)</option>
              <option value="decimal">Decimal (Base 10)</option>
              <option value="octal">Octal (Base 8)</option>
              <option value="hexadecimal">Hexadecimal (Base 16)</option>
              <option value="bcd">BCD (Binary Coded Decimal 8421)</option>
              <option value="gray">Gray Code (Reflected Binary)</option>
            </select>
          </div>
        </div>

        {/* Inputs & Outputs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Input Field */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Input Number ({sourceBase.toUpperCase()}):
              </label>
              <button
                onClick={() => setInputValue('')}
                className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                Clear
              </button>
            </div>
            <input
              type="text"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              placeholder="e.g. 25.625, 1101, 2A..."
              className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-lg font-bold text-slate-900 dark:text-white focus:outline-hidden focus:border-blue-500"
            />
            {!result.isValid && (
              <p className="text-xs text-rose-500 font-medium">
                {result.errorMessage}
              </p>
            )}
          </div>

          {/* Output Field */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Converted Output ({targetBase.toUpperCase()}):
              </label>
              {result.outputValue && (
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 text-xs text-blue-600 dark:text-cyan-400 hover:underline cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              )}
            </div>
            <div className="w-full px-4 py-3.5 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-lg font-bold text-blue-600 dark:text-cyan-400 break-all min-h-[56px] flex items-center">
              {result.isValid ? result.outputValue || '0' : '—'}
            </div>
          </div>
        </div>

        {/* Quick Example Presets */}
        <div className="pt-2 flex items-center gap-2 flex-wrap">
          <span className="text-xs text-slate-400">Quick Test Cases:</span>
          {quickExamples.map((ex, idx) => (
            <button
              key={idx}
              onClick={() => {
                setSourceBase(ex.src);
                setTargetBase(ex.tgt);
                setInputValue(ex.val);
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-950/60 hover:text-blue-600 dark:hover:text-cyan-300 text-xs font-mono transition-colors cursor-pointer"
            >
              {ex.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2's Complement Arithmetic Analysis (If Binary/Decimal conversion) */}
      {result.twosComplement && (
        <div className="p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                <Hash className="w-4 h-4" />
                <span>1&apos;s & 2&apos;s Complement Binary Arithmetic</span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Signed number representation in digital processors.
              </p>
            </div>

            {/* Bit width selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-mono">Register Bit Width:</span>
              {[4, 8, 16].map(bits => (
                <button
                  key={bits}
                  onClick={() => setBitWidth(bits)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                    bitWidth === bits
                      ? 'bg-cyan-500 text-white shadow-xs'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {bits}-bit
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-500 uppercase tracking-wider block font-bold">Unsigned Formatted</span>
              <span className="text-base font-bold text-white block">{result.twosComplement.original}</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-500 uppercase tracking-wider block font-bold">1&apos;s Complement (Bitwise NOT)</span>
              <span className="text-base font-bold text-amber-400 block">{result.twosComplement.onesComp}</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-500 uppercase tracking-wider block font-bold">2&apos;s Complement (+1)</span>
              <span className="text-base font-bold text-emerald-400 block">{result.twosComplement.twosComp}</span>
              <span className="text-[10px] text-slate-400">Signed Value: {result.twosComplement.decimalVal}₁₀</span>
            </div>
          </div>

          <div className="space-y-1.5 pt-2">
            {result.twosComplement.steps.map((st, i) => (
              <div key={i} className="text-xs font-mono text-slate-300">
                {st}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step-by-Step Derivation Breakdown */}
      {result.steps && result.steps.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
            <Sigma className="w-5 h-5 text-blue-500" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Mathematical Step-by-Step Conversion Process
            </h2>
          </div>

          <div className="space-y-3">
            {result.steps.map(step => (
              <div
                key={step.stepNumber}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2 text-xs sm:text-sm"
              >
                <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
                  <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-xs flex items-center justify-center font-mono font-bold">
                    {step.stepNumber}
                  </span>
                  <span>{step.description}</span>
                </div>

                <div className="pl-7">
                  <pre className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-xs text-blue-700 dark:text-cyan-300 whitespace-pre-wrap leading-relaxed">
                    {step.math}
                  </pre>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
