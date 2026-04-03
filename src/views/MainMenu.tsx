import React from 'react';
import { useGameStore } from '../store/gameStore';
import { generateStage } from '../utils/gridGeneration';

export const MainMenu: React.FC = () => {
  const { coins, highScore, levelDesign, wordBank, initStage, setGameState, changeStage } = useGameStore((state) => state);

  const handleArcadeClick = () => {
    if (!levelDesign || !wordBank) return;
    const stageConfig = levelDesign.stages["1"];
    if (!stageConfig) return;
    try {
      changeStage(1);
      const { selectedWords, grid } = generateStage(stageConfig, wordBank, new Set());
      initStage(selectedWords, grid);
      setGameState('stageStart');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="relative h-full w-full bg-surface text-on-surface font-body overflow-hidden select-none flex flex-col">
      {/* Top Header Bar */}
      <header className="bg-transparent flex justify-end items-center w-full px-6 py-4 absolute top-0 z-50">
        <div className="flex items-center gap-2 bg-surface-container/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-primary/20 pointer-events-auto">
          <span className="material-symbols-outlined text-primary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>monetization_on</span>
          <span className="font-headline text-lg text-primary">{coins.toLocaleString()}</span>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center relative px-6 pt-12 pb-8">
        {/* Decorative Floating Tiles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
          <div 
            className="absolute top-[20%] left-[10%] w-16 h-16 bg-surface-highest rounded-2xl flex items-center justify-center tile-floating-ref border-t border-surface-bright/20 shadow-2xl"
            style={{ animation: 'tile-floating 6s ease-in-out infinite' }}
          >
            <span className="font-headline text-3xl text-secondary">A</span>
          </div>
          <div 
            className="absolute top-[15%] right-[15%] w-14 h-14 bg-primary rounded-2xl flex items-center justify-center tile-floating-alt-ref border-t border-white/20 shadow-2xl"
            style={{ animation: 'tile-floating-alt 8s ease-in-out infinite' }}
          >
            <span className="font-headline text-2xl text-on-primary">W</span>
          </div>
          <div 
            className="absolute bottom-[30%] left-[5%] w-20 h-20 bg-surface-highest rounded-2xl flex items-center justify-center tile-floating-alt-ref border-t border-surface-bright/20 shadow-2xl"
            style={{ animation: 'tile-floating-alt 7s ease-in-out infinite' }}
          >
            <span className="font-headline text-4xl text-tertiary">G</span>
          </div>
          <div 
            className="absolute bottom-[20%] right-[10%] w-16 h-16 bg-surface-highest rounded-2xl flex items-center justify-center tile-floating-ref border-t border-surface-bright/20 shadow-2xl"
            style={{ animation: 'tile-floating 9s ease-in-out infinite' }}
          >
            <span className="font-headline text-3xl text-secondary">Y</span>
          </div>
          <div 
            className="absolute top-[45%] right-[5%] w-12 h-12 bg-primary rounded-xl flex items-center justify-center tile-floating-ref border-t border-white/20 shadow-2xl"
            style={{ animation: 'tile-floating 10s ease-in-out infinite' }}
          >
            <span className="font-headline text-xl text-on-primary">!</span>
          </div>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-10 z-10 -mt-16">
          <h2 className="text-8xl font-headline text-primary tracking-tighter mb-2 drop-shadow-[0_6px_0_rgba(85,70,0,0.8)]">YAWG</h2>
          <p className="text-secondary font-body font-bold text-xs tracking-[0.2em] uppercase opacity-80">Yet Another Word Game</p>
        </div>

        {/* Game Modes Grid */}
        <div className="flex flex-col gap-8 w-full max-w-sm z-10">
          {/* Arcade Mode */}
          <div className="flex flex-col items-center">
            <button 
              onClick={handleArcadeClick}
              className="chunky-button-primary w-full py-7 bg-primary rounded-[32px] flex flex-col items-center justify-center transition-all duration-100 hover:brightness-110 active:scale-95 group"
            >
              <span className="material-symbols-outlined text-on-primary text-5xl mb-1 group-hover:scale-110 transition-transform" style={{ fontVariationSettings: "'opsz' 48" }}>sports_esports</span>
              <span className="font-headline text-3xl text-on-primary uppercase tracking-tight">Arcade</span>
            </button>
            {highScore > 0 && (
              <div className="mt-4 bg-gradient-to-b from-[#E8E8E8] to-[#B0B0B0] px-5 py-1.5 rounded-full border border-[#690bac]/50 flex items-center gap-2 shadow-[0_4px_15px_rgba(105,11,172,0.3)]">
                <span className="material-symbols-outlined text-[#690bac] text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>emoji_events</span>
                <span className="text-[#690bac] font-body font-bold text-sm tracking-tight">Highscore: Stage {highScore}</span>
              </div>
            )}
          </div>

          {/* WOTD Mode */}
          <div className="flex flex-col items-center relative">
            <button className="chunky-button-secondary w-full py-7 bg-secondary-container rounded-[32px] flex flex-col items-center justify-center transition-all duration-100 border-t border-white/10 opacity-[0.85] cursor-not-allowed">
              <span className="material-symbols-outlined text-secondary text-5xl mb-1" style={{ fontVariationSettings: "'opsz' 48" }}>today</span>
              <span className="font-headline text-3xl text-secondary uppercase tracking-tight">WOTD</span>
              <span className="text-secondary/60 font-body font-bold text-[10px] uppercase tracking-[0.2em] mt-1">Words of the Day</span>
            </button>
            
            {/* Coming Soon Overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="bg-[#cc0000] text-white font-headline text-xl px-6 py-2 rounded-lg rotate-[-5deg] shadow-[0_4px_0_0_#990000] border-2 border-white/20 flex flex-col items-center mt-[-10px]">
                <span className="leading-tight">COMING SOON</span>
                <span className="font-body text-[11px] lowercase opacity-80 -mt-2">maybe</span>
              </div>
            </div>
          </div>
        </div>
      </main>


    </div>
  );
};
