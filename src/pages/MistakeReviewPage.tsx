import { AnimatedPage } from '../components/AnimatedPage';
import { useCardActions } from '../hooks/useCardActions';
import { MistakeReviewView } from '../components/MistakeReviewView';
import { LocalErrorBoundary } from '../components/LocalErrorBoundary';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useNavigate } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../data/db';

export function MistakeReviewPage() {
  const mistakes = useLiveQuery(async () => await db.mistakes.toArray());
  const { handleRemoveMistake } = useCardActions();
  const navigate = useNavigate();

  if (mistakes === undefined) return <LoadingSpinner />;

  return (
    <LocalErrorBoundary>
      <AnimatedPage>
        <div className="w-full view-enter">
        <MistakeReviewView
          mistakes={mistakes}
          onComplete={() => navigate('/mistakes')}
          onCancel={() => navigate('/mistakes')}
          onRemoveMistake={handleRemoveMistake}
        />
        </div>
      </AnimatedPage>
    </LocalErrorBoundary>
  );
}
