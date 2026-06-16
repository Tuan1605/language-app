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
  const [mode, setMode] = useState<'home' | 'add' | 'review' | 'quiz' | 'listening'>('home');
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
    <div className="min-h-screen flex bg-[#f8fafc]">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-72 border-r border-slate-200 p-6 fixed h-full bg-white z-10">
        <div className="mb-12 px-2 flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100">
            <span className="text-white font-black text-xl">L</span>
          </div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">lingomaster</h1>
        </div>
        
        <nav className="flex-1 space-y-1">
          <button 
            onClick={() => setMode('home')}
            className={`sidebar-item w-full ${mode === 'home' ? 'active' : ''}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Dashboard
          </button>
          <button 
            onClick={() => setMode('review')}
            className={`sidebar-item w-full ${mode === 'review' ? 'active' : ''}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Flashcards
          </button>
          <button 
            onClick={() => setMode('quiz')}
            className={`sidebar-item w-full ${mode === 'quiz' ? 'active' : ''}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Mock Exams
          </button>
          <button 
            onClick={() => setMode('listening')}
            className={`sidebar-item w-full ${mode === 'listening' ? 'active' : ''}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
            Listening
          </button>
        </nav>

        <div className="mt-auto p-4 bg-slate-50 rounded-2xl border border-slate-100">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">My Progress</p>
          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500 w-[65%]"></div>
          </div>
          <p className="mt-2 text-xs font-bold text-slate-600">65% Course Completed</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-72 min-h-screen">
        {/* Top Header Bar */}
        <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-100 z-10 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-800">
            {mode === 'home' && 'Good morning, Alex! 👋'}
            {mode === 'review' && 'Flashcard Review'}
            {mode === 'quiz' && 'Mock Exams'}
            {mode === 'listening' && 'Listening Practice'}
            {mode === 'add' && 'Add New Content'}
          </h2>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-100">
              <span className="text-lg">🔥</span>
              <span className="font-bold text-amber-700 text-sm">3 Day Streak</span>
            </div>
            <div className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100">
              <span className="text-lg">💎</span>
              <span className="font-bold text-blue-700 text-sm">120 XP</span>
            </div>
            <div className="w-10 h-10 bg-slate-200 rounded-full overflow-hidden border-2 border-white shadow-sm">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Avatar" />
            </div>
          </div>
        </header>

        <div className="p-6 md:p-10 max-w-5xl mx-auto w-full">
          {mode === 'home' && (
            <div className="space-y-10 animate-in fade-in duration-700">
              {/* Featured Card */}
              <div className="relative overflow-hidden bg-indigo-600 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-indigo-200">
                <div className="relative z-10 max-w-lg">
                  <h3 className="text-sm font-black uppercase tracking-widest opacity-80 mb-2">Welcome Back</h3>
                  <h4 className="text-4xl font-black mb-4 leading-tight">Master Japanese & English daily.</h4>
                  <p className="text-indigo-100 font-medium mb-8 leading-relaxed">
                    You have <span className="text-white font-bold">{reviewQueue.length} cards</span> ready for review. Keep your streak alive!
                  </p>
                  <button 
                    onClick={() => setMode('review')}
                    className="bg-white text-indigo-600 px-8 py-3.5 rounded-2xl font-black shadow-xl hover:bg-indigo-50 transition-all active:scale-95"
                  >
                    Start Learning Now
                  </button>
                </div>
                <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-white/10 to-transparent flex items-center justify-center opacity-30">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-64 w-64" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
              </div>

              {/* Course Sections */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="modern-card p-6 flex flex-col group cursor-pointer" onClick={() => setMode('review')}>
                  <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 mb-6 group-hover:scale-110 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <h5 className="text-lg font-black text-slate-800 mb-1">Vocabulary</h5>
                  <p className="text-slate-500 font-medium text-sm mb-6">Review your flashcards using Spaced Repetition.</p>
                  <div className="mt-auto flex items-center justify-between text-slate-400">
                    <span className="text-xs font-bold uppercase tracking-widest">{reviewQueue.length} items due</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>

                <div className="modern-card p-6 flex flex-col group cursor-pointer" onClick={() => { setQuizCategory('toeic'); setMode('quiz'); }}>
                  <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h5 className="text-lg font-black text-slate-800 mb-1">TOEIC Practice</h5>
                  <p className="text-slate-500 font-medium text-sm mb-6">Master business English with targeted mock exams.</p>
                  <div className="mt-auto flex items-center justify-between text-slate-400">
                    <span className="text-xs font-bold uppercase tracking-widest">Level 700+</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>

                <div className="modern-card p-6 flex flex-col group cursor-pointer" onClick={() => { setQuizCategory('n2'); setMode('quiz'); }}>
                  <div className="w-12 h-12 bg-rose-100 rounded-2xl flex items-center justify-center text-rose-600 mb-6 group-hover:scale-110 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                    </svg>
                  </div>
                  <h5 className="text-lg font-black text-slate-800 mb-1">JLPT N2 Mock</h5>
                  <p className="text-slate-500 font-medium text-sm mb-6">Advanced Japanese grammar and vocabulary.</p>
                  <div className="mt-auto flex items-center justify-between text-slate-400">
                    <span className="text-xs font-bold uppercase tracking-widest">Advanced Level</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="modern-card p-8">
                <div className="flex items-center justify-between mb-8">
                  <h5 className="text-xl font-black text-slate-800">Recent Exam Results</h5>
                  <button className="text-indigo-600 font-bold text-sm hover:underline">View All</button>
                </div>
                <div className="space-y-4">
                  {examResults.length > 0 ? (
                    examResults.slice(0, 3).map((res) => (
                      <div key={res.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white ${res.category === 'toeic' ? 'bg-blue-500' : 'bg-rose-500'}`}>
                            {res.category.toUpperCase().charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800">{res.category === 'toeic' ? 'TOEIC Mock Exam' : 'JLPT N2 Exam'}</p>
                            <p className="text-xs text-slate-400 font-medium">{new Date(res.date).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-black text-slate-800">{res.score}/{res.totalQuestions}</p>
                          <p className={`text-[10px] font-black uppercase tracking-widest ${res.score / res.totalQuestions >= 0.8 ? 'text-emerald-500' : 'text-amber-500'}`}>
                            {res.score / res.totalQuestions >= 0.8 ? 'Passed' : 'Needs Review'}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-10">
                      <p className="text-slate-400 font-medium">No recent exams taken yet.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Action Screens (Full Screen Layouts) */}
          <div className="max-w-4xl mx-auto">
            {mode === 'add' && <AddFlashcard onAdd={handleAddCard} />}
            
            {mode === 'review' && (
              reviewQueue.length > 0 ? (
                <div className="flex flex-col items-center animate-in fade-in duration-500">
                  <div className="w-full flex items-center gap-6 mb-12 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                    <button onClick={() => setMode('home')} className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-50 rounded-xl transition-all">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    <div className="flex-1 bg-slate-100 h-3 rounded-full overflow-hidden">
                      <div 
                        className="bg-indigo-600 h-full transition-all duration-700 rounded-full"
                        style={{ width: `${((currentCardIndex + 1) / reviewQueue.length) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-black text-slate-400 tabular-nums">
                      {currentCardIndex + 1}/{reviewQueue.length}
                    </span>
                  </div>
                  <FlashcardView card={reviewQueue[currentCardIndex]} onRate={handleRateCard} />
                </div>
              ) : (
                <div className="text-center py-20 bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-100">
                  <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-4xl">🎉</span>
                  </div>
                  <h3 className="text-3xl font-black text-slate-800 mb-2">You're all caught up!</h3>
                  <p className="text-slate-500 font-medium mb-10">No more cards to review for now. Great job!</p>
                  <button 
                    onClick={() => setMode('home')}
                    className="btn-modern btn-primary"
                  >
                    Back to Dashboard
                  </button>
                </div>
              )
            )}

            {mode === 'quiz' && (
              <div className="animate-in slide-in-from-bottom-10 duration-500">
                <QuizView 
                  questions={filteredQuestions} 
                  category={quizCategory} 
                  onComplete={handleCompleteQuiz} 
                  onCancel={() => setMode('home')} 
                />
              </div>
            )}

            {mode === 'listening' && (
              <div className="space-y-8 animate-in fade-in duration-500">
                {!selectedLesson ? (
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-3xl font-black text-slate-800 mb-2">Listening Library</h2>
                      <p className="text-slate-500 font-medium">Practice your comprehension with real-world scenarios.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {MOCK_LISTENING_LESSONS.map((lesson) => (
                        <div 
                          key={lesson.id}
                          onClick={() => setSelectedLesson(lesson)}
                          className="modern-card p-6 cursor-pointer group flex items-start gap-6"
                        >
                          <div className={`w-14 h-14 rounded-2xl flex-shrink-0 flex items-center justify-center text-white font-black shadow-lg ${lesson.category === 'toeic' ? 'bg-blue-500 shadow-blue-100' : 'bg-rose-500 shadow-rose-100'}`}>
                            {lesson.category.toUpperCase()}
                          </div>
                          <div className="flex-1">
                            <h6 className="font-black text-lg text-slate-800 group-hover:text-indigo-600 transition-colors mb-1">{lesson.title}</h6>
                            <p className="text-sm text-slate-400 font-medium mb-4 italic">"{lesson.transcript[0].text.substring(0, 60)}..."</p>
                            <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-widest">
                              <span>Practice Now</span>
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="animate-in zoom-in-95 duration-500">
                    <ListeningView 
                      lesson={selectedLesson} 
                      onBack={() => setSelectedLesson(null)} 
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Floating Action Button */}
        {mode === 'home' && (
          <button 
            onClick={() => setMode('add')}
            className="fixed bottom-10 right-10 w-16 h-16 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-2xl hover:bg-indigo-600 hover:scale-110 active:scale-95 transition-all z-50 group"
            title="Add New Card"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 group-hover:rotate-90 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
        )}
      </main>
    </div>
  );
}

export default App;
