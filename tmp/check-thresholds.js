import fs from 'fs';
const WEBSTERS_URL = 'https://raw.githubusercontent.com/matthewreagan/WebstersEnglishDictionary/master/dictionary_alpha_arrays.json';
const CSV_PATH = 'c:/Users/ishan/Documents/GitHub/yet-another-word-game/data/cefr-vocabulary.csv';

async function simulate() {
  const response = await fetch(WEBSTERS_URL);
  const websters = await response.json();
  const dictionary = {};
  for (const chunk of Array.isArray(websters) ? websters : [websters]) {
    Object.assign(dictionary, chunk);
  }
  
  const words = [];
  await new Promise((resolve) => {
    fs.createReadStream(CSV_PATH)
      .pipe(require('csv-parser')())
      .on('data', (row) => {
        if (!row.headword) return;
        const rawWord = row.headword.split('/')[0].toLowerCase().trim().replace(/[^a-z]/g, '');
        if (!rawWord || rawWord.length < 3 || rawWord.length > 8) return;
        const cefr = row.CEFR ? row.CEFR.trim().toUpperCase() : '';
        const category = ['A1', 'A2'].includes(cefr) ? 'A' : (['B1', 'B2'].includes(cefr) ? 'B' : null);
        if (category && dictionary[rawWord]) {
          words.push({ word: rawWord, defLen: dictionary[rawWord].length });
        }
      })
      .on('end', resolve);
  });

  const thresholds = [60, 80, 100, 120, 150, 200];
  for (const t of thresholds) {
    const count = words.filter(w => w.defLen < t).length;
    console.log(`Limit ${t} chars: ${count} words`);
  }
}

simulate().catch(console.error);
