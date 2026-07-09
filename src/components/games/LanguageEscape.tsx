import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../../data/db';
import type { Flashcard } from '../../types';
import { useUserStore } from '../../stores/useUserStore';
import toast from 'react-hot-toast';
import { Lock, Key, Clock, ArrowRight, RotateCcw, Eye, EyeOff } from 'lucide-react';
import { GameShell } from './GameShell';
import { GameLoading } from './GameLoading';
import { playCorrect, playWrong, playTap, playTimerTick, playLevelComplete, playCombo } from '../../utils/sound';

// ─── Puzzle Types ───
type PuzzleType = 'fill_blank' | 'context_fill' | 'unscramble' | 'match_def';

interface Puzzle {
  type: PuzzleType;
  prompt: string;
  answer: string;
  hint: string;
  options?: string[];
  correctDisplay?: string;
}

interface Room {
  name: string;
  emoji: string;
  description: string;
  puzzlesNeeded: number;
  timeLimit: number;
  bgGradient: string;
  accentColor: string;
  puzzleTypes: PuzzleType[];
}

const ROOMS: Room[] = [
  { name: 'Phòng Khóa', emoji: '🔒', description: 'Xếp chữ cái thành chìa khóa', puzzlesNeeded: 3, timeLimit: 120,
    bgGradient: 'from-blue/5 to-purple/5', accentColor: 'blue', puzzleTypes: ['unscramble'] },
  { name: 'Thư Viện', emoji: '📚', description: 'Giải mã văn bản cổ', puzzlesNeeded: 4, timeLimit: 100,
    bgGradient: 'from-gold/5 to-orange/5', accentColor: 'gold', puzzleTypes: ['fill_blank', 'context_fill'] },
  { name: 'Hang Động', emoji: '🕯️', description: 'Tìm đường trong bóng tối', puzzlesNeeded: 4, timeLimit: 90,
    bgGradient: 'from-purple/5 to-red/5', accentColor: 'purple', puzzleTypes: ['match_def'] },
  { name: 'Tháp Đồng Hồ', emoji: '🕐', description: 'Đua tốc độ với thời gian', puzzlesNeeded: 5, timeLimit: 75,
    bgGradient: 'from-red/5 to-gold/5', accentColor: 'red', puzzleTypes: ['match_def', 'unscramble'] },
  { name: 'Cổng Cuối', emoji: '🚪', description: 'Thử thách tổng hợp cuối cùng', puzzlesNeeded: 6, timeLimit: 90,
    bgGradient: 'from-green/5 to-blue/5', accentColor: 'green', puzzleTypes: ['fill_blank', 'context_fill', 'unscramble', 'match_def'] },
];

const PUZZLE_TYPE_LABELS: Record<PuzzleType, string> = {
  fill_blank: '📝 Điền Từ',
  context_fill: '💡 Ngữ Cảnh',
  unscramble: '🔀 Xếp Chữ',
  match_def: '🎯 Chọn Đáp Án',
};

// ─── Generate Puzzle ───
function generatePuzzle(card: Flashcard, type: PuzzleType, allCards: Flashcard[]): Puzzle {
  const word = card.word;
  const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  switch (type) {
    case 'fill_blank': {
      const blanked = card.definition.replace(new RegExp(escapedWord, 'gi'), '______');
      return {
        type: 'fill_blank',
        prompt: blanked === card.definition ? `"${card.definition}"\n\nĐiền từ tương ứng:` : blanked,
        answer: word.toLowerCase(),
        hint: `Bắt đầu bằng "${word[0].toUpperCase()}" · ${word.length} ký tự`,
        correctDisplay: word,
      };
    }
    case 'context_fill': {
      if (card.example) {
        const blanked = card.example.replace(new RegExp(escapedWord, 'gi'), '______');
        return {
          type: 'context_fill',
          prompt: blanked !== card.example ? blanked : `______: ${card.definition}`,
          answer: word.toLowerCase(),
          hint: card.definition,
          correctDisplay: card.example,
        };
      }
      return {
        type: 'context_fill',
        prompt: `Nghĩa: "${card.definition}"\n\nĐiền từ vựng:`,
        answer: word.toLowerCase(),
        hint: `${word.length} ký tự, bắt đầu bằng "${word[0]}"`,
        correctDisplay: word,
      };
    }
    case 'unscramble': {
      let scrambled = word.split('').sort(() => 0.5 - Math.random()).join('');
      if (scrambled.toLowerCase() === word.toLowerCase() && word.length > 1) {
        scrambled = word.split('').reverse().join('');
      }
      return {
        type: 'unscramble',
        prompt: `Sắp xếp lại: "${scrambled.toUpperCase()}"`,
        answer: word.toLowerCase(),
        hint: card.definition,
        correctDisplay: word,
      };
    }
    case 'match_def': {
      const distractors = allCards
        .filter(c => c.id !== card.id)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3)
        .map(c => c.word);
      const options = [...distractors, card.word].sort(() => 0.5 - Math.random());
      return {
        type: 'match_def',
        prompt: card.definition,
        answer: word.toLowerCase(),
        hint: `${word.length} ký tự`,
        options,
        correctDisplay: word,
      };
    }
  }
}

// ─── Lock Progress Visual ───
function LockProgress({ solved, total }: { solved: number; total: number }) {
  return (
    <div className="flex items-center justify-center gap-2 my-2">
      <div className="relative">
        <div className="w-10 h-8 bg-gray-path/60 rounded-b-lg border-2 border-gray-path flex items-center justify-center">
          <Key className={`w-4 h-4 transition-all duration-500 ${solved >= total ? 'text-gold' : 'text-text-muted'}`} />
        </div>
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-6 h-4 border-2 border-gray-path rounded-t-full border-b-0" />
      </div>
      <div className="flex gap-1.5 ml-2">
        {[...Array(total)].map((_, i) => (
          <motion.div key={i} initial={false}
            animate={i < solved ? { scale: [1, 1.3, 1] } : {}}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              i < solved ? 'bg-green shadow-[0_0_6px_rgba(72,187,120,0.5)]' : 'bg-gray-path'
            }`} />
        ))}
      </div>
      <span className="text-[10px] font-black text-text-muted ml-1">{solved}/{total}</span>
    </div>
  );
}

// ─── Main Component ───
export function LanguageEscape({ onComplete, difficulty = 'medium' }: { onComplete: () => void; difficulty?: 'easy' | 'medium' | 'hard' }) {
  const [deck, setDeck] = useState<Flashcard[]>([]);
  const [currentRoom, setCurrentRoom] = useState(0);
  const [currentPuzzle, setCurrentPuzzle] = useState<Puzzle | null>(null);
  const [puzzlesSolved, setPuzzlesSolved] = useState(0);
  const [totalSolved, setTotalSolved] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [hintUsedThisPuzzle, setHintUsedThisPuzzle] = useState(false);
  const [gameState, setGameState] = useState<'loading' | 'playing' | 'answered_correct' | 'answered_wrong' | 'room_complete' | 'gameover' | 'escaped'>('loading');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [missedWords, setMissedWords] = useState<{ word: string; definition: string }[]>([]);
  const [totalAnswers, setTotalAnswers] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);

  const activeTrack = useUserStore(s => s.activeTrack);
  const addExp = useUserStore(s => s.addExp);
  const setGameHighScore = useUserStore(s => s.setGameHighScore);
  const inputRef = useRef<HTMLInputElement>(null);
  const scoreRef = useRef(score);
  scoreRef.current = score;

  const room = ROOMS[currentRoom];
  const TIMER_SCALE = { easy: 1.5, medium: 1, hard: 0.7 };

  useEffect(() => { loadGame(); }, [activeTrack]);
  useEffect(() => { inputRef.current?.focus(); }, [gameState, currentPuzzle]);

  // Timer
  useEffect(() => {
    if (gameState !== 'playing' || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timer); playWrong(); setGameState('gameover'); return 0; }
        if (t <= 10) playTimerTick();
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [gameState, timeLeft]);

  const loadGame = async () => {
    try {
      const allCards = await db.cards.where('language').equals(activeTrack).toArray();
      if (allCards.length < 8) { toast.error('Need at least 8 flashcards.'); onComplete(); return; }
      setDeck(allCards.sort(() => 0.5 - Math.random()));
      setCurrentRoom(0); setScore(0); setCombo(0); setTotalSolved(0);
      setMissedWords([]); setTotalAnswers(0); setCorrectAnswers(0);
      startRoom(allCards.sort(() => 0.5 - Math.random()), 0);
    } catch (e) { console.error(e); toast.error('Failed to load'); }
  };

  const startRoom = (cards: Flashcard[], roomIdx: number) => {
    const r = ROOMS[roomIdx];
    setTimeLeft(Math.round(r.timeLimit * TIMER_SCALE[difficulty]));
    setPuzzlesSolved(0);
    generateNewPuzzle(cards, roomIdx);
    setGameState('playing');
  };

  const generateNewPuzzle = (cards: Flashcard[], roomIdx: number) => {
    const r = ROOMS[roomIdx];
    const randomCard = cards[Math.floor(Math.random() * cards.length)];
    const type = r.puzzleTypes[Math.floor(Math.random() * r.puzzleTypes.length)];
    const puzzle = generatePuzzle(randomCard, type, cards);
    setCurrentPuzzle(puzzle);
    setInputValue('');
    setSelectedOption(null);
    setShowHint(false);
    setHintUsedThisPuzzle(false);
  };

  const handleAnswer = useCallback((answer: string) => {
    if (gameState !== 'playing' || !currentPuzzle) return;
    const guess = answer.trim().toLowerCase();
    const correct = guess === currentPuzzle.answer;
    setSelectedOption(answer);
    setTotalAnswers(prev => prev + 1);

    if (correct) {
      playCorrect();
      setCorrectAnswers(prev => prev + 1);
      const newCombo = combo + 1;
      if (newCombo >= 3) playCombo(newCombo);
      setCombo(newCombo);
      const timeBonus = Math.floor(timeLeft / 10);
      const comboBonus = Math.min(newCombo * 2, 20);
      const basePoints = 10 + timeBonus + comboBonus;
      const points = hintUsedThisPuzzle ? Math.max(basePoints - 5, 5) : basePoints;
      setScore(s => s + points);
      setTotalSolved(t => t + 1);
      const newSolved = puzzlesSolved + 1;
      setPuzzlesSolved(newSolved);
      setGameState('answered_correct');

      setTimeout(() => {
        if (newSolved >= room.puzzlesNeeded) {
          playLevelComplete();
          if (currentRoom >= ROOMS.length - 1) {
            setGameState('escaped');
          } else {
            setGameState('room_complete');
          }
        } else {
          generateNewPuzzle(deck, currentRoom);
          setGameState('playing');
        }
      }, 1000);
    } else {
      playWrong();
      setCombo(0);
      setMissedWords(prev => {
        if (!currentPuzzle.correctDisplay) return prev;
        if (prev.find(m => m.word === currentPuzzle.correctDisplay)) return prev;
        return [...prev, { word: currentPuzzle.correctDisplay!, definition: currentPuzzle.type === 'match_def' ? currentPuzzle.prompt : currentPuzzle.hint }];
      });
      setGameState('answered_wrong');

      setTimeout(() => {
        generateNewPuzzle(deck, currentRoom);
        setGameState('playing');
      }, 1800);
    }
  }, [gameState, currentPuzzle, combo, timeLeft, hintUsedThisPuzzle, puzzlesSolved, room, currentRoom, deck]);

  const nextRoom = () => {
    const next = currentRoom + 1;
    setCurrentRoom(next);
    startRoom(deck, next);
  };

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;
  const timeCritical = timeLeft <= 15;
  const accuracy = totalAnswers > 0 ? Math.round((correctAnswers / totalAnswers) * 100) : 0;

  if (gameState === 'loading') return <GameLoading text="Preparing escape rooms..." />;

  // ─── GAME OVER ───
  if (gameState === 'gameover') {
    return (
      <GameShell title="Language Escape" icon={<Lock className="w-5 h-5" />} onBack={onComplete} difficulty={difficulty}>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex-1 flex flex-col items-center justify-center py-6 overflow-y-auto custom-scrollbar">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }}
            className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-red/10 flex items-center justify-center mb-4">
            <Lock className="w-10 h-10 md:w-12 md:h-12 text-red" />
          </motion.div>
          <h2 className="text-2xl md:text-3xl font-black text-text-main mb-2">Time's Up!</h2>
          <p className="text-sm text-text-muted font-bold mb-4">The door remains locked...</p>
          <div className="grid grid-cols-3 gap-3 mb-4 w-full max-w-xs">
            <div className="text-center p-2 bg-bg-hover rounded-xl">
              <p className="text-lg font-black text-blue">{score}</p>
              <p className="text-[9px] font-bold text-text-muted uppercase">Score</p>
            </div>
            <div className="text-center p-2 bg-bg-hover rounded-xl">
              <p className="text-lg font-black text-green">{accuracy}%</p>
              <p className="text-[9px] font-bold text-text-muted uppercase">Accuracy</p>
            </div>
            <div className="text-center p-2 bg-bg-hover rounded-xl">
              <p className="text-lg font-black text-gold">{currentRoom}/{ROOMS.length}</p>
              <p className="text-[9px] font-bold text-text-muted uppercase">Rooms</p>
            </div>
          </div>
          {missedWords.length > 0 && (
            <div className="w-full max-w-xs mb-4">
              <p className="text-[10px] font-black text-red uppercase tracking-wider mb-2 text-center">📖 Từ Cần Ôn Lại</p>
              <div className="space-y-1.5 max-h-28 overflow-y-auto custom-scrollbar">
                {missedWords.map((w, i) => (
                  <div key={i} className="flex justify-between items-center px-3 py-1.5 bg-red/5 border border-red/10 rounded-lg text-xs">
                    <span className="font-black text-text-main">{w.word}</span>
                    <span className="text-text-muted truncate ml-2 text-right max-w-32">{w.definition}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="flex gap-3">
            <button onClick={() => { setScore(0); setCombo(0); setTotalSolved(0); setCurrentRoom(0); setMissedWords([]); setTotalAnswers(0); setCorrectAnswers(0); startRoom(deck, 0); }}
              className="btn-duo btn-blue px-4 py-2.5 text-xs"><RotateCcw className="w-4 h-4 mr-2" />Try Again</button>
            <button onClick={() => { if (score > 0) { addExp(score); setGameHighScore('escape', difficulty, score); } onComplete(); }}
              className="btn-duo btn-outline px-4 py-2.5 text-xs">Menu</button>
          </div>
        </motion.div>
      </GameShell>
    );
  }

  // ─── ESCAPED (VICTORY) ───
  if (gameState === 'escaped') {
    return (
      <GameShell title="Language Escape" icon={<Key className="w-5 h-5" />} onBack={onComplete} difficulty={difficulty}>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex-1 flex flex-col items-center justify-center py-6 overflow-y-auto custom-scrollbar">
          <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', delay: 0.2 }}
            className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gold/10 shadow-[0_0_40px_rgba(237,137,54,0.2)] flex items-center justify-center mb-4">
            <Key className="w-10 h-10 md:w-12 md:h-12 text-gold" />
          </motion.div>
          <h2 className="text-2xl md:text-3xl font-black text-text-main mb-1">Escaped!</h2>
          <p className="text-sm text-text-muted font-bold mb-1">All {ROOMS.length} rooms conquered!</p>
          <p className="text-lg font-black text-gold mb-3">+{score} EXP</p>
          <div className="grid grid-cols-3 gap-3 mb-4 w-full max-w-xs">
            <div className="text-center p-2 bg-bg-hover rounded-xl">
              <p className="text-lg font-black text-blue">{score}</p>
              <p className="text-[9px] font-bold text-text-muted uppercase">Score</p>
            </div>
            <div className="text-center p-2 bg-bg-hover rounded-xl">
              <p className="text-lg font-black text-green">{accuracy}%</p>
              <p className="text-[9px] font-bold text-text-muted uppercase">Accuracy</p>
            </div>
            <div className="text-center p-2 bg-bg-hover rounded-xl">
              <p className="text-lg font-black text-gold">{totalSolved}</p>
              <p className="text-[9px] font-bold text-text-muted uppercase">Puzzles</p>
            </div>
          </div>
          {missedWords.length > 0 && (
            <div className="w-full max-w-xs mb-4">
              <p className="text-[10px] font-black text-gold uppercase tracking-wider mb-2 text-center">📖 Từ Cần Ôn Lại</p>
              <div className="space-y-1.5 max-h-28 overflow-y-auto custom-scrollbar">
                {missedWords.map((w, i) => (
                  <div key={i} className="flex justify-between items-center px-3 py-1.5 bg-gold/5 border border-gold/10 rounded-lg text-xs">
                    <span className="font-black text-text-main">{w.word}</span>
                    <span className="text-text-muted truncate ml-2 text-right max-w-32">{w.definition}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="flex gap-3">
            <button onClick={() => { setScore(0); setCombo(0); setTotalSolved(0); setCurrentRoom(0); setMissedWords([]); setTotalAnswers(0); setCorrectAnswers(0); startRoom(deck, 0); }}
              className="btn-duo btn-blue px-4 py-2.5 text-xs"><RotateCcw className="w-4 h-4 mr-2" />Play Again</button>
            <button onClick={() => { addExp(score); setGameHighScore('escape', difficulty, score); onComplete(); }}
              className="btn-duo btn-outline px-4 py-2.5 text-xs">Menu</button>
          </div>
        </motion.div>
      </GameShell>
    );
  }

  // ─── ROOM COMPLETE ───
  if (gameState === 'room_complete') {
    return (
      <GameShell title="Language Escape" icon={<Key className="w-5 h-5" />} onBack={onComplete} difficulty={difficulty}>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex-1 flex flex-col items-center justify-center py-8">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }}
            className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-green/10 flex items-center justify-center mb-4">
            <motion.div initial={{ rotateY: 0 }} animate={{ rotateY: -90 }} transition={{ delay: 0.5, duration: 0.6 }}
              className="text-4xl">🚪</motion.div>
          </motion.div>
          <h2 className="text-xl md:text-3xl font-black text-text-main mb-2">{room.emoji} {room.name} Cleared!</h2>
          <p className="text-sm text-text-muted font-bold mb-1">Time remaining: {formatTime(timeLeft)}</p>
          <p className="text-xs text-text-muted mb-2">Accuracy: {accuracy}%</p>
          <p className="text-sm font-black text-blue mb-6">Score: {score}</p>
          <div className="flex items-center gap-2 mb-6">
            {ROOMS.map((r, i) => (
              <div key={i} className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm transition-all ${
                i <= currentRoom ? 'bg-green/15 border-2 border-green/30' : 'bg-gray-path/30 border-2 border-gray-path/30'
              }`}>
                {i <= currentRoom ? '✅' : r.emoji}
              </div>
            ))}
          </div>
          <button onClick={nextRoom} className="btn-duo btn-green px-6 md:px-8 py-3 md:py-4 text-sm md:text-lg">
            Next Room <ArrowRight className="w-4 h-4 md:w-5 md:h-5 inline ml-2" />
          </button>
        </motion.div>
      </GameShell>
    );
  }

  // ─── MAIN GAME ───
  return (
    <GameShell title="Language Escape" icon={<Lock className="w-5 h-5" />} onBack={onComplete} difficulty={difficulty}>
      <div className="flex-1 flex flex-col w-full">
        {/* HUD */}
        <div className="flex justify-between items-center mb-2 md:mb-3 px-0.5 gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="px-2.5 py-1 bg-blue/10 rounded-xl font-black text-base md:text-lg text-blue shrink-0">{score}</div>
            {combo >= 2 && (
              <motion.div key={combo} initial={{ scale: 0.5 }} animate={{ scale: 1 }}
                className={`flex items-center gap-0.5 px-2 py-0.5 rounded-full font-black text-[10px] md:text-xs shrink-0 ${
                  combo >= 5 ? 'bg-gold/25 text-gold animate-combo-glow' : 'bg-gold/15 text-gold'
                }`}>x{combo}</motion.div>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            {ROOMS.map((_, i) => (
              <div key={i} className={`w-2 h-2 md:w-2.5 md:h-2.5 rounded-full transition-all ${
                i < currentRoom ? 'bg-green' : i === currentRoom ? 'bg-blue scale-125' : 'bg-gray-path'
              }`} />
            ))}
          </div>
          <motion.div animate={timeCritical ? { scale: [1, 1.05, 1] } : {}}
            transition={{ duration: 0.5, repeat: timeCritical ? Infinity : 0 }}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-xl font-black text-sm md:text-base shrink-0 ${
              timeCritical ? 'bg-red/20 text-red' : 'bg-gray-bg text-text-main'
            }`}>
            <Clock className="w-3.5 h-3.5 md:w-4 md:h-4" />
            {formatTime(timeLeft)}
          </motion.div>
        </div>

        {/* Room info */}
        <div className="text-center mb-1">
          <p className="text-lg md:text-xl mb-0.5">{room.emoji}</p>
          <p className="text-xs md:text-sm font-black text-text-main">{room.name}</p>
          <p className="text-[9px] text-text-muted italic">{room.description}</p>
        </div>

        <LockProgress solved={puzzlesSolved} total={room.puzzlesNeeded} />

        {/* Puzzle Area */}
        <div className={`flex-1 flex flex-col items-center justify-center rounded-2xl border-2 border-gray-path/40 p-4 md:p-5 bg-gradient-to-br ${room.bgGradient}`}>
          <AnimatePresence mode="wait">
            {currentPuzzle && (
              <motion.div key={`${currentRoom}-${totalSolved}`}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                className="w-full max-w-lg">
                {/* Puzzle type badge */}
                <div className="flex justify-center mb-3">
                  <span className="px-2.5 py-0.5 bg-purple/10 border border-purple/20 rounded-full text-[9px] md:text-[10px] font-black text-purple uppercase tracking-wider">
                    {PUZZLE_TYPE_LABELS[currentPuzzle.type]}
                  </span>
                </div>

                {/* Puzzle prompt */}
                <div className={`bg-bg-card/80 rounded-xl md:rounded-2xl p-4 md:p-6 border-2 text-center mb-4 md:mb-5 transition-all ${
                  gameState === 'answered_correct' ? 'border-green/60 bg-green/5' :
                  gameState === 'answered_wrong' ? 'border-red/60 bg-red/5' : 'border-gray-path/40'
                }`}>
                  <p className="text-base md:text-xl lg:text-2xl font-bold text-text-main leading-relaxed whitespace-pre-line">
                    {currentPuzzle.prompt}
                  </p>
                  {gameState === 'answered_wrong' && currentPuzzle.correctDisplay && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      className="mt-3 pt-3 border-t border-red/20">
                      <p className="text-[10px] font-bold text-red uppercase tracking-wider mb-1">Đáp Án Đúng:</p>
                      <p className="text-lg md:text-xl font-black text-green">{currentPuzzle.correctDisplay}</p>
                    </motion.div>
                  )}
                  {gameState === 'answered_correct' && (
                    <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} className="mt-2">
                      <span className="text-2xl">✅</span>
                    </motion.div>
                  )}
                </div>

                {/* Hint */}
                {gameState === 'playing' && (
                  <>
                    <div className="flex justify-center mb-3">
                      <button onClick={() => { playTap(); setShowHint(!showHint); if (!showHint) setHintUsedThisPuzzle(true); }}
                        className="flex items-center gap-1 px-3 py-1.5 bg-gold/10 border border-gold/20 rounded-full text-[10px] md:text-xs font-bold text-gold hover:bg-gold/15 transition-all">
                        {showHint ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        {showHint ? 'Ẩn Gợi Ý' : 'Gợi Ý'} (-5 pts)
                      </button>
                    </div>
                    <AnimatePresence>
                      {showHint && (
                        <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                          className="text-xs text-gold text-center mb-3 font-bold">{currentPuzzle.hint}</motion.p>
                      )}
                    </AnimatePresence>
                  </>
                )}

                {/* Answer input */}
                {currentPuzzle.type === 'match_def' && currentPuzzle.options ? (
                  <div className="grid grid-cols-2 gap-2 md:gap-3">
                    {currentPuzzle.options.map((opt, idx) => {
                      const isSelected = selectedOption === opt;
                      const isCorrectOpt = opt.toLowerCase() === currentPuzzle.answer;
                      const isAnswered = gameState === 'answered_correct' || gameState === 'answered_wrong';
                      let btnClass = 'bg-bg-card border-2 border-gray-path/60 hover:border-blue/50 hover:bg-blue/5';
                      if (isAnswered) {
                        if (isCorrectOpt) btnClass = 'bg-green/10 border-2 border-green/60 text-green';
                        else if (isSelected && !isCorrectOpt) btnClass = 'bg-red/5 border-2 border-red/60 text-red animate-shake';
                      }
                      return (
                        <button key={idx} onClick={() => handleAnswer(opt)} disabled={isAnswered}
                          className={`w-full text-left p-3 md:p-4 rounded-lg md:rounded-xl transition-all font-bold text-sm md:text-base active:scale-[0.98] ${btnClass}`}>
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-bg-hover font-black text-[10px] md:text-xs text-text-muted mr-2">
                            {String.fromCharCode(65 + idx)}
                          </span>
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <form onSubmit={(e) => { e.preventDefault(); if (inputValue.trim()) handleAnswer(inputValue); }} className="flex gap-2">
                    <input ref={inputRef} type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Nhập đáp án..."
                      disabled={gameState !== 'playing'}
                      className="flex-1 bg-bg-hover border-2 border-gray-path/60 rounded-xl px-3 py-2.5 md:px-4 md:py-3 font-bold text-sm md:text-base text-text-main focus:outline-none focus:border-blue/60 transition-all text-center placeholder:text-text-muted/50 disabled:opacity-50"
                      autoComplete="off" spellCheck={false} />
                    <button type="submit" disabled={gameState !== 'playing' || !inputValue.trim()}
                      className="btn-duo btn-blue px-4 py-2.5 md:px-6 md:py-3 text-xs md:text-sm shrink-0 disabled:opacity-50">
                      <Key className="w-4 h-4 mr-1" />Unlock
                    </button>
                  </form>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </GameShell>
  );
}
