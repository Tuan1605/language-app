import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../../data/db';
import type { Flashcard } from '../../types';
import { useUserStore } from '../../stores/useUserStore';
import toast from 'react-hot-toast';
import { Trophy, ArrowRight, Shuffle } from 'lucide-react';

interface ScrambledLetter {
  id: number;
  char: string;
  isSelected: boolean;
  selectedOrder: number;
}

export function WordScramble({ onComplete, difficulty = 'medium' }: { onComplete: () => void; difficulty?: 'easy' | 'medium' | 'hard' }) {
  const [deck, setDeck] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [letters, setLetters] = useState<ScrambledLetter[]>([]);
  const [selectedLetters, setSelectedLetters] = useState<ScrambledLetter[]>([]);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [gameState, setGameState] = useState<'loading' | 'playing' | 'gameover' | 'won_round'>('loading');

  const activeTrack = useUserStore(s => s.activeTrack);
  const addExp = useUserStore(s => s.addExp);
  const setGameHighScore = useUserStore(s => s.setGameHighScore);
  const gameHighScores = useUserStore(s => s.gameHighScores);

  const MIN_WORD_LEN = { easy: 3, medium: 4, hard: 5 };
  const EXP_BY_DIFFICULTY = { easy: 8, medium: 10, hard: 15 };

  useEffect(() => {
    loadGame();
  }, [activeTrack]);

  const loadGame = async () => {
    try {
      const allCards = await db.cards.where('language').equals(activeTrack).toArray();
      const validCards = allCards.filter(c => /^[a-zA-Z]+$/.test(c.word) && c.word.length >= MIN_WORD_LEN[difficulty]);

      if (validCards.length < 5) {
        toast.error('Not enough valid flashcards to play.');
        onComplete();
        return;
      }

      const shuffled = validCards.sort(() => 0.5 - Math.random());
      setDeck(shuffled);
      setCurrentIndex(0);
      setScore(0);
      setStreak(0);
      startRound(shuffled[0]);
    } catch (e) {
      console.error(e);
      toast.error('Failed to load game');
    }
  };

  const scrambleWord = (word: string): ScrambledLetter[] => {
    const chars = word.toLowerCase().split('');
    const scrambled = [...chars].sort(() => 0.5 - Math.random());
    return scrambled.map((char, id) => ({
      id,
      char,
      isSelected: false,
      selectedOrder: -1
    }));
  };

  const startRound = (card: Flashcard) => {
    setLetters(scrambleWord(card.word));
    setSelectedLetters([]);
    setGameState('playing');
  };

  const handleLetterClick = (letter: ScrambledLetter) => {
    if (gameState !== 'playing' || letter.isSelected) return;

    const updatedLetters = letters.map(l =>
      l.id === letter.id ? { ...l, isSelected: true, selectedOrder: selectedLetters.length } : l
    );
    setLetters(updatedLetters);
    setSelectedLetters(prev => [...prev, letter]);

    // Check if word is complete
    if (selectedLetters.length + 1 === deck[currentIndex].word.length) {
      const newSelected = [...selectedLetters, letter];
      const guessedWord = newSelected.map(l => l.char).join('');
      checkAnswer(guessedWord);
    }
  };

  const checkAnswer = (guessed: string) => {
    const correct = deck[currentIndex].word.toLowerCase();
    if (guessed === correct) {
      const base = EXP_BY_DIFFICULTY[difficulty];
      const streakBonus = streak >= 3 ? 5 : streak >= 2 ? 3 : 0;
      setScore(s => s + base + streakBonus);
      setStreak(s => s + 1);
      setGameState('won_round');
    } else {
      setStreak(0);
      toast.error(`Correct answer: ${correct}`);
      setTimeout(() => {
        if (currentIndex + 1 < deck.length) {
          setCurrentIndex(i => i + 1);
          startRound(deck[currentIndex + 1]);
        } else {
          handleGameOver(score);
        }
      }, 1500);
    }
  };

  const handleShuffle = () => {
    setLetters(() => scrambleWord(deck[currentIndex].word));
    setSelectedLetters([]);
  };

  const handleClear = () => {
    setLetters(prev => prev.map(l => ({ ...l, isSelected: false, selectedOrder: -1 })));
    setSelectedLetters([]);
  };

  const handleHint = () => {
    const currentWord = deck[currentIndex].word.toLowerCase();
    const firstUnselected = currentWord.split('').find((char, i) =>
      !selectedLetters[i] || selectedLetters[i].char !== char
    );

    if (firstUnselected) {
      toast(`Hint: starts with "${currentWord[0].toUpperCase()}"`, { icon: '💡' });
    }
  };

  const nextRound = () => {
    if (currentIndex + 1 < deck.length) {
      setCurrentIndex(i => i + 1);
      startRound(deck[currentIndex + 1]);
    } else {
      handleGameOver();
    }
  };

  const handleGameOver = (finalScore?: number) => {
    const s = finalScore ?? score;
    setGameState('gameover');
    if (s > 0) {
      addExp(s);
      setGameHighScore('scramble', difficulty, s);
      toast.success(`Game Over! Earned ${s} EXP`);
    }
  };

  if (gameState === 'loading') {
    return <div className="flex-1 flex items-center justify-center font-bold text-text-muted animate-pulse">Loading...</div>;
  }

  if (gameState === 'gameover') {
    return (
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="w-24 h-24 bg-gold/10 rounded-full flex items-center justify-center mb-6">
          <Trophy className="w-12 h-12 text-gold" />
        </div>
        <h2 className="text-3xl font-black text-text-main mb-2">Excellent!</h2>
        <p className="text-xl font-bold text-text-muted mb-2">Score: {score}</p>
        {gameHighScores.scramble[difficulty] > 0 && (
          <p className="text-sm font-bold text-gold mb-8">Best: {gameHighScores.scramble[difficulty]}</p>
        )}
        <div className="flex gap-4">
          <button onClick={loadGame} className="px-6 py-3 bg-blue text-white rounded-xl font-black text-sm uppercase hover:bg-blue-dark active:scale-95 transition-all shadow-sm">
            Play Again
          </button>
          <button onClick={onComplete} className="px-6 py-3 bg-gray-bg text-text-main border-2 border-gray-path rounded-xl font-black text-sm uppercase hover:bg-gray-path active:scale-95 transition-all">
            Menu
          </button>
        </div>
      </div>
    );
  }

  const currentCard = deck[currentIndex];

  return (
    <div className="flex-1 flex flex-col items-center w-full h-full p-4 md:p-6">
      {/* HUD */}
      <div className="w-full flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-blue/10 text-blue font-black rounded-xl text-lg">
            Score: {score}
          </div>
          {streak >= 2 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="px-3 py-1.5 bg-gold/20 text-gold font-black rounded-full text-sm"
            >
              🔥 x{streak}
            </motion.div>
          )}
        </div>
        <div className="text-sm font-bold text-text-muted">
          {currentIndex + 1} / {deck.length}
        </div>
      </div>

      {/* Definition */}
      <motion.div
        key={currentIndex}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-lg mb-10"
      >
        <div className="bg-gray-bg rounded-2xl p-6 border-2 border-gray-path text-center">
          <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Definition</p>
          <p className="text-xl md:text-2xl font-bold text-text-main leading-relaxed">
            {currentCard?.definition}
          </p>
        </div>
      </motion.div>

      {/* Selected Letters (Answer Area) */}
      <div className="flex justify-center gap-2 mb-8 min-h-[60px]">
        <AnimatePresence>
          {selectedLetters.map((letter) => (
            <motion.div
              key={`selected-${letter.id}`}
              initial={{ scale: 0, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="w-12 h-14 flex items-center justify-center bg-blue text-white rounded-xl font-black text-2xl shadow-sm"
            >
              {letter.char}
            </motion.div>
          ))}
        </AnimatePresence>
        {/* Placeholder slots */}
        {[...Array(Math.max(0, deck[currentIndex]?.word.length - selectedLetters.length))].map((_, i) => (
          <div key={`empty-${i}`} className="w-12 h-14 flex items-center justify-center border-2 border-dashed border-gray-path rounded-xl text-text-muted">
            ?
          </div>
        ))}
      </div>

      {/* Scrambled Letters */}
      <div className="flex flex-wrap justify-center gap-3 mb-6">
        {letters.map((letter) => (
          <motion.button
            key={letter.id}
            whileHover={!letter.isSelected ? { scale: 1.1, y: -4 } : {}}
            whileTap={!letter.isSelected ? { scale: 0.95 } : {}}
            onClick={() => handleLetterClick(letter)}
            disabled={letter.isSelected}
            className={`w-12 h-14 flex items-center justify-center rounded-xl font-black text-xl transition-all ${
              letter.isSelected
                ? 'bg-gray-path text-gray-path-dark opacity-40 cursor-not-allowed'
                : 'bg-white border-2 border-blue text-text-main hover:bg-blue/10 cursor-pointer shadow-[0_4px_0_var(--color-blue)] active:translate-y-1 active:shadow-none'
            }`}
          >
            {letter.char}
          </motion.button>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mt-auto">
        <button
          onClick={handleClear}
          className="px-4 py-2.5 bg-gray-bg text-text-muted rounded-xl font-bold text-sm hover:bg-gray-path transition-colors"
        >
          Clear
        </button>
        <button
          onClick={handleShuffle}
          className="px-4 py-2.5 bg-gray-bg text-text-muted rounded-xl font-bold text-sm hover:bg-gray-path transition-colors"
        >
          <Shuffle className="w-4 h-4 inline mr-1" />
          Shuffle
        </button>
        <button
          onClick={handleHint}
          className="px-4 py-2.5 bg-gold/10 text-gold rounded-xl font-bold text-sm hover:bg-gold/20 transition-colors"
        >
          Hint
        </button>
      </div>

      {/* Next Round Button */}
      {gameState === 'won_round' && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={nextRound}
          className="mt-4 px-8 py-4 bg-green text-white rounded-2xl font-black text-lg shadow-[0_4px_0_var(--color-green-dark)] active:translate-y-1 active:shadow-none transition-all"
        >
          Next Word <ArrowRight className="w-5 h-5 inline ml-2" />
        </motion.button>
      )}
    </div>
  );
}
