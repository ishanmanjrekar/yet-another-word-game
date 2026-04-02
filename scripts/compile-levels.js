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
    const c = parseInt(row.Cols);
    const timer = parseInt(row.Timer);
    const wordsRaw = row.Words;

    // Parse words: "4-2|4-2|4-2|4-3"
    const wordList = wordsRaw.split('|').map(w => {
      const parts = w.split('-');
      return {
        wordLength: parseInt(parts[0]),
        difficulty: parseInt(parts[1])
      };
    });

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
