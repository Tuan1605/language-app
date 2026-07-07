// Use corsproxy.io to bypass CORS for GitHub Releases PDFs/audio
const CORS_PROXY = 'https://corsproxy.io/?url=';
const GITHUB_RELEASES = 'https://github.com/Tuan1605/language-app/releases/download/v1.0';

// Helper to build asset URL
export function assetUrl(path: string): string {
  if (!path) return path;
  const filename = path.split('/').pop() || path;
  return `${CORS_PROXY}${encodeURIComponent(`${GITHUB_RELEASES}/${filename}`)}`;
}
