export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export interface Flashcard {
  id: string;
  user_id: string;
  word: string;
  definition: string;
  example?: string;
  imageUrl?: string;
  language: 'english' | 'japanese';
  category: 'toeic' | 'n2';
  difficulty: Difficulty;
  topic?: string;
  
  // SM-2 Algorithm fields
  repetition: number;
  interval: number;
  easiness: number;
  next_review: string;
  created_at: string;
}

export type ReviewGrade = 0 | 1 | 2 | 3 | 4 | 5;

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  imageUrl?: string;
  category: 'toeic' | 'n2';
  difficulty: Difficulty;
  subCategory?: string;
}

export interface ExamResult {
  id: string;
  date: string;
  score: number;
  totalQuestions: number;
  category: 'toeic' | 'n2';
  difficulty: Difficulty;
  type?: 'mini-quiz' | 'full-exam';
}

export interface ListeningLesson {
  id: string;
  title: string;
  audioUrl?: string;
  category: 'toeic' | 'n2';
  difficulty: Difficulty;
  transcript: {
    time: number;
    text: string;
    translation?: string;
  }[];
}

export interface SpeakingLesson {
  id: string;
  category: 'toeic' | 'n2';
  difficulty: Difficulty;
  targetSentence: string;
  translation: string;
  phonetic?: string;
}

export interface DictationLesson {
  id: string;
  category: 'toeic' | 'n2';
  difficulty: Difficulty;
  audioUrl?: string;
  targetText: string;
  translation: string;
}

export interface WritingLesson {
  id: string;
  category: 'toeic' | 'n2';
  difficulty: Difficulty;
  sourceText: string; // The text to translate from
  targetText: string; // The text to translate to
  hint?: string;
}

export interface GrammarPoint {
  id: string;
  pattern: string;
  structure?: string;
  meaning: string;
  example: string;
  blankedExample?: string;
  exampleTranslation: string;
  difficulty: Difficulty;
}

export interface KanjiEntry {
  id: string;
  kanji: string;
  reading?: string;
  on_reading?: string;
  kun_reading?: string;
  meaning: string;
  example?: string;
  examples?: { word: string; reading: string; meaning: string }[];
  difficulty?: Difficulty;
  stroke_count?: number;
  jlpt_level?: string;
  source?: string;
}

export interface GrammarQuizTaskData {
  id: string;
  point: GrammarPoint;
  options: string[]; // grammar patterns to choose from
  correctIndex: number;
}

export type SessionTask = 
  | { type: 'vocab-quiz'; data: Flashcard }
  | { type: 'quiz'; data: Question }
  | { type: 'listening'; data: ListeningLesson }
  | { type: 'speaking'; data: SpeakingLesson }
  | { type: 'dictation'; data: DictationLesson }
  | { type: 'writing'; data: WritingLesson }
  | { type: 'grammar'; data: GrammarQuizTaskData };

export interface FullExam {
  id: string;
  title: string;
  year: number;
  category: 'toeic' | 'n2';
  difficulty?: Difficulty;
  tasks: SessionTask[];
}

export interface Mistake {
  id: string;
  type: 'question' | 'dictation' | 'speaking' | 'writing';
  data: any;
  wrongAnswer: string;
  timestamp: string;
}

export * from './authentic';
