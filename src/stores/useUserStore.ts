import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DEFAULT_DAILY_REVIEW_LIMIT } from '../utils/constants';

type LanguageTrack = 'english' | 'japanese';

interface UserState {
  theme: 'light' | 'dark';
  activeTrack: LanguageTrack;
  unlockedPaths: Record<string, number[]>;
  dailyReviewLimit: number;
  openAIApiKey: string | null;
  exp: number;
  level: number;
  streakDays: number;
  lastStudyDate: string | null;
  grammarMastery: Record<string, number>;
  gameProgress: Record<string, { highScore: number; maxLevel: number }>;
  gameHighScores: Record<string, Record<string, number>>;
  
  toggleTheme: () => void;
  setActiveTrack: (track: LanguageTrack) => void;
  getUnlocked: (track: string) => number[];
  setUnlocked: (track: string, paths: number[]) => void;
  setProgress: (unlockedEn: number[], unlockedJa: number[]) => void;
  initializeDOM: () => void;
  setDailyReviewLimit: (limit: number) => void;
  setOpenAIApiKey: (key: string | null) => void;
  
  addExp: (amount: number) => void;
  updateStreak: () => void;
  addGrammarMastery: (pointId: string, amount: number) => void;
  updateGameProgress: (gameId: string, score: number, level: number) => void;
  setGameHighScore: (gameId: string, diff: string, score: number) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      theme: 'light',
      activeTrack: 'english',
      unlockedPaths: { english: [1], japanese: [1] },
      dailyReviewLimit: DEFAULT_DAILY_REVIEW_LIMIT,
      openAIApiKey: null,
      exp: 0,
      level: 1,
      streakDays: 0,
      lastStudyDate: null,
      grammarMastery: {},
      gameProgress: {},
      gameHighScores: {
        memory: { easy: 0, medium: 0, hard: 0 },
        'vocab-rpg': { easy: 0, medium: 0, hard: 0 }
      },

      toggleTheme: () => set((state) => {
        const newTheme = state.theme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        return { theme: newTheme };
      }),

      setActiveTrack: (track) => set(() => {
        document.documentElement.setAttribute('data-track', track);
        return { activeTrack: track };
      }),

      getUnlocked: (track) => {
        const { unlockedPaths } = get();
        return unlockedPaths[track] || [1];
      },

      setUnlocked: (track, paths) => set((state) => ({
        unlockedPaths: {
          ...state.unlockedPaths,
          [track]: paths,
        },
      })),

      setProgress: (unlockedEn, unlockedJa) => set({
        unlockedPaths: {
          english: unlockedEn,
          japanese: unlockedJa,
        },
      }),

      initializeDOM: () => {
        const { theme, activeTrack } = get();
        document.documentElement.setAttribute('data-theme', theme);
        document.documentElement.setAttribute('data-track', activeTrack);
        document.body.style.fontFamily = "'Nunito', 'Quicksand', sans-serif";
      },

      setDailyReviewLimit: (limit) => set({ dailyReviewLimit: limit }),

      setOpenAIApiKey: (key) => set({ openAIApiKey: key }),

      addExp: (amount) => set((state) => {
        const newExp = state.exp + amount;
        const newLevel = Math.floor(newExp / 1000) + 1;
        return { exp: newExp, level: newLevel };
      }),

      updateStreak: () => set((state) => {
        const today = new Date().toISOString().split('T')[0];
        if (state.lastStudyDate === today) return state;

        if (!state.lastStudyDate) {
          return { streakDays: 1, lastStudyDate: today };
        }

        const lastDate = new Date(state.lastStudyDate);
        const current = new Date(today);
        const diffTime = Math.abs(current.getTime() - lastDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

        if (diffDays === 1) {
          return { streakDays: state.streakDays + 1, lastStudyDate: today };
        } else if (diffDays > 1) {
          return { streakDays: 1, lastStudyDate: today };
        }
        return state;
      }),

      addGrammarMastery: (pointId, amount) => set((state) => {
        const current = state.grammarMastery[pointId] || 0;
        return {
          grammarMastery: {
            ...state.grammarMastery,
            [pointId]: Math.min(100, current + amount)
          }
        };
      }),

      updateGameProgress: (gameId, score, level) => set((state) => {
        const current = state.gameProgress[gameId] || { highScore: 0, maxLevel: 1 };
        // Merge state from old gameHighScores if it exists and hasn't been migrated
        let legacyScore = 0;
        if (state.gameHighScores && state.gameHighScores[gameId]) {
          legacyScore = Math.max(state.gameHighScores[gameId].medium || 0, state.gameHighScores[gameId].hard || 0);
        }

        const newHighScore = Math.max(score, current.highScore, legacyScore);
        const newMaxLevel = Math.max(level, current.maxLevel);

        if (newHighScore > current.highScore || newMaxLevel > current.maxLevel || current.maxLevel === 1) {
          return {
            gameProgress: {
              ...state.gameProgress,
              [gameId]: { highScore: newHighScore, maxLevel: newMaxLevel }
            }
          };
        }
        return {};
      }),

      setGameHighScore: (gameId, diff, score) => set((state) => {
        const currentScores = state.gameHighScores[gameId] || { easy: 0, medium: 0, hard: 0 };
        if (score > (currentScores[diff] || 0)) {
          return {
            gameHighScores: {
              ...state.gameHighScores,
              [gameId]: {
                ...currentScores,
                [diff]: score
              }
            }
          };
        }
        return {};
      }),
    }),
    {
      name: 'lingomaster-user-storage',
      // Migrate old format to new format
      merge: (persistedState, currentState) => {
        const state = { ...currentState, ...(persistedState as Partial<UserState>) };
        return state as UserState;
      },
    }
  )
);

