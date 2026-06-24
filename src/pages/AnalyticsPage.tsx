import { AnimatedPage } from '../components/AnimatedPage';
import { AnalyticsView } from '../components/AnalyticsView';
import { LocalErrorBoundary } from '../components/LocalErrorBoundary';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../data/db';
import { useUserStore } from '../stores/useUserStore';

export function AnalyticsPage() {
  const activeTrack = useUserStore(s => s.activeTrack);
  const examResults = useLiveQuery(async () => await db.examResults.toArray());
  const cards = useLiveQuery(async () => await db.cards.toArray());

  if (examResults === undefined || cards === undefined) return <LoadingSpinner />;

  return (
    <LocalErrorBoundary>
      <AnimatedPage>
        <div className="w-full view-enter">
        <AnalyticsView
          results={examResults}
          cards={cards}
          activeTrack={activeTrack}
        />
        </div>
      </AnimatedPage>
    </LocalErrorBoundary>
  );
}
