import { useState, useEffect, useRef } from 'react';
import type { Question, ExamResult } from '../types';
import { playCorrectSound } from '../utils/sound';

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
  const [isAnswered, setIsAnswered] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  
  // --- TIMER STATE ---
  const [timeLeft, setTimeLeft] = useState(15);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Reset answer states when moving to a new question
  useEffect(() => {
    setIsAnswered(false);
    setSelectedOption(null);
  }, [currentIndex]);

  useEffect(() => {
    if (isFinished || isAnswered) return;
    
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
  }, [currentIndex, isFinished, isAnswered]);

  useEffect(() => {
    if (timeLeft === 0 && !isFinished && !isAnswered) {
      // Auto-submit as incorrect when time runs out
      setIsAnswered(true);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  }, [timeLeft, isFinished, isAnswered]);

  const handleSelect = (optionIndex: number) => {
    if (isAnswered) return; // Prevent changing answer after check
    setSelectedOption(optionIndex);
  };

  const handleCheck = () => {
    if (selectedOption === null) return;
    const newAnswers = [...selectedAnswers];
    newAnswers[currentIndex] = selectedOption;
    setSelectedAnswers(newAnswers);
    setIsAnswered(true);
    if (timerRef.current) clearInterval(timerRef.current);

    if (selectedOption === questions[currentIndex].correctAnswer) {
      playCorrectSound();
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      const finalAnswers = [...selectedAnswers];
      // In case of any uncommitted answer (like timeout), it stays null.
      const finalScore = calculateScore(finalAnswers);
      if (hideSummary) {
        onComplete({
          id: crypto.randomUUID(),
          date: new Date().toISOString(),
          score: finalScore,
          totalQuestions: questions.length,
          category,
          difficulty: questions[0].difficulty,
          type: 'mini-quiz'
        });
      } else {
        setIsFinished(true);
      }
    }
  };

  const calculateScore = (currentAnswersList: (number | null)[]) => {
    let score = 0;
    currentAnswersList.forEach((ans, idx) => {
      if (ans === questions[idx].correctAnswer) {
        score++;
      }
    });
    return score;
  };

  if (isFinished) {
    const finalScore = calculateScore(selectedAnswers);
    const percent = (finalScore / questions.length) * 100;
    
    return (
      <div className="bg-[var(--bg-card)] lingo-card text-center max-w-lg w-full mx-auto animate-in zoom-in-95 duration-500">
        <div className="w-24 h-24 bg-[var(--tint-blue)] rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-[var(--blue)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-3xl font-black text-[var(--text-main)] mb-2 uppercase tracking-tight">Quest Complete!</h2>
        <p className="text-[10px] font-black text-[var(--text-muted)] mb-10 uppercase tracking-[0.2em]">{category} Practice Exam</p>
        
        <div className="relative w-48 h-48 mx-auto mb-10">
          <svg className="w-full h-full transform -rotate-90">
            <circle cx="96" cy="96" r="86" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-[var(--gray-path)]" />
            <circle cx="96" cy="96" r="86" stroke="currentColor" strokeWidth="12" fill="transparent" className={percent >= 80 ? 'text-[var(--green)]' : 'text-[var(--gold)]'} strokeDasharray={540.3} strokeDashoffset={540.3 - (540.3 * percent) / 100} strokeLinecap="round" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-5xl font-black text-[var(--text-main)]">{finalScore}</span>
            <span className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">Score / {questions.length}</span>
          </div>
        </div>

        <button
          onClick={() => onComplete({
            id: crypto.randomUUID(),
            date: new Date().toISOString(),
            score: finalScore,
            totalQuestions: questions.length,
            category,
            difficulty: questions[0].difficulty,
            type: 'mini-quiz'
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
      {!isFinished && !isAnswered && (
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-[var(--bg-hover)] overflow-hidden">
          <div 
            className={`h-full transition-all duration-1000 ease-linear ${timeLeft <= 5 ? 'bg-[var(--red)] animate-pulse' : 'bg-[var(--blue)]'}`}
            style={{ width: `${(timeLeft / 15) * 100}%` }}
          ></div>
        </div>
      )}

      <div className="flex justify-between items-center mb-10 mt-2">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${category === 'toeic' ? 'bg-[var(--blue)]' : 'bg-[var(--red)]'}`}></div>
          <span className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em]">{category} Mock Exam</span>
          {!isFinished && !isAnswered && (
            <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md border-2 ${timeLeft <= 5 ? 'text-[var(--red)] border-[var(--red)] animate-pulse' : 'text-[var(--blue)] border-[var(--blue)]'}`}>
              {timeLeft}s
            </span>
          )}
          {isAnswered && (
            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md border-2 text-[var(--text-muted)] border-[var(--border-main)] bg-[var(--bg-hover)]">
              Answered
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
        <h3 className="text-2xl font-black text-[var(--text-main)] leading-tight">
          {currentQuestion.text}
        </h3>
      </div>

      <div className="grid grid-cols-1 gap-3 mb-8">
        {currentQuestion.options.map((option, idx) => {
          let btnClass = "";
          let badgeClass = "";
          
          if (isAnswered) {
            if (idx === currentQuestion.correctAnswer) {
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
              btnClass = "border-[var(--blue)] bg-[var(--tint-blue)] text-[var(--blue)]";
              badgeClass = "bg-[var(--blue)] text-white border-transparent";
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
              <span className="text-lg font-bold">{option}</span>
            </button>
          );
        })}
      </div>

      {/* Immediate feedback section */}
      {isAnswered && (
        <div className={`p-6 rounded-2xl border-2 mb-8 animate-in slide-in-from-bottom-4 duration-300 ${
          selectedOption === currentQuestion.correctAnswer 
            ? 'bg-[var(--tint-green)] border-[var(--green)] text-[var(--text-on-tint)]' 
            : 'bg-[var(--tint-red)] border-[var(--red)] text-[var(--text-on-tint)]'
        }`}>
          <h4 className="font-black text-lg mb-2 flex items-center gap-2">
            {selectedOption === currentQuestion.correctAnswer ? '🎉 Correct!' : '❌ Incorrect'}
          </h4>
          <p className="text-sm font-bold opacity-80 mb-2 uppercase tracking-wide">
            Correct Answer: {String.fromCharCode(65 + currentQuestion.correctAnswer)}. {currentQuestion.options[currentQuestion.correctAnswer]}
          </p>
          {currentQuestion.explanation && (
            <p className="text-sm font-medium leading-relaxed border-t border-current/10 pt-2 mt-2">
              💡 {currentQuestion.explanation}
            </p>
          )}
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
                ? 'btn-3d btn-blue'
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
            {currentIndex === questions.length - 1 ? 'Finish Quest' : 'Continue'}
          </button>
        )}
      </div>
    </div>
  );
}
