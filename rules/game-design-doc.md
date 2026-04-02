# YAWG: Yet Another Word Game - Game Design Document

> **Architecture & Sub-Documents Reference:**
> - [Level Design Core](./level-design.md)
> - [Grid Generation Algorithm](./grid-generation-algorithm.md)
> - [JSON Data Schemas](./json-schemas.md)
> - [Level CSV Build Pipeline](./level-generation-pipeline.md)
> - [Powerups & Mechanics](./powerups-logic.md)
> - [Vocabulary Offline Pipeline](./vocabulary-generation-pipeline.md)

## 1. Overview
- **Game Name:** YAWG (Yet Another Word Game)
- **Core Concept:** A word game where players guess target words based on their dictionary definitions using a 4x4 grid of letter tiles.
- **Objective:** Solve all the required words for a stage or a daily challenge using the provided grid of tiles.

## 2. Core Gameplay Mechanics
- **Grid Layout:** Variable grid layouts (e.g., 3x3, 4x4) configured dynamically per stage within `level-design.json`. Maximum size is 4x4 (16 tiles).
- **Word Constraints:** Words range from a minimum of 4 letters to a maximum of 8 letters. The sum of all word lengths in a single stage must physically fit within the active grid.
- **Tile Selection:** Players can select any tile from the 16-tile grid in any order (tiles do not need to be adjacent). A single tile can only be used once per active word.
- **Word Presentation:** A stage usually features multiple words to guess within the same 16-tile set (e.g., one 4-letter word, two 5-letter words, and one 8-letter word).
  - Only one blank word and its corresponding definition are presented on screen at a given time.
  - Players can toggle between the available blank words for the stage and guess them in any order.
- **Submission & Feedback:** 
  - The game automatically evaluates the word once the final tile constraint is filled.
  - If incorrect, the game provides visual feedback (e.g., red highlight animations - exact UI behavior to be finalized).
  - **No Penalty:** There are no penalties for failed attempts; the player can keep trying to form the word indefinitely.

## 3. Game Modes

### 3.1 Arcade Mode
- **Progression:** The player starts at Stage 1, with the single objective to survive and reach the highest stage possible.
- **Stage Completion:** The player must successfully guess all the words in a stage to clear it and advance to the next.
- **Level Generation:** Words in each level are procedurally generated and categorized by difficulty based on the CEFR (Common European Framework of Reference for Languages) scale. *(Logic expanded in the level design document).*
- **Timer Mechanics:** 
  - Each stage possesses a countdown timer defined in `level-design.json` (e.g., defaulting to 60 seconds). This timer starts fresh for every new stage.
  - *(TBD)*: Correctly guessing a word may grant bonus time to the active timer depending on exact difficulty scaling requirements.
  - Failing to guess all words before the timer expires results in game over.
- **Scoring & Rewards:** 
  - There is no traditional point system. The player's **High Score** is exclusively the highest stage number they reach.
  - Completing stages rewards the player with **Coins**. Base payouts start at a fixed value (e.g., 10) and dynamically scale by +10% compounding for every subsequent stage (managed mathematically via `rewards.json`).

### 3.2 Word of the Day
- **Structure:** A daily puzzle synchronized to the UTC calendar time. It consists of exactly one stage identical for all players globally, utilizing an offline Seeded RNG based on the UTC Date integer.
- **Content:** The daily stage features an 8-letter master word and multiple smaller sub-words (e.g., three 5-letter words and two 4-letter words), all built from the same shared daily grid. Every word has its respective definition attached.
- **Rules:** 
  - **No Timer:** Players can play at their own leisure.
  - **Unlimited attempts:** No strike limit.
- **Completion:** Guessing all words in the sequence marks the daily challenge as complete, which then progresses the player's active Daily Streak.

## 4. Powerups, Hints & Economics
- **Coins:** The primary in-game currency. Earned exclusively by clearing stages in Arcade Mode or completing Word of the Day challenges. 
- **Powerups:** Coins can be spent mid-game to activate three distinct tactical advantages:
  1. **Shuffle:** Shuffles the order of the letters on the 16-tile grid.
  2. **Lightbulb:** Highlights a valid tile on the grid that is guaranteed to be part of the currently active word.
  3. **Lightning Bolt:** Instantly places one correct letter into a random empty slot for the currently active word.

## 5. Upcoming Features
- **Social Sharing:** Players will have the ability to format and share their Daily streaks and Arcade high scores on social platforms. UI/UX design to determine how this is visually represented.
