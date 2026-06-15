import { useState, useRef } from 'react';
import type { ListeningLesson } from '../types';

interface ListeningViewProps {
  lesson: ListeningLesson;
  onBack: () => void;
}

export function ListeningView({ lesson, onBack }: ListeningViewProps) {
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
    <div className="bg-white p-8 rounded-2xl shadow-xl max-w-2xl w-full">
      <div className="flex justify-between items-center mb-6">
        <button onClick={onBack} className="text-indigo-600 font-medium">← Quay lại</button>
        <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">{lesson.category.toUpperCase()} Listening</span>
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mb-6">{lesson.title}</h2>

      <div className="bg-gray-50 p-6 rounded-xl mb-8">
        <audio 
          ref={audioRef}
          src={lesson.audioUrl}
          onTimeUpdate={handleTimeUpdate}
          onEnded={() => setIsPlaying(false)}
          className="hidden"
        />
        
        <div className="flex items-center space-x-4">
          <button 
            onClick={togglePlay}
            className="bg-indigo-600 text-white p-4 rounded-full hover:bg-indigo-700 transition shadow-md"
          >
            {isPlaying ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </button>
          
          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-indigo-500 transition-all duration-100" 
              style={{ width: `${(currentTime / (audioRef.current?.duration || 1)) * 100}%` }}
            />
          </div>
          
          <span className="text-xs font-mono text-gray-500 w-12 text-right">
            {Math.floor(currentTime)}s
          </span>
        </div>
      </div>

      <div className="space-y-6 max-h-96 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Transcript</h3>
        {lesson.transcript.map((item, index) => {
          const isActive = currentTime >= item.time && (index === lesson.transcript.length - 1 || currentTime < lesson.transcript[index + 1].time);
          
          return (
            <div 
              key={index}
              className={`p-4 rounded-lg transition border-l-4 ${
                isActive 
                ? 'bg-indigo-50 border-indigo-500 shadow-sm' 
                : 'bg-white border-transparent'
              }`}
            >
              <p className={`text-lg leading-relaxed ${isActive ? 'text-indigo-900 font-medium' : 'text-gray-600'}`}>
                {item.text}
              </p>
              {item.translation && (
                <p className="text-sm text-gray-400 mt-2 italic">{item.translation}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
