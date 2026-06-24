import { useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { AddFlashcard } from './components/AddFlashcard';
import { FlashcardView } from './components/FlashcardView';
import { QuizView } from './components/QuizView';
import { ListeningView } from './components/ListeningView';
import { SpeakingView } from './components/SpeakingView';
import { DictationView } from './components/DictationView';
import { WritingView } from './components/WritingView';
import { VocabQuizView } from './components/VocabQuizView';
import { GrammarQuizView } from './components/GrammarQuizView';
import { CollectionView } from './components/CollectionView';
import { AnalyticsView } from './components/AnalyticsView';
import { CreateExamView } from './components/CreateExamView';
import { NotebookView } from './components/NotebookView';
import { GamifiedPath } from './components/GamifiedPath';
import { ReviewReminder } from './components/ReviewReminder';
import { RealExamView } from './components/RealExamView';
import { MistakeBookView } from './components/MistakeBookView';
import { MistakeReviewView } from './components/MistakeReviewView';
import { OnboardingOverlay } from './components/OnboardingOverlay';
import type { Flashcard, ExamResult, Difficulty, SessionTask, FullExam, AuthenticExam, GrammarPoint, ListeningLesson, SpeakingLesson, DictationLesson, WritingLesson, Question } from './types';
import { calculateSM2, getNextReviewDate } from './utils/sm2';
import { MOCK_LISTENING_LESSONS, MOCK_SPEAKING_LESSONS, MOCK_DICTATION_LESSONS, MOCK_FULL_EXAMS } from './utils/mockData';
import { AUTHENTIC_EXAMS } from './data/authenticExams';
import { TOEIC_CURRICULUM, N2_CURRICULUM } from './data/curriculums';
import { useAppState } from './hooks/useAppState';
import type { ReviewGrade } from './types';

// Map the active learning track to its content category. Centralised so the
// TOEIC/N2 switch is applied consistently across filtering and result saving.
const trackCategory = (track: 'english' | 'japanese'): 'toeic' | 'n2' =>
  track === 'english' ? 'toeic' : 'n2';

function App() {
  const {
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
    questions,
    n2Grammar, n2Kanji, toeicGrammar,
    isLoadingData,
    sessionTasks, setSessionTasks,
    currentTaskIndex, setCurrentTaskIndex,
    isSessionFinished, setIsSessionFinished,
    currentReviewIndex, setCurrentReviewIndex,
    currentAuthenticExam, setCurrentAuthenticExam
  } = useAppState();

  useEffect(() => {
    if (isSessionFinished) {
      const today = new Date().toISOString().split('T')[0];
      if (lastActiveDate !== today) {
        const yesterdayDate = new Date();
        yesterdayDate.setDate(yesterdayDate.getDate() - 1);
        const yesterday = yesterdayDate.toISOString().split('T')[0];

        if (lastActiveDate === yesterday) {
          setStreak(s => (s || 0) + 1);
        } else {
          setStreak(1);
        }
        setLastActiveDate(today);
      }
    }
  }, [isSessionFinished, lastActiveDate, setLastActiveDate, setStreak]);

  const handleRemoveCard = (id: string) => {
    setCards(cards.filter(c => c.id !== id));
  };

  const handleRemoveCards = (ids: string[]) => {
    setCards(cards.filter(c => !ids.includes(c.id)));
  };

  const handleRemoveMistake = (id: string) => {
    setMistakes(mistakes.filter(m => m.id !== id));
  };

  const handleEditCard = (updatedCard: Flashcard) => {
    setCards(cards.map(c => c.id === updatedCard.id ? updatedCard : c));
  };

  const startSession = (nodeIdx: number, unitDifficulty: Difficulty) => {
    const cat = trackCategory(activeTrack);
    const filteredVocab = cards.filter(c => c.language === activeTrack && c.difficulty === unitDifficulty);
    const filteredQuizzes = questions.filter(q => q.category === cat && q.difficulty === unitDifficulty);
    const filteredListen = MOCK_LISTENING_LESSONS.filter(l => l.category === cat && l.difficulty === unitDifficulty);
    const filteredSpeak = MOCK_SPEAKING_LESSONS.filter(s => s.category === cat && s.difficulty === unitDifficulty);
    const filteredDict = MOCK_DICTATION_LESSONS.filter(d => d.category === cat && d.difficulty === unitDifficulty);

    const vList = filteredVocab.length > 0 ? filteredVocab : cards.filter(c => c.language === activeTrack);
    const qList = filteredQuizzes.length > 0 ? filteredQuizzes : questions.filter(q => q.category === cat);
    const lList = filteredListen.length > 0 ? filteredListen : MOCK_LISTENING_LESSONS.filter(l => l.category === cat);
    const sList = filteredSpeak.length > 0 ? filteredSpeak : MOCK_SPEAKING_LESSONS.filter(s => s.category === cat);
    const dList = filteredDict.length > 0 ? filteredDict : MOCK_DICTATION_LESSONS.filter(d => d.category === cat);

    // Build tasks, skipping any lesson type that has no available data so we
    // never index into an empty array (which would create an undefined task).
    const pick = <T,>(list: T[]): T | undefined =>
      list.length > 0 ? list[nodeIdx % list.length] : undefined;

    const candidates: (SessionTask | null)[] = [
      vList.length ? { type: 'vocab-quiz', data: pick(vList)! } : null,
      qList.length ? { type: 'quiz', data: pick(qList)! } : null,
      lList.length ? { type: 'listening', data: pick(lList)! } : null,
      dList.length ? { type: 'dictation', data: pick(dList)! } : null,
      sList.length ? { type: 'speaking', data: pick(sList)! } : null,
    ];
    const newTasks: SessionTask[] = candidates.filter(
      (t): t is SessionTask => t !== null
    );

    if (newTasks.length === 0) {
      toast.error("No content available for this node yet.");
      return;
    }

    setSessionTasks(newTasks);
    setCurrentTaskIndex(0); setIsSessionFinished(false); setMode('session');
  };

  // Sort helper: order items beginner → intermediate → advanced
  const difficultyOrder = (d: string) => d === 'beginner' ? 0 : d === 'intermediate' ? 1 : 2;
  const sortByDifficulty = <T extends { difficulty: string }>(items: T[]): T[] =>
    [...items].sort((a, b) => difficultyOrder(a.difficulty) - difficultyOrder(b.difficulty));

  // Sample evenly across difficulty levels, then sort easy→hard
  const sampleAcrossDifficulties = <T extends { difficulty: string }>(items: T[], total: number): T[] => {
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

  const startDrill = (type: SessionTask['type'] | 'review') => {
    if (type === 'review') { setCurrentReviewIndex(0); setMode('review'); return; }
    const cat = trackCategory(activeTrack);

    if (type === 'grammar') {
      if (n2Grammar.length === 0) {
        toast.error("No grammar content available.");
        return;
      }
      const sampled = sampleAcrossDifficulties(n2Grammar as any, 10) as GrammarPoint[];
      const newTasks: SessionTask[] = sampled.map(point => {
        const options = [point.pattern];
        
        // Distractors should ideally be of the same difficulty level
        const sameDifficultyGrammar = n2Grammar.filter(g => g.difficulty === point.difficulty && g.pattern !== point.pattern);
        const distractorPool = sameDifficultyGrammar.length >= 3 ? sameDifficultyGrammar : n2Grammar;

        while (options.length < 4 && options.length < n2Grammar.length) {
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
      setSessionTasks(newTasks);
      setCurrentTaskIndex(0); setIsSessionFinished(false); setMode('session');
      return;
    }

    const filtered = (type === 'vocab-quiz') ? cards.filter(c => c.language === activeTrack) :
                     (type === 'quiz') ? questions.filter(q => q.category === cat) :
                     (type === 'listening') ? MOCK_LISTENING_LESSONS.filter(l => l.category === cat) :
                     (type === 'speaking') ? MOCK_SPEAKING_LESSONS.filter(s => s.category === cat) :
                     MOCK_DICTATION_LESSONS.filter(d => d.category === cat);
    const sampled = sampleAcrossDifficulties(filtered as (typeof filtered[number] & { difficulty: string })[], 10);
    const newTasks: SessionTask[] = sampled.map(item => ({ type, data: item }) as SessionTask);
    
    if (newTasks.length === 0) {
      toast.error("No content available for this practice yet.");
      return;
    }

    setSessionTasks(newTasks);
    setCurrentTaskIndex(0); setIsSessionFinished(false); setMode('session');
  };

  const startFullExam = (exam: FullExam) => {
    setSessionTasks(exam.tasks);
    setCurrentTaskIndex(0);
    setIsSessionFinished(false);
    setMode('session');
  };

  const startAuthenticExam = (exam: AuthenticExam) => {
    setCurrentAuthenticExam(exam);
    setMode('real-exam');
  };

  // Persist an ExamResult so AnalyticsView and the saved history stay in sync.
  const recordExamResult = (result: ExamResult) => {
    setExamResults((prev) => [...prev, result]);
  };

  // Aggregate score for a quiz task inside a session. Called when a quiz task
  // completes; we turn the per-question ExamResult into a saved history entry.
  const handleSessionQuizComplete = (result: ExamResult) => {
    recordExamResult(result);
    nextTask();
  };

  const handleRateCard = (grade: ReviewGrade) => {
    const reviewQueue = cards.filter(c => c.language === activeTrack);
    const card = reviewQueue[currentReviewIndex];
    if (!card) { setMode('path'); return; }
    
    // Save previous state for undo
    const oldCard = { ...card };
    const oldIndex = currentReviewIndex;

    const { repetition, interval, easiness } = calculateSM2(grade, card.repetition, card.interval, card.easiness);
    const updatedCard = {
      ...card,
      repetition,
      interval,
      easiness,
      next_review: getNextReviewDate(interval)
    };

    setCards(cards.map((c) => (c.id === card.id ? updatedCard : c)));
    if (currentReviewIndex < reviewQueue.length - 1) setCurrentReviewIndex(prev => prev + 1);
    else setMode('path');

    // Show Undo Toast
    toast((t) => (
      <div className="flex items-center gap-3">
        <span>Card graded.</span>
        <button
          onClick={() => {
            toast.dismiss(t.id);
            setCards(currentCards => currentCards.map(c => c.id === oldCard.id ? oldCard : c));
            setCurrentReviewIndex(oldIndex);
            setMode('review');
          }}
          className="bg-[var(--bg-main)] text-[var(--blue)] px-3 py-1 rounded-md text-xs font-bold uppercase border border-[var(--border-main)] hover:bg-[var(--tint-blue)]"
        >
          Undo
        </button>
      </div>
    ), { id: `undo-${card.id}`, duration: 4000 });
  };

  const nextTask = () => {
    if (currentTaskIndex < sessionTasks.length - 1) setCurrentTaskIndex(prev => prev + 1);
    else setIsSessionFinished(true);
  };

  const finalizeSession = () => {
    if (mode === 'session' && sessionTasks.length > 0) {
       if (activeTrack === 'english') setUnlockedEn(prev => prev + 1);
       else setUnlockedJa(prev => prev + 1);
    }
    setMode('path');
  };

  const handleSaveExam = (exam: FullExam) => {
    setCustomExams([...customExams, exam]);
    setMode('practice');
  };

  const handleAddCard = (data: { word: string; definition: string; example?: string; language: 'english' | 'japanese' }) => {
    const newCard: Flashcard = {
      id: crypto.randomUUID(),
      user_id: 'guest', 
      word: data.word, 
      definition: data.definition, 
      example: data.example,
      language: data.language,
      category: data.language === 'english' ? 'toeic' : 'n2', 
      difficulty: 'beginner', 
      repetition: 0, 
      interval: 0, 
      easiness: 2.5,
      next_review: new Date().toISOString(), 
      created_at: new Date().toISOString(),
    };

    setCards(prev => [...prev, newCard]);
    setMode('path');
  };

  const handleAddCardsBulk = (cardsData: Array<{ word: string; definition: string; example?: string; language: 'english' | 'japanese' }>) => {
    const newCards: Flashcard[] = cardsData.map(data => ({
      id: crypto.randomUUID(),
      user_id: 'guest', 
      word: data.word, 
      definition: data.definition, 
      example: data.example,
      language: data.language,
      category: data.language === 'english' ? 'toeic' : 'n2', 
      difficulty: 'beginner', 
      repetition: 0, 
      interval: 0, 
      easiness: 2.5,
      next_review: new Date().toISOString(), 
      created_at: new Date().toISOString(),
    }));

    setCards(prev => [...prev, ...newCards]);
    toast.success(`Imported ${newCards.length} cards successfully!`);
    setMode('path');
  };

  const currentCurriculum = activeTrack === 'english' ? TOEIC_CURRICULUM : N2_CURRICULUM;
  const currentUnlocked = activeTrack === 'english' ? unlockedEn : unlockedJa;

  const now = new Date();
  const dueCount = cards.filter(c => c.language === activeTrack && new Date(c.next_review) <= now).length;

  if (isLoadingData) {
    return (
      <div className="min-h-screen bg-[var(--bg-main)] flex items-center justify-center flex-col gap-6">
        <div className="w-16 h-16 border-4 border-[var(--gray-path)] border-t-[var(--blue)] rounded-full animate-spin"></div>
        <p className="text-[var(--text-muted)] font-black uppercase tracking-widest text-sm animate-pulse">
          Loading Data...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] flex flex-col md:flex-row font-sans selection:bg-[var(--blue)] selection:text-white transition-colors duration-300" data-track={activeTrack}>
      <Toaster position="bottom-center" toastOptions={{ duration: 3000, style: { background: 'var(--bg-card)', color: 'var(--text-main)', border: '2px solid var(--border-main)', borderRadius: '1rem', fontWeight: 'bold' } }} />
      <OnboardingOverlay />
      
      {/* Duolingo-style Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 border-r-2 border-[var(--gray-path)] p-6 fixed left-0 top-0 bottom-0 bg-[var(--bg-main)] z-50">
        <div className="mb-10 pl-2 flex items-center gap-3">
           <img src="/logo.png" alt="Lingomaster Logo" className="w-8 h-8 rounded-[8px] shadow-sm" />
           <h1 className="text-3xl font-black text-[var(--green)] tracking-tighter">lingo</h1>
        </div>
        
        <nav className="flex-1 space-y-2" aria-label="Main navigation">
          <button onClick={() => setMode('path')} aria-label="Learn" aria-current={mode === 'path'} className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl font-black text-xs tracking-wider transition-all border-2 active:scale-98 ${mode === 'path' ? 'bg-[var(--tint-blue)] text-[var(--blue)] border-[var(--tint-blue)]' : 'border-transparent text-[var(--text-main)] hover:bg-[var(--gray-bg)]'}`}>
             <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
             </svg>
             LEARN
          </button>
          <button onClick={() => setMode('practice')} aria-label="Practice" aria-current={mode === 'practice'} className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl font-black text-xs tracking-wider transition-all border-2 active:scale-98 ${mode === 'practice' ? 'bg-[var(--tint-blue)] text-[var(--blue)] border-[var(--tint-blue)]' : 'border-transparent text-[var(--text-main)] hover:bg-[var(--gray-bg)]'}`}>
             <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5M3 10v4M21 10v4M6 8h2v8H6zm10 0h2v8h-2z" />
             </svg>
             PRACTICE
          </button>
          <button onClick={() => setMode('notebook')} aria-label="Notebook" aria-current={mode === 'notebook'} className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl font-black text-xs tracking-wider transition-all border-2 active:scale-98 ${mode === 'notebook' ? 'bg-[var(--tint-blue)] text-[var(--blue)] border-[var(--tint-blue)]' : 'border-transparent text-[var(--text-main)] hover:bg-[var(--gray-bg)]'}`}>
             <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18c-2.305 0-4.408.867-6 2.292m0-14.25v14.25" />
             </svg>
             NOTEBOOK
          </button>
          <button onClick={() => startDrill('review')} aria-label="Review flashcards" aria-current={mode === 'review'} className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl font-black text-xs tracking-wider transition-all border-2 active:scale-98 ${mode === 'review' ? 'bg-[var(--tint-blue)] text-[var(--blue)] border-[var(--tint-blue)]' : 'border-transparent text-[var(--text-main)] hover:bg-[var(--gray-bg)]'}`}>
             <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
             </svg>
             REVIEW
             {dueCount > 0 && (
               <span className="ml-auto bg-[var(--gold)] text-white text-[10px] font-black rounded-full w-6 h-6 flex items-center justify-center">
                 {dueCount}
               </span>
             )}
          </button>
          <button onClick={() => setMode('collection')} aria-label="Word library" aria-current={mode === 'collection'} className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl font-black text-xs tracking-wider transition-all border-2 active:scale-98 ${mode === 'collection' ? 'bg-[var(--tint-blue)] text-[var(--blue)] border-[var(--tint-blue)]' : 'border-transparent text-[var(--text-main)] hover:bg-[var(--gray-bg)]'}`}>
             <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
             </svg>
             LIBRARY
          </button>
          <button onClick={() => setMode('mistakes')} aria-label="Mistake Book" aria-current={mode === 'mistakes'} className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl font-black text-xs tracking-wider transition-all border-2 active:scale-98 ${mode === 'mistakes' ? 'bg-[var(--tint-red)] text-[var(--red)] border-[var(--tint-red)]' : 'border-transparent text-[var(--text-main)] hover:bg-[var(--gray-bg)]'}`}>
             <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 0112 3.75c-4.437 0-8.283 2.39-10.456 5.964M12 9v3.75m0 0v3.75m0-3.75h3.75m-3.75 0H8.25" />
             </svg>
             MISTAKES
          </button>
          <button onClick={() => setMode('analytics')} aria-label="Learning stats" aria-current={mode === 'analytics'} className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl font-black text-xs tracking-wider transition-all border-2 active:scale-98 ${mode === 'analytics' ? 'bg-[var(--tint-blue)] text-[var(--blue)] border-[var(--tint-blue)]' : 'border-transparent text-[var(--text-main)] hover:bg-[var(--gray-bg)]'}`}>
             <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v5.25c0 .621-.504 1.125-1.125 1.125h-2.25A1.125 1.125 0 013 18.375v-5.25zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125v-9.75zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v14.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
             </svg>
             STATS
          </button>
          <button onClick={() => setMode('add')} aria-label="Add words" aria-current={mode === 'add'} className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl font-black text-xs tracking-wider transition-all border-2 active:scale-98 ${mode === 'add' ? 'bg-[var(--tint-blue)] text-[var(--blue)] border-[var(--tint-blue)]' : 'border-transparent text-[var(--text-main)] hover:bg-[var(--gray-bg)]'}`}>
             <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
             </svg>
             ADD WORDS
          </button>
        </nav>
      </aside>

      <main className="flex-1 w-full flex flex-col items-center min-h-screen lg:pl-64">
        
        {/* Top Header Bar */}
        {!(mode === 'session' || mode === 'real-exam') && (
          <header className="w-full h-16 border-b-2 border-[var(--gray-path)] flex items-center justify-between px-6 sticky top-0 bg-[var(--bg-main)]/90 backdrop-blur-md z-40">
            <div className="flex items-center gap-6">
               <button onClick={() => setActiveTrack('english')} className={`font-black text-sm flex items-center gap-2 transition-all ${activeTrack === 'english' ? 'text-[var(--blue)] border-b-4 border-[var(--blue)] pb-1' : 'text-[var(--text-muted)] hover:text-[var(--gray-path-dark)]'}`}>
                 🇺🇸 EN
               </button>
               <button onClick={() => setActiveTrack('japanese')} className={`font-black text-sm flex items-center gap-2 transition-all ${activeTrack === 'japanese' ? 'text-[var(--blue)] border-b-4 border-[var(--blue)] pb-1' : 'text-[var(--text-muted)] hover:text-[var(--gray-path-dark)]'}`}>
                 🇯🇵 JP
               </button>
            </div>
            <div className="flex items-center gap-4 font-black">
               <span className="text-[var(--gold)] flex items-center gap-1" title={`Chuỗi học liên tục: ${streak} ngày`}>
                 <svg className="w-5 h-5 text-[var(--gold)]" fill="currentColor" viewBox="0 0 24 24"><path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 8.25 3c.89 0 1.765.176 2.58.5a7.126 7.126 0 00.995-1.077c.4-.492.793-1.066 1.054-1.63A1.125 1.125 0 0114.996 1a14.766 14.766 0 012.392 7.75c0 2.457-.655 4.757-1.785 6.643-1.258 2.096-2.923 3.51-3.958 4.228z"/></svg>
                 {streak}
               </span>
               <button onClick={toggleTheme} className="text-xl active:scale-95 transition-transform">{theme === 'light' ? '🌙' : '☀️'}</button>
            </div>
          </header>
        )}

        <div className="w-full max-w-[600px] flex flex-col items-center p-6 md:p-10 pb-40">
          
          {mode === 'path' && (
            <div key="path" className="w-full view-enter flex flex-col items-center">
              <ReviewReminder dueCount={dueCount} onStartReview={() => startDrill('review')} />
              <GamifiedPath 
                curriculum={currentCurriculum} 
                currentUnlocked={currentUnlocked} 
                onStartSession={startSession} 
              />
            </div>
          )}

          {mode === 'practice' && (
            <div key="practice" className="w-full flex flex-col gap-6 view-enter">
               <div className="w-full flex flex-col gap-4 p-8 rounded-[2rem] border-2 border-[var(--gray-path)] bg-[var(--gray-bg)]">
                  <div><h3 className="text-2xl font-black">Mock Exam</h3><p className="text-sm font-bold text-[var(--text-muted)]">Full test pressure</p></div>
                  <button onClick={() => startDrill('quiz')} className="btn-duo btn-blue h-14 mt-4 w-full">START TEST</button>
               </div>

               {/* Authentic Exams Section */}
               <div className="w-full flex flex-col gap-4 mt-2">
                 <div className="px-2">
                   <h3 className="text-2xl font-black text-[var(--gold)] flex items-center gap-2">Authentic Full Tests</h3>
                   <p className="text-sm font-bold text-[var(--text-muted)] mt-1">Real exam structure, sections, and 120-minute timer.</p>
                 </div>
                 {AUTHENTIC_EXAMS.filter(exam => exam.category === trackCategory(activeTrack)).map(exam => (
                   <div key={exam.id} className="w-full flex items-center justify-between gap-4 p-6 rounded-[1.5rem] border-2 border-[var(--gold)] bg-[var(--tint-gold)] text-[var(--gold-shadow)] shadow-sm">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-black text-lg">{exam.title}</h4>
                        </div>
                        <p className="text-sm font-bold opacity-80">{exam.year} - {exam.timeLimitMinutes} minutes</p>
                     </div>
                     <button onClick={() => startAuthenticExam(exam)} className="btn-duo btn-gold h-12 w-32 text-xs">START REAL TEST</button>
                   </div>
                 ))}
               </div>

               {/* Create Exam Button */}
               <div className="w-full mt-4">
                 <button onClick={() => setMode('create-exam')} className="w-full btn-duo btn-purple h-14 text-base">
                   Create Your Own Exam
                 </button>
               </div>
               
               {/* Full Exams Section */}
               <div className="w-full flex flex-col gap-4 mt-2">
                 <h3 className="text-2xl font-black px-2">Full Official Exams</h3>
                 {[...MOCK_FULL_EXAMS, ...customExams].filter(exam => exam.category === trackCategory(activeTrack)).map(exam => (
                   <div key={exam.id} className="w-full flex items-center justify-between gap-4 p-6 rounded-[1.5rem] border-2 border-[var(--gray-path)] bg-[var(--gray-bg)]">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-black text-lg">{exam.title}</h4>
                          {exam.difficulty && (
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                              exam.difficulty === 'beginner' ? 'bg-[var(--tint-green)] text-[var(--green-shadow)] border-[var(--green-shadow)]' :
                              exam.difficulty === 'intermediate' ? 'bg-[var(--tint-blue)] text-[var(--blue-shadow)] border-[var(--blue-shadow)]' :
                              'bg-[var(--tint-red)] text-[var(--red-shadow)] border-[var(--red-shadow)]'
                            }`}>
                              {exam.difficulty}
                            </span>
                          )}
                        </div>
                        <p className="text-sm font-bold text-[var(--text-muted)]">{exam.year} - {exam.tasks.length} tasks</p>
                     </div>
                     <button onClick={() => startFullExam(exam)} className="btn-duo btn-green h-12 w-32 text-xs">START</button>
                   </div>
                 ))}
               </div>
               
               <div className="grid grid-cols-2 gap-6 w-full mt-6">
                 <div className="flex flex-col gap-4 p-6 rounded-[2rem] border-2 border-[var(--gray-path)] bg-[var(--gray-bg)]">
                    <h4 className="font-black text-lg">Vocab</h4>
                    <button onClick={() => startDrill('vocab-quiz')} className="btn-duo btn-green h-12 w-full text-xs">PRACTICE</button>
                 </div>
                 
                 {activeTrack === 'japanese' && (
                    <div className="bg-[var(--bg-card)] border-2 border-[var(--border-main)] rounded-2xl p-6 flex flex-col items-center text-center gap-2 hover:border-[var(--purple)] transition-colors">
                      <div className="w-16 h-16 bg-[var(--tint-blue)] rounded-full flex items-center justify-center text-[var(--purple)] mb-2 shadow-sm border-2 border-[var(--purple)]/20">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                      <h4 className="font-black text-lg">GRAMMAR</h4>
                      <p className="text-xs font-bold text-[var(--text-muted)] mb-4">Fill in blanks</p>
                      <button onClick={() => startDrill('grammar')} className="btn-duo btn-purple h-12 w-full text-xs">PRACTICE</button>
                    </div>
                  )}

                 <div className="flex flex-col gap-4 p-6 rounded-[2rem] border-2 border-[var(--gray-path)] bg-[var(--gray-bg)]">
                    <h4 className="font-black text-lg">Listen</h4>
                    <button onClick={() => startDrill('dictation')} className="btn-duo btn-purple h-12 w-full text-xs">PRACTICE</button>
                 </div>
               </div>

               <div className="grid grid-cols-3 gap-4 w-full mt-8">
                 <button onClick={() => setMode('collection')} className="flex flex-col items-center justify-center gap-2 p-5 rounded-[1.5rem] border-2 border-[var(--gray-path)] bg-[var(--gray-bg)] hover:border-[var(--blue)] transition-colors h-24">
                    <span className="text-xs font-black uppercase tracking-wider text-[var(--text-main)]">Library</span>
                 </button>
                 <button onClick={() => setMode('mistakes')} className="flex flex-col items-center justify-center gap-2 p-5 rounded-[1.5rem] border-2 border-[var(--gray-path)] bg-[var(--gray-bg)] hover:border-[var(--red)] transition-colors h-24">
                    <span className="text-xs font-black uppercase tracking-wider text-[var(--text-main)]">Mistakes</span>
                 </button>
                 <button onClick={() => setMode('analytics')} className="flex flex-col items-center justify-center gap-2 p-5 rounded-[1.5rem] border-2 border-[var(--gray-path)] bg-[var(--gray-bg)] hover:border-[var(--blue)] transition-colors h-24">
                    <span className="text-xs font-black uppercase tracking-wider text-[var(--text-main)]">Stats</span>
                 </button>
                 <button onClick={() => startDrill('review')} className="flex flex-col items-center justify-center gap-2 p-5 rounded-[1.5rem] border-2 border-[var(--gray-path)] bg-[var(--gray-bg)] hover:border-[var(--blue)] transition-colors h-24">
                    <span className="text-xs font-black uppercase tracking-wider text-[var(--text-main)]">Review</span>
                 </button>
               </div>
            </div>
          )}

          {mode === 'session' && (
            <div className="w-full flex flex-col items-center animate-in fade-in duration-300 pt-10">
               <div className="w-full flex items-center gap-4 mb-10 px-4">
                  <button onClick={() => setMode('path')} className="text-2xl text-[var(--text-muted)] hover:text-[var(--text-main)] active:scale-90">✖</button>
                  <div className="flex-1 h-4 bg-[var(--gray-path)] rounded-full overflow-hidden">
                    <div className="h-full bg-[var(--green)] rounded-full transition-all duration-500 ease-out progress-shine" style={{ width: `${((currentTaskIndex + 1) / sessionTasks.length) * 100}%` }}></div>
                  </div>
               </div>
               {!isSessionFinished ? (
                  <div key={currentTaskIndex} className="w-full flex flex-col items-center view-enter">
                    {sessionTasks[currentTaskIndex].type === 'vocab-quiz' && <VocabQuizView word={sessionTasks[currentTaskIndex].data as Flashcard} allCards={cards} onComplete={() => nextTask()} />}
                    {sessionTasks[currentTaskIndex].type === 'grammar' && <GrammarQuizView task={sessionTasks[currentTaskIndex].data as any} onComplete={() => nextTask()} onCancel={finalizeSession} />}
                    {sessionTasks[currentTaskIndex].type === 'quiz' && <QuizView questions={[sessionTasks[currentTaskIndex].data as Question]} category={trackCategory(activeTrack)} onComplete={handleSessionQuizComplete} onCancel={() => setMode('path')} hideSummary={true} onSaveMistake={(m) => setMistakes(prev => [m, ...prev])} />}
                    {sessionTasks[currentTaskIndex].type === 'listening' && <ListeningView lesson={sessionTasks[currentTaskIndex].data as ListeningLesson} onBack={() => nextTask()} hideBackButton={true} />}
                    {sessionTasks[currentTaskIndex].type === 'speaking' && <SpeakingView lesson={sessionTasks[currentTaskIndex].data as SpeakingLesson} onComplete={() => nextTask()} />}
                    {sessionTasks[currentTaskIndex].type === 'dictation' && <DictationView lesson={sessionTasks[currentTaskIndex].data as DictationLesson} onComplete={() => nextTask()} />}
                    {sessionTasks[currentTaskIndex].type === 'writing' && <WritingView lesson={sessionTasks[currentTaskIndex].data as WritingLesson} onComplete={() => nextTask()} onCancel={() => nextTask()} onSaveMistake={(m) => setMistakes(prev => [m, ...prev])} />}
                  </div>
               ) : (
                  <div className="w-full text-center space-y-8 pop-in pt-10 relative">
                     {/* Confetti burst */}
                     <div className="absolute left-1/2 -translate-x-1/2 top-0 w-0 h-0 pointer-events-none">
                       {['var(--green)','var(--blue)','var(--gold)','var(--purple)','var(--red)','var(--blue)','var(--gold)','var(--green)'].map((c, i) => (
                         <span key={i} className="confetti-dot" style={{ backgroundColor: c, left: `${(i - 4) * 22}px`, animationDelay: `${i * 0.06}s` }} />
                       ))}
                     </div>
                     <div className="text-[120px] select-none animate-bounce">🎉</div>
                     <div className="space-y-2"><h2 className="text-4xl font-black text-gradient">Lesson Complete!</h2><p className="text-base font-bold text-[var(--text-muted)]">You earned +10 XP</p></div>
                     <button onClick={finalizeSession} className="w-full btn-duo btn-green h-16 text-lg mt-10">CONTINUE</button>
                  </div>
               )}
            </div>
          )}

          {/* Management modes mapping */}
          {mode === 'add' && <div key="add" className="w-full mt-10 view-enter"><AddFlashcard onAdd={handleAddCard} onAddBulk={handleAddCardsBulk} /></div>}
          {mode === 'notebook' && <NotebookView activeTrack={activeTrack} n2Grammar={n2Grammar} n2Kanji={n2Kanji} toeicGrammar={toeicGrammar} />}
          {mode === 'collection' && <CollectionView cards={cards} activeTrack={activeTrack} onDelete={handleRemoveCard} onDeleteBulk={handleRemoveCards} onEdit={handleEditCard} />}
          {mode === 'mistakes' && <MistakeBookView mistakes={mistakes} onRemoveMistake={handleRemoveMistake} onReview={() => setMode('review-mistakes')} />}
          {mode === 'review-mistakes' && <MistakeReviewView mistakes={mistakes} onComplete={() => setMode('mistakes')} onCancel={() => setMode('mistakes')} onRemoveMistake={handleRemoveMistake} />}
          {mode === 'analytics' && <AnalyticsView results={examResults} cards={cards} activeTrack={activeTrack} />}
          {mode === 'review' && (() => {
            const reviewQueue = cards.filter(c => c.language === activeTrack);
            const card = reviewQueue[currentReviewIndex];
            if (!card) {
              return (
                <div className="w-full max-w-xl mt-10 lingo-card p-10 text-center space-y-4 view-enter">
                  <h2 className="text-2xl font-black text-[var(--text-main)]">Nothing to review</h2>
                  <p className="text-sm font-bold text-[var(--text-muted)]">
                    Add words first, or come back after building up your collection.
                  </p>
                  <button onClick={() => setMode('add')} className="btn-duo btn-blue h-14 w-full mt-4">ADD WORDS</button>
                </div>
              );
            }
            return (
              <div className="w-full max-w-xl mt-10 view-enter">
                <FlashcardView card={card} onRate={handleRateCard} />
              </div>
            );
          })()}
          {mode === 'create-exam' && (
              <CreateExamView
              onSave={handleSaveExam}
              onCancel={() => setMode('practice')}
              allQuestions={questions}
              allListening={MOCK_LISTENING_LESSONS}
              allSpeaking={MOCK_SPEAKING_LESSONS}
              allDictation={MOCK_DICTATION_LESSONS}
            />
          )}
          {mode === 'real-exam' && currentAuthenticExam && (
            <div className="w-full mt-10 view-enter">
              <RealExamView
                exam={currentAuthenticExam}
                onCancel={() => {
                  setMode('path');
                  setCurrentAuthenticExam(null);
                }}
                onComplete={(score, total) => {
                  recordExamResult({
                    id: crypto.randomUUID(),
                    date: new Date().toISOString(),
                    score,
                    totalQuestions: total,
                    category: currentAuthenticExam.category,
                    difficulty: currentAuthenticExam.difficulty,
                    type: 'full-exam'
                  });
                  setMode('practice');
                }}
                onSaveMistake={(m) => setMistakes(prev => [m, ...prev])}
              />
            </div>
          )}

        </div>
      </main>

      {/* Mobile Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-20 backdrop-blur-md bg-[var(--bg-main)]/85 border-t-2 border-[var(--gray-path)] shadow-[0_-4px_24px_rgba(0,0,0,0.04)] flex items-center justify-around px-2 z-50">
        <button 
          onClick={() => setMode('path')} 
          aria-label="Learn" 
          aria-current={mode === 'path'} 
          className={`flex flex-col items-center justify-center flex-1 h-full py-1 transition-all active:scale-95 relative ${mode === 'path' ? 'text-[var(--blue)]' : 'text-[var(--text-muted)]'}`}
        >
          <div className={`p-2 rounded-xl transition-all ${mode === 'path' ? 'bg-[var(--tint-blue)]' : 'bg-transparent'}`}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
          </div>
          <span className="text-[10px] font-black uppercase tracking-wider mt-1">Learn</span>
        </button>

        <button 
          onClick={() => startDrill('review')} 
          aria-label="Review flashcards" 
          aria-current={mode === 'review'} 
          className={`flex flex-col items-center justify-center flex-1 h-full py-1 transition-all active:scale-95 relative ${mode === 'review' ? 'text-[var(--blue)]' : 'text-[var(--text-muted)]'}`}
        >
          <div className={`p-2 rounded-xl transition-all relative ${mode === 'review' ? 'bg-[var(--tint-blue)]' : 'bg-transparent'}`}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
            {dueCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[var(--gold)] text-white text-[9px] font-black rounded-full w-4 h-4 flex items-center justify-center">
                {dueCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-black uppercase tracking-wider mt-1">Review</span>
        </button>

        <button 
          onClick={() => setMode('practice')} 
          aria-label="Practice" 
          aria-current={mode === 'practice'} 
          className={`flex flex-col items-center justify-center flex-1 h-full py-1 transition-all active:scale-95 relative ${mode === 'practice' ? 'text-[var(--blue)]' : 'text-[var(--text-muted)]'}`}
        >
          <div className={`p-2 rounded-xl transition-all ${mode === 'practice' ? 'bg-[var(--tint-blue)]' : 'bg-transparent'}`}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5M3 10v4M21 10v4M6 8h2v8H6zm10 0h2v8h-2z" />
            </svg>
          </div>
          <span className="text-[10px] font-black uppercase tracking-wider mt-1">Practice</span>
        </button>

        <button 
          onClick={() => setMode('notebook')} 
          aria-label="Notebook" 
          aria-current={mode === 'notebook'} 
          className={`flex flex-col items-center justify-center flex-1 h-full py-1 transition-all active:scale-95 relative ${mode === 'notebook' ? 'text-[var(--blue)]' : 'text-[var(--text-muted)]'}`}
        >
          <div className={`p-2 rounded-xl transition-all ${mode === 'notebook' ? 'bg-[var(--tint-blue)]' : 'bg-transparent'}`}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18c-2.305 0-4.408.867-6 2.292m0-14.25v14.25" />
            </svg>
          </div>
          <span className="text-[10px] font-black uppercase tracking-wider mt-1">Notebook</span>
        </button>
      </nav>
    </div>
  );
}

export default App;
