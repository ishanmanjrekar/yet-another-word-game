import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';

const INPUT_CSV = path.join(process.cwd(), 'data', 'arcade-levels.csv');
const OUTPUT_JSON = path.join(process.cwd(), 'src', 'data', 'level-design.json');

async function main() {
  const levels = {
    stages: {}
  };

  const rows = [];

  // Read CSV
  await new Promise((resolve, reject) => {
    fs.createReadStream(INPUT_CSV)
      .pipe(csv())
      .on('data', (row) => {
        rows.push(row);
      })
      .on('end', resolve)
      .on('error', reject);
  });

  for (const row of rows) {
    const stageNumber = row.Stage;
    const r = parseInt(row.Rows);
    const c = parseInt(row.Columns);
    const timer = parseInt(row.Timer);

    // Parse words from columns Word1, Difficulty1, ..., Word5, Difficulty5
    const wordList = [];
    for (let i = 1; i <= 5; i++) {
        const length = row[`Word${i}`];
        const difficulty = row[`Difficulty${i}`];
        
        if (length && difficulty && length.trim() !== '' && difficulty.trim() !== '') {
            wordList.push({
                wordLength: parseInt(length),
                difficulty: parseInt(difficulty)
            });
        }
    }

    if (wordList.length === 0) {
        console.warn(`Warning: Stage ${stageNumber} has no words defined.`);
    }

    // Validate capacity
    const totalLength = wordList.reduce((acc, w) => acc + w.wordLength, 0);
    const capacity = r * c;

    if (totalLength > capacity) {
      throw new Error(`Error: Stage ${stageNumber} word lengths (${totalLength}) exceed grid capacity (${capacity}).`);
    }

    levels.stages[stageNumber] = {
      grid: {
        rows: r,
        cols: c
      },
      timer: timer,
      words: wordList
    };
  }

  // Ensure directories exist
  const outputDir = path.dirname(OUTPUT_JSON);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(OUTPUT_JSON, JSON.stringify(levels, null, 2));
  console.log(`Success! Levels compiled to ${OUTPUT_JSON}`);
}

main().catch(error => {
  console.error(error.message);
  process.exit(1);
});
