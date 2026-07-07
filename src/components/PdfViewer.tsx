import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { AlertCircle } from 'lucide-react';

// Use a stable CDN for worker to ensure it loads perfectly on all environments without blocking main thread
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface PdfViewerProps {
  url: string;
  className?: string;
}

function PdfPage({ pdf, pageNum, scale }: { pdf: pdfjsLib.PDFDocumentProxy, pageNum: number, scale: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isRendered, setIsRendered] = useState(false);
  const [actualHeight, setActualHeight] = useState<number>(800 * scale);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        }
      },
      { rootMargin: '800px 0px' } // Preload when within 800px of viewport
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible || !pdf || !canvasRef.current || isRendered) return;
    let active = true;

    const renderPage = async () => {
      try {
        const page = await pdf.getPage(pageNum);
        if (!active) return;
        const viewport = page.getViewport({ scale });
        
        setActualHeight(viewport.height);
        
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        // Use devicePixelRatio for sharper text on mobile displays
        const ratio = window.devicePixelRatio || 1;
        canvas.width = viewport.width * ratio;
        canvas.height = viewport.height * ratio;
        canvas.style.width = `${viewport.width}px`;
        canvas.style.height = `${viewport.height}px`;
        ctx.scale(ratio, ratio);
        
        await page.render({ canvasContext: ctx, viewport }).promise;
        if (active) setIsRendered(true);
      } catch (e) {
        console.error('Error rendering page', pageNum, e);
      }
    };
    renderPage();

    return () => { active = false; };
  }, [isVisible, pdf, pageNum, scale, isRendered]);

  return (
    <div 
      ref={containerRef} 
      className="w-full relative bg-white shadow-sm mb-4 flex justify-center overflow-hidden" 
      style={{ minHeight: `${actualHeight}px` }}
    >
      <canvas ref={canvasRef} className="max-w-full" />
    </div>
  );
}

export function PdfViewer({ url, className = '' }: PdfViewerProps) {
  const [pdf, setPdf] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(0);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };
    setTimeout(updateWidth, 100); // Give layout time to settle
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, [url]);

  const loadPdf = useCallback(async () => {
    if (!url) return;
    try {
      setError(null);
      setLoading(true);
      setPdf(null);

      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const buf = await response.arrayBuffer();
      const data = new Uint8Array(buf);

      const magic = String.fromCharCode(...data.slice(0, 4));
      if (magic !== '%PDF') throw new Error('File không phải PDF hợp lệ');

      const loadedPdf = await pdfjsLib.getDocument({ data }).promise;
      setPdf(loadedPdf);
      setLoading(false);
    } catch (e: any) {
      console.error('PDF load error:', e);
      setLoading(false);
      setError(e.message || 'Lỗi không xác định');
    }
  }, [url]);

  useEffect(() => {
    loadPdf();
  }, [loadPdf]);

  // Calculate dynamic scale so PDF fits exactly into the mobile/PC container
  const scale = useMemo(() => {
    if (!containerWidth) return 1.0;
    const baseWidth = 595; // Approximate A4 width
    const targetWidth = containerWidth - 32; // Account for padding
    return Math.max(0.4, Math.min(2.0, targetWidth / baseWidth));
  }, [containerWidth]);

  if (!url) {
    return (
      <div className={`flex items-center justify-center bg-gray-50 ${className}`}>
        <p className="text-sm text-gray-500">Không tìm thấy file PDF</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-gray-50 ${className}`}>
        <div className="text-center p-6 max-w-sm">
          <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
          <p className="text-sm font-semibold text-gray-700 mb-1">Không thể hiển thị PDF</p>
          <p className="text-xs text-red-400 mb-4 break-all">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`${className} overflow-y-auto overflow-x-hidden bg-gray-100 p-2 sm:p-4`}>
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-gray-500">Đang mở tài liệu...</p>
          </div>
        </div>
      )}
      {pdf && containerWidth > 0 && (
        <div className="flex flex-col items-center w-full max-w-4xl mx-auto">
          {Array.from({ length: pdf.numPages }, (_, i) => (
            <PdfPage key={i + 1} pdf={pdf} pageNum={i + 1} scale={scale} />
          ))}
        </div>
      )}
    </div>
  );
}
