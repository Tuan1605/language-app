import { useState, useEffect, useRef, useCallback } from 'react';
import type { Question, ExamResult, Mistake } from '../types';
import { playCorrectSound, playIncorrectSound } from '../utils/sound';
import { SessionEndOverlay } from './SessionEndOverlay';

interface QuizViewProps {
  questions: Question[];
  category: 'toeic' | 'n2';
  onComplete: (result: ExamResult) => void;
  onCancel: () => void;
  hideSummary?: boolean;
  onSaveMistake?: (mistake: Mistake) => void;
}

export function QuizView({ questions, category, onComplete, onCancel, hideSummary = false, onSaveMistake }: QuizViewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(new Array(questions.length).fill(null));
  const [isFinished, setIsFinished] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  
  // --- TIMER STATE ---
  const getInitialTime = useCallback(() => questions[currentIndex]?.subCategory === 'Reading' ? 120 : 45, [questions, currentIndex]);
  const [timeLeft, setTimeLeft] = useState(getInitialTime());
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Reset answer states when moving to a new question
  useEffect(() => {
    setIsAnswered(false);
    setSelectedOption(null);
  }, [currentIndex]);

  useEffect(() => {
    if (isFinished || isAnswered) return;
    
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
  }, [currentIndex, isFinished, isAnswered, getInitialTime]);

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
    
    return (
      <SessionEndOverlay 
        type="quiz"
        title="Quest Complete!"
        subtitle={`${category} Practice Exam`}
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
  const hasMedia = !!(currentQuestion.passage || currentQuestion.imageUrl || currentQuestion.audioUrl);

  return (
    <div className={`bg-bg-card lingo-card w-full mx-auto relative overflow-hidden flex flex-col transition-all duration-300 ${hasMedia ? 'max-w-6xl' : 'max-w-3xl'}`}>
      {/* Visual Timer Bar */}
      {!isFinished && !isAnswered && (
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-bg-hover overflow-hidden">
          <div 
            className={`h-full transition-all duration-1000 ease-linear ${timeLeft <= 5 ? 'bg-red animate-pulse' : 'bg-blue'}`}
            style={{ width: `${(timeLeft / getInitialTime()) * 100}%` }}
          ></div>
        </div>
      )}

      <div className="flex justify-between items-center mb-10 mt-2">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${category === 'toeic' ? 'bg-blue' : 'bg-red'}`}></div>
          <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">{category} Mock Exam</span>
          {!isFinished && !isAnswered && (
            <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md border-2 ${timeLeft <= 5 ? 'text-red border-red animate-pulse' : 'text-blue border-blue'}`}>
              {timeLeft}s
            </span>
          )}
          {isAnswered && (
            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md border-2 text-text-muted border-border-main bg-bg-hover">
              Answered
            </span>
          )}
        </div>
        <div className="bg-bg-hover px-4 py-1.5 rounded-xl text-[9px] font-black text-text-muted uppercase tracking-widest border-2 border-border-main shrink-0">
          Question {currentIndex + 1} of {questions.length}
        </div>
      </div>

      <div className={`flex flex-col ${hasMedia ? 'md:flex-row md:gap-8' : ''}`}>
        {hasMedia && (
          <div className="w-full md:w-1/2 flex flex-col gap-6 overflow-y-auto max-h-[60vh] pr-2 md:pr-6 border-b-2 md:border-b-0 md:border-r-2 border-gray-path pb-6 md:pb-0 mb-6 md:mb-0 scroll-smooth">
            {currentQuestion.passage && (
              <div className="whitespace-pre-wrap text-sm md:text-base font-medium bg-gray-bg p-5 rounded-2xl border-2 border-gray-path leading-relaxed">
                {currentQuestion.passage}
              </div>
            )}
            {currentQuestion.imageUrl && (
              <img src={currentQuestion.imageUrl} alt="Question illustration" className="w-full h-auto object-contain rounded-2xl border-2 border-gray-path" loading="lazy" />
            )}
            {currentQuestion.audioUrl && (
              <audio controls src={currentQuestion.audioUrl} className="w-full focus:outline-none focus:ring-2 focus:ring-blue-500 rounded" />
            )}
          </div>
        )}

        <div className={`w-full flex flex-col ${hasMedia ? 'md:w-1/2' : ''}`}>
          <div className="mb-8">
            <h3 className="text-2xl font-black text-text-main leading-snug">
              {currentQuestion.text}
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-3 mb-8">
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
            ? 'bg-tint-green border-green text-text-on-tint' 
            : 'bg-tint-red border-red text-text-on-tint'
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
      </div>
      </div>

      <div className="flex justify-between items-center pt-8 border-t-2 border-quiz-divider mt-auto">
        <button
          onClick={() => {
            if (window.confirm('Bạn có chắc muốn thoát? Tiến trình sẽ bị mất.')) {
              onCancel();
            }
          }}
          className="text-text-muted font-black hover:text-red transition-colors uppercase tracking-[0.2em] text-[9px]"
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
            {currentIndex === questions.length - 1 ? 'Finish Quest' : 'Continue'}
          </button>
        )}
      </div>
    </div>
  );
}
