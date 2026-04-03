import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
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
    highlight: { cost: number; unlocked: boolean };
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
  selectedIndices: (number | null)[][];
  activeWordIndex: number;
  completedWords: number[];
  highlightedIndices: number[][];
  highScore: number;
  usedWords: string[];
  
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
  executeHighlight: () => void;
  executeLightning: () => void;
  completeStage: () => void;
  advanceToNextStage: () => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      coins: 0,
      activeStage: 1,
      wordBank: null,
      levelDesign: null,
      economy: null,
      gameState: 'menu',
      stageWords: [],
      gridLetters: [],
      selectedIndices: [], 
      activeWordIndex: 0,
      completedWords: [],
      highlightedIndices: [],
      highScore: 0,
      usedWords: [],

      incrementCoins: (amount) => 
        set((state) => ({ coins: state.coins + amount })),

      changeStage: (stage) => 
        set((state) => ({ 
          activeStage: stage,
          usedWords: stage === 1 ? [] : state.usedWords 
        })),

      setWordBank: (data) => 
        set({ wordBank: data }),

      setLevelDesign: (data) => 
        set({ levelDesign: data }),

      setEconomy: (data) =>
        set({ economy: data }),

      resetGame: () => 
        set({ 
          activeStage: 1, 
          gameState: 'menu', 
          stageWords: [], 
          gridLetters: [], 
          selectedIndices: [], 
          activeWordIndex: 0, 
          completedWords: [],
          highlightedIndices: [],
          usedWords: []
        }),

      setGameState: (stateName) =>
        set({ gameState: stateName }),

      initStage: (words, grid) => {
        set((state) => ({ 
          stageWords: words, 
          gridLetters: grid, 
          selectedIndices: words.map(w => new Array(w.word.length).fill(null)), 
          activeWordIndex: 0, 
          completedWords: [], 
          highlightedIndices: words.map(() => []),
          usedWords: [...state.usedWords, ...words.map(w => w.word)],
          highScore: Math.max(state.highScore, 1)
        }));
      },

      selectTile: (index) =>
    set((state) => {
      if (state.completedWords.includes(state.activeWordIndex)) return {};
      
      const activeWord = state.stageWords[state.activeWordIndex].word;
      const currentSelected = [...state.selectedIndices[state.activeWordIndex]];
      
      const existingPos = currentSelected.indexOf(index);
      if (existingPos !== -1) {
        // Toggle Off: remove from slot
        currentSelected[existingPos] = null;
      } else {
        // Find first empty slot
        const firstEmpty = currentSelected.indexOf(null);
        if (firstEmpty === -1) return {}; // All slots filled
        currentSelected[firstEmpty] = index;
      }

      let newlyCompleted = [...state.completedWords];
      let finalCurrentSelected = currentSelected;

      // Check if word is complete (all slots filled)
      if (currentSelected.every(idx => idx !== null)) {
         const spelledWord = currentSelected.map(idx => state.gridLetters[idx!]).join('');
         if (spelledWord.toUpperCase() === activeWord.toUpperCase()) {
            newlyCompleted.push(state.activeWordIndex);
            // Clear current selection for the finished word
            finalCurrentSelected = finalCurrentSelected.map(() => null);
         }
      }

      const newSelectedIndices = [...state.selectedIndices];
      newSelectedIndices[state.activeWordIndex] = finalCurrentSelected;

      return {
          selectedIndices: newSelectedIndices,
          completedWords: newlyCompleted
      };
    }),

  deselectSlot: (pos) =>
    set((state) => {
      if (state.completedWords.includes(state.activeWordIndex)) return {};
      const newSelectedIndices = [...state.selectedIndices];
      const currentWordSelected = [...newSelectedIndices[state.activeWordIndex]];
      currentWordSelected[pos] = null;
      newSelectedIndices[state.activeWordIndex] = currentWordSelected;
      return { selectedIndices: newSelectedIndices };
    }),

  clearSelection: () =>
    set((state) => {
      const newSelectedIndices = [...state.selectedIndices];
      newSelectedIndices[state.activeWordIndex] = newSelectedIndices[state.activeWordIndex].map(() => null);
      return { 
        selectedIndices: newSelectedIndices 
      };
    }),

  nextWord: () =>
    set((state) => ({ 
      activeWordIndex: Math.min(state.activeWordIndex + 1, state.stageWords.length - 1)
    })),

  prevWord: () =>
    set((state) => ({ 
      activeWordIndex: Math.max(state.activeWordIndex - 1, 0)
    })),

  executeShuffle: () =>
    set((state) => {
      if (!state.economy || state.coins < state.economy.powerups.shuffle.cost) return {};
      
      // All selected and highlighted indices across all words should be held static
      const allSelected = state.selectedIndices.flatMap(row => row.filter((idx): idx is number => idx !== null));
      const allHighlighted = state.highlightedIndices.flat();
      const heldStatic = [...new Set([...allSelected, ...allHighlighted])];
      
      const unselectedIndices = state.gridLetters.map((_, i) => i).filter(i => !heldStatic.includes(i));
      
      const charsToShuffle = unselectedIndices.map(i => state.gridLetters[i]);
      for (let i = charsToShuffle.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [charsToShuffle[i], charsToShuffle[j]] = [charsToShuffle[j], charsToShuffle[i]];
      }
      
      const newGrid = [...state.gridLetters];
      unselectedIndices.forEach((index, count) => {
        newGrid[index] = charsToShuffle[count];
      });

      return { 
        coins: state.coins - state.economy.powerups.shuffle.cost, 
        gridLetters: newGrid 
      };
    }),

  executeHighlight: () =>
    set((state) => {
      if (!state.economy || state.coins < state.economy.powerups.highlight.cost) return {};
      
      const activeWord = state.stageWords[state.activeWordIndex].word.toUpperCase();
      
      // Calculate which characters still need to be satisfied by selection or highlight
      const charCounts: Record<string, number> = {};
      for (const char of activeWord) {
        charCounts[char] = (charCounts[char] || 0) + 1;
      }
      
      // Chars already addressed (filter out nulls from selectedIndices)
      const currentWordSelected = state.selectedIndices[state.activeWordIndex].filter((idx): idx is number => idx !== null);
      const currentWordHighlighted = state.highlightedIndices[state.activeWordIndex];
      const addressedIndices = [...currentWordSelected, ...currentWordHighlighted];
      
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
      const newHighlightedIndices = [...state.highlightedIndices];
      newHighlightedIndices[state.activeWordIndex] = [...currentWordHighlighted, randomTarget];

      return {
        coins: state.coins - state.economy.powerups.highlight.cost,
        highlightedIndices: newHighlightedIndices
      };
    }),

  executeLightning: () =>
    set((state) => {
      if (!state.economy || state.coins < state.economy.powerups.lightning.cost) return {};
      
      const activeWord = state.stageWords[state.activeWordIndex].word.toUpperCase();
      const currentWordSelected = [...state.selectedIndices[state.activeWordIndex]];
      
      // 1. Identify eligible slots (missing or incorrect) and already correct tiles
      const eligibleSlots: number[] = [];
      const correctlyPlacedIndices: number[] = [];
      
      for (let i = 0; i < activeWord.length; i++) {
        const tileIdx = currentWordSelected[i];
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
      const existingOtherPos = currentWordSelected.indexOf(targetGridIndex);
      if (existingOtherPos !== -1) {
        currentWordSelected[existingOtherPos] = null;
      }
      
      currentWordSelected[targetSlotPos] = targetGridIndex;
 
      // 5. Completion Check
      let newlyCompleted = [...state.completedWords];
      let finalWordSelected = currentWordSelected;
 
      if (currentWordSelected.every(idx => idx !== null)) {
         const spelledWord = currentWordSelected.map(idx => state.gridLetters[idx!]).join('');
         if (spelledWord.toUpperCase() === activeWord.toUpperCase()) {
            newlyCompleted.push(state.activeWordIndex);
            finalWordSelected = finalWordSelected.map(() => null);
         }
      }
 
      const newSelectedIndices = [...state.selectedIndices];
      newSelectedIndices[state.activeWordIndex] = finalWordSelected;

      return {
        selectedIndices: newSelectedIndices,
        completedWords: newlyCompleted,
        coins: state.coins - state.economy.powerups.lightning.cost
      };
    }),
 
  completeStage: () =>
    set((state) => {
      if (state.gameState === 'stageClear') return {};
      
      const base = state.economy?.rewards.baseCoinPayout || 10;
      const growth = (state.economy?.rewards.compoundGrowthPercent || 10) / 100;
      
      let reward = base;
      for (let i = 1; i < state.activeStage; i++) {
        reward = Math.floor(reward * (1 + growth));
      }

      return {
        coins: state.coins + reward,
        gameState: 'stageClear',
        highScore: Math.max(state.highScore, state.activeStage + 1)
      };
    }),

  advanceToNextStage: () =>
    set((state) => {
      if (!state.levelDesign || !state.wordBank) return {};
      
      const nextStageNum = state.activeStage + 1;
      const stages = state.levelDesign.stages;
      const definedStageNums = Object.keys(stages).map(Number).sort((a, b) => a - b);
      const maxStages = definedStageNums[definedStageNums.length - 1] || 0;
      
      let lookupId = nextStageNum.toString();
      if (nextStageNum > maxStages && maxStages > 0) {
        const loopSize = Math.min(10, maxStages);
        const loopStart = maxStages - loopSize + 1;
        const offset = (nextStageNum - loopStart) % loopSize;
        lookupId = (loopStart + offset).toString();
      }

      const stageConfig = stages[lookupId];
      
      if (!stageConfig) {
        return { gameState: 'menu' };
      }

      try {
        const history = new Set(state.usedWords);
        const { selectedWords, grid } = generateStage(stageConfig, state.wordBank, history);
        return {
          activeStage: nextStageNum,
          gameState: 'stageStart',
          stageWords: selectedWords,
          gridLetters: grid,
          selectedIndices: selectedWords.map(w => new Array(w.word.length).fill(null)),
          activeWordIndex: 0,
          completedWords: [],
          highlightedIndices: selectedWords.map(() => []),
          usedWords: Array.from(history)
        };
      } catch (e) {
        console.error('Failed to generate next stage:', e);
        return { gameState: 'menu' };
      }
    })
  }),
  {
    name: 'yawg-game-storage',
    storage: createJSONStorage(() => localStorage),
    partialize: (state) => ({ 
      coins: state.coins, 
      activeStage: state.activeStage,
      highScore: state.highScore,
      usedWords: state.usedWords
    }),
  }
));
