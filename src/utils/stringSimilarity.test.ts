import { describe, it, expect } from 'vitest';
import { calculateSimilarity } from './stringSimilarity';

describe('calculateSimilarity', () => {
  it('should return 100 for identical strings', () => {
    expect(calculateSimilarity('hello world', 'hello world')).toBe(100);
    expect(calculateSimilarity('HELLO', 'HELLO')).toBe(100);
    expect(calculateSimilarity('', '')).toBe(100);
    expect(calculateSimilarity('a', 'a')).toBe(100);
    expect(calculateSimilarity('123', '123')).toBe(100);
  });

  it('should be case insensitive', () => {
    expect(calculateSimilarity('Hello World', 'hello world')).toBe(100);
    expect(calculateSimilarity('Test Case', 'TEST CASE')).toBe(100);
    expect(calculateSimilarity('aBcD', 'AbCd')).toBe(100);
  });

  it('should ignore punctuation', () => {
    expect(calculateSimilarity('Hello, world!', 'Hello world')).toBe(100);
    expect(calculateSimilarity('Wait... what?', 'Wait what')).toBe(100);
    expect(calculateSimilarity('Yes.', 'Yes')).toBe(100);
    expect(calculateSimilarity('O.K.', 'OK')).toBe(100);
  });

  it('should calculate partial similarity correctly', () => {
    const sim1 = calculateSimilarity('kitten', 'sitting');
    expect(sim1).toBeGreaterThan(0);
    expect(sim1).toBeLessThan(100);

    const sim2 = calculateSimilarity('apple', 'apples');
    expect(sim2).toBeGreaterThan(0);
  });

  it('should return 0 for empty vs non-empty strings', () => {
    expect(calculateSimilarity('', 'hello')).toBe(0);
    expect(calculateSimilarity('world', '')).toBe(0);
  });

  it('should handle numbers', () => {
    expect(calculateSimilarity('12345', '12345')).toBe(100);
    expect(calculateSimilarity('12345', '12354')).toBeGreaterThan(0);
  });

  it('should handle japanese text', () => {
    expect(calculateSimilarity('こんにちは', 'こんにちは')).toBe(100);
    expect(calculateSimilarity('さようなら', 'さよなら')).toBeGreaterThan(0);
    expect(calculateSimilarity('ありがとう', 'ありがと')).toBeGreaterThan(0);
  });

  it('should handle strings with multiple spaces', () => {
    expect(calculateSimilarity('hello   world', 'hello world')).toBe(100);
    expect(calculateSimilarity('   test   ', 'test')).toBe(100);
    expect(calculateSimilarity('a  b  c', 'a b c')).toBe(100);
  });
});
