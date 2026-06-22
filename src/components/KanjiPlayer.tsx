import { useState, useEffect } from 'react';

interface KanjiPlayerProps {
  kanji: string;
}

interface StrokeData {
  d: string;
  id: string;
}

interface NumberData {
  transform: string;
  text: string;
}

export function KanjiPlayer({ kanji }: KanjiPlayerProps) {
  const [strokes, setStrokes] = useState<StrokeData[]>([]);
  const [numbers, setNumbers] = useState<NumberData[]>([]);
  const [activeStrokeIdx, setActiveStrokeIdx] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let isActive = true;
    setStrokes([]);
    setNumbers([]);
    setError('');
    setIsPlaying(false);
    setActiveStrokeIdx(-1);

    const hex = kanji.charCodeAt(0).toString(16).padStart(5, '0');
    fetch(`https://raw.githubusercontent.com/KanjiVG/kanjivg/master/kanji/${hex}.svg`)
      .then((res) => {
        if (!res.ok) throw new Error('Không có dữ liệu Kanji này');
        return res.text();
      })
      .then((text) => {
        if (!isActive) return;
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'image/svg+xml');
        const pathElements = Array.from(doc.querySelectorAll('path'));
        const textElements = Array.from(doc.querySelectorAll('text'));

        setStrokes(pathElements.map((p, i) => ({ d: p.getAttribute('d') || '', id: p.id || `s${i}` })));
        setNumbers(textElements.map((t) => ({ transform: t.getAttribute('transform') || '', text: t.textContent || '' })));
      })
      .catch((err) => {
        if (isActive) setError(err.message);
      });

    return () => {
      isActive = false;
    };
  }, [kanji]);

  useEffect(() => {
    if (!isPlaying) return;

    let currentIdx = 0;
    setActiveStrokeIdx(currentIdx);

    const interval = setInterval(() => {
      currentIdx++;
      if (currentIdx >= strokes.length) {
        clearInterval(interval);
        setTimeout(() => {
          setIsPlaying(false);
          setActiveStrokeIdx(-1); // reset to show all
        }, 1500);
      } else {
        setActiveStrokeIdx(currentIdx);
      }
    }, 800);

    return () => clearInterval(interval);
  }, [isPlaying, strokes.length]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center w-32 h-32 bg-[var(--tint-red)] rounded-[2rem] border-4 border-[var(--red)]">
        <span className="text-4xl font-black text-[var(--red)] font-[serif]">{kanji}</span>
        <span className="text-[10px] font-bold text-[var(--red)] mt-2">Thiếu dữ liệu vẽ</span>
      </div>
    );
  }

  if (strokes.length === 0) {
    return (
      <div className="flex items-center justify-center w-32 h-32 bg-[var(--tint-red)] rounded-[2rem] border-4 border-[var(--red)]">
        <span className="text-5xl font-black text-[var(--red)] opacity-50 animate-pulse">...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <div className="relative w-32 h-32 bg-white rounded-[2rem] border-4 border-[var(--gray-path)] overflow-hidden shadow-inner flex items-center justify-center p-2">
        {/* Grid lines */}
        <div className="absolute inset-0 pointer-events-none border-b border-dashed border-gray-200 top-1/2"></div>
        <div className="absolute inset-0 pointer-events-none border-r border-dashed border-gray-200 left-1/2"></div>
        
        <svg viewBox="0 0 109 109" className="w-full h-full relative z-10">
          {/* Mờ các nét chưa vẽ (hoặc tất cả nếu đang xem tĩnh) */}
          {strokes.map((s) => (
            <path
              key={`bg-${s.id}`}
              d={s.d}
              stroke="#E2E8F0"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          ))}

          {/* Vẽ các nét (nếu đang phát animation thì vẽ tới nét hiện tại) */}
          {strokes.map((s, i) => {
            const isVisible = activeStrokeIdx === -1 || i <= activeStrokeIdx;
            const isCurrent = activeStrokeIdx === i;
            if (!isVisible) return null;

            return (
              <path
                key={`fg-${s.id}`}
                d={s.d}
                stroke={isCurrent ? '#EF4444' : '#1E293B'}
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                className="transition-colors duration-300"
              />
            );
          })}

          {/* Hiển thị số thứ tự nét */}
          {numbers.map((n, i) => {
            const isVisible = activeStrokeIdx === -1 || i <= activeStrokeIdx;
            if (!isVisible) return null;
            return (
              <text
                key={i}
                transform={n.transform}
                fontSize="6"
                fontWeight="bold"
                fill="#EF4444"
                className="animate-in fade-in"
              >
                {n.text}
              </text>
            );
          })}
        </svg>
      </div>

      <button
        onClick={() => setIsPlaying(true)}
        disabled={isPlaying}
        className={`btn-duo btn-blue w-full h-12 flex items-center justify-center text-sm ${isPlaying ? 'opacity-40 cursor-not-allowed' : ''}`}
      >
        {isPlaying ? '⏳ ĐANG PHÁT...' : '🎥 PHÁT ẢNH ĐỘNG HƯỚNG DẪN NÉT VIẾT'}
      </button>
    </div>
  );
}
