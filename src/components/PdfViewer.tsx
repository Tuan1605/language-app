import { useState } from 'react';

interface PdfViewerProps {
  url: string;
  className?: string;
}

export function PdfViewer({ url, className = '' }: PdfViewerProps) {
  const [error, setError] = useState<string | null>(null);

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
        <div className="text-center p-4 max-w-md">
          <p className="text-sm text-red-500 mb-3">{error}</p>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-4 py-2 bg-blue-500 text-white text-sm font-bold rounded-lg hover:bg-blue-600 transition-colors"
          >
            Open PDF in New Tab
          </a>
        </div>
      </div>
    );
  }

  // Use Google Docs Viewer to display PDF (avoids CORS and download issues)
  const viewerUrl = `https://docs.google.com/gview?url=${encodeURIComponent(url)}&embedded=true`;

  return (
    <iframe
      src={viewerUrl}
      className={`w-full h-full border-none bg-gray-50 ${className}`}
      title="PDF Viewer"
      onError={() => setError('Failed to load PDF viewer')}
    />
  );
}
