import { useEffect, useRef, useState, useCallback } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { Download, AlertCircle } from 'lucide-react';

pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.js';

interface PdfViewerProps {
  url: string;
  className?: string;
}

export function PdfViewer({ url, className = '' }: PdfViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const pdfDocRef = useRef<any>(null);
  const renderedPages = useRef<Set<number>>(new Set());
  const canvasMap = useRef<Map<number, HTMLCanvasElement>>(new Map());

  const renderPage = useCallback(async (pageNum: number) => {
    if (!pdfDocRef.current || renderedPages.current.has(pageNum)) return;

    const pdf = pdfDocRef.current;
    const page = await pdf.getPage(pageNum);

    const container = containerRef.current;
    const containerWidth = container?.clientWidth || 800;
    const viewport = page.getViewport({ scale: 1 });
    const scale = (containerWidth - 16) / viewport.width;
    const scaledViewport = page.getViewport({ scale });

    const canvas = document.createElement('canvas');
    canvas.width = scaledViewport.width;
    canvas.height = scaledViewport.height;
    canvas.style.width = '100%';
    canvas.style.height = 'auto';
    canvas.style.display = 'block';
    canvas.style.marginBottom = '4px';

    const ctx = canvas.getContext('2d')!;
    await page.render({ canvasContext: ctx, viewport: scaledViewport }).promise;

    renderedPages.current.add(pageNum);
    canvasMap.current.set(pageNum, canvas);
  }, []);

  const loadPdf = useCallback(async () => {
    if (!url || !containerRef.current) return;

    try {
      setError(null);
      setTotalPages(0);
      renderedPages.current.clear();
      canvasMap.current.clear();
      containerRef.current.innerHTML = '';

      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const buf = await response.arrayBuffer();
      const data = new Uint8Array(buf);
      const magic = String.fromCharCode(...data.slice(0, 4));
      if (magic !== '%PDF') throw new Error('File không phải PDF hợp lệ');

      const pdf = await pdfjsLib.getDocument({ data }).promise;
      pdfDocRef.current = pdf;
      setTotalPages(pdf.numPages);

      // Lazy loading: render first 3 pages, rest on scroll
      const pagesToInit = Math.min(3, pdf.numPages);
      for (let i = 1; i <= pagesToInit; i++) {
        await renderPage(i);
        containerRef.current.appendChild(canvasMap.current.get(i)!);
      }

      // Add placeholder divs for remaining pages
      for (let i = pagesToInit + 1; i <= pdf.numPages; i++) {
        const placeholder = document.createElement('div');
        placeholder.dataset.page = String(i);
        placeholder.style.minHeight = '600px';
        containerRef.current.appendChild(placeholder);
      }
    } catch (e: any) {
      console.error('PDF error:', e);
      setError(e.message || 'Lỗi không xác định');
    }
  }, [url, renderPage]);

  // IntersectionObserver for lazy loading
  useEffect(() => {
    const container = containerRef.current;
    if (!container || totalPages === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(async (entry) => {
          if (entry.isIntersecting) {
            const pageNum = parseInt((entry.target as HTMLElement).dataset.page || '0');
            if (pageNum > 0 && !renderedPages.current.has(pageNum)) {
              await renderPage(pageNum);
              const canvas = canvasMap.current.get(pageNum);
              if (canvas) {
                entry.target.replaceWith(canvas);
                entry.target.remove();
              }
              observer.unobserve(entry.target);
            }
          }
        });
      },
      { root: container, rootMargin: '400px 0px' }
    );

    const placeholders = container.querySelectorAll<HTMLElement>('[data-page]');
    placeholders.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [totalPages, renderPage]);

  useEffect(() => {
    loadPdf();
    return () => { pdfDocRef.current = null; };
  }, [loadPdf]);

  if (!url) {
    return (
      <div className={`flex items-center justify-center bg-gray-50 ${className}`}>
        <p className="text-sm text-gray-500">No PDF URL provided</p>
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
          <div className="flex gap-2 justify-center flex-wrap">
            <button onClick={loadPdf} className="px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-xl">
              Thử lại
            </button>
            <a href={url} target="_blank" rel="noopener noreferrer"
              className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-bold rounded-xl">
              Mở tab mới
            </a>
            <a href={url} download
              className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-bold rounded-xl">
              <Download className="w-4 h-4 inline mr-1" />Tải về
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className} overflow-auto`}>
      {totalPages === 0 && (
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-gray-500">Đang tải PDF...</p>
          </div>
        </div>
      )}
      <div ref={containerRef} className="flex flex-col items-center" />
    </div>
  );
}
