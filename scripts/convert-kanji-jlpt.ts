/**
 * Script chuyển đổi JLPT Kanji Dataset
 * Source: https://github.com/davidluzgouveia/kanji-data
 *
 * Run: npx tsx scripts/convert-kanji-jlpt.ts
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

interface RawKanjiData {
  strokes: number;
  grade?: number;
  freq?: number;
  jlpt_old?: number;
  jlpt_new?: number;
  meanings: string[];
  readings_on: string[];
  readings_kun: string[];
  wk_level?: number;
  wk_meanings?: string[];
  wk_readings_on?: string[];
  wk_readings_kun?: string[];
  [key: string]: any;
}

interface AppKanjiEntry {
  id: string;
  kanji: string;
  reading?: string;
  on_reading?: string;
  kun_reading?: string;
  meaning: string;
  example?: string;
  examples?: { word: string; reading: string; meaning: string }[];
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  stroke_count?: number;
  jlpt_level?: string;
  source?: string;
}

function mapJlptToDifficulty(jlpt?: number): 'beginner' | 'intermediate' | 'advanced' {
  if (!jlpt || jlpt >= 4) return 'beginner';
  if (jlpt >= 3) return 'intermediate';
  return 'advanced';
}

function mapJlptToLevel(jlpt?: number): string {
  if (!jlpt) return 'N3';
  return `N${jlpt}`;
}

function convertKanjiJlpt(inputPath: string, outputPath: string) {
  console.log(`[convert-kanji-jlpt] Reading from: ${inputPath}`);

  if (!existsSync(inputPath)) {
    console.error(`[convert-kanji-jlpt] File not found: ${inputPath}`);
    console.log('[convert-kanji-jlpt] Please download the dataset first:');
    console.log('  git clone https://github.com/davidluzgouveia/kanji-data.git');
    console.log('  Then place kanji.json in scripts/datasets/');
    process.exit(1);
  }

  const rawContent = readFileSync(inputPath, 'utf-8');
  const rawData: Record<string, RawKanjiData> = JSON.parse(rawContent);

  const kanjiKeys = Object.keys(rawData);
  console.log(`[convert-kanji-jlpt] Found ${kanjiKeys.length} kanji`);

  const kanjiEntries: AppKanjiEntry[] = kanjiKeys
    .filter(kanji => rawData[kanji].meanings && rawData[kanji].meanings.length > 0)
    .map((kanji, idx) => {
      const data = rawData[kanji];
      const onReading = data.readings_on?.join(', ') || '';
      const kunReading = data.readings_kun?.join(', ') || '';
      const meaning = data.meanings.join(', ');

      return {
        id: `kanji-jlpt-${idx + 1}`,
        kanji: kanji,
        on_reading: onReading || undefined,
        kun_reading: kunReading || undefined,
        reading: onReading || kunReading || undefined,
        meaning: meaning,
        stroke_count: data.strokes,
        jlpt_level: mapJlptToLevel(data.jlpt_new || data.jlpt_old),
        difficulty: mapJlptToDifficulty(data.jlpt_new || data.jlpt_old),
        source: 'davidluzgouveia/kanji-data',
      };
    });

  // Read existing kanji to avoid duplicates
  let existingKanji: AppKanjiEntry[] = [];
  const existingPath = join(process.cwd(), 'src/data/n2/kanji.json');
  if (existsSync(existingPath)) {
    existingKanji = JSON.parse(readFileSync(existingPath, 'utf-8'));
    console.log(`[convert-kanji-jlpt] Found ${existingKanji.length} existing kanji`);
  }

  // Filter out duplicates
  const existingChars = new Set(existingKanji.map(k => k.kanji));
  const newKanji = kanjiEntries.filter(k => !existingChars.has(k.kanji));
  console.log(`[convert-kanji-jlpt] Adding ${newKanji.length} new kanji (${kanjiEntries.length - newKanji.length} duplicates skipped)`);

  writeFileSync(outputPath, JSON.stringify(newKanji, null, 2));
  console.log(`[convert-kanji-jlpt] Output written to: ${outputPath}`);
}

// Main
const args = process.argv.slice(2);
const inputPath = args[0] || './scripts/datasets/kanji-data/kanji.json';
const outputPath = args[1] || './src/data/n2/kanji-jlpt-levels.json';

convertKanjiJlpt(inputPath, outputPath);
