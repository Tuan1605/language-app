import { useState, useCallback } from 'react';
import { speak, stopSpeaking } from '../utils/tts';
import { Play, Pause, Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react';

interface ListeningExercise {
  id: string;
  title: string;
  difficulty: string;
  script: string;
  questions: {
    id: string;
    text: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  }[];
}

interface ListeningPracticeViewProps {
  exercise: ListeningExercise;
  onComplete: () => void;
  onCancel: () => void;
}

export function ListeningPracticeView({ exercise, onComplete, onCancel }: ListeningPracticeViewProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showScript, setShowScript] = useState(false);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const currentQuestion = exercise.questions[currentQuestionIndex];

  const handlePlay = useCallback(() => {
    if (isPlaying) {
      stopSpeaking();
      setIsPlaying(false);
      return;
    }

    setIsPlaying(true);
    speak(exercise.script, {
      lang: 'ja-JP',
      onEnd: () => setIsPlaying(false),
    });
  }, [exercise.script, isPlaying]);

  const handleAnswer = (questionId: string, optionIndex: number) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const handleNext = () => {
    if (currentQuestionIndex < exercise.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  const getScore = () => {
    let correct = 0;
    exercise.questions.forEach(q => {
      if (answers[q.id] === q.correctAnswer) correct++;
    });
    return correct;
  };

  return (
    <div className="bg-bg-card lingo-card p-6 sm:p-10 max-w-3xl mx-auto w-full animate-in slide-in-from-bottom-8 duration-500">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-3 h-3 rounded-full bg-red"></div>
          <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Listening Practice</span>
        </div>
        <h2 className="text-2xl font-black text-text-main">{exercise.title}</h2>
        <p className="text-sm text-text-muted mt-2">
          Question {currentQuestionIndex + 1} of {exercise.questions.length}
        </p>
      </div>

      {/* Audio Controls */}
      <div className="mb-8 p-6 bg-gray-bg rounded-2xl border-2 border-gray-path">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={handlePlay}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
              isPlaying ? 'bg-red text-white' : 'bg-blue text-white'
            }`}
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
          </button>
          <div className="flex-1">
            <p className="font-black text-text-main">
              {isPlaying ? 'Playing audio...' : 'Click to play the Japanese audio'}
            </p>
            <p className="text-xs text-text-muted mt-1">
              Listen carefully before answering the questions
            </p>
          </div>
        </div>

        {/* Script toggle - only show after answering */}
        {submitted && (
          <div className="mt-4 pt-4 border-t-2 border-gray-path">
            <button
              onClick={() => setShowScript(!showScript)}
              className="flex items-center gap-2 text-sm font-bold text-blue hover:text-blue-shadow transition-colors"
            >
              {showScript ? <EyeOff size={16} /> : <Eye size={16} />}
              {showScript ? 'Hide Script' : 'Show Script'}
            </button>
            {showScript && (
              <div className="mt-3 p-4 bg-white rounded-xl border-2 border-gray-path text-sm text-text-main whitespace-pre-line leading-relaxed">
                {exercise.script}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Question */}
      {currentQuestion && (
        <div className="mb-8">
          <p className="text-lg font-black text-text-main mb-4">
            {currentQuestion.text}
          </p>
          <div className="space-y-3">
            {currentQuestion.options.map((option, idx) => {
              const isSelected = answers[currentQuestion.id] === idx;
              const isCorrect = submitted && idx === currentQuestion.correctAnswer;
              const isWrongSelected = submitted && isSelected && idx !== currentQuestion.correctAnswer;

              let btnClass = "border-border-main bg-bg-card text-text-main hover:border-blue";
              if (submitted) {
                if (isCorrect) btnClass = "border-green bg-tint-green text-green";
                else if (isWrongSelected) btnClass = "border-red bg-tint-red text-red";
                else btnClass = "opacity-40 border-border-main bg-bg-card text-text-main";
              } else if (isSelected) {
                btnClass = "border-blue bg-tint-blue text-blue";
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleAnswer(currentQuestion.id, idx)}
                  disabled={submitted}
                  className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all ${btnClass}`}
                >
                  <span className="font-bold">{option}</span>
                </button>
              );
            })}
          </div>

          {/* Feedback after submit */}
          {submitted && (
            <div className={`mt-4 p-4 rounded-xl border-2 ${
              answers[currentQuestion.id] === currentQuestion.correctAnswer
                ? 'bg-tint-green border-green'
                : 'bg-tint-red border-red'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                {answers[currentQuestion.id] === currentQuestion.correctAnswer ? (
                  <CheckCircle className="text-green" size={20} />
                ) : (
                  <XCircle className="text-red" size={20} />
                )}
                <span className="font-black">
                  {answers[currentQuestion.id] === currentQuestion.correctAnswer ? 'Correct!' : 'Incorrect'}
                </span>
              </div>
              <p className="text-sm text-text-muted">{currentQuestion.explanation}</p>
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-between items-center">
        <button
          onClick={onCancel}
          className="text-text-muted font-black hover:text-red transition-colors uppercase tracking-[0.2em] text-[9px]"
        >
          Quit
        </button>

        {!submitted ? (
          <button
            onClick={handleSubmit}
            disabled={Object.keys(answers).length < exercise.questions.length}
            className={`px-8 py-3 rounded-xl font-black transition-all ${
              Object.keys(answers).length >= exercise.questions.length
                ? 'btn-3d btn-blue'
                : 'bg-gray-path cursor-not-allowed text-text-muted'
            }`}
          >
            Check Answers
          </button>
        ) : (
          <div className="flex items-center gap-4">
            <span className="font-black text-text-main">
              Score: {getScore()}/{exercise.questions.length}
            </span>
            <button
              onClick={handleNext}
              className="px-8 py-3 rounded-xl font-black btn-3d btn-green"
            >
              {currentQuestionIndex < exercise.questions.length - 1 ? 'Next' : 'Finish'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
