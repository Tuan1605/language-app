export interface Flashcard {
  id: string;
  user_id: string;
  word: string;
  definition: string;
  example?: string;
  language: 'english' | 'japanese';
  category: 'toeic' | 'n2';
  
  // SM-2 Algorithm fields
  repetition: number; // n
  interval: number;   // I
  easiness: number;   // EF
  next_review: string; // ISO date string
  created_at: string;
}

export type ReviewGrade = 0 | 1 | 2 | 3 | 4 | 5;

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number; // Index of the correct option
  explanation?: string;
  category: 'toeic' | 'n2';
  subCategory?: string; // e.g., 'Part 5', 'Grammar'
}

export interface ExamResult {
  id: string;
  date: string;
  score: number;
  totalQuestions: number;
  category: 'toeic' | 'n2';
}

export interface ListeningLesson {
  id: string;
  title: string;
  audioUrl: string;
  category: 'toeic' | 'n2';
  transcript: {
    time: number; // seconds
    text: string;
    translation?: string;
  }[];
}
