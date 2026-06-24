import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserState {
  theme: 'light' | 'dark';
  activeTrack: 'english' | 'japanese';
  unlockedEn: number[];
  unlockedJa: number[];
  streak: number;
  toggleTheme: () => void;
  setActiveTrack: (track: 'english' | 'japanese') => void;
  setProgress: (unlockedEn: number[], unlockedJa: number[], streak: number) => void;
  initializeDOM: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      theme: 'light',
      activeTrack: 'english',
      unlockedEn: [1],
      unlockedJa: [1],
      streak: 0,
      toggleTheme: () => set((state) => {
        const newTheme = state.theme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        return { theme: newTheme };
      }),
      setActiveTrack: (track) => set(() => {
        document.documentElement.setAttribute('data-track', track);
        return { activeTrack: track };
      }),
      setProgress: (unlockedEn, unlockedJa, streak) => set({ unlockedEn, unlockedJa, streak }),
      initializeDOM: () => {
        const { theme, activeTrack } = get();
        document.documentElement.setAttribute('data-theme', theme);
        document.documentElement.setAttribute('data-track', activeTrack);
        document.body.style.fontFamily = "'Nunito', 'Quicksand', sans-serif";
      }
    }),
    {
      name: 'lingo-user-prefs',
    }
  )
);
