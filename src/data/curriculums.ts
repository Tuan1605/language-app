export interface CurriculumUnit {
  id: number;
  title: string;
  desc: string;
  nodes: number;
  difficulty: string;
  color: string;
  shadow: string;
  pathColor: string;
  pathShadow: string;
  text: string;
  topics: string[];
}

// TOEIC: 8 units from absolute beginner to 700+
// topics[] maps directly to flashcard.topic values
export const TOEIC_CURRICULUM: CurriculumUnit[] = [
  {
    id: 1, title: 'First Steps', desc: 'Basic Daily Words',
    nodes: 12, difficulty: 'beginner',
    color: '#059669', shadow: '#047857', pathColor: '#065F46', pathShadow: '#064E3B', text: 'text-white',
    topics: ['Daily Life & General', 'Food & Beverage', 'Sports & Recreation']
  },
  {
    id: 2, title: 'On the Move', desc: 'Travel & Shopping',
    nodes: 14, difficulty: 'beginner',
    color: '#2563EB', shadow: '#1D4ED8', pathColor: '#1E40AF', pathShadow: '#1E3A8A', text: 'text-white',
    topics: ['Travel & Hospitality', 'Retail & Sales', 'Education']
  },
  {
    id: 3, title: 'At the Office', desc: 'Workplace Basics',
    nodes: 14, difficulty: 'beginner',
    color: '#7C3AED', shadow: '#6D28D9', pathColor: '#5B21B6', pathShadow: '#4C1D95', text: 'text-white',
    topics: ['Office', 'Communication', 'Workplace Communication']
  },
  {
    id: 4, title: 'Business Fundamentals', desc: 'Management & Marketing',
    nodes: 16, difficulty: 'intermediate',
    color: '#D97706', shadow: '#B45309', pathColor: '#92400E', pathShadow: '#78350F', text: 'text-white',
    topics: ['Business', 'Marketing', 'Human Resources']
  },
  {
    id: 5, title: 'Tech & Service', desc: 'Technology & Customer Relations',
    nodes: 16, difficulty: 'intermediate',
    color: '#DC2626', shadow: '#B91C1C', pathColor: '#991B1B', pathShadow: '#7F1D1D', text: 'text-white',
    topics: ['Technology', 'Customer Service', 'Media & Entertainment']
  },
  {
    id: 6, title: 'Finance & Law', desc: 'Specialized Vocabulary',
    nodes: 18, difficulty: 'intermediate',
    color: '#0284C7', shadow: '#0369A1', pathColor: '#075985', pathShadow: '#082F49', text: 'text-white',
    topics: ['Finance', 'Legal', 'Insurance', 'Banking & Investment']
  },
  {
    id: 7, title: 'Industry & Construction', desc: 'Manufacturing & Engineering',
    nodes: 18, difficulty: 'advanced',
    color: '#4F46E5', shadow: '#4338CA', pathColor: '#3730A3', pathShadow: '#312E81', text: 'text-white',
    topics: ['Healthcare', 'Manufacturing', 'Construction & Engineering', 'Architecture & Design']
  },
  {
    id: 8, title: 'TOEIC Master', desc: 'Advanced Topics & Exam Prep',
    nodes: 20, difficulty: 'advanced',
    color: '#0D9488', shadow: '#0F766E', pathColor: '#115E59', pathShadow: '#134E4A', text: 'text-white',
    topics: ['Science & Research', 'Energy & Utilities', 'Environment', 'Telecommunications',
             'Aviation & Maritime', 'Transportation & Logistics', 'Agriculture', 'Real Estate',
             'Verbs & Actions', 'Adjectives & Descriptions', 'Nouns & Concepts', 'Adverbs & Connectors',
             'General Academic', 'Industry Terms']
  },
];

// JLPT N2: 8 units from absolute beginner to N2
export const N2_CURRICULUM: CurriculumUnit[] = [
  {
    id: 1, title: 'Hiragana & Katakana', desc: 'Japanese Alphabet',
    nodes: 8, difficulty: 'beginner',
    color: '#059669', shadow: '#047857', pathColor: '#065F46', pathShadow: '#064E3B', text: 'text-white',
    topics: ['hiragana', 'katakana']
  },
  {
    id: 2, title: 'Basic Kanji', desc: 'Essential Characters',
    nodes: 10, difficulty: 'beginner',
    color: '#2563EB', shadow: '#1D4ED8', pathColor: '#1E40AF', pathShadow: '#1E3A8A', text: 'text-white',
    topics: ['kanji_basic', 'numbers', 'time']
  },
  {
    id: 3, title: 'Daily Japanese', desc: 'Everyday Conversation',
    nodes: 12, difficulty: 'beginner',
    color: '#7C3AED', shadow: '#6D28D9', pathColor: '#5B21B6', pathShadow: '#4C1D95', text: 'text-white',
    topics: ['greetings', 'shopping', 'food', 'directions']
  },
  {
    id: 4, title: 'Grammar Basics', desc: 'Essential Patterns',
    nodes: 14, difficulty: 'intermediate',
    color: '#D97706', shadow: '#B45309', pathColor: '#92400E', pathShadow: '#78350F', text: 'text-white',
    topics: ['particles', 'verbs', 'adjectives', 'tenses']
  },
  {
    id: 5, title: 'Intermediate N3', desc: 'Building Fluency',
    nodes: 16, difficulty: 'intermediate',
    color: '#DC2626', shadow: '#B91C1C', pathColor: '#991B1B', pathShadow: '#7F1D1D', text: 'text-white',
    topics: ['advanced_grammar', 'vocabulary', 'kanji_intermediate']
  },
  {
    id: 6, title: 'Business Japanese', desc: 'Professional Communication',
    nodes: 18, difficulty: 'intermediate',
    color: '#0284C7', shadow: '#0369A1', pathColor: '#075985', pathShadow: '#082F49', text: 'text-white',
    topics: ['keigo', 'business', 'meetings', 'email']
  },
  {
    id: 7, title: 'N2 Grammar', desc: 'Advanced Patterns',
    nodes: 20, difficulty: 'advanced',
    color: '#4F46E5', shadow: '#4338CA', pathColor: '#3730A3', pathShadow: '#312E81', text: 'text-white',
    topics: ['grammar_advanced', 'reading', 'listening']
  },
  {
    id: 8, title: 'N2 Master', desc: 'Exam Preparation',
    nodes: 25, difficulty: 'advanced',
    color: '#0D9488', shadow: '#0F766E', pathColor: '#115E59', pathShadow: '#134E4A', text: 'text-white',
    topics: ['strategy', 'practice', 'review', 'exam']
  },
];
