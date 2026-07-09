import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../../data/db';
import type { Flashcard } from '../../types';
import { useUserStore } from '../../stores/useUserStore';
import toast from 'react-hot-toast';
import { Shuffle, ArrowRight, RotateCcw, Lightbulb } from 'lucide-react';
import { playTap, playCorrect, playWrong, playCombo } from '../../utils/sound';
import { GameShell } from './GameShell';
import { GameHUD } from './GameHUD';
import { GameOverScreen } from './GameOverScreen';
import { GameLoading } from './GameLoading';
import { LevelCompleteScreen } from './LevelCompleteScreen';

const WORDS_PER_LEVEL = 8;

interface ScrambledLetter {
  id: number;
  char: string;
  isSelected: boolean;
  selectedOrder: number;
}

export function WordScramble({ onComplete, difficulty = 'medium' }: { onComplete: () => void; difficulty?: 'easy' | 'medium' | 'hard' }) {
  const [deck, setDeck] = useState<Flashcard[]>([]);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [levelCards, setLevelCards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [letters, setLetters] = useState<ScrambledLetter[]>([]);
  const [selectedLetters, setSelectedLetters] = useState<ScrambledLetter[]>([]);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [levelCorrect, setLevelCorrect] = useState(0);
  const [gameState, setGameState] = useState<'loading' | 'playing' | 'gameover' | 'won_round' | 'level_complete'>('loading');

  const activeTrack = useUserStore(s => s.activeTrack);
  const addExp = useUserStore(s => s.addExp);
  const setGameHighScore = useUserStore(s => s.setGameHighScore);
  const gameHighScores = useUserStore(s => s.gameHighScores);

  const MIN_WORD_LEN = { easy: 3, medium: 4, hard: 5 };
  const EXP_BY_DIFFICULTY = { easy: 8, medium: 10, hard: 15 };
  const totalLevels = Math.ceil(deck.length / WORDS_PER_LEVEL);

  useEffect(() => { loadGame(); }, [activeTrack]);

  const loadGame = async () => {
    try {
      const allCards = await db.cards.where('language').equals(activeTrack).toArray();
      const validCards = allCards.filter(c => /^[a-zA-Z]+$/.test(c.word) && c.word.length >= MIN_WORD_LEN[difficulty]);
      if (validCards.length < 5) { toast.error('Not enough valid flashcards.'); onComplete(); return; }
      const shuffled = validCards.sort(() => 0.5 - Math.random());
      setDeck(shuffled);
      setCurrentLevel(1);
      setScore(0);
      startLevel(shuffled, 1);
    } catch (e) { console.error(e); toast.error('Failed to load game'); }
  };

  const startLevel = (all: Flashcard[], level: number) => {
    const start = (level - 1) * WORDS_PER_LEVEL;
    const slice = all.slice(start, start + WORDS_PER_LEVEL);
    setLevelCards(slice);
    setCurrentIndex(0);
    setStreak(0);
    setLevelCorrect(0);
    startRound(slice[0]);
  };

  const scrambleWord = (word: string): ScrambledLetter[] => {
    const chars = word.toLowerCase().split('');
    const scrambled = [...chars].sort(() => 0.5 - Math.random());
    return scrambled.map((char, id) => ({ id, char, isSelected: false, selectedOrder: -1 }));
  };

  const startRound = (card: Flashcard) => {
    setLetters(scrambleWord(card.word));
    setSelectedLetters([]);
    setGameState('playing');
  };

  const handleLetterClick = (letter: ScrambledLetter) => {
    if (gameState !== 'playing' || letter.isSelected || !deck[currentIndex]) return;
    playTap();
    const updatedLetters = letters.map(l =>
      l.id === letter.id ? { ...l, isSelected: true, selectedOrder: selectedLetters.length } : l
    );
    setLetters(updatedLetters);
    setSelectedLetters(prev => [...prev, letter]);

    if (selectedLetters.length + 1 === deck[currentIndex].word.length) {
      const newSelected = [...selectedLetters, letter];
      const guessedWord = newSelected.map(l => l.char).join('');
      checkAnswer(guessedWord);
    }
  };

  const checkAnswer = (guessed: string) => {
    if (!deck[currentIndex]) return;
    const correct = deck[currentIndex].word.toLowerCase();
    if (guessed === correct) {
      playCorrect();
      const newStreak = streak + 1;
      if (newStreak >= 3) playCombo(newStreak);
      const base = EXP_BY_DIFFICULTY[difficulty];
      const streakBonus = streak >= 3 ? 5 : streak >= 2 ? 3 : 0;
      setScore(s => s + base + streakBonus);
      setStreak(newStreak);
      setLevelCorrect(c => c + 1);
      setGameState('won_round');
    } else {
      playWrong();
      setStreak(0);
      toast.error(`Correct: ${correct}`);
      setTimeout(() => {
        if (currentIndex + 1 < levelCards.length) {
          setCurrentIndex(i => i + 1);
          startRound(levelCards[currentIndex + 1]);
        } else {
          if (currentLevel < totalLevels) setGameState('level_complete');
          else handleGameOver(score);
        }
      }, 1500);
    }
  };

  const handleShuffle = () => {
    if (!deck[currentIndex]) return;
    setLetters(() => scrambleWord(deck[currentIndex].word));
    setSelectedLetters([]);
  };

  const handleClear = () => {
    setLetters(prev => prev.map(l => ({ ...l, isSelected: false, selectedOrder: -1 })));
    setSelectedLetters([]);
  };

  const handleHint = () => {
    if (!deck[currentIndex]) return;
    const currentWord = deck[currentIndex].word.toLowerCase();
    const firstUnselected = currentWord.split('').find((char, i) =>
      !selectedLetters[i] || selectedLetters[i].char !== char
    );
    if (firstUnselected) toast(`Hint: starts with "${currentWord[0].toUpperCase()}"`, { icon: '💡' });
  };

  const nextRound = () => {
    if (currentIndex + 1 < levelCards.length) {
      setCurrentIndex(i => i + 1);
      startRound(levelCards[currentIndex + 1]);
    } else {
      if (currentLevel < totalLevels) setGameState('level_complete');
      else handleGameOver();
    }
  };

  const nextLevel = () => { const next = currentLevel + 1; setCurrentLevel(next); startLevel(deck, next); setGameState('playing'); };

  const handleGameOver = (finalScore?: number) => {
    const s = finalScore ?? score;
    setGameState('gameover');
    if (s > 0) { addExp(s); setGameHighScore('scramble', difficulty, s); }
  };

  if (gameState === 'loading') return <GameLoading text="Loading words..." />;

  if (gameState === 'gameover') {
    return (
      <GameShell title="Word Scramble" icon={<Shuffle className="w-5 h-5" />} onBack={onComplete} difficulty={difficulty}>
        <GameOverScreen score={score} expEarned={score} highScore={gameHighScores.scramble[difficulty]} isWin={score > 0} onRestart={loadGame} onMenu={onComplete} />
      </GameShell>
    );
  }

  if (gameState === 'level_complete') {
    return (
      <GameShell title="Word Scramble" icon={<Shuffle className="w-5 h-5" />} onBack={onComplete} difficulty={difficulty}>
        <LevelCompleteScreen currentLevel={currentLevel} totalLevels={totalLevels} correct={levelCorrect} total={levelCards.length} score={score} onNextLevel={nextLevel} />
      </GameShell>
    );
  }

  const currentCard = levelCards[currentIndex];

  return (
    <GameShell title="Word Scramble" icon={<Shuffle className="w-5 h-5" />} onBack={onComplete} difficulty={difficulty}>
      <GameHUD
        score={score}
        combo={streak >= 2 ? streak : undefined}
        highScore={gameHighScores.scramble[difficulty]}
        progress={(currentIndex + 1) / levelCards.length}
        progressLabel={`Màn ${currentLevel} - ${currentIndex + 1}/${levelCards.length}`}
      />

      {/* Definition */}
      <motion.div
        key={currentIndex}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-lg mx-auto mb-8"
      >
        <div className="bg-gradient-to-br from-gray-bg to-bg-hover rounded-2xl p-6 border-2 border-gray-path text-center">
          <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Definition</p>
          <p className="text-xl md:text-2xl font-bold text-text-main leading-relaxed">
            {currentCard?.definition}
          </p>
        </div>
      </motion.div>

      {/* Selected Letters (Answer Area) */}
      <div className="flex justify-center gap-1.5 md:gap-2 mb-4 md:mb-6 min-h-[50px] md:min-h-[60px]">
        <AnimatePresence>
          {selectedLetters.map((letter) => (
            <motion.div
              key={`selected-${letter.id}`}
              initial={{ scale: 0, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="w-10 h-12 md:w-12 md:h-14 flex items-center justify-center bg-blue/80 text-white rounded-lg md:rounded-xl font-black text-xl md:text-2xl"
            >
              {letter.char}
            </motion.div>
          ))}
        </AnimatePresence>
        {[...Array(Math.max(0, deck[currentIndex]?.word.length - selectedLetters.length))].map((_, i) => (
          <div key={`empty-${i}`} className="w-10 h-12 md:w-12 md:h-14 flex items-center justify-center border-2 border-dashed border-gray-path/60 rounded-lg md:rounded-xl text-text-muted font-bold">
            ?
          </div>
        ))}
      </div>

      {/* Scrambled Letters */}
      <div className="flex flex-wrap justify-center gap-1.5 md:gap-2.5 mb-4 md:mb-6">
        {letters.map((letter) => (
          <motion.button
            key={letter.id}
            whileHover={!letter.isSelected ? { scale: 1.08, y: -4 } : {}}
            whileTap={!letter.isSelected ? { scale: 0.95 } : {}}
            onClick={() => handleLetterClick(letter)}
            disabled={letter.isSelected}
            className={`w-10 h-12 md:w-12 md:h-14 flex items-center justify-center rounded-lg md:rounded-xl font-black text-lg md:text-xl transition-all ${
              letter.isSelected
                ? 'bg-bg-hover text-text-muted opacity-30 cursor-not-allowed border-2 border-transparent'
                : 'bg-bg-card border-2 border-blue/50 text-text-main hover:bg-blue/5 cursor-pointer active:translate-y-[3px] active:shadow-none'
            }`}
          >
            {letter.char}
          </motion.button>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-1.5 md:gap-2 justify-center mt-auto">
        <button onClick={handleClear} className="btn-duo px-3 py-2 md:px-4 md:py-2.5 text-[10px] md:text-xs">
          <RotateCcw className="w-3 h-3 md:w-3.5 md:h-3.5 inline mr-1" />
          Clear
        </button>
        <button onClick={handleShuffle} className="btn-duo px-3 py-2 md:px-4 md:py-2.5 text-[10px] md:text-xs">
          <Shuffle className="w-3 h-3 md:w-3.5 md:h-3.5 inline mr-1" />
          Shuffle
        </button>
        <button onClick={handleHint} className="btn-duo btn-gold px-3 py-2 md:px-4 md:py-2.5 text-[10px] md:text-xs">
          <Lightbulb className="w-3 h-3 md:w-3.5 md:h-3.5 inline mr-1" />
          Hint
        </button>
      </div>

      {/* Next Round Button */}
      {gameState === 'won_round' && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={nextRound}
          className="btn-duo btn-green px-6 py-3 md:px-8 md:py-4 text-base md:text-lg mt-3 md:mt-4 mx-auto"
        >
          Next Word <ArrowRight className="w-4 h-4 md:w-5 md:h-5 inline ml-2" />
        </motion.button>
      )}
    </GameShell>
  );
}
