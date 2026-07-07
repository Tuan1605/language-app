/**
 * Script merge tất cả dataset đã chuyển đổi vào app
 *
 * Run: npx tsx scripts/merge-all-datasets.ts
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const SRC_DIR = join(__dirname, '..', 'src', 'data');

interface Flashcard {
  id: string;
  word: string;
  definition: string;
  [key: string]: any;
}

interface KanjiEntry {
  id: string;
  kanji: string;
  [key: string]: any;
}

interface GrammarPoint {
  id: string;
  pattern: string;
  [key: string]: any;
}

function loadJson<T>(path: string): T[] {
  if (!existsSync(path)) return [];
  try {
    return JSON.parse(readFileSync(path, 'utf-8'));
  } catch {
    return [];
  }
}

function mergeArrays<T extends { id: string }>(
  existing: T[],
  newData: T[],
  keyFn: (item: T) => string
): T[] {
  const seen = new Set(existing.map(keyFn));
  const unique = newData.filter(item => !seen.has(keyFn(item)));
  return [...existing, ...unique];
}

function mergeToeicFlashcards() {
  console.log('\n=== Merging TOEIC Flashcards ===');

  const existing = loadJson<Flashcard>(join(SRC_DIR, 'toeic', 'flashcards.json'));
  console.log(`Existing: ${existing.length} cards`);

  const datasets = [
    'flashcards-toeic600.json',
    'flashcards-toeic-vocab-hf.json',
  ];

  let allNew: Flashcard[] = [];
  for (const file of datasets) {
    const path = join(SRC_DIR, 'toeic', file);
    const data = loadJson<Flashcard>(path);
    console.log(`  ${file}: ${data.length} cards`);
    allNew = [...allNew, ...data];
  }

  const merged = mergeArrays(existing, allNew, c => c.word.toLowerCase());
  console.log(`After merge: ${merged.length} cards (${merged.length - existing.length} new)`);

  writeFileSync(join(SRC_DIR, 'toeic', 'flashcards.json'), JSON.stringify(merged, null, 2));
  console.log('Saved to toeic/flashcards.json');
}

function mergeN2Kanji() {
  console.log('\n=== Merging N2 Kanji ===');

  const existing = loadJson<KanjiEntry>(join(SRC_DIR, 'n2', 'kanji.json'));
  console.log(`Existing: ${existing.length} kanji`);

  const datasets = [
    'kanji-jlpt-levels.json',
    'kanji-supplement-batch1.json',
    'kanji-supplement-batch2.json',
  ];

  let allNew: KanjiEntry[] = [];
  for (const file of datasets) {
    const path = join(SRC_DIR, 'n2', file);
    const data = loadJson<KanjiEntry>(path);
    console.log(`  ${file}: ${data.length} kanji`);
    allNew = [...allNew, ...data];
  }

  const merged = mergeArrays(existing, allNew, k => k.kanji);
  console.log(`After merge: ${merged.length} kanji (${merged.length - existing.length} new)`);

  writeFileSync(join(SRC_DIR, 'n2', 'kanji.json'), JSON.stringify(merged, null, 2));
  console.log('Saved to n2/kanji.json');
}

function mergeN2Grammar() {
  console.log('\n=== Merging N2 Grammar ===');

  const existing = loadJson<GrammarPoint>(join(SRC_DIR, 'n2', 'grammar.json'));
  console.log(`Existing: ${existing.length} grammar points`);

  const datasets = [
    'grammar-jlpt-extended.json',
  ];

  let allNew: GrammarPoint[] = [];
  for (const file of datasets) {
    const path = join(SRC_DIR, 'n2', file);
    const data = loadJson<GrammarPoint>(path);
    console.log(`  ${file}: ${data.length} grammar points`);
    allNew = [...allNew, ...data];
  }

  const merged = mergeArrays(existing, allNew, g => g.pattern);
  console.log(`After merge: ${merged.length} grammar points (${merged.length - existing.length} new)`);

  writeFileSync(join(SRC_DIR, 'n2', 'grammar.json'), JSON.stringify(merged, null, 2));
  console.log('Saved to n2/grammar.json');
}

function main() {
  console.log('=== Merging All Datasets ===');

  mergeToeicFlashcards();
  mergeN2Kanji();
  mergeN2Grammar();

  console.log('\n=== Merge Complete ===');
  console.log('Run "npm run dev" to see the updated data');
}

main();
