import { db } from './db';
import type { GrammarPoint, KanjiEntry, Flashcard } from '../types';

export interface RawQuestion {
  id: string;
  category: 'toeic' | 'n2';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  subCategory?: string;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

interface RawFlashcard {
  id: string;
  word: string;
  definition: string;
  example?: string;
  exampleTranslation?: string;
  topic?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  phonetic?: string;
  pronunciation?: string;
}

function rawToFlashcard(raw: RawFlashcard, language: 'english' | 'japanese', category: 'toeic' | 'n2'): Flashcard {
  return {
    id: raw.id,
    user_id: 'guest',
    word: raw.word,
    definition: raw.definition,
    example: raw.example,
    exampleTranslation: raw.exampleTranslation,
    phonetic: raw.phonetic,
    pronunciation: raw.pronunciation,
    language,
    category,
    difficulty: raw.difficulty || 'beginner',
    topic: raw.topic,
    state: 'New',
    reps: 0,
    lapses: 0,
    stability: 0,
    fsrs_difficulty: 0,
    next_review: null,
    created_at: new Date().toISOString(),
  };
}

export async function initializeDatabase() {
  const isInitialized = await db.meta.get('initialized');
  if (isInitialized?.value) {
    return;
  }

  try {
    // 1. Load Flashcards in parallel
    const [toeicRaw, n2Raw] = await Promise.all([
      import('./toeic/flashcards.json').catch(() => ({ default: [] as RawFlashcard[] })),
      import('./n2/flashcards.json').catch(() => ({ default: [] as RawFlashcard[] })),
    ]);
    console.log(`[init] TOEIC: ${toeicRaw.default.length}, N2: ${n2Raw.default.length}`);

    await Promise.all([
      db.cards.bulkPut((toeicRaw.default as RawFlashcard[]).map(r => rawToFlashcard(r, 'english', 'toeic'))),
      db.cards.bulkPut((n2Raw.default as RawFlashcard[]).map(r => rawToFlashcard(r, 'japanese', 'n2'))),
    ]);

    // 2. Load Questions in parallel
    const questionFiles = [
      './toeic/questions.json',
      './toeic/questions-listening.json',
      './toeic/questions-batch2.json',
      './toeic/questions-advanced.json',
      './n2/questions.json',
      './n2/questions-supplement.json',
      './n2/questions-batch2.json',
      './n2/questions-advanced.json',
      './n2/questions-listening.json',
      './n2/questions-reading.json',
    ];
    const questionResults = await Promise.allSettled(
      questionFiles.map(file => import(file).then(mod => {
        const questions = (mod.default as RawQuestion[]).map((q) => ({
          id: q.id, text: q.text, options: q.options,
          correctAnswer: q.correctAnswer, explanation: q.explanation,
          category: q.category, difficulty: q.difficulty, subCategory: q.subCategory,
        }));
        return db.questions.bulkPut(questions);
      }))
    );
    questionResults.forEach((r, i) => {
      if (r.status === 'rejected') console.warn(`Failed to load ${questionFiles[i]}:`, r.reason);
    });

    // 3. Load Kanji in parallel
    const kanjiFiles = [
      './n2/kanji.json',
      './n2/kanji-supplement-batch1.json',
      './n2/kanji-supplement-batch2.json',
    ];
    const kanjiResults = await Promise.allSettled(
      kanjiFiles.map(file => import(file).then(mod => db.kanji.bulkPut(mod.default as KanjiEntry[])))
    );
    kanjiResults.forEach((r, i) => {
      if (r.status === 'rejected') console.warn(`Failed to load ${kanjiFiles[i]}:`, r.reason);
    });

    // 4. Load Grammar
    const [gN2, gToeic] = await Promise.all([
      import('./n2/grammar.json'),
      import('./toeic/grammar.json'),
    ]);
    await db.grammar.bulkPut([
      ...(gN2.default as GrammarPoint[]).map(g => ({ ...g, track: 'n2' as const })),
      ...(gToeic.default as GrammarPoint[]).map(g => ({ ...g, track: 'toeic' as const })),
    ]);

    await db.meta.put({ id: 'initialized', value: true });
  } catch (error) {
    console.error("Failed to initialize database:", error);
    throw error;
  }
}

export async function resetDatabase() {
  console.log('[reset] Starting database reset...');

  // 1. Back up modified cards
  const progressMap = new Map();
  await db.cards.where('state').notEqual('New').each(card => {
    progressMap.set(card.id, {
      state: card.state, reps: card.reps, lapses: card.lapses,
      stability: card.stability, difficulty: card.difficulty, next_review: card.next_review
    });
  });
  await db.cards.where('reps').above(0).each(card => {
    if (!progressMap.has(card.id)) {
      progressMap.set(card.id, {
        state: card.state, reps: card.reps, lapses: card.lapses,
        stability: card.stability, difficulty: card.difficulty, next_review: card.next_review
      });
    }
  });
  console.log(`[reset] Backed up ${progressMap.size} cards`);

  // 2. Clear all content tables
  console.log('[reset] Clearing tables...');
  await db.cards.clear();
  await db.questions.clear();
  await db.kanji.clear();
  await db.grammar.clear();
  console.log('[reset] Tables cleared');

  // 3. Clear service worker + browser caches (non-blocking)
  try {
    if ('caches' in window) {
      const names = await caches.keys();
      await Promise.all(names.map(n => caches.delete(n)));
    }
  } catch { /* ignore cache errors */ }
  try {
    if ('serviceWorker' in navigator) {
      const regs = await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map(r => r.unregister()));
    }
  } catch { /* ignore SW errors */ }

  // 4. Force re-initialize
  console.log('[reset] Re-initializing database...');
  await db.meta.put({ id: 'initialized', value: false });
  await initializeDatabase();
  const cardCount = await db.cards.count();
  console.log(`[reset] Database re-initialized. Total cards: ${cardCount}`);

  // 5. Restore progress
  if (progressMap.size > 0) {
    const cardsToUpdate: Flashcard[] = [];
    await db.cards.where('id').anyOf([...progressMap.keys()]).each(card => {
      const progress = progressMap.get(card.id);
      if (progress) cardsToUpdate.push({ ...card, ...progress });
    });
    if (cardsToUpdate.length > 0) {
      await db.cards.bulkPut(cardsToUpdate);
    }
  }
}
