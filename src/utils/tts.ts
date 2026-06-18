// Lightweight Text-To-Speech helper built on the Web Speech API.
// Used as a fallback "audio" source for Listening / Dictation / Speaking
// lessons when no real recorded audioUrl is provided.

export function isTTSSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

export type TTSLang = 'en-US' | 'ja-JP';

let cachedVoices: SpeechSynthesisVoice[] = [];

function loadVoices(): SpeechSynthesisVoice[] {
  if (!isTTSSupported()) return [];
  if (cachedVoices.length === 0) {
    cachedVoices = window.speechSynthesis.getVoices();
  }
  return cachedVoices;
}

if (isTTSSupported()) {
  // Voices load asynchronously in most browsers.
  window.speechSynthesis.onvoiceschanged = () => {
    cachedVoices = window.speechSynthesis.getVoices();
  };
}

function pickVoice(lang: TTSLang): SpeechSynthesisVoice | undefined {
  const voices = loadVoices();
  return (
    voices.find((v) => v.lang === lang) ||
    voices.find((v) => v.lang.startsWith(lang.split('-')[0]))
  );
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

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = rate;
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
export function langForCategory(category: 'toeic' | 'n2'): TTSLang {
  return category === 'toeic' ? 'en-US' : 'ja-JP';
}
