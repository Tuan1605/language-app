import { describe, it, expect, vi, beforeEach } from 'vitest';
import { playCorrectSound } from './sound';

describe('Sound Utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call playCorrectSound without throwing', () => {
    const mockCtx = {
      currentTime: 0,
      destination: {},
      createOscillator: vi.fn().mockReturnValue({
        connect: vi.fn(),
        type: '',
        frequency: { value: 0 },
        start: vi.fn(),
        stop: vi.fn(),
      }),
      createGain: vi.fn().mockReturnValue({
        connect: vi.fn(),
        gain: {
          setValueAtTime: vi.fn(),
          linearRampToValueAtTime: vi.fn(),
          exponentialRampToValueAtTime: vi.fn(),
        },
      }),
    };

    (globalThis as any).AudioContext = function () { return mockCtx; };

    expect(() => playCorrectSound()).not.toThrow();
    expect(mockCtx.createOscillator).toHaveBeenCalledTimes(2);
    expect(mockCtx.createGain).toHaveBeenCalledTimes(2);
  });

  it('should not throw when AudioContext is unavailable', () => {
    delete (globalThis as any).AudioContext;
    delete (globalThis as any).webkitAudioContext;

    expect(() => playCorrectSound()).not.toThrow();
  });
});
