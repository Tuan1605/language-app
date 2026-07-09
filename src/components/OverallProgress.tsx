import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../data/db';
import { useUserStore } from '../stores/useUserStore';
import { TrendingUp, BookOpen, Brain, Target } from 'lucide-react';

export function OverallProgress() {
  const activeTrack = useUserStore(s => s.activeTrack);

  const stats = useLiveQuery(async () => {
    const cardsQuery = db.cards.where('language').equals(activeTrack);
    const total = await cardsQuery.count();
    
    let mastered = 0;
    let learning = 0;
    let newCards = 0;

    // Use raw iteration which is much faster than .toArray()
    await cardsQuery.each(card => {
      if (card.state === 'Review') {
        mastered++;
      } else if (card.state === 'Learning' || card.state === 'Relearning') {
        learning++;
      } else {
        newCards++;
      }
    });

    const masteryPercent = total > 0 ? Math.round((mastered / total) * 100) : 0;

    return { total, mastered, learning, newCards, masteryPercent };
  }, [activeTrack]);

  if (!stats) return null;

  return (
    <div className="w-full bg-bg-card lingo-card p-4 md:p-6">
      <div className="flex items-center justify-between mb-3 md:mb-4">
        <h3 className="text-base md:text-lg font-black text-text-main uppercase tracking-tight">Tiến độ tổng quan</h3>
        <div className="flex items-center gap-1.5 md:gap-2 px-2.5 py-1 md:px-3 md:py-1.5 rounded-lg md:rounded-xl bg-tint-blue">
          <TrendingUp size={14} className="text-blue md:w-4 md:h-4" />
          <span className="text-xs md:text-sm font-black text-blue">{stats.masteryPercent}%</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-3 md:h-4 bg-gray-path rounded-full overflow-hidden mb-4 md:mb-6">
        <div
          className="h-full bg-gradient-to-r from-blue to-green transition-all duration-500"
          style={{ width: `${stats.masteryPercent}%` }}
        />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-2 md:gap-4">
        <div className="flex items-center gap-2 md:gap-3 p-2 md:p-3 rounded-lg md:rounded-xl bg-bg-hover">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-tint-green flex items-center justify-center shrink-0">
            <Brain size={16} className="text-green md:w-5 md:h-5" />
          </div>
          <div>
            <p className="text-base md:text-lg font-black text-text-main">{stats.mastered}</p>
            <p className="text-[8px] md:text-[10px] font-bold text-text-muted uppercase">Đã thuộc</p>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-3 p-2 md:p-3 rounded-lg md:rounded-xl bg-bg-hover">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-tint-gold flex items-center justify-center shrink-0">
            <BookOpen size={16} className="text-gold md:w-5 md:h-5" />
          </div>
          <div>
            <p className="text-base md:text-lg font-black text-text-main">{stats.learning}</p>
            <p className="text-[8px] md:text-[10px] font-bold text-text-muted uppercase">Đang học</p>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-3 p-2 md:p-3 rounded-lg md:rounded-xl bg-bg-hover">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-tint-blue flex items-center justify-center shrink-0">
            <Target size={16} className="text-blue md:w-5 md:h-5" />
          </div>
          <div>
            <p className="text-base md:text-lg font-black text-text-main">{stats.newCards}</p>
            <p className="text-[8px] md:text-[10px] font-bold text-text-muted uppercase">Mới</p>
          </div>
        </div>
      </div>

      <div className="mt-3 md:mt-4 text-center">
        <p className="text-[10px] md:text-xs font-bold text-text-muted">
          Tổng cộng <span className="text-text-main">{stats.total}</span> từ vựng
        </p>
      </div>
    </div>
  );
}
