import { useState, useEffect, useRef } from 'react';
import type { SpeakingLesson } from '../types';

interface SpeakingViewProps {
  lesson: SpeakingLesson;
  onComplete: () => void;
}

export function SpeakingView({ lesson, onComplete }: SpeakingViewProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<'none' | 'success' | 'retry'>('none');
  
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = lesson.category === 'toeic' ? 'en-US' : 'ja-JP';

      recognitionRef.current.onresult = (event: any) => {
        const result = event.results[0][0].transcript;
        setTranscript(result);
        checkAccuracy(result);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, [lesson]);

  const startListening = () => {
    setTranscript('');
    setAccuracy(null);
    setFeedback('none');
    setIsListening(true);
    recognitionRef.current?.start();
  };

  const checkAccuracy = (text: string) => {
    const target = lesson.targetSentence.toLowerCase().replace(/[.,!?;]/g, '');
    const recognized = text.toLowerCase().replace(/[.,!?;]/g, '');
    
    // Simple string similarity (very basic)
    const targetWords = target.split(' ');
    const recognizedWords = recognized.split(' ');
    let matches = 0;
    targetWords.forEach(word => {
      if (recognizedWords.includes(word)) matches++;
    });

    const acc = Math.round((matches / targetWords.length) * 100);
    setAccuracy(acc);

    if (acc >= 70) {
      setFeedback('success');
      setTimeout(() => onComplete(), 1500);
    } else {
      setFeedback('retry');
    }
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

      <div className="text-center space-y-6 mb-12">
        <p className="text-[10px] font-black text-[#1cb0f6] uppercase tracking-[0.2em] mb-2">Speak this sentence:</p>
        <h3 className="text-3xl font-black text-[var(--text-main)] leading-tight px-4">
          {lesson.targetSentence}
        </h3>
        <p className="text-sm font-bold text-[var(--text-muted)] italic">
          "{lesson.translation}"
        </p>
      </div>

      <div className="relative flex flex-col items-center gap-8 w-full">
        <button 
          onClick={startListening}
          disabled={isListening}
          className={`w-28 h-28 rounded-full flex items-center justify-center text-4xl shadow-2xl transition-all relative z-10
            ${isListening ? 'bg-[#ff4b4b] animate-pulse scale-110 shadow-red-200' : 'btn-3d btn-blue'}`}
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
            feedback === 'success' ? 'bg-[#f2fcf0] border-[#58cc02] text-[#58cc02]' : 
            feedback === 'retry' ? 'bg-[#fff5f5] border-[#ff4b4b] text-[#ff4b4b]' : 
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
              <p className="text-center font-black mt-4">Keep trying! Focus on clarity. 🔄</p>
            )}
          </div>
        )}
      </div>

      {!recognitionRef.current && (
        <p className="mt-8 text-xs text-[#ff4b4b] font-bold text-center">
          ⚠️ Your browser does not support voice recognition. Please use Chrome or Edge.
        </p>
      )}
    </div>
  );
}
