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
    <div className="min-h-screen bg-mesh font-sans antialiased text-slate-900 pb-20">
      {/* Dynamic Background Decoration */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-indigo-200/20 rounded-full blur-[120px] animate-float"></div>
        <div className="absolute top-[40%] -right-[5%] w-[30%] h-[30%] bg-purple-200/20 rounded-full blur-[100px]" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-12">
        {/* Modern Header */}
        <header className="flex flex-col md:flex-row items-center justify-between gap-8 mb-16">
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 mb-4">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600">Premium Learning Platform</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-black tracking-tight leading-none mb-3">
              Lingo<span className="text-gradient">Master</span>
            </h1>
            <p className="text-slate-500 font-medium text-lg">Xây dựng lộ trình TOEIC 700 & JLPT N2 của riêng bạn</p>
          </div>
          
          <div className="flex items-center gap-4">
            {mode !== 'home' && (
              <button 
                onClick={() => setMode('home')}
                className="group flex items-center gap-2 px-6 py-3 bg-white hover:bg-slate-900 hover:text-white rounded-2xl font-bold text-slate-600 transition-all duration-300 shadow-xl shadow-slate-200/50"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Quay lại Dashboard
              </button>
            )}
            <button 
              onClick={() => setMode('add')}
              className="px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold hover:bg-indigo-600 transition-all duration-300 shadow-xl shadow-slate-900/10 flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Thêm từ mới
            </button>
          </div>
        </header>

        {mode === 'home' && (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
            {/* Left Content Area */}
            <div className="xl:col-span-8 space-y-10">
              
              {/* Main Hero Review Action */}
              <div className="relative group overflow-hidden bg-slate-900 rounded-[2.5rem] p-10 md:p-12 text-white shadow-2xl shadow-indigo-200/50">
                <div className="relative z-10 grid md:grid-cols-2 items-center gap-10">
                  <div className="space-y-6">
                    <h2 className="text-4xl md:text-5xl font-black leading-tight">Mục tiêu hôm nay của bạn</h2>
                    <p className="text-slate-400 text-lg leading-relaxed">
                      Bạn có <span className="text-white font-bold">{reviewQueue.length} từ vựng</span> đang đợi được ôn tập để đưa vào trí nhớ dài hạn.
                    </p>
                    <button 
                      disabled={reviewQueue.length === 0}
                      onClick={() => { setMode('review'); setCurrentCardIndex(0); }}
                      className={`group relative px-10 py-5 rounded-[1.5rem] font-black text-xl transition-all duration-300 overflow-hidden ${
                        reviewQueue.length > 0 
                        ? 'bg-indigo-600 hover:bg-indigo-500 hover:scale-105 active:scale-95 shadow-xl shadow-indigo-600/30' 
                        : 'bg-slate-800 text-slate-600 cursor-not-allowed'
                      }`}
                    >
                      <span className="relative z-10 flex items-center gap-3">
                        HỌC NGAY BÂY GIỜ
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </span>
                    </button>
                  </div>
                  <div className="hidden md:flex justify-center">
                    <div className="relative w-48 h-48">
                      <div className="absolute inset-0 bg-indigo-500 rounded-full animate-ping opacity-20"></div>
                      <div className="absolute inset-4 bg-indigo-500/20 rounded-full flex items-center justify-center border-2 border-indigo-500/30">
                        <span className="text-6xl font-black">{reviewQueue.length}</span>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Visual accents */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/20 rounded-full -mr-32 -mt-32 blur-[80px]"></div>
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-600/10 rounded-full blur-[60px]"></div>
              </div>

              {/* Pathway Cards Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="glass-card rounded-[2rem] p-8 group hover:-translate-y-2 transition-all duration-500">
                  <div className="flex justify-between items-start mb-10">
                    <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200 text-white">
                      <span className="font-black text-2xl tracking-tighter">EN</span>
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest text-slate-400 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">TOEIC 700 Goal</span>
                  </div>
                  <h3 className="text-2xl font-black text-slate-800 mb-2">English Path</h3>
                  <p className="text-slate-500 text-sm mb-8 leading-relaxed">Tập trung vào từ vựng kinh doanh và cấu trúc Reading Part 5/6.</p>
                  <div className="flex items-end justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-400 uppercase mb-1">Vocab count</div>
                      <div className="text-3xl font-black text-blue-500">{cards.filter(c => c.language === 'english').length}</div>
                    </div>
                    <button 
                      onClick={() => { setQuizCategory('toeic'); setMode('quiz'); }}
                      className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-600 transition-colors shadow-lg shadow-slate-200"
                    >
                      Thi thử đề thật
                    </button>
                  </div>
                </div>

                <div className="glass-card rounded-[2rem] p-8 group hover:-translate-y-2 transition-all duration-500">
                  <div className="flex justify-between items-start mb-10">
                    <div className="w-16 h-16 bg-rose-500 rounded-2xl flex items-center justify-center shadow-lg shadow-rose-200 text-white">
                      <span className="font-black text-2xl tracking-tighter">JP</span>
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest text-slate-400 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">JLPT N2 Goal</span>
                  </div>
                  <h3 className="text-2xl font-black text-slate-800 mb-2">Japanese Path</h3>
                  <p className="text-slate-500 text-sm mb-8 leading-relaxed">Nắm vững 1000 Kanji và cấu trúc ngữ pháp trung cấp N2.</p>
                  <div className="flex items-end justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-400 uppercase mb-1">Vocab count</div>
                      <div className="text-3xl font-black text-rose-500">{cards.filter(c => c.language === 'japanese').length}</div>
                    </div>
                    <button 
                      onClick={() => { setQuizCategory('n2'); setMode('quiz'); }}
                      className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-rose-600 transition-colors shadow-lg shadow-slate-200"
                    >
                      Thi thử đề thật
                    </button>
                  </div>
                </div>
              </div>

              {/* Listening Section with refined list */}
              <div className="space-y-6">
                <div className="flex items-center justify-between px-2">
                  <h3 className="text-2xl font-black text-slate-800">Listening Hub</h3>
                  <span className="text-indigo-600 text-sm font-bold hover:underline cursor-pointer">Xem tất cả bài nghe</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {MOCK_LISTENING_LESSONS.map((lesson) => (
                    <div 
                      key={lesson.id}
                      onClick={() => { setSelectedLesson(lesson); setMode('listening'); }}
                      className="group glass-card rounded-3xl p-6 cursor-pointer hover:border-indigo-400 transition-all duration-300"
                    >
                      <div className="flex items-center gap-5">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all group-hover:rotate-12 ${lesson.category === 'toeic' ? 'bg-blue-50 text-blue-500' : 'bg-rose-50 text-rose-500'}`}>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-slate-800 mb-1 group-hover:text-indigo-600 transition-colors leading-tight">{lesson.title}</h4>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{lesson.category}</span>
                            <span className="w-1 h-1 rounded-full bg-slate-200"></span>
                            <span className="text-[10px] font-bold text-slate-400">Audio ready</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar with Depth */}
            <div className="xl:col-span-4 space-y-10">
              {/* Exam Results Card */}
              <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
                <h3 className="text-lg font-black text-slate-800 mb-8 flex items-center gap-3">
                  <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                    </svg>
                  </div>
                  Recent Results
                </h3>
                <div className="space-y-6">
                  {examResults.length === 0 ? (
                    <div className="text-center py-10 space-y-3">
                      <p className="text-slate-400 text-sm font-medium italic">Chưa có lịch sử làm bài thi.</p>
                    </div>
                  ) : (
                    examResults.slice(0, 5).map((res) => (
                      <div key={res.id} className="flex justify-between items-center group">
                        <div className="space-y-1">
                          <div className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">{res.category} Mock Exam</div>
                          <div className="text-sm font-bold text-slate-400">{new Date(res.date).toLocaleDateString('vi-VN')}</div>
                        </div>
                        <div className="text-xl font-black text-slate-800 bg-slate-50 px-4 py-2 rounded-2xl group-hover:bg-slate-900 group-hover:text-white transition-all">
                          {res.score}<span className="text-xs text-slate-400 group-hover:text-slate-500">/{res.totalQuestions}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Motivational Sidebar Block */}
              <div className="bg-indigo-600 rounded-[2rem] p-8 text-white relative overflow-hidden">
                <div className="relative z-10">
                  <h3 className="text-xl font-bold mb-4">Mẹo luyện thi N2</h3>
                  <p className="text-indigo-100 text-sm leading-relaxed mb-6 opacity-80">
                    Đối với đề N2, hãy chú trọng vào việc hiểu rõ sắc thái của các mẫu ngữ pháp tương đồng. Đừng chỉ nhớ nghĩa tiếng Việt!
                  </p>
                  <div className="w-full bg-indigo-500/50 rounded-full h-1.5 mb-2">
                    <div className="bg-white h-full rounded-full w-[65%] shadow-[0_0_10px_rgba(255,255,255,0.5)]"></div>
                  </div>
                  <div className="text-[10px] font-black uppercase tracking-widest opacity-60">Current Progress: 65%</div>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
              </div>

              {/* Social/Community Link Placeholder */}
              <div className="bg-white rounded-[2rem] p-6 border-2 border-dashed border-slate-200 text-center">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Coming Soon</p>
                <p className="text-sm font-bold text-slate-600">Bảng xếp hạng cộng đồng</p>
              </div>
            </div>
          </div>
        )}

        {/* Action Screens */}
        {mode === 'add' && (
          <div className="max-w-2xl mx-auto py-12 animate-in zoom-in-95 duration-500">
            <AddFlashcard onAdd={handleAddCard} />
          </div>
        )}

        {mode === 'review' && reviewQueue.length > 0 && (
          <div className="max-w-3xl mx-auto py-12 flex flex-col items-center animate-in fade-in duration-500">
            <div className="w-full mb-16 space-y-3">
              <div className="flex justify-between text-xs font-black uppercase tracking-widest text-slate-400">
                <span>Ôn tập từ vựng</span>
                <span>{currentCardIndex + 1} / {reviewQueue.length}</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-indigo-600 h-full transition-all duration-700 shadow-[0_0_15px_rgba(79,70,229,0.5)]"
                  style={{ width: `${((currentCardIndex + 1) / reviewQueue.length) * 100}%` }}
                ></div>
              </div>
            </div>
            <FlashcardView card={reviewQueue[currentCardIndex]} onRate={handleRateCard} />
          </div>
        )}

        {mode === 'quiz' && (
          <div className="max-w-5xl mx-auto py-12 flex flex-col items-center animate-in slide-in-from-bottom-10 duration-500">
            <QuizView 
              questions={filteredQuestions} 
              category={quizCategory} 
              onComplete={handleCompleteQuiz} 
              onCancel={() => setMode('home')} 
            />
          </div>
        )}

        {mode === 'listening' && selectedLesson && (
          <div className="max-w-5xl mx-auto py-12 flex flex-col items-center animate-in fade-in duration-500">
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
