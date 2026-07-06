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
  toggleTheme: () => void;
  setActiveTrack: (track: LanguageTrack) => void;
  getUnlocked: (track: string) => number[];
  setUnlocked: (track: string, paths: number[]) => void;
  setProgress: (unlockedEn: number[], unlockedJa: number[]) => void;
  initializeDOM: () => void;
  setDailyReviewLimit: (limit: number) => void;
  setOpenAIApiKey: (key: string | null) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      theme: 'light',
      activeTrack: 'english',
      unlockedPaths: { english: [1], japanese: [1] },
      dailyReviewLimit: DEFAULT_DAILY_REVIEW_LIMIT,
      openAIApiKey: null,

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
    }),
    {
      name: 'lingo-user-prefs',
      // Migrate old format to new format
      merge: (persistedState, currentState) => {
        const state = { ...currentState, ...(persistedState as Partial<UserState>) };
        return state as UserState;
      },
    }
  )
);

