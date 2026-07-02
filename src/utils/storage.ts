import { db } from '../data/db';
import { useUserStore } from '../stores/useUserStore';
import { validateImportSchema } from './sanitize';
import type { Flashcard, Mistake, ExamResult, FullExam } from '../types';

export async function exportData(): Promise<void> {
  const [cards, examResults, mistakes, customExams] = await Promise.all([
    db.cards.toArray(),
    db.examResults.toArray(),
    db.mistakes.toArray(),
    db.customExams.toArray(),
  ]);

  const userState = useUserStore.getState();
  const progress = {
    unlocked_en: userState.unlockedEn,
    unlocked_ja: userState.unlockedJa,
  };

  const data = { cards, examResults, mistakes, customExams, progress };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `lingo-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export async function importData(file: File): Promise<boolean> {
  try {
    const text = await file.text();
    const data = JSON.parse(text);

    if (!validateImportSchema(data)) {
      return false;
    }

    if (data.cards?.length) await db.cards.bulkPut(data.cards as Flashcard[]);
    if (data.examResults?.length) await db.examResults.bulkPut(data.examResults as ExamResult[]);
    if (data.mistakes?.length) await db.mistakes.bulkPut(data.mistakes as Mistake[]);
    if (data.customExams?.length) await db.customExams.bulkPut(data.customExams as FullExam[]);
    if (data.userPrefs) {
      const s = useUserStore.getState();
      s.setProgress(
        data.userPrefs.unlockedEn || s.unlockedEn,
        data.userPrefs.unlockedJa || s.unlockedJa
      );
    }
    return true;
  } catch {
    return false;
  }
}
