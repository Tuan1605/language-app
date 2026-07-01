import { useState, useEffect, useRef } from 'react';
import type { Flashcard, Mistake } from '../types';
import { playCorrectSound, playIncorrectSound } from '../utils/sound';
import { speak, langForCategory } from '../utils/tts';
import { Volume2 } from 'lucide-react';

/** Strip HTML tags that may come from Anki-imported data. */
const stripHtml = (s: string) => s.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();

interface VocabQuizViewProps {
  word: Flashcard;
  allCards: Flashcard[];
  onComplete: (isCorrect: boolean) => void;
  onSaveMistake?: (mistake: Mistake) => void;
}

export function VocabQuizView({ word, allCards, onComplete, onSaveMistake }: VocabQuizViewProps) {
  const [options, setOptions] = useState<string[]>([]);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const initialTime = 45;
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // Generate 4 randomized options
    // First, get all UNIQUE definitions that are NOT the correct answer
    const answerDef = stripHtml(word.definition).toLowerCase().trim();
    
    // Create a pool of unique definitions (case-insensitive deduplication)
    const uniqueDefs = new Map<string, string>();
    allCards.forEach(c => {
      if (c.language === word.language) {
        const def = stripHtml(c.definition);
        const lowerDef = def.toLowerCase().trim();
        if (lowerDef !== answerDef && !uniqueDefs.has(lowerDef)) {
          uniqueDefs.set(lowerDef, def); // Store the original cased version
        }
      }
    });

    const distractors = Array.from(uniqueDefs.values())
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    
    const combined = [...distractors, stripHtml(word.definition)].sort(() => Math.random() - 0.5);
    setOptions(combined);
    
    // Start timer
    setTimeLeft(initialTime);
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

  const correctIdx = options.indexOf(stripHtml(word.definition));
  const isCorrect = selectedIdx === correctIdx;

  const handleSelect = (idx: number) => {
    if (isAnswered) return;
    clearInterval(timerRef.current);
    setSelectedIdx(idx);
    setIsAnswered(true);
    if (idx === correctIdx) {
      playCorrectSound();
    } else {
      playIncorrectSound();
      if (onSaveMistake) {
        onSaveMistake({
          id: crypto.randomUUID(),
          type: 'question',
          data: { id: word.id, text: word.word, options: options, correctAnswer: correctIdx, category: word.category, difficulty: word.difficulty },
          wrongAnswer: options[idx],
          timestamp: new Date().toISOString()
        });
      }
    }
  };

  return (
    <div className="bg-bg-card lingo-card p-10 max-w-2xl mx-auto w-full animate-in slide-in-from-bottom-8 duration-500 relative overflow-hidden">
      {/* Visual Timer Bar */}
      {!isAnswered && (
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-bg-hover">
          <div 
            className={`h-full transition-all duration-1000 ease-linear ${timeLeft <= 5 ? 'bg-red animate-pulse' : 'bg-green'}`}
            style={{ width: `${(timeLeft / initialTime) * 100}%` }}
          ></div>
        </div>
      )}

      <div className="flex justify-between items-center mb-10 mt-2">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${word.category === 'toeic' ? 'bg-blue' : 'bg-red'}`}></div>
          <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Vocabulary Quiz</span>
          {!isAnswered && (
            <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md border-2 ${timeLeft <= 5 ? 'text-red border-red' : 'text-green border-green'}`}>
              {timeLeft}s
            </span>
          )}
        </div>
        <div className="bg-bg-hover px-4 py-1.5 rounded-xl text-[9px] font-black text-text-muted uppercase tracking-widest border-2 border-border-main">
          Timed Recall
        </div>
      </div>

      <div className="text-center space-y-4 mb-12">
        <p className="text-[10px] font-black text-blue uppercase tracking-[0.2em]">Select the correct meaning:</p>
        <div className="flex items-center justify-center gap-3">
          <h3 className="text-5xl font-black text-text-main leading-tight">
            {word.word}
          </h3>
          <button 
            onClick={() => speak(word.word, { lang: langForCategory(word.language) })} 
            className="w-10 h-10 rounded-full bg-tint-blue text-blue flex items-center justify-center hover:bg-blue hover:text-white transition-colors active:scale-95"
            aria-label="Listen"
          >
            <Volume2 size={20} />
          </button>
        </div>
        {word.imageUrl && (
           <div className="w-40 h-40 mx-auto rounded-2xl overflow-hidden border-2 border-border-main shadow-sm">
               <img src={word.imageUrl} alt={word.word} className="w-full h-full object-cover" loading="lazy" />
           </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3 mb-10">
        {options.map((option, idx) => {
          let btnClass = "border-border-main bg-bg-card text-text-main";
          if (isAnswered) {
             if (idx === correctIdx) btnClass = "border-green bg-tint-green text-green shadow-sm";
             else if (idx === selectedIdx) btnClass = "border-red bg-tint-red text-red";
             else btnClass = "opacity-40 border-border-main";
          } else {
             btnClass = "border-border-main hover:border-blue hover:bg-bg-hover";
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              disabled={isAnswered}
              className={`w-full text-left p-6 rounded-2xl border-2 transition-all duration-200 font-bold text-lg flex items-center gap-4 ${btnClass}`}
            >
              <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center font-black text-sm border-2 ${
                isAnswered && idx === correctIdx ? 'bg-green text-white border-transparent' : 'border-border-main text-text-muted'
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
          className={`w-full h-16 btn-3d rounded-2xl text-lg font-black animate-in zoom-in-95 ${isCorrect ? 'btn-green shadow-green/20' : 'btn-blue'}`}
        >
          {isCorrect ? 'EXCELLENT! NEXT →' : 'GOT IT! NEXT →'}
        </button>
      )}
    </div>
  );
}
