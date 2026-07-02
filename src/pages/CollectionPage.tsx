import { AnimatedPage } from '../components/AnimatedPage';
import { useCardActions } from '../hooks/useCardActions';
import { CollectionView } from '../components/CollectionView';
import { LocalErrorBoundary } from '../components/LocalErrorBoundary';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../data/db';
import { useUserStore } from '../stores/useUserStore';

export function CollectionPage() {
  const activeTrack = useUserStore(s => s.activeTrack);
  const cards = useLiveQuery(async () => await db.cards.where('language').equals(activeTrack).toArray(), [activeTrack]);
  const { handleRemoveCard, handleRemoveCards, handleEditCard } = useCardActions();

  if (cards === undefined) return <LoadingSpinner />;

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
