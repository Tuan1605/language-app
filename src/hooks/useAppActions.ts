import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../stores/useUserStore';
import { useAppStore } from '../stores/useAppStore';
import { db } from '../data/db';
import { calculateSM2, getNextReviewDate } from '../utils/sm2';
import type { ReviewGrade, Flashcard, SessionTask, FullExam, AuthenticExam, ExamResult, Difficulty, GrammarPoint } from '../types';
import toast from 'react-hot-toast';

const trackCategory = (track: 'english' | 'japanese'): 'toeic' | 'n2' =>
  track === 'english' ? 'toeic' : 'n2';

// Generate fill-in-the-blank options for grammar questions
function generateGrammarOptions(point: GrammarPoint): { correctAnswer: string; distractors: string[] } {
  const blanked = point.blankedExample || '';
  
  // Extract the blank content from blankedExample (text between parentheses)
  const blankMatch = blanked.match(/\(([^)]+)\)/);
  const blankContent = blankMatch ? blankMatch[1] : '';
  
  // Try to extract the correct answer from the example by finding what fills the blank
  let correctAnswer = '';
  
  // Common grammar patterns and their expected answers
  const patternAnswers: Record<string, string[]> = {
    'Present Perfect': ['have worked', 'has worked', 'have finished', 'has finished', 'have seen', 'has seen'],
    'Past Perfect': ['had left', 'had finished', 'had already left', 'had gone', 'had been'],
    'Future Perfect': ['will have completed', 'will have finished', 'will have done', 'will have gone'],
    'Present Perfect Continuous': ['have been working', 'has been working', 'have been studying', 'has been waiting'],
    'Passive Voice': ['was written', 'was made', 'was called', 'were built', 'was sent'],
    'Modal Verbs': ['must', 'should', 'can', 'could', 'would', 'might', 'may'],
    'Conditionals': ['will cancel', 'would go', 'would have gone', 'will happen'],
    'Reported Speech': ['said that he was', 'told me that she had', 'asked if the'],
    'Gerunds vs. Infinitives': ['enjoy reading', 'want to read', 'finished writing', 'decided to go'],
    'Simple Present': ['holds', 'goes', 'works', 'takes', 'makes'],
    'Simple Past': ['submitted', 'visited', 'called', 'finished', 'started'],
    'Simple Future': ['will launch', 'will start', 'will go', 'will meet'],
    'Present Continuous': ['is preparing', 'is working', 'is writing', 'is making'],
    'Past Continuous': ['was working', 'was reading', 'was waiting', 'was cooking'],
    'Comparatives': ['more interesting', 'better than', 'more efficient', 'faster than'],
    'Prepositions': ['on', 'at', 'in', 'by', 'with'],
    'Articles': ['a', 'an', 'the'],
    'Quantifiers': ['some', 'many', 'much', 'a few', 'a lot of'],
    'Wish': ['had', 'were', 'could', 'would'],
  };
  
  // Find matching pattern
  for (const [pattern, answers] of Object.entries(patternAnswers)) {
    if (point.pattern.includes(pattern)) {
      correctAnswer = answers[Math.floor(Math.random() * answers.length)];
      break;
    }
  }
  
  // Fallback: extract from example
  if (!correctAnswer && blankContent) {
    const blankWords = blankContent.split(' ');
    if (blankWords.length > 0) {
      correctAnswer = blankWords[0];
    }
  }
  
  // Ultimate fallback
  if (!correctAnswer) {
    correctAnswer = 'the correct answer';
  }
  
  // Generate distractors (wrong answers)
  const allVerbForms = [
    'worked', 'have worked', 'was working', 'will work', 'is working',
    'had worked', 'would work', 'could work', 'should work', 'might work',
    'goes', 'went', 'have gone', 'was going', 'will go', 'is going',
    'takes', 'took', 'has taken', 'was taking', 'will take', 'is taking',
    'makes', 'made', 'has made', 'was making', 'will make', 'is making',
    'writes', 'wrote', 'has written', 'was writing', 'will write', 'is writing',
    'says', 'said', 'has said', 'was saying', 'will say', 'is saying',
  ];
  
  const distractors: string[] = [];
  while (distractors.length < 3) {
    const rand = allVerbForms[Math.floor(Math.random() * allVerbForms.length)];
    if (rand !== correctAnswer && !distractors.includes(rand)) {
      distractors.push(rand);
    }
  }
  
  return { correctAnswer, distractors };
}

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
        // Generate fill-in-the-blank options based on grammar pattern
        const { correctAnswer, distractors } = generateGrammarOptions(point);
        const options = [correctAnswer, ...distractors];
        // Shuffle options
        for (let i = options.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [options[i], options[j]] = [options[j], options[i]];
        }
        const correctIndex = options.indexOf(correctAnswer);
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
