import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';

const INPUT_CSV = path.join(process.cwd(), 'data', 'cefr-vocabulary.csv');
const OUTPUT_JSON = path.join(process.cwd(), 'src', 'data', 'word-bank.json');
const WEBSTERS_URL = 'https://raw.githubusercontent.com/matthewreagan/WebstersEnglishDictionary/master/dictionary_alpha_arrays.json';

// Target counts per length
const TARGET_COUNTS = {
  '3': 200,
  '4': 200,
  '5': 200,
  '6': 200,
  '7': 100,
  '8': 100,
};

// Distribution: 70% A (Level 1/2), 30% B (Level 3/4)
const DIST_A = 0.7;
const DIST_B = 0.3;

const CHAR_LIMIT = 60;

/**
 * Truncates definition to first meaningful segment(s), cleans it up,
 * and ensures it's under the character limit.
 */
function getShortDefinition(fullDef) {
  if (!fullDef) return null;

  // 1. Strip definitely obsolete/archaic blocks globally
  let cleanDef = fullDef.replace(/\[(Obs|Archaic|R|Prov|Dial|Scot|Obsol)\.?\s*\]/gi, '');
  
  // 1.1 Strip leading metadata like "1. ", "(a) ", or part-of-speech markers at the start
  cleanDef = cleanDef.replace(/^(\d+\.?\s*|\([a-z]\)\s*|[a-z]+\.\s*(adj\.\s*|n\.\s*|v\.\s*)?)/i, '').trim();
  
  if (!cleanDef) return null;

  // 2. Split by . or ;
  const segments = cleanDef.split(/[.;]/);
  let result = "";

  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i].trim();
    if (!segment) continue;

    // 2.5 Filter out Obsolete, Archaic, or Reference-only segments
    const lowerSegment = segment.toLowerCase();
    if (
      lowerSegment.includes('obs.') || 
      lowerSegment.includes('obsolete') || 
      lowerSegment.includes('archaic') ||
      lowerSegment.includes('chaucer') ||
      lowerSegment.includes('spenser') ||
      lowerSegment.includes('milton') ||
      lowerSegment.includes('shak.') ||
      lowerSegment.includes('sir t.') ||
      lowerSegment.includes('variant of') ||
      lowerSegment.includes('suffix') ||
      lowerSegment.includes('prefix') ||
      lowerSegment.includes('termination') ||
      lowerSegment.includes('pers. sing.') ||
      lowerSegment.includes('pers. pl.') ||
      lowerSegment.includes('strong imp.') ||
      lowerSegment.startsWith('same as ') ||
      lowerSegment.startsWith('of ') || // Avoid "of Do", "of Be"
      lowerSegment.startsWith('see ') ||
      lowerSegment.startsWith('imp. ') ||
      lowerSegment.startsWith('p. p. ') ||
      lowerSegment.length < 3
    ) {
      continue;
    }

    // Append segment
    if (result) result += ". ";
    result += segment;

    // 3. Condition: If result is >= 10 chars, we are good to stop
    if (result.length >= 10) {
      if (result.length < CHAR_LIMIT) {
        // Ensure it ends with a single period
        const final = result.replace(/\.*$/, "") + ".";
        // Final sanity check for remaining brackets or weird markers
        if (final.includes('[') || final.includes(']')) return null;
        return final;
      } else {
        // Exceeded character limit
        return null;
      }
    }
  }

  // Final fallback
  if (result.length >= 3 && result.length < CHAR_LIMIT) {
     const final = result.replace(/\.*$/, "") + ".";
     if (final.includes('[') || final.includes(']')) return null;
     return final;
  }

  return null;
}

async function loadDictionary() {
  console.log('Fetching Webster\'s Dictionary...');
  const response = await fetch(WEBSTERS_URL);
  const data = await response.json();
  const dictionary = {};
  
  if (Array.isArray(data)) {
    for (const chunk of data) {
      Object.assign(dictionary, chunk);
    }
  } else {
    Object.assign(dictionary, data);
  }
  return dictionary;
}

async function main() {
  const dictionary = await loadDictionary();
  console.log(`Dictionary loaded with ${Object.keys(dictionary).length} keys.`);

  const rawWords = [];

  // Read CSV
  await new Promise((resolve, reject) => {
    fs.createReadStream(INPUT_CSV)
      .pipe(csv())
      .on('data', (row) => {
        if (!row.headword) return;
        
        // Take the first variation if multiple exist (e.g. "a.m./A.M./am/AM")
        const word = row.headword.split('/')[0].toLowerCase().trim().replace(/[^a-z]/g, '');
        if (!word || word.length < 3 || word.length > 8) return;

        const cefr = row.CEFR ? row.CEFR.trim().toUpperCase() : '';
        let category = null;
        let difficulty = null;

        if (['A1', 'A2'].includes(cefr)) {
          category = 'A';
          difficulty = cefr === 'A1' ? 1 : 2;
        } else if (['B1', 'B2'].includes(cefr)) {
          category = 'B';
          difficulty = cefr === 'B1' ? 3 : 4;
        }

        if (category) {
          const definition = getShortDefinition(dictionary[word]);
          if (definition) {
            rawWords.push({ word, definition, difficulty, category, length: word.length });
          }
        }
      })
      .on('end', resolve)
      .on('error', reject);
  });

  console.log(`Found ${rawWords.length} eligible candidates with valid short definitions.`);

  const wordBank = {};
  let totalSaved = 0;

  for (const length in TARGET_COUNTS) {
    const targetTotal = TARGET_COUNTS[length];
    const targetA = Math.floor(targetTotal * DIST_A);
    const targetB = targetTotal - targetA;

    const candidates = rawWords.filter(w => w.length === Number(length));
    const poolA = candidates.filter(w => w.category === 'A').sort(() => Math.random() - 0.5);
    const poolB = candidates.filter(w => w.category === 'B').sort(() => Math.random() - 0.5);

    const selected = [];
    
    // Pick A words
    const pickedA = poolA.slice(0, targetA);
    selected.push(...pickedA);

    // Pick B words
    const pickedB = poolB.slice(0, targetB);
    selected.push(...pickedB);

    // If we missed targets (e.g. not enough A words), fill with whatever is left from the other pool
    if (selected.length < targetTotal) {
      const remainingA = poolA.slice(targetA);
      const remainingB = poolB.slice(targetB);
      const leftovers = [...remainingA, ...remainingB].sort(() => Math.random() - 0.5);
      const toAdd = leftovers.slice(0, targetTotal - selected.length);
      selected.push(...toAdd);
    }

    wordBank[length] = selected.map(w => ({
      word: w.word,
      definition: w.definition,
      difficulty: w.difficulty
    }));
    
    totalSaved += wordBank[length].length;
    console.log(`Bucket ${length}: Target ${targetTotal}, Selected ${wordBank[length].length} (${pickedA.length} A, ${pickedB.length} B)`);
  }

  // Ensure directories exist
  const outputDir = path.dirname(OUTPUT_JSON);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Preserve format: sort lengths numerically for readability
  const sortedWordBank = {};
  Object.keys(wordBank).sort((a, b) => Number(a) - Number(b)).forEach(k => {
    sortedWordBank[k] = wordBank[k];
  });

  fs.writeFileSync(OUTPUT_JSON, JSON.stringify(sortedWordBank, null, 2));
  console.log(`\nSuccess! Vocabulary generated with ${totalSaved} words to ${OUTPUT_JSON}`);
}

main().catch(console.error);
