import { TrendingUp, Award, Target, Activity } from 'lucide-react';

interface MetricCardsProps {
  retentionRate: number;
  studyStreak: number;
  predictedScore: { score: string | number; color: string; message: string };
  dailyProgress: number;
  todayCards: number;
  dailyGoal: number;
  onEditGoal: () => void;
}

export function MetricCards({ retentionRate, studyStreak, predictedScore, dailyProgress, todayCards, dailyGoal, onEditGoal }: MetricCardsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
      {/* Retention Rate */}
      <div className="p-4 sm:p-6 rounded-3xl shadow-[var(--shadow-inset-light)] text-center">
        <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto rounded-xl bg-tint-green flex items-center justify-center mb-3">
          <TrendingUp size={24} className="text-green" />
        </div>
        <p className="text-2xl sm:text-3xl font-black text-green mb-1">{retentionRate}%</p>
        <p className="text-[9px] sm:text-[10px] font-black text-text-muted uppercase tracking-wider">Retention</p>
        <p className="text-[8px] sm:text-[9px] font-bold text-text-muted mt-1 hidden sm:block">Last 7 days</p>
      </div>

      {/* Study Streak */}
      <div className="p-4 sm:p-6 rounded-3xl shadow-[var(--shadow-inset-light)] text-center">
        <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto rounded-xl bg-tint-gold flex items-center justify-center mb-3">
          <Award size={24} className="text-gold" />
        </div>
        <p className="text-2xl sm:text-3xl font-black text-gold mb-1">{studyStreak}</p>
        <p className="text-[9px] sm:text-[10px] font-black text-text-muted uppercase tracking-wider">Day Streak</p>
        <p className="text-[8px] sm:text-[9px] font-bold text-text-muted mt-1 hidden sm:block">Consecutive</p>
      </div>

      {/* Predicted Score */}
      <div className="p-4 sm:p-6 rounded-3xl shadow-[var(--shadow-inset-light)] text-center relative overflow-hidden">
        {predictedScore.color === 'red' && <div className="absolute top-0 left-0 w-full h-1 bg-red-500"></div>}
        {predictedScore.color === 'gold' && <div className="absolute top-0 left-0 w-full h-1 bg-amber-500"></div>}
        {predictedScore.color === 'green' && <div className="absolute top-0 left-0 w-full h-1 bg-green-500"></div>}
        <div className={`w-10 h-10 sm:w-12 sm:h-12 mx-auto rounded-xl flex items-center justify-center mb-3 ${
          predictedScore.color === 'red' ? 'bg-red-50 text-red-600' :
          predictedScore.color === 'gold' ? 'bg-amber-50 text-amber-600' :
          predictedScore.color === 'green' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400'
        }`}>
          <Target size={24} />
        </div>
        <p className={`text-2xl sm:text-3xl font-black mb-1 ${
          predictedScore.color === 'red' ? 'text-red-600' :
          predictedScore.color === 'gold' ? 'text-amber-500' :
          predictedScore.color === 'green' ? 'text-green-600' : 'text-gray-400'
        }`}>{predictedScore.score}</p>
        <p className="text-[9px] sm:text-[10px] font-black text-text-muted uppercase tracking-wider">Est. Score</p>
        <p className="text-[8px] sm:text-[9px] font-bold text-text-muted mt-1 hidden sm:block">{predictedScore.message}</p>
      </div>

      {/* Goal Progress */}
      <div className="p-4 sm:p-6 rounded-3xl shadow-[var(--shadow-inset-light)] text-center relative">
        <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto rounded-xl bg-tint-blue flex items-center justify-center mb-3">
          <Activity size={24} className="text-blue" />
        </div>
        <p className="text-2xl sm:text-3xl font-black text-blue mb-1">{dailyProgress}%</p>
        <p className="text-[9px] sm:text-[10px] font-black text-text-muted uppercase tracking-wider">Daily Goal</p>
        <p className="text-[8px] sm:text-[9px] font-bold text-text-muted mt-1 hidden sm:block">{todayCards}/{dailyGoal} cards</p>
        <button
          onClick={onEditGoal}
          className="absolute top-3 right-3 text-[9px] font-bold text-text-muted hover:text-blue"
        >
          Edit
        </button>
      </div>
    </div>
  );
}
