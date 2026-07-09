import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../../data/db';
import type { Flashcard } from '../../types';
import { useUserStore } from '../../stores/useUserStore';
import toast from 'react-hot-toast';
import { Type, Heart, Pause, Play } from 'lucide-react';
import { playCorrect, playWrong, playGameOver, playCombo, playLevelComplete } from '../../utils/sound';
import { GameShell } from './GameShell';
import { GameOverScreen } from './GameOverScreen';
import { GameLoading } from './GameLoading';
import { LevelCompleteScreen } from './LevelCompleteScreen';

const WORDS_PER_LEVEL = 8;

interface FallingWord {
  id: string;
  word: string;
  definition: string;
  xPos: number;
}

export function WordFalling({ onComplete, difficulty = 'medium' }: { onComplete: () => void; difficulty?: 'easy' | 'medium' | 'hard' }) {
  const [deck, setDeck] = useState<Flashcard[]>([]);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [wordsTyped, setWordsTyped] = useState(0);
  const [activeWords, setActiveWords] = useState<FallingWord[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameState, setGameState] = useState<'loading' | 'playing' | 'paused' | 'gameover' | 'level_complete'>('loading');
  const [speed, setSpeed] = useState(10);

  const activeTrack = useUserStore(s => s.activeTrack);
  const addExp = useUserStore(s => s.addExp);
  const setGameHighScore = useUserStore(s => s.setGameHighScore);
  const gameHighScores = useUserStore(s => s.gameHighScores);

  const LIVES_BY_DIFFICULTY = { easy: 5, medium: 3, hard: 2 };
  const SPEED_BY_DIFFICULTY = { easy: 12, medium: 10, hard: 7 };
  const SPAWN_BY_DIFFICULTY = { easy: 4000, medium: 3000, hard: 2000 };
  const totalLevels = Math.ceil(deck.length / WORDS_PER_LEVEL);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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

  useEffect(() => {
    if (gameState !== 'playing' || deck.length === 0) return;
    const interval = setInterval(() => {
      setActiveWords(prev => {
        if (prev.length === 0) {
          const randomCard = deck[Math.floor(Math.random() * deck.length)];
          const newWord: FallingWord = {
            id: Math.random().toString(36).substr(2, 9),
            word: randomCard.word.toLowerCase(),
            definition: randomCard.definition,
            xPos: Math.floor(Math.random() * 60) + 20,
          };
          return [...prev, newWord];
        }
        return prev;
      });
    }, SPAWN_BY_DIFFICULTY[difficulty]);
    return () => clearInterval(interval);
  }, [gameState, deck, difficulty]);

  const loadGame = async () => {
    try {
      const allCards = await db.cards.where('language').equals(activeTrack).toArray();
      if (allCards.length < 10) { toast.error('Need at least 10 flashcards.'); onComplete(); return; }
      const shuffled = allCards.sort(() => 0.5 - Math.random());
      setDeck(shuffled);
      setCurrentLevel(1);
      setScore(0);
      setWordsTyped(0);
      setLives(LIVES_BY_DIFFICULTY[difficulty]);
      setActiveWords([]);
      setSpeed(SPEED_BY_DIFFICULTY[difficulty]);
      setInputValue('');
      setGameState('playing');
    } catch (e) { console.error(e); toast.error('Failed to load'); }
  };

  const spawnWord = () => {
    setDeck(prevDeck => {
      const randomCard = prevDeck[Math.floor(Math.random() * prevDeck.length)];
      const newWord: FallingWord = {
        id: Math.random().toString(36).substr(2, 9),
        word: randomCard.word.toLowerCase(),
        definition: randomCard.definition,
        xPos: Math.floor(Math.random() * 60) + 20, // 20% to 80% for better spacing
      };
      setActiveWords(prev => [...prev, newWord]);
      return prevDeck;
    });
  };

  const togglePause = () => {
    setGameState(prev => prev === 'playing' ? 'paused' : 'playing');
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toLowerCase();
    setInputValue(val);

    const matchedIndex = activeWords.findIndex(w => w.word === val);
    if (matchedIndex !== -1) {
      playCorrect();
      const newActive = [...activeWords];
      newActive.splice(matchedIndex, 1);
      setActiveWords(newActive);
      setInputValue('');
      setScore(s => {
        const newScore = s + 10;
        if (newScore % 50 === 0) setSpeed(sp => Math.max(3, sp - 1));
        return newScore;
      });
      setWordsTyped(prev => {
        const next = prev + 1;
        if (next >= WORDS_PER_LEVEL) {
          if (currentLevel < totalLevels) {
            playLevelComplete();
            setActiveWords([]);
            setGameState('level_complete');
          } else {
            handleGameOver();
          }
        }
        return next;
      });
    }
  };

  const handleWordMissed = (id: string) => {
    setActiveWords(prev => {
      const exists = prev.find(w => w.id === id);
      if (exists) {
        playWrong();
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
    playGameOver();
    setGameState('gameover');
    setScore(s => {
      if (s > 0) {
        const expEarned = Math.floor(s / 2);
        addExp(expEarned);
        setGameHighScore('falling', difficulty, s);
      }
      return s;
    });
  };

  const nextLevel = () => {
    setCurrentLevel(l => l + 1);
    setWordsTyped(0);
    setLives(LIVES_BY_DIFFICULTY[difficulty]);
    setActiveWords([]);
    setSpeed(SPEED_BY_DIFFICULTY[difficulty]);
    setInputValue('');
    setGameState('playing');
  };

  if (gameState === 'loading') return <GameLoading text="Loading cards..." />;

  if (gameState === 'gameover') {
    const expEarned = Math.floor(score / 2);
    return (<GameShell title="Speed Typing" icon={<Type className="w-5 h-5" />} onBack={onComplete} difficulty={difficulty}><GameOverScreen score={score} expEarned={expEarned} highScore={gameHighScores.falling[difficulty]} isWin={false} onRestart={loadGame} onMenu={onComplete} /></GameShell>);
  }

  if (gameState === 'level_complete') {
    return (<GameShell title="Speed Typing" icon={<Type className="w-5 h-5" />} onBack={onComplete} difficulty={difficulty}><LevelCompleteScreen currentLevel={currentLevel} totalLevels={totalLevels} correct={wordsTyped} total={WORDS_PER_LEVEL} score={score} onNextLevel={nextLevel} /></GameShell>);
  }

  return (
    <GameShell title="Speed Typing" icon={<Type className="w-5 h-5" />} onBack={onComplete} difficulty={difficulty}>
      <div className="flex-1 flex flex-col w-full relative -mx-4 md:-mx-6 -mb-4 md:-mb-6" ref={containerRef}>
        {/* HUD */}
        <div className="absolute top-0 left-0 right-0 p-3 md:p-4 flex justify-between items-center z-10 pointer-events-none">
          <div className="flex items-center gap-2">
            <div className="px-3 py-1.5 md:px-4 md:py-2 bg-blue/10 rounded-xl font-black text-xl md:text-2xl text-blue">
              {score}
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <div className="flex gap-0.5 md:gap-1">
              {[...Array(LIVES_BY_DIFFICULTY[difficulty])].map((_, i) => (
                <Heart key={i} className={`w-5 h-5 md:w-6 md:h-6 transition-all ${i < lives ? 'fill-red text-red scale-100' : 'text-gray-path-dark scale-90'}`} />
              ))}
            </div>
            <button
              onClick={togglePause}
              className="pointer-events-auto p-2 md:p-2.5 bg-white/80 rounded-xl border-2 border-gray-path hover:border-blue transition-all hover:shadow-sm"
            >
              {gameState === 'paused' ? <Play className="w-4 h-4 md:w-5 md:h-5 text-blue" /> : <Pause className="w-4 h-4 md:w-5 md:h-5 text-text-muted" />}
            </button>
          </div>
        </div>

        {/* Falling Area */}
        <div className="flex-1 relative overflow-hidden bg-bg-card rounded-t-2xl border-b-2 border-gray-path/60 border-dashed">
          <AnimatePresence>
            {activeWords.map(word => (
              <motion.div
                key={word.id}
                initial={{ y: -60, opacity: 0 }}
                animate={{ y: 500, opacity: 1 }}
                exit={{ opacity: 0, scale: 0.3 }}
                transition={{ duration: speed, ease: "linear" }}
                onAnimationComplete={() => handleWordMissed(word.id)}
                className="absolute px-3 py-2 rounded-lg pointer-events-none"
                style={{
                  left: `${word.xPos}%`,
                  backgroundColor: 'var(--bg-main)',
                  border: '2px solid var(--blue)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                }}
              >
                <div style={{ color: 'var(--text-main)', fontSize: '11px', fontWeight: 700, marginBottom: '2px', maxWidth: '130px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', lineHeight: 1.3 }}>{word.definition}</div>
                <div style={{ color: 'var(--blue)', fontSize: '16px', fontWeight: 900 }}>???</div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Pause Overlay */}
          {gameState === 'paused' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 glass-card flex flex-col items-center justify-center z-20"
            >
              <Pause className="w-12 h-12 md:w-16 md:h-16 text-white mb-3 md:mb-4" />
              <p className="text-lg md:text-xl font-black text-white mb-4 md:mb-6">PAUSED</p>
              <button
                onClick={togglePause}
                className="btn-duo btn-blue px-6 py-3 md:px-8 md:py-4 text-base md:text-lg"
              >
                <Play className="w-4 h-4 md:w-5 md:h-5 inline mr-2" />
                Resume
              </button>
            </motion.div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-3 md:p-4 bg-bg-card rounded-b-2xl">
          <p className="text-[10px] md:text-xs font-bold text-text-muted text-center mb-1.5 md:mb-2">
            Gõ từ tiếng Anh tương ứng với nghĩa đang rơi xuống
          </p>
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInput}
            placeholder="Type the English word here..."
            disabled={gameState === 'paused'}
            className="w-full bg-bg-hover border-2 border-gray-path/60 rounded-xl px-3 py-2.5 md:px-4 md:py-3 font-bold text-text-main focus:outline-none focus:border-blue/60 transition-all text-center text-base md:text-lg disabled:opacity-50"
            autoFocus
          />
        </div>
      </div>
    </GameShell>
  );
}
