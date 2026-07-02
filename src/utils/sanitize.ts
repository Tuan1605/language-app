/** Strip dangerous HTML/JS from user input to prevent XSS. */
export function sanitizeInput(input: string): string {
  return input
    .replace(/<[^>]*>/g, '')        // strip HTML tags
    .replace(/javascript:/gi, '')    // strip javascript: protocol
    .replace(/on\w+\s*=/gi, '')     // strip event handlers
    .replace(/data:/gi, '')          // strip data: protocol
    .trim();
}

/** Validate import backup file schema. Returns true if valid. */
export function validateImportSchema(data: unknown): data is {
  version: number;
  cards?: unknown[];
  mistakes?: unknown[];
  examResults?: unknown[];
  customExams?: unknown[];
  userPrefs?: { unlockedEn?: number[]; unlockedJa?: number[] };
} {
  if (typeof data !== 'object' || data === null) return false;
  const obj = data as Record<string, unknown>;
  if (typeof obj.version !== 'number') return false;
  if (obj.cards !== undefined && !Array.isArray(obj.cards)) return false;
  if (obj.mistakes !== undefined && !Array.isArray(obj.mistakes)) return false;
  if (obj.examResults !== undefined && !Array.isArray(obj.examResults)) return false;
  if (obj.customExams !== undefined && !Array.isArray(obj.customExams)) return false;
  return true;
}

/** Mask an API key for display: shows first 8 and last 4 chars. */
export function maskApiKey(key: string): string {
  if (key.length <= 12) return '••••••••••••';
  return key.slice(0, 8) + '••••' + key.slice(-4);
}
