import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MOCK_AUDIO = 'https://actions.google.com/sounds/v1/alarms/beep_short.ogg';

const isListeningSection = (title) => {
  if (!title) return false;
  const t = title.toLowerCase();
  return t.includes('part 1') || 
         t.includes('part 2') || 
         t.includes('part 3') || 
         t.includes('part 4') || 
         t.includes('listening') ||
         t.includes('choukai');
};

const isPart1Or2 = (title) => {
  if (!title) return false;
  const t = title.toLowerCase();
  return t.includes('part 1') || t.includes('part 2');
};

const processQuestion = (q, sectionTitle) => {
  let modified = false;

  // Move passage to explanation so it's not visible during the test
  if (q.passage) {
    q.explanation = `[Transcript]\n${q.passage}\n\n${q.explanation || ''}`;
    delete q.passage;
    modified = true;
  }

  // Strip option text for Part 1 & Part 2
  if (isPart1Or2(sectionTitle)) {
    if (q.options && q.options.length > 0 && q.options.some(opt => opt.length > 5)) {
      q.options = q.options.map((_, i) => `(${String.fromCharCode(65 + i)})`);
      modified = true;
    }
  }

  // Add dummy audio if missing
  if (!q.audioUrl) {
    q.audioUrl = MOCK_AUDIO;
    modified = true;
  }

  return modified;
};

async function processFile(filePath) {
  const content = await fs.readFile(filePath, 'utf-8');
  let data;
  try {
    data = JSON.parse(content);
  } catch (e) {
    return;
  }

  let fileModified = false;

  if (Array.isArray(data)) {
    // Flat questions array (e.g. questions-listening.json)
    data.forEach(q => {
      // Check if it's listening
      const category = (q.subCategory || q.category || '').toLowerCase();
      if (isListeningSection(category)) {
        if (processQuestion(q, category)) {
          fileModified = true;
        }
      }
    });
  } else if (data && data.sections) {
    // Exam object
    data.sections.forEach(sec => {
      if (isListeningSection(sec.title)) {
        sec.questions.forEach(q => {
          if (processQuestion(q, sec.title)) {
            fileModified = true;
          }
        });
      }
    });
  }

  if (fileModified) {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
    console.log(`Updated ${path.basename(filePath)}`);
  }
}

async function main() {
  const rootDir = path.resolve(__dirname, '../src/data');
  
  async function walk(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await walk(fullPath);
      } else if (entry.isFile() && entry.name.endsWith('.json')) {
        await processFile(fullPath);
      }
    }
  }

  await walk(rootDir);
  console.log('Data cleaning complete.');
}

main().catch(console.error);
