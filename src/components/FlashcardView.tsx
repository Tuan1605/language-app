import { useState } from 'react';
import type { Flashcard, ReviewGrade } from '../types';

interface FlashcardViewProps {
  card: Flashcard;
  onRate: (grade: ReviewGrade) => void;
}

export function FlashcardView({ card, onRate }: FlashcardViewProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="flex flex-col items-center space-y-12 w-full max-w-lg">
      <div 
        onClick={() => setIsFlipped(!isFlipped)}
        className={`w-full h-80 cursor-pointer perspective-1000 transition-transform duration-700 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}
      >
        {/* Front Side */}
        <div className="absolute inset-0 w-full h-full shadow-[0_20px_50px_rgba(79,70,229,0.15)] rounded-[2.5rem] bg-white flex flex-col items-center justify-center p-12 text-center backface-hidden border border-slate-100">
          <span className="absolute top-8 text-xs font-black text-indigo-500 uppercase tracking-widest bg-indigo-50 px-4 py-1.5 rounded-full">
            Question
          </span>
          <h2 className="text-5xl font-black text-slate-800 leading-tight">{card.word}</h2>
          <div className="absolute bottom-8 flex items-center gap-2 text-slate-400 font-bold text-sm animate-pulse">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            CHẠM ĐỂ XEM NGHĨA
          </div>
        </div>

        {/* Back Side */}
        <div className="absolute inset-0 w-full h-full shadow-2xl rounded-[2.5rem] bg-indigo-600 flex flex-col items-center justify-center p-12 text-center backface-hidden rotate-y-180 text-white">
          <span className="absolute top-8 text-xs font-black text-indigo-200 uppercase tracking-widest bg-indigo-500/50 px-4 py-1.5 rounded-full">
            Answer
          </span>
          <div className="space-y-6">
            <p className="text-3xl font-bold leading-relaxed">{card.definition}</p>
            {card.example && (
              <div className="bg-indigo-500/30 p-4 rounded-2xl border border-indigo-400/30">
                <p className="text-sm italic text-indigo-100 leading-relaxed">"{card.example}"</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {isFlipped && (
        <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h3 className="text-center text-sm font-black text-slate-400 uppercase tracking-widest">Bạn nhớ từ này mức độ nào?</h3>
          <div className="grid grid-cols-6 gap-3">
            {[0, 1, 2, 3, 4, 5].map((grade) => (
              <button
                key={grade}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFlipped(false);
                  setTimeout(() => onRate(grade as ReviewGrade), 300);
                }}
                className={`group relative flex flex-col items-center justify-center h-16 rounded-2xl font-black text-white transition-all hover:scale-110 active:scale-90 ${
                  grade < 3 
                  ? 'bg-rose-500 shadow-lg shadow-rose-100' 
                  : grade < 5 ? 'bg-amber-500 shadow-lg shadow-amber-100' : 'bg-emerald-500 shadow-lg shadow-emerald-100'
                }`}
              >
                <span className="text-xl">{grade}</span>
                <div className="absolute -top-12 bg-slate-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none uppercase">
                  {grade === 0 ? 'Quên' : grade === 5 ? 'Dễ' : 'Nhớ'}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
