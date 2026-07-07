/**
 * Script chuyển đổi TOEIC Vocabulary từ HuggingFace
 * Source: https://huggingface.co/datasets/kknono668/toeic-vocab-tw
 *
 * Run: npx tsx scripts/convert-toeic-vocab-hf.ts
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

interface RawVocab {
  word: string;
  meaning?: string;
  definition?: string;
  chinese?: string;
  phonetic?: string;
  ipa?: string;
  example?: string;
  part_of_speech?: string;
  [key: string]: any;
}

interface AppFlashcard {
  id: string;
  word: string;
  definition: string;
  example?: string;
  exampleTranslation?: string;
  phonetic?: string;
  topic: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

function convertToeicVocab(inputPath: string, outputPath: string) {
  console.log(`[convert-toeic-vocab-hf] Reading from: ${inputPath}`);

  if (!existsSync(inputPath)) {
    console.error(`[convert-toeic-vocab-hf] File not found: ${inputPath}`);
    console.log('[convert-toeic-vocab-hf] Please download the dataset from HuggingFace:');
    console.log('  https://huggingface.co/datasets/kknono668/toeic-vocab-tw');
    console.log('  Download the data file and place it in scripts/datasets/');
    process.exit(1);
  }

  const rawContent = readFileSync(inputPath, 'utf-8');
  let rawData: RawVocab[];

  // Handle different formats
  if (inputPath.endsWith('.json')) {
    const parsed = JSON.parse(rawContent);
    rawData = Array.isArray(parsed) ? parsed : (parsed.data || parsed.items || []);
  } else if (inputPath.endsWith('.csv')) {
    const lines = rawContent.split('\n');
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    rawData = lines.slice(1).filter(l => l.trim()).map(line => {
      const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
      const obj: any = {};
      headers.forEach((h, i) => obj[h] = values[i] || '');
      return obj;
    });
  } else if (inputPath.endsWith('.parquet')) {
    console.error('[convert-toeic-vocab-hf] Parquet format not supported directly. Convert to JSON first.');
    process.exit(1);
  } else {
    console.error('[convert-toeic-vocab-hf] Unsupported format');
    process.exit(1);
  }

  console.log(`[convert-toeic-vocab-hf] Found ${rawData.length} words`);

  const flashcards: AppFlashcard[] = rawData.map((item, idx) => {
    const word = item.word || '';
    const meaning = item.meaning || item.definition || item.chinese || '';
    const ipa = item.phonetic || item.ipa || '';

    return {
      id: `toeic-hf-${idx + 1}`,
      word: word,
      definition: meaning,
      example: item.example || undefined,
      phonetic: ipa || undefined,
      topic: 'TOEIC Vocabulary',
      difficulty: idx < rawData.length * 0.4 ? 'beginner' : 
                  idx < rawData.length * 0.8 ? 'intermediate' : 'advanced',
    };
  });

  // Read existing flashcards to avoid duplicates
  let existingCards: AppFlashcard[] = [];
  const existingPath = join(process.cwd(), 'src/data/toeic/flashcards.json');
  if (existsSync(existingPath)) {
    existingCards = JSON.parse(readFileSync(existingPath, 'utf-8'));
    console.log(`[convert-toeic-vocab-hf] Found ${existingCards.length} existing cards`);
  }

  // Filter out duplicates
  const existingWords = new Set(existingCards.map(c => c.word.toLowerCase()));
  const newCards = flashcards.filter(c => !existingWords.has(c.word.toLowerCase()));
  console.log(`[convert-toeic-vocab-hf] Adding ${newCards.length} new cards`);

  writeFileSync(outputPath, JSON.stringify(newCards, null, 2));
  console.log(`[convert-toeic-vocab-hf] Output written to: ${outputPath}`);
}

// Main
const args = process.argv.slice(2);
const inputPath = args[0] || './scripts/datasets/toeic-vocab-tw.json';
const outputPath = args[1] || './src/data/toeic/flashcards-toeic-vocab-hf.json';

convertToeicVocab(inputPath, outputPath);
