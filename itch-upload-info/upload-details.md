# 🎮 YAWG: Yet Another Word Game 🎮

> A premium, fast-paced word puzzle game that challenges your vocabulary and speed.

## 📝 Introduction

I built **YAWG** (Yet Another Word Game) as a technical experiment in AI-assisted development and rapid scalability. The goal was to explore the speed of building a robust, high-performance web game from scratch by leaning into tools like **Google Antigravity** and **Google Stitch**.

The project focuses on technical flexibility and long-term maintenance. The system is built to support **over-the-air (OTA) game balancing tweaks**, allowing for remote adjustments to word difficulty, economy scaling, and level designs without a full update. 

The underlying architecture is built for stability and efficiency, featuring a zero-API, offline-first lexicon and mathematical constraints designed to ensure every game board is solvable without expensive pathfinding or retries.

## 🕹️ Controls

*   **Selection:** Click, Tap, or use your **Keyboard** to pick letters from the grid.
*   **Submission:** The game automatically checks your word once you've filled the slots.
*   **Toggle:** Click the definition area (or use Tab) to switch between unsolved words in a stage.

## ✨ Features

*   **Arcade Mode:** Survive through endless stages of increasing difficulty.
*   **Power-Ups:** 
    *   **Shuffle:** Rearrange the unselected tiles when you're stuck.
    *   **Lightbulb:** Get a tactical highlight of a correct letter.
    *   **Lightning Bolt:** Instantly place the next correct letter in its slot.
*   **Word of the Day:** (Coming Soon, maybe) A shared daily puzzle challenge for everyone worldwide.

## 📜 Rules / How to Play

*   **The Hook:** You are given dictionary definitions and a grid of tiles. Your job is to construct the target words using any letters from the grid.
*   **Freeform Selection:** Unlike Boggle, you can select tiles from anywhere on the grid in any order.
*   **No "Strikes":** There are no strike limits or "lives," allowing you to experiment with letters freely. Just keep an eye on the stage timer in Arcade mode!
*   **CEFR-Inspired:** Word selection is guided by CEFR difficulty tiers (A1 to B2) for a smoother progression.

## 🤖 Disclaimer / Credits

This project was developed with a heavy focus on agentic AI orchestration:
*   **AI Pair Programming:** Built using **Google Antigravity** and **Google Stitch**.
*   **Lexicon:** Built using **Webster's Unabridged Dictionary** with **AI-assisted** definitions for clarity.
*   **Engine:** React + TypeScript + Vite.
*   **Animations:** Framer Motion (exploring interaction depth).

I hope you enjoy solving these as much as I enjoyed building the system behind them!
