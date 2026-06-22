// Content loader: maps the JSON seed files in src/data/** onto the strongly
// typed datasets consumed by the app. New original practice material lives in
// JSON so it can grow to hundreds of items without touching component code.
//
// NOTE: All content here is ORIGINAL practice material, not copied from any
// official TOEIC (ETS) or JLPT (JEES) exam.

import type {
  Flashcard,
  Question,
  GrammarPoint,
  KanjiEntry,
} from '../types';

const nowIso = () => new Date().toISOString();

export interface RawVocab {
  id: string;
  word: string;
  reading?: string;
  definition: string;
  example?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  topic?: string;
}

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

export function toFlashcard(raw: RawVocab, language: 'english' | 'japanese'): Flashcard {
  const word = raw.reading ? `${raw.word} (${raw.reading})` : raw.word;
  return {
    id: raw.id,
    user_id: 'seed',
    word,
    definition: raw.definition,
    example: raw.example,
    language,
    category: language === 'english' ? 'toeic' : 'n2',
    difficulty: raw.difficulty,
    repetition: 0,
    interval: 0,
    easiness: 2.5,
    next_review: nowIso(),
    created_at: nowIso(),
  };
}

export async function loadSeedCards(language: 'english' | 'japanese'): Promise<Flashcard[]> {
  if (language === 'english') {
    const [v1, v2, v3, v4, v5, v6] = await Promise.all([
      import('./toeic/vocabulary.json'),
      import('./toeic/vocabulary-supplement.json'),
      import('./toeic/vocabulary-supplement-batch1.json'),
      import('./toeic/vocabulary-supplement-batch2.json'),
      import('./toeic/vocabulary-supplement-batch3.json'),
      import('./toeic/vocabulary-supplement-batch4.json'),
    ]);
    const raw = [
      ...v1.default,
      ...v2.default,
      ...v3.default,
      ...v4.default,
      ...v5.default,
      ...v6.default,
    ] as RawVocab[];
    return raw.map((v) => toFlashcard(v, 'english'));
  } else {
    const [v1, v2, v3, v4, v5, v6, v7, v8] = await Promise.all([
      import('./n2/vocabulary.json'),
      import('./n2/vocabulary-supplement.json'),
      import('./n2/vocabulary-supplement-batch1.json'),
      import('./n2/vocabulary-supplement-batch2.json'),
      import('./n2/vocabulary-supplement-batch3.json'),
      import('./n2/vocabulary-supplement-batch4.json'),
      import('./n2/vocabulary-supplement-batch5.json'),
      import('./n2/grammar-anki.json'),
    ]);
    const raw = [
      ...v1.default,
      ...v2.default,
      ...v3.default,
      ...v4.default,
      ...v5.default,
      ...v6.default,
      ...v7.default,
      ...v8.default,
    ] as RawVocab[];
    return raw.map((v) => toFlashcard(v, 'japanese'));
  }
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
