import { AnimatedPage } from '../components/AnimatedPage';
import { useAppActions } from '../hooks/useAppActions';
import { MistakeBookView } from '../components/MistakeBookView';
import { LocalErrorBoundary } from '../components/LocalErrorBoundary';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useNavigate } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../data/db';

export function MistakesPage() {
  const mistakes = useLiveQuery(async () => await db.mistakes.toArray());
  const { handleRemoveMistake } = useAppActions();
  const navigate = useNavigate();

  if (mistakes === undefined) return <LoadingSpinner />;

  return (
    <LocalErrorBoundary>
      <AnimatedPage>
        <div className="w-full view-enter">
        <MistakeBookView
          mistakes={mistakes}
          onRemoveMistake={handleRemoveMistake}
          onReview={() => navigate('/review-mistakes')}
        />
        </div>
      </AnimatedPage>
    </LocalErrorBoundary>
  );
}
