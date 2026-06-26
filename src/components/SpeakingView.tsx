import { useState, useEffect, useRef, useCallback } from 'react';
import type { SpeakingLesson, Mistake } from '../types';
import { calculateSimilarity } from '../utils/stringSimilarity';
import { speak, langForCategory, isSpeechRecognitionSupported } from '../utils/tts';
import { Volume2, Volume1, Mic, Sparkles, RefreshCw, AlertTriangle, Square, Play, CheckCircle } from 'lucide-react';

interface SpeechRecognitionEvent {
  results: { [index: number]: { [index: number]: { transcript: string } } };
}

interface SpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onend: (() => void) | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onerror: ((event: any) => void) | null;
  start: () => void;
  stop: () => void;
}

interface SpeakingViewProps {
  lesson: SpeakingLesson;
  onComplete: () => void;
  onSaveMistake?: (mistake: Mistake) => void;
}

export function SpeakingView({ lesson, onComplete, onSaveMistake }: SpeakingViewProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlayingExample, setIsPlayingExample] = useState(false);
  const [isPlayingMyVoice, setIsPlayingMyVoice] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  
  const [transcript, setTranscript] = useState('');
  const [feedback, setFeedback] = useState<'none' | 'success' | 'retry'>('none');
  const [errorMsg, setErrorMsg] = useState('');
  
  const [recognitionSupported] = useState(() => isSpeechRecognitionSupported());
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);
  const myAudioRef = useRef<HTMLAudioElement | null>(null);

  const targetSentenceRef = useRef(lesson.targetSentence);
  targetSentenceRef.current = lesson.targetSentence;

  const checkAccuracy = useCallback((text: string) => {
    const acc = calculateSimilarity(targetSentenceRef.current, text);
    if (acc >= 70) {
      setFeedback('success');
    } else {
      setFeedback('retry');
    }
  }, []);

  useEffect(() => {
    if (recognitionSupported) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognitionAPI();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = lesson.category === 'toeic' ? 'en-US' : 'ja-JP';

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const result = event.results[0][0].transcript;
        setTranscript(result);
        checkAccuracy(result);
      };
      
      recognition.onerror = () => {
         // Silently ignore speech recognition errors since we have manual recording
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch { /* ignore */ }
        recognitionRef.current.onresult = null;
        recognitionRef.current.onerror = null;
      }
      if (myAudioRef.current) {
        myAudioRef.current.pause();
        myAudioRef.current = null;
      }
    };
  }, [lesson.category, checkAccuracy, recognitionSupported]);

  const startRecording = async () => {
    setErrorMsg('');
    setTranscript('');
    setFeedback('none');
    setAudioUrl(null);
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);

      if (recognitionRef.current) {
         try { recognitionRef.current.start(); } catch { /* ignore */ }
      }

    } catch (e) {
      console.error('Microphone access error:', e);
      setErrorMsg('🚫 Không thể truy cập micro. Hãy kiểm tra lại quyền (Permission).');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch { /* ignore */ }
    }
  };

  const playMyVoice = () => {
     if (audioUrl) {
       if (!myAudioRef.current) {
          myAudioRef.current = new Audio(audioUrl);
          myAudioRef.current.onended = () => setIsPlayingMyVoice(false);
       } else {
          myAudioRef.current.src = audioUrl;
       }
       setIsPlayingMyVoice(true);
       myAudioRef.current.play();
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
    <div className="bg-bg-card lingo-card p-10 max-w-2xl mx-auto w-full animate-in slide-in-from-bottom-8 duration-500 flex flex-col items-center">
      <div className="w-full flex justify-between items-center mb-10">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${lesson.category === 'toeic' ? 'bg-blue' : 'bg-red'}`}></div>
          <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Speaking Practice</span>
        </div>
        <div className="bg-bg-hover px-4 py-1.5 rounded-xl text-[9px] font-black text-text-muted uppercase tracking-widest border-2 border-border-main">
          Record & Compare
        </div>
      </div>

      <div className="text-center space-y-6 mb-10">
        <p className="text-[10px] font-black text-blue uppercase tracking-[0.2em] mb-2">Speak this sentence:</p>
        <h3 className="text-3xl font-black text-text-main leading-tight px-4">
          {lesson.targetSentence}
        </h3>
        <p className="text-sm font-bold text-text-muted italic">
          "{lesson.translation}"
        </p>
      </div>

      <button
        onClick={handlePlayExample}
        disabled={isPlayingExample}
        className="w-full h-12 btn-3d btn-purple rounded-2xl text-sm font-black mb-8 flex items-center justify-center gap-2"
      >
        {isPlayingExample ? <Volume2 size={20} /> : <Volume1 size={20} />}
        {isPlayingExample ? 'Playing...' : 'LISTEN TO EXAMPLE'}
      </button>

      <div className="relative flex flex-col items-center gap-6 w-full mb-8">
        {!isRecording ? (
          <button
            onClick={startRecording}
            className="w-24 h-24 rounded-full flex items-center justify-center text-4xl shadow-lg transition-all btn-3d btn-blue active:scale-95"
            aria-label="Start recording"
          >
            <Mic size={36} />
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="w-24 h-24 rounded-full flex items-center justify-center text-4xl shadow-xl transition-all bg-red text-white hover:bg-[#ff3b30] border-b-4 border-[#cc2d23] active:scale-95 active:border-b-0 active:translate-y-1 animate-pulse"
            aria-label="Stop recording"
          >
            <Square size={32} className="fill-current" />
          </button>
        )}

        <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">
          {isRecording ? 'Recording... Tap to stop' : 'Tap to record your voice'}
        </p>

        {errorMsg && (
          <div className="w-full p-4 rounded-xl border-2 border-red bg-tint-red text-center text-sm font-bold text-red">
             <AlertTriangle size={16} className="inline mr-2" /> {errorMsg}
          </div>
        )}
      </div>

      {audioUrl && (
        <div className="w-full p-6 rounded-3xl border-2 border-border-main bg-bg-hover flex flex-col items-center animate-in zoom-in-95 duration-300">
           <p className="text-[10px] font-black uppercase text-text-muted mb-4">Your Recording</p>
           
           <button
             onClick={playMyVoice}
             disabled={isPlayingMyVoice}
             className="w-full h-12 bg-white text-blue border-2 border-blue rounded-xl font-black mb-6 flex items-center justify-center gap-2 hover:bg-tint-blue transition-colors disabled:opacity-50"
           >
             {isPlayingMyVoice ? <Volume2 size={20} /> : <Play size={20} className="fill-current" />}
             {isPlayingMyVoice ? 'Playing...' : 'PLAY MY VOICE'}
           </button>

           <div className="w-full border-t-2 border-border-main pt-6">
              <p className="text-sm font-black text-center mb-4">Did you sound like the example?</p>
              
              {transcript && feedback !== 'none' && (
                 <div className="text-center mb-4">
                    <p className="text-xs font-bold text-text-muted">AI Recognized:</p>
                    <p className={`text-lg font-bold ${feedback === 'success' ? 'text-green' : 'text-red'}`}>{transcript}</p>
                 </div>
              )}

              <div className="flex gap-4 justify-center">
                 <button
                   onClick={() => {
                     setFeedback('retry');
                     if (onSaveMistake) {
                       onSaveMistake({
                         id: crypto.randomUUID(),
                         type: 'speaking',
                         data: lesson,
                         wrongAnswer: transcript || '',
                         timestamp: new Date().toISOString()
                       });
                     }
                   }}
                   className="flex-1 max-w-[140px] py-3 rounded-xl border-2 border-red bg-tint-red text-red font-black text-sm hover:bg-red hover:text-white transition-colors flex items-center justify-center gap-2"
                 >
                   <RefreshCw size={16} /> TRY AGAIN
                 </button>
                 <button
                   onClick={() => {
                     setFeedback('success');
                     setTimeout(onComplete, 500); // give time for success effect
                   }}
                   className="flex-1 max-w-[140px] py-3 rounded-xl border-2 border-green bg-tint-green text-green font-black text-sm hover:bg-green hover:text-white transition-colors flex items-center justify-center gap-2"
                 >
                   <CheckCircle size={16} /> I DID GOOD
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* Success Effect Overlay */}
      {feedback === 'success' && audioUrl && (
         <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-50 animate-in fade-in zoom-in duration-300">
            <div className="text-green animate-bounce drop-shadow-md">
               <Sparkles size={80} />
            </div>
         </div>
      )}

      {/* Skip button when user just wants to move on */}
      {!audioUrl && (
        <button
          onClick={onComplete}
          className="mt-4 text-text-muted font-black hover:text-text-main transition-colors uppercase tracking-[0.2em] text-[10px]"
        >
          Skip this exercise →
        </button>
      )}
    </div>
  );
}
