import { useEffect, useRef, useState, useCallback } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { Download, AlertCircle } from 'lucide-react';

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.js',
  import.meta.url
).toString();

interface PdfViewerProps {
  url: string;
  className?: string;
}

export function PdfViewer({ url, className = '' }: PdfViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  const renderPdf = useCallback(async () => {
    if (!url || !containerRef.current) return;

    try {
      setError(false);
      setLoading(true);

      const container = containerRef.current;
      container.innerHTML = '';

      const pdf = await pdfjsLib.getDocument(url).promise;
      const totalPages = pdf.numPages;

      for (let i = 1; i <= totalPages; i++) {
        const page = await pdf.getPage(i);
        const scale = 1.5;
        const viewport = page.getViewport({ scale });

        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        canvas.style.width = '100%';
        canvas.style.height = 'auto';
        canvas.style.display = 'block';

        const ctx = canvas.getContext('2d')!;
        await page.render({ canvasContext: ctx, viewport }).promise;

        container.appendChild(canvas);
      }

      setLoading(false);
    } catch (e) {
      console.error('PDF render error:', e);
      setLoading(false);
      setError(true);
    }
  }, [url]);

  useEffect(() => {
    renderPdf();
  }, [renderPdf]);

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
          <p className="text-sm font-semibold text-gray-700 mb-1">Không thể tải PDF</p>
          <p className="text-xs text-gray-400 mb-4">Vui lòng thử lại hoặc tải file về máy</p>
          <div className="flex gap-2 justify-center">
            <button
              onClick={renderPdf}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition-colors"
            >
              Thử lại
            </button>
            <a
              href={url}
              download
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 text-sm font-bold rounded-xl hover:bg-gray-300 transition-colors"
            >
              <Download className="w-4 h-4" />
              Tải về
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
