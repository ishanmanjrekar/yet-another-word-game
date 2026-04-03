# YAWG: Vocabulary Generation Pipeline

This document ensures developers follow the strict "Zero API Token" requirement for generating the game's internal offline dictionary.

## The Objective
YAWG does **NOT** query AI (ChatGPT, Gemini, etc.) or web dictionary APIs during active gameplay. All words must be generated via an offline developer script and embedded into a static `word-bank.json` file to guarantee sub-millisecond load times and lower overhead scaling costs.

## The Core Data Sources
1. **The Word Source (CEFR CSV):**
   - Development utilizes a free, open-source English Vocabulary Profile CSV dataset (mapping words like "Apple" to levels like "A1").
2. **The Definition Source (Webster's Dictionary):**
   - High-quality definitions are pulled from a static JSON version of the [Webster's Unabridged Dictionary](https://github.com/matthewreagan/WebstersEnglishDictionary).

## Execution Flow (Developer Node Script)
A backend utility script (`npm run generate-words`) executes the following flow to populate the database:

1. **Read/Filter:** Parse the raw CEFR static CSV file. Filter it based on acceptable length limits (3 to 8 letters) and remove invalid strings (special characters, spaces).
2. **Selection & Truncation:**
   - Iterate through candidates that have a corresponding entry in the Webster's JSON.
   - **Metadata Stripping:** Remove leading numbers (`1.`), part-of-speech markers (`n.`), and parenthetical references (`(a)`) from the start of the definition.
   - **Segment Merging:** Extract the definition by splitting at semicolons (`;`) and periods (`.`). If the first segment is shorter than 10 characters, merge it with subsequent segments until the length is $\ge$ 10.
   - **Cleaning:** Trim whitespace and ensure the result ends in a single period (`.`).
   - **Validation:** Only words with a resulting definition **between 10 and 59 characters** are accepted.
3. **Distribution Management:**
   - Targets a total of 1,000 words.
   - Distribution per length: 3 (200), 4 (200), 5 (200), 6 (200), 7 (100), 8 (100).
   - Difficulty Mix: 70% Level A (A1/A2) and 30% Level B (B1/B2).
4. **Data Structuring:** Map the successful words strictly to the flattened JSON format: `{ "length": [ { word, definition, difficulty } ] }`.
5. **Write File:** Overwrite the final payload to `word-bank.json` inside the game's static data directory.
