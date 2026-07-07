import { CalendarDays } from 'lucide-react';

interface StatsOverviewProps {
  totalCards: number;
  knownCards: number;
  learningCards: number;
  masteryPercentage: number;
  examCount: number;
  avgScore: number;
  forecastMessage: string;
}

export function StatsOverview({ totalCards, knownCards, learningCards, masteryPercentage, examCount, avgScore, forecastMessage }: StatsOverviewProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
      {/* Vocabulary Progress */}
      <div className="shadow-[var(--shadow-inset-light)] rounded-3xl p-6 relative overflow-hidden">
        <h3 className="text-lg font-black uppercase tracking-widest text-text-main mb-6">Vocabulary Mastery</h3>
        <div className="flex items-center gap-6 z-10 relative">
          <div className="relative w-24 h-24 flex-shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path className="text-gray-path" strokeDasharray="100, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
              <path className="text-green" strokeDasharray={`${masteryPercentage}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <span className="text-xl font-black text-green leading-none">{masteryPercentage}%</span>
            </div>
          </div>
          <div className="flex-1 space-y-3">
            <div className="flex justify-between items-center border-b-2 border-border-main pb-2">
              <span className="text-xs font-bold text-text-muted uppercase">Total Words</span>
              <span className="font-black text-lg text-text-main">{totalCards}</span>
            </div>
            <div className="flex justify-between items-center border-b-2 border-border-main pb-2">
              <span className="text-xs font-bold text-text-muted uppercase">Known (Mastered)</span>
              <span className="font-black text-lg text-blue">{knownCards}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-text-muted uppercase">Learning</span>
              <span className="font-black text-lg text-gold">{learningCards}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Exam Summary */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-6 rounded-3xl text-center flex flex-col justify-center shadow-[var(--shadow-inset-light)]">
          <p className="text-[10px] md:text-xs font-black text-green uppercase opacity-80 mb-2 tracking-wider">Total Completed</p>
          <p className="text-4xl font-black text-green">{examCount}</p>
        </div>
        <div className="p-6 rounded-3xl text-center flex flex-col justify-center shadow-[var(--shadow-inset-light)]">
          <p className="text-[10px] md:text-xs font-black text-blue uppercase opacity-80 mb-2 tracking-wider">Avg Accuracy</p>
          <p className="text-4xl font-black text-blue">{avgScore}%</p>
        </div>
        <div className="col-span-2 p-6 rounded-3xl text-center flex flex-col justify-center overflow-hidden shadow-[var(--shadow-inset-light)]">
          <p className="text-[10px] md:text-xs font-black text-purple uppercase opacity-80 mb-2 tracking-wider flex justify-center items-center gap-2">
            <CalendarDays size={16} /> Forecasting
          </p>
          <p className="text-sm font-bold text-text-main leading-snug">
            {forecastMessage}
          </p>
        </div>
      </div>
    </div>
  );
}
