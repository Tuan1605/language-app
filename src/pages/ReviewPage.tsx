import { AnimatedPage } from '../components/AnimatedPage';
import { useUserStore } from '../stores/useUserStore';
import { useAppStore } from '../stores/useAppStore';
import { db } from '../data/db';
import { useLiveQuery } from 'dexie-react-hooks';
import { useReviewActions } from '../hooks/useReviewActions';
import { FlashcardView } from '../components/FlashcardView';
import { LocalErrorBoundary } from '../components/LocalErrorBoundary';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export function ReviewPage() {
  const currentReviewIndex = useAppStore(s => s.currentReviewIndex);
  const setCurrentReviewIndex = useAppStore(s => s.setCurrentReviewIndex);
  const activeTrack = useUserStore(s => s.activeTrack);
  const dailyReviewLimit = useUserStore(s => s.dailyReviewLimit);
  const { handleRateCard, handleArchiveCard } = useReviewActions();
  const navigate = useNavigate();

  const reviewQueue = useLiveQuery(async () => {
    const today = new Date().getTime();
    return await db.cards
      .where('language').equals(activeTrack)
      .and(c => c.next_review == null || new Date(c.next_review).getTime() <= today)
      .toArray();
  }, [activeTrack]);

  if (reviewQueue === undefined) return <LoadingSpinner />;

  // Apply daily review limit — only show up to `dailyReviewLimit` cards per session
  const limitedQueue = reviewQueue.slice(0, dailyReviewLimit);
  const totalDue = reviewQueue.length;
  const card = limitedQueue[currentReviewIndex];

  const advanceReviewCard = () => {
    if (currentReviewIndex < limitedQueue.length - 1) {
      setCurrentReviewIndex(currentReviewIndex + 1);
    } else {
      toast.success("Review session complete!");
      navigate('/');
    }
  };

  if (!card) {
    return (
      <div className="w-full text-center space-y-8 pop-in pt-10">
        <h2 className="text-2xl font-black">
          {totalDue > dailyReviewLimit ? 'Daily limit reached!' : 'No cards to review!'}
        </h2>
        {totalDue > dailyReviewLimit && (
          <p className="text-sm font-bold text-text-muted">
            You reviewed {dailyReviewLimit} cards today. {totalDue - dailyReviewLimit} remaining for tomorrow.
          </p>
        )}
        <button onClick={() => navigate('/')} className="btn-3d btn-blue px-6 py-3">Return Home</button>
      </div>
    );
  }

  const progress = ((currentReviewIndex) / limitedQueue.length) * 100;

  return (
    <AnimatedPage>
      <div className="w-full view-enter">
      <div className="w-full mb-8">
        <div className="flex items-center justify-between mb-3">
          <button onClick={() => navigate('/')} className="w-10 h-10 rounded-full flex items-center justify-center text-text-muted hover:bg-gray-bg transition-colors active:scale-95">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          <div className="flex-1 mx-4">
            <div className="h-3 w-full bg-gray-path rounded-full overflow-hidden">
              <div
                className="h-full bg-green transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <span className="text-[10px] font-black text-text-muted uppercase tracking-widest shrink-0">
            {currentReviewIndex + 1}/{limitedQueue.length}
            {totalDue > dailyReviewLimit && <span className="text-gold ml-1">({totalDue} total)</span>}
          </span>
        </div>
      </div>

      <div className="w-full max-w-xl mt-10 view-enter">
        <LocalErrorBoundary key={`review-${card.id}`}>
          <FlashcardView
            card={card}
            onRate={async (rating) => {
              await handleRateCard(card, rating);
              advanceReviewCard();
            }}
            onArchive={async () => {
              await handleArchiveCard(card);
              advanceReviewCard();
            }}
          />
        </LocalErrorBoundary>
      </div>
      </div>
    </AnimatedPage>
  );
}
