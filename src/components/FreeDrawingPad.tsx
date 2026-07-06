import { useRef, useState, useEffect } from 'react';

interface FreeDrawingPadProps {
  character: string;
  size?: number;
}

export function FreeDrawingPad({ character, size = 200 }: FreeDrawingPadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    // Clear canvas when character changes
    handleClear();
  }, [character]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--blue').trim() || '#3B82F6';
    ctx.lineWidth = size * 0.04;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div className="relative flex flex-col items-center">
      <div
        style={{ width: size, height: size }}
        className="relative rounded-xl border-2 overflow-hidden touch-none"
        {...{style: { width: size, height: size, backgroundColor: 'var(--gray-bg)', borderColor: 'var(--gray-path)' }}}
      >
        {/* Background grid lines */}
        <div className="absolute inset-0 pointer-events-none border-b border-dashed top-1/2" style={{ borderColor: 'var(--text-muted)' }}></div>
        <div className="absolute inset-0 pointer-events-none border-r border-dashed left-1/2" style={{ borderColor: 'var(--text-muted)' }}></div>
        
        {/* Character outline to trace */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20 select-none">
          <span style={{ fontSize: size * 0.7, fontFamily: 'sans-serif', color: 'var(--text-main)' }}>{character}</span>
        </div>

        {/* Drawing canvas */}
        <canvas
          ref={canvasRef}
          width={size}
          height={size}
          className="absolute inset-0 cursor-crosshair z-10 touch-none"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseOut={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          onTouchCancel={stopDrawing}
        />
      </div>

      <div className="mt-4 flex gap-2 h-10 items-center">
        <button
          onClick={handleClear}
          className="px-4 py-2 bg-gray-path hover:bg-gray-path-dark text-text-main rounded-lg text-xs font-bold transition-colors"
        >
          Xóa (Clear)
        </button>
      </div>
    </div>
  );
}
