import React from 'react';
import { AnimatedPage } from '../components/AnimatedPage';
import { AnalyticsView } from '../components/AnalyticsView';
import { LocalErrorBoundary } from '../components/LocalErrorBoundary';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../data/db';
import { useUserStore } from '../stores/useUserStore';

export function AnalyticsPage() {
  const activeTrack = useUserStore(s => s.activeTrack);
  const [studyStreak, setStudyStreak] = React.useState(0);

  const examResults = useLiveQuery(async () => {
    return await db.examResults.where('category').equals(activeTrack === 'english' ? 'toeic' : 'n2').toArray();
  }, [activeTrack]);
  
  const cards = useLiveQuery(async () => await db.cards.where('language').equals(activeTrack).toArray(), [activeTrack]);
  
  const reviewLogs = useLiveQuery(async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const ninetyDaysAgo = new Date(today);
    ninetyDaysAgo.setDate(today.getDate() - 89);
    
    return await db.reviewLogs
      .where('review').aboveOrEqual(ninetyDaysAgo.toISOString())
      .toArray();
  }, [activeTrack]);

  React.useEffect(() => {
    async function calculateStreak() {
      let currentStreak = 0;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const dateCursor = new Date(today);
      
      while (true) {
        const dateStr = dateCursor.toISOString().split('T')[0];
        const start = dateStr + "T00:00:00.000Z";
        const end = dateStr + "T23:59:59.999Z";
        
        const count = await db.reviewLogs.where('review').between(start, end, true, true).count();
        if (count > 0) {
          currentStreak++;
          dateCursor.setDate(dateCursor.getDate() - 1);
        } else {
          break;
        }
      }
      setStudyStreak(currentStreak);
    }
    calculateStreak();
  }, [activeTrack]);

  if (examResults === undefined || cards === undefined || reviewLogs === undefined) return <LoadingSpinner />;

  return (
    <LocalErrorBoundary>
      <AnimatedPage>
        <div className="w-full view-enter">
        <AnalyticsView
          results={examResults}
          cards={cards}
          reviewLogs={reviewLogs}
          activeTrack={activeTrack}
          studyStreak={studyStreak}
        />
        </div>
      </AnimatedPage>
    </LocalErrorBoundary>
  );
}
