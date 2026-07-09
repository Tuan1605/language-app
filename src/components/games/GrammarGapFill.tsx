import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../../data/db';
import type { GrammarPoint } from '../../types';
import { useUserStore } from '../../stores/useUserStore';
import toast from 'react-hot-toast';
import { BookOpen } from 'lucide-react';
import { playCorrect, playWrong, playCombo, playTimerTick } from '../../utils/sound';
import { GameShell } from './GameShell';
import { GameHUD } from './GameHUD';
import { GameOverScreen } from './GameOverScreen';
import { GameLoading } from './GameLoading';
import { LevelCompleteScreen } from './LevelCompleteScreen';

const PER_LEVEL = 10;

export function GrammarGapFill({ onComplete, difficulty = 'medium' }: { onComplete: () => void; difficulty?: 'easy' | 'medium' | 'hard' }) {
  const [allPoints, setAllPoints] = useState<GrammarPoint[]>([]);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [levelPoints, setLevelPoints] = useState<GrammarPoint[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [options, setOptions] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameState, setGameState] = useState<'loading' | 'playing' | 'answered' | 'gameover' | 'level_complete'>('loading');
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [levelCorrect, setLevelCorrect] = useState(0);

  const activeTrack = useUserStore(s => s.activeTrack);
  const addExp = useUserStore(s => s.addExp);
  const setGameHighScore = useUserStore(s => s.setGameHighScore);
  const addGrammarMastery = useUserStore(s => s.addGrammarMastery);
  const gameHighScores = useUserStore(s => s.gameHighScores);

  const TIMER_BY_DIFFICULTY = { easy: 90, medium: 60, hard: 40 };
  const totalLevels = Math.ceil(allPoints.length / PER_LEVEL);
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
      const key = e.key.toUpperCase();
      const idx = key.charCodeAt(0) - 65;
      if (idx >= 0 && idx < options.length) handleAnswer(options[idx]);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, options]);

  const loadGame = async () => {
    try {
      const track = activeTrack === 'english' ? 'toeic' : 'n2';
      const points = await db.grammar.where('track').equals(track).toArray();
      const withBlank = points.filter(p => p.blankedExample);
      if (withBlank.length < 5) { toast.error('Not enough grammar points.'); onComplete(); return; }
      const shuffled = [...withBlank].sort(() => 0.5 - Math.random());
      setAllPoints(shuffled);
      setCurrentLevel(1);
      setScore(0);
      startLevel(shuffled, 1);
      setGameState('playing');
    } catch (e) {
      console.error(e);
      toast.error('Failed to load game');
    }
  };

  const startLevel = (all: GrammarPoint[], level: number) => {
    const start = (level - 1) * PER_LEVEL;
    const slice = all.slice(start, start + PER_LEVEL);
    setLevelPoints(slice);
    setCurrentIndex(0);
    setCombo(0);
    setLevelCorrect(0);
    setSelectedAnswer(null);
    setTimeLeft(TIMER_BY_DIFFICULTY[difficulty]);
    if (slice.length > 0) generateOptions(slice[0], all);
  };

  const generateOptions = (correct: GrammarPoint, pool: GrammarPoint[]) => {
    const others = pool.filter(p => p.id !== correct.id);
    const distractors = [...others].sort(() => 0.5 - Math.random()).slice(0, 3).map(p => p.pattern);
    setOptions([...distractors, correct.pattern].sort(() => 0.5 - Math.random()));
  };

  function handleAnswer(pattern: string) {
    if (gameState !== 'playing') return;
    const current = levelPoints[currentIndex];
    const correct = pattern === current.pattern;
    setSelectedAnswer(pattern);
    setGameState('answered');
    if (correct) {
      playCorrect();
      const newCombo = combo + 1;
      if (newCombo >= 3) playCombo(newCombo);
      const comboBonus = Math.floor(combo / 3) * 5;
      setScore(s => s + 10 + comboBonus);
      setCombo(newCombo);
      setLevelCorrect(c => c + 1);
      addGrammarMastery(current.id, 5);
    } else { playWrong(); setCombo(0); }
    setTimeout(() => nextQuestion(), 1200);
  }

  const nextQuestion = () => {
    if (currentIndex + 1 < levelPoints.length) {
      setCurrentIndex(i => i + 1);
      setSelectedAnswer(null);
      setGameState('playing');
      generateOptions(levelPoints[currentIndex + 1], allPoints);
    } else {
      if (currentLevel < totalLevels) setGameState('level_complete');
      else finishGame(score);
    }
  };

  const nextLevel = () => {
    const next = currentLevel + 1;
    setCurrentLevel(next);
    startLevel(allPoints, next);
    setGameState('playing');
  };

  const finishGame = (finalScore: number) => {
    setGameState('gameover');
    if (finalScore > 0) { addExp(finalScore); setGameHighScore('grammar-gap', difficulty, finalScore); }
  };

  if (gameState === 'loading') return <GameLoading text="Loading grammar..." />;

  if (gameState === 'gameover') {
    return (
      <GameShell title="Grammar Gap Fill" icon={<BookOpen className="w-5 h-5" />} onBack={onComplete} difficulty={difficulty}>
        <GameOverScreen score={score} expEarned={score} highScore={gameHighScores['grammar-gap']?.[difficulty]} isWin={score > 0} onRestart={loadGame} onMenu={onComplete} />
      </GameShell>
    );
  }

  if (gameState === 'level_complete') {
    return (
      <GameShell title="Grammar Gap Fill" icon={<BookOpen className="w-5 h-5" />} onBack={onComplete} difficulty={difficulty}>
        <LevelCompleteScreen currentLevel={currentLevel} totalLevels={totalLevels} correct={levelCorrect} total={levelPoints.length} score={score} onNextLevel={nextLevel} />
      </GameShell>
    );
  }

  const current = levelPoints[currentIndex];

  return (
    <GameShell title="Grammar Gap Fill" icon={<BookOpen className="w-5 h-5" />} onBack={onComplete} difficulty={difficulty}>
      <GameHUD score={score} combo={combo} timer={timeLeft} highScore={gameHighScores['grammar-gap']?.[difficulty]} progress={(currentIndex + 1) / levelPoints.length} progressLabel={`Màn ${currentLevel} - ${currentIndex + 1}/${levelPoints.length}`} />
      <div className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto w-full">
        <AnimatePresence mode="wait">
          <motion.div key={currentIndex} initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -50, opacity: 0 }} className="w-full">
            <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3 text-center">Chọn ngữ pháp đúng</p>
            <div className="bg-bg-card rounded-xl md:rounded-2xl p-4 md:p-6 border-2 border-gray-path/60 text-center mb-5 md:mb-8">
              <p className="text-base md:text-xl lg:text-2xl font-bold text-text-main leading-relaxed">{current?.blankedExample}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
              {options.map((opt, idx) => {
                const isSelected = selectedAnswer === opt;
                const isCorrectOpt = opt === current?.pattern;
                let btnClass = 'bg-bg-card border-2 border-gray-path/60 hover:border-blue/50 hover:bg-blue/5';
                if (isSelected && isCorrectOpt) btnClass = 'bg-green/5 border-2 border-green/60 text-green';
                else if (isSelected && !isCorrectOpt) btnClass = 'bg-red/5 border-2 border-red/60 text-red animate-shake';
                else if (!isSelected && isCorrectOpt && gameState === 'answered') btnClass = 'bg-green/5 border-2 border-green/60 text-green';
                return (
                  <button key={idx} onClick={() => handleAnswer(opt)} disabled={gameState === 'answered'} className={`w-full text-left p-3 md:p-4 rounded-lg md:rounded-xl transition-all font-bold text-sm md:text-base active:scale-[0.98] ${btnClass}`}>
                    <span className="inline-flex items-center justify-center w-6 h-6 md:w-7 md:h-7 rounded-lg bg-bg-hover font-black text-[10px] md:text-xs text-text-muted mr-2 md:mr-3">{String.fromCharCode(65 + idx)}</span>
                    {opt}
                  </button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </GameShell>
  );
}
