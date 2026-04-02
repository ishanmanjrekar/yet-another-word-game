# YAWG: Vocabulary Generation Pipeline

This document ensures developers follow the strict "Zero API Token" requirement for generating the game's internal offline dictionary.

## The Objective
YAWG does **NOT** query AI (ChatGPT, Gemini, etc.) or web dictionary APIs during active gameplay. All words must be generated via an offline developer script and embedded into a static `word-bank.json` file to guarantee sub-millisecond load times and lower overhead scaling costs.

## The Core Data Sources
1. **The Word Source (CEFR CSV):**
   - Development must utilize a free, open-source English Vocabulary Profile CSV dataset (mapping words like "Apple" to levels like "A1").
2. **The Definition Source (Free API):**
   - Use a free authentication-less dictionary API (such as the [Free Dictionary API](https://dictionaryapi.dev/)).

## Execution Flow (Developer Node/Python Script)
A backend utility script (e.g., `npm run generate-words`) executes the following flow to populate the database:

1. **Read/Filter:** Parse the raw CEFR static CSV file. Filter it based on acceptable length limits (4 to 8 letters) and remove invalid strings (hyphenated arrays, special characters, spaces).
2. **Batch Selection:** Extract `X` number of random words for every required difficulty and length bucket (e.g., fifty 4-letter A1 words).
3. **Definition Ping Loop:** Iterate through the selected words, making a GET request to the selected Dictionary API.
   - `GET https://api.dictionaryapi.dev/api/v2/entries/en/{word}`
   - *Error Handling:* If a 404 is returned (meaning the obscure word is not found in the free dictionary), discard the word and automatically draw a replacement from the CEFR pool.
4. **Data Structuring:** Map the successful JSON responses strictly to the object format defined in `json-schemas.md`. Discard excessive API payload bloat (e.g., removing phonetic spelling arrays, MP3 audio links, and secondary/tertiary definitions) to keep the file size minimal.
5. **Write File:** Append or overwrite the final grouped payload to `word-bank.json` inside the game's static data directory before pushing to version control or deploying.
