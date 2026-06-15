import { useState } from 'react';
import type { Question, ExamResult } from '../types';

interface QuizViewProps {
  questions: Question[];
  category: 'toeic' | 'n2';
  onComplete: (result: ExamResult) => void;
  onCancel: () => void;
}

export function QuizView({ questions, category, onComplete, onCancel }: QuizViewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(new Array(questions.length).fill(null));
  const [isFinished, setIsFinished] = useState(false);

  const handleSelect = (optionIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentIndex] = optionIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setIsFinished(true);
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
      <div className="bg-white p-12 rounded-[2.5rem] shadow-2xl shadow-slate-200 text-center max-w-lg w-full border border-slate-100 animate-in zoom-in-95 duration-500">
        <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-8">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-3xl font-black text-slate-900 mb-2">Kết quả bài thi</h2>
        <p className="text-slate-500 font-medium mb-8 uppercase tracking-widest text-sm">{category.toUpperCase()} PRACTICE</p>
        
        <div className="relative w-48 h-48 mx-auto mb-10">
          <svg className="w-full h-full transform -rotate-90">
            <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-100" />
            <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-indigo-600" strokeDasharray={552.9} strokeDashoffset={552.9 - (552.9 * percent) / 100} strokeLinecap="round" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-5xl font-black text-slate-900">{finalScore}</span>
            <span className="text-sm font-bold text-slate-400">/{questions.length}</span>
          </div>
        </div>

        <button
          onClick={() => onComplete({
            id: crypto.randomUUID(),
            date: new Date().toISOString(),
            score: finalScore,
            totalQuestions: questions.length,
            category
          })}
          className="w-full bg-slate-900 text-white font-black py-5 rounded-2xl hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200"
        >
          Lưu kết quả & Quay lại
        </button>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-slate-200 max-w-3xl w-full border border-slate-100">
      <div className="flex justify-between items-center mb-10">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${category === 'toeic' ? 'bg-blue-500' : 'bg-red-500'}`}></div>
          <span className="text-sm font-black text-slate-400 uppercase tracking-widest">{category.toUpperCase()} Mock Exam</span>
        </div>
        <div className="bg-slate-100 px-4 py-1.5 rounded-full text-xs font-black text-slate-500">
          CÂU {currentIndex + 1} / {questions.length}
        </div>
      </div>

      <div className="mb-10">
        <h3 className="text-2xl font-bold text-slate-800 leading-relaxed">
          {currentQuestion.text}
        </h3>
      </div>

      <div className="grid grid-cols-1 gap-4 mb-12">
        {currentQuestion.options.map((option, idx) => (
          <button
            key={idx}
            onClick={() => handleSelect(idx)}
            className={`group w-full text-left p-6 rounded-2xl border-2 transition-all duration-200 flex items-center gap-4 ${
              selectedAnswers[currentIndex] === idx
                ? 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-md'
                : 'border-slate-50 hover:border-slate-200 bg-slate-50 text-slate-600'
            }`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black transition-colors ${
              selectedAnswers[currentIndex] === idx ? 'bg-indigo-500 text-white' : 'bg-white text-slate-400 group-hover:text-slate-600'
            }`}>
              {String.fromCharCode(65 + idx)}
            </div>
            <span className="text-lg font-medium">{option}</span>
          </button>
        ))}
      </div>

      <div className="flex justify-between items-center pt-8 border-t border-slate-50">
        <button
          onClick={onCancel}
          className="text-slate-400 font-bold hover:text-rose-500 transition-colors uppercase tracking-widest text-xs"
        >
          Hủy bỏ bài thi
        </button>
        <button
          disabled={selectedAnswers[currentIndex] === null}
          onClick={handleNext}
          className={`px-10 py-4 rounded-2xl font-black text-white transition-all shadow-lg ${
            selectedAnswers[currentIndex] !== null
              ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100 hover:scale-105 active:scale-95'
              : 'bg-slate-200 cursor-not-allowed text-slate-400'
          }`}
        >
          {currentIndex === questions.length - 1 ? 'HOÀN THÀNH' : 'CÂU TIẾP THEO'}
        </button>
      </div>
    </div>
  );
}
