import React, { useState, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { useInterval } from '../hooks/useInterval';
import { Tile } from '../components/ui/Tile';
import { StageStartOverlay } from '../components/ui/StageStartOverlay';
import { StageSuccessOverlay } from '../components/ui/StageSuccessOverlay';
import { motion, AnimatePresence } from 'framer-motion';

export const GameBoard: React.FC = () => {
  const {
    coins,
    levelDesign,
    activeStage,
    stageWords,
    gridLetters,
    selectedIndices,
    activeWordIndex,
    selectTile,
    deselectSlot,
    clearSelection,
    completedWords,
    highlightedIndices,
    nextWord,
    prevWord,
    goToNextUnsolved,
    setGameState,
    gameState,
    economy,
    executeShuffle,
    executeHighlight,
    executeLightning,
    completeStage,
    advanceToNextStage
  } = useGameStore((state) => state);

  const [activeTooltip, setActiveTooltip] = useState<'shuffle' | 'highlight' | 'lightning' | null>(null);
  const [feedback, setFeedback] = useState<{ message: string; id: number } | null>(null);
  const [prevCompletedCount, setPrevCompletedCount] = useState(0);
  const [isShuffling, setIsShuffling] = useState(false);

  const handleShuffleAction = () => {
    if (isShuffling) return;
    setIsShuffling(true);
    // Phase 1: Converge to center
    setTimeout(() => {
      executeShuffle();
      // Phase 2: Spread back out with new letters
      setTimeout(() => {
        setIsShuffling(false);
      }, 100);
    }, 450);
  };

  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (levelDesign) {
      const stageConfig = levelDesign.stages[activeStage.toString()];
      if (stageConfig) {
        setTimeLeft(stageConfig.timer);
      }
    }
  }, [levelDesign, activeStage]);

  useInterval(() => {
    setTimeLeft(t => {
      if (t <= 1) {
        setGameState('gameover');
        return 0;
      }
      return t - 1;
    });
  }, gameState === 'playing' ? 1000 : null);
  
  // Auto-transition logic with delay
  useEffect(() => {
    const isCompleted = completedWords.includes(activeWordIndex);
    const allWordsCompleted = completedWords.length === stageWords.length;
    
    if (isCompleted && !allWordsCompleted) {
      const timer = setTimeout(() => {
        goToNextUnsolved();
      }, 1000);
      return () => clearTimeout(timer);
    } else if (allWordsCompleted && gameState === 'playing') {
      const timer = setTimeout(() => {
        completeStage();
      }, 1500); // 1.5s delay to show final word
      return () => clearTimeout(timer);
    }
  }, [completedWords, activeWordIndex, stageWords.length, nextWord, gameState, completeStage]);
  
  // Keyboard Support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== 'playing') return;
      
      const key = e.key.toUpperCase();
      
      // Handle Backspace: remove last letter
      if (e.key === 'Backspace') {
        const lastFilledSlot = [...selectedIndices[activeWordIndex]].reverse().findIndex(idx => idx !== null);
        if (lastFilledSlot !== -1) {
          const actualIndex = selectedIndices[activeWordIndex].length - 1 - lastFilledSlot;
          deselectSlot(actualIndex);
        }
        return;
      }
      
      // Handle Escape: clear selection
      if (e.key === 'Escape') {
        clearSelection();
        return;
      }
      
      // Handle A-Z letters
      if (/^[A-Z]$/.test(key)) {
        const indices = gridLetters.map((char, i) => char.toUpperCase() === key ? i : -1).filter(i => i !== -1);
        if (indices.length === 0) return;
        
        const currentSelectedForWord = selectedIndices[activeWordIndex] || [];
        const availableIndex = indices.find(idx => !currentSelectedForWord.includes(idx));
        
        if (availableIndex !== undefined) {
          // Select next available
          selectTile(availableIndex);
        } else {
          // If all are selected, deselect the last one found in the grid to simulate toggle
          const lastSelectedIndex = indices[indices.length - 1];
          selectTile(lastSelectedIndex);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, gridLetters, selectedIndices, activeWordIndex, selectTile, deselectSlot, clearSelection]);

  const activeWordObj = stageWords[activeWordIndex];

  // Feedback check
  useEffect(() => {
    if (completedWords.length > prevCompletedCount) {
      const isFinalLevelWord = completedWords.length === stageWords.length;
      
      if (!isFinalLevelWord) {
        const messages = ["Great", "Good", "Nice", "Wow", "Perfect", "Cool"];
        const randomMsg = messages[Math.floor(Math.random() * messages.length)];
        const bonus = economy?.rewards.timerBonusPerWord || 10;
        
        setFeedback({ message: randomMsg, id: Date.now() });
        setTimeLeft(t => t + bonus);
      }
      setPrevCompletedCount(completedWords.length);
    } else if (completedWords.length < prevCompletedCount) {
      setPrevCompletedCount(completedWords.length);
    }
  }, [completedWords.length, prevCompletedCount, economy]);

  const stageConfig = levelDesign?.stages[activeStage.toString()];
  const gridCols = stageConfig?.grid.cols || 4;

  if (!activeWordObj) return <div className="flex bg-[#161625] h-screen w-full text-white items-center justify-center font-headline text-2xl">Loading...</div>;
  
  const formatDefinition = (def: string) => {
    const semiIndex = def.indexOf(';');
    if (semiIndex !== -1) {
      return def.substring(0, semiIndex).trim() + '.';
    }
    return def;
  };

  const getDefinitionFontSize = (text: string) => {
    const len = text.length;
    if (len > 80) return 'text-[10px] sm:text-sm lg:text-base leading-[1.1] sm:leading-tight';
    if (len > 60) return 'text-[11px] sm:text-base lg:text-lg leading-tight';
    return 'text-xs sm:text-base lg:text-lg leading-tight';
  };

  const handleContinue = () => {
    advanceToNextStage();
  };

  const currentSelected = selectedIndices[activeWordIndex] || [];
  const currentHighlighted = highlightedIndices[activeWordIndex] || [];

  // Check if more highlights can be provided for the current word
  const isHighlightAvailable = (() => {
    if (!activeWordObj) return false;
    const activeWord = activeWordObj.word.toUpperCase();
    
    const charCounts: Record<string, number> = {};
    for (const char of activeWord) {
      charCounts[char] = (charCounts[char] || 0) + 1;
    }
    
    const addressedIndices = [...currentSelected, ...currentHighlighted].filter((idx): idx is number => idx !== null);
    for (const idx of addressedIndices) {
      const char = gridLetters[idx]?.toUpperCase();
      if (char && charCounts[char] !== undefined && charCounts[char] > 0) {
        charCounts[char]--;
      }
    }
    
    const neededChars = Object.keys(charCounts).filter((char: string) => charCounts[char] > 0);
    if (neededChars.length === 0) return false;
    
    return gridLetters.some((char: string, idx: number) => {
      const upperChar = char.toUpperCase();
      return neededChars.includes(upperChar) && !addressedIndices.includes(idx);
    });
  })();

  // Check if lightning can correct any slots
  const isLightningAvailable = (() => {
    if (!activeWordObj) return false;
    const activeWord = activeWordObj.word.toUpperCase();
    return currentSelected.some((tileIdx: number | null, i: number) => {
      if (tileIdx === null) return true;
      return gridLetters[tileIdx]?.toUpperCase() !== activeWord[i];
    });
  })();

  return (
    <div 
      onClick={() => setActiveTooltip(null)}
      className="flex flex-col h-full w-full bg-[#161625] overflow-hidden text-white font-body selection:bg-transparent tracking-wide absolute inset-0"
    >
      {/* Top Bar */}
      <div className="flex-none h-16 sm:h-20 px-4 sm:px-6 flex justify-between items-center z-10 border-b border-[#1f1f33]">
        {/* Pause Button */}
        <button onClick={() => setGameState('paused')} className="w-10 h-10 sm:w-[3.25rem] sm:h-[3.25rem] bg-[#2a2a4b] rounded-xl sm:rounded-2xl flex items-center justify-center border-b-[5px] border-[#18182b] active:border-b-0 active:translate-y-[5px] transition-all">
          <svg viewBox="0 0 24 24" className="w-5 h-5 sm:w-6 sm:h-6 text-primary fill-current"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
        </button>
        {/* Timer */}
        <div className={`font-headline text-4xl sm:text-[2.75rem] ${timeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-primary'}`} style={{ textShadow: '0 3px 0 #8c7600' }}>
          {Math.floor(timeLeft / 60).toString().padStart(2, '0')}:{(timeLeft % 60).toString().padStart(2, '0')}
        </div>
        {/* Coins Pill */}
        <div className="h-10 sm:h-[3.25rem] bg-[#2a2a4b] px-3 sm:px-4 rounded-full flex items-center justify-center gap-2 border-b-[5px] border-[#18182b]">
          <div className="w-5 h-5 sm:w-6 sm:h-6 bg-primary rounded-full text-black flex items-center justify-center font-headline text-sm sm:text-lg"><span className="-mt-0.5">$</span></div>
          <span className="font-headline text-lg sm:text-xl text-white mt-1">{coins.toLocaleString()}</span>
        </div>
      </div>

      {/* Main Containers */}
      <div className="flex-1 flex flex-col p-2 sm:p-5 gap-2 sm:gap-4 min-h-0 overflow-hidden text-base">
        
        {/* Upper Card: Definition & Progress */}
        <div className="bg-[#1d1d3d] rounded-2xl sm:rounded-[2rem] flex flex-col p-2 sm:p-4 shadow-xl shrink-0 relative">
          {/* Progress Dots */}
          <div className="flex justify-center items-center gap-1.5 sm:gap-3 mb-1 sm:mb-2 mt-0.5 h-3 sm:h-5">
            {stageWords.map((_: any, i: number) => {
              const isActive = i === activeWordIndex;
              const isComp = completedWords.includes(i);
              return isActive ? (
                <div key={i} className="w-2.5 h-2.5 sm:w-4 sm:h-4 rounded-full border-[2px] border-[#8a8a25] flex items-center justify-center relative">
                   <div className="absolute w-1 h-1 sm:w-2 sm:h-2 bg-primary rounded-full"></div>
                </div>
              ) : isComp ? (
                <div key={i} className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 bg-tertiary rounded-full flex items-center justify-center">
                  <svg className="w-2 h-2 text-black" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                </div>
              ) : (
                <div key={i} className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 bg-[#3b2b6b] rounded-full"></div>
              );
            })}
          </div>

          {/* Active Word Slots */}
          <div className="flex justify-center items-center gap-2 mb-1.5 sm:mb-3 h-8 sm:h-12 relative">
            <div className="flex justify-center gap-1 sm:gap-2">
              {currentSelected.map((tileIndex: number | null, i: number) => {
                const isCompleted = completedWords.includes(activeWordIndex);
                const targetChar = activeWordObj.word[i].toUpperCase();
                const currentChar = tileIndex !== null ? gridLetters[tileIndex].toUpperCase() : null;
                const isCorrect = currentChar === targetChar;
                const showSuccess = isCompleted || isCorrect;
                
                const displayedLetter = isCompleted 
                  ? activeWordObj.word[i] 
                  : (tileIndex !== null ? gridLetters[tileIndex] : '');
                
                return (
                  <div 
                    key={i} 
                    onClick={() => !isCompleted && tileIndex !== null && deselectSlot(i)}
                    className={`w-7 sm:w-10 h-8 sm:h-12 bg-[#111125] rounded-lg flex items-center justify-center font-headline text-lg sm:text-2xl shadow-inner relative overflow-hidden transition-all ${showSuccess ? 'border-2 border-tertiary shadow-[0_0_8px_rgba(0,228,113,0.4)]' : 'border border-white/5'} ${!isCompleted && tileIndex !== null ? 'cursor-pointer hover:bg-[#1a1a35] active:scale-95' : ''}`}
                  >
                    <span className={`text-[#77778b] absolute font-black tracking-tighter ${displayedLetter ? 'hidden' : 'block'}`}>_</span>
                    <span className={`${showSuccess ? 'text-tertiary' : 'text-primary'} uppercase ${displayedLetter ? 'block' : 'hidden'}`}>{displayedLetter}</span>
                  </div>
                );
              })}
            </div>
            
            <AnimatePresence>
              {feedback && (
                <motion.div
                  key={feedback.id}
                  initial={{ opacity: 0, scale: 0.8, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 1.1, y: -20 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  onAnimationComplete={() => {
                    const timer = setTimeout(() => setFeedback(null), 600);
                    return () => clearTimeout(timer);
                  }}
                  className="absolute -top-8 right-0 z-[60] flex flex-col items-end pointer-events-none select-none whitespace-nowrap"
                >
                  <span className="text-primary font-headline text-lg sm:text-2xl drop-shadow-[0_2px_0_rgba(0,0,0,0.4)] uppercase leading-none">
                    {feedback.message}
                  </span>
                  <span className="text-tertiary font-headline text-base sm:text-xl drop-shadow-[0_2px_0_rgba(0,0,0,0.4)] leading-none">
                    +{economy?.rewards.timerBonusPerWord || 10}s
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Definition Area */}
          <div className="flex flex-col justify-center mb-1.5 sm:mb-3 h-[3.25rem] sm:h-[4.5rem] overflow-hidden">
             <h3 className="tracking-[0.1em] text-[#dfb7ff] text-[0.65rem] sm:text-[0.75rem] uppercase font-headline mb-0.5 text-center opacity-70">
               DEFINITION
             </h3>
             <p className={`font-body tracking-wide text-center text-white px-2 break-words italic line-clamp-2 ${getDefinitionFontSize(formatDefinition(activeWordObj.definition))}`}>
               {formatDefinition(activeWordObj.definition)}
             </p>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between gap-1.5 sm:gap-4 mt-auto">
            <button 
              onClick={prevWord} 
              disabled={activeWordIndex === 0}
              className={`flex-1 bg-[#2a2a4b] text-[#dfb7ff] border-b-[3px] sm:border-b-[6px] border-[#18182b] active:border-b-0 active:translate-y-[3px] sm:active:translate-y-[6px] font-headline tracking-widest uppercase py-1 sm:py-3.5 rounded-lg sm:rounded-[1.25rem] transition-all text-[0.6rem] sm:text-sm ${activeWordIndex === 0 ? 'opacity-40 grayscale pointer-events-none' : ''}`}
            >
              PREVIOUS
            </button>
            <button 
              onClick={nextWord} 
              disabled={activeWordIndex === stageWords.length - 1}
              className={`flex-1 bg-primary text-[#554600] border-b-[3px] sm:border-b-[6px] border-[#b09400] active:border-b-0 active:translate-y-[3px] sm:active:translate-y-[6px] font-headline tracking-widest uppercase py-1 sm:py-3.5 rounded-lg sm:rounded-[1.25rem] transition-all text-[0.6rem] sm:text-sm ${activeWordIndex === stageWords.length - 1 ? 'opacity-40 grayscale pointer-events-none' : ''}`}
            >
              NEXT
            </button>
          </div>
        </div>

        {/* Lower Card: Grid & Powerups */}
        <div className="flex-1 min-h-0 flex flex-col justify-between bg-[#1d1d3d] rounded-2xl sm:rounded-[2rem] p-2.5 sm:p-5 shadow-xl overflow-hidden">
          {/* Grid Area */}
          <div className="flex-1 flex justify-center items-center min-h-0 w-full overflow-hidden relative">
            <div 
              className="grid gap-2 sm:gap-4 w-full max-w-[min(88vw,42vh)] aspect-square"
              style={{ gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))` }}

            >
              {gridLetters.map((char: string, index: number) => {
                const isSelected = currentSelected.includes(index);
                const isHighlighted = currentHighlighted.includes(index);
                
                const row = Math.floor(index / gridCols);
                const col = index % gridCols;
                const numRows = Math.ceil(gridLetters.length / gridCols);
                
                // Calculate directional offset to the center of the grid area
                // We use percentage-based estimation for responsiveness
                const xOffset = ((gridCols - 1) / 2 - col) * 100;
                const yOffset = ((numRows - 1) / 2 - row) * 100;

                return (
                  <motion.div 
                    key={index}
                    animate={isShuffling ? { 
                      x: xOffset, 
                      y: yOffset,
                      scale: 0.2,
                      rotate: 180,
                      opacity: 0.5
                    } : { 
                      x: 0, 
                      y: 0,
                      scale: 1,
                      rotate: 0,
                      opacity: 1
                    }}
                    transition={{
                      type: "spring",
                      stiffness: isShuffling ? 100 : 200,
                      damping: isShuffling ? 20 : 15,
                      mass: 0.8
                    }}
                    className="w-full h-full"
                  >
                    <Tile 
                      key={`${index}-${char}`}
                      letter={char} 
                      className="w-full h-full !text-[clamp(1.5rem,10vw,2.25rem)] pb-0 sm:pb-1"
                      isActive={isSelected} 
                      isHighlighted={isHighlighted}
                      onClick={() => !isShuffling && selectTile(index)} 
                    />
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Power up row */}
          <div className="flex justify-center items-center gap-4 sm:gap-8 mt-2 shrink-0 pb-1">
            {/* Shuffle Tooltip & Button */}
            <div className="relative flex flex-col items-center">
              {activeTooltip === 'shuffle' && (
                <div 
                  onClick={(e) => e.stopPropagation()}
                  className="absolute bottom-[calc(100%+12px)] z-50 flex flex-col items-center bg-[#e2e0fc] rounded-xl p-2 shadow-2xl tooltip-arrow animate-bounce-short px-3 w-32 border border-white/20"
                >
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-[#2f2e43] font-body text-[11px] font-medium leading-tight text-center px-1">Rearrange the tiles</span>
                    <button 
                      onClick={() => { handleShuffleAction(); setActiveTooltip(null); }}
                      disabled={coins < (economy?.powerups.shuffle.cost ?? 0)}
                      className={`mt-1 flex items-center gap-1 bg-primary text-[#3a3000] px-3 py-1 rounded-full text-[10px] font-bold shadow-sm border-b-2 border-[#554600] active:translate-y-0.5 active:border-b-0 transition-all uppercase tracking-tight ${coins < (economy?.powerups.shuffle.cost ?? 0) ? 'opacity-50 grayscale pointer-events-none' : ''}`}
                    >
                      <span>USE {economy?.powerups.shuffle.cost ?? 0}</span>
                      <span className="w-3 h-3 bg-[#3a3000] rounded-full flex items-center justify-center text-[8px] text-primary">$</span>
                    </button>
                  </div>
                </div>
              )}
              <button 
                onClick={(e) => { e.stopPropagation(); setActiveTooltip(activeTooltip === 'shuffle' ? null : 'shuffle'); }}
                className={`w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-tertiary border-b-[4px] sm:border-b-[8px] border-[#009b4c] flex items-center justify-center active:border-b-0 active:translate-y-[4px] sm:active:translate-y-[8px] transition-all ${activeTooltip === 'shuffle' ? 'ring-4 ring-tertiary/40 brightness-110 shadow-lg' : ''}`}
              >
                <svg viewBox="0 0 24 24" className="w-7 h-7 sm:w-10 sm:h-10 text-[#00602f]" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5"/></svg>
              </button>
            </div>

            {/* Highlight Tooltip & Button */}
            <div className="relative flex flex-col items-center">
              {activeTooltip === 'highlight' && (
                <div 
                  onClick={(e) => e.stopPropagation()}
                  className="absolute bottom-[calc(100%+12px)] z-50 flex flex-col items-center bg-[#e2e0fc] rounded-xl p-2 shadow-2xl tooltip-arrow animate-bounce-short px-3 w-32 border border-white/20"
                >
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-[#2f2e43] font-body text-[11px] font-medium leading-tight text-center px-1">Highlight a correct letter</span>
                    <button 
                      onClick={() => { executeHighlight(); setActiveTooltip(null); }}
                      disabled={!isHighlightAvailable || coins < (economy?.powerups.highlight.cost ?? 0)}
                      className={`mt-1 flex items-center gap-1 bg-primary text-[#3a3000] px-3 py-1 rounded-full text-[10px] font-bold shadow-sm border-b-2 border-[#554600] active:translate-y-0.5 active:border-b-0 transition-all uppercase tracking-tight ${(!isHighlightAvailable || coins < (economy?.powerups.highlight.cost ?? 0)) ? 'opacity-40 grayscale pointer-events-none' : ''}`}
                    >
                      <span>{isHighlightAvailable ? `USE ${economy?.powerups.highlight.cost ?? 0}` : 'NO HIGHLIGHTS LEFT'}</span>
                      {isHighlightAvailable && <span className="w-3 h-3 bg-[#3a3000] rounded-full flex items-center justify-center text-[8px] text-primary">$</span>}
                    </button>
                  </div>
                </div>
              )}
              <button 
                onClick={(e) => { e.stopPropagation(); setActiveTooltip(activeTooltip === 'highlight' ? null : 'highlight'); }}
                className={`w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-secondary border-b-[4px] sm:border-b-[8px] border-[#b580e0] flex items-center justify-center active:border-b-0 active:translate-y-[4px] sm:active:translate-y-[8px] transition-all ${activeTooltip === 'highlight' ? 'ring-4 ring-secondary/40 brightness-110 shadow-lg' : ''}`}
              >
                <svg viewBox="0 0 24 24" className="w-8 h-8 sm:w-12 sm:h-12 text-[#6c11af] fill-current"><path d="M12 22a2.98 2.98 0 0 0 2.818-2H9.182A2.98 2.98 0 0 0 12 22zm7-7.41V11c0-3.866-3.134-7-7-7s-7 3.134-7 7v3.59l-2 2V18h18v-1.41l-2-2z"/></svg>
              </button>
            </div>

            {/* Lightning Tooltip & Button */}
            <div className="relative flex flex-col items-center">
              {activeTooltip === 'lightning' && (
                <div 
                  onClick={(e) => e.stopPropagation()}
                  className="absolute bottom-[calc(100%+12px)] z-50 flex flex-col items-center bg-[#e2e0fc] rounded-xl p-2 shadow-2xl tooltip-arrow animate-bounce-short px-3 w-32 border border-white/20"
                >
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-[#2f2e43] font-body text-[11px] font-medium leading-tight text-center px-1">Place a correct letter</span>
                    <button 
                      onClick={() => { executeLightning(); setActiveTooltip(null); }}
                      disabled={!isLightningAvailable || coins < (economy?.powerups.lightning.cost ?? 0)}
                      className={`mt-1 flex items-center gap-1 bg-primary text-[#3a3000] px-3 py-1 rounded-full text-[10px] font-bold shadow-sm border-b-2 border-[#554600] active:translate-y-0.5 active:border-b-0 transition-all uppercase tracking-tight ${(!isLightningAvailable || coins < (economy?.powerups.lightning.cost ?? 0)) ? 'opacity-40 grayscale pointer-events-none' : ''}`}
                    >
                      <span>{isLightningAvailable ? `USE ${economy?.powerups.lightning.cost ?? 0}` : 'NO SLOTS LEFT'}</span>
                      {isLightningAvailable && <span className="w-3 h-3 bg-[#3a3000] rounded-full flex items-center justify-center text-[8px] text-primary">$</span>}
                    </button>
                  </div>
                </div>
              )}
              <button 
                onClick={(e) => { e.stopPropagation(); setActiveTooltip(activeTooltip === 'lightning' ? null : 'lightning'); }}
                className={`w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-primary border-b-[4px] sm:border-b-[8px] border-[#ba9a00] flex items-center justify-center active:border-b-0 active:translate-y-[4px] sm:active:translate-y-[8px] transition-all ${activeTooltip === 'lightning' ? 'ring-4 ring-primary/40 brightness-110 shadow-lg' : ''}`}
              >
                <svg viewBox="0 0 24 24" className="w-7 h-7 sm:w-10 sm:h-10 text-[#665400] fill-current"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Overlay Screens */}
      {gameState === 'stageStart' && (
        <StageStartOverlay 
          stageNumber={activeStage} 
          onStart={() => setGameState('playing')} 
        />
      )}
      {gameState === 'stageClear' && (
        <StageSuccessOverlay 
          stageNumber={activeStage} 
          coinsAwarded={(() => {
            const base = economy?.rewards.baseCoinPayout || 10;
            const growth = (economy?.rewards.compoundGrowthPercent || 10) / 100;
            let reward = base;
            for (let i = 1; i < activeStage; i++) {
              reward = Math.floor(reward * (1 + growth));
            }
            return reward;
          })()} 
          onContinue={handleContinue} 
        />
      )}
    </div>
  );
};
