import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../../data/db';
import type { GrammarPoint } from '../../types';
import { useUserStore } from '../../stores/useUserStore';
import toast from 'react-hot-toast';
import { Trophy, ArrowRight, RotateCcw } from 'lucide-react';

interface Chunk {
  id: number;
  text: string;
  isSelected: boolean;
  order: number;
}

export function SentenceBuilder({ onComplete, difficulty = 'medium' }: { onComplete: () => void; difficulty?: 'easy' | 'medium' | 'hard' }) {
  const [deck, setDeck] = useState<GrammarPoint[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [chunks, setChunks] = useState<Chunk[]>([]);
  const [selectedChunks, setSelectedChunks] = useState<Chunk[]>([]);
  const [score, setScore] = useState(0);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [gameState, setGameState] = useState<'loading' | 'playing' | 'gameover' | 'won_round'>('loading');

  const activeTrack = useUserStore(s => s.activeTrack);
  const addExp = useUserStore(s => s.addExp);
  const setGameHighScore = useUserStore(s => s.setGameHighScore);
  const addGrammarMastery = useUserStore(s => s.addGrammarMastery);
  const gameHighScores = useUserStore(s => s.gameHighScores);

  const MIN_STRUCT_LEN = { easy: 2, medium: 3, hard: 4 };
  const EXP_BY_DIFFICULTY = { easy: 8, medium: 12, hard: 15 };

  useEffect(() => {
    loadGame();
  }, []);

  const loadGame = async () => {
    try {
      const track = activeTrack === 'english' ? 'toeic' : 'n2';
      const points = await db.grammar.where('track').equals(track).toArray();
      const withStructure = points.filter(p => p.structure && p.structure.split(/[\s+＋]+/).length >= MIN_STRUCT_LEN[difficulty]);

      if (withStructure.length < 5) {
        toast.error('Not enough grammar points with structures to play.');
        onComplete();
        return;
      }

      const shuffled = [...withStructure].sort(() => 0.5 - Math.random());
      setDeck(shuffled);
      setCurrentIndex(0);
      setScore(0);
      setWrongAttempts(0);
      startRound(shuffled[0]);
    } catch (e) {
      console.error(e);
      toast.error('Failed to load game');
    }
  };

  const splitStructure = (structure: string): string[] => {
    // Split by +, ＋, or spaces, but keep meaningful chunks
    const parts = structure.split(/[+＋]/).map(s => s.trim()).filter(Boolean);
    if (parts.length <= 1) {
      // Fallback: split by spaces
      return structure.split(/\s+/).filter(Boolean);
    }
    return parts;
  };

  const startRound = (point: GrammarPoint) => {
    const rawChunks = splitStructure(point.structure!);
    const scrambled = [...rawChunks].sort(() => 0.5 - Math.random());

    setChunks(scrambled.map((text, id) => ({ id, text, isSelected: false, order: -1 })));
    setSelectedChunks([]);
    setWrongAttempts(0);
    setGameState('playing');
  };

  const handleChunkClick = (chunk: Chunk) => {
    if (gameState !== 'playing' || chunk.isSelected) return;

    const updated = chunks.map(c =>
      c.id === chunk.id ? { ...c, isSelected: true, order: selectedChunks.length } : c
    );
    setChunks(updated);
    const newSelected = [...selectedChunks, chunk];
    setSelectedChunks(newSelected);

    // Check if complete
    if (newSelected.length === chunks.length) {
      const guessed = newSelected.map(c => c.text).join(' + ');
      const correct = deck[currentIndex].structure!;
      const isCorrect = guessed.toLowerCase().replace(/\s/g, '') === correct.toLowerCase().replace(/\s/g, '');

      if (isCorrect) {
        const base = EXP_BY_DIFFICULTY[difficulty];
        const penalty = wrongAttempts * 3;
        setScore(s => s + Math.max(0, base - penalty));
        addGrammarMastery(deck[currentIndex].id, 8);
        setGameState('won_round');
      } else {
        setWrongAttempts(a => a + 1);
        toast.error(`Sai rồi! Thử lại hoặc xem đáp án.`);
        handleClear();
      }
    }
  };

  const handleClear = () => {
    setChunks(prev => prev.map(c => ({ ...c, isSelected: false, order: -1 })));
    setSelectedChunks([]);
  };

  const nextRound = () => {
    if (currentIndex + 1 < deck.length) {
      setCurrentIndex(i => i + 1);
      startRound(deck[currentIndex + 1]);
    } else {
      handleGameOver();
    }
  };

  const handleGameOver = () => {
    setGameState('gameover');
    setScore(s => {
      if (s > 0) {
        addExp(s);
        setGameHighScore('grammar-builder', difficulty, s);
        toast.success(`Game Over! Earned ${s} EXP`);
      }
      return s;
    });
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
        {gameHighScores['grammar-builder']?.[difficulty] > 0 && (
          <p className="text-sm font-bold text-gold mb-8">Best: {gameHighScores['grammar-builder'][difficulty]}</p>
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

      {/* Grammar Info */}
      <motion.div key={currentIndex} initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="w-full max-w-2xl mb-6">
        <div className="bg-gray-bg rounded-2xl p-5 border-2 border-gray-path">
          <p className="text-xs font-bold text-purple uppercase tracking-wider mb-1">Pattern</p>
          <p className="text-lg font-black text-purple mb-3">{current?.pattern}</p>
          <p className="text-sm font-bold text-text-muted mb-1">Meaning: {current?.meaning}</p>
          <p className="text-sm font-bold text-text-main italic">"{current?.example}"</p>
        </div>
      </motion.div>

      {/* Answer Area */}
      <div className="flex flex-wrap justify-center gap-2 mb-6 min-h-[50px] w-full max-w-2xl p-3 bg-white border-2 border-dashed border-gray-path rounded-xl">
        <AnimatePresence>
          {selectedChunks.map((chunk) => (
            <motion.div
              key={`sel-${chunk.id}`}
              initial={{ scale: 0, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              className="px-4 py-2 bg-purple text-white rounded-lg font-black text-sm"
            >
              {chunk.text}
            </motion.div>
          ))}
        </AnimatePresence>
        {selectedChunks.length === 0 && (
          <p className="text-text-muted font-bold text-sm">Sắp xếp các mảnh thành cấu trúc đúng</p>
        )}
      </div>

      {/* Scrambled Chunks */}
      <div className="flex flex-wrap justify-center gap-3 mb-6 w-full max-w-2xl">
        {chunks.map((chunk) => (
          <motion.button
            key={chunk.id}
            whileHover={!chunk.isSelected ? { scale: 1.05, y: -3 } : {}}
            whileTap={!chunk.isSelected ? { scale: 0.95 } : {}}
            onClick={() => handleChunkClick(chunk)}
            disabled={chunk.isSelected}
            className={`px-5 py-3 rounded-xl font-black text-base transition-all ${
              chunk.isSelected
                ? 'bg-gray-path text-gray-path-dark opacity-40 cursor-not-allowed'
                : 'bg-white border-2 border-purple text-text-main hover:bg-purple/10 cursor-pointer shadow-[0_3px_0_var(--color-purple)] active:translate-y-1 active:shadow-none'
            }`}
          >
            {chunk.text}
          </motion.button>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-3 mt-auto">
        <button onClick={handleClear} className="px-4 py-2.5 bg-gray-bg text-text-muted rounded-xl font-bold text-sm hover:bg-gray-path transition-colors">
          <RotateCcw className="w-4 h-4 inline mr-1" />
          Clear
        </button>
        <button
          onClick={() => {
            toast(`Đáp án: ${deck[currentIndex].structure}`, { icon: '📖', duration: 3000 });
            setWrongAttempts(a => a + 1);
            handleClear();
          }}
          className="px-4 py-2.5 bg-red/10 text-red rounded-xl font-bold text-sm hover:bg-red/20 transition-colors"
        >
          Bỏ qua
        </button>
      </div>

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
