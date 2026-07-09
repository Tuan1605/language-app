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

const PAIRS_PER_LEVEL = 6;

interface Tile {
  id: string;
  cardId: string;
  type: 'word' | 'definition';
  text: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export function MemoryMatch({ onComplete, difficulty = 'medium' }: { onComplete: () => void; difficulty?: 'easy' | 'medium' | 'hard' }) {
  const [allCardIds, setAllCardIds] = useState<string[]>([]);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [flippedIds, setFlippedIds] = useState<string[]>([]);
  const [isLocked, setIsLocked] = useState(false);
  const [matches, setMatches] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [gameState, setGameState] = useState<'loading' | 'playing' | 'gameover' | 'level_complete'>('loading');

  const addExp = useUserStore(s => s.addExp);
  const setGameHighScore = useUserStore(s => s.setGameHighScore);
  const gameHighScores = useUserStore(s => s.gameHighScores);
  const activeTrack = useUserStore(s => s.activeTrack);

  const requiredPairs = PAIRS_PER_LEVEL;
  const totalLevels = Math.ceil(allCardIds.length / PAIRS_PER_LEVEL);

  useEffect(() => { loadGame(); }, [activeTrack]);

  const loadGame = async () => {
    setIsLoading(true);
    try {
      const allCards = await db.cards.where('language').equals(activeTrack).toArray();
      if (allCards.length < 6) { toast.error('Not enough flashcards.'); onComplete(); return; }
      const ids = allCards.sort(() => 0.5 - Math.random()).map(c => c.id);
      setAllCardIds(ids);
      setCurrentLevel(1);
      setGameState('playing');
      startLevel(ids, 1);
    } catch (e) { console.error(e); toast.error('Failed to load'); }
    finally { setIsLoading(false); }
  };

  const startLevel = async (ids: string[], level: number) => {
    const start = (level - 1) * PAIRS_PER_LEVEL;
    const levelIds = ids.slice(start, start + PAIRS_PER_LEVEL);
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
          if (newMatches === requiredPairs) setTimeout(() => handleWin(), 0);
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

  const handleWin = () => {
    playLevelComplete();
    const expGained = requiredPairs * 10;
    addExp(expGained);
    setGameHighScore('memory', difficulty, expGained);
    if (currentLevel < totalLevels) setGameState('level_complete');
    else setGameState('gameover');
  };

  const nextLevel = () => { const next = currentLevel + 1; setCurrentLevel(next); startLevel(allCardIds, next); };

  if (isLoading) return <GameLoading text="Loading cards..." />;
  if (gameState === 'gameover') return (<GameShell title="Memory Match" icon={<Brain className="w-5 h-5" />} onBack={onComplete} difficulty={difficulty}><GameOverScreen score={matches * 10} expEarned={matches * 10} highScore={gameHighScores.memory[difficulty]} isWin={true} onRestart={loadGame} onMenu={onComplete} /></GameShell>);
  if (gameState === 'level_complete') return (<GameShell title="Memory Match" icon={<Brain className="w-5 h-5" />} onBack={onComplete} difficulty={difficulty}><LevelCompleteScreen currentLevel={currentLevel} totalLevels={totalLevels} correct={matches} total={requiredPairs} score={matches * 10} onNextLevel={nextLevel} /></GameShell>);

  return (
    <GameShell title="Memory Match" icon={<Brain className="w-5 h-5" />} onBack={onComplete} difficulty={difficulty}>
      <GameHUD score={matches * 10} progress={matches / requiredPairs} progressLabel={`Màn ${currentLevel} - ${matches}/${requiredPairs}`} />
      <div className={`grid gap-3 md:gap-4 flex-1 ${difficulty === 'hard' ? 'grid-cols-4 md:grid-cols-5' : 'grid-cols-3 md:grid-cols-4'}`}>
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
