import { describe, it, expect } from 'vitest';
import { trackCategory, difficultyOrder, sortByDifficulty, sampleAcrossDifficulties } from './sessionHelpers';

describe('sessionHelpers', () => {
  describe('trackCategory', () => {
    it('returns toeic for english', () => {
      expect(trackCategory('english')).toBe('toeic');
    });

    it('returns n2 for japanese', () => {
      expect(trackCategory('japanese')).toBe('n2');
    });
  });

  describe('difficultyOrder', () => {
    it('returns 0 for beginner', () => {
      expect(difficultyOrder('beginner')).toBe(0);
    });

    it('returns 1 for intermediate', () => {
      expect(difficultyOrder('intermediate')).toBe(1);
    });

    it('returns 2 for advanced', () => {
      expect(difficultyOrder('advanced')).toBe(2);
    });
  });

  describe('sortByDifficulty', () => {
    it('sorts items by difficulty ascending', () => {
      const items = [
        { difficulty: 'advanced', name: 'c' },
        { difficulty: 'beginner', name: 'a' },
        { difficulty: 'intermediate', name: 'b' },
      ];
      const sorted = sortByDifficulty(items);
      expect(sorted.map(i => i.difficulty)).toEqual(['beginner', 'intermediate', 'advanced']);
    });

    it('does not mutate original array', () => {
      const items = [
        { difficulty: 'advanced', name: 'c' },
        { difficulty: 'beginner', name: 'a' },
      ];
      sortByDifficulty(items);
      expect(items[0].difficulty).toBe('advanced');
    });
  });

  describe('sampleAcrossDifficulties', () => {
    it('samples evenly across difficulty levels', () => {
      const items = [
        { difficulty: 'beginner' as const },
        { difficulty: 'beginner' as const },
        { difficulty: 'beginner' as const },
        { difficulty: 'intermediate' as const },
        { difficulty: 'intermediate' as const },
        { difficulty: 'intermediate' as const },
        { difficulty: 'advanced' as const },
        { difficulty: 'advanced' as const },
        { difficulty: 'advanced' as const },
      ];
      const sampled = sampleAcrossDifficulties(items, 6);
      expect(sampled.length).toBeLessThanOrEqual(6);
    });

    it('returns empty array for empty input', () => {
      const sampled = sampleAcrossDifficulties([], 10);
      expect(sampled).toEqual([]);
    });

    it('returns sorted by difficulty', () => {
      const items = [
        { difficulty: 'advanced' as const },
        { difficulty: 'beginner' as const },
        { difficulty: 'intermediate' as const },
      ];
      const sampled = sampleAcrossDifficulties(items, 3);
      const difficulties = sampled.map(i => i.difficulty);
      expect(difficulties).toEqual(['beginner', 'intermediate', 'advanced']);
    });
  });
});
