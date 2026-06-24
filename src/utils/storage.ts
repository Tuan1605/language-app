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
  streak?: number;
  lastActiveDate?: string;
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
    return data ? JSON.parse(data) : { unlocked_en: 0, unlocked_ja: 0, streak: 0, lastActiveDate: '' };
  } catch {
    return { unlocked_en: 0, unlocked_ja: 0, streak: 0, lastActiveDate: '' };
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

export function loadMistakes(): any[] {
  try {
    const data = localStorage.getItem('lingo-mistakes');
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveMistakes(mistakes: any[]): void {
  localStorage.setItem('lingo-mistakes', JSON.stringify(mistakes));
}

export function exportData(): void {
  const data = {
    cards: loadCards() || [],
    progress: loadProgress(),
    examResults: loadExamResults(),
    mistakes: loadMistakes()
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `lingo-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importData(file: File): Promise<void> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (data.cards) saveCards(data.cards);
        if (data.progress) saveProgress(data.progress);
        if (data.examResults) saveExamResults(data.examResults);
        if (data.mistakes) saveMistakes(data.mistakes);
        resolve();
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}
