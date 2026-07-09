import { Lock } from 'lucide-react';

interface Props {

  maxLevel: number;
  highScore?: number;
  onSelect: (level: number) => void;
}

export function LevelSelector({ maxLevel, highScore, onSelect }: Props) {
  // Show unlocked levels + up to 5 locked levels as preview
  const displayCount = Math.min(20, maxLevel + 5);

  return (
    <div className="w-full max-w-sm md:max-w-md mx-auto mt-6 mb-4 p-4 bg-bg-card rounded-2xl border border-gray-path/40 shadow-sm">
      <div className="flex justify-between items-end mb-4 px-2">
        <h3 className="text-xs font-black text-text-muted uppercase tracking-wider">
          📍 CHỌN MÀN CHƠI
        </h3>
        <div className="text-right">
          <div className="text-[10px] font-bold text-text-muted">MÀN CAO NHẤT: <span className="text-blue">{maxLevel}</span></div>
          {highScore !== undefined && (
            <div className="text-[10px] font-bold text-text-muted">ĐIỂM KỶ LỤC: <span className="text-gold">{highScore}</span></div>
          )}
        </div>
      </div>
      <div className="grid grid-cols-5 gap-2 md:gap-3">
        {[...Array(displayCount)].map((_, i) => {
          const level = i + 1;
          const isUnlocked = level <= maxLevel;
          const isLatest = level === maxLevel;
          
          return (
            <button
              key={level}
              disabled={!isUnlocked}
              onClick={() => onSelect(level)}
              className={`relative flex flex-col items-center justify-center aspect-square rounded-xl text-sm font-black transition-all ${
                isLatest
                  ? 'bg-gold text-white shadow-[0_4px_15px_rgba(237,137,54,0.3)] animate-pulse-slow'
                  : isUnlocked 
                  ? 'bg-blue text-white shadow hover:scale-105 active:scale-95' 
                  : 'bg-gray-bg border-2 border-gray-path/50 text-text-muted/40 cursor-not-allowed'
              }`}
            >
              {isUnlocked ? level : <Lock className="w-4 h-4 opacity-30" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
