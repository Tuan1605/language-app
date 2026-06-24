import { useState, useRef, useEffect, useCallback } from 'react';
import type { ListeningLesson } from '../types';
import { speak, stopSpeaking, hasVoiceFor, langForCategory } from '../utils/tts';
import { Volume2, Play, Pause, Rewind, FastForward, Gauge } from 'lucide-react';

interface ListeningViewProps {
  lesson: ListeningLesson;
  onBack: () => void;
  hideBackButton?: boolean;
}

export function ListeningView({ lesson, onBack, hideBackButton }: ListeningViewProps) {
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const [playbackRate, setPlaybackRate] = useState(1);
  const audioRef = useRef<HTMLAudioElement>(null);
  const ttsTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const ttsDoneRef = useRef(false);

  const ttsLang = langForCategory(lesson.category);
  const [voiceReady, setVoiceReady] = useState(() => hasVoiceFor(ttsLang));
  
  useEffect(() => {
    if (!('speechSynthesis' in window)) return;
    const check = () => setVoiceReady(hasVoiceFor(ttsLang));
    check();
    window.speechSynthesis.addEventListener('voiceschanged', check);
    return () => window.speechSynthesis.removeEventListener('voiceschanged', check);
  }, [ttsLang]);

  const clearTTSTimers = useCallback(() => {
    ttsTimersRef.current.forEach(id => clearTimeout(id));
    ttsTimersRef.current = [];
  }, []);

  useEffect(() => {
    return () => {
      stopSpeaking();
      clearTTSTimers();
    };
  }, [clearTTSTimers]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const skipTime = (amount: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, Math.min(audioRef.current.duration || 0, audioRef.current.currentTime + amount));
    }
  };

  const seekToTime = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      if (!isPlaying) {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const cyclePlaybackRate = () => {
    setPlaybackRate(prev => {
      if (prev === 1) return 1.25;
      if (prev === 1.25) return 0.75;
      return 1;
    });
  };

  const togglePlay = () => {
    if (lesson.audioUrl && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
      return;
    }

    if (isPlaying) {
      stopSpeaking();
      clearTTSTimers();
      setIsPlaying(false);
      setActiveIdx(-1);
      return;
    }

    ttsDoneRef.current = false;
    setIsPlaying(true);
    clearTTSTimers();

    const transcript = lesson.transcript;
    const estimatedMsPerChar = langForCategory(lesson.category) === 'ja-JP' ? 120 : 70;
    let accumulated = 0;
    const timers: ReturnType<typeof setTimeout>[] = [];

    for (let i = 0; i < transcript.length; i++) {
      const text = transcript[i].text;
      const dur = Math.max(800, text.length * estimatedMsPerChar);
      accumulated += dur;

      const idx = i;
      timers.push(setTimeout(() => {
        setActiveIdx(idx);
      }, accumulated));
    }

    const totalDur = accumulated + 500;
    timers.push(setTimeout(() => {
      setActiveIdx(-1);
      setIsPlaying(false);
      ttsDoneRef.current = true;
    }, totalDur));

    ttsTimersRef.current = timers;

    const fullText = transcript.map((t) => t.text).join(' ');
    const started = speak(fullText, {
      lang: langForCategory(lesson.category),
      onStart: () => {
        setActiveIdx(0);
        setIsPlaying(true);
      },
      onEnd: () => {
        clearTTSTimers();
        setActiveIdx(-1);
        setIsPlaying(false);
        ttsDoneRef.current = true;
      },
    });
    if (!started) {
      clearTTSTimers();
      setIsPlaying(false);
      setActiveIdx(-1);
    }
  };

  const progressPercent = lesson.audioUrl && audioRef.current?.duration
    ? (currentTime / (audioRef.current.duration || 1)) * 100
    : activeIdx >= 0
      ? Math.min(100, ((activeIdx + 1) / lesson.transcript.length) * 100)
      : isPlaying ? 100 : 0;

  return (
    <div className="bg-[var(--bg-card)] lingo-card p-10 max-w-3xl mx-auto w-full animate-in slide-in-from-bottom-8 duration-500">
      <div className="flex justify-between items-center mb-10">
        {!hideBackButton ? (
          <button onClick={onBack} aria-label="Go back" className="text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        ) : <div className="w-10"></div>}
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${lesson.category === 'toeic' ? 'bg-[var(--blue)]' : 'bg-[var(--red)]'}`}></div>
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

        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-6">
            <button
              onClick={togglePlay}
              className={`w-16 h-16 rounded-full flex items-center justify-center text-white shadow-xl transition-all active:scale-95 shrink-0 ${isPlaying ? 'bg-[var(--red)]' : 'bg-[var(--green)]'}`}
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause size={32} fill="currentColor" />
              ) : (
                <Play size={32} fill="currentColor" className="ml-1" />
              )}
            </button>

            <div className="flex-1 h-4 bg-[var(--bg-card)] border-2 border-[var(--border-main)] rounded-full overflow-hidden cursor-pointer" onClick={(e) => {
              if (lesson.audioUrl && audioRef.current && audioRef.current.duration) {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const percentage = x / rect.width;
                seekToTime(percentage * audioRef.current.duration);
              }
            }}>
              <div
                className="h-full bg-[var(--green)] transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <span className="text-xs font-black text-[var(--text-muted)] w-10 text-right tabular-nums shrink-0">
              {Math.floor(currentTime)}s
            </span>
          </div>

          {lesson.audioUrl && (
            <div className="flex items-center justify-center gap-4 pt-2 border-t-2 border-[var(--border-main)] border-dashed">
              <button onClick={() => skipTime(-5)} className="p-3 rounded-full hover:bg-[var(--gray-path)] transition-colors text-[var(--text-muted)] hover:text-[var(--text-main)] flex flex-col items-center gap-1 active:scale-95" aria-label="Rewind 5s">
                <Rewind size={20} />
                <span className="text-[10px] font-black tracking-widest">-5s</span>
              </button>
              
              <button onClick={cyclePlaybackRate} className="p-3 rounded-xl hover:bg-[var(--gray-path)] transition-colors text-[var(--text-muted)] hover:text-[var(--text-main)] flex items-center gap-2 active:scale-95" aria-label="Change Speed">
                <Gauge size={20} />
                <span className="text-xs font-black w-8 text-center">{playbackRate}x</span>
              </button>

              <button onClick={() => skipTime(5)} className="p-3 rounded-full hover:bg-[var(--gray-path)] transition-colors text-[var(--text-muted)] hover:text-[var(--text-main)] flex flex-col items-center gap-1 active:scale-95" aria-label="Forward 5s">
                <FastForward size={20} />
                <span className="text-[10px] font-black tracking-widest">+5s</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {!lesson.audioUrl && !voiceReady && (
        <p className="text-xs text-[var(--blue)] font-bold text-center mb-6 flex items-center justify-center gap-2">
          <Volume2 size={16} /> Sẽ dùng giọng đọc online. Bấm Play để nghe.
        </p>
      )}

      <div className="space-y-6 max-h-[500px] overflow-y-auto pr-4 custom-scrollbar">
        <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] mb-4">Transcript & Translation</p>
        {lesson.transcript.map((item, index) => {
          const isActive = lesson.audioUrl
            ? (currentTime >= item.time && (index === lesson.transcript.length - 1 || currentTime < lesson.transcript[index + 1].time))
            : activeIdx === index;

          return (
            <div
              key={index}
              onClick={() => {
                if (lesson.audioUrl) {
                  seekToTime(item.time);
                }
              }}
              className={`p-6 rounded-2xl transition-all border-2 ${lesson.audioUrl ? 'cursor-pointer hover:border-[var(--blue)]/50 hover:bg-[var(--tint-blue)]' : ''} ${
                isActive
                ? 'bg-[var(--bg-card)] border-[var(--blue)] shadow-md scale-[1.02]'
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
