import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../stores/useUserStore';
import { useAppStore } from '../stores/useAppStore';
import { db } from '../data/db';
import { calculateSM2, getNextReviewDate } from '../utils/sm2';
import type { ReviewGrade, Flashcard, SessionTask, FullExam, AuthenticExam, ExamResult, Difficulty } from '../types';
import toast from 'react-hot-toast';

const trackCategory = (track: 'english' | 'japanese'): 'toeic' | 'n2' =>
  track === 'english' ? 'toeic' : 'n2';

export function useAppActions() {
  const navigate = useNavigate();

  const handleRemoveCard = async (id: string) => {
    await db.cards.delete(id);
  };

  const handleRemoveCards = async (ids: string[]) => {
    await db.cards.bulkDelete(ids);
  };

  const handleRemoveMistake = async (id: string) => {
    await db.mistakes.delete(id);
  };

  const handleEditCard = async (updatedCard: Flashcard) => {
    await db.cards.put(updatedCard);
  };

  const difficultyOrder = (d: string) => d === 'beginner' ? 0 : d === 'intermediate' ? 1 : 2;
  const sortByDifficulty = <T extends { difficulty: string }>(items: T[]): T[] =>
    [...items].sort((a, b) => difficultyOrder(a.difficulty) - difficultyOrder(b.difficulty));

  const sampleAcrossDifficulties = <T extends { difficulty: Difficulty }>(items: T[], total: number): T[] => {
    const byDiff: Record<string, T[]> = { beginner: [], intermediate: [], advanced: [] };
    items.forEach(item => { if (byDiff[item.difficulty]) byDiff[item.difficulty].push(item); });
    const perLevel = Math.max(1, Math.floor(total / 3));
    const sampled = [
      ...byDiff.beginner.slice(0, perLevel),
      ...byDiff.intermediate.slice(0, perLevel),
      ...byDiff.advanced.slice(0, total - perLevel * 2),
    ];
    return sortByDifficulty(sampled);
  };

  const startSession = async (nodeIdx: number, unitDifficulty: Difficulty, unitTopics: string[]) => {
    const activeTrack = useUserStore.getState().activeTrack;
    const cat = trackCategory(activeTrack);

    // Fetch from Dexie
    const allCards = await db.cards.where('language').equals(activeTrack).toArray();
    const allQuestions = await db.questions.where('category').equals(cat).toArray();

    // Fetch from AppStore
    const appState = useAppStore.getState();

    // Filter by unit topics first, then by difficulty
    const topicSet = new Set(unitTopics.map(t => t.toLowerCase()));

    const topicVocab = allCards.filter(c => c.topic && topicSet.has(c.topic.toLowerCase()));
    const filteredVocab = topicVocab.length > 0
      ? topicVocab.filter(c => c.difficulty === unitDifficulty)
      : allCards.filter(c => c.difficulty === unitDifficulty);
    const vList = filteredVocab.length > 0 ? filteredVocab : allCards;

    const topicQuizzes = allQuestions.filter(q => q.subCategory && topicSet.has(q.subCategory.toLowerCase()));
    const filteredQuizzes = topicQuizzes.length > 0
      ? topicQuizzes.filter(q => q.difficulty === unitDifficulty)
      : allQuestions.filter(q => q.difficulty === unitDifficulty);
    const qList = filteredQuizzes.length > 0 ? filteredQuizzes : allQuestions;

    const filteredListen = appState.mockListeningLessons.filter(l => l.category === cat && l.difficulty === unitDifficulty);
    const lList = filteredListen.length > 0 ? filteredListen : appState.mockListeningLessons.filter(l => l.category === cat);

    const filteredSpeak = appState.mockSpeakingLessons.filter(s => s.category === cat && s.difficulty === unitDifficulty);
    const sList = filteredSpeak.length > 0 ? filteredSpeak : appState.mockSpeakingLessons.filter(s => s.category === cat);

    const filteredDict = appState.mockDictationLessons.filter(d => d.category === cat && d.difficulty === unitDifficulty);
    const dList = filteredDict.length > 0 ? filteredDict : appState.mockDictationLessons.filter(d => d.category === cat);

    // Shuffle and pick based on nodeIdx for progressive content
    const shuffle = <T,>(arr: T[]): T[] => {
      const a = [...arr];
      for (let i = a.length - 1; i > 0; i--) {
        const j = (nodeIdx * 7 + i * 13) % (i + 1);
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    };

    const pick = <T,>(list: T[]): T | undefined =>
      list.length > 0 ? shuffle(list)[nodeIdx % list.length] : undefined;

    const candidates: (SessionTask | null)[] = [
      vList.length ? { type: 'vocab-quiz', data: pick(vList)! } : null,
      qList.length ? { type: 'quiz', data: pick(qList)! } : null,
      lList.length ? { type: 'listening', data: pick(lList)! } : null,
      dList.length ? { type: 'dictation', data: pick(dList)! } : null,
      sList.length ? { type: 'speaking', data: pick(sList)! } : null,
    ];
    const newTasks: SessionTask[] = candidates.filter((t): t is SessionTask => t !== null);

    if (newTasks.length === 0) {
      toast.error("No content available for this node yet.");
      return;
    }

    appState.setSessionTasks(newTasks);
    appState.setCurrentTaskIndex(0);
    appState.setIsSessionFinished(false);
    navigate('/session');
  };

  const startDrill = async (type: SessionTask['type'] | 'review') => {
    const appState = useAppStore.getState();
    const activeTrack = useUserStore.getState().activeTrack;

    if (type === 'review') { 
      appState.setCurrentReviewIndex(0); 
      navigate('/review'); 
      return; 
    }
    const cat = trackCategory(activeTrack);

    if (type === 'grammar') {
      const grammarPool = await db.grammar.where('track').equals(cat).toArray();
      if (grammarPool.length === 0) {
        toast.error("No grammar content available.");
        return;
      }
      const sampled = sampleAcrossDifficulties(grammarPool, 10);
      const newTasks: SessionTask[] = sampled.map(point => {
        const options = [point.pattern];
        const sameDifficultyGrammar = grammarPool.filter(g => g.difficulty === point.difficulty && g.pattern !== point.pattern);
        const distractorPool = sameDifficultyGrammar.length >= 3 ? sameDifficultyGrammar : grammarPool;

        while (options.length < 4 && options.length < grammarPool.length) {
          const randomPattern = distractorPool[Math.floor(Math.random() * distractorPool.length)].pattern;
          if (!options.includes(randomPattern)) {
            options.push(randomPattern);
          }
        }
        for (let i = options.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [options[i], options[j]] = [options[j], options[i]];
        }
        const correctIndex = options.indexOf(point.pattern);
        return { type: 'grammar', data: { id: `grammar-${point.id}`, point, options, correctIndex } };
      });
      appState.setSessionTasks(newTasks);
      appState.setCurrentTaskIndex(0); 
      appState.setIsSessionFinished(false); 
      navigate('/session');
      return;
    }

    const filtered = (type === 'vocab-quiz') ? await db.cards.where('language').equals(activeTrack).toArray() :
                     (type === 'quiz') ? await db.questions.where('category').equals(cat).toArray() :
                     (type === 'listening') ? appState.mockListeningLessons.filter(l => l.category === cat) :
                     (type === 'speaking') ? appState.mockSpeakingLessons.filter(s => s.category === cat) :
                     appState.mockDictationLessons.filter(d => d.category === cat);
    const sampled = sampleAcrossDifficulties(filtered as (typeof filtered[number] & { difficulty: string })[], 10);
    const newTasks: SessionTask[] = sampled.map(item => ({ type, data: item }) as SessionTask);
    
    if (newTasks.length === 0) {
      toast.error("No content available for this practice yet.");
      return;
    }

    appState.setSessionTasks(newTasks);
    appState.setCurrentTaskIndex(0); 
    appState.setIsSessionFinished(false); 
    navigate('/session');
  };

  const startFullExam = (exam: FullExam) => {
    const appState = useAppStore.getState();
    appState.setSessionTasks(exam.tasks);
    appState.setCurrentTaskIndex(0);
    appState.setIsSessionFinished(false);
    navigate('/session');
  };

  const startAuthenticExam = (exam: AuthenticExam) => {
    const appState = useAppStore.getState();
    appState.setCurrentAuthenticExam(exam);
    navigate('/real-exam');
  };

  const recordExamResult = async (result: ExamResult) => {
    await db.examResults.add(result);
  };

  const handleSessionQuizComplete = (result: ExamResult) => {
    recordExamResult(result);
    nextTask();
  };

  const handleRateCard = async (grade: ReviewGrade) => {
    const appState = useAppStore.getState();
    const activeTrack = useUserStore.getState().activeTrack;
    
    const today = new Date().getTime();
    const reviewQueue = await db.cards
      .where('language').equals(activeTrack)
      .and(c => c.next_review != null && new Date(c.next_review).getTime() <= today)
      .toArray();
      
    const card = reviewQueue[appState.currentReviewIndex];
    if (!card) { navigate('/'); return; }
    
    const { repetition, interval, easiness } = calculateSM2(grade, card.repetition, card.interval, card.easiness);
    const updatedCard = {
      ...card,
      repetition,
      interval,
      easiness,
      next_review: getNextReviewDate(interval),
      status: 'review' as const
    };

    await db.cards.put(updatedCard);
    nextReviewCard(reviewQueue.length);
  };

  const handleArchiveCard = async () => {
    const appState = useAppStore.getState();
    const activeTrack = useUserStore.getState().activeTrack;
    
    const today = new Date().getTime();
    const reviewQueue = await db.cards
      .where('language').equals(activeTrack)
      .and(c => c.next_review != null && new Date(c.next_review).getTime() <= today)
      .toArray();
      
    const card = reviewQueue[appState.currentReviewIndex];
    if (!card) { navigate('/'); return; }
    
    await handleRemoveCard(card.id);
    nextReviewCard(reviewQueue.length);
  };

  const nextReviewCard = (queueLength: number) => {
    const appState = useAppStore.getState();
    if (appState.currentReviewIndex < queueLength - 1) {
      appState.setCurrentReviewIndex(appState.currentReviewIndex + 1);
    } else {
      toast.success("Review session complete!");
      navigate('/');
    }
  };

  const nextTask = () => {
    const appState = useAppStore.getState();
    if (appState.currentTaskIndex < appState.sessionTasks.length - 1) {
      appState.setCurrentTaskIndex(appState.currentTaskIndex + 1);
    } else {
      appState.setIsSessionFinished(true);
    }
  };

  const finalizeSession = async () => {
    const appState = useAppStore.getState();
    const userStore = useUserStore.getState();
    
    const cat = trackCategory(userStore.activeTrack);
    await recordExamResult({
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      score: 100,
      totalQuestions: 100,
      category: cat,
      difficulty: 'beginner',
      type: 'mock-exam'
    });

    if (userStore.activeTrack === 'english') {
      userStore.setProgress([...userStore.unlockedEn, Math.max(...userStore.unlockedEn) + 1], userStore.unlockedJa, userStore.streak);
    } else {
      userStore.setProgress(userStore.unlockedEn, [...userStore.unlockedJa, Math.max(...userStore.unlockedJa) + 1], userStore.streak);
    }
    
    appState.setSessionTasks([]);
    appState.setIsSessionFinished(false);
    navigate('/');
  };

  return {
    handleRemoveCard,
    handleRemoveCards,
    handleRemoveMistake,
    handleEditCard,
    startSession,
    startDrill,
    startFullExam,
    startAuthenticExam,
    handleSessionQuizComplete,
    handleRateCard,
    handleArchiveCard,
    nextTask,
    finalizeSession,
    trackCategory
  };
}
