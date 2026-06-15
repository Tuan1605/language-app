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

  // Load data from localStorage on mount
  useEffect(() => {
    const savedCards = localStorage.getItem('language-cards');
    if (savedCards) setCards(JSON.parse(savedCards));
    
    const savedResults = localStorage.getItem('language-exam-results');
    if (savedResults) setExamResults(JSON.parse(savedResults));
  }, []);

  // Save data to localStorage
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
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-indigo-700 mb-2">My Language App</h1>
        <p className="text-gray-500 italic">Target: TOEIC 700 & JLPT N2</p>
      </header>

      {mode === 'home' && (
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Column 1: Flashcards & Progress */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 border-l-4 border-indigo-500 pl-3">Từ vựng</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-2xl shadow-sm text-center border-b-4 border-blue-400">
                <div className="text-3xl font-bold text-blue-600">{cards.filter(c => c.language === 'english').length}</div>
                <div className="text-sm text-gray-500 uppercase tracking-wider font-bold">English</div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm text-center border-b-4 border-red-400">
                <div className="text-3xl font-bold text-red-600">{cards.filter(c => c.language === 'japanese').length}</div>
                <div className="text-sm text-gray-500 uppercase tracking-wider font-bold">Japanese</div>
              </div>
            </div>

            <div className="bg-indigo-600 p-6 rounded-2xl shadow-lg text-white">
              <h2 className="text-xl font-bold mb-2">Cần ôn tập hôm nay:</h2>
              <div className="text-5xl font-black mb-4">{reviewQueue.length}</div>
              <button 
                disabled={reviewQueue.length === 0}
                onClick={() => { setMode('review'); setCurrentCardIndex(0); }}
                className={`w-full py-3 rounded-xl font-bold transition ${
                  reviewQueue.length > 0 
                  ? 'bg-white text-indigo-600 hover:bg-indigo-50' 
                  : 'bg-indigo-400 text-indigo-200 cursor-not-allowed'
                }`}
              >
                Bắt đầu ôn tập
              </button>
            </div>

            <button 
              onClick={() => setMode('add')}
              className="w-full py-4 bg-white text-gray-700 border-2 border-dashed border-gray-300 rounded-2xl font-semibold hover:border-indigo-400 hover:text-indigo-600 transition"
            >
              + Thêm từ vựng mới
            </button>
          </div>

          {/* Column 2: Quizzes & Exams */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 border-l-4 border-indigo-500 pl-3">Luyện thi</h2>
            
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center group hover:shadow-md transition">
                <div>
                  <h3 className="font-bold text-gray-800 text-lg">TOEIC Practice</h3>
                  <p className="text-sm text-gray-500">Reading & Grammar Part 5</p>
                </div>
                <button 
                  onClick={() => { setQuizCategory('toeic'); setMode('quiz'); }}
                  className="bg-blue-500 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-600 transition"
                >
                  Thi thử
                </button>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center group hover:shadow-md transition">
                <div>
                  <h3 className="font-bold text-gray-800 text-lg">JLPT N2 Practice</h3>
                  <p className="text-sm text-gray-500">Moji-Goi & Bunpou</p>
                </div>
                <button 
                  onClick={() => { setQuizCategory('n2'); setMode('quiz'); }}
                  className="bg-red-500 text-white px-6 py-2 rounded-lg font-bold hover:bg-red-600 transition"
                >
                  Thi thử
                </button>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-800 mb-4">Lịch sử thi</h3>
              <div className="space-y-3">
                {examResults.length === 0 ? (
                  <p className="text-gray-400 text-sm italic">Chưa có dữ liệu thi.</p>
                ) : (
                  examResults.slice(0, 4).map((res) => (
                    <div key={res.id} className="flex justify-between items-center text-sm border-b border-gray-50 pb-2">
                      <span className="font-bold text-gray-600 uppercase">{res.category}</span>
                      <span className="text-gray-400">{new Date(res.date).toLocaleDateString()}</span>
                      <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">{res.score}/{res.totalQuestions}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Column 3: Listening */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 border-l-4 border-indigo-500 pl-3">Luyện nghe</h2>
            <div className="space-y-4">
              {MOCK_LISTENING_LESSONS.map((lesson) => (
                <div 
                  key={lesson.id}
                  onClick={() => { setSelectedLesson(lesson); setMode('listening'); }}
                  className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 cursor-pointer hover:border-indigo-500 hover:shadow-md transition"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-xl ${lesson.category === 'toeic' ? 'bg-blue-100 text-blue-600' : 'bg-red-100 text-red-600'}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800">{lesson.title}</h3>
                      <p className="text-xs text-gray-400 uppercase tracking-widest mt-1 font-bold">{lesson.category}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100">
              <h3 className="text-amber-800 font-bold mb-2 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0118 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Mẹo luyện nghe
              </h3>
              <p className="text-sm text-amber-700 leading-relaxed">
                Đừng cố dịch từng từ. Hãy nghe ý chính và chú ý đến cách nối âm trong tiếng Anh, cũng như các kính ngữ trong tiếng Nhật.
              </p>
            </div>
          </div>
        </div>
      )}

      {mode === 'add' && (
        <div className="w-full max-w-md">
          <button onClick={() => setMode('home')} className="mb-4 text-indigo-600 font-medium">← Quay lại</button>
          <AddFlashcard onAdd={handleAddCard} />
        </div>
      )}

      {mode === 'review' && reviewQueue.length > 0 && (
        <div className="w-full max-w-md flex flex-col items-center">
          <div className="mb-6 w-full flex justify-between items-center text-sm font-medium text-gray-400 uppercase tracking-widest">
            <span>Tiến độ ôn tập</span>
            <span>{currentCardIndex + 1} / {reviewQueue.length}</span>
          </div>
          <FlashcardView card={reviewQueue[currentCardIndex]} onRate={handleRateCard} />
          <button onClick={() => setMode('home')} className="mt-8 text-gray-400 text-sm hover:underline">Dừng ôn tập</button>
        </div>
      )}

      {mode === 'quiz' && (
        <div className="w-full flex flex-col items-center">
          <QuizView 
            questions={filteredQuestions} 
            category={quizCategory} 
            onComplete={handleCompleteQuiz} 
            onCancel={() => setMode('home')} 
          />
        </div>
      )}

      {mode === 'listening' && selectedLesson && (
        <div className="w-full flex flex-col items-center">
          <ListeningView 
            lesson={selectedLesson} 
            onBack={() => { setMode('home'); setSelectedLesson(null); }} 
          />
        </div>
      )}
    </div>
  );
}

export default App;
