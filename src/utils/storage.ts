import { db } from '../data/db';
import { useUserStore } from '../stores/useUserStore';

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
    streak: userState.streak,
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

export async function importData(file: File): Promise<void> {
  const text = await file.text();
  const data = JSON.parse(text);

  if (data.cards) await db.cards.bulkPut(data.cards);
  if (data.examResults) await db.examResults.bulkPut(data.examResults);
  if (data.mistakes) await db.mistakes.bulkPut(data.mistakes);
  if (data.customExams) await db.customExams.bulkPut(data.customExams);
  if (data.progress) {
    const s = useUserStore.getState();
    s.setProgress(
      data.progress.unlocked_en || s.unlockedEn,
      data.progress.unlocked_ja || s.unlockedJa,
      data.progress.streak || s.streak
    );
  }
}
