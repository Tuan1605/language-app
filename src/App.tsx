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
    <div className="min-h-screen flex bg-white">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-64 border-r-2 border-gray-100 p-4 fixed h-full bg-white">
        <div className="mb-10 px-4">
          <h1 className="text-3xl font-black text-[#58cc02] tracking-tighter">lingomaster</h1>
        </div>
        
        <nav className="flex-1 space-y-2">
          <button 
            onClick={() => setMode('home')}
            className={`sidebar-item w-full ${mode === 'home' ? 'active' : ''}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            LEARN
          </button>
          <button 
            onClick={() => setMode('review')}
            className={`sidebar-item w-full ${mode === 'review' ? 'active' : ''}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            FLASHCARDS
          </button>
          <button 
            onClick={() => setMode('quiz')}
            className={`sidebar-item w-full ${mode === 'quiz' ? 'active' : ''}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            QUESTS
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 p-4 md:p-10 max-w-4xl mx-auto w-full">
        {mode === 'home' && (
          <div className="space-y-12">
            {/* Top Stats Bar */}
            <div className="flex items-center justify-center lg:justify-end gap-6 pb-6 border-b-2 border-gray-100">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🔥</span>
                <span className="font-black text-[#ff9600]">3</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">💎</span>
                <span className="font-black text-[#1cb0f6]">120</span>
              </div>
              <div className="flex items-center gap-2 text-[#ff4b4b]">
                <span className="text-2xl">❤️</span>
                <span className="font-black">5</span>
              </div>
            </div>

            {/* Course Selector - Placeholder Look */}
            <div className="bg-[#58cc02] rounded-2xl p-6 text-white flex items-center justify-between shadow-[0_4px_0_0_#46a302]">
              <div>
                <h2 className="text-xs font-black uppercase tracking-widest opacity-80 mb-1">Current Course</h2>
                <h3 className="text-2xl font-black">TOEIC 700 & JLPT N2</h3>
              </div>
              <div className="bg-white/20 p-3 rounded-xl border-2 border-white/20">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              </div>
            </div>

            {/* Learning Path - The "Circles" */}
            <div className="flex flex-col items-center gap-8 py-10">
              {/* Unit 1 */}
              <div className="w-full">
                <div className="bg-[#58cc02] rounded-2xl p-5 text-white mb-10 shadow-[0_4px_0_0_#46a302]">
                  <h4 className="text-xl font-black">Unit 1: Vocabulary Foundation</h4>
                  <p className="font-bold opacity-80 text-sm">Essential words for everyday business & life</p>
                </div>

                <div className="flex flex-col items-center gap-6 relative">
                  {/* Skill 1: Flashcards */}
                  <div className="relative group">
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-[#58cc02] text-white px-4 py-2 rounded-xl font-black text-sm shadow-lg whitespace-nowrap animate-bounce">
                      START REVIEW
                    </div>
                    <button 
                      onClick={() => setMode('review')}
                      className={`w-24 h-24 rounded-full btn-3d btn-green text-4xl shadow-lg ${reviewQueue.length === 0 ? 'opacity-50 grayscale cursor-not-allowed' : ''}`}
                    >
                      <span className="mt-[-4px]">🗂️</span>
                    </button>
                    <div className="text-center mt-3 font-black text-gray-500 uppercase tracking-widest text-xs">Vocabulary</div>
                  </div>

                  {/* Connecting Line */}
                  <div className="w-2 h-12 bg-gray-100 rounded-full"></div>

                  {/* Skill 2: TOEIC Quiz */}
                  <div className="flex gap-20">
                    <div className="text-center flex flex-col items-center group">
                      <button 
                        onClick={() => { setQuizCategory('toeic'); setMode('quiz'); }}
                        className="w-20 h-20 rounded-full btn-3d btn-blue text-3xl"
                      >
                        <span className="mt-[-4px]">🇬🇧</span>
                      </button>
                      <div className="mt-3 font-black text-gray-500 uppercase tracking-widest text-[10px]">TOEIC 700</div>
                    </div>

                    <div className="text-center flex flex-col items-center group">
                      <button 
                        onClick={() => { setQuizCategory('n2'); setMode('quiz'); }}
                        className="w-20 h-20 rounded-full btn-3d btn-red text-3xl"
                      >
                        <span className="mt-[-4px]">🇯🇵</span>
                      </button>
                      <div className="mt-3 font-black text-gray-500 uppercase tracking-widest text-[10px]">JLPT N2</div>
                    </div>
                  </div>

                  {/* Connecting Line */}
                  <div className="w-2 h-12 bg-gray-100 rounded-full"></div>

                  {/* Skill 3: Listening */}
                  <div className="text-center flex flex-col items-center">
                    <button 
                      onClick={() => setMode('listening')}
                      className="w-24 h-24 rounded-full btn-3d btn-purple text-4xl"
                    >
                      <span className="mt-[-4px]">🎧</span>
                    </button>
                    <div className="mt-3 font-black text-gray-500 uppercase tracking-widest text-xs">Listening</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Action Button - Mobile Add */}
            <button 
              onClick={() => setMode('add')}
              className="lg:hidden fixed bottom-6 right-6 w-16 h-16 rounded-full btn-3d btn-blue text-3xl shadow-2xl z-50"
            >
              +
            </button>
          </div>
        )}

        {/* Action Screens (Full Screen Layouts) */}
        <div className="max-w-2xl mx-auto">
          {mode === 'add' && <AddFlashcard onAdd={handleAddCard} />}
          
          {mode === 'review' && reviewQueue.length > 0 && (
            <div className="flex flex-col items-center animate-in fade-in duration-500">
              <div className="w-full flex items-center gap-4 mb-10">
                <button onClick={() => setMode('home')} className="text-gray-400 hover:text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <div className="flex-1 bg-gray-100 h-4 rounded-full overflow-hidden border-2 border-gray-100 shadow-inner">
                  <div 
                    className="bg-[#58cc02] h-full transition-all duration-700 shadow-[inset_0_-4px_0_rgba(0,0,0,0.2)]"
                    style={{ width: `${((currentCardIndex + 1) / reviewQueue.length) * 100}%` }}
                  ></div>
                </div>
              </div>
              <FlashcardView card={reviewQueue[currentCardIndex]} onRate={handleRateCard} />
            </div>
          )}

          {mode === 'quiz' && (
            <div className="animate-in slide-in-from-bottom-10 duration-500">
              <div className="mb-8 flex items-center justify-between">
                <button onClick={() => setMode('home')} className="text-gray-300 hover:text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
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
            <div className="space-y-6">
              {!selectedLesson ? (
                <div className="space-y-6">
                  <h2 className="text-3xl font-black text-gray-800">Select Lesson</h2>
                  <div className="grid grid-cols-1 gap-4">
                    {MOCK_LISTENING_LESSONS.map((lesson) => (
                      <div 
                        key={lesson.id}
                        onClick={() => setSelectedLesson(lesson)}
                        className="lingo-card p-6 bg-white cursor-pointer hover:bg-gray-50 transition flex items-center gap-6"
                      >
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-black ${lesson.category === 'toeic' ? 'bg-blue-400' : 'bg-red-400'}`}>
                          {lesson.category.toUpperCase()}
                        </div>
                        <span className="font-bold text-lg text-gray-700">{lesson.title}</span>
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
