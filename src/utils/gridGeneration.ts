import type { StageConfig, WordBank, WordBankItem } from '../store/gameStore';

// standard scrabble distribution
const SCRABBLE_WEIGHTS: Record<string, number> = {
  E: 12, A: 9, I: 9, O: 8, N: 6, R: 6, T: 6, L: 4, S: 4, U: 4,
  D: 4, G: 3, B: 2, C: 2, M: 2, P: 2, F: 2, H: 2, V: 2, W: 2,
  Y: 2, K: 1, J: 1, X: 1, Q: 1, Z: 1
};

function getPaddingLetters(count: number): string[] {
  const pool: string[] = [];
  for (const [letter, weight] of Object.entries(SCRABBLE_WEIGHTS)) {
    for (let i = 0; i < weight; i++) {
        pool.push(letter);
    }
  }
  
  const result: string[] = [];
  for (let i = 0; i < count; i++) {
    const rIdx = Math.floor(Math.random() * pool.length);
    result.push(pool[rIdx]);
  }
  return result;
}

function shuffleArray<T>(array: T[]): T[] {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
}

export function generateStage(
  stageConfig: StageConfig, 
  wordBank: WordBank, 
  history: Set<string>
): { selectedWords: WordBankItem[], grid: string[] } {
  const maxTiles = stageConfig.grid.rows * stageConfig.grid.cols;
  const totalRequiredLen = stageConfig.words.reduce((sum, req) => sum + req.wordLength, 0);
  
  if (totalRequiredLen > maxTiles) {
    throw new Error(`Invalid stage config: total word length ${totalRequiredLen} exceeds grid size ${maxTiles}`);
  }

  const selectedWords: WordBankItem[] = [];
  
  // Select words based on requirements
  for (const req of stageConfig.words) {
    const availableWords = wordBank[req.wordLength.toString()]?.[req.difficulty.toString()] || [];
    let validWords = availableWords.filter(w => !history.has(w.word));
    
    // If we exhausted all valid words, just pick from available without history constraint
    if (validWords.length === 0) {
      if (availableWords.length === 0) {
          throw new Error(`No words found for length ${req.wordLength} and difficulty ${req.difficulty}`);
      }
      validWords = availableWords;
    }
    
    const picked = validWords[Math.floor(Math.random() * validWords.length)];
    selectedWords.push(picked);
    history.add(picked.word);
  }

  // Calculate Maximum Frequency Pool
  const maxFreqs = new Map<string, number>();
  for (const w of selectedWords) {
    const wordFreq = new Map<string, number>();
    for (const char of w.word.toUpperCase()) {
      wordFreq.set(char, (wordFreq.get(char) || 0) + 1);
    }
    // Update global max freqs
    for (const [char, count] of wordFreq.entries()) {
      const currentMax = maxFreqs.get(char) || 0;
      if (count > currentMax) {
        maxFreqs.set(char, count);
      }
    }
  }

  const gridArray: string[] = [];
  for (const [char, count] of maxFreqs.entries()) {
    for (let i = 0; i < count; i++) {
        gridArray.push(char);
    }
  }

  const paddingCount = maxTiles - gridArray.length;
  if (paddingCount < 0) {
    throw new Error("Grid letters exceeded tile count! Logic error in sum check.");
  }

  const padding = getPaddingLetters(paddingCount);
  gridArray.push(...padding);

  return { selectedWords, grid: shuffleArray(gridArray) };
}
