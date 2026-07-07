import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { db } from '../../data/db';

import { useUserStore } from '../../stores/useUserStore';
import toast from 'react-hot-toast';
import { Trophy } from 'lucide-react';

interface MatchTile {
  id: string;
  grammarId: string;
  type: 'pattern' | 'meaning';
  text: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export function GrammarMatch({ onComplete, difficulty = 'medium' }: { onComplete: () => void; difficulty?: 'easy' | 'medium' | 'hard' }) {
  const [tiles, setTiles] = useState<MatchTile[]>([]);
  const [flippedIds, setFlippedIds] = useState<string[]>([]);
  const [isLocked, setIsLocked] = useState(false);
  const [matches, setMatches] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const activeTrack = useUserStore(s => s.activeTrack);
  const addExp = useUserStore(s => s.addExp);
  const setGameHighScore = useUserStore(s => s.setGameHighScore);
  const gameHighScores = useUserStore(s => s.gameHighScores);

  const PAIRS_BY_DIFFICULTY = { easy: 5, medium: 7, hard: 9 };
  const EXP_BY_DIFFICULTY = { easy: 50, medium: 75, hard: 100 };
  const requiredPairs = PAIRS_BY_DIFFICULTY[difficulty];

  useEffect(() => {
    loadGame();
  }, []);

  const loadGame = async () => {
    try {
      const track = activeTrack === 'english' ? 'toeic' : 'n2';
      const points = await db.grammar.where('track').equals(track).toArray();

      if (points.length < requiredPairs) {
        toast.error('Not enough grammar points to play.');
        onComplete();
        return;
      }

      const shuffled = [...points].sort(() => 0.5 - Math.random()).slice(0, requiredPairs);

      const newTiles: MatchTile[] = [];
      shuffled.forEach(point => {
        newTiles.push({
          id: `${point.id}-pattern`,
          grammarId: point.id,
          type: 'pattern',
          text: point.pattern,
          isFlipped: false,
          isMatched: false
        });
        newTiles.push({
          id: `${point.id}-meaning`,
          grammarId: point.id,
          type: 'meaning',
          text: point.meaning,
          isFlipped: false,
          isMatched: false
        });
      });

      setTiles(newTiles.sort(() => 0.5 - Math.random()));
      setMatches(0);
      setFlippedIds([]);
      setIsLoading(false);
    } catch (e) {
      console.error(e);
      toast.error('Failed to load game');
    }
  };

  const handleTileClick = (id: string) => {
    if (isLocked) return;

    const tileIndex = tiles.findIndex(t => t.id === id);
    if (tileIndex === -1 || tiles[tileIndex].isFlipped || tiles[tileIndex].isMatched) return;

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

  const checkMatch = (id1: string, id2: string, currentTiles: MatchTile[]) => {
    const tile1 = currentTiles.find(t => t.id === id1)!;
    const tile2 = currentTiles.find(t => t.id === id2)!;

    if (tile1.grammarId === tile2.grammarId && tile1.type !== tile2.type) {
      setTimeout(() => {
        setTiles(prev => prev.map(t =>
          (t.id === id1 || t.id === id2) ? { ...t, isMatched: true } : t
        ));
        setFlippedIds([]);
        setIsLocked(false);
        const newMatches = matches + 1;
        setMatches(newMatches);

        if (newMatches === requiredPairs) {
          const expGained = EXP_BY_DIFFICULTY[difficulty];
          addExp(expGained);
          setGameHighScore('grammar-match', difficulty, expGained);
          toast.success(`You won! +${expGained} EXP`, { icon: '✨' });
        }
      }, 500);
    } else {
      setTimeout(() => {
        setTiles(prev => prev.map(t =>
          (t.id === id1 || t.id === id2) ? { ...t, isFlipped: false } : t
        ));
        setFlippedIds([]);
        setIsLocked(false);
      }, 1000);
    }
  };

  if (isLoading) {
    return <div className="flex-1 flex items-center justify-center font-bold text-text-muted animate-pulse">Loading grammar...</div>;
  }

  if (matches === requiredPairs) {
    const expGained = EXP_BY_DIFFICULTY[difficulty];
    return (
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex-1 flex flex-col items-center justify-center">
        <div className="w-24 h-24 bg-green/10 rounded-full flex items-center justify-center mb-6">
          <Trophy className="w-12 h-12 text-green" />
        </div>
        <h2 className="text-3xl font-black text-text-main mb-2">Excellent!</h2>
        <p className="text-text-muted font-bold mb-2">+{expGained} EXP earned.</p>
        {gameHighScores['grammar-match']?.[difficulty] > 0 && (
          <p className="text-sm font-bold text-gold mb-8">Best: {gameHighScores['grammar-match'][difficulty]} EXP</p>
        )}
        <div className="flex gap-4">
          <button onClick={loadGame} className="px-6 py-3 bg-blue text-white rounded-xl font-black text-sm uppercase hover:bg-blue-dark active:scale-95 transition-all shadow-sm">Play Again</button>
          <button onClick={onComplete} className="px-6 py-3 bg-gray-bg text-text-main border-2 border-gray-path rounded-xl font-black text-sm uppercase hover:bg-gray-path active:scale-95 transition-all">Back to Menu</button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="flex-1 flex flex-col w-full h-full p-2">
      <div className="flex justify-between items-center mb-6 px-2">
        <h2 className="text-xl font-black text-text-main">Grammar Match</h2>
        <div className="px-4 py-1.5 bg-blue/10 text-blue font-black rounded-full text-sm">
          Matches: {matches}/{requiredPairs}
        </div>
      </div>

      <div className={`grid gap-3 md:gap-4 flex-1 ${requiredPairs <= 5 ? 'grid-cols-3 md:grid-cols-4' : 'grid-cols-4 md:grid-cols-5'}`}>
        {tiles.map(tile => (
          <div
            key={tile.id}
            className="relative w-full h-24 md:h-32 cursor-pointer"
            onClick={() => handleTileClick(tile.id)}
          >
            <motion.div
              className="w-full h-full relative"
              style={{ transformStyle: 'preserve-3d' }}
              initial={false}
              animate={{ rotateY: tile.isFlipped || tile.isMatched ? 180 : 0 }}
              transition={{ duration: 0.4 }}
            >
              {/* Front */}
              <div className="absolute w-full h-full backface-hidden bg-gray-bg border-2 border-gray-path flex items-center justify-center rounded-xl shadow-sm hover:border-purple transition-colors">
                <span className="text-3xl font-black opacity-30">?</span>
              </div>

              {/* Back */}
              <div
                className={`absolute w-full h-full backface-hidden bg-white border-2 flex items-center justify-center p-2 rounded-xl shadow-sm [transform:rotateY(180deg)] ${
                  tile.isMatched ? 'border-green bg-green/5 opacity-60' : tile.type === 'pattern' ? 'border-purple' : 'border-blue'
                }`}
              >
                <span className={`text-center font-bold ${
                  tile.type === 'pattern'
                    ? 'text-sm md:text-base text-purple font-black'
                    : 'text-xs md:text-sm text-text-muted'
                }`}>
                  {tile.text}
                </span>
              </div>
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
}
