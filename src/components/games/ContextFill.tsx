import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { Question } from '../../types';
import { useGameBase } from '../../hooks/useGameBase';
import { useUserStore } from '../../stores/useUserStore';

import { Trophy, Timer, Zap } from 'lucide-react';

export function ContextFill({ onComplete, difficulty = 'medium' }: { onComplete: () => void; difficulty?: 'easy' | 'medium' | 'hard' }) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);

  const { gameState, setGameState, loadQuestions, finishGame } = useGameBase({ gameId: 'context', difficulty, onComplete });
  const gameHighScores = useUserStore(s => s.gameHighScores);

  const TIMER_BY_DIFFICULTY = { easy: 90, medium: 60, hard: 40 };

  useEffect(() => {
    loadGame();
  }, []);

  useEffect(() => {
    if (gameState !== 'playing' || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timer);
          finishGame(score);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, timeLeft, score]);

  // Keyboard shortcuts: A/B/C/D
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== 'playing') return;
      const currentQ = questions[currentIndex];
      if (!currentQ) return;
      const key = e.key.toUpperCase();
      const idx = key.charCodeAt(0) - 65;
      if (idx >= 0 && idx < (currentQ.options?.length ?? 0)) {
        handleAnswer(idx);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, questions, currentIndex, handleAnswer]);

  const loadGame = async () => {
    const allQs = await loadQuestions();
    if (allQs.length < 5) return;

    const shuffled = allQs.sort(() => 0.5 - Math.random());
    setQuestions(shuffled);
    setCurrentIndex(0);
    setScore(0);
    setCombo(0);
    setTimeLeft(TIMER_BY_DIFFICULTY[difficulty]);
    setGameState('playing');
  };

  function handleAnswer(optionIndex: number) {
    if (gameState !== 'playing') return;

    const currentQ = questions[currentIndex];
    const isCorrect = optionIndex === currentQ.correctAnswer;

    if (isCorrect) {
      const comboBonus = Math.floor(combo / 3) * 5;
      const newScore = score + 10 + comboBonus;
      setScore(newScore);
      setCombo(c => c + 1);

      if (currentIndex + 1 < questions.length) {
        setCurrentIndex(i => i + 1);
      } else {
        finishGame(newScore);
      }
    } else {
      setCombo(0);
      setTimeLeft(t => Math.max(0, t - 5));
    }
  };

  if (gameState === 'loading') return <div className="flex-1 flex items-center justify-center font-bold">Loading...</div>;

  if (gameState === 'gameover') {
    return (
      <div className="flex-1 flex flex-col items-center justify-center">
        <Trophy className="w-16 h-16 text-gold mb-4" />
        <h2 className="text-3xl font-black text-text-main mb-2">Game Over</h2>
        <p className="text-xl font-bold text-text-muted mb-2">Final Score: {score}</p>
        {gameHighScores.context[difficulty] > 0 && (
          <p className="text-sm font-bold text-gold mb-8">Best: {gameHighScores.context[difficulty]}</p>
        )}
        <div className="flex gap-4">
          <button onClick={loadGame} className="px-6 py-3 bg-blue text-white rounded-xl font-black">Play Again</button>
          <button onClick={onComplete} className="px-6 py-3 bg-gray-bg text-text-main border-2 rounded-xl font-black">Menu</button>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];

  return (
    <div className="flex-1 flex flex-col w-full h-full p-4 md:p-8">
      {/* HUD */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-black text-xl transition-colors ${combo >= 3 ? 'bg-gold/20 text-gold' : 'bg-gray-bg text-text-main'}`}>
            <Zap className={`w-5 h-5 ${combo >= 3 ? 'fill-gold' : ''}`} />
            x{combo}
          </div>
          <div className="text-2xl font-black text-blue">{score}</div>
        </div>

        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-black text-xl ${timeLeft <= 10 ? 'bg-red/20 text-red animate-pulse' : 'bg-gray-bg text-text-main'}`}>
          <Timer className="w-5 h-5" />
          {timeLeft}s
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto w-full">
        <motion.div
          key={currentIndex}
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="w-full"
        >
          <h2 className="text-xl md:text-2xl font-bold text-text-main text-center mb-10 leading-relaxed">
            {currentQ?.text || "Select the correct option to fill in the blank."}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentQ?.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                className="w-full text-left p-4 rounded-xl border-2 border-gray-path bg-white hover:border-blue hover:bg-blue/5 hover:text-blue transition-colors font-bold text-lg active:scale-95 shadow-[0_4px_0_var(--color-gray-path)] active:translate-y-1 active:shadow-none"
              >
                <span className="inline-block w-8 font-black text-text-muted mr-2">
                  {String.fromCharCode(65 + idx)}.
                </span>
                {opt}
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
