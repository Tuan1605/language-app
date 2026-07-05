#!/usr/bin/env node
/**
 * Generate phonetic (IPA) and pronunciation for flashcard JSON files.
 * Uses CMU Pronouncing Dictionary (free, comprehensive English phonetics).
 *
 * Usage:
 *   node scripts/generate-phonetic.mjs toeic
 *   node scripts/generate-phonetic.mjs n2
 *   node scripts/generate-phonetic.mjs all
 */

import { readFile, writeFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '..', 'src', 'data');

const FILES = {
  toeic: join(DATA_DIR, 'toeic', 'flashcards.json'),
  n2: join(DATA_DIR, 'n2', 'flashcards.json'),
};

// ARPABET to IPA mapping (CMU dict format)
const ARPABET_TO_IPA = {
  // Vowels
  'AA': 'ɑː', 'AA0': 'ɑ', 'AA1': 'ɑː', 'AA2': 'ɑ',
  'AE': 'æ', 'AE0': 'æ', 'AE1': 'æ', 'AE2': 'æ',
  'AH': 'ʌ', 'AH0': 'ə', 'AH1': 'ʌ', 'AH2': 'ə',
  'AO': 'ɔː', 'AO0': 'ɔ', 'AO1': 'ɔː', 'AO2': 'ɔ',
  'AW': 'aʊ', 'AW0': 'aʊ', 'AW1': 'aʊ', 'AW2': 'aʊ',
  'AY': 'aɪ', 'AY0': 'aɪ', 'AY1': 'aɪ', 'AY2': 'aɪ',
  'EH': 'ɛ', 'EH0': 'ɛ', 'EH1': 'ɛ', 'EH2': 'ɛ',
  'ER': 'ɝː', 'ER0': 'ɚ', 'ER1': 'ɝː', 'ER2': 'ɚ',
  'EY': 'eɪ', 'EY0': 'eɪ', 'EY1': 'eɪ', 'EY2': 'eɪ',
  'IH': 'ɪ', 'IH0': 'ɪ', 'IH1': 'ɪ', 'IH2': 'ɪ',
  'IY': 'iː', 'IY0': 'i', 'IY1': 'iː', 'IY2': 'i',
  'OW': 'oʊ', 'OW0': 'oʊ', 'OW1': 'oʊ', 'OW2': 'oʊ',
  'OY': 'ɔɪ', 'OY0': 'ɔɪ', 'OY1': 'ɔɪ', 'OY2': 'ɔɪ',
  'UH': 'ʊ', 'UH0': 'ʊ', 'UH1': 'ʊ', 'UH2': 'ʊ',
  'UW': 'uː', 'UW0': 'u', 'UW1': 'uː', 'UW2': 'u',
  // Consonants
  'B': 'b', 'CH': 'tʃ', 'D': 'd', 'DH': 'ð',
  'F': 'f', 'G': 'ɡ', 'HH': 'h', 'JH': 'dʒ',
  'K': 'k', 'L': 'l', 'M': 'm', 'N': 'n',
  'NG': 'ŋ', 'P': 'p', 'R': 'ɹ', 'S': 's',
  'SH': 'ʃ', 'T': 't', 'TH': 'θ', 'V': 'v',
  'W': 'w', 'Y': 'j', 'Z': 'z', 'ZH': 'ʒ',
};

// IPA to simple pronunciation
function ipaToPronunciation(ipa) {
  if (!ipa) return '';
  return ipa
    .replace(/[/]/g, '')
    .replace(/ˈ/g, '')
    .replace(/ˌ/g, '')
    .replace(/\(([^)]+)\)/g, '$1') // Strip parentheses from optional phonemes (e.g., (ɹ) → ɹ)
    .replace(/ː/g, '')
    .replace(/θ/g, 'th')
    .replace(/ð/g, 'th')
    .replace(/ʃ/g, 'sh')
    .replace(/ʒ/g, 'zh')
    .replace(/ŋ/g, 'ng')
    .replace(/tʃ/g, 'ch')
    .replace(/dʒ/g, 'j')
    .replace(/ɛ/g, 'e')
    .replace(/æ/g, 'a')
    .replace(/ɑː?/g, 'ah')
    .replace(/ɔː?/g, 'aw')
    .replace(/ʊ/g, 'oo')
    .replace(/uː?/g, 'oo')
    .replace(/ɪ/g, 'ih')
    .replace(/iː?/g, 'ee')
    .replace(/ə/g, 'uh')
    .replace(/ɝː?/g, 'ur')
    .replace(/ɚ/g, 'er')
    .replace(/eɪ/g, 'ay')
    .replace(/aɪ/g, 'eye')
    .replace(/ɔɪ/g, 'oy')
    .replace(/aʊ/g, 'ow')
    .replace(/oʊ/g, 'oh')
    .replace(/ɪə/g, 'eer')
    .replace(/ɛə/g, 'air')
    .replace(/ʊə/g, 'oor')
    .replace(/ɹ/g, 'r')
    .replace(/ɡ/g, 'g')
    .replace(/\./g, '-')
    .trim();
}

// Load CMU dictionary
let cmuDict = null;

async function loadCMUDict() {
  if (cmuDict) return cmuDict;

  console.log('  Downloading CMU Pronouncing Dictionary...');
  const resp = await fetch('https://raw.githubusercontent.com/cmusphinx/cmudict/master/cmudict.dict');
  if (!resp.ok) throw new Error('Failed to download CMU dict');

  const text = await resp.text();
  cmuDict = {};

  for (const line of text.split('\n')) {
    if (!line || line.startsWith(';;;')) continue;
    const parts = line.trim().split(/\s+/);
    if (parts.length < 2) continue;

    const word = parts[0].toLowerCase();
    // Remove variant markers (1, 2)
    const cleanWord = word.replace(/[0-9]$/, '');
    const phonemes = parts.slice(1);

    // Only keep the first pronunciation for each word
    if (!cmuDict[cleanWord]) {
      cmuDict[cleanWord] = phonemes;
    }
  }

  console.log(`  Loaded ${Object.keys(cmuDict).length} words from CMU dict`);
  return cmuDict;
}

// Convert ARPABET phonemes to IPA
function arpabetToIPA(phonemes) {
  return '/' + phonemes.map(p => ARPABET_TO_IPA[p] || p).join('') + '/';
}

// Extract base English word
function extractBaseWord(word) {
  const match = word.match(/^([a-zA-Z]+)/);
  return match ? match[1].toLowerCase() : null;
}

// Normalize Unicode (fix Cyrillic 'е' -> Latin 'e', etc.)
function normalizeUnicode(str) {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove combining diacritics (accents)
    .replace(/ç/g, 'c')
    .replace(/é/g, 'e')
    .replace(/è/g, 'e')
    .replace(/ê/g, 'e')
    .replace(/ë/g, 'e')
    .replace(/à/g, 'a')
    .replace(/â/g, 'a')
    .replace(/ä/g, 'a')
    .replace(/ì/g, 'i')
    .replace(/î/g, 'i')
    .replace(/ï/g, 'i')
    .replace(/ò/g, 'o')
    .replace(/ô/g, 'o')
    .replace(/ö/g, 'o')
    .replace(/ù/g, 'u')
    .replace(/û/g, 'u')
    .replace(/ü/g, 'u')
    .replace(/ý/g, 'y')
    .replace(/ñ/g, 'n')
    // Cyrillic -> Latin (specific mappings needed)
    .replace(/а/g, 'a').replace(/б/g, 'b').replace(/в/g, 'v').replace(/г/g, 'g')
    .replace(/д/g, 'd').replace(/е/g, 'e').replace(/ё/g, 'yo').replace(/ж/g, 'zh')
    .replace(/з/g, 'z').replace(/и/g, 'i').replace(/й/g, 'y').replace(/к/g, 'k')
    .replace(/л/g, 'l').replace(/м/g, 'm').replace(/н/g, 'n').replace(/о/g, 'o')
    .replace(/п/g, 'p').replace(/р/g, 'r').replace(/с/g, 's').replace(/т/g, 't')
    .replace(/у/g, 'u').replace(/ф/g, 'f').replace(/х/g, 'kh').replace(/ц/g, 'ts')
    .replace(/ч/g, 'ch').replace(/ш/g, 'sh').replace(/щ/g, 'shch').replace(/ъ/g, '')
    .replace(/ы/g, 'y').replace(/ь/g, '').replace(/э/g, 'e').replace(/ю/g, 'yu')
    .replace(/я/g, 'ya');
}

// Generate pronunciation for abbreviations (PPC -> P-P-C)
function abbrevToPronunciation(word) {
  return word.split('').join('-');
}

// Look up word in CMU dict (try base form and variants)
async function lookupWord(word) {
  const dict = await loadCMUDict();

  // Normalize Unicode first
  const normalized = normalizeUnicode(word);

  // Try exact match (with normalized form)
  if (dict[normalized]) return dict[normalized];
  if (dict[word]) return dict[word];

  // Try without trailing 's' (plural)
  if (word.endsWith('s') && dict[word.slice(0, -1)]) {
    return dict[word.slice(0, -1)];
  }

  // Try without 'ed' (past tense)
  if (word.endsWith('ed')) {
    const base = word.slice(0, -2);
    if (dict[base]) return dict[base];
    // Try with doubled consonant (e.g., "stopped" -> "stop")
    if (dict[base.slice(0, -1)]) return dict[base.slice(0, -1)];
  }

  // Try without 'ing' (gerund)
  if (word.endsWith('ing')) {
    const base = word.slice(0, -3);
    if (dict[base]) return dict[base];
    if (dict[base + 'e']) return dict[base + 'e'];
  }

  // Try without 'tion', 'sion'
  if (word.endsWith('tion') || word.endsWith('sion')) {
    const base = word.slice(0, -3);
    if (dict[base]) return dict[base];
  }

  // Try without 'ly' (adverb)
  if (word.endsWith('ly')) {
    const base = word.slice(0, -2);
    if (dict[base]) return dict[base];
  }

  // Try without 'ment'
  if (word.endsWith('ment')) {
    const base = word.slice(0, -4);
    if (dict[base]) return dict[base];
  }

  // Try without 'ness'
  if (word.endsWith('ness')) {
    const base = word.slice(0, -4);
    if (dict[base]) return dict[base];
  }

  // Try without 'able', 'ible'
  if (word.endsWith('able') || word.endsWith('ible')) {
    const base = word.slice(0, -3);
    if (dict[base]) return dict[base];
    const base2 = word.slice(0, -4);
    if (dict[base2]) return dict[base2];
  }

  // Try without 'er'
  if (word.endsWith('er')) {
    const base = word.slice(0, -2);
    if (dict[base]) return dict[base];
    if (dict[base + 'e']) return dict[base + 'e'];
  }

  // Try without 'est'
  if (word.endsWith('est')) {
    const base = word.slice(0, -3);
    if (dict[base]) return dict[base];
  }

  // Try without 'ize', 'ise'
  if (word.endsWith('ize') || word.endsWith('ise')) {
    const base = word.slice(0, -3);
    if (dict[base]) return dict[base];
  }

  // Try compound word splitting (e.g., "whiteboard" -> "white" + "board")
  if (word.length > 8) {
    for (let i = 3; i < word.length - 2; i++) {
      const part1 = word.slice(0, i);
      const part2 = word.slice(i);
      if (dict[part1] && dict[part2]) {
        return [...dict[part1], ...dict[part2]];
      }
    }
  }

  return null;
}

async function processFile(filePath, language) {
  const raw = await readFile(filePath, 'utf-8');
  const cards = JSON.parse(raw);
  const dict = await loadCMUDict(); // Load dict once for abbreviation lookup

  let updated = 0;
  let skipped = 0;
  let failed = 0;

  for (let i = 0; i < cards.length; i++) {
    const card = cards[i];

    // Skip if already has phonetic
    if (card.phonetic) {
      skipped++;
      continue;
    }

    const baseWord = extractBaseWord(card.word);

    if (language === 'toeic' || (language === 'n2' && baseWord)) {
      const wordToLookup = baseWord || card.word;

      // Handle abbreviations (all caps, 2+ letters) - read as individual letters
      if (/^[A-Z]{2,}$/.test(card.word) && card.word.length <= 5) {
        // Look up each letter in CMU dict
        const letterPhonemes = [];
        for (const l of card.word) {
          const letterLower = l.toLowerCase();
          const phonemes = dict[letterLower];
          if (phonemes) {
            letterPhonemes.push(...phonemes);
          } else {
            letterPhonemes.push('EH1', 'R'); // fallback for unknown letters
          }
        }
        card.phonetic = arpabetToIPA(letterPhonemes);
        card.pronunciation = abbrevToPronunciation(card.word);
        updated++;
        continue;
      }

      // Handle multi-word phrases
      if (card.word.includes(' ')) {
        const words = card.word.split(/\s+/);
        const allPhonemes = [];
        let allFound = true;
        for (const w of words) {
          const phonemes = await lookupWord(w.toLowerCase());
          if (phonemes) {
            allPhonemes.push(...phonemes);
          } else {
            allFound = false;
            break;
          }
        }
        if (allFound && allPhonemes.length > 0) {
          card.phonetic = arpabetToIPA(allPhonemes);
          card.pronunciation = ipaToPronunciation(card.phonetic);
          updated++;
          continue;
        }
      }

      const phonemes = await lookupWord(wordToLookup);

      if (phonemes) {
        card.phonetic = arpabetToIPA(phonemes);
        card.pronunciation = ipaToPronunciation(card.phonetic);
        updated++;
      } else {
        failed++;
      }

      if ((i + 1) % 100 === 0) {
        process.stdout.write(`\r  Processing ${i + 1}/${cards.length} (updated: ${updated}, failed: ${failed})...`);
      }
    } else {
      skipped++;
    }
  }

  console.log(`\n  Updated: ${updated}, Skipped: ${skipped}, Failed: ${failed}`);
  return cards;
}

async function main() {
  const target = process.argv[2] || 'all';

  console.log('=== Generate Phonetic Data (CMU Dict) ===\n');

  const targets = target === 'all' ? ['toeic', 'n2'] : [target];

  for (const lang of targets) {
    if (!FILES[lang]) {
      console.error(`Unknown target: ${lang}. Use: toeic, n2, or all`);
      continue;
    }

    console.log(`Processing ${lang}...`);
    const cards = await processFile(FILES[lang], lang);
    await writeFile(FILES[lang], JSON.stringify(cards, null, 2) + '\n');
    console.log(`  Saved to ${FILES[lang]}\n`);
  }

  console.log('Done!');
}

main().catch(console.error);
