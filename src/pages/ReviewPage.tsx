import { useState, useEffect, useRef } from 'react';
import { AnimatedPage } from '../components/AnimatedPage';
import { useUserStore } from '../stores/useUserStore';
import { db } from '../data/db';
import { useLiveQuery } from 'dexie-react-hooks';
import { useReviewActions } from '../hooks/useReviewActions';
import { FlashcardView } from '../components/FlashcardView';
import { LocalErrorBoundary } from '../components/LocalErrorBoundary';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export function ReviewPage() {
  const activeTrack = useUserStore(s => s.activeTrack);
  const dailyReviewLimit = useUserStore(s => s.dailyReviewLimit);
  const { handleRateCard, handleArchiveCard } = useReviewActions();
  const navigate = useNavigate();
  const [reviewedIds, setReviewedIds] = useState<Set<string>>(new Set());
  const completedRef = useRef(false);

  const reviewQueue = useLiveQuery(async () => {
    const today = new Date().getTime();
    return await db.cards
      .where('language').equals(activeTrack)
      .and(c => c.next_review == null || new Date(c.next_review).getTime() <= today)
      .toArray();
  }, [activeTrack]);

  if (reviewQueue === undefined) return <LoadingSpinner />;

  const limitedQueue = reviewQueue.slice(0, dailyReviewLimit);
  const totalDue = reviewQueue.length;
  const card = limitedQueue.find(c => !reviewedIds.has(c.id));
  const reviewedCount = limitedQueue.filter(c => reviewedIds.has(c.id)).length;

  useEffect(() => {
    if (!card && !completedRef.current && reviewQueue.length > 0) {
      completedRef.current = true;
      toast.success("Review session complete!");
      navigate('/');
    }
  }, [card, reviewQueue.length, navigate]);

  if (!card) return null;

  const progress = (reviewedCount / limitedQueue.length) * 100;

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
            {reviewedCount + 1}/{limitedQueue.length}
            {totalDue > dailyReviewLimit && <span className="text-gold ml-1">({totalDue} total)</span>}
          </span>
        </div>
      </div>

      <div className="w-full max-w-xl mt-10 view-enter">
        <LocalErrorBoundary key={`review-${card.id}`}>
          <FlashcardView
            card={card}
            onRate={async (rating) => {
              setReviewedIds(prev => new Set(prev).add(card.id));
              await handleRateCard(card, rating);
            }}
            onArchive={async () => {
              setReviewedIds(prev => new Set(prev).add(card.id));
              await handleArchiveCard(card);
            }}
          />
        </LocalErrorBoundary>
      </div>
      </div>
    </AnimatedPage>
  );
}
