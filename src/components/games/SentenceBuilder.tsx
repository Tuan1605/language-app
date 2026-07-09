import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../../data/db';
import type { GrammarPoint } from '../../types';
import { useUserStore } from '../../stores/useUserStore';
import toast from 'react-hot-toast';
import { Blocks, ArrowRight, RotateCcw } from 'lucide-react';
import { playTap, playCorrect, playWrong } from '../../utils/sound';
import { GameShell } from './GameShell';
import { GameHUD } from './GameHUD';
import { GameOverScreen } from './GameOverScreen';
import { LevelCompleteScreen } from './LevelCompleteScreen';
import { LevelSelector } from './LevelSelector';
import { GameLoading } from './GameLoading';

const PER_LEVEL = 8;

interface Chunk {
  id: number;
  text: string;
  isSelected: boolean;
  order: number;
}

export function SentenceBuilder({ onComplete }: { onComplete: () => void; }) {
  const [allPoints, setAllPoints] = useState<GrammarPoint[]>([]);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [levelPoints, setLevelPoints] = useState<GrammarPoint[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentIndexRef = useRef(0);
  const [chunks, setChunks] = useState<Chunk[]>([]);
  const [selectedChunks, setSelectedChunks] = useState<Chunk[]>([]);
  const [score, setScore] = useState(0);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [levelCorrect, setLevelCorrect] = useState(0);
  const [gameState, setGameState] = useState<'loading' | 'ready' | 'playing' | 'gameover' | 'won_round' | 'level_complete'>('loading');

  const activeTrack = useUserStore(s => s.activeTrack);
  const addExp = useUserStore(s => s.addExp);
  const addGrammarMastery = useUserStore(s => s.addGrammarMastery);
  const updateGameProgress = useUserStore(s => s.updateGameProgress);
  const gameProgress = useUserStore(s => s.gameProgress);
  const currentProgress = gameProgress['grammar-builder'] || { highScore: 0, maxLevel: 1 };

  const totalLevels = Math.ceil(allPoints.length / PER_LEVEL);

  useEffect(() => { currentIndexRef.current = currentIndex; }, [currentIndex]);

  useEffect(() => { loadGame(); }, []);

  const loadGame = async () => {
    try {
      const track = activeTrack === 'english' ? 'toeic' : 'n2';
      const points = await db.grammar.where('track').equals(track).toArray();
      const withStructure = points.filter(p => p.structure && p.structure.split(/[\s+＋]+/).length >= 2);
      if (withStructure.length < 5) { toast.error('Not enough grammar points.'); onComplete(); return; }
      const shuffled = [...withStructure].sort(() => 0.5 - Math.random());
      setAllPoints(shuffled);
      setGameState('ready');
    } catch (e) { console.error(e); toast.error('Failed to load'); }
  };

  const startGame = (level: number = 1) => {
    setCurrentLevel(level);
    setScore(0);
    startLevel(allPoints, level);
  };

  const startLevel = (all: GrammarPoint[], level: number) => {
    const start = (level - 1) * PER_LEVEL;
    const slice = all.slice(start, start + PER_LEVEL);
    setLevelPoints(slice);
    setCurrentIndex(0);
    setLevelCorrect(0);
    startRound(slice[0]);
  };

  const splitStructure = (structure: string): string[] => {
    const parts = structure.split(/[+＋]/).map(s => s.trim()).filter(Boolean);
    if (parts.length <= 1) return structure.split(/\s+/).filter(Boolean);
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
    playTap();
    const updatedChunks = chunks.map(c =>
      c.id === chunk.id ? { ...c, isSelected: true, order: selectedChunks.length } : c
    );
    setChunks(updatedChunks);
    const newSelected = [...selectedChunks, chunk];
    setSelectedChunks(newSelected);

    if (newSelected.length === chunks.length) {
      const idx = currentIndexRef.current;
      const guessed = newSelected.map(c => c.text).join(' + ');
      const correct = levelPoints[idx].structure!;
      if (guessed === correct) {
        playCorrect();
        const base = 12;
        const penalty = wrongAttempts * 3;
        setScore(s => s + Math.max(0, base - penalty));
        addGrammarMastery(levelPoints[idx].id, 6);
        setGameState('won_round');
      } else {
        playWrong();
        setWrongAttempts(w => w + 1);
        toast.error('Wrong order! Try again.');
        setTimeout(() => {
          setChunks(prev => prev.map(c => ({ ...c, isSelected: false, order: -1 })));
          setSelectedChunks([]);
        }, 800);
      }
    }
  };

  const nextRound = () => {
    const idx = currentIndexRef.current;
    if (idx + 1 < levelPoints.length) {
      setCurrentIndex(idx + 1);
      startRound(levelPoints[idx + 1]);
    } else {
      if (currentLevel < totalLevels) {
        updateGameProgress('grammar-builder', score, currentLevel + 1);
        setGameState('level_complete');
      }
      else handleGameOver();
    }
  };

  const nextLevel = () => { const next = currentLevel + 1; setCurrentLevel(next); startLevel(allPoints, next); };

  const handleGameOver = () => {
    setGameState('gameover');
    if (score > 0) { addExp(score); updateGameProgress('grammar-builder', score, currentLevel); }
  };

  if (gameState === 'loading') return <GameLoading text="Loading grammar..." />;

  if (gameState === 'ready') return (
    <GameShell title="Sentence Builder" icon={<Blocks className="w-5 h-5" />} onBack={onComplete}>
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center w-full">
          <h2 className="text-2xl font-black text-text-main mb-2">Sentence Builder</h2>
          <p className="text-sm font-bold text-text-muted mb-6">Sắp xếp các cụm từ để tạo thành cấu trúc ngữ pháp đúng</p>
          <LevelSelector maxLevel={currentProgress.maxLevel} highScore={currentProgress.highScore} onSelect={startGame} />
        </motion.div>
      </div>
    </GameShell>
  );

  if (gameState === 'gameover') return (<GameShell title="Sentence Builder" icon={<Blocks className="w-5 h-5" />} onBack={onComplete}><GameOverScreen score={score} expEarned={score} highScore={currentProgress.highScore} isWin={score > 0} onRestart={() => startGame(currentLevel)} onMenu={onComplete} /></GameShell>);
  if (gameState === 'level_complete') return (<GameShell title="Sentence Builder" icon={<Blocks className="w-5 h-5" />} onBack={onComplete}><LevelCompleteScreen currentLevel={currentLevel} totalLevels={totalLevels} correct={levelCorrect} total={levelPoints.length} score={score} onNextLevel={nextLevel} /></GameShell>);

  const current = levelPoints[currentIndex];

  return (
    <GameShell title="Sentence Builder" icon={<Blocks className="w-5 h-5" />} onBack={onComplete}>
      <GameHUD
        score={score}
        highScore={currentProgress.highScore}
        progress={(currentIndex + 1) / levelPoints.length}
        progressLabel={`Màn ${currentLevel} - ${currentIndex + 1}/${levelPoints.length}`}
      />

      {/* Grammar meaning */}
      <div className="text-center mb-4 md:mb-6">
        <div className="inline-block bg-gradient-to-br from-gray-bg to-bg-hover border-2 border-gray-path rounded-xl md:rounded-2xl px-4 py-3 md:px-6 md:py-4">
          <p className="text-[10px] md:text-xs font-bold text-text-muted uppercase tracking-wider mb-0.5 md:mb-1">Arrange the grammar structure</p>
          <p className="text-sm md:text-lg lg:text-xl font-bold text-text-main">{current?.meaning}</p>
        </div>
      </div>

      {/* Selected chunks (answer area) */}
      <div className="flex flex-wrap justify-center gap-1.5 md:gap-2 mb-4 md:mb-6 min-h-[44px] md:min-h-[56px]">
        <AnimatePresence>
          {selectedChunks.map((chunk) => (
            <motion.div
              key={`selected-${chunk.id}`}
              initial={{ scale: 0, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="px-4 py-2.5 bg-blue text-white rounded-xl font-black text-base shadow-[0_3px_0_var(--color-blue-dark)]"
            >
              {chunk.text}
            </motion.div>
          ))}
        </AnimatePresence>
        {[...Array(Math.max(0, chunks.length - selectedChunks.length))].map((_, i) => (
          <div key={`empty-${i}`} className="px-3 py-2 md:px-4 md:py-2.5 border-2 border-dashed border-gray-path rounded-lg md:rounded-xl text-text-muted font-bold text-sm md:text-base">
            ?
          </div>
        ))}
      </div>

      {/* Available chunks */}
      <div className="flex flex-wrap justify-center gap-1.5 md:gap-2.5 mb-4 md:mb-6">
        {chunks.map((chunk) => (
          <motion.button
            key={chunk.id}
            whileHover={!chunk.isSelected ? { scale: 1.05, y: -3 } : {}}
            whileTap={!chunk.isSelected ? { scale: 0.95 } : {}}
            onClick={() => handleChunkClick(chunk)}
            disabled={chunk.isSelected}
            className={`px-3 py-2 md:px-4 md:py-2.5 rounded-lg md:rounded-xl font-black text-sm md:text-base transition-all ${
              chunk.isSelected
                ? 'bg-bg-hover text-text-muted opacity-30 cursor-not-allowed border-2 border-transparent'
                : 'bg-bg-card border-2 border-purple/50 text-text-main hover:bg-purple/5 cursor-pointer active:translate-y-[3px] active:shadow-none'
            }`}
          >
            {chunk.text}
          </motion.button>
        ))}
      </div>

      {/* Action buttons */}
      <div className="flex gap-1.5 md:gap-2 justify-center mt-auto">
        <button
          onClick={() => { setChunks(prev => prev.map(c => ({ ...c, isSelected: false, order: -1 }))); setSelectedChunks([]); }}
          className="btn-duo px-3 py-2 md:px-4 md:py-2.5 text-[10px] md:text-xs"
        >
          <RotateCcw className="w-3 h-3 md:w-3.5 md:h-3.5 inline mr-1" />
          Clear
        </button>
      </div>

      {/* Next Round */}
      {gameState === 'won_round' && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={nextRound}
          className="btn-duo btn-green px-6 py-3 md:px-8 md:py-4 text-base md:text-lg mt-3 md:mt-4 mx-auto"
        >
          Next <ArrowRight className="w-4 h-4 md:w-5 md:h-5 inline ml-2" />
        </motion.button>
      )}
    </GameShell>
  );
}
