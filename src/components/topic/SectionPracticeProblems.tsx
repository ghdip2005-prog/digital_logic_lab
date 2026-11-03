'use client';

import React, { useState } from 'react';
import { PracticeProblem } from '@/types';
import { HelpCircle, CheckCircle2, XCircle, Sparkles, Award } from 'lucide-react';

interface Props {
  problems?: PracticeProblem[];
}

export default function SectionPracticeProblems({ problems }: Props) {
  if (!problems || problems.length === 0) return null;

  const [selectedAnswers, setSelectedAnswers] = useState<{ [id: string]: number }>({});
  const [submitted, setSubmitted] = useState<{ [id: string]: boolean }>({});

  const handleSelectOption = (probId: string, optIdx: number) => {
    if (submitted[probId]) return; // locked after check
    setSelectedAnswers(prev => ({ ...prev, [probId]: optIdx }));
  };

  const handleCheck = (probId: string) => {
    setSubmitted(prev => ({ ...prev, [probId]: true }));
  };

  const handleResetProblem = (probId: string) => {
    setSelectedAnswers(prev => {
      const copy = { ...prev };
      delete copy[probId];
      return copy;
    });
    setSubmitted(prev => {
      const copy = { ...prev };
      delete copy[probId];
      return copy;
    });
  };

  return (
    <section id="section-practice" className="scroll-mt-24 space-y-6">
      <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold text-sm">
            H
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Practice Problems & Interactive Exercises
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Test your theoretical and practical comprehension with instant feedback.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {problems.map((prob, idx) => {
          const selected = selectedAnswers[prob.id];
          const isSubmitted = submitted[prob.id];
          const isCorrect = selected === prob.correctAnswer;

          return (
            <div
              key={prob.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
                    Q{idx + 1}
                  </span>
                  <h3 className="font-semibold text-sm sm:text-base text-slate-900 dark:text-white">
                    {prob.question}
                  </h3>
                </div>

                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 shrink-0">
                  {prob.difficulty}
                </span>
              </div>

              {/* Options */}
              {prob.options && (
                <div className="space-y-2 pl-8">
                  {prob.options.map((option, optIdx) => {
                    const isOptionSelected = selected === optIdx;
                    const isOptionCorrect = optIdx === prob.correctAnswer;

                    let optionStyle = 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300';

                    if (isSubmitted) {
                      if (isOptionCorrect) {
                        optionStyle = 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-800 dark:text-emerald-300 font-semibold';
                      } else if (isOptionSelected && !isOptionCorrect) {
                        optionStyle = 'bg-rose-50 dark:bg-rose-950/60 border-rose-500 text-rose-800 dark:text-rose-300';
                      } else {
                        optionStyle = 'opacity-50 border-slate-200 dark:border-slate-800';
                      }
                    } else if (isOptionSelected) {
                      optionStyle = 'bg-blue-50 dark:bg-blue-950/60 border-blue-500 text-blue-800 dark:text-blue-300 font-semibold';
                    }

                    return (
                      <div
                        key={optIdx}
                        onClick={() => handleSelectOption(prob.id, optIdx)}
                        className={`p-3 rounded-xl border text-xs sm:text-sm flex items-center justify-between cursor-pointer transition-colors ${optionStyle}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px] font-mono">
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span>{option}</span>
                        </div>

                        {isSubmitted && isOptionCorrect && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        )}
                        {isSubmitted && isOptionSelected && !isOptionCorrect && (
                          <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Actions & Feedback */}
              <div className="pl-8 pt-1 flex items-center justify-between gap-3 flex-wrap">
                {!isSubmitted ? (
                  <button
                    disabled={selected === undefined}
                    onClick={() => handleCheck(prob.id)}
                    className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shadow-xs"
                  >
                    Check Answer
                  </button>
                ) : (
                  <button
                    onClick={() => handleResetProblem(prob.id)}
                    className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 underline cursor-pointer"
                  >
                    Try Again
                  </button>
                )}

                {isSubmitted && (
                  <div className={`text-xs font-semibold flex items-center gap-1.5 ${
                    isCorrect ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                  }`}>
                    {isCorrect ? (
                      <>
                        <Award className="w-4 h-4" />
                        <span>Correct! Great job.</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4" />
                        <span>Incorrect. Review explanation below.</span>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Explanation Reveal */}
              {isSubmitted && (
                <div className="ml-8 p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-1.5 animate-in fade-in">
                  <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Explanation:</span>
                  </div>
                  <p className="leading-relaxed">{prob.explanation}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
