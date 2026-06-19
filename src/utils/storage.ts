import type { Flashcard, ExamResult } from '../types';

const STORAGE_KEYS = {
  CARDS: 'lingo-cards',
  PROGRESS: 'lingo-progress',
  EXAM_RESULTS: 'lingo-exam-results',
  THEME: 'language-theme',
} as const;

interface Progress {
  unlocked_en: number;
  unlocked_ja: number;
}

export function loadCards(): Flashcard[] | null {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CARDS);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function saveCards(cards: Flashcard[]): void {
  localStorage.setItem(STORAGE_KEYS.CARDS, JSON.stringify(cards));
}

export function loadProgress(): Progress {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PROGRESS);
    return data ? JSON.parse(data) : { unlocked_en: 0, unlocked_ja: 0 };
  } catch {
    return { unlocked_en: 0, unlocked_ja: 0 };
  }
}

export function saveProgress(progress: Progress): void {
  localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progress));
}

export function loadExamResults(): ExamResult[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.EXAM_RESULTS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveExamResults(results: ExamResult[]): void {
  localStorage.setItem(STORAGE_KEYS.EXAM_RESULTS, JSON.stringify(results));
}

export function loadTheme(): 'light' | 'dark' {
  return (localStorage.getItem(STORAGE_KEYS.THEME) as 'light' | 'dark') || 'light';
}

export function saveTheme(theme: 'light' | 'dark'): void {
  localStorage.setItem(STORAGE_KEYS.THEME, theme);
}
