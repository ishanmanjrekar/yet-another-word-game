import { create } from 'zustand';
import { generateStage } from '../utils/gridGeneration';

export interface WordBankItem {
  word: string;
  definition: string;
  difficulty: number;
}

export interface WordBank {
  [length: string]: WordBankItem[];
}

export interface StageWordRequirement {
  wordLength: number;
  difficulty: number;
}

export interface StageConfig {
  grid: {
    rows: number;
    cols: number;
  };
  timer: number;
  words: StageWordRequirement[];
}

export interface LevelDesign {
  stages: {
    [stageNumber: string]: StageConfig;
  }
}

export interface EconomyConfig {
  powerups: {
    shuffle: { cost: number; unlocked: boolean };
    hint: { cost: number; unlocked: boolean };
    lightning: { cost: number; unlocked: boolean };
  };
  rewards: {
    baseCoinPayout: number;
    compoundGrowthPercent: number;
  };
}

type GameModeState = 'menu' | 'stageStart' | 'playing' | 'paused' | 'gameover' | 'stageClear';

interface GameState {
  coins: number;
  activeStage: number;
  wordBank: WordBank | null;
  levelDesign: LevelDesign | null;
  economy: EconomyConfig | null;

  gameState: GameModeState;
  stageWords: WordBankItem[];
  gridLetters: string[];
  selectedIndices: (number | null)[];
  activeWordIndex: number;
  completedWords: number[];
  highlightedIndices: number[];
  
  incrementCoins: (amount: number) => void;
  changeStage: (stage: number) => void;
  setWordBank: (data: WordBank) => void;
  setLevelDesign: (data: LevelDesign) => void;
  setEconomy: (data: EconomyConfig) => void;
  resetGame: () => void;
  
  setGameState: (state: GameModeState) => void;
  initStage: (words: WordBankItem[], grid: string[]) => void;
  selectTile: (index: number) => void;
  deselectSlot: (pos: number) => void;
  clearSelection: () => void;
  nextWord: () => void;
  prevWord: () => void;
  executeShuffle: () => void;
  executeHint: () => void;
  executeLightning: () => void;
  completeStage: () => void;
  advanceToNextStage: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  coins: 0,
  activeStage: 1,
  wordBank: null,
  levelDesign: null,
  economy: null,
  gameState: 'menu',
  stageWords: [],
  gridLetters: [],
  selectedIndices: [], // Initial state, will be set on stage init
  activeWordIndex: 0,
  completedWords: [],
  highlightedIndices: [],

  incrementCoins: (amount) => 
    set((state) => ({ coins: state.coins + amount })),

  changeStage: (stage) => 
    set({ activeStage: stage }),

  setWordBank: (data) => 
    set({ wordBank: data }),

  setLevelDesign: (data) => 
    set({ levelDesign: data }),

  setEconomy: (data) =>
    set({ economy: data }),

  resetGame: () => 
    set({ 
      coins: 0, 
      activeStage: 1, 
      gameState: 'menu', 
      stageWords: [], 
      gridLetters: [], 
      selectedIndices: [], 
      activeWordIndex: 0, 
      completedWords: [],
      highlightedIndices: []
    }),

  setGameState: (stateName) =>
    set({ gameState: stateName }),

  initStage: (words, grid) => {
    const firstWordLen = words[0].word.length;
    set({ 
      stageWords: words, 
      gridLetters: grid, 
      selectedIndices: new Array(firstWordLen).fill(null), 
      activeWordIndex: 0, 
      completedWords: [], 
      highlightedIndices: [] 
    });
  },

  selectTile: (index) =>
    set((state) => {
      if (state.completedWords.includes(state.activeWordIndex)) return {};
      
      const activeWord = state.stageWords[state.activeWordIndex].word;
      const newIndices = [...state.selectedIndices];
      
      const existingPos = newIndices.indexOf(index);
      if (existingPos !== -1) {
        // Toggle Off: remove from slot
        newIndices[existingPos] = null;
      } else {
        // Find first empty slot
        const firstEmpty = newIndices.indexOf(null);
        if (firstEmpty === -1) return {}; // All slots filled
        newIndices[firstEmpty] = index;
      }

      let newlyCompleted = [...state.completedWords];
      let newCoins = state.coins;
      let newGameState = state.gameState;
      let finalIndices = newIndices;

      // Check if word is complete (all slots filled)
      if (newIndices.every(idx => idx !== null)) {
         const spelledWord = newIndices.map(idx => state.gridLetters[idx!]).join('');
         if (spelledWord.toUpperCase() === activeWord.toUpperCase()) {
            newlyCompleted.push(state.activeWordIndex);
            
            // Clear current selection for the finished word
            finalIndices = finalIndices.map(() => null);
            
            if (newlyCompleted.length === state.stageWords.length) {
                // We'll let the GameBoard handle the delay before setting state to 'stageClear'
                // and awarding coins via a new action
            }
         }
      }

      return {
          selectedIndices: finalIndices,
          completedWords: newlyCompleted,
          coins: newCoins,
          gameState: newGameState,
          highlightedIndices: state.highlightedIndices
      };
    }),

  deselectSlot: (pos) =>
    set((state) => {
      if (state.completedWords.includes(state.activeWordIndex)) return {};
      const newIndices = [...state.selectedIndices];
      newIndices[pos] = null;
      return { selectedIndices: newIndices };
    }),

  clearSelection: () =>
    set((state) => ({ 
      selectedIndices: state.selectedIndices.map(() => null) 
    })),

  nextWord: () =>
    set((state) => {
      const nextIdx = Math.min(state.activeWordIndex + 1, state.stageWords.length - 1);
      const nextWordLen = state.stageWords[nextIdx].word.length;
      return { 
        activeWordIndex: nextIdx, 
        selectedIndices: new Array(nextWordLen).fill(null), 
        highlightedIndices: [] 
      };
    }),

  prevWord: () =>
    set((state) => {
      const prevIdx = Math.max(state.activeWordIndex - 1, 0);
      const prevWordLen = state.stageWords[prevIdx].word.length;
      return { 
        activeWordIndex: prevIdx, 
        selectedIndices: new Array(prevWordLen).fill(null), 
        highlightedIndices: [] 
      };
    }),

  executeShuffle: () =>
    set((state) => {
      if (!state.economy || state.coins < state.economy.powerups.shuffle.cost) return {};
      // Filter out nulls from selectedIndices for shuffle safety
      const filteredSelected = state.selectedIndices.filter((idx): idx is number => idx !== null);
      const unselected = state.gridLetters.map((_, i) => i).filter(i => !filteredSelected.includes(i));
      const chars = unselected.map(i => state.gridLetters[i]);
      
      for (let i = chars.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [chars[i], chars[j]] = [chars[j], chars[i]];
      }
      
      const newGrid = [...state.gridLetters];
      unselected.forEach((index, count) => {
        newGrid[index] = chars[count];
      });
      return { 
        coins: state.coins - state.economy.powerups.shuffle.cost, 
        gridLetters: newGrid 
      };
    }),

  executeHint: () =>
    set((state) => {
      if (!state.economy || state.coins < state.economy.powerups.hint.cost) return {};
      
      const activeWord = state.stageWords[state.activeWordIndex].word.toUpperCase();
      
      // Calculate which characters still need to be satisfied by selection or highlight
      const charCounts: Record<string, number> = {};
      for (const char of activeWord) {
        charCounts[char] = (charCounts[char] || 0) + 1;
      }
      
      // Chars already addressed (filter out nulls from selectedIndices)
      const filteredSelected = state.selectedIndices.filter((idx): idx is number => idx !== null);
      const addressedIndices = [...filteredSelected, ...state.highlightedIndices];
      
      for (const idx of addressedIndices) {
        const char = state.gridLetters[idx].toUpperCase();
        if (charCounts[char] !== undefined && charCounts[char] > 0) {
          charCounts[char]--;
        }
      }
      
      // Identify needed characters
      const neededChars = Object.keys(charCounts).filter(char => charCounts[char] > 0);
      if (neededChars.length === 0) return {};
      
      // Search the grid for letters that are part of the needed set but not yet used
      const candidates = state.gridLetters.reduce((acc: number[], char, idx) => {
        const upperChar = char.toUpperCase();
        if (neededChars.includes(upperChar) && !addressedIndices.includes(idx)) {
          acc.push(idx);
        }
        return acc;
      }, []);
      
      if (candidates.length === 0) return {};
 
      const randomTarget = candidates[Math.floor(Math.random() * candidates.length)];
      return {
        coins: state.coins - state.economy.powerups.hint.cost,
        highlightedIndices: [...state.highlightedIndices, randomTarget]
      };
    }),

  executeLightning: () =>
    set((state) => {
      if (!state.economy || state.coins < state.economy.powerups.lightning.cost) return {};
      
      const activeWord = state.stageWords[state.activeWordIndex].word.toUpperCase();
      const currentIndices = [...state.selectedIndices];
      
      // 1. Identify eligible slots (missing or incorrect) and already correct tiles
      const eligibleSlots: number[] = [];
      const correctlyPlacedIndices: number[] = [];
      
      for (let i = 0; i < activeWord.length; i++) {
        const tileIdx = currentIndices[i];
        if (tileIdx === null) {
          eligibleSlots.push(i);
        } else {
          const char = state.gridLetters[tileIdx].toUpperCase();
          if (char === activeWord[i]) {
            correctlyPlacedIndices.push(tileIdx);
          } else {
            eligibleSlots.push(i);
          }
        }
      }
      
      if (eligibleSlots.length === 0) return {};
      
      // 2. Pick a random eligible slot and the needed character
      const targetSlotPos = eligibleSlots[Math.floor(Math.random() * eligibleSlots.length)];
      const neededChar = activeWord[targetSlotPos];
      
      // 3. Find available tiles in the grid that match neededChar and aren't correctly placed
      const gridCandidates = state.gridLetters.reduce((acc: number[], char, idx) => {
        if (char.toUpperCase() === neededChar && !correctlyPlacedIndices.includes(idx)) {
          acc.push(idx);
        }
        return acc;
      }, []);
      
      if (gridCandidates.length === 0) return {};
      
      const targetGridIndex = gridCandidates[Math.floor(Math.random() * gridCandidates.length)];
      
      // 4. Update the board
      // If this specific tile was already in another (incorrect) slot, vacate that slot first
      const existingOtherPos = currentIndices.indexOf(targetGridIndex);
      if (existingOtherPos !== -1) {
        currentIndices[existingOtherPos] = null;
      }
      
      currentIndices[targetSlotPos] = targetGridIndex;
 
      // 5. Completion Check
      let newlyCompleted = [...state.completedWords];
      let newCoins = state.coins - state.economy.powerups.lightning.cost;
      let newGameState = state.gameState;
      let finalIndices = currentIndices;
 
      if (currentIndices.every(idx => idx !== null)) {
         const spelledWord = currentIndices.map(idx => state.gridLetters[idx!]).join('');
         if (spelledWord.toUpperCase() === activeWord.toUpperCase()) {
            newlyCompleted.push(state.activeWordIndex);
            finalIndices = finalIndices.map(() => null);
            if (newlyCompleted.length === state.stageWords.length) {
                // We'll let the GameBoard handle the delay
            }
         }
      }
 
      return {
        selectedIndices: finalIndices,
        completedWords: newlyCompleted,
        coins: newCoins,
        gameState: newGameState
      };
    }),
 
  completeStage: () =>
    set((state) => {
      if (state.gameState === 'stageClear') return {};
      const reward = state.economy?.rewards.baseCoinPayout || 50;
      return {
        coins: state.coins + reward,
        gameState: 'stageClear'
      };
    }),

  advanceToNextStage: () =>
    set((state) => {
      if (!state.levelDesign || !state.wordBank) return {};
      
      const nextStageNum = state.activeStage + 1;
      const stageConfig = state.levelDesign.stages[nextStageNum.toString()];
      
      if (!stageConfig) {
        return { gameState: 'menu' };
      }

      try {
        const { selectedWords, grid } = generateStage(stageConfig, state.wordBank, new Set());
        const firstWordLen = selectedWords[0].word.length;
        
        return {
          activeStage: nextStageNum,
          gameState: 'stageStart',
          stageWords: selectedWords,
          gridLetters: grid,
          selectedIndices: new Array(firstWordLen).fill(null),
          activeWordIndex: 0,
          completedWords: [],
          highlightedIndices: []
        };
      } catch (e) {
        console.error('Failed to generate next stage:', e);
        return { gameState: 'menu' };
      }
    })
}));
