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
    // 1. Load Flashcards
    const [toeicRaw, n2Raw] = await Promise.all([
      import('./toeic/flashcards.json').catch(() => ({ default: [] })),
      import('./n2/flashcards.json').catch(() => ({ default: [] })),
    ]);
    const toeicCards = (toeicRaw.default as RawFlashcard[]).map(r => rawToFlashcard(r, 'english', 'toeic'));
    const n2Cards = (n2Raw.default as RawFlashcard[]).map(r => rawToFlashcard(r, 'japanese', 'n2'));
    await db.cards.bulkPut([...toeicCards, ...n2Cards]);

    // 2. Load Questions
    const [q1, q2, q3, q4] = await Promise.all([
      import('./toeic/questions.json').catch(() => ({ default: [] })),
      import('./toeic/questions-listening.json').catch(() => ({ default: [] })),
      import('./n2/questions.json').catch(() => ({ default: [] })),
      import('./n2/questions-supplement.json').catch(() => ({ default: [] })),
    ]);
    const allQuestions = [
      ...(q1.default as RawQuestion[]),
      ...(q2.default as RawQuestion[]),
      ...(q3.default as RawQuestion[]),
      ...(q4.default as RawQuestion[]),
    ].map((q) => ({
      id: q.id,
      text: q.text,
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
      category: q.category,
      difficulty: q.difficulty,
      subCategory: q.subCategory,
    }));
    await db.questions.bulkPut(allQuestions);

    // 3. Load Kanji
    const [k1, k2, k3] = await Promise.all([
      import('./n2/kanji.json').catch(() => ({ default: [] })),
      import('./n2/kanji-supplement-batch1.json').catch(() => ({ default: [] })),
      import('./n2/kanji-supplement-batch2.json').catch(() => ({ default: [] })),
    ]);
    await db.kanji.bulkPut([
      ...(k1.default as KanjiEntry[]),
      ...(k2.default as KanjiEntry[]),
      ...(k3.default as KanjiEntry[]),
    ]);

    // 4. Load Grammar
    const [gN2, gToeic] = await Promise.all([
      import('./n2/grammar.json').catch(() => ({ default: [] })),
      import('./toeic/grammar.json').catch(() => ({ default: [] }))
    ]);
    const grammarPoints = [
      ...(gN2.default as GrammarPoint[]).map(g => ({ ...g, track: 'n2' as const })),
      ...(gToeic.default as GrammarPoint[]).map(g => ({ ...g, track: 'toeic' as const }))
    ];
    await db.grammar.bulkPut(grammarPoints);

    await db.meta.put({ id: 'initialized', value: true });
  } catch (error) {
    console.error("Failed to initialize Dexie database with seed content:", error);
    throw error;
  }
}

export async function resetDatabase() {
  // 1. Back up user progress (cards that are not 'new' or have been modified)
  const existingCards = await db.cards.toArray();
  const progressMap = new Map();
  for (const card of existingCards) {
    if (card.status !== 'new' || card.repetition > 0) {
      progressMap.set(card.id, {
        status: card.status,
        repetition: card.repetition,
        interval: card.interval,
        easiness: card.easiness,
        next_review: card.next_review
      });
    }
  }

  // 2. Clear content tables
  await db.cards.clear();
  await db.questions.clear();
  await db.kanji.clear();
  await db.grammar.clear();
  
  // 3. Re-initialize from JSON source files
  await db.meta.put({ id: 'initialized', value: false });
  await initializeDatabase();

  // 4. Restore SM-2 progress to the freshly loaded cards
  const newlyLoadedCards = await db.cards.toArray();
  const cardsToUpdate = [];
  for (const card of newlyLoadedCards) {
    if (progressMap.has(card.id)) {
      cardsToUpdate.push({
        ...card,
        ...progressMap.get(card.id)
      });
    }
  }
  
  if (cardsToUpdate.length > 0) {
    await db.cards.bulkPut(cardsToUpdate);
  }
}
