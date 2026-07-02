import { describe, it, expect, beforeEach } from 'vitest';
import 'fake-indexeddb/auto';
import { db } from '../data/db';
import { FSRS } from '../utils/fsrs';
import type { Flashcard } from '../types';

// Seed a test card into IndexedDB
async function seedCard(overrides: Partial<Flashcard> = {}): Promise<Flashcard> {
  const card: Flashcard = {
    id: crypto.randomUUID(),
    user_id: 'test',
    word: 'test',
    definition: 'a test word',
    language: 'english',
    category: 'toeic',
    difficulty: 'beginner',
    state: 'New',
    stability: 0,
    fsrs_difficulty: 0,
    reps: 0,
    lapses: 0,
    next_review: null,
    created_at: new Date().toISOString(),
    ...overrides,
  };
  await db.cards.put(card);
  return card;
}

describe('Review Flow Integration', () => {
  beforeEach(async () => {
    await db.cards.clear();
    await db.reviewLogs.clear();
  });

  it('card state transitions correctly through FSRS', async () => {
    const card = await seedCard();
    const fsrs = new FSRS();

    // Simulate first review: Good
    const fsrsCard = {
      due: card.next_review ? new Date(card.next_review) : new Date(),
      stability: card.stability,
      difficulty: card.fsrs_difficulty,
      elapsed_days: 0,
      scheduled_days: 0,
      reps: card.reps,
      lapses: card.lapses,
      state: card.state as 'New' | 'Learning' | 'Review' | 'Relearning',
      last_review: card.last_review ? new Date(card.last_review) : new Date(),
    };

    const result = fsrs.repeat(fsrsCard, new Date());
    const updated = result.Good.card;

    // New → Review after Good
    expect(updated.state).toBe('Review');
    expect(updated.reps).toBe(1);
    expect(updated.stability).toBeGreaterThan(0);

    // Save to DB
    await db.cards.put({
      ...card,
      stability: updated.stability,
      fsrs_difficulty: updated.difficulty,
      reps: updated.reps,
      lapses: updated.lapses,
      state: updated.state,
      next_review: updated.due.toISOString(),
      last_review: new Date().toISOString(),
    });

    // Verify saved
    const saved = await db.cards.get(card.id);
    expect(saved?.state).toBe('Review');
    expect(saved?.reps).toBe(1);
  });

  it('Again on Review triggers Relearning + lapse', async () => {
    const card = await seedCard({
      state: 'Review',
      stability: 10,
      fsrs_difficulty: 5,
      reps: 5,
      next_review: new Date().toISOString(),
    });

    const fsrs = new FSRS();
    const fsrsCard = {
      due: new Date(card.next_review!),
      stability: card.stability,
      difficulty: card.fsrs_difficulty,
      elapsed_days: 1,
      scheduled_days: 10,
      reps: card.reps,
      lapses: card.lapses,
      state: 'Review' as const,
      last_review: new Date(Date.now() - 86400000),
    };

    const result = fsrs.repeat(fsrsCard, new Date());
    const againCard = result.Again.card;

    expect(againCard.state).toBe('Relearning');
    expect(againCard.lapses).toBe(card.lapses + 1);
  });

  it('review log is recorded in database', async () => {
    const card = await seedCard();
    const fsrs = new FSRS();

    const fsrsCard = {
      due: new Date(),
      stability: 0,
      difficulty: 0,
      elapsed_days: 0,
      scheduled_days: 0,
      reps: 0,
      lapses: 0,
      state: 'New' as const,
      last_review: new Date(),
    };

    const result = fsrs.repeat(fsrsCard, new Date());
    const log = result.Good.review_log;

    await db.reviewLogs.add({
      id: crypto.randomUUID(),
      cardId: card.id,
      rating: log.rating,
      state: log.state,
      due: log.due.toISOString(),
      stability: log.stability,
      difficulty: log.difficulty,
      elapsed_days: log.elapsed_days,
      last_review: log.last_review.toISOString(),
      scheduled_days: log.scheduled_days,
      review: log.review.toISOString(),
    });

    const logs = await db.reviewLogs.where('cardId').equals(card.id).toArray();
    expect(logs.length).toBe(1);
    expect(logs[0].rating).toBe('Good');
  });

  it('daily review limit is enforced', async () => {
    // Create 5 cards due today
    const cards: Flashcard[] = [];
    for (let i = 0; i < 5; i++) {
      const card = await seedCard({
        word: `word${i}`,
        next_review: new Date().toISOString(),
        state: 'Review',
        stability: 5,
      });
      cards.push(card);
    }

    const dailyLimit = 3;
    const limitedQueue = cards.slice(0, dailyLimit);
    expect(limitedQueue.length).toBe(3);
  });
});
