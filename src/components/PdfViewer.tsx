import { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.js?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

interface PdfViewerProps {
  url: string;
  className?: string;
}

export function PdfViewer({ url, className = '' }: PdfViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const renderQueue = useRef<{ page: number; canvas: HTMLCanvasElement }[]>([]);
  const rendering = useRef(false);
  const pdfRef = useRef<pdfjsLib.PDFDocumentProxy | null>(null);

  const renderPage = async (pdf: pdfjsLib.PDFDocumentProxy, pageNum: number, canvas: HTMLCanvasElement) => {
    const page = await pdf.getPage(pageNum);
    const viewport = page.getViewport({ scale: 1.5 });
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.height = viewport.height;
    canvas.width = viewport.width;

    await page.render({ canvasContext: ctx, viewport }).promise;
  };

  const processQueue = async () => {
    if (rendering.current || renderQueue.current.length === 0 || !pdfRef.current) return;
    rendering.current = true;

    while (renderQueue.current.length > 0) {
      const item = renderQueue.current.shift()!;
      try {
        await renderPage(pdfRef.current, item.page, item.canvas);
      } catch (e) {
        console.warn(`Failed to render page ${item.page}:`, e);
      }
    }
    rendering.current = false;
  };

  useEffect(() => {
    let cancelled = false;
    const container = containerRef.current;
    if (!container || !url) return;

    let finalUrl = url;
    // Use CORS proxy for GitHub Releases URLs
    if (url.includes('github.com')) {
      finalUrl = `https://corsproxy.io/?url=${encodeURIComponent(url)}`;
    }

    const loadPdf = async () => {
      setLoading(true);
      setError(null);
      container.innerHTML = '';

      try {
        const response = await fetch(finalUrl);
        if (!response.ok) throw new Error(`Failed to load PDF: ${response.status} ${response.statusText}`);
        
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('text/html')) {
          throw new Error('Received an HTML page instead of a PDF. This might be due to Vercel SSO or a broken URL.');
        }

        const arrayBuffer = await response.arrayBuffer();

        // Add a timeout to prevent infinite spinner if pdf.js worker hangs
        const timeoutPromise = new Promise<never>((_, reject) => 
          setTimeout(() => reject(new Error('PDF loading timed out. The worker might have failed to initialize.')), 15000)
        );

        const pdf = await Promise.race([
          pdfjsLib.getDocument({ data: arrayBuffer }).promise,
          timeoutPromise
        ]);

        if (cancelled) return;

        pdfRef.current = pdf;
        setLoading(false);

        for (let i = 1; i <= pdf.numPages; i++) {
          if (cancelled) return;

          const wrapper = document.createElement('div');
          wrapper.className = 'pdf-page-wrapper';
          wrapper.style.cssText = 'margin-bottom: 8px; text-align: center;';

          const canvas = document.createElement('canvas');
          canvas.className = 'pdf-page-canvas';
          canvas.style.cssText = 'max-width: 100%; height: auto; border: 1px solid #e5e7eb; border-radius: 4px;';
          wrapper.appendChild(canvas);

          const pageLabel = document.createElement('div');
          pageLabel.className = 'pdf-page-label';
          pageLabel.style.cssText = 'font-size: 11px; color: #9ca3af; margin-top: 4px;';
          pageLabel.textContent = `Page ${i} / ${pdf.numPages}`;
          wrapper.appendChild(pageLabel);

          container.appendChild(wrapper);

          renderQueue.current.push({ page: i, canvas });
        }

        processQueue();
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Failed to load PDF');
          setLoading(false);
        }
      }
    };

    loadPdf();

    return () => {
      cancelled = true;
      renderQueue.current = [];
      pdfRef.current = null;
    };
  }, [url]);

  if (loading) {
    return (
      <div className={`flex items-center justify-center bg-gray-50 ${className}`}>
        <div className="text-center">
          <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-sm text-gray-500">Loading PDF...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-gray-50 ${className}`}>
        <div className="text-center p-4">
          <p className="text-sm text-red-500 mb-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`overflow-y-auto bg-gray-50 ${className}`}
      style={{ scrollBehavior: 'smooth' }}
      onContextMenu={(e) => e.preventDefault()}
    />
  );
}
