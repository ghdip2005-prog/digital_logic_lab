'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { useApp } from '@/context/AppContext';
import { recordQuizAttempt } from '@/lib/storage';
import {
  HelpCircle,
  Award,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Filter,
  BarChart,
  Layers
} from 'lucide-react';

export default function QuizHubPage() {
  const { quizzes, modules, progress, refreshData } = useApp();
  const [selectedModule, setSelectedModule] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  
  // Quiz active state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{ [qId: string]: number }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Filter questions
  const filteredQuestions = quizzes.filter(q => {
    const matchesMod = selectedModule === 'All' || q.moduleId === selectedModule;
    const matchesDiff = selectedDifficulty === 'All' || q.difficulty === selectedDifficulty;
    return matchesMod && matchesDiff;
  });

  const activeQuestion = filteredQuestions[currentQuestionIndex];

  const handleSelectAnswer = (qId: string, optIndex: number) => {
    if (isSubmitted) return;
    setUserAnswers(prev => ({ ...prev, [qId]: optIndex }));
  };

  const handleFinishQuiz = () => {
    setIsSubmitted(true);
    // Calculate score
    let correctCount = 0;
    filteredQuestions.forEach(q => {
      if (userAnswers[q.id] === q.correctAnswer) {
        correctCount++;
      }
    });

    const quizId = `${selectedModule}_${Date.now()}`;
    recordQuizAttempt(quizId, correctCount, filteredQuestions.length);
    refreshData();

    // Trigger celebration if high score
    if (correctCount >= filteredQuestions.length * 0.8) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // Confetti fallback
      }
    }
  };

  const handleResetQuiz = () => {
    setUserAnswers({});
    setIsSubmitted(false);
    setCurrentQuestionIndex(0);
  };

  // Score stats
  let totalScore = 0;
  if (isSubmitted) {
    filteredQuestions.forEach(q => {
      if (userAnswers[q.id] === q.correctAnswer) totalScore++;
    });
  }

  const answeredCount = Object.keys(userAnswers).length;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
      {/* Quiz Header */}
      <div className="space-y-2 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-mono">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Self-Assessment & Mastery Testing</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Digital Logic Practice & Quizzes
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          Evaluate your understanding across all course modules with questions designed to prepare you for university exams, laboratory vivas, and engineering assessments.
        </p>
      </div>

      {/* Filter Selector Strip */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-4">
        {/* Module Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase text-slate-400">Module:</span>
          <select
            value={selectedModule}
            onChange={e => {
              setSelectedModule(e.target.value);
              handleResetQuiz();
            }}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-hidden"
          >
            <option value="All">All Modules (Comprehensive)</option>
            {modules.map(m => (
              <option key={m.id} value={m.id}>
                {m.title}
              </option>
            ))}
          </select>
        </div>

        {/* Difficulty Filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-semibold uppercase text-slate-400 mr-1">Difficulty:</span>
          {['All', 'Beginner', 'Intermediate', 'Advanced'].map(diff => (
            <button
              key={diff}
              onClick={() => {
                setSelectedDifficulty(diff);
                handleResetQuiz();
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedDifficulty === diff
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {/* Main Quiz Card */}
      {filteredQuestions.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
          <p className="text-slate-500 text-sm">No questions match the current filter selection.</p>
          <button
            onClick={() => { setSelectedModule('All'); setSelectedDifficulty('All'); }}
            className="text-xs text-blue-600 dark:text-cyan-400 font-semibold hover:underline"
          >
            Reset Filters
          </button>
        </div>
      ) : !isSubmitted ? (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
          {/* Progress Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <span className="text-xs font-mono font-bold text-slate-400">
              Question {currentQuestionIndex + 1} of {filteredQuestions.length}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                {activeQuestion?.difficulty}
              </span>
              <span className="text-xs font-mono text-slate-400">
                {answeredCount} / {filteredQuestions.length} Answered
              </span>
            </div>
          </div>

          {/* Question Text */}
          <div className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
              {activeQuestion?.question}
            </h2>
          </div>

          {/* Multiple Choice Options */}
          <div className="space-y-3">
            {activeQuestion?.options.map((opt, oIdx) => {
              const isSelected = userAnswers[activeQuestion.id] === oIdx;

              return (
                <div
                  key={oIdx}
                  onClick={() => handleSelectAnswer(activeQuestion.id, oIdx)}
                  className={`p-4 rounded-2xl border text-sm flex items-center gap-3 cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-500 text-rose-900 dark:text-rose-200 font-semibold shadow-xs'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs font-mono font-bold shrink-0 ${
                    isSelected ? 'border-rose-500 bg-rose-500 text-white' : 'border-slate-300 dark:border-slate-700 text-slate-500'
                  }`}>
                    {String.fromCharCode(65 + oIdx)}
                  </span>
                  <span>{opt}</span>
                </div>
              );
            })}
          </div>

          {/* Navigation & Submit Bar */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4">
            <button
              disabled={currentQuestionIndex === 0}
              onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-200 cursor-pointer"
            >
              Previous
            </button>

            {currentQuestionIndex < filteredQuestions.length - 1 ? (
              <button
                onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <span>Next Question</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={handleFinishQuiz}
                className="px-6 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-sm cursor-pointer flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Submit Final Answers</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Quiz Score & Review View */
        <div className="space-y-6">
          {/* Result Card */}
          <div className="p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white border border-indigo-900/60 shadow-xl text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-indigo-400 flex items-center justify-center mx-auto">
              <Award className="w-8 h-8" />
            </div>

            <h2 className="text-2xl font-extrabold tracking-tight">Quiz Completed!</h2>

            <div className="text-4xl font-extrabold font-mono text-cyan-400">
              {totalScore} / {filteredQuestions.length}
            </div>

            <p className="text-sm text-slate-300 max-w-md mx-auto">
              You scored {Math.round((totalScore / filteredQuestions.length) * 100)}%. Review the step-by-step explanations below to solidify your understanding.
            </p>

            <button
              onClick={handleResetQuiz}
              className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-slate-900 text-xs font-bold hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retake Quiz</span>
            </button>
          </div>

          {/* Answer Breakdown with Explanations */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Detailed Question Explanations
            </h3>

            {filteredQuestions.map((q, idx) => {
              const userAns = userAnswers[q.id];
              const isCorrect = userAns === q.correctAnswer;

              return (
                <div
                  key={q.id}
                  className={`p-5 rounded-2xl border bg-white dark:bg-slate-900 space-y-3 ${
                    isCorrect
                      ? 'border-emerald-300 dark:border-emerald-900/60'
                      : 'border-rose-300 dark:border-rose-900/60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="font-semibold text-sm text-slate-900 dark:text-white">
                      {idx + 1}. {q.question}
                    </span>
                    <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full ${
                      isCorrect ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600' : 'bg-rose-100 dark:bg-rose-950 text-rose-600'
                    }`}>
                      {isCorrect ? 'Correct ✓' : 'Incorrect ✗'}
                    </span>
                  </div>

                  <div className="text-xs space-y-1 font-mono">
                    <div className="text-slate-500">
                      Your answer: <span className={isCorrect ? 'text-emerald-500 font-bold' : 'text-rose-500 font-bold'}>
                        {userAns !== undefined ? q.options[userAns] : 'Not Answered'}
                      </span>
                    </div>
                    {!isCorrect && (
                      <div className="text-emerald-600 dark:text-emerald-400 font-bold">
                        Correct answer: {q.options[q.correctAnswer]}
                      </div>
                    )}
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
                    <span className="font-bold text-slate-800 dark:text-slate-200 block mb-1">Mathematical Explanation:</span>
                    {q.explanation}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
