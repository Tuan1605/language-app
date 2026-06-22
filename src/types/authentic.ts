import type { Difficulty } from './index';

export interface AuthenticExamQuestion {
  id: string;
  text?: string;
  options: string[];
  correctAnswer: number; // Index of the correct option
  audioUrl?: string; // For listening sections
  imageUrl?: string; // For questions with images (e.g. TOEIC Part 1)
  passage?: string; // For reading sections
}

export interface AuthenticExamSection {
  id: string;
  title: string; // e.g. "Listening Part 1: Photographs" or "Vocabulary"
  description?: string;
  questions: AuthenticExamQuestion[];
}

export interface AuthenticExam {
  id: string;
  title: string;
  year: number;
  category: 'toeic' | 'n2'; // keeping n2 for JLPT to align with the rest of the app for now
  difficulty?: Difficulty;
  timeLimitMinutes: number; // e.g. 120
  sections: AuthenticExamSection[];
}
