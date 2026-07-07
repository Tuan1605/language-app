import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { db } from '../../data/db';
import type { GrammarPoint } from '../../types';
import { useUserStore } from '../../stores/useUserStore';
import toast from 'react-hot-toast';
import { Trophy, ArrowRight, Lightbulb } from 'lucide-react';

export function GrammarTyping({ onComplete, difficulty = 'medium' }: { onComplete: () => void; difficulty?: 'easy' | 'medium' | 'hard' }) {
  const [deck, setDeck] = useState<GrammarPoint[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [score, setScore] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [gameState, setGameState] = useState<'loading' | 'playing' | 'gameover' | 'won_round'>('loading');

  const activeTrack = useUserStore(s => s.activeTrack);
  const addExp = useUserStore(s => s.addExp);
  const setGameHighScore = useUserStore(s => s.setGameHighScore);
  const addGrammarMastery = useUserStore(s => s.addGrammarMastery);
  const gameHighScores = useUserStore(s => s.gameHighScores);
  const inputRef = useRef<HTMLInputElement>(null);

  const EXP_BY_DIFFICULTY = { easy: 10, medium: 15, hard: 20 };
  const HINT_PENALTY = 5;

  useEffect(() => {
    loadGame();
  }, []);

  useEffect(() => {
    if (gameState === 'playing') {
      inputRef.current?.focus();
    }
  }, [gameState, currentIndex]);

  const loadGame = async () => {
    try {
      const track = activeTrack === 'english' ? 'toeic' : 'n2';
      const points = await db.grammar.where('track').equals(track).toArray();

      if (points.length < 5) {
        toast.error('Not enough grammar points to play.');
        onComplete();
        return;
      }

      const shuffled = [...points].sort(() => 0.5 - Math.random());
      setDeck(shuffled);
      setCurrentIndex(0);
      setScore(0);
      setHintsUsed(0);
      setInputValue('');
      setGameState('playing');
    } catch (e) {
      console.error(e);
      toast.error('Failed to load game');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (gameState !== 'playing') return;

    const current = deck[currentIndex];
    const guess = inputValue.trim().toLowerCase();
    const correct = current.pattern.toLowerCase();

    if (guess === correct) {
      const base = EXP_BY_DIFFICULTY[difficulty];
      const hintPenalty = hintsUsed * HINT_PENALTY;
      setScore(s => s + Math.max(0, base - hintPenalty));
      addGrammarMastery(current.id, 8);
      setGameState('won_round');
    } else {
      toast.error(`Wrong! Correct answer: ${current.pattern}`);
      setHintsUsed(0);
      setTimeout(() => nextRound(), 1500);
    }
  };

  const handleHint = () => {
    const current = deck[currentIndex];
    const pattern = current.pattern;
    const revealLen = Math.min(hintsUsed + 2, pattern.length);
    const revealed = pattern.slice(0, revealLen);
    const remaining = pattern.length - revealLen;
    const masked = revealed + '_'.repeat(remaining);
    toast(`Hint (${revealLen}/${pattern.length} chars): ${masked}`, { icon: '💡', duration: 3000 });
    setHintsUsed(h => h + 1);
  };

  const nextRound = () => {
    if (currentIndex + 1 < deck.length) {
      setCurrentIndex(i => i + 1);
      setInputValue('');
      setHintsUsed(0);
      setGameState('playing');
    } else {
      handleGameOver();
    }
  };

  const handleGameOver = () => {
    setGameState('gameover');
    if (score > 0) {
      addExp(score);
      setGameHighScore('grammar-typing', difficulty, score);
      toast.success(`Game Over! Earned ${score} EXP`);
    }
  };

  if (gameState === 'loading') {
    return <div className="flex-1 flex items-center justify-center font-bold text-text-muted animate-pulse">Loading grammar...</div>;
  }

  if (gameState === 'gameover') {
    return (
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="w-24 h-24 bg-gold/10 rounded-full flex items-center justify-center mb-6">
          <Trophy className="w-12 h-12 text-gold" />
        </div>
        <h2 className="text-3xl font-black text-text-main mb-2">Game Over</h2>
        <p className="text-xl font-bold text-text-muted mb-2">Score: {score}</p>
        {gameHighScores['grammar-typing']?.[difficulty] > 0 && (
          <p className="text-sm font-bold text-gold mb-8">Best: {gameHighScores['grammar-typing'][difficulty]}</p>
        )}
        <div className="flex gap-4">
          <button onClick={loadGame} className="px-6 py-3 bg-blue text-white rounded-xl font-black text-sm uppercase hover:bg-blue-dark active:scale-95 transition-all shadow-sm">Play Again</button>
          <button onClick={onComplete} className="px-6 py-3 bg-gray-bg text-text-main border-2 border-gray-path rounded-xl font-black text-sm uppercase hover:bg-gray-path active:scale-95 transition-all">Menu</button>
        </div>
      </div>
    );
  }

  const current = deck[currentIndex];

  return (
    <div className="flex-1 flex flex-col items-center w-full h-full p-4 md:p-6">
      {/* HUD */}
      <div className="w-full flex justify-between items-center mb-6">
        <div className="px-4 py-2 bg-blue/10 text-blue font-black rounded-xl text-lg">Score: {score}</div>
        <div className="text-sm font-bold text-text-muted">{currentIndex + 1} / {deck.length}</div>
      </div>

      {/* Grammar Clue */}
      <motion.div key={currentIndex} initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="w-full max-w-lg mb-8">
        <div className="bg-gray-bg rounded-2xl p-6 border-2 border-gray-path text-center">
          <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Gõ đúng tên grammar pattern</p>
          <p className="text-lg font-bold text-text-main mb-2">{current?.meaning}</p>
          {current?.structure && (
            <p className="text-sm font-bold text-purple">Structure: {current.structure}</p>
          )}
        </div>
      </motion.div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="w-full max-w-lg mb-6">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type the grammar pattern name..."
            className="flex-1 bg-gray-bg border-2 border-gray-path rounded-xl px-4 py-3 font-bold text-text-main focus:outline-none focus:border-purple transition-colors text-center text-lg"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-purple text-white rounded-xl font-black text-sm uppercase hover:bg-purple/80 active:scale-95 transition-all shadow-sm"
          >
            Check
          </button>
        </div>
      </form>

      {/* Hint */}
      <button
        onClick={handleHint}
        className="px-4 py-2 bg-gold/10 text-gold rounded-xl font-bold text-sm hover:bg-gold/20 transition-colors"
      >
        <Lightbulb className="w-4 h-4 inline mr-1" />
        Hint (-{HINT_PENALTY} EXP)
      </button>

      {/* Next */}
      {gameState === 'won_round' && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={nextRound}
          className="mt-4 px-8 py-4 bg-green text-white rounded-2xl font-black text-lg shadow-[0_4px_0_var(--color-green-dark)] active:translate-y-1 active:shadow-none transition-all"
        >
          Next <ArrowRight className="w-5 h-5 inline ml-2" />
        </motion.button>
      )}
    </div>
  );
}
