import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import type { Flashcard } from '../../types';
import { useGameBase } from '../../hooks/useGameBase';
import { useUserStore } from '../../stores/useUserStore';
import { Trophy, Heart, ArrowRight } from 'lucide-react';

export function HangmanScramble({ onComplete, difficulty = 'medium' }: { onComplete: () => void; difficulty?: 'easy' | 'medium' | 'hard' }) {
  const [deck, setDeck] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentWord, setCurrentWord] = useState('');
  const [guessedLetters, setGuessedLetters] = useState<Set<string>>(new Set());
  const [lives, setLives] = useState(6);
  const [score, setScore] = useState(0);

  const { gameState, setGameState, loadCards, finishGame } = useGameBase({ gameId: 'hangman', difficulty, onComplete });
  const gameHighScores = useUserStore(s => s.gameHighScores);

  const LIVES_BY_DIFFICULTY = { easy: 8, medium: 6, hard: 4 };

  useEffect(() => {
    loadGame();
  }, []);

  const loadGame = async () => {
    const validCards = await loadCards(c => /^[a-zA-Z\s]+$/.test(c.word));
    if (validCards.length < 5) return;

    const shuffled = validCards.sort(() => 0.5 - Math.random());
    setDeck(shuffled);
    setCurrentIndex(0);
    setScore(0);
    startRound(shuffled[0]);
  };

  const startRound = (card: Flashcard) => {
    setCurrentWord(card.word.toLowerCase());
    setGuessedLetters(new Set([' ']));
    setLives(LIVES_BY_DIFFICULTY[difficulty]);
    setGameState('playing');
  };

  const handleGuess = useCallback((letter: string) => {
    if (gameState !== 'playing' || guessedLetters.has(letter)) return;

    setGuessedLetters(prev => {
      const newSet = new Set(prev);
      newSet.add(letter);
      return newSet;
    });

    if (!currentWord.includes(letter)) {
      setLives(l => {
        const newLives = l - 1;
        if (newLives <= 0) {
          finishGame(score);
        }
        return newLives;
      });
    } else {
      const isWon = currentWord.split('').every(char => guessedLetters.has(char) || char === letter || char === ' ');
      if (isWon) {
        const newScore = score + 10;
        setScore(newScore);
        setGameState('won_round');
      }
    }
  }, [gameState, currentWord, guessedLetters, score]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.length === 1 && /[a-z]/i.test(e.key)) {
        handleGuess(e.key.toLowerCase());
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleGuess]);

  const nextRound = () => {
    if (currentIndex + 1 < deck.length) {
      setCurrentIndex(i => i + 1);
      startRound(deck[currentIndex + 1]);
    } else {
      finishGame(score);
    }
  };

  if (gameState === 'loading') return <div className="flex-1 flex items-center justify-center font-bold">Loading...</div>;

  if (gameState === 'gameover') {
    return (
      <div className="flex-1 flex flex-col items-center justify-center">
        <Trophy className="w-16 h-16 text-gold mb-4" />
        <h2 className="text-3xl font-black text-text-main mb-2">Game Over</h2>
        <p className="text-xl font-bold text-text-muted mb-2">Score: {score}</p>
        {gameHighScores.hangman[difficulty] > 0 && (
          <p className="text-sm font-bold text-gold mb-8">Best: {gameHighScores.hangman[difficulty]}</p>
        )}
        <div className="flex gap-4">
          <button onClick={loadGame} className="px-6 py-3 bg-blue text-white rounded-xl font-black">Play Again</button>
          <button onClick={onComplete} className="px-6 py-3 bg-gray-bg text-text-main border-2 rounded-xl font-black">Menu</button>
        </div>
      </div>
    );
  }

  const currentCard = deck[currentIndex];
  const keyboardRows = [
    ['q','w','e','r','t','y','u','i','o','p'],
    ['a','s','d','f','g','h','j','k','l'],
    ['z','x','c','v','b','n','m']
  ];

  return (
    <div className="flex-1 flex flex-col items-center w-full h-full p-4">
      <div className="w-full flex justify-between items-center mb-6">
        <div className="font-black text-blue">Score: {score}</div>
        <div className="flex gap-1">
          {[...Array(LIVES_BY_DIFFICULTY[difficulty])].map((_, i) => (
            <Heart key={i} className={`w-5 h-5 ${i < lives ? 'fill-red text-red' : 'text-gray-path'}`} />
          ))}
        </div>
      </div>

      <div className="text-center mb-8">
        <p className="text-text-muted font-bold mb-6 text-lg">{currentCard?.definition}</p>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {currentWord.split('').map((char, i) => (
            <div
              key={i}
              className={`w-10 h-12 flex items-center justify-center border-b-4 text-2xl font-black uppercase ${
                char === ' ' ? 'border-transparent w-4' : 'border-blue'
              } ${guessedLetters.has(char) || gameState === 'won_round' ? 'text-text-main' : 'text-transparent'}`}
            >
              {char}
            </div>
          ))}
        </div>
      </div>

      {gameState === 'won_round' ? (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={nextRound}
          className="flex items-center gap-2 px-8 py-4 bg-green text-white rounded-2xl font-black shadow-[0_4px_0_var(--color-green-dark)] active:translate-y-1 active:shadow-none transition-all"
        >
          Next Word <ArrowRight className="w-5 h-5" />
        </motion.button>
      ) : (
        <div className="w-full max-w-lg mt-auto flex flex-col gap-2">
          {keyboardRows.map((row, i) => (
            <div key={i} className="flex justify-center gap-2">
              {row.map(key => {
                const isGuessed = guessedLetters.has(key);
                const isCorrect = isGuessed && currentWord.includes(key);
                const isWrong = isGuessed && !currentWord.includes(key);

                let btnClass = "bg-white border-gray-path text-text-main hover:bg-gray-bg";
                if (isCorrect) btnClass = "bg-green/20 border-green text-green";
                if (isWrong) btnClass = "bg-gray-bg border-transparent text-gray-path-dark opacity-50";

                return (
                  <button
                    key={key}
                    onClick={() => handleGuess(key)}
                    disabled={isGuessed}
                    className={`w-10 h-12 flex items-center justify-center rounded-xl border-2 font-black uppercase text-lg transition-colors ${btnClass}`}
                  >
                    {key}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
