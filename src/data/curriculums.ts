export interface CurriculumUnit {
  id: number;
  title: string;
  desc: string;
  nodes: number;
  difficulty: string;
  color: string;
  shadow: string;
  text: string;
  topics: string[];
}

// TOEIC: 8 units from absolute beginner to 700+
export const TOEIC_CURRICULUM: CurriculumUnit[] = [
  { id: 1, title: 'First Steps', desc: 'Alphabet & Basic Words', nodes: 8, difficulty: 'beginner', color: '#58cc02', shadow: '#58a700', text: 'text-white', topics: ['alphabet', 'greetings', 'numbers', 'colors'] },
  { id: 2, title: 'Daily Life', desc: 'Everyday Vocabulary', nodes: 10, difficulty: 'beginner', color: '#1cb0f6', shadow: '#1899d6', text: 'text-white', topics: ['family', 'food', 'transport', 'time'] },
  { id: 3, title: 'At the Office', desc: 'Workplace Basics', nodes: 12, difficulty: 'beginner', color: '#ce82ff', shadow: '#a561cf', text: 'text-white', topics: ['office', 'computer', 'phone', 'email'] },
  { id: 4, title: 'Business Basics', desc: 'Simple Business English', nodes: 14, difficulty: 'intermediate', color: '#ff9600', shadow: '#cd7900', text: 'text-white', topics: ['meetings', 'schedules', 'reports', 'colleagues'] },
  { id: 5, title: 'Professional Talk', desc: 'Workplace Communication', nodes: 16, difficulty: 'intermediate', color: '#ff4b4b', shadow: '#ea2b2b', text: 'text-white', topics: ['presentations', 'negotiations', 'customers', 'service'] },
  { id: 6, title: 'Finance & Legal', desc: 'Specialized Vocabulary', nodes: 18, difficulty: 'intermediate', color: '#1cb0f6', shadow: '#1899d6', text: 'text-white', topics: ['finance', 'legal', 'contracts', 'compliance'] },
  { id: 7, title: 'Advanced Reading', desc: 'Complex Texts & Grammar', nodes: 20, difficulty: 'advanced', color: '#ce82ff', shadow: '#a561cf', text: 'text-white', topics: ['reading', 'analysis', 'reports', 'proposals'] },
  { id: 8, title: 'TOEIC Master', desc: 'Exam Strategy & Practice', nodes: 25, difficulty: 'advanced', color: '#ffc800', shadow: '#cda000', text: 'text-[#4b4b4b]', topics: ['strategy', 'practice', 'review', 'exam'] },
];

// JLPT N2: 8 units from absolute beginner to N2
export const N2_CURRICULUM: CurriculumUnit[] = [
  { id: 1, title: 'Hiragana & Katakana', desc: 'Japanese Alphabet', nodes: 8, difficulty: 'beginner', color: '#58cc02', shadow: '#58a700', text: 'text-white', topics: ['hiragana', 'katakana', 'basic_words'] },
  { id: 2, title: 'Basic Kanji', desc: 'Essential Characters', nodes: 10, difficulty: 'beginner', color: '#1cb0f6', shadow: '#1899d6', text: 'text-white', topics: ['kanji_basic', 'numbers', 'time', 'family'] },
  { id: 3, title: 'Daily Japanese', desc: 'Everyday Conversation', nodes: 12, difficulty: 'beginner', color: '#ce82ff', shadow: '#a561cf', text: 'text-white', topics: ['greetings', 'shopping', 'food', 'directions'] },
  { id: 4, title: 'Grammar Basics', desc: 'Essential Patterns', nodes: 14, difficulty: 'intermediate', color: '#ff9600', shadow: '#cd7900', text: 'text-white', topics: ['particles', 'verbs', 'adjectives', 'tenses'] },
  { id: 5, title: 'Intermediate N3', desc: 'Building Fluency', nodes: 16, difficulty: 'intermediate', color: '#ff4b4b', shadow: '#ea2b2b', text: 'text-white', topics: ['advanced_grammar', 'vocabulary', 'kanji_intermediate'] },
  { id: 6, title: 'Business Japanese', desc: 'Professional Communication', nodes: 18, difficulty: 'intermediate', color: '#1cb0f6', shadow: '#1899d6', text: 'text-white', topics: ['keigo', 'business', 'meetings', 'email'] },
  { id: 7, title: 'N2 Grammar', desc: 'Advanced Patterns', nodes: 20, difficulty: 'advanced', color: '#ce82ff', shadow: '#a561cf', text: 'text-white', topics: ['grammar_advanced', 'reading', 'listening'] },
  { id: 8, title: 'N2 Master', desc: 'Exam Preparation', nodes: 25, difficulty: 'advanced', color: '#ffc800', shadow: '#cda000', text: 'text-[#4b4b4b]', topics: ['strategy', 'practice', 'review', 'exam'] },
];
