import React from 'react';
import { useGameStore } from '../store/gameStore';
import { generateStage } from '../utils/gridGeneration';

export const GameOverModal: React.FC = () => {
  const { setGameState, activeStage, initStage, levelDesign, wordBank } = useGameStore(state => state);

  const retryStage = () => {
    if (!levelDesign || !wordBank) return;
    const stageConfig = levelDesign.stages[activeStage.toString()];
    const result = generateStage(stageConfig, wordBank, new Set<string>());
    initStage(result.selectedWords, result.grid);
    setGameState('stageStart');
  };

  return (
    <div className="absolute inset-0 z-[100] flex items-center justify-center p-6 bg-[#3a0b0baa] backdrop-blur-sm">
      <div className="w-full max-w-sm bg-surface-low border-b-[8px] border-[var(--tile-shadow)] rounded-[2rem] p-8 flex flex-col items-center shadow-2xl">
        <h2 className="font-headline text-red-500 text-4xl mb-2 tracking-wide text-center">TIME'S UP</h2>
        <p className="text-on-surface/70 font-body mb-8 text-center text-lg">You ran out of time on Stage {activeStage}.</p>
        
        <div className="flex flex-col gap-4 w-full">
          <button 
            onClick={retryStage}
            className="w-full py-4 bg-primary text-on-primary font-headline text-xl rounded-xl border-b-[6px] border-[var(--chunky-shadow-primary)] active:border-b-0 active:translate-y-[6px] transition-all"
          >
            RETRY STAGE
          </button>
          
          <button 
            onClick={() => setGameState('menu')}
            className="w-full py-4 bg-[var(--nav-btn-bg)] text-[var(--nav-btn-text)] font-headline text-xl rounded-xl border-b-[6px] border-[var(--nav-btn-border)] active:border-b-0 active:translate-y-[6px] transition-all"
          >
            QUIT TO MENU
          </button>
        </div>
      </div>
    </div>
  );
};
