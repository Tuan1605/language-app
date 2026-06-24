const fs = require('fs');
const path = require('path');

function processFile(filePath) {
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  let updated = 0;
  for (const item of data) {
    if (!item.imageUrl) {
      // Create a deterministic but varied image using picsum seed
      // Use the word or id as seed
      const seed = encodeURIComponent(item.word || item.id);
      item.imageUrl = `https://picsum.photos/seed/${seed}/400/300`;
      updated++;
    }
  }
  
  if (updated > 0) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`Updated ${updated} items in ${path.basename(filePath)}`);
  } else {
    console.log(`No updates needed for ${path.basename(filePath)}`);
  }
}

processFile(path.join(__dirname, '../src/data/toeic/flashcards.json'));
processFile(path.join(__dirname, '../src/data/n2/flashcards.json'));
console.log('Done!');
