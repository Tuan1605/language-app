export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export interface Flashcard {
  id: string;
  user_id: string;
  word: string;
  definition: string;
  example?: string;
  exampleTranslation?: string; // Translation of the example sentence
  imageUrl?: string;
  language: 'english' | 'japanese';
  category: 'toeic' | 'n2';
  difficulty: Difficulty;
  topic?: string;
  phonetic?: string;      // IPA: /nəˈɡoʊʃieɪt/
  pronunciation?: string;  // Cách đọc đơn giản: nuh-GOH-shee-eyt

  // FSRS Algorithm fields
  state: 'New' | 'Learning' | 'Review' | 'Relearning';
  stability: number;
  fsrs_difficulty: number;
  reps: number;
  lapses: number;
  next_review: string | null;
  last_review?: string;
  created_at: string;
}

export interface ReviewLog {
  id: string;
  cardId: string;
  rating: 'Again' | 'Hard' | 'Good' | 'Easy';
  state: 'New' | 'Learning' | 'Review' | 'Relearning';
  due: string;
  stability: number;
  difficulty: number;
  elapsed_days: number;
  last_review: string | null;
  scheduled_days: number;
  review: string;
}

export type ReviewGrade = 0 | 1 | 2 | 3 | 4 | 5;

export interface Question {
  id: string;
  text: string;
  passage?: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  imageUrl?: string;
  audioUrl?: string;
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
  type?: 'mini-quiz' | 'full-exam' | 'mock-exam';
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
  data: Question | DictationLesson | SpeakingLesson | WritingLesson;
  wrongAnswer: string;
  timestamp: string;
}

export interface PdfExamAnswer {
  id: string;
  correctAnswer: 0 | 1 | 2 | 3;
}

export interface PdfExam {
  id: string;
  title: string;
  year: number;
  category: 'toeic' | 'n2';
  timeLimitMinutes: number;
  pdfUrl_LC?: string;
  pdfUrl_RC?: string;
  scriptUrl_LC?: string;
  scriptUrl_RC?: string;
  audioUrl?: string;
  answers: PdfExamAnswer[];
}

export * from './authentic';
