import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { db } from '../../data/db';
import type { GrammarPoint } from '../../types';
import { useUserStore } from '../../stores/useUserStore';
import toast from 'react-hot-toast';
import { PenTool, ArrowRight, Lightbulb } from 'lucide-react';
import { playCorrect, playWrong, playTap } from '../../utils/sound';
import { GameShell } from './GameShell';
import { GameHUD } from './GameHUD';
import { GameOverScreen } from './GameOverScreen';
import { GameLoading } from './GameLoading';
import { LevelCompleteScreen } from './LevelCompleteScreen';

const PER_LEVEL = 8;

export function GrammarTyping({ onComplete, difficulty = 'medium' }: { onComplete: () => void; difficulty?: 'easy' | 'medium' | 'hard' }) {
  const [allPoints, setAllPoints] = useState<GrammarPoint[]>([]);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [levelPoints, setLevelPoints] = useState<GrammarPoint[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [score, setScore] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [levelCorrect, setLevelCorrect] = useState(0);
  const [gameState, setGameState] = useState<'loading' | 'playing' | 'gameover' | 'won_round' | 'level_complete'>('loading');

  const activeTrack = useUserStore(s => s.activeTrack);
  const addExp = useUserStore(s => s.addExp);
  const setGameHighScore = useUserStore(s => s.setGameHighScore);
  const addGrammarMastery = useUserStore(s => s.addGrammarMastery);
  const gameHighScores = useUserStore(s => s.gameHighScores);
  const inputRef = useRef<HTMLInputElement>(null);

  const EXP_BY_DIFFICULTY = { easy: 10, medium: 15, hard: 20 };
  const HINT_PENALTY = 5;
  const totalLevels = Math.ceil(allPoints.length / PER_LEVEL);

  useEffect(() => { loadGame(); }, []);
  useEffect(() => { if (gameState === 'playing') inputRef.current?.focus(); }, [gameState, currentIndex]);

  const loadGame = async () => {
    try {
      const track = activeTrack === 'english' ? 'toeic' : 'n2';
      const points = await db.grammar.where('track').equals(track).toArray();
      if (points.length < 5) { toast.error('Not enough grammar points.'); onComplete(); return; }
      const shuffled = [...points].sort(() => 0.5 - Math.random());
      setAllPoints(shuffled);
      setCurrentLevel(1);
      setScore(0);
      startLevel(shuffled, 1);
    } catch (e) { console.error(e); toast.error('Failed to load'); }
  };

  const startLevel = (all: GrammarPoint[], level: number) => {
    const start = (level - 1) * PER_LEVEL;
    const slice = all.slice(start, start + PER_LEVEL);
    setLevelPoints(slice);
    setCurrentIndex(0);
    setLevelCorrect(0);
    setHintsUsed(0);
    setInputValue('');
    setGameState('playing');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (gameState !== 'playing') return;
    const current = levelPoints[currentIndex];
    const guess = inputValue.trim().toLowerCase();
    const correct = current.pattern.toLowerCase();
    if (guess === correct) {
      playCorrect();
      const base = EXP_BY_DIFFICULTY[difficulty];
      const hintPenalty = hintsUsed * HINT_PENALTY;
      setScore(s => s + Math.max(0, base - hintPenalty));
      setLevelCorrect(c => c + 1);
      addGrammarMastery(current.id, 8);
      setGameState('won_round');
    } else {
      playWrong();
      toast.error(`Wrong! Correct: ${current.pattern}`);
      setHintsUsed(0);
      setTimeout(() => nextRound(), 1500);
    }
  };

  const handleHint = () => {
    playTap();
    const current = levelPoints[currentIndex];
    const pattern = current.pattern;
    const revealed = pattern.slice(0, Math.min(hintsUsed + 2, pattern.length));
    toast(`Hint: starts with "${revealed}..."`, { icon: '💡' });
    setHintsUsed(h => h + 1);
  };

  const nextRound = () => {
    if (currentIndex + 1 < levelPoints.length) {
      setCurrentIndex(i => i + 1);
      setInputValue('');
      setHintsUsed(0);
      setGameState('playing');
    } else {
      if (currentLevel < totalLevels) setGameState('level_complete');
      else handleGameOver();
    }
  };

  const nextLevel = () => { const next = currentLevel + 1; setCurrentLevel(next); startLevel(allPoints, next); };

  const handleGameOver = () => {
    setGameState('gameover');
    if (score > 0) { addExp(score); setGameHighScore('grammar-typing', difficulty, score); }
  };

  if (gameState === 'loading') return <GameLoading text="Loading grammar..." />;
  if (gameState === 'gameover') return (<GameShell title="Grammar Typing" icon={<PenTool className="w-5 h-5" />} onBack={onComplete} difficulty={difficulty}><GameOverScreen score={score} expEarned={score} highScore={gameHighScores['grammar-typing']?.[difficulty]} isWin={score > 0} onRestart={loadGame} onMenu={onComplete} /></GameShell>);
  if (gameState === 'level_complete') return (<GameShell title="Grammar Typing" icon={<PenTool className="w-5 h-5" />} onBack={onComplete} difficulty={difficulty}><LevelCompleteScreen currentLevel={currentLevel} totalLevels={totalLevels} correct={levelCorrect} total={levelPoints.length} score={score} onNextLevel={nextLevel} /></GameShell>);

  const current = levelPoints[currentIndex];

  return (
    <GameShell title="Grammar Typing" icon={<PenTool className="w-5 h-5" />} onBack={onComplete} difficulty={difficulty}>
      <GameHUD
        score={score}
        highScore={gameHighScores['grammar-typing']?.[difficulty]}
        progress={(currentIndex + 1) / levelPoints.length}
        progressLabel={`Màn ${currentLevel} - ${currentIndex + 1}/${levelPoints.length}`}
      />

      <div className="flex-1 flex flex-col items-center justify-center max-w-xl mx-auto w-full">
        <motion.div key={currentIndex} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="w-full text-center">
          {/* Meaning */}
          <div className="bg-gradient-to-br from-gray-bg to-bg-hover rounded-2xl p-4 md:p-6 border-2 border-gray-path mb-3 md:mb-4">
            <p className="text-[10px] md:text-xs font-bold text-text-muted uppercase tracking-wider mb-1 md:mb-2">Grammar Pattern</p>
            <p className="text-lg md:text-xl lg:text-2xl font-bold text-text-main">{current?.meaning}</p>
          </div>

          {/* Structure hint */}
          {current?.structure && (
            <div className="bg-purple/5 border-2 border-purple/20 rounded-xl px-3 py-2 md:px-4 md:py-3 mb-4 md:mb-6">
              <p className="text-[10px] md:text-xs font-bold text-purple uppercase tracking-wider mb-0.5 md:mb-1">Structure</p>
              <p className="text-sm md:text-base font-bold text-text-main">{current.structure}</p>
            </div>
          )}

          {/* Input */}
          <form onSubmit={handleSubmit} className="mb-4 md:mb-6">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type the grammar pattern name..."
              className="w-full bg-bg-card border-2 border-gray-path/60 rounded-xl px-4 py-3 md:px-5 md:py-4 font-bold text-base md:text-lg text-text-main text-center focus:outline-none focus:border-purple/60 transition-all placeholder:text-text-muted/50"
              autoComplete="off"
              spellCheck={false}
            />
          </form>

          {/* Action buttons */}
          <div className="flex gap-2 md:gap-3 justify-center">
            <button type="submit" onClick={handleSubmit} className="btn-duo btn-purple px-4 py-2.5 md:px-6 md:py-3 text-xs md:text-sm">
              Check
            </button>
            <button type="button" onClick={handleHint} className="btn-duo btn-gold px-3 py-2.5 md:px-4 md:py-3 text-xs md:text-sm">
              <Lightbulb className="w-3.5 h-3.5 md:w-4 md:h-4 inline mr-1" />
              Hint {hintsUsed > 0 && `(${hintsUsed})`}
            </button>
          </div>
        </motion.div>
      </div>

      {/* Next Round */}
      {gameState === 'won_round' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center mt-3 md:mt-4"
        >
          <button onClick={nextRound} className="btn-duo btn-green px-6 py-3 md:px-8 md:py-4 text-base md:text-lg">
            Next <ArrowRight className="w-4 h-4 md:w-5 md:h-5 inline ml-2" />
          </button>
        </motion.div>
      )}
    </GameShell>
  );
}
