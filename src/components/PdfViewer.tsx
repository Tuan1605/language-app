import { useState } from 'react';
import { Download, AlertCircle } from 'lucide-react';

interface PdfViewerProps {
  url: string;
  className?: string;
}

export function PdfViewer({ url, className = '' }: PdfViewerProps) {
  const [error, setError] = useState(false);

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
          <div className="flex gap-2 justify-center flex-wrap">
            <a href={url} target="_blank" rel="noopener noreferrer"
              className="px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-xl">
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

  const viewerUrl = `https://docs.google.com/gview?url=${encodeURIComponent(url)}&embedded=true`;

  return (
    <div className={`${className}`}>
      <iframe
        src={viewerUrl}
        className="w-full h-full border-none bg-gray-50"
        title="PDF Viewer"
        onError={() => setError(true)}
      />
    </div>
  );
}
