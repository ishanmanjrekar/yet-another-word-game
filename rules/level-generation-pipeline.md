# YAWG: Level Generation Pipeline

To make designing and balancing hundreds of Arcade stages manageable, the `level-design.json` file should NOT be written out by hand. Instead, developers and game designers will manage the levels via spreadsheet (CSV), which is then parsed into the final JSON format by an offline builder script.

## 1. The Design Source (CSV Format)
Game designers will maintain a simple `arcade-levels.csv` file. 

| Stage | Rows | Cols | Timer | Words (Length-Difficulty) |
|-------|------|------|-------|---------------------------|
| 1     | 4    | 4    | 60    | 7-4\|5-3\|4-3             |
| 2     | 4    | 4    | 55    | 8-5\|6-4                  |
| 3     | 3    | 3    | 45    | 5-2\|4-2                  |

### Data Definitions:
- **Stage:** The integer number of the stage progression.
- **Rows/Cols:** Specifies the grid bounds.
- **Timer:** The starting seconds allowed for the stage.
- **Words:** A pipe-separated (`|`) list of the word requirements. Formatted as `[WordLength]-[DifficultyRating]`.
  - Example: `7-4` means a 7-letter word pulled from Difficulty Level 4 (B2 rating).

## 2. Execution Flow (CSV to JSON Script)
A secondary backend script (e.g., `npm run compile-levels`) handles the conversion:

1. **Read/Parse:** Reads `arcade-levels.csv` row by row.
2. **Data Transformation:** Splits the pipe-separated `Words` column and converts the substrings into Javascript Objects fitting the `StageWordRequirement` interface.
3. **Validation Check:** Executes the "O(1) Generation Rule" constraint natively during the build phase:
   - Evaluates if the sum of all word lengths in a given row exceeds `Rows * Cols`.
   - If a violation is found, the compiler immediately stops and throws an error indicating the exact row responsible (e.g., `Error: Stage 43 word lengths exceed grid capacity.`).
4. **Output Output:** Wraps the validated data under the `stages` object root and exports the final minified `level-design.json` into the `src/data` directory for the game to consume.
