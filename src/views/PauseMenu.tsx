import React from 'react';
import { useGameStore } from '../store/gameStore';

export const PauseMenu: React.FC = () => {
  const { setGameState } = useGameStore(state => state);

  return (
    <div className="absolute inset-0 z-[100] flex items-center justify-center p-6 bg-[#000000aa] backdrop-blur-sm">
      <div className="w-full max-w-sm bg-[#1a1a2e] border-b-[8px] border-[#0c0c1f] rounded-[2rem] p-8 flex flex-col items-center shadow-2xl">
        <h2 className="font-headline text-white text-4xl mb-8 tracking-wide">PAUSED</h2>
        
        <div className="flex flex-col gap-4 w-full">
          <button 
            onClick={() => setGameState('playing')}
            className="w-full py-4 bg-tertiary text-[#004e26] font-headline text-xl rounded-xl border-b-[6px] border-[#009b4c] active:border-b-0 active:translate-y-[6px] transition-all"
          >
            RESUME
          </button>
          
          <button 
            onClick={() => setGameState('menu')}
            className="w-full py-4 bg-[#2a2a4b] text-[#dfb7ff] font-headline text-xl rounded-xl border-b-[6px] border-[#18182b] active:border-b-0 active:translate-y-[6px] transition-all"
          >
            QUIT TO MENU
          </button>
        </div>
      </div>
    </div>
  );
};
