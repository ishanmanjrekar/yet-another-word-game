import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';

const INPUT_CSV = path.join(process.cwd(), 'data', 'cefr-vocabulary.csv');
const OUTPUT_JSON = path.join(process.cwd(), 'src', 'data', 'word-bank.json');
const API_URL = 'https://api.dictionaryapi.dev/api/v2/entries/en/';

// Target buckets (25 words each)
const TARGETS = {
  '4': [2, 3, 4, 6],
  '5': [2, 3, 4, 5, 6],
  '6': [1, 2, 3, 4, 5, 6],
  '7': [1, 2, 3, 4, 6],
};
const WORDS_PER_BUCKET = 25;

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function isPlural(word) {
  // Simple heuristic: ends in 's' and is longer than 3 letters
  // This is not perfect, but follows the "simple heuristic" rule.
  return word.length > 3 && word.endsWith('s');
}

function isValidWord(word) {
  return /^[a-z]+$/.test(word) && !isPlural(word);
}

async function fetchDefinition(word) {
  try {
    const response = await fetch(`${API_URL}${word}`);
    if (!response.ok) return null;
    const data = await response.json();
    if (!data.length) return null;
    
    // Extract first definition
    const meaning = data[0].meanings[0];
    if (!meaning || !meaning.definitions.length) return null;
    
    return meaning.definitions[0].definition;
  } catch (error) {
    console.error(`Error fetching definition for ${word}:`, error.message);
    return null;
  }
}

async function main() {
  const wordsByBucket = {};

  // Initialize buckets
  for (const length in TARGETS) {
    wordsByBucket[length] = {};
    for (const difficulty of TARGETS[length]) {
      wordsByBucket[length][difficulty] = [];
    }
  }

  const rawWords = [];

  // Read CSV
  await new Promise((resolve, reject) => {
    fs.createReadStream(INPUT_CSV)
      .pipe(csv())
      .on('data', (row) => {
        const word = row.word.toLowerCase().trim();
        const level = row.level;
        const length = word.length.toString();
        
        if (isValidWord(word) && TARGETS[length] && TARGETS[length].includes(Number(level))) {
          rawWords.push({ word, level, length });
        }
      })
      .on('end', resolve)
      .on('error', reject);
  });

  // Shuffle raw words to get random selections
  rawWords.sort(() => Math.random() - 0.5);

  const wordBank = {};

  for (const length in TARGETS) {
    wordBank[length] = {};
    for (const difficulty of TARGETS[length]) {
      console.log(`Processing bucket: Length ${length}, Difficulty ${difficulty}...`);
      const bucketWords = rawWords.filter(w => w.length === length && Number(w.level) === difficulty);
      const successfulWords = [];
      
      for (const item of bucketWords) {
        if (successfulWords.length >= WORDS_PER_BUCKET) break;
        
        const definition = await fetchDefinition(item.word);
        if (definition) {
          successfulWords.push({
            word: item.word,
            definition: definition
          });
          console.log(`  [OK] ${item.word}`);
        } else {
          console.log(`  [SKIP] ${item.word} (No definition found)`);
        }
        
        // Anti-rate-limit
        await sleep(200);
      }
      
      wordBank[length][difficulty] = successfulWords;
    }
  }

  // Ensure directories exist
  const outputDir = path.dirname(OUTPUT_JSON);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(OUTPUT_JSON, JSON.stringify(wordBank, null, 2));
  console.log(`\nSuccess! Vocabulary generated to ${OUTPUT_JSON}`);
}

main().catch(console.error);
