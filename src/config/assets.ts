// External hosting base URL for large files (audio, PDFs)
// Set VITE_ASSETS_BASE_URL in env vars for production (e.g. Vercel)
// Leave empty to use local public/ directory
export const ASSETS_BASE_URL = import.meta.env.VITE_ASSETS_BASE_URL || '';

// Helper to build asset URL
export function assetUrl(path: string): string {
  // Local development or no base URL: serve from public/ directly
  if (!ASSETS_BASE_URL) return path;

  let finalPath = path;

  // If using GitHub releases, files are flattened
  if (ASSETS_BASE_URL.includes('github.com')) {
    const parts = path.split('/');
    let filename = parts[parts.length - 1];
    filename = filename.replace(/ /g, '.');
    finalPath = '/' + filename;
  }

  // Avoid double slashes
  const base = ASSETS_BASE_URL.replace(/\/+$/, '');
  return `${base}${finalPath}`;
}
