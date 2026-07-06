import { useEffect, useCallback, useState } from 'react';
import { AnimatedPage } from '../components/AnimatedPage';
import { useCardActions } from '../hooks/useCardActions';
import { CollectionView } from '../components/CollectionView';
import { LocalErrorBoundary } from '../components/LocalErrorBoundary';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../data/db';
import { useUserStore } from '../stores/useUserStore';
import { initializeDatabase } from '../data/contentLoader';
import toast from 'react-hot-toast';

export function CollectionPage() {
  const activeTrack = useUserStore(s => s.activeTrack);
  const cards = useLiveQuery(async () => await db.cards.where('language').equals(activeTrack).toArray(), [activeTrack]);
  const { handleRemoveCard, handleRemoveCards, handleEditCard } = useCardActions();
  const [isIniting, setIsIniting] = useState(false);

  const handleInit = useCallback(async () => {
    setIsIniting(true);
    try {
      await db.meta.put({ id: 'initialized', value: false });
      await initializeDatabase();
      toast.success('Data loaded! Refreshing...');
      window.location.reload();
    } catch (e) {
      console.error('Init failed:', e);
      toast.error('Failed to load data');
    } finally {
      setIsIniting(false);
    }
  }, []);

  useEffect(() => {
    if (cards !== undefined && cards.length === 0 && !isIniting) {
      handleInit();
    }
  }, [cards, isIniting, handleInit]);

  if (cards === undefined || isIniting) return <LoadingSpinner />;

  return (
    <LocalErrorBoundary>
      <AnimatedPage>
        <div className="w-full view-enter">
        <CollectionView
          cards={cards}
          activeTrack={activeTrack}
          onDelete={handleRemoveCard}
          onDeleteBulk={handleRemoveCards}
          onEdit={handleEditCard}
        />
        </div>
      </AnimatedPage>
    </LocalErrorBoundary>
  );
}
