import { useState, useEffect } from 'react';
import { AddFlashcard } from './components/AddFlashcard';
import { FlashcardView } from './components/FlashcardView';
import { QuizView } from './components/QuizView';
import { ListeningView } from './components/ListeningView';
import { SpeakingView } from './components/SpeakingView';
import { DictationView } from './components/DictationView';
import { CollectionView } from './components/CollectionView';
import { AnalyticsView } from './components/AnalyticsView';
import type { Flashcard, ExamResult, ListeningLesson, SpeakingLesson, Question, Difficulty, DictationLesson } from './types';
import { MOCK_QUESTIONS, MOCK_LISTENING_LESSONS, MOCK_CARDS, MOCK_SPEAKING_LESSONS, MOCK_DICTATION_LESSONS } from './utils/mockData';

// --- SESSION TASK TYPE ---

const TOEIC_CURRICULUM = [
  { id: 1, title: 'Basic Business Words', nodes: 8, difficulty: 'beginner', color: 'green' },
  { id: 2, title: 'Office Survival', nodes: 12, difficulty: 'intermediate', color: 'blue' },
  { id: 3, title: 'Professional Meetings', nodes: 15, difficulty: 'intermediate', color: 'purple' },
  { id: 4, title: 'Advanced Strategy', nodes: 20, difficulty: 'advanced', color: 'orange' },
  { id: 5, title: 'Infinity Mastery', nodes: 50, difficulty: 'advanced', color: 'black' },
];

const N2_CURRICULUM = [
  { id: 1, title: 'Bảng chữ cái & N5', nodes: 10, difficulty: 'beginner', color: 'green' },
  { id: 2, title: 'Giao tiếp N4', nodes: 15, difficulty: 'intermediate', color: 'blue' },
  { id: 3, title: 'Trung cấp N3', nodes: 18, difficulty: 'intermediate', color: 'purple' },
  { id: 4, title: 'Mastering N2', nodes: 25, difficulty: 'advanced', color: 'red' },
  { id: 5, title: 'Infinity Mastery', nodes: 50, difficulty: 'advanced', color: 'black' },
];

type SessionTask = 
  | { type: 'flashcard'; data: Flashcard }
  | { type: 'quiz'; data: Question }
  | { type: 'listening'; data: ListeningLesson }
  | { type: 'speaking'; data: SpeakingLesson }
  | { type: 'dictation'; data: DictationLesson };

function App() {
  const [cards, setCards] = useState<Flashcard[]>(MOCK_CARDS);
  const [examResults, setExamResults] = useState<ExamResult[]>([]);
  const [mode, setMode] = useState<'path' | 'practice' | 'session' | 'add' | 'collection' | 'analytics'>('path');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  const [activeTrack, setActiveTrack] = useState<'english' | 'japanese'>('english');
  const [unlockedEn, setUnlockedEn] = useState(0);
  const [unlockedJa, setUnlockedJa] = useState(0);

  const [sessionTasks, setSessionTasks] = useState<SessionTask[]>([]);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [sessionIncorrect, setSessionIncorrect] = useState(0);
  const [isSessionFinished, setIsSessionFinished] = useState(false);

  useEffect(() => {
    const savedCards = localStorage.getItem('language-cards');
    if (savedCards) setCards(JSON.parse(savedCards));
    const savedResults = localStorage.getItem('language-exam-results');
    if (savedResults) setExamResults(JSON.parse(savedResults));
    const progressEn = localStorage.getItem('unlocked-en');
    if (progressEn) setUnlockedEn(parseInt(progressEn));
    const progressJa = localStorage.getItem('unlocked-ja');
    if (progressJa) setUnlockedJa(parseInt(progressJa));
    const savedTheme = localStorage.getItem('language-theme') as 'light' | 'dark';
    if (savedTheme) { setTheme(savedTheme); document.documentElement.setAttribute('data-theme', savedTheme); }
  }, []);

  useEffect(() => { localStorage.setItem('language-cards', JSON.stringify(cards)); }, [cards]);
  useEffect(() => { localStorage.setItem('language-exam-results', JSON.stringify(examResults)); }, [examResults]);
  useEffect(() => { localStorage.setItem('unlocked-en', unlockedEn.toString()); }, [unlockedEn]);
  useEffect(() => { localStorage.setItem('unlocked-ja', unlockedJa.toString()); }, [unlockedJa]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('language-theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const handleRemoveCard = (id: string) => {
    setCards(cards.filter(c => c.id !== id));
  };

  const startSession = (nodeIdx: number, unitDifficulty: Difficulty) => {
    const filteredVocab = cards.filter(c => c.language === activeTrack && c.difficulty === unitDifficulty);
    const filteredQuizzes = MOCK_QUESTIONS.filter(q => (activeTrack === 'english' ? q.category === 'toeic' : q.category === 'n2') && q.difficulty === unitDifficulty);
    const filteredListen = MOCK_LISTENING_LESSONS.filter(l => (activeTrack === 'english' ? l.category === 'toeic' : l.category === 'n2') && l.difficulty === unitDifficulty);
    const filteredSpeak = MOCK_SPEAKING_LESSONS.filter(s => (activeTrack === 'english' ? s.category === 'toeic' : s.category === 'n2') && s.difficulty === unitDifficulty);
    const filteredDict = MOCK_DICTATION_LESSONS.filter(d => (activeTrack === 'english' ? d.category === 'toeic' : d.category === 'n2') && d.difficulty === unitDifficulty);

    const vList = filteredVocab.length > 0 ? filteredVocab : cards.filter(c => c.language === activeTrack);
    const qList = filteredQuizzes.length > 0 ? filteredQuizzes : MOCK_QUESTIONS.filter(q => (activeTrack === 'english' ? q.category === 'toeic' : q.category === 'n2'));
    const lList = filteredListen.length > 0 ? filteredListen : MOCK_LISTENING_LESSONS.filter(l => (activeTrack === 'english' ? l.category === 'toeic' : l.category === 'n2'));
    const sList = filteredSpeak.length > 0 ? filteredSpeak : MOCK_SPEAKING_LESSONS.filter(s => (activeTrack === 'english' ? s.category === 'toeic' : s.category === 'n2'));
    const dList = filteredDict.length > 0 ? filteredDict : MOCK_DICTATION_LESSONS.filter(d => (activeTrack === 'english' ? d.category === 'toeic' : d.category === 'n2'));

    const newTasks: SessionTask[] = [
      { type: 'flashcard', data: vList[nodeIdx % vList.length] },
      { type: 'quiz', data: qList[nodeIdx % qList.length] },
      { type: 'listening', data: lList[nodeIdx % lList.length] },
      { type: 'dictation', data: dList[nodeIdx % dList.length] },
      { type: 'speaking', data: sList[nodeIdx % sList.length] },
      { type: 'quiz', data: qList[(nodeIdx + 1) % qList.length] },
    ];

    setSessionTasks(newTasks);
    setCurrentTaskIndex(0);
    setSessionCorrect(0);
    setSessionIncorrect(0);
    setIsSessionFinished(false);
    setMode('session');
  };

  const startDrill = (type: SessionTask['type']) => {
    const filtered = (type === 'flashcard') ? cards.filter(c => c.language === activeTrack) :
                     (type === 'quiz') ? MOCK_QUESTIONS.filter(q => (activeTrack === 'english' ? q.category === 'toeic' : q.category === 'n2')) :
                     (type === 'listening') ? MOCK_LISTENING_LESSONS.filter(l => (activeTrack === 'english' ? l.category === 'toeic' : l.category === 'n2')) :
                     (type === 'speaking') ? MOCK_SPEAKING_LESSONS.filter(s => (activeTrack === 'english' ? s.category === 'toeic' : s.category === 'n2')) :
                     MOCK_DICTATION_LESSONS.filter(d => (activeTrack === 'english' ? d.category === 'toeic' : d.category === 'n2'));
    
    const newTasks: SessionTask[] = filtered.slice(0, 10).map(item => ({ type, data: item } as any));
    setSessionTasks(newTasks);
    setCurrentTaskIndex(0);
    setSessionCorrect(0);
    setSessionIncorrect(0);
    setIsSessionFinished(false);
    setMode('session');
  };

  const nextTask = (isCorrect: boolean) => {
    if (isCorrect) setSessionCorrect(prev => prev + 1);
    else setSessionIncorrect(prev => prev + 1);
    if (currentTaskIndex < sessionTasks.length - 1) setCurrentTaskIndex(prev => prev + 1);
    else setIsSessionFinished(true);
  };

  const finalizeSession = () => {
    if (mode === 'session' && sessionTasks.length > 5) { // Only unlock for path lessons
       if (activeTrack === 'english') setUnlockedEn(prev => prev + 1);
       else setUnlockedJa(prev => prev + 1);
    }
    setMode('path');
  };

  const handleAddCard = (data: { word: string; definition: string; language: 'english' | 'japanese' }) => {
    const newCard: Flashcard = {
      id: crypto.randomUUID(), user_id: 'guest', word: data.word, definition: data.definition, language: data.language,
      category: data.language === 'english' ? 'toeic' : 'n2', difficulty: 'beginner', repetition: 0, interval: 0, easiness: 2.5,
      next_review: new Date().toISOString(), created_at: new Date().toISOString(),
    };
    setCards([...cards, newCard]);
    setMode('path');
  };

  const currentCurriculum = activeTrack === 'english' ? TOEIC_CURRICULUM : N2_CURRICULUM;
  const currentUnlocked = activeTrack === 'english' ? unlockedEn : unlockedJa;

  const renderPath = () => {
    let globalNodeIndex = 0;
    return currentCurriculum.map((unit) => (
      <section key={unit.id} className="w-full flex flex-col items-center mb-24">
        <div className={`w-full max-w-md p-6 rounded-3xl text-white shadow-xl mb-12 flex flex-col items-center text-center
          ${unit.color === 'green' ? 'bg-[#58cc02]' : unit.color === 'blue' ? 'bg-[#1cb0f6]' : unit.color === 'purple' ? 'bg-[#ce82ff]' : unit.color === 'orange' ? 'bg-[#ff9600]' : unit.color === 'red' ? 'bg-[#ff4b4b]' : 'bg-[#4b4b4b]'}`}>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80 mb-1">Unit {unit.id}</span>
          <h2 className="text-2xl font-black uppercase tracking-tight">{unit.title}</h2>
        </div>
        <div className="flex flex-col items-center gap-10 w-full relative">
          <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-4 bg-[var(--border-main)] rounded-full z-0 opacity-40"></div>
          {Array.from({ length: unit.nodes }).map((_) => {
            const nodeIdx = globalNodeIndex++;
            const offset = (nodeIdx % 4 === 0) ? '0px' : (nodeIdx % 2 === 0 ? '60px' : '-60px');
            const isLocked = nodeIdx > currentUnlocked;
            const isCurrent = nodeIdx === currentUnlocked;
            return (
              <div key={nodeIdx} className="z-10 relative flex flex-col items-center transition-all" style={{ marginLeft: offset }}>
                {isCurrent && <div className="absolute -top-12 bg-slate-900 text-white px-4 py-1.5 rounded-xl font-black text-[10px] shadow-lg animate-bounce z-20 uppercase">Start</div>}
                <button disabled={isLocked} onClick={() => startSession(nodeIdx, unit.difficulty as Difficulty)} className={`w-20 h-20 rounded-full btn-3d flex items-center justify-center text-4xl shadow-2xl transition-all ${isLocked ? 'bg-[var(--bg-hover)] opacity-50' : (unit.color === 'green' ? 'btn-green' : unit.color === 'blue' ? 'btn-blue' : unit.color === 'purple' ? 'btn-purple' : unit.color === 'orange' ? 'btn-orange' : 'btn-red')} ${isCurrent ? 'scale-110 ring-4 ring-slate-900/10' : ''}`}>
                  {isLocked ? '🔒' : (activeTrack === 'english' ? '🇺🇸' : '🇯🇵')}
                </button>
              </div>
            );
          })}
        </div>
      </section>
    ));
  };

  return (
    <div className="min-h-screen w-full bg-[var(--bg-main)] text-[var(--text-main)] flex flex-col items-center font-sans overflow-x-hidden transition-colors duration-300">
      
      {/* Sidebar Navigation */}
      <aside className="hidden lg:flex flex-col w-64 border-r-2 border-[var(--border-main)] p-6 fixed left-0 top-0 bottom-0 bg-[var(--bg-sidebar)] z-50">
        <h1 className="text-2xl font-black text-[#58cc02] tracking-tighter uppercase italic mb-12">lingomaster</h1>
        <nav className="flex-1 space-y-3">
          <button onClick={() => setMode('path')} className={`sidebar-item w-full ${mode === 'path' ? 'active' : ''}`}>
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
             LEARN PATH
          </button>
          <button onClick={() => setMode('practice')} className={`sidebar-item w-full ${mode === 'practice' ? 'active' : ''}`}>
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
             PRACTICE CENTER
          </button>
          <button onClick={() => setMode('analytics')} className={`sidebar-item w-full ${mode === 'analytics' ? 'active' : ''}`}>
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
             STATISTICS
          </button>
          <button onClick={() => setMode('add')} className={`sidebar-item w-full ${mode === 'add' ? 'active' : ''}`}>
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
             ADD NEW
          </button>
          <button onClick={toggleTheme} className="sidebar-item w-full mt-4">
             <span className="text-lg">{theme === 'light' ? '🌙' : '☀️'}</span>
             <span>THEME</span>
          </button>
        </nav>
        <div className="mt-auto p-4 bg-[var(--bg-hover)] rounded-2xl border-2 border-[var(--border-main)] text-center">
           <p className="text-[10px] font-black uppercase mb-1">Track Progress</p>
           <div className="lingo-progress h-2 mb-2"><div className="lingo-progress-inner bg-[#58cc02]" style={{ width: '45%' }}></div></div>
           <p className="text-[10px] font-black">{activeTrack === 'english' ? 'TOEIC 700+' : 'JLPT N2'}</p>
        </div>
      </aside>

      <main className="flex-1 w-full flex flex-col items-center min-h-screen lg:pl-64">
        <div className="w-full max-w-[800px] flex flex-col items-center p-4 sm:p-10 md:p-16 pb-32">
          
          {(mode === 'path' || mode === 'practice') && (
            <header className="w-full flex flex-col gap-6 mb-16 border-b-2 border-[var(--border-main)] pb-8">
              <div className="flex items-center justify-between w-full">
                <h2 className="text-xl font-black uppercase tracking-tight">{mode === 'path' ? 'Curriculum Path' : 'Practice Center'}</h2>
                <div style={{ width: '36px', height: '36px' }} className="rounded-full border-2 border-[var(--border-main)] bg-[var(--bg-hover)] flex items-center justify-center text-sm shadow-sm">👤</div>
              </div>
              <div className="flex bg-[var(--bg-hover)] p-1.5 rounded-2xl border-2 border-[var(--border-main)] w-full max-w-sm self-center">
                <button onClick={() => setActiveTrack('english')} className={`flex-1 py-3 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-2 ${activeTrack === 'english' ? 'bg-[var(--bg-card)] shadow-md text-[#1cb0f6]' : 'text-[var(--text-muted)]'}`}>🇺🇸 ENGLISH</button>
                <button onClick={() => setActiveTrack('japanese')} className={`flex-1 py-3 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-2 ${activeTrack === 'japanese' ? 'bg-[var(--bg-card)] shadow-md text-[#ff4b4b]' : 'text-[var(--text-muted)]'}`}>🇯🇵 JAPANESE</button>
              </div>
            </header>
          )}

          {mode === 'path' && <div className="w-full animate-in fade-in duration-1000 flex flex-col items-center">{renderPath()}</div>}

          {mode === 'practice' && (
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-bottom-8 duration-700">
               <div className="lingo-card flex flex-col gap-6 p-8 col-span-full bg-slate-900 text-white border-transparent">
                  <div className="flex items-center gap-4">
                     <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-3xl">📝</div>
                     <div><h3 className="text-2xl font-black uppercase leading-none">Full Mock Exam</h3><p className="text-xs font-bold opacity-60 uppercase mt-2">Simulation of actual test pressure</p></div>
                  </div>
                  <button onClick={() => startDrill('quiz')} className="w-full btn-3d btn-blue py-4 font-black">START 20-QUESTION EXAM</button>
               </div>

               <div className="lingo-card p-6 flex flex-col items-center text-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-[#58cc02]/10 text-[#58cc02] flex items-center justify-center text-2xl">🗂️</div>
                  <h4 className="font-black uppercase text-sm">Vocab Drill</h4>
                  <p className="text-xs font-bold text-[var(--text-muted)]">Practice all flashcards in your database</p>
                  <button onClick={() => startDrill('flashcard')} className="w-full btn-3d btn-green py-3 text-xs">START DRILL</button>
               </div>

               <div className="lingo-card p-6 flex flex-col items-center text-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-[#1cb0f6]/10 text-[#1cb0f6] flex items-center justify-center text-2xl">⌨️</div>
                  <h4 className="font-black uppercase text-sm">Dictation</h4>
                  <p className="text-xs font-bold text-[var(--text-muted)]">Perfect your listening by typing phrases</p>
                  <button onClick={() => startDrill('dictation')} className="w-full btn-3d btn-blue py-3 text-xs">START DRILL</button>
               </div>

               <div className="lingo-card p-6 flex flex-col items-center text-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-[#ce82ff]/10 text-[#ce82ff] flex items-center justify-center text-2xl">🎙️</div>
                  <h4 className="font-black uppercase text-sm">Speaking</h4>
                  <p className="text-xs font-bold text-[var(--text-muted)]">Focus on pronunciation and clarity</p>
                  <button onClick={() => startDrill('speaking')} className="w-full btn-3d btn-purple py-3 text-xs">START DRILL</button>
               </div>

               <div className="lingo-card p-6 flex flex-col items-center text-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-[#afafaf]/10 text-[#afafaf] flex items-center justify-center text-2xl">➕</div>
                  <h4 className="font-black uppercase text-sm">Collection</h4>
                  <p className="text-xs font-bold text-[var(--text-muted)]">Review and manage your personal words</p>
                  <button onClick={() => setMode('collection')} className="w-full btn-3d btn-outline py-3 text-xs uppercase">Open Library</button>
               </div>
            </div>
          )}

          {mode === 'session' && (
            <div className="w-full flex flex-col items-center">
              <div className="w-full flex items-center gap-6 mb-12 max-w-2xl">
                 <button onClick={() => setMode('path')} className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-[var(--bg-hover)] text-[var(--text-muted)] transition-all"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M6 18L18 6M6 6l12 12" /></svg></button>
                 <div className="flex-1 lingo-progress"><div className="lingo-progress-inner bg-[#58cc02]" style={{ width: `${((currentTaskIndex + 1) / sessionTasks.length) * 100}%` }}></div></div>
                 <span className="text-xs font-black text-[var(--text-muted)]">{currentTaskIndex + 1}/{sessionTasks.length}</span>
              </div>
              {!isSessionFinished ? (
                <div className="w-full max-w-xl">
                  {sessionTasks[currentTaskIndex].type === 'flashcard' && <FlashcardView card={sessionTasks[currentTaskIndex].data as Flashcard} onRate={(grade) => nextTask(grade >= 3)} />}
                  {sessionTasks[currentTaskIndex].type === 'quiz' && <QuizView questions={[sessionTasks[currentTaskIndex].data as Question]} category={activeTrack === 'english' ? 'toeic' : 'n2'} onComplete={(res) => nextTask(res.score === 1)} onCancel={() => setMode('path')} hideSummary={true} />}
                  {sessionTasks[currentTaskIndex].type === 'listening' && <ListeningView lesson={sessionTasks[currentTaskIndex].data as ListeningLesson} onBack={() => nextTask(true)} hideBackButton={true} />}
                  {sessionTasks[currentTaskIndex].type === 'speaking' && <SpeakingView lesson={sessionTasks[currentTaskIndex].data as SpeakingLesson} onComplete={() => nextTask(true)} />}
                  {sessionTasks[currentTaskIndex].type === 'dictation' && <DictationView lesson={sessionTasks[currentTaskIndex].data as DictationLesson} onComplete={(isCorrect) => nextTask(isCorrect)} />}
                </div>
              ) : (
                <div className="w-full max-w-lg bg-[var(--bg-card)] lingo-card text-center space-y-8 animate-in zoom-in-95 duration-500">
                  <div className="text-8xl floating">🎯</div>
                  <h2 className="text-4xl font-black uppercase tracking-tight">Session Results</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#f2fcf0] p-6 rounded-2xl border-2 border-[#58cc02]"><p className="text-[10px] font-black text-[#58cc02] uppercase mb-1">Correct</p><p className="text-4xl font-black text-[#58cc02]">{sessionCorrect}</p></div>
                    <div className="bg-[#fff5f5] p-6 rounded-2xl border-2 border-[#ff4b4b]"><p className="text-[10px] font-black text-[#ff4b4b] uppercase mb-1">Incorrect</p><p className="text-4xl font-black text-[#ff4b4b]">{sessionIncorrect}</p></div>
                  </div>
                  <div className="pt-4"><button onClick={finalizeSession} className="w-full btn-3d btn-blue py-6 text-xl uppercase shadow-blue-100">CONTINUE JOURNEY</button></div>
                </div>
              )}
            </div>
          )}

          {mode === 'add' && (
             <div className="w-full max-w-xl flex flex-col items-center">
                <div className="w-full flex justify-start mb-8"><button onClick={() => setMode('path')} className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-[var(--bg-hover)] text-[var(--text-muted)] transition-all"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M6 18L18 6M6 6l12 12" /></svg></button></div>
                <AddFlashcard onAdd={handleAddCard} />
                </div>
                )}

                {mode === 'collection' && (
                <div className="w-full flex flex-col items-center">
                <div className="w-full flex justify-start mb-8 max-w-4xl">
                 <button onClick={() => setMode('practice')} className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-[var(--bg-hover)] text-[var(--text-muted)] transition-all"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M6 18L18 6M6 6l12 12" /></svg></button>
                </div>
                <CollectionView cards={cards} activeTrack={activeTrack} onDelete={handleRemoveCard} />
                </div>
                )}

                {mode === 'analytics' && (
                <div className="w-full flex flex-col items-center">
                <div className="w-full flex justify-start mb-8 max-w-4xl">
                 <button onClick={() => setMode('path')} className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-[var(--bg-hover)] text-[var(--text-muted)] transition-all"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M6 18L18 6M6 6l12 12" /></svg></button>
                </div>
                <AnalyticsView results={examResults} activeTrack={activeTrack} />
                </div>
                )}

                <footer className="mt-48 pt-8 border-t border-[var(--border-main)] w-full text-center">
<p className="text-[10px] font-black text-[var(--text-muted)] tracking-[0.4em] uppercase">Lingomaster • Specialized Multi-Track Journey v2.0</p></footer>
        </div>
      </main>

      {/* Bottom Nav - Mobile */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-20 bg-[var(--bg-sidebar)] border-t-2 border-[var(--border-main)] flex items-center justify-around px-6 z-50">
        <button onClick={() => setMode('path')} className={`flex flex-col items-center gap-1 ${mode === 'path' ? 'text-[#1cb0f6]' : 'text-[var(--text-muted)]'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill={mode === 'path' ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
          <span className="text-[9px] font-black">PATH</span>
        </button>
        <button onClick={() => setMode('practice')} className={`flex flex-col items-center gap-1 ${mode === 'practice' ? 'text-[#1cb0f6]' : 'text-[var(--text-muted)]'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill={mode === 'practice' ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          <span className="text-[9px] font-black">PRACTICE</span>
        </button>
        <button onClick={() => setMode('add')} className={`flex flex-col items-center gap-1 ${mode === 'add' ? 'text-[#1cb0f6]' : 'text-[var(--text-muted)]'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill={mode === 'add' ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span className="text-[9px] font-black">ADD</span>
        </button>
      </nav>
    </div>
  );
}

export default App;
