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
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-indigo-100 selection:text-indigo-700">
      {/* Sidebar/Navigation for Large Screens could go here, but keeping it clean for now */}
      
      <div className="max-w-6xl mx-auto px-4 py-8 lg:py-12">
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-2">
              Lingo<span className="text-indigo-600">Master</span>
            </h1>
            <p className="text-slate-500 font-medium text-lg">Road to TOEIC 700 & JLPT N2</p>
          </div>
          {mode !== 'home' && (
            <button 
              onClick={() => setMode('home')}
              className="px-6 py-2 bg-white border border-slate-200 rounded-full font-bold text-slate-600 hover:bg-slate-50 transition shadow-sm"
            >
              ← Dashboard
            </button>
          )}
        </header>

        {mode === 'home' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Main Learning Section */}
            <div className="lg:col-span-8 space-y-8">
              {/* Review Card */}
              <div className="relative overflow-hidden bg-indigo-600 rounded-3xl p-8 text-white shadow-2xl shadow-indigo-200">
                <div className="relative z-10">
                  <span className="bg-indigo-500/50 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4 inline-block">Daily Goal</span>
                  <h2 className="text-3xl font-bold mb-2">Đã đến lúc ôn tập!</h2>
                  <p className="text-indigo-100 mb-8 max-w-sm">Học tập đều đặn là chìa khóa để đạt TOEIC 700 và N2. Bạn có <strong>{reviewQueue.length}</strong> từ cần ôn hôm nay.</p>
                  <button 
                    disabled={reviewQueue.length === 0}
                    onClick={() => { setMode('review'); setCurrentCardIndex(0); }}
                    className={`px-8 py-4 rounded-2xl font-black text-lg transition shadow-lg ${
                      reviewQueue.length > 0 
                      ? 'bg-white text-indigo-600 hover:scale-105 active:scale-95' 
                      : 'bg-indigo-400 text-indigo-200 cursor-not-allowed opacity-50'
                    }`}
                  >
                    Bắt đầu học ngay
                  </button>
                </div>
                {/* Decorative circles */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full -mr-20 -mt-20 opacity-50 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-400 rounded-full -ml-10 -mb-10 opacity-30 blur-2xl"></div>
              </div>

              {/* Learning Paths */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass rounded-3xl p-6 border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-slate-800">English Pathway</h3>
                    <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-lg text-xs font-bold">TOEIC 700</span>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl">
                      <span className="text-sm font-semibold text-slate-600">Từ vựng đã lưu</span>
                      <span className="text-xl font-black text-blue-600">{cards.filter(c => c.language === 'english').length}</span>
                    </div>
                    <button 
                      onClick={() => { setQuizCategory('toeic'); setMode('quiz'); }}
                      className="w-full py-4 bg-blue-500 text-white rounded-2xl font-bold hover:bg-blue-600 transition shadow-lg shadow-blue-100"
                    >
                      Làm bài thi thử
                    </button>
                  </div>
                </div>

                <div className="glass rounded-3xl p-6 border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-slate-800">Japanese Pathway</h3>
                    <span className="bg-red-100 text-red-600 px-3 py-1 rounded-lg text-xs font-bold">JLPT N2</span>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl">
                      <span className="text-sm font-semibold text-slate-600">Từ vựng đã lưu</span>
                      <span className="text-xl font-black text-red-600">{cards.filter(c => c.language === 'japanese').length}</span>
                    </div>
                    <button 
                      onClick={() => { setQuizCategory('n2'); setMode('quiz'); }}
                      className="w-full py-4 bg-red-500 text-white rounded-2xl font-bold hover:bg-red-600 transition shadow-lg shadow-red-100"
                    >
                      Làm bài thi thử
                    </button>
                  </div>
                </div>
              </div>

              {/* Listening Section */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-slate-800 px-2">Luyện nghe Listening</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {MOCK_LISTENING_LESSONS.map((lesson) => (
                    <div 
                      key={lesson.id}
                      onClick={() => { setSelectedLesson(lesson); setMode('listening'); }}
                      className="group bg-white p-5 rounded-2xl border border-slate-200 cursor-pointer hover:border-indigo-500 hover:shadow-xl hover:shadow-indigo-50 transition-all duration-300"
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`p-4 rounded-2xl transition-colors ${lesson.category === 'toeic' ? 'bg-blue-50 text-blue-500 group-hover:bg-blue-500 group-hover:text-white' : 'bg-red-50 text-red-500 group-hover:bg-red-500 group-hover:text-white'}`}>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{lesson.title}</h4>
                          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">{lesson.category}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar Stats & Management */}
            <div className="lg:col-span-4 space-y-6">
              <button 
                onClick={() => setMode('add')}
                className="w-full py-5 bg-white border-2 border-dashed border-slate-300 rounded-3xl text-slate-500 font-bold hover:border-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Thêm từ vựng mới
              </button>

              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  Lịch sử gần đây
                </h3>
                <div className="space-y-4">
                  {examResults.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="bg-slate-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <p className="text-slate-400 text-sm italic">Chưa có bài thi nào.</p>
                    </div>
                  ) : (
                    examResults.slice(0, 5).map((res) => (
                      <div key={res.id} className="flex justify-between items-center group">
                        <div className="flex flex-col">
                          <span className="text-xs font-black text-indigo-500 uppercase tracking-tighter">{res.category}</span>
                          <span className="text-sm font-medium text-slate-600">{new Date(res.date).toLocaleDateString()}</span>
                        </div>
                        <div className="bg-slate-50 px-3 py-1 rounded-xl font-black text-slate-700 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                          {res.score}/{res.totalQuestions}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="bg-slate-900 rounded-3xl p-6 text-white overflow-hidden relative">
                <h3 className="font-bold mb-2 relative z-10">Mẹo nhỏ hôm nay</h3>
                <p className="text-slate-400 text-sm leading-relaxed relative z-10">
                  Học 10 từ mỗi ngày liên tục trong 3 tháng sẽ giúp bạn sở hữu vốn từ vựng cơ bản của cả TOEIC và N2. Đừng bỏ cuộc!
                </p>
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-indigo-500 rounded-full opacity-20 blur-2xl"></div>
              </div>
            </div>
          </div>
        )}

        {mode === 'add' && (
          <div className="max-w-xl mx-auto py-8">
            <AddFlashcard onAdd={handleAddCard} />
          </div>
        )}

        {mode === 'review' && reviewQueue.length > 0 && (
          <div className="max-w-2xl mx-auto py-8 flex flex-col items-center">
            <div className="w-full bg-slate-200 h-1 rounded-full mb-12 overflow-hidden">
              <div 
                className="bg-indigo-600 h-full transition-all duration-500"
                style={{ width: `${((currentCardIndex + 1) / reviewQueue.length) * 100}%` }}
              ></div>
            </div>
            <FlashcardView card={reviewQueue[currentCardIndex]} onRate={handleRateCard} />
          </div>
        )}

        {mode === 'quiz' && (
          <div className="max-w-4xl mx-auto py-8 flex flex-col items-center">
            <QuizView 
              questions={filteredQuestions} 
              category={quizCategory} 
              onComplete={handleCompleteQuiz} 
              onCancel={() => setMode('home')} 
            />
          </div>
        )}

        {mode === 'listening' && selectedLesson && (
          <div className="max-w-4xl mx-auto py-8 flex flex-col items-center">
            <ListeningView 
              lesson={selectedLesson} 
              onBack={() => { setMode('home'); setSelectedLesson(null); }} 
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
