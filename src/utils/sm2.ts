import type { ReviewGrade } from '../types';

export interface SM2Result {
  repetition: number;
  interval: number;
  easiness: number;
}

export function calculateSM2(
  grade: ReviewGrade,
  previousRepetition: number,
  previousInterval: number,
  previousEasiness: number
): SM2Result {
  let repetition: number;
  let interval: number;
  let easiness: number;

  if (grade >= 3) {
    if (previousRepetition === 0) {
      repetition = 1;
      interval = 1;
    } else if (previousRepetition === 1) {
      repetition = 2;
      interval = 6;
    } else {
      repetition = previousRepetition + 1;
      const exactInterval = previousInterval * previousEasiness;
      const fuzz = 0.95 + Math.random() * 0.1; // +/- 5%
      interval = Math.round(exactInterval * fuzz);
    }
    
    easiness = previousEasiness + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02));
    if (interval > 365) interval = 365;
  } else {
    repetition = 0;
    interval = 1;
    easiness = previousEasiness;
  }

  if (easiness < 1.3) {
    easiness = 1.3;
  }

  return { repetition, interval, easiness };
}

export function getNextReviewDate(intervalDays: number): string {
  const date = new Date();
  date.setDate(date.getDate() + intervalDays);
  return date.toISOString();
}
