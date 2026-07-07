import { useEffect, useRef, useState } from 'react';
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
  const [loading, setLoading] = useState(true);
  const pdfDocRef = useRef<any>(null);
  const renderedRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    if (!url || !containerRef.current) return;

    let cancelled = false;
    const container = containerRef.current;
    container.innerHTML = '';
    renderedRef.current.clear();
    pdfDocRef.current = null;
    setLoading(true);
    setError(null);

    async function load() {
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const buf = await response.arrayBuffer();
        const data = new Uint8Array(buf);
        if (String.fromCharCode(...data.slice(0, 4)) !== '%PDF') {
          throw new Error('File không phải PDF');
        }

        const pdf = await pdfjsLib.getDocument({ data }).promise;
        if (cancelled) return;
        pdfDocRef.current = pdf;

        const containerWidth = container.clientWidth || 800;

        // Pre-create all page slots
        const slots: HTMLDivElement[] = [];
        for (let i = 1; i <= pdf.numPages; i++) {
          const slot = document.createElement('div');
          slot.dataset.page = String(i);
          slot.style.width = '100%';
          // Estimate height based on first page ratio
          if (i === 1) {
            const firstPage = await pdf.getPage(1);
            const vp = firstPage.getViewport({ scale: 1 });
            const estHeight = (containerWidth / vp.width) * vp.height;
            slot.style.minHeight = `${estHeight}px`;
          } else {
            slot.style.minHeight = '500px';
          }
          slot.style.background = '#f9fafb';
          container.appendChild(slot);
          slots.push(slot);
        }

        setLoading(false);

        // Render pages visible in viewport
        async function renderVisible() {
          if (cancelled || !pdfDocRef.current) return;
          const scrollEl = container.parentElement;
          if (!scrollEl) return;

          const viewTop = scrollEl.scrollTop;
          const viewBottom = viewTop + scrollEl.clientHeight + 600;

          for (let i = 0; i < slots.length; i++) {
            const pageNum = i + 1;
            if (renderedRef.current.has(pageNum)) continue;

            const slot = slots[i];
            if (!slot || !slot.parentNode) continue;

            const slotTop = slot.offsetTop;
            const slotBottom = slotTop + slot.offsetHeight;

            if (slotTop < viewBottom && slotBottom > viewTop - 200) {
              const page = await pdfDocRef.current.getPage(pageNum);
              if (cancelled) return;

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
              renderedRef.current.add(pageNum);
              slot.replaceWith(canvas);
            }
          }
        }

        // Initial render
        await renderVisible();

        // Listen to scroll on parent
        const scrollEl = container.parentElement;
        let ticking = false;
        const onScroll = () => {
          if (!ticking) {
            ticking = true;
            requestAnimationFrame(() => {
              renderVisible();
              ticking = false;
            });
          }
        };
        scrollEl?.addEventListener('scroll', onScroll, { passive: true });

        return () => {
          scrollEl?.removeEventListener('scroll', onScroll);
        };
      } catch (e: any) {
        if (!cancelled) {
          console.error('PDF error:', e);
          setLoading(false);
          setError(e.message || 'Lỗi không xác định');
        }
      }
    }

    load();

    return () => {
      cancelled = true;
      pdfDocRef.current = null;
    };
  }, [url]);

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
