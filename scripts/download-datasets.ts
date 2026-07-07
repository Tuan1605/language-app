/**
 * Script tải datasets từ GitHub và HuggingFace
 *
 * Run: npx tsx scripts/download-datasets.ts
 */

import { execSync } from 'child_process';
import { mkdirSync, existsSync } from 'fs';
import { join } from 'path';

const DATASETS_DIR = join(__dirname, 'datasets');

const GITHUB_DATASETS = [
  {
    name: 'toeic-600-words',
    repo: 'https://github.com/tranngocminhhieu/toeic-600-words-dataset.git',
    file: 'toeic_600_words_vocabulary.json', // May need to adjust
  },
  {
    name: 'kanji-data',
    repo: 'https://github.com/davidluzgouveia/kanji-data.git',
    file: 'kanji.json',
  },
  {
    name: 'jlpt-grammar',
    repo: 'https://github.com/junyoung9394/jlpt-grammar-dataset.git',
    file: 'grammar.json', // May need to adjust
  },
];

const HUGGINGFACE_DATASETS = [
  {
    name: 'toeic-vocab-tw',
    url: 'https://huggingface.co/datasets/kknono668/toeic-vocab-tw',
    format: 'json',
  },
];

async function downloadGithubDataset(dataset: typeof GITHUB_DATASETS[0]) {
  const targetDir = join(DATASETS_DIR, dataset.name);

  if (existsSync(targetDir)) {
    console.log(`[download] ${dataset.name} already exists, pulling latest...`);
    execSync('git pull', { cwd: targetDir, stdio: 'inherit' });
  } else {
    console.log(`[download] Cloning ${dataset.repo}...`);
    execSync(`git clone --depth 1 ${dataset.repo} ${targetDir}`, { stdio: 'inherit' });
  }

  console.log(`[download] ${dataset.name} downloaded to ${targetDir}`);
}

async function downloadHuggingFaceDataset(dataset: typeof HUGGINGFACE_DATASETS[0]) {
  console.log(`[download] HuggingFace dataset: ${dataset.name}`);
  console.log(`[download] Manual download required:`);
  console.log(`  1. Visit: ${dataset.url}`);
  console.log(`  2. Download the dataset files`);
  console.log(`  3. Place in: ${DATASETS_DIR}/${dataset.name}/`);
}

async function main() {
  console.log('=== Downloading Datasets ===\n');

  // Create datasets directory
  mkdirSync(DATASETS_DIR, { recursive: true });

  // Download GitHub datasets
  console.log('--- GitHub Datasets ---');
  for (const dataset of GITHUB_DATASETS) {
    try {
      await downloadGithubDataset(dataset);
    } catch (error) {
      console.error(`[download] Failed to download ${dataset.name}:`, error);
    }
  }

  // HuggingFace datasets (manual)
  console.log('\n--- HuggingFace Datasets (Manual Download) ---');
  for (const dataset of HUGGINGFACE_DATASETS) {
    await downloadHuggingFaceDataset(dataset);
  }

  console.log('\n=== Download Complete ===');
  console.log('\nNext steps:');
  console.log('1. Run conversion scripts:');
  console.log('   npx tsx scripts/convert-toeic-600.ts');
  console.log('   npx tsx scripts/convert-kanji-jlpt.ts');
  console.log('   npx tsx scripts/convert-grammar-jlpt.ts');
}

main().catch(console.error);
