import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DEFAULT_DAILY_REVIEW_LIMIT } from '../utils/constants';

interface UserState {
  theme: 'light' | 'dark';
  activeTrack: 'english' | 'japanese';
  unlockedEn: number[];
  unlockedJa: number[];
  dailyReviewLimit: number;
  openAIApiKey: string | null;
  lastStudyDate: string | null;
  currentStreak: number;
  longestStreak: number;
  toggleTheme: () => void;
  setActiveTrack: (track: 'english' | 'japanese') => void;
  setProgress: (unlockedEn: number[], unlockedJa: number[]) => void;
  initializeDOM: () => void;
  setDailyReviewLimit: (limit: number) => void;
  setOpenAIApiKey: (key: string | null) => void;
  recordStudyDay: () => void;
}

function getDaysBetween(date1: string, date2: string): number {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  d1.setHours(0, 0, 0, 0);
  d2.setHours(0, 0, 0, 0);
  return Math.round((d2.getTime() - d1.getTime()) / 86400000);
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      theme: 'light',
      activeTrack: 'english',
      unlockedEn: [1],
      unlockedJa: [1],
      dailyReviewLimit: DEFAULT_DAILY_REVIEW_LIMIT,
      openAIApiKey: null,
      lastStudyDate: null,
      currentStreak: 0,
      longestStreak: 0,

      toggleTheme: () => set((state) => {
        const newTheme = state.theme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        return { theme: newTheme };
      }),

      setActiveTrack: (track) => set(() => {
        document.documentElement.setAttribute('data-track', track);
        return { activeTrack: track };
      }),

      setProgress: (unlockedEn, unlockedJa) => set({ unlockedEn, unlockedJa }),

      initializeDOM: () => {
        const { theme, activeTrack } = get();
        document.documentElement.setAttribute('data-theme', theme);
        document.documentElement.setAttribute('data-track', activeTrack);
        document.body.style.fontFamily = "'Nunito', 'Quicksand', sans-serif";
      },

      setDailyReviewLimit: (limit) => set({ dailyReviewLimit: limit }),

      setOpenAIApiKey: (key) => set({ openAIApiKey: key }),

      recordStudyDay: () => {
        const { lastStudyDate, currentStreak, longestStreak } = get();
        const today = new Date().toISOString().split('T')[0];

        if (lastStudyDate === today) {
          // Already studied today, no change
          return;
        }

        let newStreak = 1;
        if (lastStudyDate) {
          const daysDiff = getDaysBetween(lastStudyDate, today);
          if (daysDiff === 1) {
            // Consecutive day
            newStreak = currentStreak + 1;
          }
          // else: gap > 1 day, streak resets to 1
        }

        set({
          lastStudyDate: today,
          currentStreak: newStreak,
          longestStreak: Math.max(longestStreak, newStreak),
        });
      },
    }),
    {
      name: 'lingo-user-prefs',
    }
  )
);
