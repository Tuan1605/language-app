import { useState, useEffect, useRef, useCallback } from 'react';
import type { SpeakingLesson } from '../types';
import { calculateSimilarity } from '../utils/stringSimilarity';
import { speak, langForCategory, isSpeechRecognitionSupported } from '../utils/tts';

interface SpeechRecognitionEvent {
  results: { [index: number]: { [index: number]: { transcript: string } } };
}

interface SpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  start: () => void;
  stop: () => void;
}

interface SpeakingViewProps {
  lesson: SpeakingLesson;
  onComplete: () => void;
}

export function SpeakingView({ lesson, onComplete }: SpeakingViewProps) {
  const [isListening, setIsListening] = useState(false);
  const [isPlayingExample, setIsPlayingExample] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<'none' | 'success' | 'retry'>('none');
  const [recognitionSupported] = useState(() => isSpeechRecognitionSupported());

  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  const checkAccuracy = useCallback((text: string) => {
    const acc = calculateSimilarity(lesson.targetSentence, text);
    setAccuracy(acc);

    if (acc >= 70) {
      setFeedback('success');
      setTimeout(() => onComplete(), 1500);
    } else {
      setFeedback('retry');
    }
  }, [lesson.targetSentence, onComplete]);

  useEffect(() => {
    const SpeechRecognitionAPI = (window as unknown as { SpeechRecognition?: new () => SpeechRecognitionInstance; webkitSpeechRecognition?: new () => SpeechRecognitionInstance }).SpeechRecognition || (window as unknown as { webkitSpeechRecognition?: new () => SpeechRecognitionInstance }).webkitSpeechRecognition;
    if (SpeechRecognitionAPI) {
      const recognition = new SpeechRecognitionAPI();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = lesson.category === 'toeic' ? 'en-US' : 'ja-JP';

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const result = event.results[0][0].transcript;
        setTranscript(result);
        checkAccuracy(result);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch { /* ignore */ }
        recognitionRef.current.onresult = null;
        recognitionRef.current.onend = null;
        recognitionRef.current.onerror = null;
      }
    };
  }, [lesson, checkAccuracy]);

  const startListening = () => {
    setTranscript('');
    setAccuracy(null);
    setFeedback('none');
    if (!isListening) {
      setIsListening(true);
      recognitionRef.current?.start();
    }
  };

  const handlePlayExample = () => {
    if (isPlayingExample) return;
    setIsPlayingExample(true);
    speak(lesson.targetSentence, {
      lang: langForCategory(lesson.category),
      onEnd: () => setIsPlayingExample(false),
    });
  };

  return (
    <div className="bg-[var(--bg-card)] lingo-card p-10 max-w-2xl mx-auto w-full animate-in slide-in-from-bottom-8 duration-500 flex flex-col items-center">
      <div className="w-full flex justify-between items-center mb-10">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${lesson.category === 'toeic' ? 'bg-[#1cb0f6]' : 'bg-[#ff4b4b]'}`}></div>
          <span className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em]">Speaking Practice</span>
        </div>
        <div className="bg-[var(--bg-hover)] px-4 py-1.5 rounded-xl text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest border-2 border-[var(--border-main)]">
          Voice Recognition
        </div>
      </div>

      <div className="text-center space-y-6 mb-10">
        <p className="text-[10px] font-black text-[#1cb0f6] uppercase tracking-[0.2em] mb-2">Speak this sentence:</p>
        <h3 className="text-3xl font-black text-[var(--text-main)] leading-tight px-4">
          {lesson.targetSentence}
        </h3>
        <p className="text-sm font-bold text-[var(--text-muted)] italic">
          "{lesson.translation}"
        </p>
      </div>

      {/* Prominent notice + skip when the browser cannot do speech recognition
          (e.g. Firefox). Users can still hear the example via TTS below. */}
      {!recognitionSupported && (
        <div className="w-full p-6 mb-8 rounded-2xl border-2 border-[#ff4b4b] bg-[var(--tint-red)] text-center space-y-3">
          <p className="text-sm font-black text-[#ff4b4b] leading-relaxed">
            ⚠️ Trình duyệt này không hỗ trợ nhận diện giọng nói.<br/>
            Hãy dùng <strong>Chrome hoặc Edge</strong> để luyện Nói (phần mic).
          </p>
          <p className="text-xs font-bold text-[var(--text-muted)]">
            Bạn vẫn có thể nghe câu mẫu bên dưới rồi tự nhẩm, sau đó bấm bỏ qua để tiếp tục.
          </p>
          <button
            onClick={onComplete}
            className="mt-2 inline-block btn-3d btn-blue px-6 py-2 rounded-xl text-xs font-black"
          >
            BỎ QUA BÀI NÀY →
          </button>
        </div>
      )}

      {/* Listen Example button — lets user hear the sentence before recording */}
      <button
        onClick={handlePlayExample}
        disabled={isPlayingExample}
        className="w-full h-12 btn-3d btn-purple rounded-2xl text-sm font-black mb-8 flex items-center justify-center gap-2"
        aria-label="Listen to example pronunciation"
      >
        <span className="text-lg">{isPlayingExample ? '🔊' : '🔈'}</span>
        {isPlayingExample ? 'Playing...' : 'LISTEN TO EXAMPLE'}
      </button>

      <div className="relative flex flex-col items-center gap-8 w-full">
        <button
          onClick={startListening}
          disabled={isListening || !recognitionSupported}
          className={`w-28 h-28 rounded-full flex items-center justify-center text-4xl shadow-2xl transition-all relative z-10
            ${isListening ? 'bg-[#ff4b4b] animate-pulse scale-110 shadow-red-200' : 'btn-3d btn-blue'}
            ${!recognitionSupported ? 'opacity-40 cursor-not-allowed' : 'active:scale-95'}`}
          aria-label={isListening ? 'Recording in progress' : 'Start recording'}
          title={recognitionSupported ? undefined : 'Trình duyệt không hỗ trợ mic — dùng Chrome/Edge'}
        >
          {isListening ? '🎙️' : '🎤'}
          {isListening && (
            <div className="absolute -inset-4 border-4 border-[#ff4b4b]/30 rounded-full animate-ping"></div>
          )}
        </button>

        <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">
          {isListening ? 'Listening...' : 'Tap to start recording'}
        </p>

        {transcript && (
          <div className={`w-full p-6 rounded-2xl border-2 transition-all duration-500 ${
            feedback === 'success' ? 'bg-[var(--tint-green)] border-[#58cc02] text-[#58cc02]' :
            feedback === 'retry' ? 'bg-[var(--tint-red)] border-[#ff4b4b] text-[#ff4b4b]' :
            'bg-[var(--bg-hover)] border-[var(--border-main)] text-[var(--text-main)]'
          }`}>
            <p className="text-[9px] font-black uppercase tracking-widest mb-2 opacity-60 text-center">I heard:</p>
            <p className="text-xl font-bold text-center mb-3">"{transcript}"</p>
            {accuracy !== null && (
              <div className="flex flex-col items-center gap-1">
                <div className="w-full bg-[var(--border-main)] h-2 rounded-full overflow-hidden max-w-[200px]">
                  <div className={`h-full transition-all duration-700 ${accuracy >= 70 ? 'bg-[#58cc02]' : 'bg-[#ff4b4b]'}`} style={{ width: `${accuracy}%` }}></div>
                </div>
                <span className="text-[10px] font-black uppercase">Accuracy: {accuracy}%</span>
              </div>
            )}
            {feedback === 'success' && (
              <p className="text-center font-black mt-4 animate-bounce">✨ EXCELLENT! ✨</p>
            )}
            {feedback === 'retry' && (
              <div className="flex items-center justify-center gap-3 mt-4">
                <p className="font-black">Keep trying! 🔄</p>
                <button onClick={recognitionSupported ? startListening : undefined} disabled={!recognitionSupported} className="text-[10px] font-black uppercase px-3 py-1 rounded-lg bg-[var(--bg-hover)] border-2 border-[var(--border-main)] hover:border-[#ff4b4b] transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                  RETRY
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Skip button when mic unavailable or user wants to move on */}
      <button
        onClick={onComplete}
        className="mt-8 text-[var(--text-muted)] font-black hover:text-[var(--text-main)] transition-colors uppercase tracking-[0.2em] text-[10px]"
      >
        Skip this exercise →
      </button>

      {!recognitionSupported && (
        <p className="mt-4 text-xs text-[#ff4b4b] font-bold text-center">
          ⚠️ Trình duyệt không hỗ trợ nhận diện giọng nói. Hãy dùng Chrome hoặc Edge để luyện Nói.
        </p>
      )}
    </div>
  );
}
