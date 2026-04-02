import fs from 'fs';
import path from 'path';

const WORD_BANK_PATH = path.join(process.cwd(), 'src', 'data', 'word-bank.json');
const DUMP_DIR = path.join(process.cwd(), 'dump');
const OUTPUT_CSV = path.join(DUMP_DIR, 'word-bank.csv');

function exportToCsv() {
  console.log(`Reading word bank from ${WORD_BANK_PATH}...`);
  
  if (!fs.existsSync(WORD_BANK_PATH)) {
    console.error('Word bank file not found!');
    return;
  }

  const wordBank = JSON.parse(fs.readFileSync(WORD_BANK_PATH, 'utf8'));
  const rows = [['word', 'length', 'difficulty', 'definition']];

  for (const length in wordBank) {
    wordBank[length].forEach(item => {
      // Escape quotes in definition for CSV safety
      const escapedDef = item.definition.replace(/"/g, '""');
      rows.push([
        item.word,
        length,
        item.difficulty,
        `"${escapedDef}"`
      ]);
    });
  }

  if (!fs.existsSync(DUMP_DIR)) {
    fs.mkdirSync(DUMP_DIR, { recursive: true });
  }

  const csvContent = rows.map(row => row.join(',')).join('\n');
  fs.writeFileSync(OUTPUT_CSV, csvContent);
  
  console.log(`Success! Exported ${rows.length - 1} words to ${OUTPUT_CSV}`);
}

exportToCsv();
