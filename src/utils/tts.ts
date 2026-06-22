// Lightweight Text-To-Speech helper built on the Web Speech API.
// Used as a fallback "audio" source for Listening / Dictation / Speaking
// lessons when no real recorded audioUrl is provided.

export function isTTSSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

/**
 * Whether the current browser exposes the SpeechRecognition API.
 * Firefox does NOT implement this — Speaking practice requires Chrome/Edge.
 */
export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
}

export type TTSLang = 'en-US' | 'ja-JP';

// Module-level cache of available voices. Refreshed by onvoiceschanged so
// callers always see the freshest list (voices load async in many browsers,
// especially Firefox on Windows where they arrive late).
let cachedVoices: SpeechSynthesisVoice[] = [];

function readVoices(): SpeechSynthesisVoice[] {
  if (!isTTSSupported()) return [];
  // Always pull fresh from the browser — getVoices() is cheap and is the
  // only reliable way to notice voices that finished loading after startup.
  const fresh = window.speechSynthesis.getVoices();
  if (fresh.length > 0) {
    cachedVoices = fresh;
  }
  return cachedVoices;
}

if (isTTSSupported()) {
  // Warm up the voice list as early as possible. On Windows/Firefox the
  // first getVoices() call often returns [] and only fires onvoiceschanged
  // a moment later — calling it here kicks that load off immediately.
  readVoices();

  // Append our handler instead of overwriting any existing one, so this
  // stays robust under HMR / multiple registrations.
  const refresh = () => {
    cachedVoices = window.speechSynthesis.getVoices();
  };
  window.speechSynthesis.addEventListener('voiceschanged', refresh);
}

function pickVoice(lang: TTSLang): SpeechSynthesisVoice | undefined {
  const voices = readVoices();
  return (
    voices.find((v) => v.lang === lang) ||
    voices.find((v) => v.lang.startsWith(lang.split('-')[0]))
  );
}

/** True when TTS is supported AND at least one voice for `lang` is loaded. */
export function hasVoiceFor(lang: TTSLang): boolean {
  return isTTSSupported() && readVoices().some((v) => v.lang === lang || v.lang.startsWith(lang.split('-')[0]));
}

export interface SpeakOptions {
  lang?: TTSLang;
  rate?: number;
  onEnd?: () => void;
  onStart?: () => void;
}

/**
 * Speak the given text. Cancels any currently playing utterance first.
 * Returns true if speech was started, false if TTS is unsupported.
 */
export function speak(text: string, options: SpeakOptions = {}): boolean {
  if (!isTTSSupported() || !text) {
    options.onEnd?.();
    return false;
  }
  const { lang = 'en-US', rate = 0.95, onEnd, onStart } = options;

  window.speechSynthesis.cancel();

  // Chrome has a known bug where speechSynthesis freezes after ~15 s of
  // continuous speaking and never fires onend. A quick pause/resume cycle
  // immediately before speaking resets the internal timer and prevents the
  // freeze. Safe to call on other browsers (no-op if nothing is active).
  window.speechSynthesis.pause();
  window.speechSynthesis.resume();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = rate;

  // If a voice for this language is already loaded, use it. If not, still
  // try to speak — the browser may fall back to a default voice, or voices
  // may finish loading right after this and a subsequent call picks them up.
  const voice = pickVoice(lang);
  if (voice) utterance.voice = voice;

  if (onStart) utterance.onstart = onStart;
  utterance.onend = () => onEnd?.();
  utterance.onerror = () => onEnd?.();

  window.speechSynthesis.speak(utterance);
  return true;
}

export function stopSpeaking(): void {
  if (isTTSSupported()) window.speechSynthesis.cancel();
}

/** Map a lesson category to the appropriate TTS language. */
export function langForCategory(
  category: 'toeic' | 'n2' | 'english' | 'japanese',
): TTSLang {
  // 'english'/'japanese' are the per-card language tags used by Flashcards;
  // 'toeic'/'n2' are the per-lesson category tags. Both map to the same voices.
  return category === 'toeic' || category === 'english' ? 'en-US' : 'ja-JP';
}
