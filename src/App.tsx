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
    <div className="min-h-screen flex bg-white text-[#4b4b4b] selection:bg-[#ddf4ff] selection:text-[#1cb0f6]">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-64 border-r-2 border-[#e5e5e5] p-4 fixed h-full bg-white z-50">
        <div className="mb-10 px-4 pt-4">
          <h1 className="text-3xl font-black text-[#58cc02] tracking-tighter uppercase italic leading-none">lingomaster</h1>
        </div>
        
        <nav className="flex-1 space-y-2">
          <button onClick={() => setMode('home')} className={`sidebar-item w-full ${mode === 'home' ? 'active' : ''}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
            LEARN
          </button>
          <button onClick={() => setMode('review')} className={`sidebar-item w-full ${mode === 'review' ? 'active' : ''}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
            CARDS
          </button>
          <button onClick={() => setMode('quiz')} className={`sidebar-item w-full ${mode === 'quiz' ? 'active' : ''}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            QUESTS
          </button>
          <button onClick={() => setMode('listening')} className={`sidebar-item w-full ${mode === 'listening' ? 'active' : ''}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
            AUDIO
          </button>
        </nav>

        <div className="mt-auto p-4 bg-[#f7f7f7] rounded-2xl border-2 border-[#e5e5e5]">
           <p className="text-[9px] font-black text-[#afafaf] uppercase tracking-widest mb-2">Goal progress</p>
           <div className="lingo-progress mb-2"><div className="lingo-progress-inner bg-[#58cc02]" style={{ width: '65%' }}></div></div>
           <p className="text-[10px] font-black">65% OF DAILY GOAL</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 p-4 sm:p-6 md:p-12 max-w-4xl mx-auto w-full min-h-screen pb-24 lg:pb-12">
        {mode === 'home' && (
          <div className="space-y-12 pb-12 animate-in fade-in duration-700">
            {/* Top Bar */}
            <div className="flex items-center justify-between pb-6 border-b-2 border-[#e5e5e5]">
              <div className="flex items-center gap-4 sm:gap-6">
                <div className="flex items-center gap-1.5"><span className="text-xl">🔥</span><span className="font-black text-[#ff9600] text-base">3</span></div>
                <div className="flex items-center gap-1.5"><span className="text-xl">💎</span><span className="font-black text-[#1cb0f6] text-base">120</span></div>
                <div className="flex items-center gap-1.5"><span className="text-xl">❤️</span><span className="font-black text-[#ff4b4b] text-base">5</span></div>
              </div>
              <div className="w-9 h-9 rounded-full border-2 border-[#e5e5e5] overflow-hidden bg-[#f7f7f7] shadow-sm">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" className="w-full h-full object-cover" />
              </div>
            </div>

            {/* Learning Path */}
            <div className="flex flex-col items-center gap-12 max-w-sm mx-auto pt-4">
              <div className="w-full bg-[#58cc02] rounded-2xl p-6 text-white shadow-[0_6px_0_0_#46a302] mb-4">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80 mb-1">Unit 1</h4>
                <h2 className="text-2xl font-black leading-tight uppercase">Vocabulary</h2>
                <p className="font-bold text-white/90 text-sm mt-1 opacity-80">Level: Intermediate</p>
              </div>

              <div className="flex flex-col items-center gap-12 w-full relative">
                <div className="absolute top-10 bottom-10 left-1/2 -translate-x-1/2 w-3 bg-[#e5e5e5] rounded-full z-0 opacity-40"></div>

                {/* Path Nodes - Standardized Size w-20 */}
                <div className="z-10 relative">
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-[#58cc02] text-white px-4 py-1.5 rounded-xl font-black text-[10px] shadow-[0_4px_0_0_#46a302] whitespace-nowrap animate-bounce">START HERE</div>
                  <button onClick={() => setMode('review')} className="w-20 h-20 rounded-full btn-3d btn-green text-4xl shadow-lg flex items-center justify-center p-0">🗂️</button>
                </div>

                <div className="z-10 sm:-ml-24 flex flex-col items-center">
                  <button onClick={() => { setQuizCategory('toeic'); setMode('quiz'); }} className="w-20 h-20 rounded-full btn-3d btn-blue text-4xl shadow-lg flex items-center justify-center p-0">🇬🇧</button>
                  <span className="mt-2 text-[10px] font-black text-[#afafaf] uppercase tracking-widest">TOEIC</span>
                </div>

                <div className="z-10 sm:-mr-24 flex flex-col items-center">
                  <button onClick={() => { setQuizCategory('n2'); setMode('quiz'); }} className="w-20 h-20 rounded-full btn-3d btn-red text-4xl shadow-lg flex items-center justify-center p-0">🇯🇵</button>
                  <span className="mt-2 text-[10px] font-black text-[#afafaf] uppercase tracking-widest">JLPT N2</span>
                </div>

                <div className="z-10 flex flex-col items-center">
                  <button onClick={() => setMode('listening')} className="w-20 h-20 rounded-full btn-3d btn-purple text-4xl shadow-lg flex items-center justify-center p-0">🎧</button>
                  <span className="mt-2 text-[10px] font-black text-[#afafaf] uppercase tracking-widest">AUDIO</span>
                </div>

                <div className="z-10 sm:-ml-24 flex flex-col items-center opacity-60 hover:opacity-100 transition-opacity">
                  <button onClick={() => setMode('add')} className="w-20 h-20 rounded-full btn-3d btn-outline text-4xl shadow-lg flex items-center justify-center p-0">➕</button>
                  <span className="mt-2 text-[10px] font-black text-[#afafaf] uppercase tracking-widest text-center">ADD NEW</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Screens */}
        <div className="max-w-2xl mx-auto w-full">
           {mode !== 'home' && (
             <div className="mb-6">
                <button onClick={() => setMode('home')} className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-[#f7f7f7] text-[#afafaf] transition-all active:scale-90">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
             </div>
           )}

           {mode === 'add' && <AddFlashcard onAdd={handleAddCard} />}
           
           {mode === 'review' && (
             <div className="space-y-10">
                <div className="w-full lingo-progress"><div className="lingo-progress-inner bg-[#58cc02]" style={{ width: `${reviewQueue.length > 0 ? ((currentCardIndex + 1) / reviewQueue.length) * 100 : 0}%` }}></div></div>
                {reviewQueue.length > 0 ? <FlashcardView card={reviewQueue[currentCardIndex]} onRate={handleRateCard} /> : (
                  <div className="lingo-card text-center space-y-8 py-12">
                    <div className="text-7xl floating">🏆</div>
                    <h3 className="text-3xl font-black uppercase tracking-tight">Lesson Mastered!</h3>
                    <p className="text-[#777] font-bold text-lg px-4">All cards reviewed. You're making great progress!</p>
                    <button onClick={() => setMode('home')} className="w-full max-w-xs btn-3d btn-blue py-5 text-lg mx-auto">CONTINUE</button>
                  </div>
                )}
             </div>
           )}

           {mode === 'quiz' && <QuizView questions={filteredQuestions} category={quizCategory} onComplete={handleCompleteQuiz} onCancel={() => setMode('home')} />}

           {mode === 'listening' && (
             <div className="space-y-8">
                {!selectedLesson ? (
                   <div className="space-y-6">
                      <h2 className="text-3xl font-black uppercase tracking-tight ml-2">Audio Library</h2>
                      <div className="grid grid-cols-1 gap-4">
                        {MOCK_LISTENING_LESSONS.map((lesson) => (
                          <div key={lesson.id} onClick={() => setSelectedLesson(lesson)} className="lingo-card flex items-center gap-6 p-6 cursor-pointer hover:scale-[1.01] active:scale-[0.98] transition-all">
                            <div className={`w-16 h-16 rounded-xl flex-shrink-0 flex items-center justify-center text-white font-black text-xl shadow-lg ${lesson.category === 'toeic' ? 'bg-[#1cb0f6]' : 'bg-[#ff4b4b]'}`}>{lesson.category.toUpperCase().charAt(0)}</div>
                            <div className="flex-1"><h6 className="font-black text-xl leading-tight">{lesson.title}</h6><p className="text-[10px] font-black text-[#afafaf] uppercase tracking-widest mt-1">Tap to start lesson</p></div>
                          </div>
                        ))}
                      </div>
                   </div>
                ) : <ListeningView lesson={selectedLesson} onBack={() => setSelectedLesson(null)} />}
             </div>
           )}
        </div>
      </main>

      {/* Bottom Nav - Mobile Only */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-20 bg-white border-t-2 border-[#e5e5e5] flex items-center justify-around px-4 z-50">
        <button onClick={() => setMode('home')} className={`flex flex-col items-center gap-1 ${mode === 'home' ? 'text-[#1cb0f6]' : 'text-[#afafaf]'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill={mode === 'home' ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
          <span className="text-[10px] font-black">LEARN</span>
        </button>
        <button onClick={() => setMode('review')} className={`flex flex-col items-center gap-1 ${mode === 'review' ? 'text-[#1cb0f6]' : 'text-[#afafaf]'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill={mode === 'review' ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
          <span className="text-[10px] font-black">CARDS</span>
        </button>
        <button onClick={() => setMode('quiz')} className={`flex flex-col items-center gap-1 ${mode === 'quiz' ? 'text-[#1cb0f6]' : 'text-[#afafaf]'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill={mode === 'quiz' ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span className="text-[10px] font-black">QUESTS</span>
        </button>
        <button onClick={() => setMode('listening')} className={`flex flex-col items-center gap-1 ${mode === 'listening' ? 'text-[#1cb0f6]' : 'text-[#afafaf]'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill={mode === 'listening' ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
          <span className="text-[10px] font-black">AUDIO</span>
        </button>
      </nav>
    </div>
  );
}

export default App;
