// Robust Text-To-Speech helper with multiple fallback strategies:
//
// 1. Web Speech API (speechSynthesis) — best quality when voices are available
// 2. Audio-based TTS via Google Translate endpoint — works on all platforms
//    even when no system voices are installed (common on Linux)
//
// The speak() function automatically picks the best available method.

export function isTTSSupported(): boolean {
  // We always return true now because the Audio fallback works everywhere
  return typeof window !== 'undefined';
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

// ---------------------------------------------------------------------------
// Web Speech API voice management
// ---------------------------------------------------------------------------

let cachedVoices: SpeechSynthesisVoice[] = [];

function speechSynthAvailable(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

function readVoices(): SpeechSynthesisVoice[] {
  if (!speechSynthAvailable()) return [];
  const fresh = window.speechSynthesis.getVoices();
  if (fresh.length > 0) {
    cachedVoices = fresh;
  }
  return cachedVoices;
}

if (speechSynthAvailable()) {
  readVoices();
  const refresh = () => {
    cachedVoices = window.speechSynthesis.getVoices();
  };
  window.speechSynthesis.addEventListener('voiceschanged', refresh);
}



/** True when we can speak the `lang`. Now always true because we have the Audio fallback! */
export function hasVoiceFor(_lang: TTSLang): boolean {
  return true;
}

// ---------------------------------------------------------------------------
// Audio-based TTS fallback (Google Translate endpoint)
// ---------------------------------------------------------------------------

// Track the currently playing Audio element so we can stop it on demand.
let currentAudio: HTMLAudioElement | null = null;

/**
 * Map our internal lang codes to Google Translate language codes.
 */
function ttsLangToGoogleLang(lang: TTSLang): string {
  return lang === 'ja-JP' ? 'ja' : 'en';
}

/**
 * Split text into chunks of at most `maxLen` characters, breaking on sentence
 * boundaries where possible.  Google Translate TTS has a ~200 char limit per
 * request.
 */
function splitTextForTTS(text: string, maxLen = 180): string[] {
  if (text.length <= maxLen) return [text];

  const chunks: string[] = [];
  let remaining = text;

  while (remaining.length > 0) {
    if (remaining.length <= maxLen) {
      chunks.push(remaining);
      break;
    }

    // Try to break at sentence boundaries first
    let breakIdx = -1;
    for (const sep of ['. ', '。', '！', '？', '! ', '? ', '; ', '、']) {
      const idx = remaining.lastIndexOf(sep, maxLen);
      if (idx > 0 && idx > breakIdx) {
        breakIdx = idx + sep.length;
      }
    }

    // Fall back to space or just hard-cut
    if (breakIdx <= 0) {
      breakIdx = remaining.lastIndexOf(' ', maxLen);
      if (breakIdx <= 0) breakIdx = maxLen;
    }

    chunks.push(remaining.slice(0, breakIdx).trim());
    remaining = remaining.slice(breakIdx).trim();
  }

  return chunks.filter((c) => c.length > 0);
}

/**
 * Play text using Audio elements pointed at the Google Translate TTS endpoint.
 * This is the most reliable cross-platform approach and works even when no
 * system speech voices are installed.
 */
function speakViaAudio(
  text: string,
  lang: TTSLang,
  onStart?: () => void,
  onEnd?: () => void,
): void {
  // Stop any currently playing audio
  stopAudioPlayback();


  const chunks = splitTextForTTS(text);

  let chunkIdx = 0;
  let started = false;

  const playNextChunk = () => {
    if (chunkIdx >= chunks.length) {
      currentAudio = null;
      onEnd?.();
      return;
    }

    const langCode = ttsLangToGoogleLang(lang);
    const chunk = chunks[chunkIdx];
    const url = `https://lingva.ml/api/v1/audio/${langCode}/${encodeURIComponent(chunk)}`;

    console.log('[TTS] Fetching Audio from Lingva URL:', url);

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`Lỗi HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (!data.audio) throw new Error('Dữ liệu âm thanh trống');
        
        // data.audio is a JSON array of integers (bytes)
        const audioArray = data.audio;
        if (!Array.isArray(audioArray)) {
          throw new Error('Dữ liệu âm thanh không hợp lệ từ máy chủ');
        }

        const len = audioArray.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = audioArray[i];
        }

        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContextClass) {
          throw new Error('Trình duyệt không hỗ trợ Web Audio API');
        }

        const audioCtx = new AudioContextClass();
        currentAudioCtx = audioCtx; // Store globally to allow stopping

        audioCtx.decodeAudioData(bytes.buffer, (buffer) => {
          const source = audioCtx.createBufferSource();
          source.buffer = buffer;
          source.connect(audioCtx.destination);
          currentAudioSource = source;

          source.onended = () => {
            console.log('[TTS] AudioContext chunk finished.');
            chunkIdx++;
            playNextChunk();
          };

          if (audioCtx.state === 'suspended') {
            audioCtx.resume();
          }

          source.start(0);
          console.log('[TTS] AudioContext started playing successfully.');
          
          if (!started) {
            started = true;
            onStart?.();
          }
        }, (err) => {
          throw new Error('Lỗi giải mã âm thanh: ' + (err?.message || 'Unknown'));
        });
      })
      .catch((err) => {
        console.error('[TTS] Fetch/Play error:', err);
        alert('Lỗi tải/phát âm thanh: ' + err.message);
        
        chunkIdx++;
        if (chunkIdx < chunks.length) {
          playNextChunk();
        } else {
          currentAudioSource = null;
          if (!started) onStart?.();
          onEnd?.();
        }
      });
  };

  playNextChunk();
}

let currentAudioCtx: AudioContext | null = null;
let currentAudioSource: AudioBufferSourceNode | null = null;

function stopAudioPlayback(): void {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.src = '';
    currentAudio = null;
  }
  if (currentAudioSource) {
    try { currentAudioSource.stop(); } catch(e) {}
    currentAudioSource = null;
  }
  if (currentAudioCtx) {
    try { currentAudioCtx.close(); } catch(e) {}
    currentAudioCtx = null;
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export interface SpeakOptions {
  lang?: TTSLang;
  rate?: number;
  onEnd?: () => void;
  onStart?: () => void;
}

/**
 * Speak the given text. Strategy:
 *
 * 1. If the Web Speech API has voices available for the requested language,
 *    try speechSynthesis first.
 * 2. Otherwise (or on systems with no voices like bare Linux), fall back to
 *    an Audio-element approach using the Google Translate TTS endpoint.
 *
 * Returns true if speech was initiated (doesn't guarantee audible output).
 */
export function speak(text: string, options: SpeakOptions = {}): boolean {
  if (!text) {
    options.onEnd?.();
    return false;
  }

  const { lang = 'en-US', onEnd, onStart } = options;

  // Stop anything currently playing
  stopSpeaking();

  // Decide strategy: if Web Speech API has voices, try it with a timeout
  // fallback; otherwise go straight to Audio-based TTS.
  // We forcefully bypass Web Speech API because on some systems (especially Linux),
  // speechSynthesis reports voices and fires onstart/onend events perfectly, but
  // produces NO SOUND at the OS level. It's impossible to detect this programmatically.
  // Using the audio fallback ensures the user ALWAYS hears sound.
  speakViaAudio(text, lang, onStart, onEnd);

  return true;
}



export function stopSpeaking(): void {
  stopAudioPlayback();
  if (speechSynthAvailable()) window.speechSynthesis.cancel();
}

/** Map a lesson category to the appropriate TTS language. */
export function langForCategory(
  category: 'toeic' | 'n2' | 'english' | 'japanese',
): TTSLang {
  return category === 'toeic' || category === 'english' ? 'en-US' : 'ja-JP';
}
