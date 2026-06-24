import { useState, useEffect } from 'react';
import type { Flashcard, ExamResult, SessionTask, FullExam, GrammarPoint, KanjiEntry, AuthenticExam, Mistake } from '../types';
import { MOCK_QUESTIONS, MOCK_CARDS } from '../utils/mockData';
import { loadCards, saveCards, loadProgress, saveProgress, loadExamResults, saveExamResults, loadTheme, saveTheme, loadMistakes, saveMistakes } from '../utils/storage';

export type AppMode =
  | 'path' | 'practice' | 'session' | 'add'
  | 'collection' | 'analytics' | 'review'
  | 'create-exam' | 'notebook' | 'real-exam' | 'mistakes' | 'review-mistakes';

export function useAppState() {
  const [cards, setCards] = useState<Flashcard[]>(() => loadCards() || MOCK_CARDS);
  const [examResults, setExamResults] = useState<ExamResult[]>(() => loadExamResults());
  const [mistakes, setMistakes] = useState<Mistake[]>(() => loadMistakes());
  const [mode, setMode] = useState<AppMode>('path');
  const [theme, setTheme] = useState<'light' | 'dark'>(() => loadTheme());
  const [activeTrack, setActiveTrack] = useState<'english' | 'japanese'>('english');
  const [unlockedEn, setUnlockedEn] = useState(() => loadProgress().unlocked_en);
  const [unlockedJa, setUnlockedJa] = useState(() => loadProgress().unlocked_ja);
  const [streak, setStreak] = useState(() => loadProgress().streak || 0);
  const [lastActiveDate, setLastActiveDate] = useState(() => loadProgress().lastActiveDate || '');
  const [customExams, setCustomExams] = useState<FullExam[]>([]);
  const [questions, setQuestions] = useState(() => MOCK_QUESTIONS);
  const [n2Grammar, setN2Grammar] = useState<GrammarPoint[]>([]);
  const [n2Kanji, setN2Kanji] = useState<KanjiEntry[]>([]);
  const [toeicGrammar, setToeicGrammar] = useState<GrammarPoint[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const [sessionTasks, setSessionTasks] = useState<SessionTask[]>([]);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [isSessionFinished, setIsSessionFinished] = useState(false);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [currentAuthenticExam, setCurrentAuthenticExam] = useState<AuthenticExam | null>(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('data-track', activeTrack);
    document.body.style.fontFamily = "'Nunito', 'Quicksand', sans-serif";
  }, [theme, activeTrack]);

  useEffect(() => { saveTheme(theme); }, [theme]);
  useEffect(() => { saveCards(cards); }, [cards]);
  useEffect(() => { saveProgress({ unlocked_en: unlockedEn, unlocked_ja: unlockedJa, streak, lastActiveDate }); }, [unlockedEn, unlockedJa, streak, lastActiveDate]);
  useEffect(() => { saveExamResults(examResults); }, [examResults]);
  useEffect(() => { saveMistakes(mistakes); }, [mistakes]);

  useEffect(() => {
    import('../data/contentLoader').then(({ loadSeedN2Grammar, loadSeedN2Kanji, loadSeedQuestions, loadSeedToeicGrammar, loadSeedFlashcards }) => {
      Promise.all([
        loadSeedN2Grammar().then(setN2Grammar),
        loadSeedN2Kanji().then(setN2Kanji),
        loadSeedToeicGrammar().then(setToeicGrammar),
        loadSeedQuestions().then(loaded => setQuestions(prev => [...prev, ...loaded])),
        loadSeedFlashcards().then(seedCards => setCards(prev => {
          const existingIds = new Set(prev.map(c => c.id));
          const newCards = seedCards.filter(c => !existingIds.has(c.id));
          return [...prev, ...newCards];
        }))
      ]).catch(err => console.error("Failed to load initial data:", err))
      .finally(() => setIsLoadingData(false));
    });
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return {
    cards, setCards,
    examResults, setExamResults,
    mistakes, setMistakes,
    mode, setMode,
    theme, toggleTheme,
    activeTrack, setActiveTrack,
    unlockedEn, setUnlockedEn,
    unlockedJa, setUnlockedJa,
    streak, setStreak,
    lastActiveDate, setLastActiveDate,
    customExams, setCustomExams,
    questions, setQuestions,
    n2Grammar, n2Kanji, toeicGrammar,
    isLoadingData,
    sessionTasks, setSessionTasks,
    currentTaskIndex, setCurrentTaskIndex,
    isSessionFinished, setIsSessionFinished,
    currentReviewIndex, setCurrentReviewIndex,
    currentAuthenticExam, setCurrentAuthenticExam
  };
}
