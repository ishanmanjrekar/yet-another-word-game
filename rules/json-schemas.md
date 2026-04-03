# YAWG: JSON Data Schemas

This document defines the exact data interfaces required for the procedural generation and gameplay mechanics.

## 1. `word-bank.json`
Generated directly by the offline vocabulary script. It acts as a static local database. It is keyed by word length.

```typescript
interface WordBankItem {
  word: string;
  definition: string;
  difficulty: number; // 1 = A1, 2 = A2, 3 = B1, 4 = B2
}

interface WordBank {
  // Key is wordLength (e.g., "3", "4", "8")
  [length: string]: WordBankItem[];
}
```

## 2. `level-design.json`
Controls the flow and configuration of the Arcade stages.

```typescript
interface StageWordRequirement {
  wordLength: number;
  difficulty: number; // 1 = A1, 4 = B2
}

interface StageConfig {
  grid: {
    rows: number;
    cols: number;
  };
  timer: number; // Starting time in seconds
  words: StageWordRequirement[];
}

interface LevelDesign {
  stages: {
    // Key is the Stage Number (e.g., "1", "2")
    [stageNumber: string]: StageConfig;
  }
}
```

## 3. `rewards.json`
Dictates the internal base economy.

```typescript
interface RewardsConfig {
  arcade: {
    baseCoinPayout: number; // Value for Stage 1
    compoundGrowthPercent: number; // e.g., 0.1 for 10%
  };
  wordOfTheDay: {
    fixedPayout: number;
  }
}
```
