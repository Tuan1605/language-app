import { useState, useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../data/db';
import { useUserStore } from '../stores/useUserStore';
import { getAllAchievements, getAchievementProgress, checkAchievements } from '../utils/achievements';
import { Trophy, Lock } from 'lucide-react';
import { MASTERY_STABILITY, MASTERY_REPS } from '../utils/constants';

export function AchievementBadges() {
  const activeTrack = useUserStore(s => s.activeTrack);
  const [showAll, setShowAll] = useState(false);

  const allCards = useLiveQuery(
    () => db.cards.where('language').equals(activeTrack).toArray(),
    [activeTrack]
  );

  const allExamResults = useLiveQuery(
    () => db.examResults.where('category').equals(activeTrack === 'english' ? 'toeic' : 'n2').toArray(),
    [activeTrack]
  );

  const allReviewLogs = useLiveQuery(
    () => db.reviewLogs.toArray(),
    []
  );

  const stats = useMemo(() => {
    if (!allCards || !allExamResults || !allReviewLogs) return null;

    const trackCards = allCards.filter(c => c.language === activeTrack);
    const trackCardIds = new Set(trackCards.map(c => c.id));

    const totalCards = trackCards.length;
    const masteredCards = trackCards.filter(c =>
      c.stability >= MASTERY_STABILITY && c.reps >= MASTERY_REPS
    ).length;

    const trackLogs = allReviewLogs.filter(log => trackCardIds.has(log.cardId));
    const totalReviews = trackLogs.length;
    const correctReviews = trackLogs.filter(log =>
      log.rating === 'Good' || log.rating === 'Easy'
    ).length;

    const avgAccuracy = totalReviews > 0 ? Math.round((correctReviews / totalReviews) * 100) : 0;

    // Calculate study days
    const studyDays = new Set(trackLogs.map(log =>
      new Date(log.review).toISOString().split('T')[0]
    )).size;

    return {
      totalCards,
      masteredCards,
      studyDays,
      totalReviews,
      correctReviews,
      examsCompleted: allExamResults.length,
      avgAccuracy,
    };
  }, [allCards, allExamResults, allReviewLogs, activeTrack]);

  // Check for new achievements
  useMemo(() => {
    if (stats) {
      checkAchievements(stats);
    }
  }, [stats]);

  if (!stats) return null;

  const allAchievements = getAllAchievements();
  const progress = getAchievementProgress(stats);
  const displayAchievements = showAll ? allAchievements : allAchievements.filter(a => a.unlocked).slice(0, 6);

  return (
    <div className="bg-bg-card lingo-card p-6 sm:p-8 max-w-4xl mx-auto w-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-tint-gold flex items-center justify-center">
            <Trophy size={24} className="text-gold" />
          </div>
          <div>
            <h3 className="font-black text-lg text-text-main">Achievements</h3>
            <p className="text-[10px] font-bold text-text-muted">
              {progress.unlocked}/{progress.total} unlocked
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-black text-gold">{progress.percentage}%</p>
          <p className="text-[9px] font-bold text-text-muted">Complete</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-3 bg-gray-path rounded-full overflow-hidden mb-6">
        <div
          className="h-full bg-gradient-to-r from-gold to-yellow-400 transition-all duration-500"
          style={{ width: `${progress.percentage}%` }}
        />
      </div>

      {/* Achievement Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {displayAchievements.map((achievement) => (
          <div
            key={achievement.id}
            className={`relative p-4 rounded-2xl border-2 text-center transition-all ${
              achievement.unlocked
                ? 'border-gold bg-tint-gold shadow-md'
                : 'border-border-main bg-bg-hover opacity-60'
            }`}
          >
            {achievement.unlocked ? (
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-green rounded-full flex items-center justify-center">
                <span className="text-white text-[10px]">✓</span>
              </div>
            ) : (
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gray-path rounded-full flex items-center justify-center">
                <Lock size={10} className="text-text-muted" />
              </div>
            )}

            <div className="text-3xl mb-2">{achievement.icon}</div>
            <p className="text-xs font-black text-text-main mb-1 leading-tight">{achievement.title}</p>
            <p className="text-[9px] font-bold text-text-muted">{achievement.description}</p>
          </div>
        ))}
      </div>

      {/* Show More/Less Button */}
      {allAchievements.length > 6 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="w-full mt-4 py-2 text-xs font-bold text-blue hover:text-blue/80 transition-colors"
        >
          {showAll ? 'Show Less' : `Show All (${allAchievements.length})`}
        </button>
      )}

      {/* Stats Summary */}
      <div className="mt-6 p-4 rounded-xl bg-bg-hover border-2 border-border-main">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-lg font-black text-text-main">{stats.totalCards}</p>
            <p className="text-[9px] font-bold text-text-muted">Words</p>
          </div>
          <div>
            <p className="text-lg font-black text-green">{stats.masteredCards}</p>
            <p className="text-[9px] font-bold text-text-muted">Mastered</p>
          </div>
          <div>
            <p className="text-lg font-black text-blue">{stats.avgAccuracy}%</p>
            <p className="text-[9px] font-bold text-text-muted">Accuracy</p>
          </div>
        </div>
      </div>
    </div>
  );
}
