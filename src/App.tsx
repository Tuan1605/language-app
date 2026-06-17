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
import type { Flashcard, ExamResult, ListeningLesson, SpeakingLesson, Question, Difficulty, DictationLesson, ReviewGrade } from './types';
import { calculateSM2, getNextReviewDate } from './utils/sm2';
import { MOCK_QUESTIONS, MOCK_LISTENING_LESSONS, MOCK_CARDS, MOCK_SPEAKING_LESSONS, MOCK_DICTATION_LESSONS } from './utils/mockData';

// --- GAMIFIED CURRICULUMS ---
const TOEIC_CURRICULUM = [
  { id: 1, title: 'First Words!', desc: 'Basic Business Words', nodes: 8, difficulty: 'beginner', color: '#58cc02', shadow: '#58a700', text: 'text-white' },
  { id: 2, title: 'At the Office', desc: 'Office Survival 300', nodes: 12, difficulty: 'intermediate', color: '#1cb0f6', shadow: '#1899d6', text: 'text-white' },
  { id: 3, title: 'Big Meetings', desc: 'Professional Meetings', nodes: 18, difficulty: 'advanced', color: '#ce82ff', shadow: '#a561cf', text: 'text-white' },
  { id: 4, title: 'The Boss', desc: 'Executive Mastery', nodes: 30, difficulty: 'advanced', color: '#ff4b4b', shadow: '#ea2b2b', text: 'text-white' },
];

const N2_CURRICULUM = [
  { id: 1, title: 'Hiragana & N5', desc: 'Basic Literacy', nodes: 10, difficulty: 'beginner', color: '#58cc02', shadow: '#58a700', text: 'text-white' },
  { id: 2, title: 'Tokyo Trip', desc: 'Daily Fluency N4', nodes: 15, difficulty: 'intermediate', color: '#ff4b4b', shadow: '#ea2b2b', text: 'text-white' },
  { id: 3, title: 'Newspaper', desc: 'Academic Reading N3', nodes: 20, difficulty: 'advanced', color: '#1cb0f6', shadow: '#1899d6', text: 'text-white' },
  { id: 4, title: 'N2 Master!', desc: 'The Final Boss', nodes: 35, difficulty: 'advanced', color: '#ffc800', shadow: '#cda000', text: 'text-[#4b4b4b]' },
];

type SessionTask = 
  | { type: 'vocab-quiz'; data: Flashcard }
  | { type: 'quiz'; data: Question }
  | { type: 'listening'; data: ListeningLesson }
  | { type: 'speaking'; data: SpeakingLesson }
  | { type: 'dictation'; data: DictationLesson };

function App() {
  const [cards, setCards] = useState<Flashcard[]>(MOCK_CARDS);
  const [examResults, setExamResults] = useState<ExamResult[]>([]);
  const [mode, setMode] = useState<'path' | 'practice' | 'session' | 'add' | 'collection' | 'analytics' | 'review'>('path');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [activeTrack, setActiveTrack] = useState<'english' | 'japanese'>('english');
  const [unlockedEn, setUnlockedEn] = useState(0);
  const [unlockedJa, setUnlockedJa] = useState(0);

  const [sessionTasks, setSessionTasks] = useState<SessionTask[]>([]);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [isSessionFinished, setIsSessionFinished] = useState(false);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);

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
    
    // Force rounded font across the app for Duolingo feel
    document.body.style.fontFamily = "'Nunito', 'Quicksand', sans-serif";
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

  const handleRemoveCard = (id: string) => { setCards(cards.filter(c => c.id !== id)); };

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
      { type: 'vocab-quiz', data: vList[nodeIdx % vList.length] },
      { type: 'quiz', data: qList[nodeIdx % qList.length] },
      { type: 'listening', data: lList[nodeIdx % lList.length] },
      { type: 'dictation', data: dList[nodeIdx % dList.length] },
      { type: 'speaking', data: sList[nodeIdx % sList.length] },
    ];

    setSessionTasks(newTasks);
    setCurrentTaskIndex(0); setIsSessionFinished(false); setMode('session');
  };

  const startDrill = (type: SessionTask['type'] | 'review') => {
    if (type === 'review') { setCurrentReviewIndex(0); setMode('review'); return; }
    const filtered = (type === 'vocab-quiz') ? cards.filter(c => c.language === activeTrack) :
                     (type === 'quiz') ? MOCK_QUESTIONS.filter(q => (activeTrack === 'english' ? q.category === 'toeic' : q.category === 'n2')) :
                     (type === 'listening') ? MOCK_LISTENING_LESSONS.filter(l => (activeTrack === 'english' ? l.category === 'toeic' : l.category === 'n2')) :
                     (type === 'speaking') ? MOCK_SPEAKING_LESSONS.filter(s => (activeTrack === 'english' ? s.category === 'toeic' : s.category === 'n2')) :
                     MOCK_DICTATION_LESSONS.filter(d => (activeTrack === 'english' ? d.category === 'toeic' : d.category === 'n2'));
    const newTasks: SessionTask[] = filtered.slice(0, 10).map(item => ({ type, data: item } as any));
    setSessionTasks(newTasks);
    setCurrentTaskIndex(0); setIsSessionFinished(false); setMode('session');
  };

  const handleRateCard = (grade: ReviewGrade) => {
    const reviewQueue = cards.filter(c => c.language === activeTrack);
    const card = reviewQueue[currentReviewIndex];
    const { repetition, interval, easiness } = calculateSM2(grade, card.repetition, card.interval, card.easiness);
    const updatedCard = { ...card, repetition, interval, easiness, next_review: getNextReviewDate(interval) };
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

  const handleAddCard = (data: { word: string; definition: string; language: 'english' | 'japanese' }) => {
    const newCard: Flashcard = {
      id: crypto.randomUUID(), user_id: 'guest', word: data.word, definition: data.definition, language: data.language,
      category: data.language === 'english' ? 'toeic' : 'n2', difficulty: 'beginner', repetition: 0, interval: 0, easiness: 2.5,
      next_review: new Date().toISOString(), created_at: new Date().toISOString(),
    };
    setCards([...cards, newCard]); setMode('path');
  };

  const currentCurriculum = activeTrack === 'english' ? TOEIC_CURRICULUM : N2_CURRICULUM;
  const currentUnlocked = activeTrack === 'english' ? unlockedEn : unlockedJa;

  const renderPath = () => {
    let globalNodeIndex = 0;
    const VIEWBOX_WIDTH = 400;
    const CENTER_X = 200;
    const NODE_Y_SPACING = 180; // Tăng khoảng cách theo chiều dọc để thoáng hơn
    const START_Y = 80;
    // Tăng biên độ lắc ngang để tương xứng với chiều cao mới
    const organicOffsets = [0, 50, 85, 100, 85, 50, 0, -50, -85, -100, -85, -50];

    return currentCurriculum.map((unit) => {
      // 1. Calculate absolute coordinates for every node in this unit
      const unitNodes = Array.from({ length: unit.nodes }).map((_, i) => {
        const idx = globalNodeIndex + i;
        const xOffset = organicOffsets[idx % organicOffsets.length];
        const svgX = CENTER_X + xOffset;
        const svgY = START_Y + i * NODE_Y_SPACING;
        return { idx, svgX, svgY };
      });

      const sectionHeight = START_Y + (unit.nodes - 1) * NODE_Y_SPACING + 160;

      // 2. Generate perfect Bezier curves
      let fullPathD = '';
      let activePathD = '';

      unitNodes.forEach((node, i) => {
        if (i === 0) {
          fullPathD += `M ${node.svgX} ${node.svgY} `;
          if (node.idx <= currentUnlocked) activePathD += `M ${node.svgX} ${node.svgY} `;
        } else {
          const prev = unitNodes[i - 1];
          // Thuật toán Bezier mềm mượt tuyệt đối: Lấy đúng điểm giữa Y làm Control Point cho cả 2
          const midY = (prev.svgY + node.svgY) / 2;
          const curve = `C ${prev.svgX} ${midY}, ${node.svgX} ${midY}, ${node.svgX} ${node.svgY} `;
          fullPathD += curve;
          if (node.idx <= currentUnlocked) {
            activePathD += curve;
          }
        }
      });

      globalNodeIndex += unit.nodes;

      return (
        <section key={unit.id} className="w-full flex flex-col items-center mb-16 relative">
          
          {/* Colorful Gamified Unit Header */}
          <div className={`w-full max-w-xl p-8 rounded-3xl ${unit.color} ${unit.text} mb-12 flex flex-col justify-center relative overflow-hidden z-20 shadow-[0_8px_0_rgba(0,0,0,0.15)]`}>
             <div className="flex justify-between items-center z-10 relative">
               <div className="space-y-1">
                 <h2 className="text-3xl font-black uppercase tracking-tight">Unit {unit.id}</h2>
                 <p className="text-sm font-bold opacity-90">{unit.title} • {unit.desc}</p>
               </div>
               <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center text-4xl shadow-inner">
                 {unit.id === 1 ? '🌟' : unit.id === 2 ? '🚀' : unit.id === 3 ? '👑' : '🏆'}
               </div>
             </div>
          </div>

          {/* ABSOLUTE ALIGNED MAP CONTAINER */}
          <div className="relative w-full max-w-[500px]" style={{ height: `${sectionHeight}px` }}>
            
            {/* The SVG Road underneath */}
            <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
               <svg width="100%" height="100%" viewBox={`0 0 ${VIEWBOX_WIDTH} ${sectionHeight}`} preserveAspectRatio="none" className="overflow-visible">
                  {/* Nền xám chưa học - Làm thanh mảnh lại */}
                  <path d={fullPathD} fill="none" stroke="#cbd5e1" strokeWidth="28" strokeLinecap="round" strokeLinejoin="round" transform="translate(0, 8)" />
                  <path d={fullPathD} fill="none" stroke="#e2e8f0" strokeWidth="28" strokeLinecap="round" strokeLinejoin="round" />
                  
                  {/* Nền vàng đã học */}
                  {activePathD && <path d={activePathD} fill="none" stroke="var(--gold-shadow)" strokeWidth="28" strokeLinecap="round" strokeLinejoin="round" transform="translate(0, 8)" />}
                  {activePathD && <path d={activePathD} fill="none" stroke="var(--gold)" strokeWidth="28" strokeLinecap="round" strokeLinejoin="round" />}
                  
                  {/* Vạch đứt nét ở giữa - Tinh tế hơn */}
                  <path d={fullPathD} fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1 16" opacity="0.6" />
                  {activePathD && <path d={activePathD} fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1 16" opacity="1" />}
               </svg>
            </div>

            {/* The Nodes (Perfectly aligned with SVG centers) */}
            {unitNodes.map((node) => {
              const { idx, svgX, svgY } = node;
              const isLocked = idx > currentUnlocked;
              const isCurrent = idx === currentUnlocked;
              const isCrown = (idx + 1) % 5 === 0;

              // Convert SVG X coordinate to CSS percentage for flawless responsive horizontal alignment
              const leftPercent = (svgX / VIEWBOX_WIDTH) * 100;

              return (
                <div 
                  key={idx} 
                  className="absolute z-10 flex flex-col items-center" 
                  style={{ 
                    left: `${leftPercent}%`, 
                    top: `${svgY}px`,
                    transform: 'translate(-50%, -50%)' 
                  }}
                >
                  
                  {/* Current Node Tooltip */}
                  {isCurrent && (
                    <div className="absolute -top-16 bg-white text-[var(--green)] px-4 py-2 rounded-2xl font-black text-xs shadow-[0_4px_0_#e5e5e5] animate-bounce z-20 uppercase tracking-widest border-2 border-[var(--gray-path)] whitespace-nowrap">
                      START
                      {/* Tooltip triangle */}
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-b-2 border-r-2 border-[var(--gray-path)] rotate-45"></div>
                    </div>
                  )}
                  
                  <button 
                    disabled={isLocked}
                    onClick={() => startSession(idx, unit.difficulty as Difficulty)}
                    className={`duo-node ${isLocked ? 'locked' : ''} ${isCurrent ? 'current' : ''}`}
                    style={!isLocked && !isCurrent ? { backgroundColor: isCrown ? 'var(--gold)' : 'var(--green)', boxShadow: `0 8px 0 ${isCrown ? 'var(--gold-shadow)' : 'var(--green-shadow)'}` } : {}}
                  >
                    {isLocked ? (
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[var(--gray-path-dark)]/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                    ) : isCrown ? (
                      '👑'
                    ) : (
                      '⭐️'
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      );
    });
  };

  return (
    <div className="min-h-screen w-full bg-[var(--bg-main)] text-[var(--text-main)] flex flex-col items-center font-sans overflow-x-hidden transition-all duration-300">
      
      {/* Duolingo-style Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 border-r-2 border-[var(--gray-path)] p-6 fixed left-0 top-0 bottom-0 bg-[var(--bg-main)] z-50">
        <div className="mb-10 pl-2">
           <h1 className="text-3xl font-black text-[var(--green)] tracking-tighter">lingo</h1>
        </div>
        
        <nav className="flex-1 space-y-2">
          <button onClick={() => setMode('path')} className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl font-bold text-sm transition-colors border-2 ${mode === 'path' ? 'bg-[var(--blue-light)] text-[var(--blue)] border-[var(--blue-light)]' : 'border-transparent text-[var(--text-main)] hover:bg-[var(--gray-bg)]'}`}>
             <span className="text-2xl">🏠</span> LEARN
          </button>
          <button onClick={() => setMode('practice')} className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl font-bold text-sm transition-colors border-2 ${mode === 'practice' ? 'bg-[var(--blue-light)] text-[var(--blue)] border-[var(--blue-light)]' : 'border-transparent text-[var(--text-main)] hover:bg-[var(--gray-bg)]'}`}>
             <span className="text-2xl">🏋️</span> PRACTICE
          </button>
          <button onClick={() => setMode('analytics')} className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl font-bold text-sm transition-colors border-2 ${mode === 'analytics' ? 'bg-[var(--blue-light)] text-[var(--blue)] border-[var(--blue-light)]' : 'border-transparent text-[var(--text-main)] hover:bg-[var(--gray-bg)]'}`}>
             <span className="text-2xl">🛡️</span> LEAGUES
          </button>
          <button onClick={() => setMode('add')} className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl font-bold text-sm transition-colors border-2 ${mode === 'add' ? 'bg-[var(--blue-light)] text-[var(--blue)] border-[var(--blue-light)]' : 'border-transparent text-[var(--text-main)] hover:bg-[var(--gray-bg)]'}`}>
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
               <span className="text-[var(--red)] flex items-center gap-1">❤️ 5</span>
               <button onClick={toggleTheme} className="text-xl active:scale-95 transition-transform">{theme === 'light' ? '🌙' : '☀️'}</button>
            </div>
          </header>
        )}

        <div className="w-full max-w-[600px] flex flex-col items-center p-6 md:p-10 pb-40">
          
          {mode === 'path' && <div className="w-full animate-in fade-in duration-500 flex flex-col items-center">{renderPath()}</div>}

          {mode === 'practice' && (
            <div className="w-full flex flex-col gap-6 animate-in slide-in-from-bottom-8">
               <div className="w-full flex flex-col gap-4 p-8 rounded-[2rem] border-2 border-[var(--gray-path)] bg-[var(--gray-bg)]">
                  <div className="text-5xl">📝</div>
                  <div><h3 className="text-2xl font-black">Mock Exam</h3><p className="text-sm font-bold text-[var(--text-muted)]">Full test pressure</p></div>
                  <button onClick={() => startDrill('quiz')} className="btn-duo btn-blue h-14 mt-4 w-full">START TEST</button>
               </div>
               
               <div className="grid grid-cols-2 gap-6 w-full">
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
            </div>
          )}

          {/* Keep session logic similar but use duo-buttons */}
          {mode === 'session' && (
            <div className="w-full flex flex-col items-center animate-in fade-in duration-300 pt-10">
               <div className="w-full flex items-center gap-4 mb-10 px-4">
                  <button onClick={() => setMode('path')} className="text-2xl text-[var(--text-muted)] hover:text-[var(--text-main)] active:scale-90">✖</button>
                  <div className="flex-1 h-4 bg-[var(--gray-path)] rounded-full overflow-hidden">
                    <div className="h-full bg-[var(--green)] transition-all duration-300" style={{ width: `${((currentTaskIndex + 1) / sessionTasks.length) * 100}%` }}></div>
                  </div>
               </div>
               {!isSessionFinished ? (
                  <div className="w-full flex flex-col items-center">
                    {sessionTasks[currentTaskIndex].type === 'vocab-quiz' && <VocabQuizView word={sessionTasks[currentTaskIndex].data as Flashcard} allCards={cards} onComplete={() => nextTask()} />}
                    {sessionTasks[currentTaskIndex].type === 'quiz' && <QuizView questions={[sessionTasks[currentTaskIndex].data as Question]} category={activeTrack === 'english' ? 'toeic' : 'n2'} onComplete={() => nextTask()} onCancel={() => setMode('path')} hideSummary={true} />}
                    {sessionTasks[currentTaskIndex].type === 'listening' && <ListeningView lesson={sessionTasks[currentTaskIndex].data as ListeningLesson} onBack={() => nextTask()} hideBackButton={true} />}
                    {sessionTasks[currentTaskIndex].type === 'speaking' && <SpeakingView lesson={sessionTasks[currentTaskIndex].data as SpeakingLesson} onComplete={() => nextTask()} />}
                    {sessionTasks[currentTaskIndex].type === 'dictation' && <DictationView lesson={sessionTasks[currentTaskIndex].data as DictationLesson} onComplete={() => nextTask()} />}
                  </div>
               ) : (
                  <div className="w-full text-center space-y-8 animate-in zoom-in-95 duration-500 pt-10">
                     <div className="text-[120px] select-none">🎉</div>
                     <div className="space-y-2"><h2 className="text-4xl font-black text-[var(--gold)]">Lesson Complete!</h2><p className="text-base font-bold text-[var(--text-muted)]">You earned +10 XP</p></div>
                     <button onClick={finalizeSession} className="w-full btn-duo btn-green h-16 text-lg mt-10">CONTINUE</button>
                  </div>
               )}
            </div>
          )}

          {/* Management modes mapping */}
          {mode === 'add' && <div className="w-full mt-10"><AddFlashcard onAdd={handleAddCard} /></div>}
          {mode === 'collection' && <CollectionView cards={cards} activeTrack={activeTrack} onDelete={handleRemoveCard} />}
          {mode === 'analytics' && <AnalyticsView results={examResults} activeTrack={activeTrack} />}
          {mode === 'review' && <div className="w-full max-w-xl mt-10"><FlashcardView card={cards.filter(c => c.language === activeTrack)[currentReviewIndex]} onRate={handleRateCard} /></div>}

        </div>
      </main>

      {/* Mobile Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-20 bg-[var(--bg-main)] border-t-2 border-[var(--gray-path)] flex items-center justify-around px-2 z-50">
        <button onClick={() => setMode('path')} className={`p-3 rounded-2xl transition-all border-2 ${mode === 'path' ? 'bg-[var(--blue-light)] border-[var(--blue-light)] text-[var(--blue)]' : 'border-transparent text-[var(--text-muted)]'}`}><span className="text-2xl">🏠</span></button>
        <button onClick={() => setMode('practice')} className={`p-3 rounded-2xl transition-all border-2 ${mode === 'practice' ? 'bg-[var(--blue-light)] border-[var(--blue-light)] text-[var(--blue)]' : 'border-transparent text-[var(--text-muted)]'}`}><span className="text-2xl">🏋️</span></button>
        <button onClick={() => setMode('analytics')} className={`p-3 rounded-2xl transition-all border-2 ${mode === 'analytics' ? 'bg-[var(--blue-light)] border-[var(--blue-light)] text-[var(--blue)]' : 'border-transparent text-[var(--text-muted)]'}`}><span className="text-2xl">🛡️</span></button>
      </nav>
    </div>
  );
}

export default App;
