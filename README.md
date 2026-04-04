# YAWG: Yet Another Word Game

A premium, fast-paced word puzzle game that challenges your vocabulary and speed. Solve target words from dictionary definitions using a dynamic tile grid.

## 🚀 Built With

This project was developed using state-of-the-art agentic tools:
- **Google Antigravity**: Advanced AI coding assistant for rapid development and optimization.
- **Google Stitch**: Integrated development and deployment orchestration.
- **React + TypeScript + Vite**: Core frontend stack for high performance.
- **Zustand**: Lightweight, reactive state management.
- **Framer Motion**: For "Tactile Maximalism" and smooth, premium animations.
- **Capacitor**: Cross-platform bridge for mobile deployment.

---

## 🎮 Core Gameplay

YAWG flips the traditional word game formula. Instead of finding words from a random jumble, you are given **definitions** and must construct the correct words from a shared grid of letter tiles.

- **Non-Adjacent Selection**: Unlike Boggle, you can select tiles from anywhere on the grid in any order.
- **Dynamic Grids**: Stages feature variable grid layouts (up to 4x4) tailored to the word set.
- **No Penalty**: Focus on solving. There are no strike limits; keep trying until you find the right combination.

---

## 🕹️ Game Modes

### 🏆 Arcade Mode
Test your endurance and climb the global ranks.
- **Progression**: Advance through endless stages of increasing difficulty.
- **Difficulty Scaling**: Words are curated based on **CEFR tiers** (A1 to B2), ensuring a smooth but challenging learning curve.
- **Timer**: Every stage features a countdown. Solve all words to clear the stage and earn bonus time.
- **High Score**: Your score is the highest stage number reached.

### 📅 Word of the Day — *Coming Soon (maybe)*
A global, synchronized challenge for everyone.
- **Seeded RNG**: Every player worldwide gets the exact same grid and words every 24 hours.
- **Daily Streaks**: Complete the daily puzzle to build your streak and showcase your consistency.
- **Competitive Global Play**: No timer—just pure logic.

---

## ⚡ Power-Ups & Economy

Earn **Coins** by clearing stages and use them to activate tactical advantages:

| Power-Up | Cost | Action |
| :--- | :--- | :--- |
| **Shuffle** | 15 | Rearranges unselected tiles on the grid. |
| **Lightbulb** | 25 | Highlights a valid tile for the currently active word. |
| **Lightning Bolt** | 40 | Instantly places the next correct letter in its slot. |

---

## ✨ Design Philosophy: Tactile Maximalism

YAWG is built on the **"Premium Meta-Generic"** system. It leans into the familiar tropes of mobile gaming but executes them with "Hyper-Glossy" precision.

- **Depth Over Lines**: No 1px borders. Separation is achieved through tonal shifts and depth layering.
- **Chunky Interaction**: Buttons and tiles feel physical, with beveled edges and satisfying "press" animations.
- **Color Palette**: 
  - **Gold Standard** (`#e9c400`): Critical actions and victory.
  - **Mint of Success** (`#00e471`): Positive feedback.
  - **Deep Void** (`#111125`): The rich, near-black foundation.

---

## ⚙️ Technical Highlights

- **Grid Guarantee**: A custom algorithm ensures that every procedurally generated grid is mathematically guaranteed to contain all required words without expensive pathfinding.
- **Static Word Bank**: Features thousands of words from **Webster's Unabridged Dictionary**, indexed by CEFR difficulty for instant offline access.
- **UTC-Seeded PRNG**: Planned support for a date-based seed to synchronize global puzzles without a central server.

---

## 🛠️ Development

### Prerequisites
- **Node.js** (Latest LTS)
- **npm**

### Setup
```bash
npm install
npm run dev
```

### Building
```bash
# Web Build
npm run build

# Mobile Sync
npm run build:mobile
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
