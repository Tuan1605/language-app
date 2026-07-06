import { AnimatedPage } from '../components/AnimatedPage';
import { useUserStore } from '../stores/useUserStore';
import { useAppStore } from '../stores/useAppStore';
import { useAppActions } from '../hooks/useAppActions';
import { ReviewReminder } from '../components/ReviewReminder';
import { DailyStudyPlan } from '../components/DailyStudyPlan';
import { WordOfDay } from '../components/WordOfDay';
import { OverallProgress } from '../components/OverallProgress';
import { useLiveQuery } from 'dexie-react-hooks';
import { useNavigate } from 'react-router-dom';
import { db } from '../data/db';

export function PathPage() {
  const isLoadingData = useAppStore(s => s.isLoadingData);
  const activeTrack = useUserStore(s => s.activeTrack);
  const navigate = useNavigate();

  const { startDrill } = useAppActions();

  const dueCount = useLiveQuery(async () => {
    const today = new Date().getTime();
    return await db.cards
      .where('language').equals(activeTrack)
      .and(c => c.next_review != null && new Date(c.next_review).getTime() <= today)
      .count();
  }, [activeTrack]) || 0;

  if (isLoadingData) {
    return (
    <AnimatedPage>
      <div className="w-full view-enter flex flex-col items-center">
      <ReviewReminder dueCount={dueCount} onStartReview={() => startDrill('review')} />
        <div className="w-full max-w-xl animate-pulse space-y-12">
          <div className="h-32 bg-gray-bg rounded-3xl w-full"></div>
          <div className="h-24 bg-gray-bg rounded-full w-24 mx-auto"></div>
          <div className="h-24 bg-gray-bg rounded-full w-24 mx-auto translate-x-12"></div>
          <div className="h-24 bg-gray-bg rounded-full w-24 mx-auto -translate-x-12"></div>
        </div>
      </div>
    </AnimatedPage>
  );
  }

  return (
    <AnimatedPage>
      <div className="w-full view-enter flex flex-col items-center">
        <div className="w-full mb-4">
          <ReviewReminder dueCount={dueCount} onStartReview={() => startDrill('review')} />
        </div>

        {/* Overall Progress */}
        <div className="w-full max-w-xl mb-6">
          <OverallProgress />
        </div>

        {/* Daily Study Plan */}
        <div className="w-full max-w-xl mb-6">
          <DailyStudyPlan onNavigate={navigate} />
        </div>

        {/* Word of the Day */}
        <div className="w-full max-w-xl mb-6">
          <WordOfDay />
        </div>
      </div>
    </AnimatedPage>
  );
}
