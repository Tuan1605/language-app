import { AnimatedPage } from '../components/AnimatedPage';
import { useUserStore } from '../stores/useUserStore';
import { useAppStore } from '../stores/useAppStore';
import { db } from '../data/db';
import { useLiveQuery } from 'dexie-react-hooks';
import { useAppActions } from '../hooks/useAppActions';
import { FlashcardView } from '../components/FlashcardView';
import { LocalErrorBoundary } from '../components/LocalErrorBoundary';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useNavigate } from 'react-router-dom';

export function ReviewPage() {
  const currentReviewIndex = useAppStore(s => s.currentReviewIndex);
  const activeTrack = useUserStore(s => s.activeTrack);
  const { handleRateCard, handleArchiveCard } = useAppActions();
  const navigate = useNavigate();

  const reviewQueue = useLiveQuery(async () => {
    const today = new Date().getTime();
    return await db.cards
      .where('language').equals(activeTrack)
      .and(c => c.next_review != null && new Date(c.next_review).getTime() <= today)
      .toArray();
  }, [activeTrack]);

  if (reviewQueue === undefined) return <LoadingSpinner />;

  const card = reviewQueue[currentReviewIndex];

  if (!card) {
    return (
      <div className="w-full text-center space-y-8 pop-in pt-10">
        <h2 className="text-2xl font-black">No cards to review!</h2>
        <button onClick={() => navigate('/')} className="btn-3d btn-blue px-6 py-3">Return Home</button>
      </div>
    );
  }

  const progress = ((currentReviewIndex) / reviewQueue.length) * 100;

  return (
    <AnimatedPage>
      <div className="w-full view-enter">
      <div className="w-full mb-8">
        <div className="flex items-center justify-between mb-3">
          <button onClick={() => navigate('/')} className="w-10 h-10 rounded-full flex items-center justify-center text-[var(--text-muted)] hover:bg-[var(--gray-bg)] transition-colors active:scale-95">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          <div className="flex-1 mx-4">
            <div className="h-3 w-full bg-[var(--gray-path)] rounded-full overflow-hidden">
              <div
                className="h-full bg-[var(--green)] transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-xl mt-10 view-enter">
        <LocalErrorBoundary key={`review-${card.id}`}>
          <FlashcardView card={card} onRate={handleRateCard} onArchive={handleArchiveCard} />
        </LocalErrorBoundary>
      </div>
      </div>
    </AnimatedPage>
  );
}
