import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { db } from '../../data/db';
import { useUserStore } from '../../stores/useUserStore';
import toast from 'react-hot-toast';
import { Brain } from 'lucide-react';
import { playTap, playMatch, playLevelComplete } from '../../utils/sound';
import { GameShell } from './GameShell';
import { GameHUD } from './GameHUD';
import { GameOverScreen } from './GameOverScreen';
import { GameLoading } from './GameLoading';
import { LevelCompleteScreen } from './LevelCompleteScreen';
import { LevelSelector } from './LevelSelector';

interface Tile {
  id: string;
  cardId: string;
  type: 'word' | 'definition';
  text: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export function MemoryMatch({ onComplete }: { onComplete: () => void; }) {
  const [allCardIds, setAllCardIds] = useState<string[]>([]);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [flippedIds, setFlippedIds] = useState<string[]>([]);
  const [isLocked, setIsLocked] = useState(false);
  const [matches, setMatches] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [gameState, setGameState] = useState<'loading' | 'ready' | 'playing' | 'gameover' | 'level_complete'>('loading');

  const updateGameProgress = useUserStore(s => s.updateGameProgress);
  const addExp = useUserStore(s => s.addExp);
  const gameProgress = useUserStore(s => s.gameProgress);
  const currentProgress = gameProgress['memory'] || { highScore: 0, maxLevel: 1 };
  const activeTrack = useUserStore(s => s.activeTrack);

  const requiredPairs = Math.min(3 + currentLevel, Math.floor(allCardIds.length / 2) || 4); // Max depends on available cards, starts at 4 pairs (8 tiles)
  const [totalScore, setTotalScore] = useState(0);

  useEffect(() => { loadGame(); }, [activeTrack]);

  const loadGame = async () => {
    setIsLoading(true);
    try {
      const allCards = await db.cards.where('language').equals(activeTrack).toArray();
      if (allCards.length < 6) { toast.error('Not enough flashcards.'); onComplete(); return; }
      const ids = allCards.sort(() => 0.5 - Math.random()).map(c => c.id);
      setAllCardIds(ids);
      setGameState('ready');
    } catch (e) { console.error(e); toast.error('Failed to load'); }
    finally { setIsLoading(false); }
  };

  const startGame = (level: number = 1) => {
    setCurrentLevel(level);
    setTotalScore(0);
    startLevel(allCardIds, level);
  };

  const startLevel = async (ids: string[], level: number) => {
    const pairsCount = Math.min(3 + level, ids.length);
    const shuffledIds = [...ids].sort(() => 0.5 - Math.random());
    const levelIds = shuffledIds.slice(0, pairsCount);
    const cards = await Promise.all(levelIds.map(id => db.cards.get(id)));
    const validCards = cards.filter(Boolean);
    const newTiles: Tile[] = [];
    validCards.forEach(card => {
      newTiles.push({ id: `${card!.id}-word`, cardId: card!.id, type: 'word', text: card!.word, isFlipped: false, isMatched: false });
      newTiles.push({ id: `${card!.id}-def`, cardId: card!.id, type: 'definition', text: card!.definition, isFlipped: false, isMatched: false });
    });
    setTiles(newTiles.sort(() => 0.5 - Math.random()));
    setMatches(0);
    setFlippedIds([]);
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
    if (newFlippedIds.length === 2) {
      setIsLocked(true);
      checkMatch(newFlippedIds[0], newFlippedIds[1], newTiles);
    }
  };

  const checkMatch = (id1: string, id2: string, currentTiles: Tile[]) => {
    const tile1 = currentTiles.find(t => t.id === id1)!;
    const tile2 = currentTiles.find(t => t.id === id2)!;
    if (tile1.cardId === tile2.cardId) {
      playMatch();
      setTimeout(() => {
        setTiles(prev => prev.map(t => (t.id === id1 || t.id === id2) ? { ...t, isMatched: true } : t));
        setFlippedIds([]);
        setIsLocked(false);
        setMatches(prev => {
          const newMatches = prev + 1;
          const targetPairs = Math.min(3 + currentLevel, allCardIds.length);
          if (newMatches === targetPairs) setTimeout(() => handleWin(targetPairs), 0);
          return newMatches;
        });
      }, 500);
    } else {
      setTimeout(() => {
        setTiles(prev => prev.map(t => (t.id === id1 || t.id === id2) ? { ...t, isFlipped: false } : t));
        setFlippedIds([]);
        setIsLocked(false);
      }, 1000);
    }
  };

  const handleWin = (pairs: number) => {
    playLevelComplete();
    const expGained = pairs * 10;
    setTotalScore(s => s + expGained);
    addExp(expGained);
    updateGameProgress('memory', totalScore + expGained, currentLevel + 1);
    setGameState('level_complete');
  };

  const nextLevel = () => { const next = currentLevel + 1; setCurrentLevel(next); startLevel(allCardIds, next); };

  if (isLoading) return <GameLoading text="Loading cards..." />;
  
  if (gameState === 'ready') return (
    <GameShell title="Memory Match" icon={<Brain className="w-5 h-5" />} onBack={onComplete}>
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center w-full">
          <h2 className="text-2xl font-black text-text-main mb-2">Memory Match</h2>
          <p className="text-sm font-bold text-text-muted mb-6">Lật thẻ và tìm cặp từ vựng tương ứng!</p>
          <LevelSelector maxLevel={currentProgress.maxLevel} highScore={currentProgress.highScore} onSelect={startGame} />
        </motion.div>
      </div>
    </GameShell>
  );

  if (gameState === 'gameover') {
    return (<GameShell title="Memory Match" icon={<Brain className="w-5 h-5" />} onBack={onComplete}><GameOverScreen score={totalScore} expEarned={totalScore} highScore={currentProgress.highScore} isWin={true} onRestart={() => startGame(currentLevel)} onMenu={onComplete} /></GameShell>);
  }
  
  if (gameState === 'level_complete') {
    return (<GameShell title="Memory Match" icon={<Brain className="w-5 h-5" />} onBack={onComplete}><LevelCompleteScreen currentLevel={currentLevel} totalLevels={100} correct={matches} total={requiredPairs} score={totalScore} onNextLevel={nextLevel} /></GameShell>);
  }

  const gridClass = tiles.length > 12 ? 'grid-cols-4 md:grid-cols-5' : tiles.length > 8 ? 'grid-cols-3 md:grid-cols-4' : 'grid-cols-2 md:grid-cols-3';

  return (
    <GameShell title="Memory Match" icon={<Brain className="w-5 h-5" />} onBack={onComplete}>
      <GameHUD score={totalScore} progress={matches / requiredPairs} progressLabel={`Màn ${currentLevel} - ${matches}/${requiredPairs}`} />
      <div className={`grid gap-3 md:gap-4 flex-1 ${gridClass}`}>
        {tiles.map(tile => (
          <div key={tile.id} className="relative w-full h-24 md:h-32 cursor-pointer perspective-1000" onClick={() => handleTileClick(tile.id)}>
            <motion.div className="w-full h-full relative transform-style-3d" initial={false} animate={{ rotateY: tile.isFlipped || tile.isMatched ? 180 : 0 }} transition={{ duration: 0.4, type: 'spring', stiffness: 300, damping: 25 }}>
              <div className="absolute w-full h-full backface-hidden bg-bg-card border-2 border-gray-path/60 text-blue flex flex-col items-center justify-center rounded-xl shadow-sm hover:border-blue/50 hover:shadow-md transition-all">
                <span className="text-2xl font-black opacity-25">?</span>
              </div>
              <div className={`absolute w-full h-full backface-hidden border-2 flex items-center justify-center p-3 rounded-xl shadow-sm [transform:rotateY(180deg)] transition-all ${tile.isMatched ? 'border-green/60 bg-green/5 animate-match-pop' : tile.type === 'word' ? 'border-blue/60 bg-blue/5' : 'border-blue/60 bg-blue/5'}`}>
                <span className={`text-center font-bold leading-tight ${tile.type === 'definition' ? 'text-[10px] md:text-xs text-text-main' : 'text-sm md:text-lg text-text-main font-black'}`}>{tile.text}</span>
              </div>
            </motion.div>
          </div>
        ))}
      </div>
    </GameShell>
  );
}
