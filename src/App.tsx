import { useState, useEffect } from 'react';
import { AddFlashcard } from './components/AddFlashcard';
import { FlashcardView } from './components/FlashcardView';
import { QuizView } from './components/QuizView';
import { ListeningView } from './components/ListeningView';
import type { Flashcard, ReviewGrade, ExamResult, ListeningLesson } from './types';
import { calculateSM2, getNextReviewDate } from './utils/sm2';
import { MOCK_QUESTIONS, MOCK_LISTENING_LESSONS } from './utils/mockData';

function App() {
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [examResults, setExamResults] = useState<ExamResult[]>([]);
  const [mode, setMode] = useState<'home' | 'review' | 'quiz' | 'listening' | 'add'>('home');
  const [quizCategory, setQuizCategory] = useState<'toeic' | 'n2'>('toeic');
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [selectedLesson, setSelectedLesson] = useState<ListeningLesson | null>(null);

  useEffect(() => {
    const savedCards = localStorage.getItem('language-cards');
    if (savedCards) setCards(JSON.parse(savedCards));
    const savedResults = localStorage.getItem('language-exam-results');
    if (savedResults) setExamResults(JSON.parse(savedResults));
  }, []);

  useEffect(() => {
    localStorage.setItem('language-cards', JSON.stringify(cards));
  }, [cards]);

  useEffect(() => {
    localStorage.setItem('language-exam-results', JSON.stringify(examResults));
  }, [examResults]);

  const handleAddCard = (data: { word: string; definition: string; language: 'english' | 'japanese' }) => {
    const newCard: Flashcard = {
      id: crypto.randomUUID(),
      user_id: 'guest',
      word: data.word,
      definition: data.definition,
      language: data.language,
      category: data.language === 'english' ? 'toeic' : 'n2',
      repetition: 0,
      interval: 0,
      easiness: 2.5,
      next_review: new Date().toISOString(),
      created_at: new Date().toISOString(),
    };
    setCards([...cards, newCard]);
    setMode('home');
  };

  const handleRateCard = (grade: ReviewGrade) => {
    const card = reviewQueue[currentCardIndex];
    const { repetition, interval, easiness } = calculateSM2(
      grade,
      card.repetition,
      card.interval,
      card.easiness
    );

    const updatedCard = {
      ...card,
      repetition,
      interval,
      easiness,
      next_review: getNextReviewDate(interval),
    };

    const updatedCards = cards.map((c) => (c.id === card.id ? updatedCard : c));
    setCards(updatedCards);

    if (currentCardIndex < reviewQueue.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    } else {
      setMode('home');
      setCurrentCardIndex(0);
    }
  };

  const handleCompleteQuiz = (result: ExamResult) => {
    setExamResults([result, ...examResults]);
    setMode('home');
  };

  const reviewQueue = cards.filter((c) => new Date(c.next_review) <= new Date());
  const filteredQuestions = MOCK_QUESTIONS.filter(q => q.category === quizCategory);

  return (
    <div className="min-h-screen flex bg-white font-sans text-[#4b4b4b]">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-64 border-r-2 border-[#e5e5e5] p-4 fixed h-full bg-white z-50">
        <div className="mb-12 px-4 pt-6">
          <h1 className="text-3xl font-black text-[#58cc02] tracking-tighter uppercase italic leading-none">lingomaster</h1>
        </div>
        
        <nav className="flex-1 space-y-2">
          <button 
            onClick={() => setMode('home')}
            className={`sidebar-item w-full ${mode === 'home' ? 'active' : ''}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            LEARN
          </button>
          <button 
            onClick={() => setMode('review')}
            className={`sidebar-item w-full ${mode === 'review' ? 'active' : ''}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            CARDS
          </button>
          <button 
            onClick={() => setMode('quiz')}
            className={`sidebar-item w-full ${mode === 'quiz' ? 'active' : ''}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            QUESTS
          </button>
          <button 
            onClick={() => setMode('listening')}
            className={`sidebar-item w-full ${mode === 'listening' ? 'active' : ''}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
            AUDIO
          </button>
        </nav>

        <div className="mt-auto p-6 bg-[#f7f7f7] rounded-[2rem] border-2 border-[#e5e5e5] relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-16 h-16 bg-[#58cc02]/10 rounded-bl-[2rem] -mr-4 -mt-4 transition-all group-hover:scale-110"></div>
          <p className="text-[10px] font-black text-[#777] uppercase tracking-[0.2em] mb-3">Daily Progress</p>
          <div className="lingo-progress mb-3">
             <div className="lingo-progress-inner bg-[#58cc02]" style={{ width: '65%' }}></div>
          </div>
          <p className="text-xs font-black text-[#4b4b4b]">65% COMPLETED</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 p-4 md:p-10 max-w-4xl mx-auto w-full min-h-screen">
        {mode === 'home' && (
          <div className="space-y-12 pb-24 animate-in fade-in duration-700">
            {/* Top Status Bar */}
            <div className="flex items-center justify-between py-2 border-b-2 border-[#e5e5e5]">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 hover:scale-110 transition-transform cursor-help">
                  <span className="text-2xl">🔥</span>
                  <span className="font-black text-[#ff9600] text-lg">3</span>
                </div>
                <div className="flex items-center gap-2 hover:scale-110 transition-transform cursor-help">
                  <span className="text-2xl">💎</span>
                  <span className="font-black text-[#1cb0f6] text-lg">120</span>
                </div>
                <div className="flex items-center gap-2 hover:scale-110 transition-transform cursor-help">
                  <span className="text-2xl">❤️</span>
                  <span className="font-black text-[#ff4b4b] text-lg">5</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                 <div className="text-right hidden sm:block">
                  <p className="text-[10px] font-black text-[#afafaf] uppercase tracking-widest">Active Level</p>
                  <p className="text-sm font-black text-[#4b4b4b]">INTERMEDIATE</p>
                </div>
                <div className="w-12 h-12 rounded-full border-2 border-[#e5e5e5] p-0.5 bg-white shadow-sm overflow-hidden hover:border-[#1cb0f6] transition-colors cursor-pointer">
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" className="rounded-full" />
                </div>
              </div>
            </div>

            {/* Path Journey */}
            <div className="path-container max-w-lg mx-auto">
              {/* Unit Banner */}
              <div className="unit-banner w-full text-center sm:text-left relative">
                 <div className="absolute top-4 right-4 text-4xl opacity-20 floating">✨</div>
                 <h4 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80 mb-2">Section 1</h4>
                 <h2 className="text-3xl font-black mb-1">Vocabulary Master</h2>
                 <p className="font-bold text-white/90">Essential business & life foundation</p>
              </div>

              {/* Zig-Zag Learning Path */}
              <div className="flex flex-col items-center gap-12 w-full relative">
                {/* Connecting Lines (Absolute behind) */}
                <div className="absolute top-20 bottom-0 left-1/2 -translate-x-1/2 w-3 bg-[#e5e5e5] rounded-full z-0 opacity-50"></div>

                {/* Level 1: Flashcards (Center) */}
                <div className="z-10 relative">
                   <div className="absolute -top-14 left-1/2 -translate-x-1/2 bg-[#58cc02] text-white px-5 py-2 rounded-2xl font-black text-xs shadow-[0_4px_0_0_#46a302] whitespace-nowrap animate-bounce">
                    START HERE!
                  </div>
                  <button 
                    onClick={() => setMode('review')}
                    className="w-28 h-28 rounded-full btn-3d btn-green text-6xl shadow-2xl flex items-center justify-center relative overflow-visible"
                  >
                    <span className="mt-[-8px]">🗂️</span>
                    {/* Ring indicator */}
                    <div className="absolute inset-0 border-8 border-white/20 rounded-full animate-pulse"></div>
                  </button>
                  <div className="mt-4 text-center font-black text-[#777] uppercase tracking-widest text-[11px]">Daily Review</div>
                </div>

                {/* Level 2: TOEIC (Left) */}
                <div className="z-10 -ml-32">
                  <button 
                    onClick={() => { setQuizCategory('toeic'); setMode('quiz'); }}
                    className="w-24 h-24 rounded-full btn-3d btn-blue text-5xl shadow-2xl flex items-center justify-center"
                  >
                    <span className="mt-[-6px]">🇬🇧</span>
                  </button>
                  <div className="mt-4 text-center font-black text-[#777] uppercase tracking-widest text-[11px]">TOEIC 700+</div>
                </div>

                {/* Level 3: JLPT N2 (Right) */}
                <div className="z-10 -mr-32">
                  <button 
                    onClick={() => { setQuizCategory('n2'); setMode('quiz'); }}
                    className="w-24 h-24 rounded-full btn-3d btn-red text-5xl shadow-2xl flex items-center justify-center"
                  >
                    <span className="mt-[-6px]">🇯🇵</span>
                  </button>
                  <div className="mt-4 text-center font-black text-[#777] uppercase tracking-widest text-[11px]">JLPT N2</div>
                </div>

                {/* Level 4: Listening (Center) */}
                <div className="z-10">
                  <button 
                    onClick={() => setMode('listening')}
                    className="w-28 h-28 rounded-full btn-3d btn-purple text-6xl shadow-2xl flex items-center justify-center"
                  >
                    <span className="mt-[-8px]">🎧</span>
                  </button>
                  <div className="mt-4 text-center font-black text-[#777] uppercase tracking-widest text-[11px]">Deep Audio</div>
                </div>

                {/* Level 5: Add New (Left) */}
                <div className="z-10 -ml-32 opacity-80 hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => setMode('add')}
                    className="w-24 h-24 rounded-full btn-3d btn-outline text-5xl shadow-2xl flex items-center justify-center"
                  >
                    <span className="mt-[-6px]">➕</span>
                  </button>
                  <div className="mt-4 text-center font-black text-[#777] uppercase tracking-widest text-[11px]">New Word</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Action Screens */}
        <div className="max-w-2xl mx-auto w-full">
           {mode === 'add' && (
             <div className="animate-in slide-in-from-bottom-12 duration-500">
                <div className="mb-10">
                  <button onClick={() => setMode('home')} className="w-12 h-12 flex items-center justify-center rounded-2xl hover:bg-[#f7f7f7] text-[#afafaf] transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <AddFlashcard onAdd={handleAddCard} />
             </div>
           )}

           {mode === 'review' && (
             <div className="animate-in fade-in duration-500">
               <div className="w-full flex items-center gap-6 mb-12">
                  <button onClick={() => setMode('home')} className="text-[#afafaf] hover:text-[#777] transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  <div className="flex-1 lingo-progress">
                    <div 
                      className="lingo-progress-inner bg-[#58cc02]"
                      style={{ width: `${reviewQueue.length > 0 ? ((currentCardIndex + 1) / reviewQueue.length) * 100 : 0}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-black text-[#afafaf] tabular-nums">{currentCardIndex + 1}/{reviewQueue.length}</span>
                </div>

                {reviewQueue.length > 0 ? (
                  <FlashcardView card={reviewQueue[currentCardIndex]} onRate={handleRateCard} />
                ) : (
                  <div className="text-center py-24 lingo-card p-12 w-full max-w-lg mx-auto">
                    <div className="text-8xl mb-8 floating">🏆</div>
                    <h3 className="text-4xl font-black text-[#4b4b4b] mb-4 uppercase tracking-tight">Lesson Mastered!</h3>
                    <p className="text-lg font-bold text-[#777] mb-12">You've cleared your queue. Come back later for more review!</p>
                    <button onClick={() => setMode('home')} className="w-full btn-3d btn-blue text-xl py-6 rounded-2xl shadow-blue-100">
                      RETURN TO PATH
                    </button>
                  </div>
                )}
             </div>
           )}

           {mode === 'quiz' && (
             <div className="animate-in zoom-in-95 duration-500">
                <div className="mb-10">
                  <button onClick={() => setMode('home')} className="w-12 h-12 flex items-center justify-center rounded-2xl hover:bg-[#f7f7f7] text-[#afafaf] transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <QuizView 
                  questions={filteredQuestions} 
                  category={quizCategory} 
                  onComplete={handleCompleteQuiz} 
                  onCancel={() => setMode('home')} 
                />
             </div>
           )}

           {mode === 'listening' && (
             <div className="space-y-10 animate-in slide-in-from-bottom-12 duration-500">
                {!selectedLesson ? (
                   <div className="space-y-10">
                      <div className="flex items-center gap-6">
                        <button onClick={() => setMode('home')} className="w-12 h-12 flex items-center justify-center rounded-2xl hover:bg-[#f7f7f7] text-[#afafaf] transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                        <h2 className="text-4xl font-black text-[#4b4b4b] uppercase tracking-tight">Audio Journey</h2>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-6">
                        {MOCK_LISTENING_LESSONS.map((lesson) => (
                          <div 
                            key={lesson.id}
                            onClick={() => setSelectedLesson(lesson)}
                            className="lingo-card p-8 cursor-pointer group flex items-center gap-8 hover:scale-[1.02] active:scale-95 transition-all"
                          >
                            <div className={`w-20 h-20 rounded-2xl flex-shrink-0 flex items-center justify-center text-white font-black text-2xl shadow-lg ${lesson.category === 'toeic' ? 'bg-[#1cb0f6]' : 'bg-[#ff4b4b]'}`}>
                              {lesson.category.toUpperCase().charAt(0)}
                            </div>
                            <div className="flex-1">
                              <p className="text-[10px] font-black text-[#afafaf] uppercase tracking-widest mb-1">{lesson.category} SESSION</p>
                              <h6 className="font-black text-2xl text-[#4b4b4b] mb-1 group-hover:text-[#1cb0f6] transition-colors">{lesson.title}</h6>
                              <div className="flex items-center gap-2 mt-2">
                                 <span className="w-2 h-2 rounded-full bg-[#58cc02]"></span>
                                 <span className="text-xs font-bold text-[#777]">AVAILABLE NOW</span>
                              </div>
                            </div>
                            <div className="text-[#afafaf] group-hover:text-[#58cc02] group-hover:translate-x-2 transition-all">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          </div>
                        ))}
                      </div>
                   </div>
                ) : (
                  <ListeningView 
                    lesson={selectedLesson} 
                    onBack={() => setSelectedLesson(null)} 
                  />
                )}
             </div>
           )}
        </div>
      </main>
    </div>
  );
}

export default App;
