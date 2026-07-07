import { useState } from 'react';
import { Download, AlertCircle, ExternalLink } from 'lucide-react';

interface PdfViewerProps {
  url: string;
  className?: string;
}

export function PdfViewer({ url, className = '' }: PdfViewerProps) {
  const [error, setError] = useState(false);

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
          <p className="text-xs text-gray-400 mb-4">Hãy tải về máy để xem</p>
          <div className="flex gap-2 justify-center flex-wrap">
            <a href={url} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-xl">
              <ExternalLink className="w-4 h-4" /> Mở tab mới
            </a>
            <a href={url} download
              className="inline-flex items-center gap-1 px-4 py-2 bg-gray-200 text-gray-700 text-sm font-bold rounded-xl">
              <Download className="w-4 h-4" /> Tải về
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className} overflow-hidden`}>
      <iframe
        src={url}
        className="w-full h-full border-none bg-gray-50"
        title="PDF Viewer"
        onError={() => setError(true)}
      />
    </div>
  );
}
