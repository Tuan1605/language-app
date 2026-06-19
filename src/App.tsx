import { useState, useEffect } from 'react';
import { AddFlashcard } from './components/AddFlashcard';
import { FlashcardView } from './components/FlashcardView';
import { QuizView } from './components/QuizView';
import { ListeningView } from './components/ListeningView';
import { SpeakingView } from './components/SpeakingView';
import { DictationView } from './components/DictationView';
import { VocabQuizView } from './components/VocabQuizView';
import { CollectionView } from './components/CollectionView';
import { AnalyticsView } from './components/AnalyticsView';
import { CreateExamView } from './components/CreateExamView';
import { NotebookView } from './components/NotebookView';
import { GamifiedPath } from './components/GamifiedPath';
import type { Flashcard, ExamResult, ListeningLesson, SpeakingLesson, Question, Difficulty, DictationLesson, ReviewGrade, SessionTask, FullExam } from './types';
import { calculateSM2, getNextReviewDate } from './utils/sm2';
import { MOCK_QUESTIONS, MOCK_LISTENING_LESSONS, MOCK_CARDS, MOCK_SPEAKING_LESSONS, MOCK_DICTATION_LESSONS, MOCK_FULL_EXAMS } from './utils/mockData';
import { TOEIC_CURRICULUM, N2_CURRICULUM } from './data/curriculums';
import { loadCards, saveCards, loadProgress, saveProgress, loadExamResults, saveExamResults, loadTheme, saveTheme } from './utils/storage';

// Map the active learning track to its content category. Centralised so the
// TOEIC/N2 switch is applied consistently across filtering and result saving.
const trackCategory = (track: 'english' | 'japanese'): 'toeic' | 'n2' =>
  track === 'english' ? 'toeic' : 'n2';

type AppMode =
  | 'path' | 'practice' | 'session' | 'add'
  | 'collection' | 'analytics' | 'review'
  | 'create-exam' | 'notebook';

function App() {
  const [cards, setCards] = useState<Flashcard[]>(() => loadCards() || MOCK_CARDS);
  const [examResults, setExamResults] = useState<ExamResult[]>(() => loadExamResults());
  const [mode, setMode] = useState<AppMode>('path');
  const [theme, setTheme] = useState<'light' | 'dark'>(() => loadTheme());
  const [activeTrack, setActiveTrack] = useState<'english' | 'japanese'>('english');
  const [unlockedEn, setUnlockedEn] = useState(() => loadProgress().unlocked_en);
  const [unlockedJa, setUnlockedJa] = useState(() => loadProgress().unlocked_ja);
  const [customExams, setCustomExams] = useState<FullExam[]>([]);

  const [sessionTasks, setSessionTasks] = useState<SessionTask[]>([]);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [isSessionFinished, setIsSessionFinished] = useState(false);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.body.style.fontFamily = "'Nunito', 'Quicksand', sans-serif";
  }, [theme]);

  useEffect(() => { saveTheme(theme); }, [theme]);
  useEffect(() => { saveCards(cards); }, [cards]);
  useEffect(() => { saveProgress({ unlocked_en: unlockedEn, unlocked_ja: unlockedJa }); }, [unlockedEn, unlockedJa]);
  useEffect(() => { saveExamResults(examResults); }, [examResults]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const handleRemoveCard = (id: string) => {
    setCards(cards.filter(c => c.id !== id));
  };

  const startSession = (nodeIdx: number, unitDifficulty: Difficulty) => {
    const cat = trackCategory(activeTrack);
    const filteredVocab = cards.filter(c => c.language === activeTrack && c.difficulty === unitDifficulty);
    const filteredQuizzes = MOCK_QUESTIONS.filter(q => q.category === cat && q.difficulty === unitDifficulty);
    const filteredListen = MOCK_LISTENING_LESSONS.filter(l => l.category === cat && l.difficulty === unitDifficulty);
    const filteredSpeak = MOCK_SPEAKING_LESSONS.filter(s => s.category === cat && s.difficulty === unitDifficulty);
    const filteredDict = MOCK_DICTATION_LESSONS.filter(d => d.category === cat && d.difficulty === unitDifficulty);

    const vList = filteredVocab.length > 0 ? filteredVocab : cards.filter(c => c.language === activeTrack);
    const qList = filteredQuizzes.length > 0 ? filteredQuizzes : MOCK_QUESTIONS.filter(q => q.category === cat);
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

    setSessionTasks(newTasks);
    setCurrentTaskIndex(0); setIsSessionFinished(false); setMode('session');
  };

  const startDrill = (type: SessionTask['type'] | 'review') => {
    if (type === 'review') { setCurrentReviewIndex(0); setMode('review'); return; }
    const cat = trackCategory(activeTrack);
    const filtered = (type === 'vocab-quiz') ? cards.filter(c => c.language === activeTrack) :
                     (type === 'quiz') ? MOCK_QUESTIONS.filter(q => q.category === cat) :
                     (type === 'listening') ? MOCK_LISTENING_LESSONS.filter(l => l.category === cat) :
                     (type === 'speaking') ? MOCK_SPEAKING_LESSONS.filter(s => s.category === cat) :
                     MOCK_DICTATION_LESSONS.filter(d => d.category === cat);
    const newTasks: SessionTask[] = filtered.slice(0, 10).map(item => ({ type, data: item }) as SessionTask);
    setSessionTasks(newTasks);
    setCurrentTaskIndex(0); setIsSessionFinished(false); setMode('session');
  };

  const startFullExam = (exam: FullExam) => {
    setSessionTasks(exam.tasks);
    setCurrentTaskIndex(0);
    setIsSessionFinished(false);
    setMode('session');
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
  };

  const nextTask = () => {
    if (currentTaskIndex < sessionTasks.length - 1) setCurrentTaskIndex(prev => prev + 1);
    else setIsSessionFinished(true);
  };

  const finalizeSession = () => {
    if (mode === 'session' && sessionTasks.length > 5) {
       if (activeTrack === 'english') setUnlockedEn(prev => prev + 1);
       else setUnlockedJa(prev => prev + 1);
    }
    setMode('path');
  };

  const handleSaveExam = (exam: FullExam) => {
    setCustomExams([...customExams, exam]);
    setMode('practice');
  };

  const handleAddCard = (data: { word: string; definition: string; language: 'english' | 'japanese' }) => {
    const newCard: Flashcard = {
      id: crypto.randomUUID(),
      user_id: 'guest', 
      word: data.word, 
      definition: data.definition, 
      language: data.language,
      category: data.language === 'english' ? 'toeic' : 'n2', 
      difficulty: 'beginner', 
      repetition: 0, 
      interval: 0, 
      easiness: 2.5,
      next_review: new Date().toISOString(), 
      created_at: new Date().toISOString(),
    };

    setCards([...cards, newCard]);
    setMode('path');
  };

  const currentCurriculum = activeTrack === 'english' ? TOEIC_CURRICULUM : N2_CURRICULUM;
  const currentUnlocked = activeTrack === 'english' ? unlockedEn : unlockedJa;

  return (
    <div className="min-h-screen w-full bg-[var(--bg-main)] text-[var(--text-main)] flex flex-col items-center font-sans overflow-x-hidden transition-all duration-300">
      
      {/* Duolingo-style Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 border-r-2 border-[var(--gray-path)] p-6 fixed left-0 top-0 bottom-0 bg-[var(--bg-main)] z-50">
        <div className="mb-10 pl-2">
           <h1 className="text-3xl font-black text-[var(--green)] tracking-tighter">lingo</h1>
        </div>
        
        <nav className="flex-1 space-y-2" aria-label="Main navigation">
          <button onClick={() => setMode('path')} aria-label="Learn" aria-current={mode === 'path'} className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl font-bold text-sm transition-colors border-2 ${mode === 'path' ? 'bg-[var(--blue-light)] text-[var(--blue)] border-[var(--blue-light)]' : 'border-transparent text-[var(--text-main)] hover:bg-[var(--gray-bg)]'}`}>
             <span className="text-2xl">🏠</span> LEARN
          </button>
          <button onClick={() => setMode('practice')} aria-label="Practice" aria-current={mode === 'practice'} className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl font-bold text-sm transition-colors border-2 ${mode === 'practice' ? 'bg-[var(--blue-light)] text-[var(--blue)] border-[var(--blue-light)]' : 'border-transparent text-[var(--text-main)] hover:bg-[var(--gray-bg)]'}`}>
             <span className="text-2xl">🏋️</span> PRACTICE
          </button>
          <button onClick={() => setMode('notebook')} aria-label="Notebook" aria-current={mode === 'notebook'} className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl font-bold text-sm transition-colors border-2 ${mode === 'notebook' ? 'bg-[var(--blue-light)] text-[var(--blue)] border-[var(--blue-light)]' : 'border-transparent text-[var(--text-main)] hover:bg-[var(--gray-bg)]'}`}>
             <span className="text-2xl">📔</span> NOTEBOOK
          </button>
          <button onClick={() => startDrill('review')} aria-label="Review flashcards" aria-current={mode === 'review'} className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl font-bold text-sm transition-colors border-2 ${mode === 'review' ? 'bg-[var(--blue-light)] text-[var(--blue)] border-[var(--blue-light)]' : 'border-transparent text-[var(--text-main)] hover:bg-[var(--gray-bg)]'}`}>
             <span className="text-2xl">🔁</span> REVIEW
          </button>
          <button onClick={() => setMode('collection')} aria-label="Word library" aria-current={mode === 'collection'} className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl font-bold text-sm transition-colors border-2 ${mode === 'collection' ? 'bg-[var(--blue-light)] text-[var(--blue)] border-[var(--blue-light)]' : 'border-transparent text-[var(--text-main)] hover:bg-[var(--gray-bg)]'}`}>
             <span className="text-2xl">📚</span> LIBRARY
          </button>
          <button onClick={() => setMode('analytics')} aria-label="Learning stats" aria-current={mode === 'analytics'} className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl font-bold text-sm transition-colors border-2 ${mode === 'analytics' ? 'bg-[var(--blue-light)] text-[var(--blue)] border-[var(--blue-light)]' : 'border-transparent text-[var(--text-main)] hover:bg-[var(--gray-bg)]'}`}>
             <span className="text-2xl">📊</span> STATS
          </button>
          <button onClick={() => setMode('add')} aria-label="Add words" aria-current={mode === 'add'} className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl font-bold text-sm transition-colors border-2 ${mode === 'add' ? 'bg-[var(--blue-light)] text-[var(--blue)] border-[var(--blue-light)]' : 'border-transparent text-[var(--text-main)] hover:bg-[var(--gray-bg)]'}`}>
             <span className="text-2xl">➕</span> ADD WORDS
          </button>
        </nav>
      </aside>

      <main className="flex-1 w-full flex flex-col items-center min-h-screen lg:pl-64">
        
        {/* Top Header Bar */}
        {(mode === 'path' || mode === 'practice') && (
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
               <span className="text-[var(--gold)] flex items-center gap-1">👑 {currentUnlocked}</span>
               <button onClick={toggleTheme} className="text-xl active:scale-95 transition-transform">{theme === 'light' ? '🌙' : '☀️'}</button>
            </div>
          </header>
        )}

        <div className="w-full max-w-[600px] flex flex-col items-center p-6 md:p-10 pb-40">
          
          {mode === 'path' && (
            <div key="path" className="w-full view-enter flex flex-col items-center">
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
                  <div className="text-5xl">📝</div>
                  <div><h3 className="text-2xl font-black">Mock Exam</h3><p className="text-sm font-bold text-[var(--text-muted)]">Full test pressure</p></div>
                  <button onClick={() => startDrill('quiz')} className="btn-duo btn-blue h-14 mt-4 w-full">START TEST</button>
               </div>

               {/* Create Exam Button */}
               <div className="w-full">
                 <button onClick={() => setMode('create-exam')} className="w-full btn-duo btn-purple h-14 text-base">
                   ✨ Create Your Own Exam
                 </button>
               </div>
               
               {/* Full Exams Section */}
               <div className="w-full flex flex-col gap-4 mt-2">
                 <h3 className="text-2xl font-black px-2">Full Official Exams</h3>
                 {[...MOCK_FULL_EXAMS, ...customExams].filter(exam => exam.category === trackCategory(activeTrack)).map(exam => (
                   <div key={exam.id} className="w-full flex items-center justify-between gap-4 p-6 rounded-[1.5rem] border-2 border-[var(--gray-path)] bg-[var(--gray-bg)]">
                     <div>
                       <h4 className="font-black text-lg">{exam.title}</h4>
                       <p className="text-sm font-bold text-[var(--text-muted)]">{exam.year} - {exam.tasks.length} tasks</p>
                     </div>
                     <button onClick={() => startFullExam(exam)} className="btn-duo btn-green h-12 w-32 text-xs">START</button>
                   </div>
                 ))}
               </div>
               
               <div className="grid grid-cols-2 gap-6 w-full mt-6">
                 <div className="flex flex-col gap-4 p-6 rounded-[2rem] border-2 border-[var(--gray-path)] bg-[var(--gray-bg)]">
                    <div className="text-4xl">🧩</div>
                    <h4 className="font-black text-lg">Vocab</h4>
                    <button onClick={() => startDrill('vocab-quiz')} className="btn-duo btn-green h-12 w-full text-xs">PRACTICE</button>
                 </div>
                 <div className="flex flex-col gap-4 p-6 rounded-[2rem] border-2 border-[var(--gray-path)] bg-[var(--gray-bg)]">
                    <div className="text-4xl">⌨️</div>
                    <h4 className="font-black text-lg">Listen</h4>
                    <button onClick={() => startDrill('dictation')} className="btn-duo btn-purple h-12 w-full text-xs">PRACTICE</button>
                 </div>
               </div>

               {/* Quick access to Library / Stats / Review (mobile-friendly entry points) */}
               <div className="grid grid-cols-3 gap-4 w-full mt-8">
                 <button onClick={() => setMode('collection')} className="flex flex-col items-center gap-2 p-5 rounded-[1.5rem] border-2 border-[var(--gray-path)] bg-[var(--gray-bg)] hover:border-[var(--blue)] transition-colors">
                    <span className="text-3xl">📚</span>
                    <span className="text-[10px] font-black uppercase tracking-wider text-[var(--text-main)]">Library</span>
                 </button>
                 <button onClick={() => setMode('analytics')} className="flex flex-col items-center gap-2 p-5 rounded-[1.5rem] border-2 border-[var(--gray-path)] bg-[var(--gray-bg)] hover:border-[var(--blue)] transition-colors">
                    <span className="text-3xl">📊</span>
                    <span className="text-[10px] font-black uppercase tracking-wider text-[var(--text-main)]">Stats</span>
                 </button>
                 <button onClick={() => startDrill('review')} className="flex flex-col items-center gap-2 p-5 rounded-[1.5rem] border-2 border-[var(--gray-path)] bg-[var(--gray-bg)] hover:border-[var(--blue)] transition-colors">
                    <span className="text-3xl">🔁</span>
                    <span className="text-[10px] font-black uppercase tracking-wider text-[var(--text-main)]">Review</span>
                 </button>
               </div>
            </div>
          )}

          {/* Keep session logic similar but use duo-buttons */}
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
                    {sessionTasks[currentTaskIndex].type === 'quiz' && <QuizView questions={[sessionTasks[currentTaskIndex].data as Question]} category={trackCategory(activeTrack)} onComplete={handleSessionQuizComplete} onCancel={() => setMode('path')} hideSummary={true} />}
                    {sessionTasks[currentTaskIndex].type === 'listening' && <ListeningView lesson={sessionTasks[currentTaskIndex].data as ListeningLesson} onBack={() => nextTask()} hideBackButton={true} />}
                    {sessionTasks[currentTaskIndex].type === 'speaking' && <SpeakingView lesson={sessionTasks[currentTaskIndex].data as SpeakingLesson} onComplete={() => nextTask()} />}
                    {sessionTasks[currentTaskIndex].type === 'dictation' && <DictationView lesson={sessionTasks[currentTaskIndex].data as DictationLesson} onComplete={() => nextTask()} />}
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
          {mode === 'add' && <div key="add" className="w-full mt-10 view-enter"><AddFlashcard onAdd={handleAddCard} /></div>}
          {mode === 'notebook' && <NotebookView activeTrack={activeTrack} />}
          {mode === 'collection' && <CollectionView cards={cards} activeTrack={activeTrack} onDelete={handleRemoveCard} />}
          {mode === 'analytics' && <AnalyticsView results={examResults} activeTrack={activeTrack} />}
          {mode === 'review' && (() => {
            const reviewQueue = cards.filter(c => c.language === activeTrack);
            const card = reviewQueue[currentReviewIndex];
            if (!card) {
              return (
                <div className="w-full max-w-xl mt-10 lingo-card p-10 text-center space-y-4 view-enter">
                  <div className="text-5xl">📭</div>
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
              allQuestions={MOCK_QUESTIONS}
              allListening={MOCK_LISTENING_LESSONS}
              allSpeaking={MOCK_SPEAKING_LESSONS}
              allDictation={MOCK_DICTATION_LESSONS}
            />
          )}

        </div>
      </main>

      {/* Mobile Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-20 bg-[var(--bg-main)] border-t-2 border-[var(--gray-path)] flex items-center justify-around px-1 z-50">
        <button onClick={() => setMode('path')} aria-label="Learn" aria-current={mode === 'path'} className={`p-3 rounded-2xl transition-all border-2 ${mode === 'path' ? 'bg-[var(--blue-light)] border-[var(--blue-light)] text-[var(--blue)]' : 'border-transparent text-[var(--text-muted)]'}`}><span className="text-2xl">🏠</span></button>
        <button onClick={() => startDrill('review')} aria-label="Review flashcards" aria-current={mode === 'review'} className={`p-3 rounded-2xl transition-all border-2 ${mode === 'review' ? 'bg-[var(--blue-light)] border-[var(--blue-light)] text-[var(--blue)]' : 'border-transparent text-[var(--text-muted)]'}`}><span className="text-2xl">🔁</span></button>
        <button onClick={() => setMode('practice')} aria-label="Practice" aria-current={mode === 'practice'} className={`p-3 rounded-2xl transition-all border-2 ${mode === 'practice' ? 'bg-[var(--blue-light)] border-[var(--blue-light)] text-[var(--blue)]' : 'border-transparent text-[var(--text-muted)]'}`}><span className="text-2xl">🏋️</span></button>
        <button onClick={() => setMode('add')} aria-label="Add words" aria-current={mode === 'add'} className={`p-3 rounded-2xl transition-all border-2 ${mode === 'add' ? 'bg-[var(--blue-light)] border-[var(--blue-light)] text-[var(--blue)]' : 'border-transparent text-[var(--text-muted)]'}`}><span className="text-2xl">➕</span></button>
        <button onClick={() => setMode('notebook')} aria-label="Notebook" aria-current={mode === 'notebook'} className={`p-3 rounded-2xl transition-all border-2 ${mode === 'notebook' ? 'bg-[var(--blue-light)] border-[var(--blue-light)] text-[var(--blue)]' : 'border-transparent text-[var(--text-muted)]'}`}><span className="text-2xl">📔</span></button>
      </nav>
    </div>
  );
}

export default App;
