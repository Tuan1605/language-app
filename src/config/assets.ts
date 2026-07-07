// External hosting base URL for large files (audio, PDFs)
// Using GitHub Pages - serves files directly with CORS support
const ASSETS_BASE = 'https://Tuan1605.github.io/language-app';

// Helper to build asset URL
export function assetUrl(path: string): string {
  if (!path) return path;
  return `${ASSETS_BASE}${path}`;
}
