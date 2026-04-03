import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';

const CSV_PATH = 'c:/Users/ishan/Documents/GitHub/yet-another-word-game/data/cefr-vocabulary.csv';
const WEBSTERS_URL = 'https://raw.githubusercontent.com/matthewreagan/WebstersEnglishDictionary/master/dictionary_alpha_arrays.json';

async function simulate() {
  console.log('Fetching Websters...');
  const response = await fetch(WEBSTERS_URL);
  const websters = await response.json();
  const dictionary = {};
  if (Array.isArray(websters)) {
    for (const chunk of websters) {
      Object.assign(dictionary, chunk);
    }
  } else {
    Object.assign(dictionary, websters);
  }
  
  console.log('Reading CSV...');
  const words = [];
  let missedInDict = 0;
  let tooLong = 0;

  await new Promise((resolve) => {
    fs.createReadStream(CSV_PATH)
      .pipe(csv())
      .on('data', (row) => {
        if (!row.headword) return;
        const rawWord = row.headword.split('/')[0].toLowerCase().trim().replace(/[^a-z]/g, '');
        if (!rawWord || rawWord.length < 3 || rawWord.length > 8) return;

        const cefr = row.CEFR ? row.CEFR.trim().toUpperCase() : '';
        const category = ['A1', 'A2'].includes(cefr) ? 'A' : (['B1', 'B2'].includes(cefr) ? 'B' : null);
        
        if (category) {
          const def = dictionary[rawWord];
          if (!def) {
            missedInDict++;
          } else if (def.length >= 60) {
            tooLong++;
          } else {
            words.push({ word: rawWord, length: rawWord.length, category });
          }
        }
      })
      .on('end', resolve);
  });

  const buckets = {};
  for (const w of words) {
    const key = `${w.length}-${w.category}`;
    buckets[key] = (buckets[key] || 0) + 1;
  }

  console.log(`Total Matches (Dictionary + Short): ${words.length}`);
  console.log(`Missed in Dictionary: ${missedInDict}`);
  console.log(`Too Long (>= 60 chars): ${tooLong}`);
  console.log('Results (Length-Category): Count');
  Object.keys(buckets).sort((a,b) => {
    const [la, ca] = a.split('-');
    const [lb, cb] = b.split('-');
    if (la !== lb) return Number(la) - Number(lb);
    return ca.localeCompare(cb);
  }).forEach(k => {
    console.log(`${k}: ${buckets[k]}`);
  });
}

simulate().catch(console.error);
