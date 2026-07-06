import { db } from '../data/db';
import { FSRS, type FSRSCard, type Rating } from '../utils/fsrs';
import type { Flashcard } from '../types';
import toast from 'react-hot-toast';

export function useReviewActions() {
  const handleRateCard = async (card: Flashcard, rating: Rating) => {
    const fsrs = new FSRS();
    const fsrsCard: FSRSCard = {
      due: card.next_review ? new Date(card.next_review) : new Date(),
      stability: card.stability || 0,
      difficulty: card.fsrs_difficulty || 0,
      elapsed_days: 0,
      scheduled_days: 0,
      reps: card.reps || 0,
      lapses: card.lapses || 0,
      state: card.state || 'New',
      last_review: card.last_review ? new Date(card.last_review) : new Date()
    };

    const schedulingInfo = fsrs.repeat(fsrsCard, new Date())[rating];
    const newFsrsCard = schedulingInfo.card;
    const reviewLog = schedulingInfo.review_log;

    const updatedCard = {
      ...card,
      stability: newFsrsCard.stability,
      fsrs_difficulty: newFsrsCard.difficulty,
      reps: newFsrsCard.reps,
      lapses: newFsrsCard.lapses,
      state: newFsrsCard.state,
      next_review: newFsrsCard.due.toISOString(),
      last_review: new Date().toISOString()
    };

    try {
      await db.cards.put(updatedCard);
      await db.reviewLogs.add({
        id: crypto.randomUUID(),
        cardId: card.id,
        rating: reviewLog.rating,
        state: reviewLog.state,
        due: reviewLog.due.toISOString(),
        stability: reviewLog.stability,
        difficulty: reviewLog.difficulty,
        elapsed_days: reviewLog.elapsed_days,
        last_review: reviewLog.last_review ? reviewLog.last_review.toISOString() : null,
        scheduled_days: reviewLog.scheduled_days,
        review: reviewLog.review.toISOString()
      });
    } catch (e) {
      console.error('Failed to save review:', e);
      toast.error('Failed to save review progress.');
    }
  };

  const handleArchiveCard = async (card: Flashcard) => {
    try {
      await db.cards.delete(card.id);
    } catch (e) {
      console.error('Failed to archive card:', e);
      toast.error('Failed to remove card.');
    }
  };

  return {
    handleRateCard,
    handleArchiveCard,
  };
}
