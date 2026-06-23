// Content loader: maps the JSON seed files in src/data/** onto the strongly
// typed datasets consumed by the app. New original practice material lives in
// JSON so it can grow to hundreds of items without touching component code.
//
// NOTE: All content here is ORIGINAL practice material, not copied from any
// official TOEIC (ETS) or JLPT (JEES) exam.

import type {
  Question,
  GrammarPoint,
  KanjiEntry,
} from '../types';

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

export async function loadSeedQuestions(): Promise<Question[]> {
  const [q1, q2, q3, q4] = await Promise.all([
    import('./toeic/questions.json'),
    import('./toeic/questions-listening.json'),
    import('./n2/questions.json'),
    import('./n2/questions-supplement.json'),
  ]);
  return [
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
}

export async function loadSeedN2Kanji(): Promise<KanjiEntry[]> {
  const [k1, k2, k3] = await Promise.all([
    import('./n2/kanji.json'),
    import('./n2/kanji-supplement-batch1.json'),
    import('./n2/kanji-supplement-batch2.json'),
  ]);
  return [
    ...(k1.default as KanjiEntry[]),
    ...(k2.default as KanjiEntry[]),
    ...(k3.default as KanjiEntry[]),
  ];
}

export async function loadSeedN2Grammar(): Promise<GrammarPoint[]> {
  const g = await import('./n2/grammar.json');
  return g.default as GrammarPoint[];
}

export async function loadSeedToeicGrammar(): Promise<GrammarPoint[]> {
  const g = await import('./toeic/grammar.json');
  return g.default as GrammarPoint[];
}

