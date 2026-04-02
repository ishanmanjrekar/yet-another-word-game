import fs from 'fs';
import path from 'path';

const WORD_BANK_PATH = path.join(process.cwd(), 'src', 'data', 'word-bank.json');

function updateWordBank() {
  console.log(`Reading word bank from ${WORD_BANK_PATH}...`);
  
  if (!fs.existsSync(WORD_BANK_PATH)) {
    console.error('Word bank file not found!');
    return;
  }

  const wordBank = JSON.parse(fs.readFileSync(WORD_BANK_PATH, 'utf8'));
  let updatedCount = 0;

  const updatedBank = {};

  for (const length in wordBank) {
    updatedBank[length] = [];
    for (const difficulty in wordBank[length]) {
      const words = wordBank[length][difficulty];
      const diffValue = parseInt(difficulty, 10);
      
      words.forEach(wordObj => {
        wordObj.difficulty = diffValue;
        updatedBank[length].push(wordObj);
        updatedCount++;
      });
    }
  }

  fs.writeFileSync(WORD_BANK_PATH, JSON.stringify(updatedBank, null, 2));
  console.log(`Success! Updated ${updatedCount} words with difficulty values.`);
}

updateWordBank();
