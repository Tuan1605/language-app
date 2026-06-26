import { AnimatedPage } from '../components/AnimatedPage';
import { useUserStore } from '../stores/useUserStore';
import { useAppStore } from '../stores/useAppStore';
import { useAppActions } from '../hooks/useAppActions';
import { ReviewReminder } from '../components/ReviewReminder';
import { GamifiedPath } from '../components/GamifiedPath';
import { TOEIC_CURRICULUM, N2_CURRICULUM } from '../data/curriculums';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../data/db';

export function PathPage() {
  const isLoadingData = useAppStore(s => s.isLoadingData);
  const activeTrack = useUserStore(s => s.activeTrack);
  const unlockedEn = useUserStore(s => s.unlockedEn);
  const unlockedJa = useUserStore(s => s.unlockedJa);

  const { startSession, startDrill } = useAppActions();

  const currentCurriculum = activeTrack === 'english' ? TOEIC_CURRICULUM : N2_CURRICULUM;
  const currentUnlocked = activeTrack === 'english' ? unlockedEn : unlockedJa;

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
      <ReviewReminder dueCount={dueCount} onStartReview={() => startDrill('review')} />
      <GamifiedPath
        curriculum={currentCurriculum}
        currentUnlocked={currentUnlocked.length}
        onStartSession={startSession}
      />
      </div>
    </AnimatedPage>
  );
}
