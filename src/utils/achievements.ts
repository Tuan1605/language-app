export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  condition: (stats: AchievementStats) => boolean;
  unlocked?: boolean;
  unlockedAt?: string;
}

export interface AchievementStats {
  totalCards: number;
  masteredCards: number;
  studyDays: number;
  totalReviews: number;
  correctReviews: number;
  examsCompleted: number;
  avgAccuracy: number;
}

const ACHIEVEMENTS: Achievement[] = [
  // Vocabulary Achievements
  {
    id: 'first_word',
    title: 'First Steps',
    description: 'Learn your first word',
    icon: '🌱',
    condition: (stats) => stats.totalCards >= 1,
  },
  {
    id: 'vocabulary_10',
    title: 'Word Collector',
    description: 'Learn 10 words',
    icon: '📚',
    condition: (stats) => stats.totalCards >= 10,
  },
  {
    id: 'vocabulary_50',
    title: 'Vocabulary Builder',
    description: 'Learn 50 words',
    icon: '🏗️',
    condition: (stats) => stats.totalCards >= 50,
  },
  {
    id: 'vocabulary_100',
    title: 'Word Master',
    description: 'Learn 100 words',
    icon: '👑',
    condition: (stats) => stats.totalCards >= 100,
  },
  {
    id: 'vocabulary_500',
    title: 'Lexicon Legend',
    description: 'Learn 500 words',
    icon: '🏆',
    condition: (stats) => stats.totalCards >= 500,
  },

  // Mastery Achievements
  {
    id: 'mastery_10',
    title: 'Getting There',
    description: 'Master 10 words',
    icon: '⭐',
    condition: (stats) => stats.masteredCards >= 10,
  },
  {
    id: 'mastery_50',
    title: 'Knowledgeable',
    description: 'Master 50 words',
    icon: '🌟',
    condition: (stats) => stats.masteredCards >= 50,
  },
  {
    id: 'mastery_100',
    title: 'Expert',
    description: 'Master 100 words',
    icon: '💫',
    condition: (stats) => stats.masteredCards >= 100,
  },

  // Review Achievements
  {
    id: 'reviews_100',
    title: 'Practice Makes Perfect',
    description: 'Complete 100 reviews',
    icon: '📝',
    condition: (stats) => stats.totalReviews >= 100,
  },
  {
    id: 'reviews_500',
    title: 'Review Master',
    description: 'Complete 500 reviews',
    icon: '🎯',
    condition: (stats) => stats.totalReviews >= 500,
  },
  {
    id: 'reviews_1000',
    title: 'Review Legend',
    description: 'Complete 1000 reviews',
    icon: '🏅',
    condition: (stats) => stats.totalReviews >= 1000,
  },

  // Accuracy Achievements
  {
    id: 'accuracy_80',
    title: 'Sharp Mind',
    description: 'Achieve 80% accuracy',
    icon: '🧠',
    condition: (stats) => stats.avgAccuracy >= 80 && stats.totalReviews >= 10,
  },
  {
    id: 'accuracy_90',
    title: 'Precision',
    description: 'Achieve 90% accuracy',
    icon: '💎',
    condition: (stats) => stats.avgAccuracy >= 90 && stats.totalReviews >= 20,
  },
  {
    id: 'accuracy_95',
    title: 'Perfectionist',
    description: 'Achieve 95% accuracy',
    icon: '✨',
    condition: (stats) => stats.avgAccuracy >= 95 && stats.totalReviews >= 30,
  },

  // Exam Achievements
  {
    id: 'exam_first',
    title: 'Test Taker',
    description: 'Complete your first exam',
    icon: '📋',
    condition: (stats) => stats.examsCompleted >= 1,
  },
  {
    id: 'exam_10',
    title: 'Exam Veteran',
    description: 'Complete 10 exams',
    icon: '🎓',
    condition: (stats) => stats.examsCompleted >= 10,
  },
  {
    id: 'exam_50',
    title: 'Exam Master',
    description: 'Complete 50 exams',
    icon: '🎖️',
    condition: (stats) => stats.examsCompleted >= 50,
  },
];

const STORAGE_KEY = 'lingo_achievements';

export function getUnlockedAchievements(): string[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function saveUnlockedAchievements(ids: string[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch { /* ignore */ }
}

export function checkAchievements(stats: AchievementStats): Achievement[] {
  const unlockedIds = getUnlockedAchievements();
  const newUnlocks: Achievement[] = [];

  for (const achievement of ACHIEVEMENTS) {
    if (!unlockedIds.includes(achievement.id) && achievement.condition(stats)) {
      newUnlocks.push({
        ...achievement,
        unlocked: true,
        unlockedAt: new Date().toISOString(),
      });
      unlockedIds.push(achievement.id);
    }
  }

  if (newUnlocks.length > 0) {
    saveUnlockedAchievements(unlockedIds);
  }

  return newUnlocks;
}

export function getAllAchievements(): Achievement[] {
  const unlockedIds = getUnlockedAchievements();
  return ACHIEVEMENTS.map(a => ({
    ...a,
    unlocked: unlockedIds.includes(a.id),
    unlockedAt: unlockedIds.includes(a.id) ? localStorage.getItem(`${STORAGE_KEY}_${a.id}_time`) : undefined,
  }));
}

export function getAchievementProgress(stats: AchievementStats): {
  unlocked: number;
  total: number;
  percentage: number;
} {
  const unlocked = ACHIEVEMENTS.filter(a => a.condition(stats)).length;
  return {
    unlocked,
    total: ACHIEVEMENTS.length,
    percentage: Math.round((unlocked / ACHIEVEMENTS.length) * 100),
  };
}
