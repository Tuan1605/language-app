import { describe, it, expect } from 'vitest';
import { calculateSM2, getNextReviewDate } from './sm2';
import type { ReviewGrade } from '../types';

describe('SM-2 Algorithm', () => {
  it('should increase repetition and interval for grade >= 3', () => {
    const grades: ReviewGrade[] = [3, 4, 5];
    grades.forEach(grade => {
      const result = calculateSM2(grade, 0, 0, 2.5);
      expect(result.repetition).toBe(1);
      expect(result.interval).toBe(1);
      
      const result2 = calculateSM2(grade, 1, 1, 2.5);
      expect(result2.repetition).toBe(2);
      expect(result2.interval).toBe(6);
      
      const result3 = calculateSM2(grade, 2, 6, 2.5);
      expect(result3.repetition).toBe(3);
      expect(result3.interval).toBeGreaterThan(6);
    });
  });

  it('should reset repetition and interval for grade < 3', () => {
    const grades: ReviewGrade[] = [0, 1, 2];
    grades.forEach(grade => {
      const result = calculateSM2(grade, 5, 30, 2.5);
      expect(result.repetition).toBe(0);
      expect(result.interval).toBe(1);
      expect(result.easiness).toBe(2.5);
    });
  });

  it('should not let easiness drop below 1.3', () => {
    const result = calculateSM2(0, 5, 30, 1.3);
    expect(result.easiness).toBe(1.3);
  });

  it('should calculate next review date correctly', () => {
    const nextReview = getNextReviewDate(1);
    const date = new Date(nextReview);
    const now = new Date();
    // It should be around 1 day from now
    const diff = date.getTime() - now.getTime();
    const diffDays = Math.round(diff / (1000 * 3600 * 24));
    expect(diffDays).toBe(1);
  });
});
