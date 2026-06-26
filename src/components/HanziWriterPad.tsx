import { useEffect, useRef, useState } from 'react';
import HanziWriter from 'hanzi-writer';

interface HanziWriterPadProps {
  character: string;
  size?: number;
  mode?: 'animate' | 'quiz';
}

export function HanziWriterPad({ character, size = 200, mode = 'quiz' }: HanziWriterPadProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const writerRef = useRef<HanziWriter | null>(null);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!containerRef.current || !character) return;

    // Only first char
    const char = character.charAt(0);
    setError(false);
    setSuccess(false);
    
    // Clear old
    containerRef.current.innerHTML = '';

    try {
      const writer = HanziWriter.create(containerRef.current, char, {
        width: size,
        height: size,
        padding: size * 0.1,
        strokeAnimationSpeed: 1,
        delayBetweenStrokes: 50,
        strokeColor: '#EF4444', // Red
        radicalColor: '#EF4444',
        highlightColor: '#3B82F6', // Blue for hints
        outlineColor: '#E2E8F0',
        drawingColor: '#334155', // Dark slate
        showCharacter: false,
        showOutline: true,
        showHintAfterMisses: 1, // Reduced to 1 to help users know where to write
        leniency: 2.0, // Make stroke matching much more forgiving
        charDataLoader: (char, onLoad, onError) => {
          fetch(`https://cdn.jsdelivr.net/gh/MadLadSquad/hanzi-writer-data-youyin@master/data/${char}.json`)
            .then(res => {
              if (!res.ok) throw new Error('Network response was not ok');
              return res.json();
            })
            .then(onLoad)
            .catch(onError);
        },
        // @ts-expect-error: missing onLoadCharDataError in types
        onLoadCharDataError: () => {
          setError(true);
        }
      });

      writerRef.current = writer;

      if (mode === 'animate') {
        writer.animateCharacter();
      } else {
        writer.quiz({
          onComplete: () => {
            setSuccess(true);
            setTimeout(() => {
              writer.hideCharacter();
              setSuccess(false);
              writer.quiz(); // Restart quiz
            }, 2000);
          }
        });
      }
    } catch {
      setError(true);
    }

    return () => {
      if (writerRef.current) {
        writerRef.current.cancelQuiz();
      }
    };
  }, [character, size, mode]);

  if (error) {
    return (
      <div 
        style={{ width: size, height: size }} 
        className="flex items-center justify-center bg-gray-bg rounded-xl border-2 border-gray-path"
      >
        <span className="text-xs text-text-muted font-bold">Không có dữ liệu</span>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Background grid lines */}
      <div style={{ width: size, height: size }} className="absolute inset-0 pointer-events-none rounded-xl border-2 border-gray-path overflow-hidden">
        <div className="absolute inset-0 pointer-events-none border-b border-dashed border-gray-300 top-1/2"></div>
        <div className="absolute inset-0 pointer-events-none border-r border-dashed border-gray-300 left-1/2"></div>
      </div>
      
      {/* The HanziWriter SVG container */}
      <div 
        ref={containerRef} 
        style={{ width: size, height: size }} 
        className="relative z-10 cursor-crosshair touch-none"
      ></div>

      {success && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-xl z-20 pointer-events-none animate-in fade-in zoom-in">
          <span className="text-4xl">✨</span>
          <span className="text-xl font-black text-green ml-2">Đúng!</span>
        </div>
      )}
    </div>
  );
}
