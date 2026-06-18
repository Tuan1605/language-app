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

import toeicVocab from './toeic/vocabulary.json';
import toeicQuestions from './toeic/questions.json';
import n2Vocab from './n2/vocabulary.json';
import n2Questions from './n2/questions.json';
import n2Grammar from './n2/grammar.json';

const nowIso = () => new Date().toISOString();

interface RawVocab {
  id: string;
  word: string;
  reading?: string;
  definition: string;
  example?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  topic?: string;
}

interface RawQuestion {
  id: string;
  category: 'toeic' | 'n2';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  subCategory?: string;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

function toFlashcard(raw: RawVocab, language: 'english' | 'japanese'): Flashcard {
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

export const SEED_TOEIC_CARDS: Flashcard[] = (toeicVocab as RawVocab[]).map((v) =>
  toFlashcard(v, 'english')
);

export const SEED_N2_CARDS: Flashcard[] = (n2Vocab as RawVocab[]).map((v) =>
  toFlashcard(v, 'japanese')
);

export const SEED_CARDS: Flashcard[] = [...SEED_TOEIC_CARDS, ...SEED_N2_CARDS];

export const SEED_QUESTIONS: Question[] = [
  ...(toeicQuestions as RawQuestion[]),
  ...(n2Questions as RawQuestion[]),
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

export const SEED_N2_GRAMMAR: GrammarPoint[] = n2Grammar as GrammarPoint[];

export const SEED_N2_KANJI: KanjiEntry[] = [];
