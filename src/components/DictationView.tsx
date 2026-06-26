import { useState, useRef, useEffect } from 'react';
import type { DictationLesson, Mistake } from '../types';
import { speak, langForCategory, hasVoiceFor } from '../utils/tts';
import { calculateSimilarity } from '../utils/stringSimilarity';
import { playCorrectSound } from '../utils/sound';
import { Volume2, RefreshCw } from 'lucide-react';

interface DictationViewProps {
  lesson: DictationLesson;
  onComplete: (isCorrect: boolean) => void;
  onSaveMistake?: (mistake: Mistake) => void;
}

export function DictationView({ lesson, onComplete, onSaveMistake }: DictationViewProps) {
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
    } else {
      setFeedback('retry');
      if (onSaveMistake) {
        onSaveMistake({
          id: crypto.randomUUID(),
          type: 'dictation',
          data: lesson,
          wrongAnswer: userInput,
          timestamp: new Date().toISOString()
        });
      }
    }
  };

  const handleContinue = () => {
    onComplete(feedback === 'success');
  };

  const handleSkip = () => {
    onComplete(false);
  };

  return (
    <div className="bg-bg-card lingo-card p-10 max-w-2xl mx-auto w-full animate-in slide-in-from-bottom-8 duration-500 flex flex-col items-center">
      <div className="w-full flex justify-between items-center mb-10">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${lesson.category === 'toeic' ? 'bg-blue' : 'bg-red'}`}></div>
          <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Dictation Mastery</span>
        </div>
        <div className="bg-bg-hover px-4 py-1.5 rounded-xl text-[9px] font-black text-text-muted uppercase tracking-widest border-2 border-border-main">
          Listen & Type
        </div>
      </div>

      <div className="text-center space-y-6 mb-12">
        <h3 className="text-2xl font-black text-text-main leading-tight">
          Type exactly what you hear
        </h3>
        {feedback === 'retry' && (
          <div className="space-y-2 animate-in fade-in duration-500">
            <p className="text-sm font-bold text-red italic">
              Hint: "{lesson.translation}"
            </p>
            <div className="p-4 bg-tint-red border-2 border-red rounded-xl inline-block text-left">
              <p className="text-[10px] font-black text-red uppercase tracking-widest mb-1">Correct Answer:</p>
              <p className="font-bold text-text-main">{lesson.targetText}</p>
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
              <span className="absolute -top-2 -right-2 bg-gold text-white text-[10px] font-black px-2 py-1 rounded-full border-2 border-white shadow-sm">0.75x</span>
            )}
          </button>
          <button
            onClick={() => setIsSlow(!isSlow)}
            className={`h-10 px-4 rounded-2xl font-black text-xs transition-colors border-2 ${isSlow ? 'bg-gold border-gold-shadow text-white' : 'bg-bg-hover border-border-main text-text-muted hover:text-text-main'}`}
            title="Toggle slow playback"
          >
            🐢 SLOW
          </button>
        </div>

        {!lesson.audioUrl && !voiceReady && (
          <p className="text-xs text-blue font-bold text-center flex items-center justify-center gap-2">
            <Volume2 size={16} /> Sẽ dùng giọng đọc online. Bấm nút loa để nghe.
          </p>
        )}

        <textarea
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          disabled={isFinished}
          placeholder="Start typing here..."
          className="w-full bg-bg-hover border-2 border-border-main rounded-2xl p-6 text-xl font-bold focus:border-blue focus:bg-bg-card transition-all outline-none placeholder:text-text-muted resize-none h-32 text-text-main"
        />

        <div className="flex flex-col items-center gap-6">
          {!isFinished ? (
            <button
              disabled={!userInput.trim()}
              onClick={checkAnswer}
              className={`w-full h-16 btn-3d rounded-2xl text-lg font-black transition-all ${userInput.trim() ? 'btn-blue' : 'bg-bg-hover text-text-muted border-b-4 border-border-main'}`}
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
            <div className="w-full p-4 bg-tint-red border-2 border-red rounded-2xl animate-in shake duration-300">
               <p className="text-center text-red font-black text-sm uppercase flex items-center justify-center gap-2">
                 Accuracy: {accuracy}% - Not quite right! Listen again. <RefreshCw size={14} />
               </p>
            </div>
          )}

          {isFinished && (
            <div className="w-full p-6 bg-tint-green border-2 border-green rounded-2xl text-center space-y-2 animate-in zoom-in-95 duration-500">
               <p className="text-green font-black uppercase text-xs tracking-widest">Excellent Work!</p>
               <p className="text-xl font-bold text-text-main leading-tight">"{lesson.targetText}"</p>
            </div>
          )}
        </div>
      </div>

      {/* Skip button */}
      {!isFinished && (
        <button
          onClick={handleSkip}
          className="mt-6 text-text-muted font-black hover:text-text-main transition-colors uppercase tracking-[0.2em] text-[10px]"
        >
          Skip this exercise →
        </button>
      )}
    </div>
  );
}
