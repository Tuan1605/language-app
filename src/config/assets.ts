// External hosting base URL for large files (audio, PDFs)
// GitHub Releases: https://github.com/Tuan1605/language-app/releases/download/v1.0
// Set VITE_ASSETS_BASE_URL in Vercel env vars after upload
// Leave empty to use local public/ directory
export const ASSETS_BASE_URL = import.meta.env.VITE_ASSETS_BASE_URL || 'https://github.com/Tuan1605/language-app/releases/download/v1.0';

// Helper to build asset URL
export function assetUrl(path: string): string {
  if (!ASSETS_BASE_URL) return path;
  
  let finalPath = path;
  
  // If using GitHub releases, files are flattened and spaces are replaced with dots
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
