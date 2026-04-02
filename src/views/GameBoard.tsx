import React, { useState, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { useInterval } from '../hooks/useInterval';
import { Tile } from '../components/ui/Tile';

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
    completedWords,
    nextWord,
    prevWord,
    setGameState
  } = useGameStore((state) => state);

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
        // Time's up
        setGameState('menu');
        return 0;
      }
      return t - 1;
    });
  }, 1000);

  const activeWordObj = stageWords[activeWordIndex];

  if (!activeWordObj) return <div className="flex bg-surface min-h-screen text-on-surface items-center justify-center font-headline text-2xl">Loading...</div>;

  return (
    <div className="relative min-h-screen w-full bg-surface flex flex-col overflow-hidden text-on-surface">
      {/* Top Bar Fixed */}
      <div className="sticky top-0 z-50 bg-surface-container-low shadow-md p-4 flex justify-between items-center">
        <button onClick={() => setGameState('menu')} className="w-10 h-10 bg-surface-dim rounded-full flex items-center justify-center font-headline hover:bg-surface-dimmer transition-colors">
          ||
        </button>
        <div className={`font-headline text-2xl ${timeLeft <= 10 ? 'text-error animate-pulse' : 'text-primary'}`}>
          {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
        </div>
        <div className="bg-surface-dim px-3 py-1 rounded-xl flex items-center gap-2">
          <span className="text-secondary font-headline">🪙</span>
          <span className="font-headline text-on-surface">{coins}</span>
        </div>
      </div>

      {/* Upper Half */}
      <div className="flex-1 p-6 flex flex-col justify-center gap-8 pt-8">
        {/* Active Word Slots */}
        <div className="flex justify-center gap-2">
          {activeWordObj.word.split('').map((_, i) => {
            const hasSelectionForSlot = i < selectedIndices.length;
            const displayedLetter = hasSelectionForSlot ? gridLetters[selectedIndices[i]] : '';
            return (
              <div 
                key={i} 
                className={`w-12 h-14 rounded-lg flex items-center justify-center font-headline text-2xl uppercase transition-colors
                  ${hasSelectionForSlot ? 'bg-primary text-on-primary shadow-lg shadow-primary/30' : 'bg-surface-container-high text-on-surface-variant border-b-4 border-surface-container-highest'}`}
              >
                {displayedLetter}
              </div>
            );
          })}
        </div>
        
        {/* Definition Text */}
        <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-inner border border-surface-dim relative overflow-visible mt-2">
           <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-surface-container-highest px-3 py-0.5 rounded-full text-[10px] font-headline tracking-widest text-on-surface-variant uppercase">
             Hint
           </div>
          <p className="font-body text-center text-sm md:text-base text-on-surface leading-snug">
            {activeWordObj.definition}
          </p>
        </div>

        {/* Word Toggles */}
        <div className="flex justify-between items-center mt-auto pb-4">
          <button onClick={prevWord} className="text-secondary font-headline text-xs tracking-widest uppercase px-4 py-2 hover:bg-surface-container-high rounded-full transition-colors">
            Prev
          </button>
          <div className="flex gap-2 isolate">
            {stageWords.map((_, i) => (
              <div key={i} className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ease-in-out ${
                i === activeWordIndex 
                  ? 'bg-primary scale-125 shadow-[0_0_8px_rgba(var(--color-primary),0.6)]' 
                  : completedWords.includes(i) 
                    ? 'bg-tertiary shadow-[0_0_8px_rgba(var(--color-tertiary),0.6)]' 
                    : 'bg-surface-container-highest'}`} />
            ))}
          </div>
          <button onClick={nextWord} className="text-secondary font-headline text-xs tracking-widest uppercase px-4 py-2 hover:bg-surface-container-high rounded-full transition-colors">
            Next
          </button>
        </div>
      </div>

      {/* Lower Half */}
      <div className="bg-surface-container shadow-[inset_0_4px_12px_rgba(0,0,0,0.5)] p-6 rounded-t-[32px] pb-12 pt-8">
        <div className="grid grid-cols-4 gap-3 aspect-square max-w-[340px] mx-auto">
          {gridLetters.map((char, index) => {
            const isSelected = selectedIndices.includes(index);
            return (
              <div key={index} onClick={() => selectTile(index)} className={`hardware-accelerated cursor-pointer transition-transform ${isSelected ? 'scale-90 opacity-70' : 'hover:scale-105 active:scale-95'}`}>
                <Tile letter={char} isActive={isSelected} />
              </div>
            );
          })}
        </div>

        {/* Power up tray (mocked for now) */}
        <div className="flex justify-center gap-6 mt-10">
          {['🔀', '💡', '⚡'].map((icon, i) => (
            <button key={i} className="w-14 h-14 rounded-full bg-surface-container-high border-b-[6px] border-surface-container-highest shadow-xl flex items-center justify-center text-xl hover:-translate-y-1 active:translate-y-1 active:border-b-2 active:mt-1 transition-all hardware-accelerated">
              {icon}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
