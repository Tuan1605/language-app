import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Question } from '../../types';
import { useGameBase } from '../../hooks/useGameBase';
import { useUserStore } from '../../stores/useUserStore';
import { FileText, ArrowRight, Trophy, Zap } from 'lucide-react';
import { playCorrect, playWrong, playCombo, playTimerTick } from '../../utils/sound';
import { GameShell } from './GameShell';
import { GameHUD } from './GameHUD';
import { GameOverScreen } from './GameOverScreen';
import { GameLoading } from './GameLoading';
import { LevelSelector } from './LevelSelector';

const QUESTIONS_PER_LEVEL = 10;

export function ContextFill({ onComplete }: { onComplete: () => void; }) {
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [levelQuestions, setLevelQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [levelCorrect, setLevelCorrect] = useState(0);

  const { gameState, setGameState, loadQuestions } = useGameBase({ onComplete });
  const updateGameProgress = useUserStore(s => s.updateGameProgress);
  const addExp = useUserStore(s => s.addExp);
  const gameProgress = useUserStore(s => s.gameProgress);
  const currentProgress = gameProgress['context'] || { highScore: 0, maxLevel: 1 };

  const totalLevels = Math.ceil(allQuestions.length / QUESTIONS_PER_LEVEL);
  const scoreRef = useRef(score);
  scoreRef.current = score;

  useEffect(() => { loadGame(); }, []);

  useEffect(() => {
    if (gameState !== 'playing' || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timer); finishGame(scoreRef.current); return 0; }
        if (t <= 10) playTimerTick();
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [gameState, timeLeft]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== 'playing') return;
      const currentQ = levelQuestions[currentIndex];
      if (!currentQ) return;
      const key = e.key.toUpperCase();
      const idx = key.charCodeAt(0) - 65;
      if (idx >= 0 && idx < (currentQ.options?.length ?? 0)) handleAnswer(idx);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, levelQuestions, currentIndex]);

  const finishGame = (finalScore: number) => {
    setGameState('gameover');
    if (finalScore > 0) {
      addExp(finalScore);
      updateGameProgress('context', finalScore, currentLevel);
    }
  };

  const loadGame = async () => {
    const allQs = await loadQuestions();
    const validQs = allQs.filter(q =>
      q.options && q.options.length >= 2 &&
      !q.options.every(opt => /^\([A-D]\)$/.test(opt.trim()))
    );
    if (validQs.length < 5) return;
    const shuffled = validQs.sort(() => 0.5 - Math.random());
    setAllQuestions(shuffled);
    setGameState('ready');
  };

  const startGame = (level: number = 1) => {
    setCurrentLevel(level);
    setScore(0);
    startLevel(allQuestions, level);
    setGameState('playing');
  };

  const startLevel = (allQs: Question[], level: number) => {
    const startIdx = (level - 1) * QUESTIONS_PER_LEVEL;
    const endIdx = Math.min(startIdx + QUESTIONS_PER_LEVEL, allQs.length);
    const levelQs = allQs.slice(startIdx, endIdx);
    setLevelQuestions(levelQs);
    setCurrentIndex(0);
    setCombo(0);
    setLevelCorrect(0);
    setTimeLeft(Math.max(20, 60 - (level - 1) * 5));
  };

  function handleAnswer(optionIndex: number) {
    if (gameState !== 'playing') return;
    const currentQ = levelQuestions[currentIndex];
    const isCorrect = optionIndex === currentQ.correctAnswer;

    if (isCorrect) {
      playCorrect();
      const newCombo = combo + 1;
      if (newCombo >= 3) playCombo(newCombo);
      const comboBonus = Math.floor(combo / 3) * 5;
      const newScore = score + 10 + comboBonus;
      setScore(newScore);
      setCombo(newCombo);
      setLevelCorrect(c => c + 1);

      if (currentIndex + 1 < levelQuestions.length) {
        setCurrentIndex(i => i + 1);
      } else {
        // Level complete
        if (currentLevel < totalLevels) {
          updateGameProgress('context', newScore, currentLevel + 1);
          setGameState('level_complete');
        } else {
          finishGame(newScore);
        }
      }
    } else {
      playWrong();
      setCombo(0);
      setTimeLeft(t => Math.max(0, t - 5));
    }
  }

  const nextLevel = () => {
    const next = currentLevel + 1;
    setCurrentLevel(next);
    startLevel(allQuestions, next);
    setGameState('playing');
  };

  if (gameState === 'loading') return <GameLoading text="Loading questions..." />;

  if (gameState === 'ready') return (
    <GameShell title="Fill in Blanks" icon={<FileText className="w-5 h-5" />} onBack={onComplete}>
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center w-full">
          <h2 className="text-2xl font-black text-text-main mb-2">Fill in Blanks</h2>
          <p className="text-sm font-bold text-text-muted mb-6">Chọn từ thích hợp điền vào chỗ trống</p>
          <LevelSelector maxLevel={currentProgress.maxLevel} highScore={currentProgress.highScore} onSelect={startGame} />
        </motion.div>
      </div>
    </GameShell>
  );

  if (gameState === 'gameover') {
    return (
      <GameShell title="Fill in Blanks" icon={<FileText className="w-5 h-5" />} onBack={onComplete}>
        <GameOverScreen
          score={score}
          expEarned={score}
          highScore={currentProgress.highScore}
          isWin={score > 0}
          onRestart={() => startGame(currentLevel)}
          onMenu={onComplete}
        />
      </GameShell>
    );
  }

  // Level complete screen
  if (gameState === 'level_complete') {
    return (
      <GameShell title="Fill in Blanks" icon={<FileText className="w-5 h-5" />} onBack={onComplete}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex-1 flex flex-col items-center justify-center py-8"
        >
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-green/10 flex items-center justify-center mb-4 md:mb-6">
            <Trophy className="w-10 h-10 md:w-12 md:h-12 text-green" />
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-text-main mb-2">Màn {currentLevel} hoàn thành!</h2>
          <p className="text-sm md:text-base text-text-muted font-bold mb-4">
            Đúng {levelCorrect}/{levelQuestions.length} câu
          </p>
          <div className="flex items-center gap-2 px-4 py-2 bg-green/10 border-2 border-green/20 rounded-full mb-6">
            <Zap className="w-4 h-4 text-green" />
            <span className="font-black text-green text-sm">+{score} điểm tích lũy</span>
          </div>
          <p className="text-xs text-text-muted mb-6">
            Còn {totalLevels - currentLevel} màn nữa
          </p>
          <button onClick={nextLevel} className="btn-duo btn-green px-8 py-4 text-base md:text-lg">
            Màn tiếp theo <ArrowRight className="w-5 h-5 inline ml-2" />
          </button>
        </motion.div>
      </GameShell>
    );
  }

  const currentQ = levelQuestions[currentIndex];

  return (
    <GameShell title="Fill in Blanks" icon={<FileText className="w-5 h-5" />} onBack={onComplete}>
      <GameHUD
        score={score}
        combo={combo}
        timer={timeLeft}
        highScore={currentProgress.highScore}
        progress={(currentIndex + 1) / levelQuestions.length}
        progressLabel={`Màn ${currentLevel} - Câu ${currentIndex + 1}/${levelQuestions.length}`}
      />

      {/* Question */}
      <div className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -50, opacity: 0 }}
            className="w-full"
          >
            {/* Question card */}
            <div className="bg-bg-card rounded-xl md:rounded-2xl p-4 md:p-6 border-2 border-gray-path/60 text-center mb-5 md:mb-8">
              <p className="text-sm md:text-base lg:text-xl font-bold text-text-main leading-relaxed">
                {currentQ?.text || "Select the correct option to fill in the blank."}
              </p>
            </div>

            {/* Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
              {currentQ?.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(idx)}
                  className="w-full text-left p-3 md:p-4 rounded-lg md:rounded-xl border-2 border-gray-path/60 bg-bg-card hover:border-blue/50 hover:bg-blue/5 transition-all font-bold text-sm md:text-base active:scale-[0.98] active:translate-y-[3px] active:shadow-none"
                >
                  <span className="inline-flex items-center justify-center w-6 h-6 md:w-7 md:h-7 rounded-lg bg-bg-hover font-black text-[10px] md:text-xs text-text-muted mr-2 md:mr-3">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  {opt}
                </button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </GameShell>
  );
}
