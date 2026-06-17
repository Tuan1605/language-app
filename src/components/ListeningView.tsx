import { useState, useRef } from 'react';
import type { ListeningLesson } from '../types';

interface ListeningViewProps {
  lesson: ListeningLesson;
  onBack: () => void;
  hideBackButton?: boolean;
}

export function ListeningView({ lesson, onBack, hideBackButton }: ListeningViewProps) {
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="bg-[var(--bg-card)] lingo-card p-10 max-w-3xl mx-auto w-full animate-in slide-in-from-bottom-8 duration-500">
      <div className="flex justify-between items-center mb-10">
        {!hideBackButton ? (
          <button onClick={onBack} className="text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        ) : <div className="w-10"></div>}
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${lesson.category === 'toeic' ? 'bg-[#1cb0f6]' : 'bg-[#ff4b4b]'}`}></div>
          <span className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em]">{lesson.category} Audio Lesson</span>
        </div>
        {!hideBackButton ? <div className="w-10"></div> : (
          <button onClick={onBack} className="btn-3d btn-green py-2 px-4 text-[10px]">
            DONE
          </button>
        )}
      </div>

      <h2 className="text-3xl font-black text-[var(--text-main)] mb-10 text-center leading-tight">{lesson.title}</h2>

      <div className="bg-[var(--bg-hover)] p-8 rounded-[2rem] border-2 border-[var(--border-main)] mb-12 shadow-inner">
        <audio 
          ref={audioRef}
          src={lesson.audioUrl}
          onTimeUpdate={handleTimeUpdate}
          onEnded={() => setIsPlaying(false)}
          className="hidden"
        />
        
        <div className="flex items-center gap-6">
          <button 
            onClick={togglePlay}
            className={`w-16 h-16 rounded-full flex items-center justify-center text-white shadow-xl transition-all active:scale-95 ${isPlaying ? 'bg-[#ff4b4b]' : 'bg-[#58cc02]'}`}
          >
            {isPlaying ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132A1 1 0 0010 11.5v-0.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            )}
          </button>
          
          <div className="flex-1 h-3 bg-[var(--border-main)] rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#58cc02] transition-all duration-300" 
              style={{ width: `${(currentTime / (audioRef.current?.duration || 1)) * 100}%` }}
            />
          </div>
          
          <span className="text-xs font-black text-[var(--text-muted)] w-10 text-right tabular-nums">
            {Math.floor(currentTime)}s
          </span>
        </div>
      </div>

      <div className="space-y-6 max-h-[500px] overflow-y-auto pr-4 custom-scrollbar">
        <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] mb-4">Transcript & Translation</p>
        {lesson.transcript.map((item, index) => {
          const isActive = currentTime >= item.time && (index === lesson.transcript.length - 1 || currentTime < lesson.transcript[index + 1].time);
          
          return (
            <div 
              key={index}
              className={`p-6 rounded-2xl transition-all border-2 ${
                isActive 
                ? 'bg-[var(--bg-card)] border-[#1cb0f6] shadow-md scale-[1.02]' 
                : 'bg-transparent border-transparent opacity-50'
              }`}
            >
              <p className={`text-xl leading-relaxed font-bold ${isActive ? 'text-[var(--text-main)]' : 'text-[var(--text-muted)]'}`}>
                {item.text}
              </p>
              {item.translation && (
                <p className="text-sm text-[var(--text-muted)] mt-3 italic font-medium">{item.translation}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
