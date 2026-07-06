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

// TOEIC: 10 units organized by topic
// Topics match actual flashcard data (36 topics)
export const TOEIC_CURRICULUM: CurriculumUnit[] = [
  // === BEGINNER: Everyday Life ===
  {
    id: 1, title: 'Daily Life', desc: 'Everyday Words & Food',
    nodes: 10, difficulty: 'beginner',
    color: '#059669', shadow: '#047857', pathColor: '#065F46', pathShadow: '#064E3B', text: 'text-white',
    topics: ['Daily Life & General', 'Food & Beverage', 'Sports & Recreation']
  },
  {
    id: 2, title: 'Travel & Shopping', desc: 'Journey & Retail',
    nodes: 10, difficulty: 'beginner',
    color: '#2563EB', shadow: '#1D4ED8', pathColor: '#1E40AF', pathShadow: '#1E3A8A', text: 'text-white',
    topics: ['Travel & Hospitality', 'Retail & Sales']
  },
  {
    id: 3, title: 'Education', desc: 'Learning & Communication',
    nodes: 10, difficulty: 'beginner',
    color: '#7C3AED', shadow: '#6D28D9', pathColor: '#5B21B6', pathShadow: '#4C1D95', text: 'text-white',
    topics: ['Education', 'Communication', 'Media & Entertainment']
  },
  // === INTERMEDIATE: Work & Business ===
  {
    id: 4, title: 'Office & Work', desc: 'Workplace Basics',
    nodes: 12, difficulty: 'intermediate',
    color: '#D97706', shadow: '#B45309', pathColor: '#92400E', pathShadow: '#78350F', text: 'text-white',
    topics: ['Office', 'Customer Service']
  },
  {
    id: 5, title: 'Business', desc: 'Commerce & Marketing',
    nodes: 14, difficulty: 'intermediate',
    color: '#DC2626', shadow: '#B91C1C', pathColor: '#991B1B', pathShadow: '#7F1D1D', text: 'text-white',
    topics: ['Business', 'Marketing', 'Human Resources']
  },
  {
    id: 6, title: 'Finance & Legal', desc: 'Money & Law',
    nodes: 14, difficulty: 'intermediate',
    color: '#0284C7', shadow: '#0369A1', pathColor: '#075985', pathShadow: '#082F49', text: 'text-white',
    topics: ['Finance', 'Legal', 'Banking & Investment', 'Insurance']
  },
  // === ADVANCED: Specialized Fields ===
  {
    id: 7, title: 'Technology', desc: 'Digital & Innovation',
    nodes: 12, difficulty: 'advanced',
    color: '#4F46E5', shadow: '#4338CA', pathColor: '#3730A3', pathShadow: '#312E81', text: 'text-white',
    topics: ['Technology', 'Telecommunications']
  },
  {
    id: 8, title: 'Healthcare', desc: 'Medical & Wellbeing',
    nodes: 12, difficulty: 'advanced',
    color: '#0D9488', shadow: '#0F766E', pathColor: '#115E59', pathShadow: '#134E4A', text: 'text-white',
    topics: ['Healthcare', 'Science & Research']
  },
  {
    id: 9, title: 'Industry & Construction', desc: 'Manufacturing & Engineering',
    nodes: 14, difficulty: 'advanced',
    color: '#B91C1C', shadow: '#991B1B', pathColor: '#7F1D1D', pathShadow: '#7F1D1D', text: 'text-white',
    topics: ['Manufacturing', 'Construction & Engineering', 'Architecture & Design', 'Real Estate']
  },
  // === EXPERT: Advanced Topics ===
  {
    id: 10, title: 'Environment & Transport', desc: 'Green & Logistics',
    nodes: 12, difficulty: 'advanced',
    color: '#059669', shadow: '#047857', pathColor: '#065F46', pathShadow: '#064E3B', text: 'text-white',
    topics: ['Environment', 'Energy & Utilities', 'Agriculture', 'Transportation & Logistics', 'Aviation & Maritime']
  },
];

// JLPT N2: 10 units organized by topic
// Topics match actual flashcard data: Business, Daily Life, Government, Culture, Work, Technology, Science, Emotions, Nature, Health, Travel, Education, Academic
export const N2_CURRICULUM: CurriculumUnit[] = [
  // === BEGINNER: Daily Life & Personal ===
  {
    id: 1, title: 'Daily Life', desc: 'Everyday Words & Emotions',
    nodes: 12, difficulty: 'beginner',
    color: '#059669', shadow: '#047857', pathColor: '#065F46', pathShadow: '#064E3B', text: 'text-white',
    topics: ['Daily Life', 'Emotions']
  },
  {
    id: 2, title: 'Nature & Health', desc: 'Environment & Wellbeing',
    nodes: 10, difficulty: 'beginner',
    color: '#2563EB', shadow: '#1D4ED8', pathColor: '#1E40AF', pathShadow: '#1E3A8A', text: 'text-white',
    topics: ['Nature', 'Health']
  },
  {
    id: 3, title: 'Travel & Education', desc: 'Journey & Learning',
    nodes: 8, difficulty: 'beginner',
    color: '#7C3AED', shadow: '#6D28D9', pathColor: '#5B21B6', pathShadow: '#4C1D95', text: 'text-white',
    topics: ['Travel', 'Education']
  },
  // === INTERMEDIATE: Work & Business ===
  {
    id: 4, title: 'Business', desc: 'Commerce & Trade',
    nodes: 14, difficulty: 'intermediate',
    color: '#D97706', shadow: '#B45309', pathColor: '#92400E', pathShadow: '#78350F', text: 'text-white',
    topics: ['Business']
  },
  {
    id: 5, title: 'Work & Career', desc: 'Professional Life',
    nodes: 12, difficulty: 'intermediate',
    color: '#DC2626', shadow: '#B91C1C', pathColor: '#991B1B', pathShadow: '#7F1D1D', text: 'text-white',
    topics: ['Work']
  },
  {
    id: 6, title: 'Technology', desc: 'Digital & Innovation',
    nodes: 10, difficulty: 'intermediate',
    color: '#0284C7', shadow: '#0369A1', pathColor: '#075985', pathShadow: '#082F49', text: 'text-white',
    topics: ['Technology']
  },
  // === ADVANCED: Society & Knowledge ===
  {
    id: 7, title: 'Science & Academic', desc: 'Research & Study',
    nodes: 10, difficulty: 'advanced',
    color: '#4F46E5', shadow: '#4338CA', pathColor: '#3730A3', pathShadow: '#312E81', text: 'text-white',
    topics: ['Science', 'Academic']
  },
  {
    id: 8, title: 'Government', desc: 'Politics & Administration',
    nodes: 12, difficulty: 'advanced',
    color: '#0D9488', shadow: '#0F766E', pathColor: '#115E59', pathShadow: '#134E4A', text: 'text-white',
    topics: ['Government']
  },
  {
    id: 9, title: 'Culture & Society', desc: 'Traditions & Customs',
    nodes: 12, difficulty: 'advanced',
    color: '#B91C1C', shadow: '#991B1B', pathColor: '#7F1D1D', pathShadow: '#7F1D1D', text: 'text-white',
    topics: ['Culture']
  },
  // === COMPREHENSIVE ===
  {
    id: 10, title: 'N2 Mastery', desc: 'Complete Review',
    nodes: 16, difficulty: 'advanced',
    color: '#9333EA', shadow: '#7E22CE', pathColor: '#6B21A8', pathShadow: '#581C87', text: 'text-white',
    topics: ['Business', 'Daily Life', 'Government', 'Culture', 'Work', 'Technology', 'Science', 'Emotions', 'Nature', 'Health', 'Travel', 'Education', 'Academic']
  },
];
