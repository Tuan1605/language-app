import { useState, useRef } from 'react';
import type { DictationLesson } from '../types';
import { speak, langForCategory } from '../utils/tts';
import { calculateSimilarity } from '../utils/stringSimilarity';

interface DictationViewProps {
  lesson: DictationLesson;
  onComplete: (isCorrect: boolean) => void;
}

export function DictationView({ lesson, onComplete }: DictationViewProps) {
  const [userInput, setUserInput] = useState('');
  const [isFinished, setIsFinished] = useState(false);
  const [feedback, setFeedback] = useState<'none' | 'success' | 'retry'>('none');
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const playAudio = () => {
    if (lesson.audioUrl && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
      return;
    }
    // Fallback: read the target text aloud with the Web Speech API.
    speak(lesson.targetText, { lang: langForCategory(lesson.category) });
  };

  const checkAnswer = () => {
    const acc = calculateSimilarity(lesson.targetText, userInput);
    setAccuracy(acc);

    if (acc >= 85) {
      setFeedback('success');
      setIsFinished(true);
    } else {
      setFeedback('retry');
    }
  };

  return (
    <div className="bg-[var(--bg-card)] lingo-card p-10 max-w-2xl mx-auto w-full animate-in slide-in-from-bottom-8 duration-500 flex flex-col items-center">
      <div className="w-full flex justify-between items-center mb-10">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${lesson.category === 'toeic' ? 'bg-[#1cb0f6]' : 'bg-[#ff4b4b]'}`}></div>
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
          <p className="text-sm font-bold text-[#ff4b4b] italic animate-in fade-in duration-500">
            Hint: "{lesson.translation}"
          </p>
        )}
      </div>

      <audio ref={audioRef} src={lesson.audioUrl} className="hidden" />

      <div className="w-full space-y-8">
        <div className="flex justify-center">
          <button 
            onClick={playAudio}
            className="w-24 h-24 rounded-full btn-3d btn-purple text-4xl shadow-xl flex items-center justify-center p-0"
          >
            🔊
          </button>
        </div>

        <textarea
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          disabled={isFinished}
          placeholder="Start typing here..."
          className="w-full bg-[var(--bg-hover)] border-2 border-[var(--border-main)] rounded-2xl p-6 text-xl font-bold focus:border-[#1cb0f6] focus:bg-[var(--bg-card)] transition-all outline-none placeholder:text-[var(--text-muted)] resize-none h-32"
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
              onClick={() => onComplete(true)}
              className="w-full h-16 btn-3d btn-green rounded-2xl text-lg font-black"
            >
              CONTINUE JOURNEY
            </button>
          )}

          {feedback === 'retry' && (
            <div className="w-full p-4 bg-[#fff5f5] border-2 border-[#ff4b4b] rounded-2xl animate-in shake duration-300">
               <p className="text-center text-[#ff4b4b] font-black text-sm uppercase">Accuracy: {accuracy}% - Not quite right! Listen again. 🔄</p>
            </div>
          )}

          {isFinished && (
            <div className="w-full p-6 bg-[#f2fcf0] border-2 border-[#58cc02] rounded-2xl text-center space-y-2 animate-in zoom-in-95 duration-500">
               <p className="text-[#58cc02] font-black uppercase text-xs tracking-widest">Excellent Work!</p>
               <p className="text-xl font-bold text-[var(--text-main)] leading-tight">"{lesson.targetText}"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
