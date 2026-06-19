import { useState, useEffect, useRef } from 'react';
import type { Flashcard } from '../types';

interface VocabQuizViewProps {
  word: Flashcard;
  allCards: Flashcard[];
  onComplete: (isCorrect: boolean) => void;
}

export function VocabQuizView({ word, allCards, onComplete }: VocabQuizViewProps) {
  const [options, setOptions] = useState<string[]>([]);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // Generate 4 randomized options
    const distractors = allCards
      .filter(c => c.id !== word.id && c.language === word.language)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(c => c.definition);
    
    const combined = [...distractors, word.definition].sort(() => Math.random() - 0.5);
    setOptions(combined);
    
    // Start timer
    setTimeLeft(15);
    setIsAnswered(false);
    setSelectedIdx(null);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [word]);

  useEffect(() => {
    if (timeLeft === 0 && !isAnswered) {
      handleSelect(-1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, isAnswered]);

  const handleSelect = (idx: number) => {
    if (isAnswered) return;
    clearInterval(timerRef.current);
    setSelectedIdx(idx);
    setIsAnswered(true);
  };

  const correctIdx = options.indexOf(word.definition);
  const isCorrect = selectedIdx === correctIdx;

  return (
    <div className="bg-[var(--bg-card)] lingo-card p-10 max-w-2xl mx-auto w-full animate-in slide-in-from-bottom-8 duration-500 relative overflow-hidden">
      {/* Visual Timer Bar */}
      {!isAnswered && (
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-[var(--bg-hover)]">
          <div 
            className={`h-full transition-all duration-1000 ease-linear ${timeLeft <= 5 ? 'bg-[#ff4b4b] animate-pulse' : 'bg-[#58cc02]'}`}
            style={{ width: `${(timeLeft / 15) * 100}%` }}
          ></div>
        </div>
      )}

      <div className="flex justify-between items-center mb-10 mt-2">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${word.category === 'toeic' ? 'bg-[#1cb0f6]' : 'bg-[#ff4b4b]'}`}></div>
          <span className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em]">Vocabulary Quiz</span>
          {!isAnswered && (
            <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md border-2 ${timeLeft <= 5 ? 'text-[#ff4b4b] border-[#ff4b4b]' : 'text-[#58cc02] border-[#58cc02]'}`}>
              {timeLeft}s
            </span>
          )}
        </div>
        <div className="bg-[var(--bg-hover)] px-4 py-1.5 rounded-xl text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest border-2 border-[var(--border-main)]">
          Timed Recall
        </div>
      </div>

      <div className="text-center space-y-4 mb-12">
        <p className="text-[10px] font-black text-[#1cb0f6] uppercase tracking-[0.2em]">Select the correct meaning:</p>
        <h3 className="text-5xl font-black text-[var(--text-main)] leading-tight">
          {word.word}
        </h3>
        {word.imageUrl && (
           <div className="w-40 h-40 mx-auto rounded-2xl overflow-hidden border-2 border-[var(--border-main)] shadow-sm">
              <img src={word.imageUrl} alt={word.word} className="w-full h-full object-cover" />
           </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3 mb-10">
        {options.map((option, idx) => {
          let btnClass = "border-[var(--border-main)] bg-[var(--bg-card)] text-[var(--text-main)]";
          if (isAnswered) {
             if (idx === correctIdx) btnClass = "border-[#58cc02] bg-[var(--tint-green)] text-[#58cc02] shadow-sm";
             else if (idx === selectedIdx) btnClass = "border-[#ff4b4b] bg-[var(--tint-red)] text-[#ff4b4b]";
             else btnClass = "opacity-40 border-[var(--border-main)]";
          } else {
             btnClass = "border-[var(--border-main)] hover:border-[#1cb0f6] hover:bg-[var(--bg-hover)]";
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              disabled={isAnswered}
              className={`w-full text-left p-6 rounded-2xl border-2 transition-all duration-200 font-bold text-lg flex items-center gap-4 ${btnClass}`}
            >
              <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center font-black text-sm border-2 ${
                isAnswered && idx === correctIdx ? 'bg-[#58cc02] text-white border-transparent' : 'border-[var(--border-main)] text-[var(--text-muted)]'
              }`}>
                {idx + 1}
              </div>
              {option}
            </button>
          );
        })}
      </div>

      {isAnswered && (
        <button 
          onClick={() => onComplete(isCorrect)}
          className={`w-full h-16 btn-3d rounded-2xl text-lg font-black animate-in zoom-in-95 ${isCorrect ? 'btn-green shadow-[#58cc02]/20' : 'btn-blue'}`}
        >
          {isCorrect ? 'EXCELLENT! NEXT →' : 'GOT IT! NEXT →'}
        </button>
      )}
    </div>
  );
}
