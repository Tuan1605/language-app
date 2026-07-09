import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Flashcard } from '../../types';
import { useGameBase } from '../../hooks/useGameBase';
import { useUserStore } from '../../stores/useUserStore';
import { HelpCircle, ArrowRight } from 'lucide-react';
import { playLetterReveal, playWrong, playMatch, playGameOver } from '../../utils/sound';
import { GameShell } from './GameShell';
import { GameHUD } from './GameHUD';
import { GameOverScreen } from './GameOverScreen';
import { GameLoading } from './GameLoading';
import { LevelCompleteScreen } from './LevelCompleteScreen';

const WORDS_PER_LEVEL = 5;
const HANGMAN_PARTS = 6;

function HangmanFigure({ wrongCount }: { wrongCount: number }) {
  const parts = [
    <motion.circle key="head" cx="100" cy="50" r="12" stroke="var(--red)" strokeWidth="2.5" fill="none" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 300 }} />,
    <motion.line key="body" x1="100" y1="62" x2="100" y2="105" stroke="var(--red)" strokeWidth="2.5" initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 0.4 }} />,
    <motion.line key="arm-l" x1="100" y1="75" x2="78" y2="95" stroke="var(--red)" strokeWidth="2.5" initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 0.3 }} />,
    <motion.line key="arm-r" x1="100" y1="75" x2="122" y2="95" stroke="var(--red)" strokeWidth="2.5" initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 0.3 }} />,
    <motion.line key="leg-l" x1="100" y1="105" x2="82" y2="135" stroke="var(--red)" strokeWidth="2.5" initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 0.3 }} />,
    <motion.line key="leg-r" x1="100" y1="105" x2="118" y2="135" stroke="var(--red)" strokeWidth="2.5" initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 0.3 }} />,
  ];
  return (
    <div className="flex justify-center mb-3 md:mb-5">
      <svg width="120" height="150" viewBox="0 0 140 155" className="drop-shadow-sm">
        <line x1="20" y1="150" x2="120" y2="150" stroke="var(--gray-path)" strokeWidth="3" strokeLinecap="round" />
        <line x1="40" y1="150" x2="40" y2="15" stroke="var(--gray-path)" strokeWidth="3" strokeLinecap="round" />
        <line x1="40" y1="15" x2="100" y2="15" stroke="var(--gray-path)" strokeWidth="3" strokeLinecap="round" />
        <line x1="100" y1="15" x2="100" y2="38" stroke="var(--gray-path)" strokeWidth="3" strokeLinecap="round" />
        <AnimatePresence>{parts.slice(0, wrongCount)}</AnimatePresence>
      </svg>
    </div>
  );
}

export function HangmanScramble({ onComplete, difficulty = 'medium' }: { onComplete: () => void; difficulty?: 'easy' | 'medium' | 'hard' }) {
  const [deck, setDeck] = useState<Flashcard[]>([]);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [levelCards, setLevelCards] = useState<Flashcard[]>([]);
  const [cardIndex, setCardIndex] = useState(0);
  const [currentWord, setCurrentWord] = useState('');
  const [guessedLetters, setGuessedLetters] = useState<Set<string>>(new Set());
  const [lives, setLives] = useState(HANGMAN_PARTS);
  const [score, setScore] = useState(0);
  const [levelCorrect, setLevelCorrect] = useState(0);
  const [gameState, setGameState] = useState<'loading' | 'playing' | 'won_round' | 'gameover' | 'level_complete'>('loading');

  const { loadCards, finishGame } = useGameBase({ gameId: 'hangman', difficulty, onComplete });
  const gameHighScores = useUserStore(s => s.gameHighScores);

  const totalLevels = Math.ceil(deck.length / WORDS_PER_LEVEL);

  useEffect(() => { loadGame(); }, []);

  const loadGame = async () => {
    const validCards = await loadCards(c => /^[a-zA-Z\s]+$/.test(c.word));
    if (validCards.length < 3) return;
    const shuffled = validCards.sort(() => 0.5 - Math.random());
    setDeck(shuffled);
    setCurrentLevel(1);
    setScore(0);
    startLevel(shuffled, 1);
  };

  const startLevel = (all: Flashcard[], level: number) => {
    const start = (level - 1) * WORDS_PER_LEVEL;
    const slice = all.slice(start, start + WORDS_PER_LEVEL);
    setLevelCards(slice);
    setCardIndex(0);
    setLevelCorrect(0);
    startRound(slice[0]);
  };

  const startRound = (card: Flashcard) => {
    setCurrentWord(card.word.toLowerCase());
    setGuessedLetters(new Set([' ']));
    setLives(HANGMAN_PARTS);
    setGameState('playing');
  };

  const handleGuess = useCallback((letter: string) => {
    if (gameState !== 'playing' || guessedLetters.has(letter)) return;
    setGuessedLetters(prev => new Set([...prev, letter]));
    if (!currentWord.includes(letter)) {
      playWrong();
      setLives(l => { const n = l - 1; if (n <= 0) { playGameOver(); finishGame(score); } return n; });
    } else {
      playLetterReveal();
      const isWon = currentWord.split('').every(c => guessedLetters.has(c) || c === letter || c === ' ');
      if (isWon) {
        playMatch();
        const newScore = score + 10;
        setScore(newScore);
        setLevelCorrect(c => c + 1);
        setGameState('won_round');
      }
    }
  }, [gameState, currentWord, guessedLetters, score]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.length === 1 && /[a-z]/i.test(e.key)) handleGuess(e.key.toLowerCase());
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleGuess]);

  const nextRound = () => {
    if (cardIndex + 1 < levelCards.length) {
      setCardIndex(i => i + 1);
      startRound(levelCards[cardIndex + 1]);
    } else {
      if (currentLevel < totalLevels) setGameState('level_complete');
      else finishGame(score);
    }
  };

  const nextLevel = () => { const next = currentLevel + 1; setCurrentLevel(next); startLevel(deck, next); setGameState('playing'); };

  if (gameState === 'loading') return <GameLoading text="Loading words..." />;

  if (gameState === 'gameover') return (<GameShell title="Hangman" icon={<HelpCircle className="w-5 h-5" />} onBack={onComplete} difficulty={difficulty}><GameOverScreen score={score} expEarned={score} highScore={gameHighScores.hangman[difficulty]} isWin={false} onRestart={loadGame} onMenu={onComplete} /></GameShell>);
  if (gameState === 'level_complete') return (<GameShell title="Hangman" icon={<HelpCircle className="w-5 h-5" />} onBack={onComplete} difficulty={difficulty}><LevelCompleteScreen currentLevel={currentLevel} totalLevels={totalLevels} correct={levelCorrect} total={levelCards.length} score={score} onNextLevel={nextLevel} /></GameShell>);

  const currentCard = levelCards[cardIndex];
  const keyboardRows = [['q','w','e','r','t','y','u','i','o','p'],['a','s','d','f','g','h','j','k','l'],['z','x','c','v','b','n','m']];

  return (
    <GameShell title="Hangman" icon={<HelpCircle className="w-5 h-5" />} onBack={onComplete} difficulty={difficulty}>
      <GameHUD score={score} lives={lives} maxLives={HANGMAN_PARTS} highScore={gameHighScores.hangman[difficulty]} progress={(cardIndex + 1) / levelCards.length} progressLabel={`Màn ${currentLevel} - ${cardIndex + 1}/${levelCards.length}`} />
      <div className="text-center mb-2 md:mb-3">
        <div className="inline-block bg-bg-card border-2 border-gray-path/60 rounded-xl md:rounded-2xl px-4 py-3 md:px-6 md:py-4">
          <p className="text-[10px] md:text-xs font-bold text-text-muted uppercase tracking-wider mb-0.5 md:mb-1">Definition</p>
          <p className="text-sm md:text-lg lg:text-xl font-bold text-text-main">{currentCard?.definition}</p>
        </div>
      </div>
      <HangmanFigure wrongCount={HANGMAN_PARTS - lives} />
      <div className="flex flex-wrap justify-center gap-1.5 md:gap-2 mb-4 md:mb-6">
        {currentWord.split('').map((char, i) => {
          const isRevealed = guessedLetters.has(char) || gameState === 'won_round';
          return (
            <motion.div key={i} initial={isRevealed ? { scale: 1.2 } : false} animate={{ scale: 1 }} className={`w-8 h-10 md:w-10 md:h-12 flex items-center justify-center rounded-lg md:rounded-xl font-black text-xl md:text-2xl uppercase transition-all ${char === ' ' ? 'border-transparent w-3 md:w-4' : isRevealed ? 'border-2 border-green/60 bg-green/5 text-text-main' : 'border-2 border-b-4 border-blue/50 border-b-blue/50 bg-bg-card text-transparent'}`}>
              {isRevealed ? char : ''}
            </motion.div>
          );
        })}
      </div>
      {gameState === 'won_round' ? (
        <motion.button initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} onClick={nextRound} className="btn-duo btn-green px-6 py-3 md:px-8 md:py-4 text-base md:text-lg mx-auto">Next Word <ArrowRight className="w-4 h-4 md:w-5 md:h-5 inline ml-2" /></motion.button>
      ) : (
        <div className="w-full max-w-lg mx-auto mt-auto flex flex-col gap-1 md:gap-2">
          {keyboardRows.map((row, i) => (
            <div key={i} className="flex justify-center gap-1 md:gap-2">
              {row.map(key => {
                const isGuessed = guessedLetters.has(key);
                const isCorrect = isGuessed && currentWord.includes(key);
                const isWrong = isGuessed && !currentWord.includes(key);
                let btnClass = "bg-bg-card border-2 border-gray-path/60 text-text-main hover:bg-bg-hover hover:border-blue/50 transition-all active:translate-y-[3px] active:shadow-none";
                if (isCorrect) btnClass = "bg-green/5 border-2 border-green/60 text-green";
                if (isWrong) btnClass = "bg-bg-hover border-2 border-transparent text-text-muted opacity-40 cursor-not-allowed";
                return (<button key={key} onClick={() => handleGuess(key)} disabled={isGuessed} className={`w-8 h-10 md:w-10 md:h-12 flex items-center justify-center rounded-lg md:rounded-xl font-black uppercase text-base md:text-lg transition-all ${btnClass}`}>{key}</button>);
              })}
            </div>
          ))}
        </div>
      )}
    </GameShell>
  );
}
