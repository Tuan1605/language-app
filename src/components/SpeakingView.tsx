import { useState, useEffect, useRef, useCallback } from 'react';
import type { SpeakingLesson } from '../types';
import { calculateSimilarity } from '../utils/stringSimilarity';
import { speak, langForCategory, isSpeechRecognitionSupported } from '../utils/tts';
import { Volume2, Volume1, Mic, Sparkles, RefreshCw, AlertTriangle } from 'lucide-react';

interface SpeechRecognitionEvent {
  results: { [index: number]: { [index: number]: { transcript: string } } };
}

interface SpeechRecognitionErrorEvent {
  error: string;
  message?: string;
}

interface SpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onend: (() => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  start: () => void;
  stop: () => void;
}

interface SpeakingViewProps {
  lesson: SpeakingLesson;
  onComplete: () => void;
}

/** Map SpeechRecognition error codes to user-friendly Vietnamese messages. */
function friendlyError(code: string): string {
  switch (code) {
    case 'not-allowed':
    case 'service-not-allowed':
      return '🚫 Chưa cấp quyền micro. Hãy bấm cho phép (Allow) khi trình duyệt hỏi, hoặc vào Cài đặt → Quyền riêng tư → Micro để bật.';
    case 'no-speech':
      return '🔇 Không nghe thấy giọng nói. Hãy nói to hơn và gần micro hơn.';
    case 'audio-capture':
      return '🎤 Không tìm thấy micro. Hãy kiểm tra xem thiết bị có micro không.';
    case 'network':
      return '🌐 Lỗi mạng. Nhận diện giọng nói cần kết nối internet (Chrome gửi audio lên server Google).';
    case 'aborted':
      return '⏹️ Ghi âm đã bị hủy.';
    default:
      return `⚠️ Lỗi nhận diện giọng nói: ${code}. Hãy thử lại.`;
  }
}

export function SpeakingView({ lesson, onComplete }: SpeakingViewProps) {
  const [isListening, setIsListening] = useState(false);
  const [isPlayingExample, setIsPlayingExample] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<'none' | 'success' | 'retry'>('none');
  const [errorMsg, setErrorMsg] = useState('');
  const [recognitionSupported] = useState(() => isSpeechRecognitionSupported());
  const listeningTimeoutRef = useRef<number | null>(null);

  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  // Use refs for callbacks that change frequently so the SpeechRecognition
  // instance doesn't need to be torn down and rebuilt on every render.
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;
  const targetSentenceRef = useRef(lesson.targetSentence);
  targetSentenceRef.current = lesson.targetSentence;

  const checkAccuracy = useCallback((text: string) => {
    const acc = calculateSimilarity(targetSentenceRef.current, text);
    setAccuracy(acc);

    if (acc >= 70) {
      setFeedback('success');
      setTimeout(() => onCompleteRef.current(), 1500);
    } else {
      setFeedback('retry');
    }
  }, []);

  const clearListeningTimeout = () => {
    if (listeningTimeoutRef.current) {
      window.clearTimeout(listeningTimeoutRef.current);
      listeningTimeoutRef.current = null;
    }
  };

  useEffect(() => {
    const SpeechRecognitionAPI = (window as unknown as { SpeechRecognition?: new () => SpeechRecognitionInstance; webkitSpeechRecognition?: new () => SpeechRecognitionInstance }).SpeechRecognition || (window as unknown as { webkitSpeechRecognition?: new () => SpeechRecognitionInstance }).webkitSpeechRecognition;
    if (SpeechRecognitionAPI) {
      const recognition = new SpeechRecognitionAPI();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = lesson.category === 'toeic' ? 'en-US' : 'ja-JP';

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        clearListeningTimeout();
        const result = event.results[0][0].transcript;
        setTranscript(result);
        setErrorMsg('');
        checkAccuracy(result);
      };

      recognition.onend = () => {
        clearListeningTimeout();
        setIsListening(false);
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        clearListeningTimeout();
        console.error('[SpeechRecognition] error:', event.error, event.message);
        setIsListening(false);
        // 'no-speech' just means user didn't say anything – not really a
        // permanent error, but still worth telling them.
        setErrorMsg(friendlyError(event.error));
      };

      recognitionRef.current = recognition;
    }

    return () => {
      clearListeningTimeout();
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch { /* ignore */ }
        recognitionRef.current.onresult = null;
        recognitionRef.current.onend = null;
        recognitionRef.current.onerror = null;
      }
    };
  }, [lesson.category, checkAccuracy]);

  const startListening = () => {
    setTranscript('');
    setAccuracy(null);
    setFeedback('none');
    setErrorMsg('');
    if (!isListening && recognitionRef.current) {
      setIsListening(true);
      try {
        recognitionRef.current.start();
        
        // Timeout in case the browser hangs silently (e.g. Brave)
        listeningTimeoutRef.current = window.setTimeout(() => {
          if (recognitionRef.current) {
            try { recognitionRef.current.stop(); } catch { /* ignore */ }
          }
          setIsListening(false);
          setErrorMsg('⏳ Không nhận được tín hiệu âm thanh nào quá lâu. Trình duyệt của bạn có thể đã chặn micro hoặc không được hỗ trợ (như Brave/Cốc Cốc). Vui lòng dùng Google Chrome hoặc Edge.');
        }, 12000);
      } catch (e) {
        // Can throw if recognition is already started or permission denied
        clearListeningTimeout();
        console.error('[SpeechRecognition] start() threw:', e);
        setIsListening(false);
        setErrorMsg('🚫 Không thể bắt đầu ghi âm. Hãy kiểm tra quyền micro và thử lại.');
      }
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
          <div className={`w-3 h-3 rounded-full ${lesson.category === 'toeic' ? 'bg-[var(--blue)]' : 'bg-[var(--red)]'}`}></div>
          <span className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em]">Speaking Practice</span>
        </div>
        <div className="bg-[var(--bg-hover)] px-4 py-1.5 rounded-xl text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest border-2 border-[var(--border-main)]">
          Voice Recognition
        </div>
      </div>

      <div className="text-center space-y-6 mb-10">
        <p className="text-[10px] font-black text-[var(--blue)] uppercase tracking-[0.2em] mb-2">Speak this sentence:</p>
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
        <div className="w-full p-6 mb-8 rounded-2xl border-2 border-[var(--red)] bg-[var(--tint-red)] text-center space-y-3">
          <p className="text-sm font-black text-[var(--red)] leading-relaxed">
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
        {isPlayingExample ? <Volume2 size={20} /> : <Volume1 size={20} />}
        {isPlayingExample ? 'Playing...' : 'LISTEN TO EXAMPLE'}
      </button>

      <div className="relative flex flex-col items-center gap-8 w-full">
        <button
          onClick={startListening}
          disabled={isListening || !recognitionSupported}
          className={`w-28 h-28 rounded-full flex items-center justify-center text-4xl shadow-2xl transition-all relative z-10
            ${isListening ? 'bg-[var(--red)] animate-pulse scale-110 shadow-red-200' : 'btn-3d btn-blue'}
            ${!recognitionSupported ? 'opacity-40 cursor-not-allowed' : 'active:scale-95'}`}
          aria-label={isListening ? 'Recording in progress' : 'Start recording'}
          title={recognitionSupported ? undefined : 'Trình duyệt không hỗ trợ mic — dùng Chrome/Edge'}
        >
          <Mic size={40} className={isListening ? 'animate-bounce' : ''} />
          {isListening && (
            <div className="absolute -inset-4 border-4 border-[var(--red)]/30 rounded-full animate-ping"></div>
          )}
        </button>

        <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">
          {isListening ? 'Listening...' : 'Tap to start recording'}
        </p>

        {/* Error feedback */}
        {errorMsg && !transcript && (
          <div className="w-full p-5 rounded-2xl border-2 border-[var(--gold)] bg-[var(--tint-gold)] text-center space-y-3 animate-in fade-in duration-300">
            <p className="text-sm font-bold text-[#cd7900] leading-relaxed flex items-center justify-center gap-2">
              <AlertTriangle size={16} /> {errorMsg}
            </p>
            <button
              onClick={startListening}
              disabled={!recognitionSupported}
              className="btn-3d btn-blue px-5 py-2 rounded-xl text-xs font-black disabled:opacity-40 flex items-center justify-center gap-2 mx-auto"
            >
              <RefreshCw size={14} /> THỬ LẠI
            </button>
          </div>
        )}

        {transcript && (
          <div className={`w-full p-6 rounded-2xl border-2 transition-all duration-500 ${
            feedback === 'success' ? 'bg-[var(--tint-green)] border-[var(--green)] text-[var(--green)]' :
            feedback === 'retry' ? 'bg-[var(--tint-red)] border-[var(--red)] text-[var(--red)]' :
            'bg-[var(--bg-hover)] border-[var(--border-main)] text-[var(--text-main)]'
          }`}>
            <p className="text-[9px] font-black uppercase tracking-widest mb-2 opacity-60 text-center">I heard:</p>
            <p className="text-xl font-bold text-center mb-3 leading-relaxed">
              {(() => {
                const targetWords = lesson.targetSentence.toLowerCase().replace(/[.,!?]/g, '').split(' ');
                return transcript.split(' ').map((word, i) => {
                  const cleanWord = word.toLowerCase().replace(/[.,!?]/g, '');
                  const isCorrect = targetWords.includes(cleanWord);
                  return (
                    <span key={i} className={isCorrect ? 'text-[var(--green)]' : 'text-[var(--red)] underline decoration-[var(--red)] decoration-2 underline-offset-4'}>
                      {word}{' '}
                    </span>
                  );
                });
              })()}
            </p>
            {accuracy !== null && (
              <div className="flex flex-col items-center gap-1">
                <div className="w-full bg-[var(--border-main)] h-2 rounded-full overflow-hidden max-w-[200px]">
                  <div className={`h-full transition-all duration-700 ${accuracy >= 70 ? 'bg-[var(--green)]' : 'bg-[var(--red)]'}`} style={{ width: `${accuracy}%` }}></div>
                </div>
                <span className="text-[10px] font-black uppercase">Accuracy: {accuracy}%</span>
              </div>
            )}
            {feedback === 'success' && (
              <p className="text-center font-black mt-4 animate-bounce flex items-center justify-center gap-2">
                <Sparkles size={16} /> EXCELLENT! <Sparkles size={16} />
              </p>
            )}
            {feedback === 'retry' && (
              <div className="flex flex-col items-center gap-3 mt-4">
                <div className="flex items-center justify-center gap-3">
                  <p className="font-black">Keep trying!</p>
                  <button onClick={recognitionSupported ? startListening : undefined} disabled={!recognitionSupported} className="text-[10px] font-black uppercase px-3 py-1 rounded-lg bg-[var(--bg-hover)] border-2 border-[var(--border-main)] hover:border-[var(--red)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1">
                    <RefreshCw size={12} /> RETRY
                  </button>
                </div>
                <button
                  onClick={() => {
                    setFeedback('success');
                    setTimeout(() => onCompleteRef.current(), 1500);
                  }}
                  className="text-[10px] font-bold text-[var(--text-muted)] hover:text-[var(--green)] underline underline-offset-4 decoration-dotted mt-2"
                >
                  Tôi đã đọc đúng! (Bỏ qua chấm điểm AI)
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
        <p className="mt-4 text-xs text-[var(--red)] font-bold text-center">
          ⚠️ Trình duyệt không hỗ trợ nhận diện giọng nói. Hãy dùng Chrome hoặc Edge để luyện Nói.
        </p>
      )}
    </div>
  );
}
