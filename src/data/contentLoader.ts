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
  topic?: string;
}

function rawToFlashcard(raw: RawFlashcard, language: 'english' | 'japanese', category: 'toeic' | 'n2'): Flashcard {
  return {
    id: raw.id,
    user_id: 'guest',
    word: raw.word,
    definition: raw.definition,
    example: raw.example,
    language,
    category,
    difficulty: 'beginner',
    topic: raw.topic,
    status: 'new', // Fixed logic! Cards no longer immediately due
    repetition: 0,
    interval: 0,
    easiness: 2.5,
    next_review: null,
    created_at: new Date().toISOString(),
  };
}

export async function initializeDatabase() {
  const isInitialized = await db.meta.get('initialized');
  if (isInitialized?.value) {
    return; // Already loaded into IndexedDB!
  }

  try {
    // 1. Load Flashcards one at a time to avoid memory spike
    const toeicRaw = await import('./toeic/flashcards.json').catch(() => ({ default: [] as RawFlashcard[] }));
    await db.cards.bulkPut((toeicRaw.default as RawFlashcard[]).map(r => rawToFlashcard(r, 'english', 'toeic')));

    const n2Raw = await import('./n2/flashcards.json').catch(() => ({ default: [] as RawFlashcard[] }));
    await db.cards.bulkPut((n2Raw.default as RawFlashcard[]).map(r => rawToFlashcard(r, 'japanese', 'n2')));

    // 2. Load Questions in smaller batches
    const questionFiles = [
      './toeic/questions.json',
      './toeic/questions-listening.json',
      './n2/questions.json',
      './n2/questions-supplement.json',
    ];
    for (const file of questionFiles) {
      try {
        const mod = await import(file);
        const questions = (mod.default as RawQuestion[]).map((q) => ({
          id: q.id, text: q.text, options: q.options,
          correctAnswer: q.correctAnswer, explanation: q.explanation,
          category: q.category, difficulty: q.difficulty, subCategory: q.subCategory,
        }));
        await db.questions.bulkPut(questions);
      } catch (e) {
        console.warn(`Failed to load ${file}:`, e);
      }
    }

    // 3. Load Kanji one at a time
    const kanjiFiles = ['./n2/kanji.json', './n2/kanji-supplement-batch2.json'];
    for (const file of kanjiFiles) {
      try {
        const mod = await import(file);
        await db.kanji.bulkPut(mod.default as KanjiEntry[]);
      } catch (e) {
        console.warn(`Failed to load ${file}:`, e);
      }
    }

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
    console.error("Failed to initialize Dexie database:", error);
    throw error;
  }
}

export async function resetDatabase() {
  // 1. Back up only modified cards using IndexedDB query (not full toArray)
  const progressMap = new Map();
  await db.cards.where('status').notEqual('new').each(card => {
    progressMap.set(card.id, {
      status: card.status,
      repetition: card.repetition,
      interval: card.interval,
      easiness: card.easiness,
      next_review: card.next_review
    });
  });
  // Also check cards with repetition > 0 that are still 'new'
  await db.cards.where('repetition').above(0).each(card => {
    if (!progressMap.has(card.id)) {
      progressMap.set(card.id, {
        status: card.status,
        repetition: card.repetition,
        interval: card.interval,
        easiness: card.easiness,
        next_review: card.next_review
      });
    }
  });

  // 2. Clear content tables
  await db.cards.clear();
  await db.questions.clear();
  await db.kanji.clear();
  await db.grammar.clear();

  // 3. Re-initialize from JSON source files
  await db.meta.put({ id: 'initialized', value: false });
  await initializeDatabase();

  // 4. Restore SM-2 progress using bulkPut (not toArray + loop)
  if (progressMap.size > 0) {
    const cardsToUpdate: Flashcard[] = [];
    await db.cards.where('id').anyOf([...progressMap.keys()]).each(card => {
      const progress = progressMap.get(card.id);
      if (progress) {
        cardsToUpdate.push({ ...card, ...progress });
      }
    });
    if (cardsToUpdate.length > 0) {
      await db.cards.bulkPut(cardsToUpdate);
    }
  }
}
