# YAWG: Level Generation Pipeline

To make designing and balancing hundreds of Arcade stages manageable, the `level-design.json` file should NOT be written out by hand. Instead, developers and game designers will manage the levels via spreadsheet (CSV), which is then parsed into the final JSON format by an offline builder script.

## 1. The Design Source (CSV Format)
Game designers will maintain a simple `arcade-levels.csv` file. 

| Stage | Rows | Columns | Timer | Word1 | Difficulty1 | Word2 | Difficulty2 | ... | Word5 | Difficulty5 |
|-------|------|---------|-------|-------|-------------|-------|-------------|-----|-------|-------------|
| 1     | 4    | 4       | 60    | 7     | 4           | 5     | 3           | ... |       |             |
| 2     | 4    | 4       | 55    | 8     | 5           | 6     | 4           | ... |       |             |

### Data Definitions:
- **Stage:** The integer number of the stage progression.
- **Rows/Columns:** Specifies the grid bounds.
- **Timer:** The starting seconds allowed for the stage.
- **Word1, Difficulty1, ..., Word5, Difficulty5:** Up to five words and their respective difficulty ratings.
  - Formatted as separate columns for easier spreadsheet editing.
  - **Example:** Word1 = `7`, Difficulty1 = `4` means a 7-letter word pulled from Difficulty Level 4.
  - Empty cells are ignored during level generation.

## 2. Execution Flow (CSV to JSON Script)
A secondary backend script (e.g., `npm run compile-levels`) handles the conversion:

1. **Read/Parse:** Reads `arcade-levels.csv` row by row.
2. **Data Transformation:** Splits the pipe-separated `Words` column and converts the substrings into Javascript Objects fitting the `StageWordRequirement` interface.
3. **Validation Check:** Executes the "O(1) Generation Rule" constraint natively during the build phase:
   - Evaluates if the sum of all word lengths in a given row exceeds `Rows * Cols`.
   - If a violation is found, the compiler immediately stops and throws an error indicating the exact row responsible (e.g., `Error: Stage 43 word lengths exceed grid capacity.`).
4. **Output Output:** Wraps the validated data under the `stages` object root and exports the final minified `level-design.json` into the `src/data` directory for the game to consume.
