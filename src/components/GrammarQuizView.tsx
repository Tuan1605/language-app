import { useState, useEffect, useRef } from 'react';
import type { GrammarQuizTaskData } from '../types';
import { playCorrectSound } from '../utils/sound';

interface GrammarQuizViewProps {
  task: GrammarQuizTaskData;
  onComplete: () => void;
  onCancel: () => void;
}

export function GrammarQuizView({ task, onComplete, onCancel }: GrammarQuizViewProps) {
  const [isAnswered, setIsAnswered] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  
  // Timer State
  const [timeLeft, setTimeLeft] = useState(15);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Reset answer states when moving to a new question
  useEffect(() => {
    setIsAnswered(false);
    setSelectedOption(null);
  }, [task]);

  useEffect(() => {
    if (isAnswered) return;
    
    setTimeLeft(15);
    if (timerRef.current) clearInterval(timerRef.current);
    
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [task, isAnswered]);

  useEffect(() => {
    if (timeLeft === 0 && !isAnswered) {
      // Auto-submit as incorrect when time runs out
      setIsAnswered(true);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  }, [timeLeft, isAnswered]);

  const handleSelect = (optionIndex: number) => {
    if (isAnswered) return;
    setSelectedOption(optionIndex);
  };

  const handleCheck = () => {
    if (selectedOption === null) return;
    setIsAnswered(true);
    if (timerRef.current) clearInterval(timerRef.current);

    if (selectedOption === task.correctIndex) {
      playCorrectSound();
    }
  };

  const handleNext = () => {
    onComplete();
  };

  // Replace the pattern with blanks in the example sentence
  const renderBlankedExample = () => {
    const { example, pattern, blankedExample } = task.point;
    
    if (blankedExample) {
      // If it contains newlines, it's our fallback
      if (blankedExample.includes('\n')) {
        return (
          <span className="whitespace-pre-wrap">
            {blankedExample}
          </span>
        );
      }
      return <span>{blankedExample}</span>;
    }

    const blank = " ＿＿＿＿ ";
    if (example.includes(pattern)) {
      return example.split(pattern).map((part, i, arr) => (
        <span key={i}>
          {part}
          {i < arr.length - 1 && <span className="text-[var(--gold)] border-b-2 border-[var(--gold)]">{blank}</span>}
        </span>
      ));
    }
    
    return (
      <span>
        {example} <br/><span className="text-sm font-normal opacity-80 mt-2 block">(Choose the pattern that fits this context)</span>
      </span>
    );
  };

  return (
    <div className="bg-[var(--bg-card)] lingo-card max-w-3xl w-full mx-auto relative overflow-hidden view-enter">
      {/* Visual Timer Bar */}
      {!isAnswered && (
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-[var(--bg-hover)] overflow-hidden">
          <div 
            className={`h-full transition-all duration-1000 ease-linear ${timeLeft <= 5 ? 'bg-[var(--red)] animate-pulse' : 'bg-[var(--blue)]'}`}
            style={{ width: `${(timeLeft / 15) * 100}%` }}
          ></div>
        </div>
      )}

      <div className="flex justify-between items-center mb-10 mt-2">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-[var(--purple)]"></div>
          <span className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em]">Grammar Quiz</span>
          {!isAnswered && (
            <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md border-2 ${timeLeft <= 5 ? 'text-[var(--red)] border-[var(--red)] animate-pulse' : 'text-[var(--purple)] border-[var(--purple)]'}`}>
              {timeLeft}s
            </span>
          )}
        </div>
      </div>

      <div className="mb-10 text-center">
        <p className="text-sm font-bold text-[var(--text-muted)] mb-4">Fill in the blank with the correct grammar pattern:</p>
        <h3 className="text-3xl font-black text-[var(--text-main)] leading-relaxed mb-4">
          {renderBlankedExample()}
        </h3>
        <p className="text-lg font-bold text-[var(--blue)]">
          "{task.point.exampleTranslation}"
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 mb-8">
        {task.options.map((option, idx) => {
          let btnClass = "";
          let badgeClass = "";
          
          if (isAnswered) {
            if (idx === task.correctIndex) {
              btnClass = "border-[var(--green)] bg-[var(--tint-green)] text-[var(--green)] shadow-sm";
              badgeClass = "bg-[var(--green)] text-white border-transparent";
            } else if (idx === selectedOption) {
              btnClass = "border-[var(--red)] bg-[var(--tint-red)] text-[var(--red)]";
              badgeClass = "bg-[var(--red)] text-white border-transparent";
            } else {
              btnClass = "opacity-40 border-[var(--border-main)] bg-[var(--bg-card)] text-[var(--text-main)]";
              badgeClass = "bg-[var(--bg-card)] text-[var(--text-muted)] border-[var(--border-main)]";
            }
          } else {
            if (selectedOption === idx) {
              btnClass = "border-[var(--purple)] bg-[var(--tint-blue)] text-[var(--purple)]";
              badgeClass = "bg-[var(--purple)] text-white border-transparent";
            } else {
              btnClass = "border-[var(--border-main)] hover:border-[var(--text-muted)] bg-[var(--bg-card)] text-[var(--text-main)]";
              badgeClass = "bg-[var(--bg-card)] text-[var(--text-muted)] border-[var(--border-main)]";
            }
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              disabled={isAnswered}
              className={`group w-full text-left h-16 px-6 rounded-2xl border-2 transition-all duration-200 flex items-center gap-4 relative overflow-hidden ${btnClass}`}
            >
              <div className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center font-black text-lg transition-all border-2 ${badgeClass}`}>
                {String.fromCharCode(65 + idx)}
              </div>
              <span className="text-xl font-bold">{option}</span>
            </button>
          );
        })}
      </div>

      {/* Immediate feedback section */}
      {isAnswered && (
        <div className={`p-6 rounded-2xl border-2 mb-8 animate-in slide-in-from-bottom-4 duration-300 ${
          selectedOption === task.correctIndex 
            ? 'bg-[var(--tint-green)] border-[var(--green)] text-[var(--text-on-tint)]' 
            : 'bg-[var(--tint-red)] border-[var(--red)] text-[var(--text-on-tint)]'
        }`}>
          <h4 className="font-black text-lg mb-2 flex items-center gap-2">
            {selectedOption === task.correctIndex ? '🎉 Correct!' : '❌ Incorrect'}
          </h4>
          <p className="text-sm font-bold opacity-80 mb-2 uppercase tracking-wide">
            Meaning: {task.point.meaning}
          </p>
          <p className="text-sm font-medium leading-relaxed border-t border-current/10 pt-2 mt-2">
            Structure: {task.point.structure || 'N/A'}
          </p>
        </div>
      )}

      <div className="flex justify-between items-center pt-8 border-t-2 border-[var(--quiz-divider)]">
        <button
          onClick={onCancel}
          className="text-[var(--text-muted)] font-black hover:text-[var(--red)] transition-colors uppercase tracking-[0.2em] text-[9px]"
        >
          Quit Quest
        </button>
        
        {!isAnswered ? (
          <button
            disabled={selectedOption === null}
            onClick={handleCheck}
            className={`px-10 h-14 rounded-2xl font-black transition-all ${
              selectedOption !== null
                ? 'btn-3d btn-purple'
                : 'bg-[var(--gray-path)] cursor-not-allowed text-[var(--text-muted)] border-b-4 border-[var(--gray-path-dark)]'
            }`}
          >
            Check Answer
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="px-10 h-14 rounded-2xl font-black transition-all btn-3d btn-green"
          >
            Continue
          </button>
        )}
      </div>
    </div>
  );
}
