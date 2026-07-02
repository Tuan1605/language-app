import { describe, it, expect } from 'vitest';
import { sanitizeInput, validateImportSchema, maskApiKey } from './sanitize';

describe('sanitize', () => {
  describe('sanitizeInput', () => {
    it('strips HTML tags but keeps content', () => {
      expect(sanitizeInput('<script>alert("xss")</script>Hello')).toBe('alert("xss")Hello');
    });

    it('strips event handlers but keeps attribute values', () => {
      expect(sanitizeInput('text onclick="alert(1)" more')).toBe('text "alert(1)" more');
    });

    it('strips javascript: protocol', () => {
      expect(sanitizeInput('javascript:alert(1)')).toBe('alert(1)');
    });

    it('strips data: protocol', () => {
      expect(sanitizeInput('data:text/html,<h1>hi</h1>')).toBe('text/html,hi');
    });

    it('trims whitespace', () => {
      expect(sanitizeInput('  hello  ')).toBe('hello');
    });

    it('preserves normal text', () => {
      expect(sanitizeInput('Hello, how are you?')).toBe('Hello, how are you?');
    });

    it('handles empty string', () => {
      expect(sanitizeInput('')).toBe('');
    });
  });

  describe('validateImportSchema', () => {
    it('returns true for valid schema', () => {
      expect(validateImportSchema({ version: 1, cards: [] })).toBe(true);
    });

    it('returns true with all fields', () => {
      expect(validateImportSchema({
        version: 1,
        cards: [],
        mistakes: [],
        examResults: [],
        customExams: [],
        userPrefs: { unlockedEn: [1], unlockedJa: [1] },
      })).toBe(true);
    });

    it('returns false for null', () => {
      expect(validateImportSchema(null)).toBe(false);
    });

    it('returns false for missing version', () => {
      expect(validateImportSchema({ cards: [] })).toBe(false);
    });

    it('returns false for non-array cards', () => {
      expect(validateImportSchema({ version: 1, cards: 'not-array' })).toBe(false);
    });

    it('returns false for non-array mistakes', () => {
      expect(validateImportSchema({ version: 1, mistakes: 'not-array' })).toBe(false);
    });
  });

  describe('maskApiKey', () => {
    it('masks long keys correctly', () => {
      const key = 'sk-12345678901234567890';
      const masked = maskApiKey(key);
      expect(masked).toBe('sk-12345••••7890');
      expect(masked.length).toBeLessThan(key.length);
    });

    it('masks short keys with all dots', () => {
      const key = 'short';
      const masked = maskApiKey(key);
      expect(masked).toBe('••••••••••••');
    });

    it('never reveals full key', () => {
      const key = 'sk-proj-very-secret-key-12345';
      const masked = maskApiKey(key);
      expect(masked).not.toBe(key);
      expect(masked).toContain('••••');
    });
  });
});
