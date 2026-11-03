import { Module, Topic, ICComponent, PracticalExperiment, QuizQuestion, UserProgress } from '@/types';
import { INITIAL_MODULES } from '@/data/modules';
import { INITIAL_TOPICS } from '@/data/topics';
import { INITIAL_ICS } from '@/data/ics';
import { INITIAL_EXPERIMENTS } from '@/data/experiments';
import { INITIAL_QUIZZES } from '@/data/quizzes';

const STORAGE_KEYS = {
  MODULES: 'dll_modules_v1',
  TOPICS: 'dll_topics_v1',
  ICS: 'dll_ics_v1',
  EXPERIMENTS: 'dll_experiments_v1',
  QUIZZES: 'dll_quizzes_v1',
  PROGRESS: 'dll_user_progress_v1',
  THEME: 'dll_theme_v1'
};

const DEFAULT_PROGRESS: UserProgress = {
  completedTopics: ['and-gate'],
  bookmarkedTopics: ['karnaugh-map-4-variables'],
  quizScores: {},
  lastVisitedTopic: {
    moduleId: 'module-2',
    topicId: 'topic-and-gate',
    slug: 'and-gate',
    title: 'AND Gate'
  },
  experimentCompletions: []
};

// Safe browser local storage access
function getItem<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.error(`Error reading ${key} from localStorage:`, e);
    return defaultValue;
  }
}

function setItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error writing ${key} to localStorage:`, e);
  }
}

// Data loaders with seed fallback
export function getStoredModules(): Module[] {
  return getItem<Module[]>(STORAGE_KEYS.MODULES, INITIAL_MODULES);
}

export function saveStoredModules(modules: Module[]): void {
  setItem(STORAGE_KEYS.MODULES, modules);
}

export function getStoredTopics(): Topic[] {
  return getItem<Topic[]>(STORAGE_KEYS.TOPICS, INITIAL_TOPICS);
}

export function saveStoredTopics(topics: Topic[]): void {
  setItem(STORAGE_KEYS.TOPICS, topics);
}

export function getStoredICs(): ICComponent[] {
  return getItem<ICComponent[]>(STORAGE_KEYS.ICS, INITIAL_ICS);
}

export function saveStoredICs(ics: ICComponent[]): void {
  setItem(STORAGE_KEYS.ICS, ics);
}

export function getStoredExperiments(): PracticalExperiment[] {
  return getItem<PracticalExperiment[]>(STORAGE_KEYS.EXPERIMENTS, INITIAL_EXPERIMENTS);
}

export function saveStoredExperiments(experiments: PracticalExperiment[]): void {
  setItem(STORAGE_KEYS.EXPERIMENTS, experiments);
}

export function getStoredQuizzes(): QuizQuestion[] {
  return getItem<QuizQuestion[]>(STORAGE_KEYS.QUIZZES, INITIAL_QUIZZES);
}

export function saveStoredQuizzes(quizzes: QuizQuestion[]): void {
  setItem(STORAGE_KEYS.QUIZZES, quizzes);
}

export function getUserProgress(): UserProgress {
  return getItem<UserProgress>(STORAGE_KEYS.PROGRESS, DEFAULT_PROGRESS);
}

export function saveUserProgress(progress: UserProgress): void {
  setItem(STORAGE_KEYS.PROGRESS, progress);
}

// Progress helpers
export function toggleTopicCompletion(slug: string): boolean {
  const progress = getUserProgress();
  const exists = progress.completedTopics.includes(slug);
  const updated = exists
    ? progress.completedTopics.filter(s => s !== slug)
    : [...progress.completedTopics, slug];

  progress.completedTopics = updated;
  saveUserProgress(progress);
  return !exists;
}

export function toggleTopicBookmark(slug: string): boolean {
  const progress = getUserProgress();
  const exists = progress.bookmarkedTopics.includes(slug);
  const updated = exists
    ? progress.bookmarkedTopics.filter(s => s !== slug)
    : [...progress.bookmarkedTopics, slug];

  progress.bookmarkedTopics = updated;
  saveUserProgress(progress);
  return !exists;
}

export function recordQuizAttempt(quizId: string, score: number, total: number): void {
  const progress = getUserProgress();
  progress.quizScores[quizId] = {
    score,
    total,
    date: new Date().toISOString()
  };
  saveUserProgress(progress);
}

export function recordLastVisited(moduleId: string, topicId: string, slug: string, title: string): void {
  const progress = getUserProgress();
  progress.lastVisitedTopic = { moduleId, topicId, slug, title };
  saveUserProgress(progress);
}

export function toggleExperimentCompletion(expId: string): boolean {
  const progress = getUserProgress();
  const exists = progress.experimentCompletions.includes(expId);
  const updated = exists
    ? progress.experimentCompletions.filter(id => id !== expId)
    : [...progress.experimentCompletions, expId];
  progress.experimentCompletions = updated;
  saveUserProgress(progress);
  return !exists;
}

// Reset and Backup/Restore
export function resetPlatformToFactoryDefaults(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEYS.MODULES);
  localStorage.removeItem(STORAGE_KEYS.TOPICS);
  localStorage.removeItem(STORAGE_KEYS.ICS);
  localStorage.removeItem(STORAGE_KEYS.EXPERIMENTS);
  localStorage.removeItem(STORAGE_KEYS.QUIZZES);
  localStorage.removeItem(STORAGE_KEYS.PROGRESS);
}

export function exportAllDataPackage(): string {
  const exportData = {
    modules: getStoredModules(),
    topics: getStoredTopics(),
    ics: getStoredICs(),
    experiments: getStoredExperiments(),
    quizzes: getStoredQuizzes(),
    timestamp: new Date().toISOString(),
    version: '1.0'
  };
  return JSON.stringify(exportData, null, 2);
}

export function importDataPackage(jsonString: string): { success: boolean; message: string } {
  try {
    const data = JSON.parse(jsonString);
    if (!data.modules || !data.topics) {
      return { success: false, message: 'Invalid data package format.' };
    }
    if (data.modules) saveStoredModules(data.modules);
    if (data.topics) saveStoredTopics(data.topics);
    if (data.ics) saveStoredICs(data.ics);
    if (data.experiments) saveStoredExperiments(data.experiments);
    if (data.quizzes) saveStoredQuizzes(data.quizzes);
    return { success: true, message: 'Data imported successfully!' };
  } catch (err: any) {
    return { success: false, message: `Failed to import JSON: ${err.message}` };
  }
}
