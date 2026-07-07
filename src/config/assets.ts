// External hosting base URL for large files (audio, PDFs)
// GitHub Releases base URL - files are flattened to just filenames
const GITHUB_RELEASES_BASE = 'https://github.com/Tuan1605/language-app/releases/download/v1.0';

// Helper to build asset URL
export function assetUrl(path: string): string {
  if (!path) return path;

  // Flatten path to just filename for GitHub Releases
  const parts = path.split('/');
  let filename = parts[parts.length - 1];
  filename = filename.replace(/ /g, '.');

  return `${GITHUB_RELEASES_BASE}/${filename}`;
}
