# YAWG: Level & Progression Design Document

This document outlines the procedural generation logic, stage setups, economy, and global algorithms driving Yet Another Word Game (YAWG).

> **Developer Reference Links:**
> - [JSON Data Schemas](./json-schemas.md): Interfaces for level, reward, and word bank configurations.
> - [Grid Generation Algorithm](./grid-generation-algorithm.md): The math and loop logic for procedurally creating the 16-tile board.

---

## 1. The Offline Database Pipeline
To conserve API tokens and guarantee lightning-fast load times, the game does not use AI to generate definitions or parse difficulty at runtime. 
Instead, a local script compiles a database file (`word-bank.json`) using free, open-source resources:
- Parses open-source CEFR (Common European Framework of Reference) English vocabulary lists.
- Fetches definitions via a free dictionary API.
- Structures the data into a static JSON shipped directly with the game bundle.

**Difficulty Categorization System:**
The internal system scales difficulty from 1 to 4, mapped natively to CEFR tiers:
* `1` = A1
* `2` = A2
* `3` = B1
* `4` = B2

---

## 2. Stage Generation & Board Constraints
All configurations regarding Grid Size, Timer length, and required vocabulary for Arcade Mode are controlled within `level-design.json`.

### 2.1 The "O(1) Generation" Rule
To mathematically guarantee that all required words physically fit onto the board—without needing expensive pathfinding or retry loops—the game implements a strict constraint:
> **The Sum of all `wordLength` integers in a single stage MUST be $\le$ the total tiles available (`rows * cols`).**

*Example:* A 4x4 grid has 16 tiles. If a stage requires a 7-letter word, a 5-letter word, and a 4-letter word (Total: 16), it is guaranteed valid.

If `sum(wordLength) > (rows * cols)`, a validation function at game startup/build will immediately throw a hard error, enforcing structure.

### 2.2 Board Padding
If the sum of `wordLength` falls below the board's capacity, or if the chosen words naturally share letters (e.g., `BOOK` and `COCO` both using `O` and `C`), the remaining empty tiles are "padded". 
- Filler letters are selected from a weighted array distributed according to standard English phonetic frequencies (e.g., heavy weighting towards E, T, A, I) to ensure a natural-looking grid.

### 2.3 JSON Layout Example
```json
{
  "stages": {
    "1": {
      "grid": { "rows": 4, "cols": 4 },
      "timer": 60,
      "words": [
        { "wordLength": 7, "difficulty": 4 }, 
        { "wordLength": 5, "difficulty": 3 },
        { "wordLength": 4, "difficulty": 3 }
      ]
    }
  }
}
```

---

## 3. Economy & Payout Limits (`rewards.json`)
The game's monetary rewards are scaled iteratively to match Arcade progression and governed exclusively by `rewards.json`.

### 3.1 Arcade Mode Payouts
- **Base Value:** Starts at a baseline integer (e.g., 10 coins for Stage 1).
- **Compounding Growth:** Each successive stage yields a **+10% increase** in coins based on the previous stage, **rounded down**.
- *Progression Example:* 
  - Stage 1: 10 coins
  - Stage 2: 11 coins
  - Stage 3: 12 coins
  - Stage 4: 13 coins

### 3.2 Word of the Day Payouts
Completing the Daily puzzle yields a fixed, flat-rate coin payout. While the player's consecutive daily completions ("Daily Streak") are tracked internally for social validation and UI display, the streak does **not** currently multiply the daily payout.

---

## 4. Word of the Day Algorithms
The Word of the Day provides a global, synchronized experience ensuring every player attempting the puzzle on April 12th receives the exact same words and grid.

### 4.1 Serverless Global Synchronization
YAWG achieves this universally shared puzzle offline without establishing server side generation via **Seeded PRNG (Pseudo-Random Number Generators)**.

1. The game takes the current **UTC Date String** (e.g., `2026-04-02`).
2. That UTC Date is normalized into an integer integer.
3. This integer becomes the `seed` passed into the game's internal RNG library.
4. Because the `word-bank.json` is static and the RNG seed is identical for everyone on Earth on that given day, the exact same words are pulled from the randomizer, and the exact same grid positions are assigned.
