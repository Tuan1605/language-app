import { describe, it, expect, beforeEach } from 'vitest';
import 'fake-indexeddb/auto';
import { db } from '../data/db';

describe('Storage Utilities', () => {
  beforeEach(async () => {
    await db.cards.clear();
    await db.examResults.clear();
    await db.mistakes.clear();
    await db.customExams.clear();
    await db.questions.clear();
    await db.grammar.clear();
    await db.kanji.clear();
    await db.meta.clear();
  });

  describe('Dexie Database', () => {
    it('should store and retrieve cards', async () => {
      const card = { id: 'test-1', word: 'hello', definition: 'xin chào', user_id: 'guest', language: 'english' as const, category: 'toeic' as const, difficulty: 'beginner' as const, state: 'New' as const, reps: 0, lapses: 0, stability: 0, fsrs_difficulty: 0, next_review: null, created_at: new Date().toISOString() };
      await db.cards.add(card);
      const cards = await db.cards.toArray();
      expect(cards).toHaveLength(1);
      expect(cards[0].word).toBe('hello');
    });

    it('should store and retrieve exam results', async () => {
      const result = { id: 'e1', date: new Date().toISOString(), score: 90, totalQuestions: 100, category: 'toeic' as const, difficulty: 'beginner' as const };
      await db.examResults.add(result);
      const results = await db.examResults.toArray();
      expect(results).toHaveLength(1);
      expect(results[0].score).toBe(90);
    });

    it('should store and retrieve mistakes', async () => {
      const mistake = { id: 'm1', type: 'question' as const, wrongAnswer: 'A', data: { id: 'q1', text: 'test', options: ['A'], correctAnswer: 0, category: 'toeic' as const, difficulty: 'beginner' as const }, timestamp: new Date().toISOString() };
      await db.mistakes.add(mistake);
      const mistakes = await db.mistakes.toArray();
      expect(mistakes).toHaveLength(1);
    });

    it('should store and retrieve grammar', async () => {
      const grammar = { id: 'g1', track: 'n2' as const, pattern: 'test', meaning: 'test meaning', example: 'test example', exampleTranslation: 'test trans', difficulty: 'beginner' as const };
      await db.grammar.add(grammar);
      const items = await db.grammar.where('track').equals('n2').toArray();
      expect(items).toHaveLength(1);
    });
  });
});
