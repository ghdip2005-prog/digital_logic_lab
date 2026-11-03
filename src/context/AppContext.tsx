'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Module, Topic, ICComponent, PracticalExperiment, QuizQuestion, UserProgress } from '@/types';
import {
  getStoredModules,
  saveStoredModules,
  getStoredTopics,
  saveStoredTopics,
  getStoredICs,
  saveStoredICs,
  getStoredExperiments,
  saveStoredExperiments,
  getStoredQuizzes,
  getUserProgress,
  toggleTopicCompletion as storageToggleCompletion,
  toggleTopicBookmark as storageToggleBookmark,
  recordLastVisited as storageRecordLastVisited,
  resetPlatformToFactoryDefaults as storageResetFactory
} from '@/lib/storage';

interface AppContextType {
  modules: Module[];
  topics: Topic[];
  ics: ICComponent[];
  experiments: PracticalExperiment[];
  quizzes: QuizQuestion[];
  progress: UserProgress;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  toggleCompletion: (topicSlug: string) => void;
  toggleBookmark: (topicSlug: string) => void;
  recordVisit: (moduleId: string, topicId: string, slug: string, title: string) => void;
  saveTopic: (topic: Topic) => void;
  deleteTopic: (topicId: string) => void;
  saveModule: (module: Module) => void;
  deleteModule: (moduleId: string) => void;
  resetAllData: () => void;
  refreshData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [modules, setModules] = useState<Module[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [ics, setIcs] = useState<ICComponent[]>([]);
  const [experiments, setExperiments] = useState<PracticalExperiment[]>([]);
  const [quizzes, setQuizzes] = useState<QuizQuestion[]>([]);
  const [progress, setProgress] = useState<UserProgress>({
    completedTopics: [],
    bookmarkedTopics: [],
    quizScores: {},
    experimentCompletions: []
  });
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Initialize data on client load
  const loadPlatformData = () => {
    setModules(getStoredModules());
    setTopics(getStoredTopics());
    setIcs(getStoredICs());
    setExperiments(getStoredExperiments());
    setQuizzes(getStoredQuizzes());
    setProgress(getUserProgress());

    // Theme initialization
    const savedTheme = localStorage.getItem('dll_theme_v1') as 'dark' | 'light' | null;
    const initialTheme = savedTheme || 'dark';
    setTheme(initialTheme);
    if (initialTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  useEffect(() => {
    loadPlatformData();
    setMounted(true);

    // Global keyboard shortcut for search (Ctrl+K or Cmd+K)
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('dll_theme_v1', nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const toggleCompletion = (slug: string) => {
    storageToggleCompletion(slug);
    setProgress(getUserProgress());
  };

  const toggleBookmark = (slug: string) => {
    storageToggleBookmark(slug);
    setProgress(getUserProgress());
  };

  const recordVisit = (moduleId: string, topicId: string, slug: string, title: string) => {
    storageRecordLastVisited(moduleId, topicId, slug, title);
    setProgress(getUserProgress());
  };

  const saveTopic = (newOrUpdated: Topic) => {
    const current = getStoredTopics();
    const existingIndex = current.findIndex(t => t.id === newOrUpdated.id);
    let updated: Topic[];
    if (existingIndex >= 0) {
      updated = [...current];
      updated[existingIndex] = newOrUpdated;
    } else {
      updated = [...current, newOrUpdated];
    }
    saveStoredTopics(updated);
    setTopics(updated);
  };

  const deleteTopic = (topicId: string) => {
    const current = getStoredTopics();
    const updated = current.filter(t => t.id !== topicId);
    saveStoredTopics(updated);
    setTopics(updated);
  };

  const saveModule = (newOrUpdated: Module) => {
    const current = getStoredModules();
    const existingIndex = current.findIndex(m => m.id === newOrUpdated.id);
    let updated: Module[];
    if (existingIndex >= 0) {
      updated = [...current];
      updated[existingIndex] = newOrUpdated;
    } else {
      updated = [...current, newOrUpdated];
    }
    saveStoredModules(updated);
    setModules(updated);
  };

  const deleteModule = (moduleId: string) => {
    const current = getStoredModules();
    const updated = current.filter(m => m.id !== moduleId);
    saveStoredModules(updated);
    setModules(updated);
  };

  const resetAllData = () => {
    storageResetFactory();
    loadPlatformData();
  };

  const refreshData = () => {
    loadPlatformData();
  };

  if (!mounted) {
    return null; // Prevent hydration mismatch
  }

  return (
    <AppContext.Provider
      value={{
        modules,
        topics,
        ics,
        experiments,
        quizzes,
        progress,
        theme,
        toggleTheme,
        isSearchOpen,
        setIsSearchOpen,
        toggleCompletion,
        toggleBookmark,
        recordVisit,
        saveTopic,
        deleteTopic,
        saveModule,
        deleteModule,
        resetAllData,
        refreshData
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
