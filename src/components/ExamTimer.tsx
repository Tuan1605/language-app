import { useState, useEffect } from 'react';

interface ExamTimerProps {
  initialTime: number;
  onTimeTick: (time: number) => void;
  onTimeUp: () => void;
  isFinished: boolean;
}

export function ExamTimer({ initialTime, onTimeTick, onTimeUp, isFinished }: ExamTimerProps) {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    if (isFinished) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          onTimeUp();
          return 0;
        }
        const newTime = prev - 1;
        onTimeTick(newTime);
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isFinished, onTimeTick, onTimeUp]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? h + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`font-black text-xl tracking-wider ${timeLeft < 300 ? 'text-red animate-pulse' : 'text-blue'}`}>
      ⏱ {formatTime(timeLeft)}
    </div>
  );
}
