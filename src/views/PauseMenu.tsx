import React, { useMemo, useState } from 'react';
import { useGameStore } from '../store/gameStore';

const QUIPS = [
  "Catch your breath, genius",
  "The letters aren't going anywhere",
  "Thinking of a six-letter word for 'rest'?",
  "Your brain deserves a tiny break",
  "Hydration is key to high scores",
  "Is it 'pause' or 'paws'? Both are 5 letters",
  "Taking a moment to find the 'fun' in 'function'?",
  "The clock is frozen, but your skill isn't",
  "A quick stretch makes for better spelling",
  "Plotting your next lexicographical triumph?",
  "Word on the street is you're doing great",
  "Just checking the dictionary?",
  "Brilliance takes a brief intermission",
  "Even wordsmiths need a breather",
  "Ready to spell circles around the clock?"
];

export const PauseMenu: React.FC = () => {
  const { coins, setGameState } = useGameStore(state => state);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  
  const randomQuip = useMemo(() => {
    return QUIPS[Math.floor(Math.random() * QUIPS.length)];
  }, []);

  if (showExitConfirm) {
    return (
      <div className="absolute inset-0 z-[200] flex items-center justify-center p-6 bg-surface/60 backdrop-blur-md">
        <div className="w-full max-w-md bg-surface-low rounded-xl p-8 flex flex-col items-center gap-8 relative shadow-2xl border border-white/5">
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-surface-highest px-6 py-2 rounded-full border-4 border-surface-low shadow-lg">
            <span className="font-body font-bold text-xs uppercase tracking-widest text-secondary">Warning</span>
          </div>
          
          <div className="text-center space-y-4 pt-4">
            <h2 className="font-headline text-4xl md:text-5xl text-on-surface leading-tight tracking-tight uppercase">ARE YOU SURE?</h2>
            <p className="font-body text-secondary text-sm max-w-[280px] mx-auto opacity-80">
              You will lose your current progress.
            </p>
          </div>

          <div className="w-full space-y-4">
            <button 
              onClick={() => setShowExitConfirm(false)}
              className="w-full group relative transition-all active:translate-y-[2px]"
            >
              <div className="absolute inset-0 bg-primary-container rounded-xl translate-y-2"></div>
              <div className="relative bg-primary text-on-primary py-5 rounded-xl flex items-center justify-center gap-3 border-t-2 border-white/30 hover:brightness-110">
                <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                <span className="font-headline text-2xl uppercase tracking-wide">CANCEL</span>
              </div>
            </button>

            <button 
              onClick={() => setGameState('menu')}
              className="w-full group relative transition-all active:translate-y-[2px]"
            >
              <div className="absolute inset-0 bg-[#690005] rounded-xl translate-y-2"></div>
              <div className="relative bg-error-container text-on-error-container py-5 rounded-xl flex items-center justify-center gap-3 border border-white/5 hover:bg-error-container/80">
                <span className="material-symbols-outlined text-2xl">exit_to_app</span>
                <span className="font-headline text-2xl uppercase tracking-wide">YES, QUIT</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 z-[200] flex flex-col items-center justify-center p-6 bg-surface/60 backdrop-blur-md">
      {/* Top Bar with Coins */}
      <header className="fixed top-0 left-0 w-full z-[210] flex justify-end items-center px-6 h-16 pointer-events-none">
        <div className="flex items-center gap-2 bg-surface-lowest/80 px-4 py-1.5 rounded-full border border-primary/20 pointer-events-auto">
          <span className="material-symbols-outlined text-primary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
            monetization_on
          </span>
          <span className="font-headline text-primary text-lg leading-none">
            {coins.toLocaleString()}
          </span>
        </div>
      </header>

      <main className="w-full max-w-md space-y-12 flex flex-col items-center relative z-[220]">
        {/* Headline Cluster */}
        <div className="text-center space-y-2">
          <h2 className="font-headline text-7xl md:text-8xl text-primary tracking-tighter drop-shadow-[0_8px_0_rgba(85,70,0,0.4)]">
            PAUSED
          </h2>
          <p className="font-body text-secondary text-sm uppercase tracking-[0.2em] opacity-80 px-4">
            {randomQuip}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-6 w-full px-4">
          {/* Resume Button */}
          <button 
            onClick={() => setGameState('playing')}
            className="group relative w-full transform active:scale-95 transition-all duration-150"
          >
            <div className="absolute inset-0 bg-primary-container rounded-2xl translate-y-2"></div>
            <div className="relative bg-primary text-on-primary py-5 rounded-2xl flex items-center justify-center gap-3 border-t-2 border-white/30 shadow-lg">
              <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                play_arrow
              </span>
              <span className="font-headline text-3xl uppercase tracking-wide">RESUME</span>
            </div>
          </button>

          {/* Quit Button */}
          <button 
            onClick={() => setShowExitConfirm(true)}
            className="group relative w-full transform active:scale-95 transition-all duration-150"
          >
            <div className="absolute inset-0 bg-surface-lowest rounded-2xl translate-y-2"></div>
            <div className="relative bg-surface-highest text-secondary py-5 rounded-2xl flex items-center justify-center gap-3 border border-secondary/10 shadow-lg">
              <span className="material-symbols-outlined text-2xl">exit_to_app</span>
              <span className="font-headline text-2xl uppercase tracking-wide">QUIT GAME</span>
            </div>
          </button>
        </div>
      </main>
    </div>
  );
};
