import { describe, it, expect } from 'vitest';
import { AUTHENTIC_EXAMS } from './authenticExams';

describe('Authentic Exams Data Validation', () => {
  it('should have a non-empty array of exams', () => {
    expect(AUTHENTIC_EXAMS).toBeDefined();
    expect(Array.isArray(AUTHENTIC_EXAMS)).toBe(true);
    expect(AUTHENTIC_EXAMS.length).toBeGreaterThan(0);
  });

  it('each exam should have valid top-level properties', () => {
    AUTHENTIC_EXAMS.forEach(exam => {
      expect(exam.id).toBeTruthy();
      expect(typeof exam.id).toBe('string');
      
      expect(exam.title).toBeTruthy();
      expect(typeof exam.title).toBe('string');
      
      expect(exam.year).toBeGreaterThanOrEqual(2000);
      expect(exam.timeLimitMinutes).toBeGreaterThan(0);
      
      expect(['toeic', 'n2']).toContain(exam.category);
      
      expect(Array.isArray(exam.sections)).toBe(true);
      expect(exam.sections.length).toBeGreaterThan(0);
    });
  });

  it('each section should have valid structure', () => {
    AUTHENTIC_EXAMS.forEach(exam => {
      exam.sections.forEach(section => {
        expect(section.id).toBeTruthy();
        expect(section.title).toBeTruthy();
        
        expect(Array.isArray(section.questions)).toBe(true);
        expect(section.questions.length).toBeGreaterThan(0);
      });
    });
  });

  it('each question should be correctly formatted', () => {
    AUTHENTIC_EXAMS.forEach(exam => {
      exam.sections.forEach(section => {
        section.questions.forEach(question => {
          expect(question.id).toBeTruthy();
          
          expect(Array.isArray(question.options)).toBe(true);
          expect(question.options.length).toBeGreaterThanOrEqual(2);
          
          expect(typeof question.correctAnswer).toBe('number');
          expect(question.correctAnswer).toBeGreaterThanOrEqual(0);
          expect(question.correctAnswer).toBeLessThan(question.options.length);
          
          if (question.text) {
            expect(typeof question.text).toBe('string');
          }
          
          if (question.passage) {
            expect(typeof question.passage).toBe('string');
          }
          
          // Question must have either text, passage, image, or audio
          const hasContent = !!(question.text || question.passage || question.imageUrl || question.audioUrl);
          expect(hasContent).toBe(true);
        });
      });
    });
  });

  it('should not contain duplicate question IDs', () => {
    const ids = new Set<string>();
    AUTHENTIC_EXAMS.forEach(exam => {
      exam.sections.forEach(section => {
        section.questions.forEach(question => {
          expect(ids.has(question.id)).toBe(false);
          ids.add(question.id);
        });
      });
    });
  });
});
