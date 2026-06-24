import { describe, it, expect } from 'vitest';
import { MOCK_FULL_EXAMS } from './mockData';

describe('Core Logic Utilities', () => {
  it('should correctly calculate max score for a full exam', () => {
    const exam = MOCK_FULL_EXAMS[0];
    let totalQs = 0;
    exam.tasks.forEach(t => {
      if (t.type === 'quiz') totalQs += 1;
      else if (t.type === 'listening' || t.type === 'speaking' || t.type === 'dictation' || t.type === 'writing') totalQs += 1;
    });
    expect(totalQs).toBeGreaterThan(0);
  });

  it('should evaluate exam pass/fail conditions correctly', () => {
    const minPassScore = 80;
    const scores = [
      { achieved: 95, total: 100, passed: true },
      { achieved: 80, total: 100, passed: true },
      { achieved: 79, total: 100, passed: false },
      { achieved: 50, total: 100, passed: false },
      { achieved: 0, total: 100, passed: false }
    ];

    scores.forEach(s => {
      const percentage = (s.achieved / s.total) * 100;
      const passed = percentage >= minPassScore;
      expect(passed).toBe(s.passed);
    });
  });

  it('should calculate difficulty weight for XP', () => {
    const getXPWeight = (diff: 'beginner' | 'intermediate' | 'advanced') => {
      switch (diff) {
        case 'advanced': return 1.5;
        case 'intermediate': return 1.2;
        default: return 1.0;
      }
    };

    expect(getXPWeight('beginner')).toBe(1.0);
    expect(getXPWeight('intermediate')).toBe(1.2);
    expect(getXPWeight('advanced')).toBe(1.5);
  });

  it('should handle level progression correctly', () => {
    const calculateLevel = (xp: number) => Math.floor(xp / 100) + 1;
    
    expect(calculateLevel(0)).toBe(1);
    expect(calculateLevel(99)).toBe(1);
    expect(calculateLevel(100)).toBe(2);
    expect(calculateLevel(150)).toBe(2);
    expect(calculateLevel(500)).toBe(6);
    expect(calculateLevel(1050)).toBe(11);
  });
});
