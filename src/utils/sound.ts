// Game Sound Engine - Web Audio API based, no external files needed
// Cached AudioContext to avoid memory leak from creating new contexts

let cachedCtx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  try {
    if (!cachedCtx || cachedCtx.state === 'closed') {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AC) return null;
      cachedCtx = new AC();
    }
    if (cachedCtx.state === 'suspended') cachedCtx.resume();
    return cachedCtx;
  } catch {
    return null;
  }
}

function tone(freq: number, start: number, dur: number, type: OscillatorType = 'sine', vol = 0.18) {
  const ctx = getCtx();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0, start);
  gain.gain.linearRampToValueAtTime(vol, start + 0.03);
  gain.gain.exponentialRampToValueAtTime(0.001, start + dur);
  osc.start(start);
  osc.stop(start + dur);
}

// ─── Correct answer ───
export function playCorrect() {
  const ctx = getCtx();
  if (!ctx) return;
  const t = ctx.currentTime;
  tone(880, t, 0.12, 'sine', 0.15);
  tone(1174.66, t + 0.08, 0.18, 'sine', 0.18);
  tone(1567.98, t + 0.16, 0.25, 'sine', 0.12);
}

// ─── Wrong answer ───
export function playWrong() {
  const ctx = getCtx();
  if (!ctx) return;
  const t = ctx.currentTime;
  tone(311, t, 0.15, 'square', 0.1);
  tone(277, t + 0.12, 0.25, 'square', 0.08);
}

// ─── Tile / card match ───
export function playMatch() {
  const ctx = getCtx();
  if (!ctx) return;
  const t = ctx.currentTime;
  tone(1047, t, 0.08, 'sine', 0.12);
  tone(1319, t + 0.06, 0.12, 'sine', 0.15);
  tone(1568, t + 0.12, 0.2, 'triangle', 0.1);
}

// ─── Combo escalation (call with combo count 1,2,3,...) ───
export function playCombo(combo: number) {
  const ctx = getCtx();
  if (!ctx) return;
  const t = ctx.currentTime;
  const base = 660 + combo * 60;
  tone(base, t, 0.06, 'sine', 0.12);
  tone(base * 1.25, t + 0.05, 0.1, 'sine', 0.15);
  if (combo >= 5) tone(base * 1.5, t + 0.1, 0.15, 'triangle', 0.1);
}

// ─── Level complete ───
export function playLevelComplete() {
  const ctx = getCtx();
  if (!ctx) return;
  const t = ctx.currentTime;
  [523, 659, 784, 1047].forEach((f, i) => {
    tone(f, t + i * 0.12, 0.3, 'sine', 0.14);
  });
}

// ─── Game over (sad) ───
export function playGameOver() {
  const ctx = getCtx();
  if (!ctx) return;
  const t = ctx.currentTime;
  tone(440, t, 0.3, 'sawtooth', 0.08);
  tone(370, t + 0.25, 0.35, 'sawtooth', 0.07);
  tone(311, t + 0.55, 0.5, 'sawtooth', 0.06);
}

// ─── Button tap / UI click ───
export function playTap() {
  const ctx = getCtx();
  if (!ctx) return;
  tone(800, ctx.currentTime, 0.04, 'sine', 0.06);
}

// ─── Timer warning tick ───
export function playTimerTick() {
  const ctx = getCtx();
  if (!ctx) return;
  tone(1200, ctx.currentTime, 0.03, 'square', 0.05);
}

// ─── Win / victory fanfare ───
export function playVictory() {
  const ctx = getCtx();
  if (!ctx) return;
  const t = ctx.currentTime;
  const notes = [523, 659, 784, 1047, 784, 1047, 1319];
  notes.forEach((f, i) => {
    tone(f, t + i * 0.1, 0.25, 'sine', 0.13);
    tone(f * 0.5, t + i * 0.1, 0.25, 'triangle', 0.05);
  });
}

// ─── Letter reveal (hangman) ───
export function playLetterReveal() {
  const ctx = getCtx();
  if (!ctx) return;
  tone(1047, ctx.currentTime, 0.06, 'sine', 0.1);
}

// ─── Streak fire (for combo >= 5) ───
export function playStreakFire() {
  const ctx = getCtx();
  if (!ctx) return;
  const t = ctx.currentTime;
  tone(1568, t, 0.05, 'sine', 0.1);
  tone(2093, t + 0.04, 0.08, 'sine', 0.12);
  tone(2637, t + 0.08, 0.12, 'triangle', 0.08);
}

// Legacy exports for backward compat
export const playCorrectSound = playCorrect;
export const playIncorrectSound = playWrong;
