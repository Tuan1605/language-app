import type { ListeningLesson, SpeakingLesson, DictationLesson, WritingLesson, FullExam } from '../types';

// Cache for loaded mock data
let cachedData: {
  listening?: ListeningLesson[];
  speaking?: SpeakingLesson[];
  dictation?: DictationLesson[];
  writing?: WritingLesson[];
  exams?: FullExam[];
} = {};

// Loading promises to prevent duplicate loads
const loadingPromises: Record<string, Promise<unknown>> = {};

async function loadMockData() {
  // If already loading, wait for existing promise
  if (loadingPromises['mockData']) {
    return loadingPromises['mockData'];
  }

  const promise = import('./mockData').then((module) => {
    cachedData = {
      listening: module.MOCK_LISTENING_LESSONS,
      speaking: module.MOCK_SPEAKING_LESSONS,
      dictation: module.MOCK_DICTATION_LESSONS,
      writing: module.MOCK_WRITING_LESSONS,
      exams: module.MOCK_FULL_EXAMS,
    };
    return cachedData;
  });

  loadingPromises['mockData'] = promise;
  return promise;
}

export async function getListeningLessons(): Promise<ListeningLesson[]> {
  if (cachedData.listening) return cachedData.listening;
  await loadMockData();
  return cachedData.listening || [];
}

export async function getSpeakingLessons(): Promise<SpeakingLesson[]> {
  if (cachedData.speaking) return cachedData.speaking;
  await loadMockData();
  return cachedData.speaking || [];
}

export async function getDictationLessons(): Promise<DictationLesson[]> {
  if (cachedData.dictation) return cachedData.dictation;
  await loadMockData();
  return cachedData.dictation || [];
}

export async function getWritingLessons(): Promise<WritingLesson[]> {
  if (cachedData.writing) return cachedData.writing;
  await loadMockData();
  return cachedData.writing || [];
}

export async function getFullExams(): Promise<FullExam[]> {
  if (cachedData.exams) return cachedData.exams;
  await loadMockData();
  return cachedData.exams || [];
}

export async function getAllMockData() {
  if (cachedData.listening) {
    return cachedData;
  }
  return loadMockData();
}

/** Preload mock data in background (non-blocking) */
export function preloadMockData(): void {
  if (cachedData.listening) return; // Already loaded
  if (typeof requestIdleCallback !== 'undefined') {
    requestIdleCallback(() => loadMockData());
  } else {
    setTimeout(() => loadMockData(), 0);
  }
}
