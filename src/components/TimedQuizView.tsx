import { useState, useEffect, useRef, useCallback } from 'react';
import type { Question, ExamResult, Mistake } from '../types';
import { playCorrectSound, playIncorrectSound } from '../utils/sound';
import { SessionEndOverlay } from './SessionEndOverlay';
import { Clock, Pause, Play, RotateCcw } from 'lucide-react';

interface TimedQuizViewProps {
  questions: Question[];
  category: 'toeic' | 'n2';
  onComplete: (result: ExamResult) => void;
  onCancel: () => void;
  hideSummary?: boolean;
  onSaveMistake?: (mistake: Mistake) => void;
  timeLimitMinutes?: number;
}

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) {
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function TimedQuizView({
  questions,
  category,
  onComplete,
  onCancel,
  hideSummary = false,
  onSaveMistake,
  timeLimitMinutes = 60
}: TimedQuizViewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(new Array(questions.length).fill(null));
  const [isFinished, setIsFinished] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  
  const totalTimeLimit = timeLimitMinutes * 60;
  const [totalTimeLeft, setTotalTimeLeft] = useState(totalTimeLimit);
  const totalTimeRef = useRef<ReturnType<typeof setInterval> | null>(null);
  
  const getInitialTime = useCallback(() => questions[currentIndex]?.subCategory === 'Reading' ? 120 : 45, [questions, currentIndex]);
  const [timeLeft, setTimeLeft] = useState(getInitialTime());
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setIsAnswered(false);
    setSelectedOption(null);
  }, [currentIndex]);

  // Total timer
  useEffect(() => {
    if (isFinished || isPaused) return;
    
    totalTimeRef.current = setInterval(() => {
      setTotalTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(totalTimeRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (totalTimeRef.current) clearInterval(totalTimeRef.current);
    };
  }, [isFinished, isPaused]);

  // Auto-submit when total time runs out
  useEffect(() => {
    if (totalTimeLeft === 0 && !isFinished) {
      const finalAnswers = [...selectedAnswers];
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
  }, [totalTimeLeft, isFinished]);

  // Per-question timer
  useEffect(() => {
    if (isFinished || isAnswered || isPaused) return;
    
    setTimeLeft(getInitialTime());
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
  }, [currentIndex, isFinished, isAnswered, isPaused, getInitialTime]);

  useEffect(() => {
    if (timeLeft === 0 && !isFinished && !isAnswered) {
      setIsAnswered(true);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  }, [timeLeft, isFinished, isAnswered]);

  const handleSelect = (optionIndex: number) => {
    if (isAnswered) return;
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
    } else {
      playIncorrectSound();
      if (onSaveMistake) {
        onSaveMistake({
          id: `mistake-${questions[currentIndex].id}-${Date.now()}`,
          type: 'question',
          data: questions[currentIndex],
          wrongAnswer: selectedOption !== null ? questions[currentIndex].options[selectedOption] : 'Skipped',
          timestamp: new Date().toISOString()
        });
      }
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      const finalAnswers = [...selectedAnswers];
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

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  if (isFinished) {
    const finalScore = calculateScore(selectedAnswers);
    const timeUsed = totalTimeLimit - totalTimeLeft;
    
    return (
      <SessionEndOverlay
        type="quiz"
        title="Timed Quiz Complete!"
        subtitle={`${category} Practice - ${formatTime(timeUsed)} used`}
        score={finalScore}
        totalScore={questions.length}
        buttonText="CLAIM REWARDS"
        onContinue={() => onComplete({
          id: crypto.randomUUID(),
          date: new Date().toISOString(),
          score: finalScore,
          totalQuestions: questions.length,
          category,
          difficulty: questions[0].difficulty,
          type: 'mini-quiz'
        })}
      />
    );
  }

  const currentQuestion = questions[currentIndex];
  const totalProgress = ((currentIndex + 1) / questions.length) * 100;
  const timeProgress = (totalTimeLeft / totalTimeLimit) * 100;
  const isLowTime = totalTimeLeft < 300; // Less than 5 minutes

  return (
    <div className="bg-bg-card lingo-card max-w-3xl w-full mx-auto relative overflow-hidden">
      {/* Total Timer Bar */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-bg-hover overflow-hidden">
        <div 
          className={`h-full transition-all duration-1000 ease-linear ${
            isLowTime ? 'bg-red animate-pulse' : 'bg-green'
          }`}
          style={{ width: `${timeProgress}%` }}
        />
      </div>

      {/* Header with total timer and controls */}
      <div className="flex justify-between items-center mb-6 mt-4 px-4">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${category === 'toeic' ? 'bg-blue' : 'bg-red'}`}></div>
          <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Timed {category}</span>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={togglePause}
            className="p-2 rounded-lg hover:bg-bg-hover transition-colors"
            aria-label={isPaused ? 'Resume' : 'Pause'}
          >
            {isPaused ? <Play size={16} /> : <Pause size={16} />}
          </button>
          
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border-2 font-mono ${
            isLowTime 
              ? 'border-red text-red bg-tint-red' 
              : 'border-border-main text-text-main bg-bg-hover'
          }`}>
            <Clock size={14} />
            <span className="text-sm font-bold">{formatTime(totalTimeLeft)}</span>
          </div>
        </div>
      </div>

      {/* Progress info */}
      <div className="flex justify-between items-center mb-6 px-4">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">
            Question {currentIndex + 1} of {questions.length}
          </span>
          {!isAnswered && (
            <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md border-2 ${
              timeLeft <= 5 ? 'text-red border-red animate-pulse' : 'text-blue border-blue'
            }`}>
              {timeLeft}s
            </span>
          )}
        </div>
        <span className="text-[10px] font-black text-text-muted">
          {Math.round(totalProgress)}% complete
        </span>
      </div>

      {/* Question content */}
      {currentQuestion.imageUrl && (
        <div className="w-full mb-8 rounded-2xl overflow-hidden border-2 border-border-main shadow-sm max-h-[300px]">
          <img src={currentQuestion.imageUrl} alt="Question" className="w-full h-full object-cover" loading="lazy" />
        </div>
      )}

      <div className="mb-10 px-4">
        <h3 className="text-2xl font-black text-text-main leading-tight">
          {currentQuestion.text}
        </h3>
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 gap-3 mb-8 px-4">
        {currentQuestion.options.map((option, idx) => {
          let btnClass = "";
          let badgeClass = "";
          
          if (isAnswered) {
            if (idx === currentQuestion.correctAnswer) {
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
              btnClass = "border-blue bg-tint-blue text-blue";
              badgeClass = "bg-blue text-white border-transparent";
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
              className={`w-full text-left h-16 px-6 rounded-2xl border-2 transition-all duration-200 flex items-center gap-4 ${btnClass}`}
            >
              <div className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center font-black text-lg border-2 ${badgeClass}`}>
                {String.fromCharCode(65 + idx)}
              </div>
              <span className="text-lg font-bold">{option}</span>
            </button>
          );
        })}
      </div>

      {/* Feedback */}
      {isAnswered && (
        <div className={`p-6 rounded-2xl border-2 mb-8 mx-4 ${
          selectedOption === currentQuestion.correctAnswer 
            ? 'bg-tint-green border-green text-text-on-tint' 
            : 'bg-tint-red border-red text-text-on-tint'
        }`}>
          <h4 className="font-black text-lg mb-2">
            {selectedOption === currentQuestion.correctAnswer ? 'Correct!' : 'Incorrect'}
          </h4>
          <p className="text-sm font-bold opacity-80 mb-2 uppercase tracking-wide">
            Correct Answer: {String.fromCharCode(65 + currentQuestion.correctAnswer)}. {currentQuestion.options[currentQuestion.correctAnswer]}
          </p>
          {currentQuestion.explanation && (
            <p className="text-sm font-medium leading-relaxed border-t border-current/10 pt-2 mt-2">
              {currentQuestion.explanation}
            </p>
          )}
        </div>
      )}

      {/* Action buttons */}
      <div className="flex justify-between items-center pt-8 border-t-2 border-quiz-divider px-4">
        <button
          onClick={() => {
            if (window.confirm('Bạn có chắc muốn thoát? Tiến trình sẽ bị mất.')) {
              onCancel();
            }
          }}
          className="text-text-muted font-black hover:text-red transition-colors uppercase tracking-[0.2em] text-[9px]"
        >
          Quit Quiz
        </button>
        
        {!isAnswered ? (
          <button
            disabled={selectedOption === null}
            onClick={handleCheck}
            className={`px-10 h-14 rounded-2xl font-black transition-all ${
              selectedOption !== null
                ? 'btn-3d btn-blue'
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
            {currentIndex === questions.length - 1 ? 'Finish Quiz' : 'Continue'}
          </button>
        )}
      </div>

      {/* Paused overlay */}
      {isPaused && (
        <div className="absolute inset-0 bg-bg-main/90 flex flex-col items-center justify-center z-50">
          <Pause size={64} className="text-text-muted mb-4" />
          <p className="text-2xl font-black text-text-main mb-2">Quiz Paused</p>
          <p className="text-sm text-text-muted mb-6">Timer is stopped</p>
          <button
            onClick={togglePause}
            className="px-8 py-3 rounded-2xl font-black btn-3d btn-green"
          >
            RESUME
          </button>
        </div>
      )}
    </div>
  );
}
