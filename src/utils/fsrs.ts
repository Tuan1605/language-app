export type State = 'New' | 'Learning' | 'Review' | 'Relearning';
export type Rating = 'Again' | 'Hard' | 'Good' | 'Easy';

export interface FSRSCard {
  due: Date;
  stability: number;
  difficulty: number;
  elapsed_days: number;
  scheduled_days: number;
  reps: number;
  lapses: number;
  state: State;
  last_review: Date;
}

export interface SchedulingInfo {
  card: FSRSCard;
  review_log: FSRSReviewLog;
}

export interface FSRSReviewLog {
  rating: Rating;
  state: State;
  due: Date;
  stability: number;
  difficulty: number;
  elapsed_days: number;
  last_review: Date;
  scheduled_days: number;
  review: Date;
}

// FSRS v4 Default Parameters (19 weights, w[0]..w[18])
const w = [
  0.4, 0.6, 2.4, 5.8, 4.93, 0.94, 0.86, 0.01, 1.49, 0.14, 0.94, 2.18, 0.05, 0.34, 1.26, 0.29, 2.61,
  0.0, 0.0,
];
const request_retention = 0.9;
const maximum_interval = 36500;

export function createEmptyCard(): FSRSCard {
  return {
    due: new Date(),
    stability: 0,
    difficulty: 0,
    elapsed_days: 0,
    scheduled_days: 0,
    reps: 0,
    lapses: 0,
    state: 'New',
    last_review: new Date(),
  };
}

export class FSRS {
  private decay = -0.5;
  private factor = 19 / 81;

  repeat(card: FSRSCard, now: Date): Record<Rating, SchedulingInfo> {
    const scheduling_cards = {
      Again: this.schedule(card, 'Again', now),
      Hard: this.schedule(card, 'Hard', now),
      Good: this.schedule(card, 'Good', now),
      Easy: this.schedule(card, 'Easy', now),
    };
    return scheduling_cards;
  }

  private schedule(card: FSRSCard, rating: Rating, now: Date): SchedulingInfo {
    const s_card = { ...card };
    s_card.elapsed_days = card.state === 'New' ? 0 : Math.max(0, (now.getTime() - card.last_review.getTime()) / 86400000);
    s_card.last_review = now;
    s_card.reps += 1;

    const s = s_card.stability;
    const d = s_card.difficulty;
    const ratingValue = rating === 'Again' ? 1 : rating === 'Hard' ? 2 : rating === 'Good' ? 3 : 4;

    if (s_card.state === 'New') {
      s_card.stability = w[ratingValue - 1];
      s_card.difficulty = w[4] - Math.exp(w[5] * (ratingValue - 1)) + 1;
      s_card.state = rating === 'Again' ? 'Learning' : 'Review';
    } else if (s_card.state === 'Learning' || s_card.state === 'Relearning') {
      s_card.difficulty = this.next_difficulty(d, ratingValue);
      s_card.stability = this.next_short_term_stability(s, ratingValue);
      if (rating !== 'Again') {
        s_card.state = 'Review';
      }
    } else if (s_card.state === 'Review') {
      s_card.difficulty = this.next_difficulty(d, ratingValue);
      const r = this.retrievability(s, s_card.elapsed_days);
      if (rating === 'Again') {
        s_card.lapses += 1;
        s_card.stability = this.next_forget_stability(s, d, r);
        s_card.state = 'Relearning';
      } else {
        s_card.stability = this.next_recall_stability(s, d, r, ratingValue);
      }
    }

    s_card.difficulty = Math.min(Math.max(s_card.difficulty, 1), 10);
    s_card.scheduled_days = this.next_interval(s_card.stability);
    
    // For Again/Hard in learning phase, keep it same day or very short
    if (s_card.state === 'Learning' || s_card.state === 'Relearning') {
      s_card.scheduled_days = 0; // Means due today
    }

    const dueTime = new Date(now.getTime() + s_card.scheduled_days * 86400000);
    s_card.due = dueTime;

    const review_log: FSRSReviewLog = {
      rating,
      state: card.state,
      due: card.due,
      stability: card.stability,
      difficulty: card.difficulty,
      elapsed_days: s_card.elapsed_days,
      last_review: card.last_review,
      scheduled_days: card.scheduled_days,
      review: now,
    };

    return { card: s_card, review_log };
  }

  private next_interval(s: number): number {
    let interval = (s / this.factor) * (Math.pow(request_retention, 1 / this.decay) - 1);
    interval = Math.round(interval);
    return Math.min(Math.max(interval, 1), maximum_interval);
  }

  private next_difficulty(d: number, rating: number): number {
    return d - w[6] * (rating - 3);
  }

  private retrievability(s: number, elapsed_days: number): number {
    return Math.pow(1 + this.factor * (elapsed_days / s), this.decay);
  }

  private next_recall_stability(s: number, d: number, r: number, rating: number): number {
    const hard_penalty = rating === 2 ? w[15] : 1;
    const easy_bonus = rating === 4 ? w[16] : 1;
    return s * (1 + Math.exp(w[8]) * (11 - d) * Math.pow(s, -w[9]) * (Math.exp((1 - r) * w[10]) - 1) * hard_penalty * easy_bonus);
  }

  private next_forget_stability(s: number, d: number, r: number): number {
    return w[11] * Math.pow(d, -w[12]) * Math.pow(s + 1, w[13]) * Math.exp((1 - r) * w[14]);
  }
  
  private next_short_term_stability(s: number, rating: number): number {
     return s * Math.exp(w[17] * (rating - 3 + w[18])); // Optional simple multiplier if we had extended weights, otherwise fallback
  }
}
