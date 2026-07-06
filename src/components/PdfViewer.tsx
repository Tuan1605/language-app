import { useState, useEffect, useRef, useCallback } from 'react';
import { ExternalLink, Download, Loader } from 'lucide-react';

interface PdfViewerProps {
  url: string;
  className?: string;
}

function isMobile(): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

export function PdfViewer({ url, className = '' }: PdfViewerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleLoad = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsLoading(false);
  }, []);

  const handleError = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsLoading(false);
    setHasError(true);
  }, []);

  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
    // Timeout fallback: if PDF doesn't load in 30s, show error
    timeoutRef.current = setTimeout(() => {
      setIsLoading(false);
      setHasError(true);
    }, 30000);
    return () => clearTimeout(timeoutRef.current);
  }, [url]);

  if (!url) {
    return (
      <div className={`flex items-center justify-center bg-gray-50 ${className}`}>
        <p className="text-sm text-gray-500">No PDF URL provided</p>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className={`flex items-center justify-center bg-gray-50 ${className}`}>
        <div className="text-center p-4 max-w-md">
          <p className="text-sm text-gray-500 mb-3">Cannot display PDF inline</p>
          <div className="flex gap-2 justify-center">
            <a
              href={url}
              download
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white text-sm font-bold rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </a>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 text-sm font-bold rounded-lg hover:bg-gray-300 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Open in Tab
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Mobile: open in new tab (most reliable for large PDFs)
  if (isMobile()) {
    return (
      <div className={`relative ${className}`}>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
            <div className="flex flex-col items-center gap-3">
              <Loader className="w-8 h-8 text-blue-500 animate-spin" />
              <p className="text-sm text-gray-500">Loading PDF...</p>
            </div>
          </div>
        )}
        <iframe
          ref={iframeRef}
          src={url}
          onLoad={handleLoad}
          onError={handleError}
          className="w-full h-full border-none bg-gray-50"
          title="PDF Viewer"
        />
      </div>
    );
  }

  // Desktop: use iframe (more compatible than object tag)
  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
          <div className="flex flex-col items-center gap-3">
            <Loader className="w-8 h-8 text-blue-500 animate-spin" />
            <p className="text-sm text-gray-500">Loading PDF...</p>
          </div>
        </div>
      )}
      <iframe
        ref={iframeRef}
        src={url}
        onLoad={handleLoad}
        onError={handleError}
        className="w-full h-full border-none bg-gray-50"
        title="PDF Viewer"
      />
    </div>
  );
}
