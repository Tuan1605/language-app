import { describe, it, expect } from 'vitest';
import { FSRS, createEmptyCard, type FSRSCard, type Rating } from './fsrs';

describe('FSRS Algorithm', () => {
  const fsrs = new FSRS();

  describe('createEmptyCard', () => {
    it('creates a card with default values', () => {
      const card = createEmptyCard();
      expect(card.state).toBe('New');
      expect(card.stability).toBe(0);
      expect(card.difficulty).toBe(0);
      expect(card.reps).toBe(0);
      expect(card.lapses).toBe(0);
      expect(card.due).toBeInstanceOf(Date);
      expect(card.last_review).toBeInstanceOf(Date);
    });
  });

  describe('repeat', () => {
    it('returns scheduling info for all 4 ratings', () => {
      const card = createEmptyCard();
      const result = fsrs.repeat(card, new Date());

      expect(result).toHaveProperty('Again');
      expect(result).toHaveProperty('Hard');
      expect(result).toHaveProperty('Good');
      expect(result).toHaveProperty('Easy');
    });

    it('each rating produces valid card and review_log', () => {
      const card = createEmptyCard();
      const result = fsrs.repeat(card, new Date());

      for (const rating of ['Again', 'Hard', 'Good', 'Easy'] as Rating[]) {
        const { card: newCard, review_log } = result[rating];
        expect(newCard).toBeDefined();
        expect(review_log).toBeDefined();
        expect(review_log.rating).toBe(rating);
        expect(review_log.due).toBeInstanceOf(Date);
        expect(review_log.review).toBeInstanceOf(Date);
        expect(typeof newCard.stability).toBe('number');
        expect(typeof newCard.difficulty).toBe('number');
      }
    });

    it('Good on New card transitions to Review state', () => {
      const card = createEmptyCard();
      const result = fsrs.repeat(card, new Date());
      expect(result.Good.card.state).toBe('Review');
    });

    it('Again on New card transitions to Learning state', () => {
      const card = createEmptyCard();
      const result = fsrs.repeat(card, new Date());
      expect(result.Again.card.state).toBe('Learning');
    });

    it('Easy on New card transitions to Review state', () => {
      const card = createEmptyCard();
      const result = fsrs.repeat(card, new Date());
      expect(result.Easy.card.state).toBe('Review');
    });

    it('increments reps by 1', () => {
      const card = createEmptyCard();
      const result = fsrs.repeat(card, new Date());
      expect(result.Good.card.reps).toBe(1);
    });

    it('Again on Review card increments lapses', () => {
      const card: FSRSCard = {
        ...createEmptyCard(),
        state: 'Review',
        stability: 10,
        reps: 5,
      };
      const result = fsrs.repeat(card, new Date());
      expect(result.Again.card.lapses).toBe(card.lapses + 1);
      expect(result.Again.card.state).toBe('Relearning');
    });

    it('Good on Review card stays in Review state', () => {
      const card: FSRSCard = {
        ...createEmptyCard(),
        state: 'Review',
        stability: 10,
        reps: 5,
      };
      const result = fsrs.repeat(card, new Date());
      expect(result.Good.card.state).toBe('Review');
    });

    it('Again on Learning card stays in Learning state', () => {
      const card: FSRSCard = {
        ...createEmptyCard(),
        state: 'Learning',
        stability: 2,
        reps: 1,
      };
      const result = fsrs.repeat(card, new Date());
      expect(result.Again.card.state).toBe('Learning');
    });

    it('Good on Learning card transitions to Review', () => {
      const card: FSRSCard = {
        ...createEmptyCard(),
        state: 'Learning',
        stability: 2,
        reps: 1,
      };
      const result = fsrs.repeat(card, new Date());
      expect(result.Good.card.state).toBe('Review');
    });

    it('difficulty stays within bounds [1, 10]', () => {
      const card = createEmptyCard();
      // Rate multiple times
      let current = card;
      for (let i = 0; i < 20; i++) {
        const result = fsrs.repeat(current, new Date());
        current = result.Again.card;
        expect(current.difficulty).toBeGreaterThanOrEqual(1);
        expect(current.difficulty).toBeLessThanOrEqual(10);
      }
    });

    it('stability is always positive after first review', () => {
      const card = createEmptyCard();
      const result = fsrs.repeat(card, new Date());
      expect(result.Good.card.stability).toBeGreaterThan(0);
      expect(result.Easy.card.stability).toBeGreaterThan(0);
    });

    it('Easy produces higher or equal stability than Good', () => {
      const card: FSRSCard = {
        ...createEmptyCard(),
        state: 'Review',
        stability: 5,
        difficulty: 5,
        reps: 3,
      };
      const result = fsrs.repeat(card, new Date());
      expect(result.Easy.card.stability).toBeGreaterThanOrEqual(result.Good.card.stability);
    });

    it('review_log captures pre-state values', () => {
      const card: FSRSCard = {
        ...createEmptyCard(),
        state: 'Review',
        stability: 5,
        difficulty: 3,
        reps: 2,
      };
      const result = fsrs.repeat(card, new Date());
      expect(result.Good.review_log.state).toBe('Review');
      expect(result.Good.review_log.stability).toBe(5);
      expect(result.Good.review_log.difficulty).toBe(3);
    });
  });
});
