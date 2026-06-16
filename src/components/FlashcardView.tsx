import { useState } from 'react';
import type { Flashcard, ReviewGrade } from '../types';

interface FlashcardViewProps {
  card: Flashcard;
  onRate: (grade: ReviewGrade) => void;
}

export function FlashcardView({ card, onRate }: FlashcardViewProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="flex flex-col items-center space-y-10 w-full max-w-lg mx-auto">
      <div 
        onClick={() => setIsFlipped(!isFlipped)}
        className={`w-full h-96 cursor-pointer perspective-1000 transition-transform duration-700 transform-style-3d relative ${isFlipped ? 'rotate-y-180' : ''}`}
      >
        {/* Front Side */}
        <div className="absolute inset-0 w-full h-full lingo-card flex flex-col items-center justify-center p-12 text-center backface-hidden bg-white">
          <span className="absolute top-8 text-[10px] font-black text-[#1cb0f6] uppercase tracking-[0.2em] bg-[#ddf4ff] px-4 py-1.5 rounded-full">
            Question
          </span>
          <h2 className="text-5xl font-black text-[#4b4b4b] leading-tight break-words max-w-full">
            {card.word}
          </h2>
          <div className="absolute bottom-8 flex flex-col items-center gap-2">
             <div className="flex items-center gap-2 text-[#afafaf] font-black text-xs animate-pulse">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                TAP TO FLIP
             </div>
          </div>
        </div>

        {/* Back Side */}
        <div className="absolute inset-0 w-full h-full lingo-card bg-[#1cb0f6] border-[#1899d6] flex flex-col items-center justify-center p-12 text-center backface-hidden rotate-y-180 text-white">
          <span className="absolute top-8 text-[10px] font-black text-white/50 uppercase tracking-[0.2em] bg-white/20 px-4 py-1.5 rounded-full">
            Definition
          </span>
          <div className="space-y-8">
            <p className="text-4xl font-black leading-tight">{card.definition}</p>
            {card.example && (
              <div className="bg-white/10 p-6 rounded-2xl border-2 border-white/20 backdrop-blur-sm">
                <p className="text-sm font-bold italic text-white/90 leading-relaxed">
                  "{card.example}"
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Rating Controls */}
      <div className={`w-full space-y-6 transition-all duration-500 ${isFlipped ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
        <h3 className="text-center text-[10px] font-black text-[#afafaf] uppercase tracking-[0.2em]">How well did you know this?</h3>
        <div className="grid grid-cols-6 gap-3">
          {[0, 1, 2, 3, 4, 5].map((grade) => {
            let btnClass = "btn-outline";
            let label = "Okay";
            if (grade === 0) { label = "Forgot"; btnClass = "btn-red"; }
            if (grade === 5) { label = "Easy!"; btnClass = "btn-green"; }
            if (grade === 3 || grade === 4) { btnClass = "btn-blue"; }
            
            return (
              <button
                key={grade}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFlipped(false);
                  setTimeout(() => onRate(grade as ReviewGrade), 300);
                }}
                className={`group relative h-16 btn-3d ${btnClass} text-xl flex flex-col items-center justify-center p-0`}
              >
                <span>{grade}</span>
                <div className="absolute -top-12 bg-[#4b4b4b] text-white text-[9px] py-1.5 px-3 rounded-xl opacity-0 group-hover:opacity-100 transition-all pointer-events-none font-black uppercase tracking-widest whitespace-nowrap">
                  {label}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
