import React from 'react';
import { motion } from 'framer-motion';

interface TimeUpOverlayProps {
  coins: number;
  stageNumber: number;
  cost: number;
  duration: number;
  activeWordIndex: number;
  completedWords: number[];
  totalWords: number;
  onExtraTime: () => void;
  onHome: () => void;
}

export const TimeUpOverlay: React.FC<TimeUpOverlayProps> = ({
  coins,
  stageNumber,
  cost,
  duration,
  activeWordIndex,
  completedWords,
  totalWords,
  onExtraTime,
  onHome
}) => {
  const canAfford = coins >= cost;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[100] bg-surface/95 backdrop-blur-sm flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Top Bar - Coin Display */}
      <header className="absolute top-0 right-0 p-6 z-50">
        <div className="flex items-center gap-1.5 bg-surface-container-high px-4 py-2 rounded-full border-b-2 border-surface-container-highest shadow-lg">
          <span className="material-symbols-outlined text-primary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>monetization_on</span>
          <span className="font-black text-primary text-lg tracking-tight">{coins.toLocaleString()}</span>
        </div>
      </header>

      <main className="w-full max-w-md flex flex-col items-center gap-12 p-6 text-center">
        {/* Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] bg-[radial-gradient(circle_at_center,_rgba(108,17,175,0.15)_0%,_transparent_70%)] pointer-events-none"></div>

        {/* Center Content */}
        <div className="flex flex-col items-center gap-4 z-10 relative">
          <div className="relative">
            <span className="absolute -top-12 -left-8 text-6xl opacity-10 rotate-12 material-symbols-outlined pointer-events-none select-none">schedule</span>
            <h2 className="text-6xl md:text-7xl font-headline text-primary leading-none tracking-tight drop-shadow-[0_0_15px_rgba(233,196,0,0.4)]">
              TIME'S UP!
            </h2>
            <span className="absolute -bottom-8 -right-8 text-6xl opacity-10 -rotate-12 material-symbols-outlined pointer-events-none select-none">hourglass_empty</span>
          </div>
          <p className="text-xl font-bold tracking-[0.2em] text-secondary mt-4 bg-secondary/10 px-6 py-1.5 rounded-xl uppercase">
            Stage {stageNumber}
          </p>

          {/* Progress Indicators */}
          <div className="flex gap-3 mt-12 bg-surface-container-lowest p-6 rounded-3xl shadow-inner border border-white/5">
            {Array.from({ length: totalWords }).map((_, i) => {
              const isSolved = completedWords.includes(i);
              const isActive = i === activeWordIndex;

              if (isSolved) {
                return (
                  <div key={i} className="w-10 h-10 rounded-full bg-tertiary flex items-center justify-center shadow-[0_4px_0_0_rgba(0,83,37,1)]">
                    <span className="material-symbols-outlined text-on-tertiary font-bold text-xl">check</span>
                  </div>
                );
              }
              
              if (isActive) {
                return (
                  <div key={i} className="w-10 h-10 rounded-full border-4 border-primary bg-surface-container flex items-center justify-center relative shadow-lg">
                    <div className="absolute w-2.5 h-2.5 bg-primary rounded-full animate-pulse"></div>
                  </div>
                );
              }

              return (
                <div key={i} className="w-10 h-10 rounded-full bg-surface-container-highest/30 flex items-center justify-center border border-white/5">
                  <div className="w-2 h-2 bg-white/10 rounded-full"></div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="w-full flex flex-col gap-8 z-10">
          <div className="flex flex-col items-center gap-4">
            <button 
              onClick={onExtraTime}
              disabled={!canAfford}
              className={`group w-full bg-primary text-on-primary py-5 rounded-2xl flex flex-col items-center justify-center shadow-[0_6px_0_0_#554600] active:shadow-[0_2px_0_0_#554600] active:translate-y-1 transition-all disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed`}
            >
              <span className="font-headline text-3xl tracking-wide">+{duration} SECONDS</span>
              <div className="flex items-center gap-1.5 opacity-90">
                <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>monetization_on</span>
                <span className="font-black text-xl tracking-tighter">{cost}</span>
              </div>
            </button>
            <p className="text-[10px] uppercase font-bold text-outline tracking-[0.25em] opacity-60">
              Get extra time to continue your game
            </p>
          </div>

          <button 
            onClick={onHome}
            className="w-full py-4 rounded-2xl flex items-center justify-center gap-3 group transition-all hover:bg-surface-container-high active:scale-95"
          >
            <span className="material-symbols-outlined text-secondary group-hover:-translate-x-1 transition-transform">home</span>
            <span className="font-headline text-xl text-secondary tracking-widest uppercase">Home</span>
          </button>
        </div>
      </main>
    </motion.div>
  );
};
