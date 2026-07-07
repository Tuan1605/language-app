// Use Vercel edge proxy to bypass CORS for GitHub Releases PDFs/audio
const PROXY_BASE = '/api/proxy';

// Helper to build asset URL
export function assetUrl(path: string): string {
  if (!path) return path;
  const filename = path.split('/').pop() || path;
  return `${PROXY_BASE}?file=${encodeURIComponent(filename)}`;
}
