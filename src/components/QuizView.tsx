import { useState, useEffect, useRef } from 'react';
import type { Question, ExamResult } from '../types';

interface QuizViewProps {
  questions: Question[];
  category: 'toeic' | 'n2';
  onComplete: (result: ExamResult) => void;
  onCancel: () => void;
  hideSummary?: boolean;
}

export function QuizView({ questions, category, onComplete, onCancel, hideSummary }: QuizViewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(new Array(questions.length).fill(null));
  const [isFinished, setIsFinished] = useState(false);
  
  // --- TIMER STATE ---
  const [timeLeft, setTimeLeft] = useState(15);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    if (isFinished) return;
    
    setTimeLeft(15);
    if (timerRef.current) clearInterval(timerRef.current);
    
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleNext(); // Auto-skip if time runs out
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [currentIndex, isFinished]);

  const handleSelect = (optionIndex: number) => {
    if (selectedAnswers[currentIndex] !== null) return; // Prevent changing answer
    const newAnswers = [...selectedAnswers];
    newAnswers[currentIndex] = optionIndex;
    setSelectedAnswers(newAnswers);
    // Clear timer when answer is selected for better UX
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      const finalScore = calculateScore();
      if (hideSummary) {
        onComplete({
          id: crypto.randomUUID(),
          date: new Date().toISOString(),
          score: finalScore,
          totalQuestions: questions.length,
          category,
          difficulty: questions[0].difficulty
        });
      } else {
        setIsFinished(true);
      }
    }
  };

  const calculateScore = () => {
    let score = 0;
    selectedAnswers.forEach((ans, idx) => {
      if (ans === questions[idx].correctAnswer) {
        score++;
      }
    });
    return score;
  };

  if (isFinished) {
    const finalScore = calculateScore();
    const percent = (finalScore / questions.length) * 100;
    
    return (
      <div className="bg-white lingo-card text-center max-w-lg w-full mx-auto animate-in zoom-in-95 duration-500">
        <div className="w-24 h-24 bg-[#ddf4ff] rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-[#1cb0f6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-3xl font-black text-[#4b4b4b] mb-2 uppercase tracking-tight">Quest Complete!</h2>
        <p className="text-[10px] font-black text-[#afafaf] mb-10 uppercase tracking-[0.2em]">{category} Practice Exam</p>
        
        <div className="relative w-48 h-48 mx-auto mb-10">
          <svg className="w-full h-full transform -rotate-90">
            <circle cx="96" cy="96" r="86" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-[#f7f7f7]" />
            <circle cx="96" cy="96" r="86" stroke="currentColor" strokeWidth="12" fill="transparent" className={percent >= 80 ? 'text-[#58cc02]' : 'text-[#ff9600]'} strokeDasharray={540.3} strokeDashoffset={540.3 - (540.3 * percent) / 100} strokeLinecap="round" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-5xl font-black text-[#4b4b4b]">{finalScore}</span>
            <span className="text-[10px] font-black text-[#afafaf] uppercase tracking-widest">Score / {questions.length}</span>
          </div>
        </div>

        <button
          onClick={() => onComplete({
            id: crypto.randomUUID(),
            date: new Date().toISOString(),
            score: finalScore,
            totalQuestions: questions.length,
            category,
            difficulty: questions[0].difficulty
          })}
          className="w-full btn-3d btn-blue h-14"
        >
          CLAIM REWARDS
        </button>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <div className="bg-[var(--bg-card)] lingo-card max-w-3xl w-full mx-auto relative overflow-hidden">
      {/* Visual Timer Bar */}
      {!isFinished && (
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-[var(--bg-hover)] overflow-hidden">
          <div 
            className={`h-full transition-all duration-1000 ease-linear ${timeLeft <= 5 ? 'bg-[#ff4b4b] animate-pulse' : 'bg-[#1cb0f6]'}`}
            style={{ width: `${(timeLeft / 15) * 100}%` }}
          ></div>
        </div>
      )}

      <div className="flex justify-between items-center mb-10 mt-2">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${category === 'toeic' ? 'bg-[#1cb0f6]' : 'bg-[#ff4b4b]'}`}></div>
          <span className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em]">{category} Mock Exam</span>
          {!isFinished && (
            <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md border-2 ${timeLeft <= 5 ? 'text-[#ff4b4b] border-[#ff4b4b] animate-pulse' : 'text-[#1cb0f6] border-[#1cb0f6]'}`}>
              {timeLeft}s
            </span>
          )}
        </div>
        <div className="bg-[var(--bg-hover)] px-4 py-1.5 rounded-xl text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest border-2 border-[var(--border-main)]">
          Question {currentIndex + 1} of {questions.length}
        </div>
      </div>

      {currentQuestion.imageUrl && (
        <div className="w-full mb-8 rounded-2xl overflow-hidden border-2 border-[var(--border-main)] shadow-sm max-h-[300px]">
          <img src={currentQuestion.imageUrl} alt="Question illustration" className="w-full h-full object-cover" />
        </div>
      )}

      <div className="mb-10">
        <h3 className="text-2xl font-black text-[#4b4b4b] leading-tight">
          {currentQuestion.text}
        </h3>
      </div>

      <div className="grid grid-cols-1 gap-3 mb-10">
        {currentQuestion.options.map((option, idx) => (
          <button
            key={idx}
            onClick={() => handleSelect(idx)}
            className={`group w-full text-left h-16 px-6 rounded-2xl border-2 transition-all duration-200 flex items-center gap-4 relative overflow-hidden ${
              selectedAnswers[currentIndex] === idx
                ? 'border-[#1cb0f6] bg-[#ddf4ff] text-[#1cb0f6]'
                : 'border-[#e5e5e5] hover:border-[#afafaf] bg-white text-[#4b4b4b]'
            }`}
          >
            <div className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center font-black text-lg transition-all border-2 ${
              selectedAnswers[currentIndex] === idx 
              ? 'bg-[#1cb0f6] text-white border-transparent' 
              : 'bg-white text-[#afafaf] border-[#e5e5e5]'
            }`}>
              {String.fromCharCode(65 + idx)}
            </div>
            <span className="text-lg font-bold">{option}</span>
          </button>
        ))}
      </div>

      <div className="flex justify-between items-center pt-8 border-t-2 border-[#f7f7f7]">
        <button
          onClick={onCancel}
          className="text-[#afafaf] font-black hover:text-[#ff4b4b] transition-colors uppercase tracking-[0.2em] text-[9px]"
        >
          Quit Quest
        </button>
        <button
          disabled={selectedAnswers[currentIndex] === null}
          onClick={handleNext}
          className={`px-10 h-14 rounded-2xl font-black transition-all ${
            selectedAnswers[currentIndex] !== null
              ? 'btn-3d btn-green'
              : 'bg-[#e5e5e5] cursor-not-allowed text-[#afafaf] border-b-4 border-[#cbd5e1]'
          }`}
        >
          {currentIndex === questions.length - 1 ? 'Finish Quest' : 'Next Question'}
        </button>
      </div>
    </div>
  );
}
