import type { Difficulty } from '../types';

const STORAGE_KEY = 'lingo_adaptive_difficulty';

interface AdaptiveState {
  recentCorrect: number;
  recentTotal: number;
  currentDifficulty: Difficulty;
  history: { correct: boolean; timestamp: number }[];
}

const MAX_HISTORY = 20;

export function getAdaptiveState(activeTrack: 'english' | 'japanese'): AdaptiveState {
  try {
    const key = `${STORAGE_KEY}_${activeTrack}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch { /* ignore */ }
  return {
    recentCorrect: 0,
    recentTotal: 0,
    currentDifficulty: 'beginner',
    history: [],
  };
}

export function saveAdaptiveState(activeTrack: 'english' | 'japanese', state: AdaptiveState): void {
  try {
    const key = `${STORAGE_KEY}_${activeTrack}`;
    localStorage.setItem(key, JSON.stringify(state));
  } catch { /* ignore */ }
}

export function recordQuizResult(activeTrack: 'english' | 'japanese', correct: boolean): Difficulty {
  const state = getAdaptiveState(activeTrack);

  // Add to history
  state.history.push({ correct, timestamp: Date.now() });

  // Keep only last MAX_HISTORY entries
  if (state.history.length > MAX_HISTORY) {
    state.history = state.history.slice(-MAX_HISTORY);
  }

  // Calculate recent accuracy (last 10 questions)
  const recent = state.history.slice(-10);
  const recentCorrect = recent.filter(h => h.correct).length;
  const recentTotal = recent.length;

  state.recentCorrect = recentCorrect;
  state.recentTotal = recentTotal;

  // Adjust difficulty based on accuracy
  if (recentTotal >= 5) {
    const accuracy = recentCorrect / recentTotal;

    if (accuracy >= 0.8) {
      // Very good performance - increase difficulty
      if (state.currentDifficulty === 'beginner') {
        state.currentDifficulty = 'intermediate';
      } else if (state.currentDifficulty === 'intermediate') {
        state.currentDifficulty = 'advanced';
      }
    } else if (accuracy < 0.5) {
      // Poor performance - decrease difficulty
      if (state.currentDifficulty === 'advanced') {
        state.currentDifficulty = 'intermediate';
      } else if (state.currentDifficulty === 'intermediate') {
        state.currentDifficulty = 'beginner';
      }
    }
    // 50-80% accuracy = keep current difficulty
  }

  saveAdaptiveState(activeTrack, state);
  return state.currentDifficulty;
}

export function getCurrentDifficulty(activeTrack: 'english' | 'japanese'): Difficulty {
  const state = getAdaptiveState(activeTrack);
  return state.currentDifficulty;
}

export function getAccuracyStats(activeTrack: 'english' | 'japanese'): {
  accuracy: number;
  recentCorrect: number;
  recentTotal: number;
  streak: number;
  difficulty: Difficulty;
} {
  const state = getAdaptiveState(activeTrack);
  const accuracy = state.recentTotal > 0 ? state.recentCorrect / state.recentTotal : 0;

  // Calculate current streak
  let streak = 0;
  for (let i = state.history.length - 1; i >= 0; i--) {
    if (state.history[i].correct) {
      streak++;
    } else {
      break;
    }
  }

  return {
    accuracy,
    recentCorrect: state.recentCorrect,
    recentTotal: state.recentTotal,
    streak,
    difficulty: state.currentDifficulty,
  };
}

export function resetAdaptiveState(activeTrack: 'english' | 'japanese'): void {
  const key = `${STORAGE_KEY}_${activeTrack}`;
  try {
    localStorage.removeItem(key);
  } catch { /* ignore */ }
}
