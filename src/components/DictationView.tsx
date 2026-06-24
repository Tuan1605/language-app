import { useState, useRef, useEffect } from 'react';
import type { DictationLesson } from '../types';
import { speak, langForCategory, hasVoiceFor } from '../utils/tts';
import { calculateSimilarity } from '../utils/stringSimilarity';
import { playCorrectSound } from '../utils/sound';
import { Volume2, RefreshCw } from 'lucide-react';

interface DictationViewProps {
  lesson: DictationLesson;
  onComplete: (isCorrect: boolean) => void;
}

export function DictationView({ lesson, onComplete }: DictationViewProps) {
  const [userInput, setUserInput] = useState('');
  const [isFinished, setIsFinished] = useState(false);
  const [feedback, setFeedback] = useState<'none' | 'success' | 'retry'>('none');
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [isSlow, setIsSlow] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Same voice-readiness tracking as ListeningView: on Firefox/Windows the
  // voices list can arrive after mount, so we re-check on onvoiceschanged.
  const ttsLang = langForCategory(lesson.category);
  const [voiceReady, setVoiceReady] = useState(() => hasVoiceFor(ttsLang));
  useEffect(() => {
    if (!('speechSynthesis' in window)) return;
    const check = () => setVoiceReady(hasVoiceFor(ttsLang));
    check();
    window.speechSynthesis.addEventListener('voiceschanged', check);
    return () => window.speechSynthesis.removeEventListener('voiceschanged', check);
  }, [ttsLang]);

  const playAudio = () => {
    if (lesson.audioUrl && audioRef.current) {
      audioRef.current.playbackRate = isSlow ? 0.75 : 1.0;
      audioRef.current.currentTime = 0;
      audioRef.current.play();
      return;
    }
    // Fallback: read the target text aloud with the Web Speech API.
    speak(lesson.targetText, { lang: langForCategory(lesson.category), rate: isSlow ? 0.75 : 0.9 });
  };

  const checkAnswer = () => {
    const acc = calculateSimilarity(lesson.targetText, userInput);
    setAccuracy(acc);

    if (acc >= 75) {
      playCorrectSound();
      setFeedback('success');
      setIsFinished(true);
      // Don't call onComplete here — let handleContinue be the single exit
      // point so we never double-fire nextTask().
    } else {
      setFeedback('retry');
    }
  };

  const handleContinue = () => {
    onComplete(feedback === 'success');
  };

  const handleSkip = () => {
    onComplete(false);
  };

  return (
    <div className="bg-[var(--bg-card)] lingo-card p-10 max-w-2xl mx-auto w-full animate-in slide-in-from-bottom-8 duration-500 flex flex-col items-center">
      <div className="w-full flex justify-between items-center mb-10">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${lesson.category === 'toeic' ? 'bg-[var(--blue)]' : 'bg-[var(--red)]'}`}></div>
          <span className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em]">Dictation Mastery</span>
        </div>
        <div className="bg-[var(--bg-hover)] px-4 py-1.5 rounded-xl text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest border-2 border-[var(--border-main)]">
          Listen & Type
        </div>
      </div>

      <div className="text-center space-y-6 mb-12">
        <h3 className="text-2xl font-black text-[var(--text-main)] leading-tight">
          Type exactly what you hear
        </h3>
        {feedback === 'retry' && (
          <div className="space-y-2 animate-in fade-in duration-500">
            <p className="text-sm font-bold text-[var(--red)] italic">
              Hint: "{lesson.translation}"
            </p>
            <div className="p-4 bg-[var(--tint-red)] border-2 border-[var(--red)] rounded-xl inline-block text-left">
              <p className="text-[10px] font-black text-[var(--red)] uppercase tracking-widest mb-1">Correct Answer:</p>
              <p className="font-bold text-[var(--text-main)]">{lesson.targetText}</p>
            </div>
          </div>
        )}
      </div>

      <audio ref={audioRef} src={lesson.audioUrl} preload="auto" className="hidden" />

      <div className="w-full space-y-8">
        <div className="flex justify-center items-end gap-4">
          <button
            onClick={playAudio}
            className="w-24 h-24 rounded-full btn-3d btn-purple text-4xl shadow-xl flex items-center justify-center p-0 relative"
            aria-label="Play audio"
          >
            <Volume2 size={40} />
            {isSlow && (
              <span className="absolute -top-2 -right-2 bg-[var(--gold)] text-white text-[10px] font-black px-2 py-1 rounded-full border-2 border-white shadow-sm">0.75x</span>
            )}
          </button>
          <button
            onClick={() => setIsSlow(!isSlow)}
            className={`h-10 px-4 rounded-2xl font-black text-xs transition-colors border-2 ${isSlow ? 'bg-[var(--gold)] border-[var(--gold-shadow)] text-white' : 'bg-[var(--bg-hover)] border-[var(--border-main)] text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}
            title="Toggle slow playback"
          >
            🐢 SLOW
          </button>
        </div>

        {!lesson.audioUrl && !voiceReady && (
          <p className="text-xs text-[var(--blue)] font-bold text-center flex items-center justify-center gap-2">
            <Volume2 size={16} /> Sẽ dùng giọng đọc online. Bấm nút loa để nghe.
          </p>
        )}

        <textarea
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          disabled={isFinished}
          placeholder="Start typing here..."
          className="w-full bg-[var(--bg-hover)] border-2 border-[var(--border-main)] rounded-2xl p-6 text-xl font-bold focus:border-[var(--blue)] focus:bg-[var(--bg-card)] transition-all outline-none placeholder:text-[var(--text-muted)] resize-none h-32 text-[var(--text-main)]"
        />

        <div className="flex flex-col items-center gap-6">
          {!isFinished ? (
            <button
              disabled={!userInput.trim()}
              onClick={checkAnswer}
              className={`w-full h-16 btn-3d rounded-2xl text-lg font-black transition-all ${userInput.trim() ? 'btn-blue' : 'bg-[var(--bg-hover)] text-[var(--text-muted)] border-b-4 border-[var(--border-main)]'}`}
            >
              SUBMIT ANSWER
            </button>
          ) : (
            <button
              onClick={handleContinue}
              className="w-full h-16 btn-3d btn-green rounded-2xl text-lg font-black"
            >
              CONTINUE JOURNEY
            </button>
          )}

          {feedback === 'retry' && (
            <div className="w-full p-4 bg-[var(--tint-red)] border-2 border-[var(--red)] rounded-2xl animate-in shake duration-300">
               <p className="text-center text-[var(--red)] font-black text-sm uppercase flex items-center justify-center gap-2">
                 Accuracy: {accuracy}% - Not quite right! Listen again. <RefreshCw size={14} />
               </p>
            </div>
          )}

          {isFinished && (
            <div className="w-full p-6 bg-[var(--tint-green)] border-2 border-[var(--green)] rounded-2xl text-center space-y-2 animate-in zoom-in-95 duration-500">
               <p className="text-[var(--green)] font-black uppercase text-xs tracking-widest">Excellent Work!</p>
               <p className="text-xl font-bold text-[var(--text-main)] leading-tight">"{lesson.targetText}"</p>
            </div>
          )}
        </div>
      </div>

      {/* Skip button */}
      {!isFinished && (
        <button
          onClick={handleSkip}
          className="mt-6 text-[var(--text-muted)] font-black hover:text-[var(--text-main)] transition-colors uppercase tracking-[0.2em] text-[10px]"
        >
          Skip this exercise →
        </button>
      )}
    </div>
  );
}
