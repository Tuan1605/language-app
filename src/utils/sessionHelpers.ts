import type { Difficulty } from '../types';

export const trackCategory = (track: 'english' | 'japanese'): 'toeic' | 'n2' =>
  track === 'english' ? 'toeic' : 'n2';

export const difficultyOrder = (d: string): number => d === 'beginner' ? 0 : d === 'intermediate' ? 1 : 2;

export const sortByDifficulty = <T extends { difficulty: string }>(items: T[]): T[] =>
  [...items].sort((a, b) => difficultyOrder(a.difficulty) - difficultyOrder(b.difficulty));

export const sampleAcrossDifficulties = <T extends { difficulty: Difficulty }>(items: T[], total: number): T[] => {
  const byDiff: Record<string, T[]> = { beginner: [], intermediate: [], advanced: [] };
  items.forEach(item => { if (byDiff[item.difficulty]) byDiff[item.difficulty].push(item); });
  const perLevel = Math.max(1, Math.floor(total / 3));
  const sampled = [
    ...byDiff.beginner.slice(0, perLevel),
    ...byDiff.intermediate.slice(0, perLevel),
    ...byDiff.advanced.slice(0, total - perLevel * 2),
  ];
  return sortByDifficulty(sampled);
};
