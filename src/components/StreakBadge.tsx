import { Flame } from 'lucide-react';
import { useUserStore } from '../stores/useUserStore';

export function StreakBadge() {
  const currentStreak = useUserStore(s => s.currentStreak);
  const longestStreak = useUserStore(s => s.longestStreak);

  if (currentStreak === 0) return null;

  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-tint-gold rounded-2xl border-2 border-gold/30">
      <Flame size={20} className="text-gold" />
      <div className="flex flex-col">
        <span className="text-lg font-black text-gold leading-none">{currentStreak}</span>
        <span className="text-[8px] font-black text-gold/70 uppercase tracking-widest">
          {currentStreak === 1 ? 'day streak' : 'days streak'}
        </span>
      </div>
      {longestStreak > currentStreak && (
        <span className="text-[9px] font-bold text-text-muted ml-1">
          Best: {longestStreak}
        </span>
      )}
    </div>
  );
}
