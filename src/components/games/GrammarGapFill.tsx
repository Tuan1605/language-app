import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { db } from '../../data/db';
import type { GrammarPoint } from '../../types';
import { useUserStore } from '../../stores/useUserStore';
import toast from 'react-hot-toast';
import { Trophy, Timer, Zap } from 'lucide-react';

export function GrammarGapFill({ onComplete, difficulty = 'medium' }: { onComplete: () => void; difficulty?: 'easy' | 'medium' | 'hard' }) {
  const [allPoints, setAllPoints] = useState<GrammarPoint[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [options, setOptions] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameState, setGameState] = useState<'loading' | 'playing' | 'answered' | 'gameover'>('loading');
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);


  const activeTrack = useUserStore(s => s.activeTrack);
  const addExp = useUserStore(s => s.addExp);
  const setGameHighScore = useUserStore(s => s.setGameHighScore);
  const addGrammarMastery = useUserStore(s => s.addGrammarMastery);
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
          setScore(s => {
            finishGame(s);
            return s;
          });
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [gameState, timeLeft]);

  // Keyboard shortcuts: A/B/C/D
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== 'playing') return;
      const key = e.key.toUpperCase();
      const idx = key.charCodeAt(0) - 65; // A=0, B=1, C=2, D=3
      if (idx >= 0 && idx < options.length) {
        handleAnswer(options[idx]);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, options, handleAnswer]);

  const loadGame = async () => {
    try {
      const track = activeTrack === 'english' ? 'toeic' : 'n2';
      const points = await db.grammar.where('track').equals(track).toArray();
      const withBlank = points.filter(p => p.blankedExample);

      if (withBlank.length < 10) {
        toast.error('Not enough grammar points with blanks to play.');
        onComplete();
        return;
      }

      const shuffled = [...withBlank].sort(() => 0.5 - Math.random());
      setAllPoints(shuffled);
      setCurrentIndex(0);
      setScore(0);
      setCombo(0);
      setTimeLeft(TIMER_BY_DIFFICULTY[difficulty]);
      setGameState('playing');
      generateOptions(shuffled[0], shuffled);
    } catch (e) {
      console.error(e);
      toast.error('Failed to load game');
    }
  };

  const generateOptions = (correct: GrammarPoint, pool: GrammarPoint[]) => {
    const others = pool.filter(p => p.id !== correct.id);
    const distractors = [...others].sort(() => 0.5 - Math.random()).slice(0, 3).map(p => p.pattern);
    const allOptions = [...distractors, correct.pattern].sort(() => 0.5 - Math.random());
    setOptions(allOptions);
  };

  function handleAnswer(pattern: string) {
    if (gameState !== 'playing') return;

    const current = allPoints[currentIndex];
    const correct = pattern === current.pattern;
    setSelectedAnswer(pattern);
    setGameState('answered');

    if (correct) {
      const comboBonus = Math.floor(combo / 3) * 5;
      const newScore = score + 10 + comboBonus;
      setScore(newScore);
      setCombo(c => c + 1);
      addGrammarMastery(current.id, 5);
    } else {
      setCombo(0);
    }

    setTimeout(() => {
      nextQuestion();
    }, 1200);
  };

  const nextQuestion = () => {
    if (currentIndex + 1 < allPoints.length) {
      setCurrentIndex(i => i + 1);
      setSelectedAnswer(null);
      setGameState('playing');
      generateOptions(allPoints[currentIndex + 1], allPoints);
    } else {
      finishGame(score);
    }
  };

  const finishGame = (finalScore: number) => {
    setGameState('gameover');
    if (finalScore > 0) {
      addExp(finalScore);
      setGameHighScore('grammar-gap', difficulty, finalScore);
      toast.success(`Time's up! Earned ${finalScore} EXP`);
    }
  };

  if (gameState === 'loading') {
    return <div className="flex-1 flex items-center justify-center font-bold text-text-muted animate-pulse">Loading grammar...</div>;
  }

  if (gameState === 'gameover') {
    return (
      <div className="flex-1 flex flex-col items-center justify-center">
        <Trophy className="w-16 h-16 text-gold mb-4" />
        <h2 className="text-3xl font-black text-text-main mb-2">Game Over</h2>
        <p className="text-xl font-bold text-text-muted mb-2">Final Score: {score}</p>
        {gameHighScores['grammar-gap']?.[difficulty] > 0 && (
          <p className="text-sm font-bold text-gold mb-8">Best: {gameHighScores['grammar-gap'][difficulty]}</p>
        )}
        <div className="flex gap-4">
          <button onClick={loadGame} className="px-6 py-3 bg-blue text-white rounded-xl font-black">Play Again</button>
          <button onClick={onComplete} className="px-6 py-3 bg-gray-bg text-text-main border-2 rounded-xl font-black">Menu</button>
        </div>
      </div>
    );
  }

  const current = allPoints[currentIndex];

  return (
    <div className="flex-1 flex flex-col w-full h-full p-4 md:p-8">
      {/* HUD */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
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
        <motion.div key={currentIndex} initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="w-full">
          <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3 text-center">Chọn ngữ pháp đúng để điền vào chỗ trống</p>

          <div className="bg-gray-bg rounded-2xl p-6 border-2 border-gray-path text-center mb-8">
            <p className="text-xl md:text-2xl font-bold text-text-main leading-relaxed">
              {current?.blankedExample}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {options.map((opt, idx) => {
              const isSelected = selectedAnswer === opt;
              const isCorrectOpt = opt === current?.pattern;
              let btnClass = 'bg-white border-gray-path hover:border-blue hover:bg-blue/5';
              if (isSelected && isCorrectOpt) btnClass = 'bg-green/10 border-green text-green';
              else if (isSelected && !isCorrectOpt) btnClass = 'bg-red/10 border-red text-red';
              else if (!isSelected && isCorrectOpt && gameState === 'answered') btnClass = 'bg-green/10 border-green text-green';

              return (
                <button
                  key={idx}
                  onClick={() => handleAnswer(opt)}
                  disabled={gameState === 'answered'}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all font-bold text-lg active:scale-95 ${btnClass}`}
                >
                  <span className="inline-block w-8 font-black text-text-muted mr-2">
                    {String.fromCharCode(65 + idx)}.
                  </span>
                  {opt}
                </button>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
