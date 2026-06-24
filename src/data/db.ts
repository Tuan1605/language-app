import Dexie, { type EntityTable } from 'dexie';
import type { Flashcard, Mistake, ExamResult, FullExam, Question, GrammarPoint, KanjiEntry } from '../types';

export const db = new Dexie('LingoDB') as Dexie & {
  cards: EntityTable<Flashcard, 'id'>;
  mistakes: EntityTable<Mistake, 'id'>;
  examResults: EntityTable<ExamResult, 'id'>;
  customExams: EntityTable<FullExam, 'id'>;
  questions: EntityTable<Question, 'id'>;
  grammar: EntityTable<GrammarPoint & { track: 'toeic' | 'n2' }, 'id'>;
  kanji: EntityTable<KanjiEntry, 'id'>;
  meta: EntityTable<{ id: string; value: boolean }, 'id'>;
};

db.version(1).stores({
  cards: 'id, language, category, status, next_review, created_at, [language+word]',
  mistakes: 'id, type, timestamp',
  examResults: 'id, date, category',
  customExams: 'id',
  questions: 'id, category',
  grammar: 'id, track',
  kanji: 'id',
  meta: 'id'
});
