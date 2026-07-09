import { useUserStore } from '../../stores/useUserStore';
import { Trophy, Medal, Flame } from 'lucide-react';

interface GameInfo {
  id: string;
  name: string;
  category: 'vocab' | 'grammar';
}

const GAMES: GameInfo[] = [
  { id: 'memory', name: 'Memory Match', category: 'vocab' },
  { id: 'falling', name: 'Speed Typing', category: 'vocab' },
  { id: 'hangman', name: 'Hangman', category: 'vocab' },
  { id: 'context', name: 'Fill in Blanks', category: 'vocab' },
  { id: 'scramble', name: 'Word Scramble', category: 'vocab' },
  { id: 'grammar-gap', name: 'Grammar Gap Fill', category: 'grammar' },
  { id: 'grammar-match', name: 'Grammar Match', category: 'grammar' },
  { id: 'grammar-builder', name: 'Sentence Builder', category: 'grammar' },
  { id: 'grammar-detective', name: 'Pattern Detective', category: 'grammar' },
  { id: 'grammar-typing', name: 'Grammar Typing', category: 'grammar' },
  { id: 'vocab-rpg', name: 'RPG Vocabulary', category: 'vocab' },
  { id: 'escape', name: 'Language Escape', category: 'vocab' },
];

const DIFFICULTIES = ['easy', 'medium', 'hard'] as const;

export function GameLeaderboard() {
  const gameHighScores = useUserStore(s => s.gameHighScores);

  const totalGames = GAMES.length;
  const gamesWithScores = GAMES.filter(g => {
    const scores = gameHighScores[g.id as keyof typeof gameHighScores];
    return scores && (scores.easy > 0 || scores.medium > 0 || scores.hard > 0);
  }).length;

  const bestOverall = GAMES.reduce((best, game) => {
    const scores = gameHighScores[game.id as keyof typeof gameHighScores];
    if (!scores) return best;
    const maxScore = Math.max(scores.easy, scores.medium, scores.hard);
    if (maxScore > best.score) return { game: game.name, score: maxScore, category: game.category };
    return best;
  }, { game: '', score: 0, category: '' as string });

  return (
    <div className="bg-bg-card lingo-card p-6 sm:p-8 max-w-4xl mx-auto w-full">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gold/10 rounded-2xl flex items-center justify-center">
          <Trophy className="w-6 h-6 text-gold" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-text-main">Leaderboard</h2>
          <p className="text-xs font-bold text-text-muted">{gamesWithScores}/{totalGames} games played</p>
        </div>
      </div>

      {/* Best Overall */}
      {bestOverall.score > 0 && (
        <div className="mb-6 p-4 bg-gold/5 border-2 border-gold/20 rounded-2xl flex items-center gap-4">
          <Medal className="w-8 h-8 text-gold flex-shrink-0" />
          <div>
            <p className="text-xs font-bold text-text-muted uppercase">Best Score Overall</p>
            <p className="font-black text-text-main">{bestOverall.game} — <span className="text-gold">{bestOverall.score}</span></p>
          </div>
        </div>
      )}

      {/* Score Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-gray-path">
              <th className="text-left py-3 px-2 font-black text-text-muted text-xs uppercase">Game</th>
              {DIFFICULTIES.map(d => (
                <th key={d} className="text-center py-3 px-2 font-black text-text-muted text-xs uppercase">{d}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {GAMES.map(game => {
              const scores = gameHighScores[game.id as keyof typeof gameHighScores];
              const maxScore = scores ? Math.max(scores.easy, scores.medium, scores.hard) : 0;

              return (
                <tr key={game.id} className="border-b border-gray-path/50 hover:bg-gray-bg/50 transition-colors">
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-text-main text-xs">{game.name}</span>
                      <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded ${game.category === 'vocab' ? 'bg-blue/10 text-blue' : 'bg-purple/10 text-purple'}`}>
                        {game.category}
                      </span>
                    </div>
                  </td>
                  {DIFFICULTIES.map(d => {
                    const score = scores?.[d] ?? 0;
                    const isMax = score === maxScore && score > 0;
                    return (
                      <td key={d} className="text-center py-3 px-2">
                        {score > 0 ? (
                          <span className={`font-black ${isMax ? 'text-gold' : 'text-text-main'}`}>
                            {isMax && <Flame className="w-3 h-3 inline mr-0.5 text-gold" />}
                            {score}
                          </span>
                        ) : (
                          <span className="text-text-muted">—</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {gamesWithScores === 0 && (
        <p className="text-center text-text-muted font-bold text-sm mt-4">
          Chơi game để tích lũy điểm!
        </p>
      )}
    </div>
  );
}
