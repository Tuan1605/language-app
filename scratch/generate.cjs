const fs = require('fs');
const path = require('path');

function removeAccents(str) {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D');
}

const dataDir = path.join(__dirname, '../src/data');
const corrections = {};

function scanDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      scanDir(fullPath);
    } else if (fullPath.endsWith('.json')) {
      const content = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
      if (Array.isArray(content)) {
        content.forEach(item => {
          if (item.definition) {
            const accented = item.definition;
            const unaccented = removeAccents(accented);
            if (accented !== unaccented) {
              corrections[unaccented] = accented;
            }
          }
        });
      }
    }
  }
}

scanDir(dataDir);
fs.writeFileSync(path.join(__dirname, 'corrections.json'), JSON.stringify(corrections, null, 2));
console.log(`Found ${Object.keys(corrections).length} corrections.`);
