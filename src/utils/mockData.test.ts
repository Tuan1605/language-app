import { describe, it, expect } from 'vitest';
import { 
  MOCK_LISTENING_LESSONS, 
  MOCK_SPEAKING_LESSONS, 
  MOCK_DICTATION_LESSONS, 
  MOCK_WRITING_LESSONS,
  MOCK_FULL_EXAMS,
  MOCK_CARDS
} from './mockData';

describe('Mock Data Integrity', () => {
  describe('Listening Lessons', () => {
    it('should have listening lessons', () => {
      expect(MOCK_LISTENING_LESSONS.length).toBeGreaterThan(0);
    });

    it('listening lessons should have required properties', () => {
      MOCK_LISTENING_LESSONS.forEach(lesson => {
        expect(lesson.id).toBeDefined();
        expect(lesson.category).toBeDefined();
        expect(lesson.difficulty).toBeDefined();
        expect(lesson.transcript.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Speaking Lessons', () => {
    it('should have speaking lessons', () => {
      expect(MOCK_SPEAKING_LESSONS.length).toBeGreaterThan(0);
    });

    it('speaking lessons should have target text and translation', () => {
      MOCK_SPEAKING_LESSONS.forEach(lesson => {
        expect(lesson.targetSentence).toBeDefined();
        expect(typeof lesson.targetSentence).toBe('string');
        expect(lesson.targetSentence.length).toBeGreaterThan(0);
        expect(lesson.translation).toBeDefined();
        expect(lesson.category).toBeDefined();
      });
    });
  });

  describe('Dictation Lessons', () => {
    it('should have dictation lessons', () => {
      expect(MOCK_DICTATION_LESSONS.length).toBeGreaterThan(0);
    });

    it('dictation lessons should have id and targetText', () => {
      MOCK_DICTATION_LESSONS.forEach(lesson => {
        expect(lesson.id).toBeDefined();
        expect(lesson.targetText).toBeDefined();
        expect(lesson.translation).toBeDefined();
      });
    });
  });

  describe('Writing Lessons', () => {
    it('should have writing lessons', () => {
      expect(MOCK_WRITING_LESSONS.length).toBeGreaterThan(0);
    });

    it('writing lessons should have sourceText and targetText', () => {
      MOCK_WRITING_LESSONS.forEach(lesson => {
        expect(lesson.id).toBeDefined();
        expect(lesson.sourceText).toBeDefined();
        expect(lesson.targetText).toBeDefined();
        expect(typeof lesson.sourceText).toBe('string');
        expect(typeof lesson.targetText).toBe('string');
      });
    });
  });

  describe('Full Exams', () => {
    it('should have full exams', () => {
      expect(MOCK_FULL_EXAMS.length).toBeGreaterThan(0);
    });

    it('full exams should have tasks', () => {
      MOCK_FULL_EXAMS.forEach(exam => {
        expect(exam.tasks).toBeDefined();
        expect(Array.isArray(exam.tasks)).toBe(true);
        expect(exam.tasks.length).toBeGreaterThan(0);
      });
    });

    it('all exams should be for toeic or n2', () => {
      MOCK_FULL_EXAMS.forEach(exam => {
        expect(['toeic', 'n2']).toContain(exam.category);
      });
    });
  });

  describe('Flashcards (MOCK_CARDS)', () => {
    it('should have mock cards', () => {
      expect(MOCK_CARDS.length).toBeGreaterThan(0);
    });

    it('all mock cards should have required SM2 fields', () => {
      MOCK_CARDS.forEach(card => {
        expect(card.id).toBeDefined();
        expect(card.word).toBeDefined();
        expect(card.definition).toBeDefined();
        expect(typeof card.repetition).toBe('number');
        expect(typeof card.interval).toBe('number');
        expect(typeof card.easiness).toBe('number');
        expect(typeof card.next_review).toBe('string');
        expect(typeof card.created_at).toBe('string');
      });
    });

    it('mock cards should have valid language and category', () => {
      MOCK_CARDS.forEach(card => {
        expect(['english', 'japanese']).toContain(card.language);
        expect(['toeic', 'n2']).toContain(card.category);
      });
    });
  });

  describe('Global Data Rules', () => {
    it('mock data IDs should be unique across all lesson types', () => {
      const ids = new Set();
      let hasDuplicate = false;
      const allLessons = [
        ...MOCK_LISTENING_LESSONS, 
        ...MOCK_SPEAKING_LESSONS, 
        ...MOCK_DICTATION_LESSONS,
        ...MOCK_WRITING_LESSONS
      ];
      
      allLessons.forEach(lesson => {
        if (ids.has(lesson.id)) hasDuplicate = true;
        ids.add(lesson.id);
      });
      expect(hasDuplicate).toBe(false);
    });
  });
});
