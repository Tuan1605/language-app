import { useState, useEffect, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { Download, AlertCircle } from 'lucide-react';

pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.js';

function isMobile(): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    || window.innerWidth < 768;
}

interface PdfViewerProps {
  url: string;
  className?: string;
}

export function PdfViewer({ url, className = '' }: PdfViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobile] = useState(isMobile);

  useEffect(() => {
    if (!url || !containerRef.current || mobile) return;

    let cancelled = false;
    const container = containerRef.current;
    container.innerHTML = '';

    async function load() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const buf = await response.arrayBuffer();
        const data = new Uint8Array(buf);
        if (String.fromCharCode(...data.slice(0, 4)) !== '%PDF') {
          throw new Error('File không phải PDF');
        }

        const pdf = await pdfjsLib.getDocument({ data }).promise;
        if (cancelled) return;

        const containerWidth = container.clientWidth || 800;

        for (let i = 1; i <= pdf.numPages; i++) {
          if (cancelled) return;

          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 1 });
          const scale = (containerWidth - 16) / viewport.width;
          const scaled = page.getViewport({ scale });

          const canvas = document.createElement('canvas');
          canvas.width = scaled.width;
          canvas.height = scaled.height;
          canvas.style.width = '100%';
          canvas.style.height = 'auto';
          canvas.style.display = 'block';

          const ctx = canvas.getContext('2d')!;
          await page.render({ canvasContext: ctx, viewport: scaled }).promise;

          if (cancelled) return;
          container.appendChild(canvas);
        }

        if (!cancelled) setLoading(false);
      } catch (e: any) {
        if (!cancelled) {
          setLoading(false);
          setError(e.message || 'Lỗi không xác định');
        }
      }
    }

    load();
    return () => { cancelled = true; };
  }, [url, mobile]);

  if (!url) {
    return (
      <div className={`flex items-center justify-center bg-gray-50 ${className}`}>
        <p className="text-sm text-gray-500">No PDF URL provided</p>
      </div>
    );
  }

  // Mobile: show download/open buttons (phone PDF viewers work better)
  if (mobile) {
    return (
      <div className={`flex items-center justify-center bg-gray-50 ${className}`}>
        <div className="text-center p-6 max-w-sm">
          <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-2xl flex items-center justify-center">
            <Download className="w-8 h-8 text-blue-500" />
          </div>
          <p className="text-sm font-semibold text-gray-700 mb-1">PDF Exam</p>
          <p className="text-xs text-gray-400 mb-4">Mở trong ứng dụng PDF để xem tốt nhất</p>
          <div className="flex gap-2 justify-center">
            <a href={url} target="_blank" rel="noopener noreferrer"
              className="px-5 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl">
              Mở PDF
            </a>
            <a href={url} download
              className="px-5 py-2.5 bg-gray-200 text-gray-700 text-sm font-bold rounded-xl">
              <Download className="w-4 h-4 inline mr-1" />Tải về
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Desktop: render PDF inline with pdf.js
  if (error) {
    return (
      <div className={`flex items-center justify-center bg-gray-50 ${className}`}>
        <div className="text-center p-6 max-w-sm">
          <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
          <p className="text-sm font-semibold text-gray-700 mb-1">Không thể hiển thị PDF</p>
          <p className="text-xs text-red-400 mb-4 break-all">{error}</p>
          <div className="flex gap-2 justify-center flex-wrap">
            <a href={url} target="_blank" rel="noopener noreferrer"
              className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-bold rounded-xl">Mở tab mới</a>
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
      {loading && (
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
