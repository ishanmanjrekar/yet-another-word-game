# YAWG: Grid Generation Algorithm

This document outlines the step-by-step logic developers must implement to proceduralize the YAWG grid at runtime.

## Concept: Maximum Character Frequency Pool
To ensure multiple target words can be built independently from the same board, the system calculates the maximum frequency of each required letter across the selected words.

### 1. The Validation Step
At game load, run a validation loop over `level-design.json`. If a stage breaches the tile limit mathematics, it prevents crashes down the line.
```javascript
let isValid = sum(wordLength) <= (stage.grid.rows * stage.grid.cols);
```
If `isValid` is false, throw a fatal build/runtime error specifying the offending stage.

### 2. The Word Selection Loop (Runtime)
1. Determine requirements for the current stage from `level-design.json`.
2. For each requirement, randomly pick an entry from `word-bank.json` corresponding to the required length and difficulty.
3. Track chosen words in an active `SessionHistory` list to prevent duplicate selection within the same session.
4. If a selected word is already in `SessionHistory`, re-roll until a unique valid word is found.

### 3. The Maximum Frequency Pool (Runtime)
Once the target words are selected, extract the precise letters required to construct them onto the game board:
1. Initialize an empty map/dictionary: `const maxFrequencies = new Map<char, int>()`
2. Iterate through each target word.
3. Count the character frequencies within *that specific word*.
4. Compare it against the global map. If the count is > the current value in the map, update the map.

**Example:**
Words selected: `BOOK`, `KICK`
- `BOOK`: B=1, O=2, K=1
- `KICK`: K=2, I=1, C=1
*Resulting Final Pool Map:* `B:1, O:2, K:2, I:1, C:1`. Total letters = 7.

### 4. Grid Padding & Assembly
1. Extract the characters from the `maxFrequencies` map into a flat array: `['B', 'O', 'O', 'K', 'K', 'I', 'C']`
2. Determine missing tile count: `(rows * cols) - currentArray.length` (e.g. 16 - 7 = 9 tiles missing).
3. Loop for the missing count. Pick a random letter from the **English Weights Distribution** and push it to the board array.
   - *Example weight array approach (mock): `['E','E','E','E','A','A','A','T','T','T','R','O','I','S'... ]` or an object containing specific probability distributions.*
4. Run a generic array shuffle algorithm (e.g., Fisher-Yates Shuffle) on the 16-item array.
5. Map the shuffled array to the visual grid UI.
