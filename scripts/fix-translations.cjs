#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const TOEIC_PATH = path.join(__dirname, '../src/data/toeic/flashcards.json');
const N2_PATH = path.join(__dirname, '../src/data/n2/flashcards.json');

function processFile(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  const cards = JSON.parse(raw);
  let fixed = 0;

  for (const card of cards) {
    // Remove wrong translations that are just the definition
    if (card.exampleTranslation && card.exampleTranslation.startsWith('(')) {
      delete card.exampleTranslation;
      fixed++;
    }
  }

  fs.writeFileSync(filePath, JSON.stringify(cards, null, 2));
  console.log(`${path.basename(filePath)}: Fixed ${fixed} wrong translations`);
}

console.log('Fixing wrong example translations...\n');
processFile(TOEIC_PATH);
processFile(N2_PATH);
console.log('\nDone!');
