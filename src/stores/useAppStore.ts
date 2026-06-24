import { create } from 'zustand';
import type { SessionTask, AuthenticExam, ListeningLesson, SpeakingLesson, DictationLesson, FullExam } from '../types';

interface AppState {
  isLoadingData: boolean;
  setIsLoadingData: (v: boolean) => void;
  
  sessionTasks: SessionTask[];
  setSessionTasks: (tasks: SessionTask[]) => void;
  currentTaskIndex: number;
  setCurrentTaskIndex: (i: number) => void;
  isSessionFinished: boolean;
  setIsSessionFinished: (v: boolean) => void;
  currentReviewIndex: number;
  setCurrentReviewIndex: (i: number) => void;
  currentAuthenticExam: AuthenticExam | null;
  setCurrentAuthenticExam: (exam: AuthenticExam | null) => void;

  // Mock data that doesn't need to be in Dexie for now
  mockListeningLessons: ListeningLesson[];
  mockSpeakingLessons: SpeakingLesson[];
  mockDictationLessons: DictationLesson[];
  mockFullExams: FullExam[];
  setMockData: (data: Partial<AppState>) => void;
}

export const useAppStore = create<AppState>((set) => ({
  isLoadingData: true,
  setIsLoadingData: (v) => set({ isLoadingData: v }),
  
  sessionTasks: [],
  setSessionTasks: (tasks) => set({ sessionTasks: tasks }),
  currentTaskIndex: 0,
  setCurrentTaskIndex: (i) => set({ currentTaskIndex: i }),
  isSessionFinished: false,
  setIsSessionFinished: (v) => set({ isSessionFinished: v }),
  currentReviewIndex: 0,
  setCurrentReviewIndex: (i) => set({ currentReviewIndex: i }),
  currentAuthenticExam: null,
  setCurrentAuthenticExam: (exam) => set({ currentAuthenticExam: exam }),

  mockListeningLessons: [],
  mockSpeakingLessons: [],
  mockDictationLessons: [],
  mockFullExams: [],
  setMockData: (data) => set((state) => ({ ...state, ...data }))
}));
