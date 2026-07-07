import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../../data/db';
import type { Flashcard } from '../../types';
import { useUserStore } from '../../stores/useUserStore';
import toast from 'react-hot-toast';
import { Trophy, Heart, Pause, Play } from 'lucide-react';

interface FallingWord {
  id: string;
  word: string;
  definition: string;
  xPos: number;
}

export function WordFalling({ onComplete, difficulty = 'medium' }: { onComplete: () => void; difficulty?: 'easy' | 'medium' | 'hard' }) {
  const [deck, setDeck] = useState<Flashcard[]>([]);
  const [activeWords, setActiveWords] = useState<FallingWord[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameState, setGameState] = useState<'loading' | 'playing' | 'paused' | 'gameover'>('loading');
  const [speed, setSpeed] = useState(10);

  const activeTrack = useUserStore(s => s.activeTrack);
  const addExp = useUserStore(s => s.addExp);
  const setGameHighScore = useUserStore(s => s.setGameHighScore);
  const gameHighScores = useUserStore(s => s.gameHighScores);

  const LIVES_BY_DIFFICULTY = { easy: 5, medium: 3, hard: 2 };
  const SPEED_BY_DIFFICULTY = { easy: 12, medium: 10, hard: 7 };
  const SPAWN_BY_DIFFICULTY = { easy: 4000, medium: 3000, hard: 2000 };

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-pause on tab hide
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden && gameState === 'playing') {
        setGameState('paused');
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [gameState]);

  useEffect(() => {
    loadGame();
  }, [activeTrack]);

  // Spawn words interval (only when playing, not paused)
  useEffect(() => {
    if (gameState !== 'playing' || deck.length === 0) return;

    const interval = setInterval(() => {
      spawnWord();
    }, SPAWN_BY_DIFFICULTY[difficulty]);

    return () => clearInterval(interval);
  }, [gameState, deck, difficulty]);

  const loadGame = async () => {
    try {
      const allCards = await db.cards.where('language').equals(activeTrack).toArray();
      if (allCards.length < 10) {
        toast.error('Need at least 10 flashcards to play.');
        onComplete();
        return;
      }
      setDeck(allCards);
      setGameState('playing');
      setScore(0);
      setLives(LIVES_BY_DIFFICULTY[difficulty]);
      setActiveWords([]);
      setSpeed(SPEED_BY_DIFFICULTY[difficulty]);
      setInputValue('');
    } catch (e) {
      console.error(e);
      toast.error('Failed to load game');
    }
  };

  const spawnWord = () => {
    setDeck(prevDeck => {
      const randomCard = prevDeck[Math.floor(Math.random() * prevDeck.length)];

      const newWord: FallingWord = {
        id: Math.random().toString(36).substr(2, 9),
        word: randomCard.word.toLowerCase(),
        definition: randomCard.definition,
        xPos: Math.floor(Math.random() * 70) + 10,
      };

      setActiveWords(prev => [...prev, newWord]);
      return prevDeck;
    });
  };

  const togglePause = () => {
    setGameState(prev => prev === 'playing' ? 'paused' : 'playing');
    // Focus input when resuming
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toLowerCase();
    setInputValue(val);

    const matchedIndex = activeWords.findIndex(w => w.word === val);
    if (matchedIndex !== -1) {
      const newActive = [...activeWords];
      newActive.splice(matchedIndex, 1);
      setActiveWords(newActive);
      setInputValue('');
      setScore(s => {
        const newScore = s + 10;
        if (newScore % 50 === 0) {
          setSpeed(sp => Math.max(3, sp - 1));
        }
        return newScore;
      });
    }
  };

  const handleWordMissed = (id: string) => {
    setActiveWords(prev => {
      const exists = prev.find(w => w.id === id);
      if (exists) {
        setLives(l => {
          const newLives = l - 1;
          if (newLives <= 0) {
            setTimeout(() => handleGameOver(), 0);
          }
          return newLives;
        });
        return prev.filter(w => w.id !== id);
      }
      return prev;
    });
  };

  const handleGameOver = () => {
    setGameState('gameover');
    setScore(s => {
      if (s > 0) {
        const expEarned = Math.floor(s / 2);
        addExp(expEarned);
        setGameHighScore('falling', difficulty, s);
        toast.success(`Game Over! Earned ${expEarned} EXP`);
      }
      return s;
    });
  };

  if (gameState === 'loading') {
    return <div className="flex-1 flex items-center justify-center text-text-muted font-bold">Loading...</div>;
  }

  if (gameState === 'gameover') {
    return (
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="w-24 h-24 bg-red/10 rounded-full flex items-center justify-center mb-6">
          <Trophy className="w-12 h-12 text-red" />
        </div>
        <h2 className="text-3xl font-black text-text-main mb-2">Game Over</h2>
        <p className="text-xl font-bold text-text-muted mb-2">Score: {score}</p>
        {gameHighScores.falling[difficulty] > 0 && (
          <p className="text-sm font-bold text-gold mb-8">Best: {gameHighScores.falling[difficulty]}</p>
        )}

        <div className="flex gap-4">
          <button
            onClick={loadGame}
            className="px-6 py-3 bg-blue text-white rounded-xl font-black text-sm uppercase hover:bg-blue-dark active:scale-95 transition-all shadow-sm"
          >
            Play Again
          </button>
          <button
            onClick={onComplete}
            className="px-6 py-3 bg-gray-bg text-text-main border-2 border-gray-path rounded-xl font-black text-sm uppercase hover:bg-gray-path active:scale-95 transition-all"
          >
            Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col w-full h-full relative" ref={containerRef}>
      {/* HUD */}
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10 pointer-events-none">
        <div className="font-black text-2xl text-blue drop-shadow-sm">
          {score}
        </div>
        <div className="flex items-center gap-3">
          <div className="flex gap-1">
            {[...Array(LIVES_BY_DIFFICULTY[difficulty])].map((_, i) => (
              <Heart key={i} className={`w-6 h-6 ${i < lives ? 'fill-red text-red' : 'text-gray-path-dark'}`} />
            ))}
          </div>
          <button
            onClick={togglePause}
            className="pointer-events-auto p-2 bg-white/80 rounded-xl border-2 border-gray-path hover:border-blue transition-colors"
          >
            {gameState === 'paused' ? <Play className="w-5 h-5 text-blue" /> : <Pause className="w-5 h-5 text-text-muted" />}
          </button>
        </div>
      </div>

      {/* Falling Area */}
      <div className="flex-1 relative overflow-hidden bg-gray-bg rounded-t-2xl border-b-2 border-gray-path border-dashed">
        <AnimatePresence>
          {activeWords.map(word => (
            <motion.div
              key={word.id}
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 500, opacity: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: speed, ease: "linear" }}
              onAnimationComplete={() => handleWordMissed(word.id)}
              className="absolute bg-white border-2 border-blue px-4 py-2 rounded-xl shadow-sm pointer-events-none"
              style={{ left: `${word.xPos}%` }}
            >
              <div className="text-xs text-text-muted font-bold mb-1 max-w-[150px] truncate">{word.definition}</div>
              <div className="text-lg font-black text-text-main">???</div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Pause Overlay */}
        {gameState === 'paused' && (
          <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center z-20">
            <Pause className="w-16 h-16 text-white mb-4" />
            <p className="text-xl font-black text-white mb-6">PAUSED</p>
            <button
              onClick={togglePause}
              className="px-8 py-4 bg-blue text-white rounded-2xl font-black text-lg shadow-[0_4px_0_var(--color-blue-dark)] active:translate-y-1 active:shadow-none transition-all"
            >
              <Play className="w-5 h-5 inline mr-2" />
              Resume
            </button>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white rounded-b-2xl">
        <p className="text-xs font-bold text-text-muted text-center mb-2">
          Gõ từ tiếng Anh tương ứng với nghĩa đang rơi xuống
        </p>
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInput}
          placeholder="Type the English word here..."
          disabled={gameState === 'paused'}
          className="w-full bg-gray-bg border-2 border-gray-path rounded-xl px-4 py-3 font-bold text-text-main focus:outline-none focus:border-blue transition-colors text-center text-lg disabled:opacity-50"
          autoFocus
        />
      </div>
    </div>
  );
}
