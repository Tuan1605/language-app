/**
 * Script chuyển đổi JLPT Grammar Dataset
 * Source: https://github.com/junyoung9394/jlpt-grammar-dataset
 *
 * Run: npx tsx scripts/convert-grammar-jlpt.ts
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

interface RawGrammar {
  pattern?: string;
  grammar?: string;
  form?: string;
  meaning?: string;
  level?: string;
  jlpt_level?: string;
  example?: string;
  examples?: string[];
  example_jp?: string;
  example_en?: string;
  [key: string]: any;
}

interface AppGrammarPoint {
  id: string;
  pattern: string;
  structure?: string;
  meaning: string;
  example: string;
  exampleTranslation?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

function mapLevelToDifficulty(level?: string): 'beginner' | 'intermediate' | 'advanced' {
  if (!level) return 'intermediate';
  const lvl = level.toUpperCase();
  if (lvl.includes('N5') || lvl.includes('N4')) return 'beginner';
  if (lvl.includes('N3')) return 'intermediate';
  return 'advanced';
}

function convertGrammarJlpt(inputPath: string, outputPath: string) {
  console.log(`[convert-grammar-jlpt] Reading from: ${inputPath}`);

  if (!existsSync(inputPath)) {
    console.error(`[convert-grammar-jlpt] File not found: ${inputPath}`);
    console.log('[convert-grammar-jlpt] Please download the dataset first:');
    console.log('  git clone https://github.com/junyoung9394/jlpt-grammar-dataset.git');
    console.log('  Then place the JSON file in scripts/datasets/');
    process.exit(1);
  }

  const rawContent = readFileSync(inputPath, 'utf-8');
  const rawData: RawGrammar[] = JSON.parse(rawContent);

  console.log(`[convert-grammar-jlpt] Found ${rawData.length} grammar points`);

  const grammarPoints: AppGrammarPoint[] = rawData
    .filter(item => (item.pattern || item.grammar) && item.meaning)
    .map((item, idx) => {
      const pattern = item.pattern || item.grammar || '';
      const example = item.example || item.example_jp || 
        (Array.isArray(item.examples) && item.examples[0]) || '';
      const exampleTranslation = item.example_en || item.exampleTranslation || '';

      return {
        id: `grammar-jlpt-${idx + 1}`,
        pattern: pattern,
        structure: item.form || undefined,
        meaning: item.meaning || '',
        example: example,
        exampleTranslation: exampleTranslation || undefined,
        difficulty: mapLevelToDifficulty(item.level || item.jlpt_level),
      };
    });

  // Read existing grammar to avoid duplicates
  let existingGrammar: AppGrammarPoint[] = [];
  const existingPath = join(process.cwd(), 'src/data/n2/grammar.json');
  if (existsSync(existingPath)) {
    existingGrammar = JSON.parse(readFileSync(existingPath, 'utf-8'));
    console.log(`[convert-grammar-jlpt] Found ${existingGrammar.length} existing grammar points`);
  }

  // Filter out duplicates by pattern
  const existingPatterns = new Set(existingGrammar.map(g => g.pattern));
  const newGrammar = grammarPoints.filter(g => !existingPatterns.has(g.pattern));
  console.log(`[convert-grammar-jlpt] Adding ${newGrammar.length} new grammar points (${grammarPoints.length - newGrammar.length} duplicates skipped)`);

  writeFileSync(outputPath, JSON.stringify(newGrammar, null, 2));
  console.log(`[convert-grammar-jlpt] Output written to: ${outputPath}`);
}

// Main
const args = process.argv.slice(2);
const inputPath = args[0] || './scripts/datasets/grammar.json';
const outputPath = args[1] || './src/data/n2/grammar-jlpt-extended.json';

convertGrammarJlpt(inputPath, outputPath);
