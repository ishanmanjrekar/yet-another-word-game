import { create } from 'zustand';

/**
 * Word Bank Interfaces (Based on rules/json-schemas.md)
 */
export interface WordBankItem {
  word: string;
  definition: string;
}

export interface WordBank {
  // Key is wordLength (e.g., "4", "5", "8")
  [length: string]: {
    // Key is Difficulty Rating (1 to 6)
    [difficulty: string]: WordBankItem[];
  }
}

/**
 * Level Design Interfaces (Based on rules/json-schemas.md)
 */
export interface StageWordRequirement {
  wordLength: number;
  difficulty: number; // 1 = A1, 6 = C2
}

export interface StageConfig {
  grid: {
    rows: number;
    cols: number;
  };
  timer: number; // Starting time in seconds
  words: StageWordRequirement[];
}

export interface LevelDesign {
  stages: {
    // Key is the Stage Number (e.g., "1", "2")
    [stageNumber: string]: StageConfig;
  }
}

/**
 * Rewards Config Interface (Based on rules/json-schemas.md)
 */
export interface RewardsConfig {
  arcade: {
    baseCoinPayout: number;
    compoundGrowthPercent: number;
  };
  wordOfTheDay: {
    fixedPayout: number;
  }
}

/**
 * Game State Store
 */
type GameModeState = 'menu' | 'playing' | 'paused' | 'gameover';

interface GameState {
  // --- State ---
  coins: number;
  activeStage: number;
  wordBank: WordBank | null;
  levelDesign: LevelDesign | null;

  // New Game Loop State
  gameState: GameModeState;
  stageWords: WordBankItem[];
  gridLetters: string[];
  selectedIndices: number[];
  activeWordIndex: number;
  completedWords: number[];
  
  // --- Actions ---
  incrementCoins: (amount: number) => void;
  changeStage: (stage: number) => void;
  setWordBank: (data: WordBank) => void;
  setLevelDesign: (data: LevelDesign) => void;
  resetGame: () => void;
  
  // New Actions
  setGameState: (state: GameModeState) => void;
  initStage: (words: WordBankItem[], grid: string[]) => void;
  selectTile: (index: number) => void;
  clearSelection: () => void;
  nextWord: () => void;
  prevWord: () => void;
  markWordComplete: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  // Defaults
  coins: 0,
  activeStage: 1,
  wordBank: null,
  levelDesign: null,
  gameState: 'menu',
  stageWords: [],
  gridLetters: [],
  selectedIndices: [],
  activeWordIndex: 0,
  completedWords: [],

  // Actions
  incrementCoins: (amount) => 
    set((state) => ({ coins: state.coins + amount })),

  changeStage: (stage) => 
    set({ activeStage: stage }),

  setWordBank: (data) => 
    set({ wordBank: data }),

  setLevelDesign: (data) => 
    set({ levelDesign: data }),

  resetGame: () => 
    set({ 
      coins: 0, 
      activeStage: 1, 
      gameState: 'menu', 
      stageWords: [], 
      gridLetters: [], 
      selectedIndices: [], 
      activeWordIndex: 0, 
      completedWords: [] 
    }),

  setGameState: (stateName) =>
    set({ gameState: stateName }),

  initStage: (words, grid) =>
    set({ stageWords: words, gridLetters: grid, selectedIndices: [], activeWordIndex: 0, completedWords: [] }),

  selectTile: (index) =>
    set((state) => ({
      selectedIndices: state.selectedIndices.includes(index)
        ? state.selectedIndices.filter(i => i !== index)
        : [...state.selectedIndices, index]
    })),

  clearSelection: () =>
    set({ selectedIndices: [] }),

  nextWord: () =>
    set((state) => ({ activeWordIndex: (state.activeWordIndex + 1) % state.stageWords.length, selectedIndices: [] })),

  prevWord: () =>
    set((state) => ({ activeWordIndex: (state.activeWordIndex - 1 + state.stageWords.length) % state.stageWords.length, selectedIndices: [] })),

  markWordComplete: () =>
    set((state) => {
      // automatically move to next uncompleted word? For now just mark complete.
      return { completedWords: [...state.completedWords, state.activeWordIndex], selectedIndices: [] }
    }),
}));
