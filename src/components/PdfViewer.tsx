import { useState, useEffect, useRef } from 'react';
import { ExternalLink, Download, Loader } from 'lucide-react';

interface PdfViewerProps {
  url: string;
  className?: string;
}

export function PdfViewer({ url, className = '' }: PdfViewerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const objectRef = useRef<HTMLObjectElement>(null);

  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
  }, [url]);

  useEffect(() => {
    const obj = objectRef.current;
    if (!obj) return;

    const handleLoad = () => setIsLoading(false);
    const handleError = () => { setIsLoading(false); setHasError(true); };

    obj.addEventListener('load', handleLoad);
    obj.addEventListener('error', handleError);
    return () => {
      obj.removeEventListener('load', handleLoad);
      obj.removeEventListener('error', handleError);
    };
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
      <object
        ref={objectRef}
        data={url}
        type="application/pdf"
        className="w-full h-full border-none bg-gray-50"
      >
        <div className="flex items-center justify-center h-full">
          <a href={url} download className="text-blue-500 underline text-sm">Download PDF</a>
        </div>
      </object>
    </div>
  );
}
