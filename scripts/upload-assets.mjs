#!/usr/bin/env node
/**
 * Upload PDF and audio files to GitHub Releases.
 *
 * Usage:
 *   1. Create a GitHub Personal Access Token with "repo" scope
 *      https://github.com/settings/tokens/new
 *   2. Run:
 *      GITHUB_TOKEN=ghp_xxx node scripts/upload-assets.mjs
 *
 * After upload, set VITE_ASSETS_BASE_URL on Vercel to:
 *   https://github.com/Tuan1605/language-app/releases/download/assets-v1
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, relative } from 'path';

const TOKEN = process.env.GITHUB_TOKEN;
const REPO = 'Tuan1605/language-app';
const TAG = 'assets-v1';
const RELEASE_NAME = 'Static Assets (PDF + Audio)';

const PUBLIC_DIR = join(import.meta.dirname, '..', 'public');

const DIRECTORIES = [
  { dir: 'pdfs/toeic_2024', pattern: /\.pdf$/ },
  { dir: 'audio/toeic_2024', pattern: /\.(mp3|wav|ogg)$/ },
  { dir: 'audio/toeic_2024/parts', pattern: /\.(mp3|wav|ogg)$/ },
];

function getAllFiles(dirPath, pattern) {
  const files = [];
  try {
    for (const entry of readdirSync(dirPath)) {
      const fullPath = join(dirPath, entry);
      if (statSync(fullPath).isDirectory()) {
        files.push(...getAllFiles(fullPath, pattern));
      } else if (pattern.test(entry)) {
        files.push(fullPath);
      }
    }
  } catch {}
  return files;
}

async function ghApi(path, method = 'GET', body = null) {
  const opts = {
    method,
    headers: {
      Authorization: `token ${TOKEN}`,
      Accept: 'application/vnd.github.v3+json',
      'User-Agent': 'upload-assets-script',
    },
  };
  if (body) {
    opts.headers['Content-Type'] = 'application/octet-stream';
    opts.body = body;
  }
  const res = await fetch(`https://api.github.com${path}`, opts);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub API ${res.status}: ${text}`);
  }
  return res.status === 204 ? null : res.json();
}

async function main() {
  if (!TOKEN) {
    console.error('Missing GITHUB_TOKEN. See script header for instructions.');
    process.exit(1);
  }

  // Collect all files
  const allFiles = [];
  for (const { dir, pattern } of DIRECTORIES) {
    const dirPath = join(PUBLIC_DIR, dir);
    const files = getAllFiles(dirPath, pattern);
    allFiles.push(...files);
    console.log(`Found ${files.length} files in ${dir}`);
  }

  console.log(`\nTotal: ${allFiles.length} files to upload\n`);

  // Check existing release
  let release;
  try {
    release = await ghApi(`/repos/${REPO}/releases/tags/${TAG}`);
    console.log(`Release "${TAG}" already exists, will upload to it`);
  } catch {
    console.log(`Creating release "${TAG}"...`);
    release = await ghApi(`/repos/${REPO}/releases`, 'POST', JSON.stringify({
      tag_name: TAG,
      name: RELEASE_NAME,
      body: 'PDF exams and audio files for the language learning app.',
      draft: false,
      prerelease: false,
    }));
    console.log(`Created: ${release.html_url}`);
  }

  // Upload each file
  let uploaded = 0;
  let skipped = 0;

  for (const filePath of allFiles) {
    const filename = filePath.split('/').pop();
    const size = statSync(filePath).size;
    const sizeMB = (size / 1024 / 1024).toFixed(1);

    // Check if asset already exists
    const existing = release.assets?.find(a => a.name === filename);
    if (existing) {
      console.log(`  SKIP  ${filename} (${sizeMB}MB) - already uploaded`);
      skipped++;
      continue;
    }

    process.stdout.write(`  UP ${filename} (${sizeMB}MB)... `);
    const data = readFileSync(filePath);
    try {
      await ghApi(
        `/repos/${REPO}/releases/${release.id}/assets?name=${encodeURIComponent(filename)}`,
        'POST',
        data
      );
      uploaded++;
      console.log('OK');
    } catch (e) {
      console.log(`FAILED: ${e.message}`);
    }
  }

  console.log(`\nDone: ${uploaded} uploaded, ${skipped} skipped`);
  console.log(`\nSet this on Vercel (Settings > Environment Variables):`);
  console.log(`  VITE_ASSETS_BASE_URL = https://github.com/${REPO}/releases/download/${TAG}`);
}

main().catch(e => { console.error(e); process.exit(1); });
