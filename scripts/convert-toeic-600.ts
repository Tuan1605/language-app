/**
 * Script chuyển đổi TOEIC 600 Words Dataset
 * Source: https://github.com/tranngocminhhieu/toeic-600-words-dataset
 *
 * Run: npx tsx scripts/convert-toeic-600.ts
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

interface RawToeicWord {
  english: string;
  type: string;
  vietnamese: string;
  pronounce: string;
  explain: string;
  example: string;
  example_vietnamese: string;
  image_url: string;
  audio_url: string;
  topic: string;
  topic_url: string;
}

interface AppFlashcard {
  id: string;
  word: string;
  definition: string;
  example?: string;
  exampleTranslation?: string;
  imageUrl?: string;
  audioUrl?: string;
  phonetic?: string;
  topic: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

function convertToeic600(inputPath: string, outputPath: string) {
  console.log(`[convert-toeic-600] Reading from: ${inputPath}`);

  if (!existsSync(inputPath)) {
    console.error(`[convert-toeic-600] File not found: ${inputPath}`);
    console.log('[convert-toeic-600] Please download the dataset first:');
    console.log('  git clone https://github.com/tranngocminhhieu/toeic-600-words-dataset.git');
    console.log('  Then run: npx tsx scripts/convert-toeic-600.ts ./scripts/datasets/toeic-600/data/toeic_600_words.csv');
    process.exit(1);
  }

  const rawContent = readFileSync(inputPath, 'utf-8');
  const lines = rawContent.split('\n').filter(l => l.trim());

  // Parse header
  const header = parseCSVLine(lines[0]);
  console.log(`[convert-toeic-600] Header: ${header.join(', ')}`);

  // Parse data rows
  const rawData: RawToeicWord[] = lines.slice(1).map(line => {
    const values = parseCSVLine(line);
    return {
      english: values[0] || '',
      type: values[1] || '',
      vietnamese: values[2] || '',
      pronounce: values[3] || '',
      explain: values[4] || '',
      example: values[5] || '',
      example_vietnamese: values[6] || '',
      image_url: values[7] || '',
      audio_url: values[8] || '',
      topic: values[9] || '',
      topic_url: values[10] || '',
    };
  }).filter(w => w.english && w.vietnamese);

  console.log(`[convert-toeic-600] Found ${rawData.length} words`);

  const flashcards: AppFlashcard[] = rawData.map((item, idx) => {
    return {
      id: `toeic600-${idx + 1}`,
      word: item.english,
      definition: item.vietnamese,
      example: item.example || undefined,
      exampleTranslation: item.example_vietnamese || undefined,
      imageUrl: item.image_url || `https://picsum.photos/seed/${encodeURIComponent(item.english)}/400/300`,
      audioUrl: item.audio_url || undefined,
      phonetic: item.pronounce || undefined,
      topic: item.topic || 'TOEIC 600 Essential',
      difficulty: idx < rawData.length * 0.4 ? 'beginner' :
                  idx < rawData.length * 0.8 ? 'intermediate' : 'advanced',
    };
  });

  // Read existing flashcards to avoid duplicates
  let existingCards: AppFlashcard[] = [];
  const existingPath = join(process.cwd(), 'src/data/toeic/flashcards.json');
  if (existsSync(existingPath)) {
    existingCards = JSON.parse(readFileSync(existingPath, 'utf-8'));
    console.log(`[convert-toeic-600] Found ${existingCards.length} existing cards`);
  }

  // Filter out duplicates
  const existingWords = new Set(existingCards.map(c => c.word.toLowerCase()));
  const newCards = flashcards.filter(c => !existingWords.has(c.word.toLowerCase()));
  console.log(`[convert-toeic-600] Adding ${newCards.length} new cards (${flashcards.length - newCards.length} duplicates skipped)`);

  writeFileSync(outputPath, JSON.stringify(newCards, null, 2));
  console.log(`[convert-toeic-600] Output written to: ${outputPath}`);
  console.log('[convert-toeic-600] To merge, run: npx tsx scripts/merge-all-datasets.ts');
}

// Main
const args = process.argv.slice(2);
const inputPath = args[0] || './scripts/datasets/toeic-600/data/toeic_600_words.csv';
const outputPath = args[1] || './src/data/toeic/flashcards-toeic600.json';

convertToeic600(inputPath, outputPath);
