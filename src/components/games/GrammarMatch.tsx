import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { db } from '../../data/db';
import type { GrammarPoint } from '../../types';
import { useUserStore } from '../../stores/useUserStore';
import toast from 'react-hot-toast';
import { Puzzle } from 'lucide-react';
import { playTap, playMatch, playLevelComplete } from '../../utils/sound';
import { GameShell } from './GameShell';
import { GameHUD } from './GameHUD';
import { GameOverScreen } from './GameOverScreen';
import { LevelCompleteScreen } from './LevelCompleteScreen';
import { LevelSelector } from './LevelSelector';
import { GameLoading } from './GameLoading';

interface MatchTile {
  id: string;
  grammarId: string;
  type: 'pattern' | 'meaning';
  text: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export function GrammarMatch({ onComplete }: { onComplete: () => void; }) {
  const [allPoints, setAllPoints] = useState<GrammarPoint[]>([]);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [tiles, setTiles] = useState<MatchTile[]>([]);
  const [flippedIds, setFlippedIds] = useState<string[]>([]);
  const [isLocked, setIsLocked] = useState(false);
  const [matches, setMatches] = useState(0);
  const matchesRef = useRef(0);
  const [isLoading, setIsLoading] = useState(true);
  const [gameState, setGameState] = useState<'loading' | 'ready' | 'playing' | 'gameover' | 'level_complete'>('loading');

  const activeTrack = useUserStore(s => s.activeTrack);
  const updateGameProgress = useUserStore(s => s.updateGameProgress);
  const gameProgress = useUserStore(s => s.gameProgress);
  const currentProgress = gameProgress['grammar-match'] || { highScore: 0, maxLevel: 1 };

  const requiredPairs = Math.min(3 + currentLevel, Math.floor(allPoints.length) || 4);
  const [totalScore, setTotalScore] = useState(0);

  useEffect(() => { matchesRef.current = matches; }, [matches]);

  useEffect(() => { loadGame(); }, []);

  const loadGame = async () => {
    try {
      const track = activeTrack === 'english' ? 'toeic' : 'n2';
      const points = await db.grammar.where('track').equals(track).toArray();
      if (points.length < 6) { toast.error('Not enough grammar points.'); onComplete(); return; }
      const shuffled = [...points].sort(() => 0.5 - Math.random());
      setAllPoints(shuffled);
      setGameState('ready');
      setIsLoading(false);
    } catch (e) { console.error(e); toast.error('Failed to load'); }
  };

  const startGame = (level: number = 1) => {
    setCurrentLevel(level);
    setTotalScore(0);
    startLevel(allPoints, level);
  };

  const startLevel = (all: GrammarPoint[], level: number) => {
    const pairsCount = Math.min(3 + level, all.length);
    const shuffledIds = [...all].sort(() => 0.5 - Math.random());
    const slice = shuffledIds.slice(0, pairsCount);
    const newTiles: MatchTile[] = [];
    slice.forEach(p => {
      newTiles.push({ id: `${p.id}-pattern`, grammarId: p.id, type: 'pattern', text: p.pattern, isFlipped: false, isMatched: false });
      newTiles.push({ id: `${p.id}-meaning`, grammarId: p.id, type: 'meaning', text: p.meaning, isFlipped: false, isMatched: false });
    });
    setTiles(newTiles.sort(() => 0.5 - Math.random()));
    setMatches(0);
    setFlippedIds([]);
    setIsLoading(false);
    setGameState('playing');
  };

  const handleTileClick = (id: string) => {
    if (isLocked) return;
    const tileIndex = tiles.findIndex(t => t.id === id);
    if (tileIndex === -1 || tiles[tileIndex].isFlipped || tiles[tileIndex].isMatched) return;
    playTap();
    const newTiles = [...tiles];
    newTiles[tileIndex].isFlipped = true;
    setTiles(newTiles);
    const newFlippedIds = [...flippedIds, id];
    setFlippedIds(newFlippedIds);
    if (newFlippedIds.length === 2) { setIsLocked(true); checkMatch(newFlippedIds[0], newFlippedIds[1], newTiles); }
  };

  const checkMatch = (id1: string, id2: string, currentTiles: MatchTile[]) => {
    const tile1 = currentTiles.find(t => t.id === id1)!;
    const tile2 = currentTiles.find(t => t.id === id2)!;
    if (tile1.grammarId === tile2.grammarId && tile1.type !== tile2.type) {
      playMatch();
      setTimeout(() => {
        setTiles(prev => prev.map(t => (t.id === id1 || t.id === id2) ? { ...t, isMatched: true } : t));
        setFlippedIds([]);
        setIsLocked(false);
        const newMatches = matchesRef.current + 1;
        setMatches(newMatches);
        if (newMatches === Math.min(3 + currentLevel, allPoints.length)) {
          playLevelComplete();
          const exp = Math.min(3 + currentLevel, allPoints.length) * 15;
          setTotalScore(s => s + exp);
          updateGameProgress('grammar-match', totalScore + exp, currentLevel + 1);
          setGameState('level_complete');
        }
      }, 500);
    } else {
      setTimeout(() => { setTiles(prev => prev.map(t => (t.id === id1 || t.id === id2) ? { ...t, isFlipped: false } : t)); setFlippedIds([]); setIsLocked(false); }, 1000);
    }
  };

  const nextLevel = () => { const next = currentLevel + 1; setCurrentLevel(next); startLevel(allPoints, next); };

  if (isLoading) return <GameLoading text="Loading grammar..." />;
  
  if (gameState === 'ready') return (
    <GameShell title="Grammar Match" icon={<Puzzle className="w-5 h-5" />} onBack={onComplete}>
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center w-full">
          <h2 className="text-2xl font-black text-text-main mb-2">Grammar Match</h2>
          <p className="text-sm font-bold text-text-muted mb-6">Lật thẻ và tìm cặp cấu trúc - ý nghĩa tương ứng!</p>
          <LevelSelector maxLevel={currentProgress.maxLevel} highScore={currentProgress.highScore} onSelect={startGame} />
        </motion.div>
      </div>
    </GameShell>
  );

  if (gameState === 'gameover') {
    return (<GameShell title="Grammar Match" icon={<Puzzle className="w-5 h-5" />} onBack={onComplete}><GameOverScreen score={totalScore} expEarned={totalScore} highScore={currentProgress.highScore} isWin={true} onRestart={() => startGame(currentLevel)} onMenu={onComplete} /></GameShell>);
  }

  if (gameState === 'level_complete') {
    return (<GameShell title="Grammar Match" icon={<Puzzle className="w-5 h-5" />} onBack={onComplete}><LevelCompleteScreen currentLevel={currentLevel} totalLevels={100} correct={matches} total={requiredPairs} score={totalScore} onNextLevel={nextLevel} /></GameShell>);
  }

  return (
    <GameShell title="Grammar Match" icon={<Puzzle className="w-5 h-5" />} onBack={onComplete}>
      <GameHUD score={totalScore} progress={matches / requiredPairs} progressLabel={`Màn ${currentLevel} - ${matches}/${requiredPairs}`} />

      <div className={`grid gap-3 md:gap-4 flex-1 ${tiles.length <= 10 ? 'grid-cols-3 md:grid-cols-4' : 'grid-cols-4 md:grid-cols-5'}`}>
        {tiles.map(tile => (
          <div
            key={tile.id}
            className="relative w-full h-24 md:h-32 cursor-pointer perspective-1000"
            onClick={() => handleTileClick(tile.id)}
          >
            <motion.div
              className="w-full h-full relative transform-style-3d"
              initial={false}
              animate={{ rotateY: tile.isFlipped || tile.isMatched ? 180 : 0 }}
              transition={{ duration: 0.4, type: 'spring', stiffness: 300, damping: 25 }}
            >
              {/* Front */}
              <div className="absolute w-full h-full backface-hidden bg-bg-card border-2 border-gray-path/60 flex items-center justify-center rounded-xl shadow-sm hover:border-purple/50 hover:shadow-md transition-all">
                <span className="text-2xl font-black opacity-25">?</span>
              </div>

              {/* Back */}
              <div
                className={`absolute w-full h-full backface-hidden border-2 flex items-center justify-center p-2 rounded-xl shadow-sm [transform:rotateY(180deg)] transition-all ${
                  tile.isMatched
                    ? 'border-green/60 bg-green/5 animate-match-pop'
                    : tile.type === 'pattern'
                      ? 'border-purple/60 bg-purple/5'
                      : 'border-blue/60 bg-blue/5'
                }`}
              >
                <span className={`text-center font-bold leading-tight ${
                  tile.type === 'pattern'
                    ? 'text-sm md:text-base text-purple font-black'
                    : 'text-xs md:text-sm text-text-main'
                }`}>
                  {tile.text}
                </span>
              </div>
            </motion.div>
          </div>
        ))}
      </div>
    </GameShell>
  );
}
