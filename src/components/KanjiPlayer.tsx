import { useState, useEffect, useRef, useCallback } from 'react';

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

function getPathStartPoint(d: string): { x: number; y: number } | null {
  const match = d.match(/[Mm]\s*([\d.]+)[\s,]+([\d.]+)/);
  if (match) return { x: parseFloat(match[1]), y: parseFloat(match[2]) };
  return null;
}

export function KanjiPlayer({ kanji }: KanjiPlayerProps) {
  const [strokes, setStrokes] = useState<StrokeData[]>([]);
  const [numbers, setNumbers] = useState<NumberData[]>([]);
  const [activeStrokeIdx, setActiveStrokeIdx] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState('');
  const svgContainerRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number>(0);

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

    return () => { isActive = false; };
  }, [kanji]);

  // Get all foreground path elements from the SVG
  const getFgPaths = useCallback((): SVGPathElement[] => {
    if (!svgContainerRef.current) return [];
    return Array.from(svgContainerRef.current.querySelectorAll('path[data-fg="true"]'));
  }, []);

  // Animate a single stroke
  const animateStroke = useCallback((idx: number): Promise<void> => {
    return new Promise((resolve) => {
      setActiveStrokeIdx(idx);

      // Wait for DOM to update, then find the path
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const fgPaths = getFgPaths();
          const pathEl = fgPaths[idx];

          if (!pathEl) {
            setTimeout(resolve, 600);
            return;
          }

          const totalLen = pathEl.getTotalLength();
          pathEl.style.strokeDasharray = `${totalLen}`;
          pathEl.style.strokeDashoffset = `${totalLen}`;

          const duration = 800;
          const start = performance.now();

          const step = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            pathEl.style.strokeDashoffset = `${totalLen * (1 - eased)}`;

            if (progress < 1) {
              animFrameRef.current = requestAnimationFrame(step);
            } else {
              pathEl.style.strokeDashoffset = '0';
              setTimeout(resolve, 200);
            }
          };
          animFrameRef.current = requestAnimationFrame(step);
        });
      });
    });
  }, [getFgPaths]);

  // Play all strokes
  const playAnimation = useCallback(async () => {
    setIsPlaying(true);
    setActiveStrokeIdx(-1);

    // Reset all path styles first
    const fgPaths = getFgPaths();
    fgPaths.forEach(p => {
      p.style.strokeDasharray = '';
      p.style.strokeDashoffset = '';
    });

    for (let i = 0; i < strokes.length; i++) {
      await animateStroke(i);
    }

    setTimeout(() => {
      setIsPlaying(false);
      setActiveStrokeIdx(-1);
      // Reset all path styles
      const paths = getFgPaths();
      paths.forEach(p => {
        p.style.strokeDasharray = '';
        p.style.strokeDashoffset = '';
      });
    }, 1000);
  }, [strokes.length, animateStroke, getFgPaths]);

  useEffect(() => {
    return () => cancelAnimationFrame(animFrameRef.current);
  }, []);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center w-32 h-32 rounded-[2rem] border-4" style={{ backgroundColor: 'var(--tint-red)', borderColor: 'var(--red)' }}>
        <span className="text-4xl font-black font-[serif]" style={{ color: 'var(--red)' }}>{kanji}</span>
        <span className="text-[10px] font-bold mt-2" style={{ color: 'var(--red)' }}>Thiếu dữ liệu vẽ</span>
      </div>
    );
  }

  if (strokes.length === 0) {
    return (
      <div className="flex items-center justify-center w-32 h-32 rounded-[2rem] border-4" style={{ backgroundColor: 'var(--tint-red)', borderColor: 'var(--red)' }}>
        <span className="text-5xl font-black opacity-50 animate-pulse" style={{ color: 'var(--red)' }}>...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3 w-full">
      <div ref={svgContainerRef} className="relative w-36 h-36 rounded-[2rem] border-4 overflow-hidden shadow-inner flex items-center justify-center p-2" style={{ backgroundColor: 'var(--bg-hover)', borderColor: 'var(--gray-path)' }}>
        {/* Grid lines */}
        <div className="absolute inset-0 pointer-events-none" style={{ borderColor: 'var(--text-muted)', opacity: 0.2 }}>
          <div className="absolute left-0 right-0 top-1/2 border-t border-dashed" style={{ borderColor: 'inherit' }}></div>
          <div className="absolute top-0 bottom-0 left-1/2 border-l border-dashed" style={{ borderColor: 'inherit' }}></div>
        </div>

        <svg viewBox="0 0 109 109" className="w-full h-full relative z-10">
          {/* Ghost strokes (guides) */}
          {strokes.map((s, i) => (
            <path
              key={`bg-${s.id}`}
              d={s.d}
              stroke="var(--text-muted)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              opacity={activeStrokeIdx === -1 ? 0.2 : (i <= activeStrokeIdx ? 0 : 0.12)}
            />
          ))}

          {/* Foreground strokes with animation */}
          {strokes.map((s, i) => {
            const isPast = activeStrokeIdx !== -1 && i < activeStrokeIdx;
            const isCurrent = activeStrokeIdx === i;
            const isFuture = activeStrokeIdx !== -1 && i > activeStrokeIdx;
            if (isFuture && isPlaying) return null;

            let strokeColor = 'var(--text-main)';
            let sw = 4;
            if (isCurrent && isPlaying) {
              strokeColor = 'var(--blue)';
              sw = 5;
            } else if (isPast) {
              strokeColor = 'var(--text-main)';
            }

            return (
              <path
                key={`fg-${s.id}`}
                data-fg="true"
                d={s.d}
                stroke={strokeColor}
                strokeWidth={sw}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            );
          })}

          {/* Start point indicator */}
          {isPlaying && activeStrokeIdx >= 0 && activeStrokeIdx < strokes.length && (() => {
            const pt = getPathStartPoint(strokes[activeStrokeIdx].d);
            if (!pt) return null;
            return <circle cx={pt.x} cy={pt.y} r="3.5" fill="var(--red)" className="animate-pulse" />;
          })()}

          {/* Stroke numbers - only show during animation, current stroke only */}
          {isPlaying && activeStrokeIdx >= 0 && numbers[activeStrokeIdx] && (
            <text
              transform={numbers[activeStrokeIdx].transform}
              fontSize="8"
              fontWeight="bold"
              fill="var(--blue)"
            >
              {numbers[activeStrokeIdx].text}
            </text>
          )}
        </svg>

        {/* Stroke counter */}
        {isPlaying && activeStrokeIdx >= 0 && (
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-[9px] font-black" style={{ backgroundColor: 'var(--blue)', color: 'white' }}>
            {activeStrokeIdx + 1}/{strokes.length}
          </div>
        )}
      </div>

      <button
        onClick={playAnimation}
        disabled={isPlaying}
        className={`btn-duo btn-blue w-full h-11 flex items-center justify-center text-sm gap-2 ${isPlaying ? 'opacity-40 cursor-not-allowed' : ''}`}
      >
        {isPlaying ? (
          <>
            <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ĐANG PHÁT...
          </>
        ) : (
          'XEM CÁCH VIẾT'
        )}
      </button>

      <p className="text-[10px] font-bold" style={{ color: 'var(--text-muted)' }}>
        {strokes.length} nét
      </p>
    </div>
  );
}
