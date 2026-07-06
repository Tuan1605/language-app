function levenshteinDistance(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
  }

  return dp[m][n];
}

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[.,!?;:'"()\-—…。、！？「」『』]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function calculateSimilarity(target: string, input: string): number {
  const normalizedTarget = normalizeText(target);
  const normalizedInput = normalizeText(input);

  if (normalizedTarget === normalizedInput) return 100;
  if (normalizedTarget.length === 0 || normalizedInput.length === 0) return 0;

  const distance = levenshteinDistance(normalizedTarget, normalizedInput);
  const maxLen = Math.max(normalizedTarget.length, normalizedInput.length);
  const charSimilarity = Math.round(((maxLen - distance) / maxLen) * 100);

  const isJapanese = /[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf]/.test(normalizedTarget);
  if (isJapanese) {
    return charSimilarity;
  }

  const targetWords = normalizedTarget.split(' ');
  const inputWords = normalizedInput.split(' ');
  let matchedWords = 0;
  const usedIndices = new Set<number>();

  for (const word of targetWords) {
    const idx = inputWords.findIndex((w, i) => w === word && !usedIndices.has(i));
    if (idx !== -1) {
      matchedWords++;
      usedIndices.add(idx);
    }
  }

  const wordSimilarity = targetWords.length > 0
    ? Math.round((matchedWords / targetWords.length) * 100)
    : 0;

  return Math.round(charSimilarity * 0.4 + wordSimilarity * 0.6);
}
