import { describe, it, expect } from 'vitest';
import { langForCategory } from './tts';

describe('TTS Utilities', () => {
  it('should return en-US for toeic category', () => {
    expect(langForCategory('toeic')).toBe('en-US');
  });

  it('should return ja-JP for n2 category', () => {
    expect(langForCategory('n2')).toBe('ja-JP');
  });

  it('should return ja-JP for unknown category', () => {
    expect(langForCategory('unknown' as any)).toBe('ja-JP');
  });
});
