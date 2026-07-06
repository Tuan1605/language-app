#!/usr/bin/env node
/**
 * Batch add exampleTranslation to flashcards.
 * Usage: node scripts/add-translations.cjs
 *
 * This script adds a simple translation pattern for cards without exampleTranslation.
 * For better quality, edit the translations manually afterwards.
 */

const fs = require('fs');
const path = require('path');

const TOEIC_PATH = path.join(__dirname, '../src/data/toeic/flashcards.json');
const N2_PATH = path.join(__dirname, '../src/data/n2/flashcards.json');

function processFile(filePath, lang) {
  const raw = fs.readFileSync(filePath, 'utf8');
  const cards = JSON.parse(raw);
  let added = 0;

  for (const card of cards) {
    if (!card.exampleTranslation && card.example) {
      // For TOEIC (English): create a simple Vietnamese hint
      // For N2 (Japanese): create a simple Vietnamese hint
      card.exampleTranslation = `(${card.definition})`;
      added++;
    }
  }

  fs.writeFileSync(filePath, JSON.stringify(cards, null, 2));
  console.log(`${path.basename(filePath)}: Added ${added} translations (${lang})`);
}

console.log('Adding example translations...\n');
processFile(TOEIC_PATH, 'TOEIC');
processFile(N2_PATH, 'N2');
console.log('\nDone! Run "npm run build" to rebuild.');
