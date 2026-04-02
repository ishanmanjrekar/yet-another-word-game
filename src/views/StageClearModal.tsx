import React from 'react';
import { useGameStore } from '../store/gameStore';
import { generateStage } from '../utils/gridGeneration';

export const StageClearModal: React.FC = () => {
  const { setGameState, activeStage, changeStage, levelDesign, wordBank, initStage } = useGameStore(state => state);

  const nextLevel = () => {
    if (!levelDesign || !wordBank) return;
    
    let nextStageNum = activeStage + 1;
    // Loop back to Level 1 if we run out of levels
    if (!levelDesign.stages[nextStageNum.toString()]) {
      nextStageNum = 1;
    }
    
    const stageConfig = levelDesign.stages[nextStageNum.toString()];
    const result = generateStage(stageConfig, wordBank, new Set<string>());
    
    changeStage(nextStageNum);
    initStage(result.selectedWords, result.grid);
    setGameState('stageStart');
  };

  return (
    <div className="absolute inset-0 z-[100] flex items-center justify-center p-6 bg-[#004e26aa] backdrop-blur-sm">
      <div className="w-full max-w-sm bg-[#1a1a2e] border-b-[8px] border-[#0c0c1f] rounded-[2rem] p-8 flex flex-col items-center shadow-2xl">
        <h2 className="font-headline text-tertiary text-[2.5rem] mb-2 tracking-wide text-center" style={{ textShadow: '0 4px 0 #00552a' }}>STAGE CLEAR</h2>
        <p className="text-gray-300 font-body mb-8 text-center text-lg">You beat Stage {activeStage}!</p>
        
        <div className="flex flex-col gap-4 w-full">
          <button 
            onClick={nextLevel}
            className="w-full py-4 bg-primary text-[#554600] font-headline text-xl rounded-xl border-b-[6px] border-[#b09400] active:border-b-0 active:translate-y-[6px] transition-all"
          >
            NEXT LEVEL
          </button>
          
          <button 
            onClick={() => setGameState('menu')}
            className="w-full py-4 bg-[#2a2a4b] text-[#dfb7ff] font-headline text-xl rounded-xl border-b-[6px] border-[#18182b] active:border-b-0 active:translate-y-[6px] transition-all"
          >
            MAIN MENU
          </button>
        </div>
      </div>
    </div>
  );
};
