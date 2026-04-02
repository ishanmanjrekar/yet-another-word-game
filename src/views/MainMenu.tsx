import React from 'react';
import { useGameStore } from '../store/gameStore';
import { ChunkyButton } from '../components/ui/ChunkyButton';
import { Tile } from '../components/ui/Tile';
import { generateStage } from '../utils/gridGeneration';

export const MainMenu: React.FC = () => {
  const { coins, activeStage, levelDesign, wordBank, initStage, setGameState } = useGameStore((state) => state);

  const handleArcadeClick = () => {
    if (!levelDesign || !wordBank) return;
    const stageConfig = levelDesign.stages[activeStage.toString()];
    if (!stageConfig) return;
    try {
      const { selectedWords, grid } = generateStage(stageConfig, wordBank, new Set());
      initStage(selectedWords, grid);
      setGameState('playing');
    } catch (e) {
      console.error(e);
    }
  };

  // Decorative floating tiles
  const floatingTiles = [
    { letter: 'Y', top: '10%', left: '5%', delay: '0s', alt: false },
    { letter: 'A', top: '15%', left: '85%', delay: '1s', alt: true },
    { letter: 'W', top: '70%', left: '10%', delay: '2s', alt: false },
    { letter: 'G', top: '75%', left: '80%', delay: '3.5s', alt: true },
    { letter: '!', top: '40%', left: '90%', delay: '0.5s', alt: false },
    { letter: '?', top: '60%', left: '5%', delay: '2.5s', alt: true },
  ];

  return (
    <div className="relative min-h-screen w-full bg-surface flex flex-col items-center justify-center overflow-hidden">
      
      {/* Background Decorative Tiles */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        {floatingTiles.map((tile, i) => (
          <div 
            key={i}
            className={`absolute hardware-accelerated ${tile.alt ? 'tile-floating-alt' : 'tile-floating'}`}
            style={{ 
              top: tile.top, 
              left: tile.left,
              animationDelay: tile.delay,
              transform: 'scale(1.5)'
            }}
          >
            <Tile letter={tile.letter} />
          </div>
        ))}
      </div>

      {/* Top Header Bar */}
      <div className="absolute top-0 left-0 w-full p-6 flex justify-end items-center pointer-events-none">
        <div className="bg-surface-low px-4 py-2 rounded-xl border-b-4 border-surface-lowest flex items-center gap-2 pointer-events-auto">
          <span className="text-primary font-headline text-xl">🪙</span>
          <span className="font-headline text-xl text-on-surface">{coins}</span>
        </div>
      </div>

      {/* Hero Section */}
      <div className="flex flex-col items-center gap-12 z-10">
        <div className="text-center">
          <h1 className="font-headline text-8xl text-primary text-3d-title mb-2">
            YAWG
          </h1>
          <p className="font-body text-secondary tracking-widest uppercase text-sm font-bold opacity-80">
            Yet Another Word Game
          </p>
        </div>

        {/* Navigation Buttons */}
        <div className="flex flex-col gap-8 w-full max-w-[280px]">
          {/* Arcade Mode */}
          <div className="flex flex-col items-center gap-3">
            <ChunkyButton variant="primary" className="w-full" onClick={handleArcadeClick}>
              ARCADE
            </ChunkyButton>
            <div className="bg-[#4b007e] px-4 py-1 rounded-full shadow-[0_4px_0_0_rgba(0,0,0,0.3)]">
              <div className="bg-gradient-to-b from-[#E8E8E8] to-[#B0B0B0] text-[#4b007e] font-headline text-xs px-3 py-0.5 rounded-full">
                BEST: STAGE 12
              </div>
            </div>
          </div>

          {/* Word of the Day */}
          <div className="flex flex-col items-center gap-3">
            <ChunkyButton variant="secondary" className="w-full">
              WOTD
            </ChunkyButton>
            <div className="bg-[#4b007e] px-4 py-1 rounded-full shadow-[0_4px_0_0_rgba(0,0,0,0.3)]">
              <div className="bg-gradient-to-b from-[#E8E8E8] to-[#B0B0B0] text-[#4b007e] font-headline text-xs px-3 py-0.5 rounded-full">
                STREAK: 5 DAYS
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="absolute bottom-8 opacity-40 text-xs font-body uppercase tracking-tighter">
        v0.1.0-alpha // Hyper-Glossy Irony
      </div>

    </div>
  );
};
