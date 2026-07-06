import { useState, useEffect, useRef } from 'react';
import type { GrammarQuizTaskData, Mistake } from '../types';
import { playCorrectSound, playIncorrectSound } from '../utils/sound';
import { ConfirmDialog } from './ConfirmDialog';
import { GRAMMAR_QUIZ_TIME } from '../utils/constants';

function generateChunks(example: string, pattern: string): string[] {
  if (example.includes(' ')) {
    return example.split(' ').filter(x => x.trim().length > 0);
  }
  const parts = example.split(pattern);
  const chunks: string[] = [];
  
  parts.forEach((p, i) => {
    if (p.length > 0) {
       const sub = p.split(/(?<=[、。])/).filter(x => x.length > 0);
       sub.forEach(s => {
          if (s.length > 6) {
             const mid = Math.floor(s.length / 2);
             chunks.push(s.substring(0, mid));
             chunks.push(s.substring(mid));
          } else {
             chunks.push(s);
          }
       });
    }
    if (i < parts.length - 1) chunks.push(pattern);
  });
  return chunks.filter(c => c.length > 0);
}
interface GrammarQuizViewProps {
  task: GrammarQuizTaskData;
  onComplete: () => void;
  onCancel: () => void;
  onSaveMistake?: (mistake: Mistake) => void;
}

export function GrammarQuizView({ task, onComplete, onCancel, onSaveMistake }: GrammarQuizViewProps) {
  const [isAnswered, setIsAnswered] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showQuitConfirm, setShowQuitConfirm] = useState(false);
  
  // Timer State
  const initialTime = GRAMMAR_QUIZ_TIME;
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [mode, setMode] = useState<'multiple-choice' | 'sentence-builder'>('multiple-choice');
  const [chunks, setChunks] = useState<string[]>([]);
  const [shuffledChunks, setShuffledChunks] = useState<string[]>([]);
  const [selectedChunks, setSelectedChunks] = useState<number[]>([]); // indexes of shuffledChunks

  // Reset answer states when moving to a new question
  useEffect(() => {
    setIsAnswered(false);
    setSelectedOption(null);
    setSelectedChunks([]);
    
    // 50% chance of being sentence-builder if the example has a pattern
    const isBuilder = Math.random() > 0.5 && task.point.example.includes(task.point.pattern);
    setMode(isBuilder ? 'sentence-builder' : 'multiple-choice');

    if (isBuilder) {
      const generated = generateChunks(task.point.example, task.point.pattern);
      setChunks(generated);
      const shuffled = [...generated].map((val, idx) => ({ val, idx })).sort(() => Math.random() - 0.5);
      // Ensure it's actually shuffled (not perfectly same as original)
      setShuffledChunks(shuffled.map(s => s.val));
    }
  }, [task]);

  useEffect(() => {
    if (isAnswered) return;
    
    setTimeLeft(initialTime);
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
  }, [task, isAnswered, initialTime]);

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
    if (mode === 'multiple-choice' && selectedOption === null) return;
    if (mode === 'sentence-builder' && selectedChunks.length !== chunks.length) return;
    
    setIsAnswered(true);
    if (timerRef.current) clearInterval(timerRef.current);

    let isCorrect = false;
    if (mode === 'multiple-choice') {
      isCorrect = selectedOption === task.correctIndex;
    } else {
      const userSentence = selectedChunks.map(i => shuffledChunks[i]).join(task.point.example.includes(' ') ? ' ' : '');
      const originalSentence = chunks.join(task.point.example.includes(' ') ? ' ' : '');
      isCorrect = userSentence === originalSentence;
    }

    if (isCorrect) {
      playCorrectSound();
    } else {
      playIncorrectSound();
      if (onSaveMistake) {
        const userAnswer = mode === 'multiple-choice'
          ? task.options[selectedOption!]
          : selectedChunks.map(i => shuffledChunks[i]).join(' ');
        onSaveMistake({
          id: crypto.randomUUID(),
          type: 'question',
          data: { id: task.point.id, text: task.point.pattern, options: task.options, correctAnswer: task.correctIndex, category: 'toeic', difficulty: 'intermediate' },
          wrongAnswer: userAnswer,
          timestamp: new Date().toISOString()
        });
      }
    }
  };

  const isSentenceBuilderCorrect = () => {
    const userSentence = selectedChunks.map(i => shuffledChunks[i]).join(task.point.example.includes(' ') ? ' ' : '');
    const originalSentence = chunks.join(task.point.example.includes(' ') ? ' ' : '');
    return userSentence === originalSentence;
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
    const cleanPattern = pattern.replace(/～/g, '').trim();
    
    if (cleanPattern && example.includes(cleanPattern)) {
      return example.split(cleanPattern).map((part, i, arr) => (
        <span key={i}>
          {part}
          {i < arr.length - 1 && <span className="text-gold border-b-2 border-gold">{blank}</span>}
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
    <div className="bg-bg-card lingo-card max-w-3xl w-full mx-auto relative overflow-hidden view-enter">
      {/* Visual Timer Bar */}
      {!isAnswered && (
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-bg-hover overflow-hidden">
          <div 
            className={`h-full transition-all duration-1000 ease-linear ${timeLeft <= 5 ? 'bg-red animate-pulse' : 'bg-blue'}`}
            style={{ width: `${(timeLeft / initialTime) * 100}%` }}
          ></div>
        </div>
      )}

      <div className="flex justify-between items-center mb-10 mt-2">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-purple"></div>
          <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Grammar Quiz</span>
          {!isAnswered && (
            <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md border-2 ${timeLeft <= 5 ? 'text-red border-red animate-pulse' : 'text-purple border-purple'}`}>
              {timeLeft}s
            </span>
          )}
        </div>
      </div>

      <div className="mb-10 text-center">
        <p className="text-sm font-bold text-text-muted mb-4">
          {mode === 'multiple-choice' ? 'Fill in the blank with the correct grammar pattern:' : 'Arrange the pieces to form the correct sentence:'}
        </p>
        <h3 className="text-3xl font-black text-text-main leading-relaxed mb-4">
          {mode === 'multiple-choice' ? renderBlankedExample() : task.point.exampleTranslation}
        </h3>
        {mode === 'multiple-choice' && (
          <p className="text-lg font-bold text-blue">
            "{task.point.exampleTranslation}"
          </p>
        )}
      </div>

      {mode === 'multiple-choice' ? (
        <div className="grid grid-cols-1 gap-3 mb-8">
          {task.options.map((option, idx) => {
            let btnClass = "";
            let badgeClass = "";
            
            if (isAnswered) {
              if (idx === task.correctIndex) {
                btnClass = "border-green bg-tint-green text-green shadow-sm";
                badgeClass = "bg-green text-white border-transparent";
              } else if (idx === selectedOption) {
                btnClass = "border-red bg-tint-red text-red";
                badgeClass = "bg-red text-white border-transparent";
              } else {
                btnClass = "opacity-40 border-border-main bg-bg-card text-text-main";
                badgeClass = "bg-bg-card text-text-muted border-border-main";
              }
            } else {
              if (selectedOption === idx) {
                btnClass = "border-purple bg-tint-blue text-purple";
                badgeClass = "bg-purple text-white border-transparent";
              } else {
                btnClass = "border-border-main hover:border-text-muted bg-bg-card text-text-main";
                badgeClass = "bg-bg-card text-text-muted border-border-main";
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
      ) : (
        <div className="mb-8">
          {/* Answer Area */}
          <div className="min-h-[120px] p-4 rounded-2xl border-2 border-dashed border-border-main bg-gray-bg mb-6 flex flex-wrap gap-2 content-start">
            {selectedChunks.map((chunkIdx, i) => (
              <button
                key={`ans-${i}`}
                disabled={isAnswered}
                onClick={() => {
                  setSelectedChunks(prev => prev.filter((_, idx) => idx !== i));
                }}
                className={`px-4 py-2 rounded-xl font-bold text-lg shadow-sm active:scale-95 transition-transform ${isAnswered ? (isSentenceBuilderCorrect() ? 'bg-green text-white' : 'bg-red text-white') : 'bg-bg-card border-2 border-border-main text-text-main hover:border-text-muted'}`}
              >
                {shuffledChunks[chunkIdx]}
              </button>
            ))}
          </div>
          
          {/* Word Bank */}
          <div className="flex flex-wrap gap-2 justify-center">
            {shuffledChunks.map((chunk, idx) => {
              const isSelected = selectedChunks.includes(idx);
              return (
                <button
                  key={`bank-${idx}`}
                  disabled={isSelected || isAnswered}
                  onClick={() => {
                    setSelectedChunks(prev => [...prev, idx]);
                  }}
                  className={`px-4 py-2 rounded-xl font-bold text-lg transition-all active:scale-95 ${isSelected ? 'bg-gray-path text-gray-path-dark shadow-none opacity-50' : 'bg-bg-card text-text-main border-b-4 border-border-main shadow-sm hover:-translate-y-1'}`}
                >
                  {chunk}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Immediate feedback section */}
      {isAnswered && (
        <div
          className={`p-6 rounded-2xl border-2 mb-8 animate-in slide-in-from-bottom-4 duration-300 ${
            (mode === 'multiple-choice' ? selectedOption === task.correctIndex : isSentenceBuilderCorrect())
              ? 'bg-tint-green border-green text-text-on-tint'
              : 'bg-tint-red border-red text-text-on-tint'
          }`}
          role="alert"
          aria-live="assertive"
        >
          <h4 className="font-black text-lg mb-2 flex items-center gap-2">
            {(mode === 'multiple-choice' ? selectedOption === task.correctIndex : isSentenceBuilderCorrect()) ? 'Correct!' : 'Incorrect'}
          </h4>
          <p className="text-sm font-bold opacity-80 mb-2 uppercase tracking-wide">
            Meaning: {task.point.meaning}
          </p>
          <p className="text-sm font-medium leading-relaxed border-t border-current/10 pt-2 mt-2">
            Structure: {task.point.structure || 'N/A'}
          </p>
          {mode === 'sentence-builder' && !(isSentenceBuilderCorrect()) && (
             <p className="text-sm font-medium leading-relaxed border-t border-current/10 pt-2 mt-2 text-red">
               Correct: {chunks.join(task.point.example.includes(' ') ? ' ' : '')}
             </p>
          )}
        </div>
      )}

      <div className="flex justify-between items-center pt-8 border-t-2 border-quiz-divider">
        <button
          onClick={() => setShowQuitConfirm(true)}
          className="text-text-muted font-black hover:text-red transition-colors uppercase tracking-[0.2em] text-[9px]"
        >
          Quit Quiz
        </button>
        
        {!isAnswered ? (
          <button
            disabled={(mode === 'multiple-choice' ? selectedOption === null : selectedChunks.length !== chunks.length)}
            onClick={handleCheck}
            className={`px-10 h-14 rounded-2xl font-black transition-all ${
              (mode === 'multiple-choice' ? selectedOption !== null : selectedChunks.length === chunks.length)
                ? 'btn-3d btn-purple'
                : 'bg-gray-path cursor-not-allowed text-text-muted border-b-4 border-gray-path-dark'
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

      <ConfirmDialog
        isOpen={showQuitConfirm}
        title="Quit Quiz?"
        message="Your progress will be lost. Are you sure you want to quit?"
        confirmText="Quit"
        cancelText="Continue Quiz"
        onConfirm={onCancel}
        onCancel={() => setShowQuitConfirm(false)}
        danger
      />
    </div>
  );
}
