// External hosting base URL for large files (audio, PDFs)
// GitHub Releases: https://github.com/Tuan1605/language-app/releases/download/v1.0
// Set VITE_ASSETS_BASE_URL in Vercel env vars, or leave empty for local
export const ASSETS_BASE_URL = import.meta.env.VITE_ASSETS_BASE_URL || '';

// Helper to build asset URL
// GitHub Releases flatten directory structure, so we strip folder prefixes
export function assetUrl(path: string): string {
  if (!ASSETS_BASE_URL) return path;
  const base = ASSETS_BASE_URL.replace(/\/+$/, '');
  // Strip all directory prefixes, keep only filename
  const filename = path.replace(/^\/(?:audio|pdfs)\/toeic_2024\/(?:parts\/)?/, '/');
  return `${base}${filename}`;
}
