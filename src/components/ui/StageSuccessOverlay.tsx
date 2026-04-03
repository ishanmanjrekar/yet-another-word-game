import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface StageSuccessOverlayProps {
  stageNumber: number;
  coinsAwarded: number;
  onContinue: () => void;
}

export const StageSuccessOverlay: React.FC<StageSuccessOverlayProps> = ({ 
  stageNumber, 
  coinsAwarded, 
  onContinue 
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Small debounce delay if needed? No, user just wants support.
      if (e.key === 'Enter' || e.key === ' ') {
        onContinue();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onContinue]);

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-surface/40 backdrop-blur-sm cursor-pointer"
        onClick={onContinue}
      >
        {/* Success Overlay Container */}
        <div className="relative w-full max-w-lg px-6 flex flex-col items-center text-center">
          
          {/* Confetti/Burst Decoration */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
            <div className="w-96 h-96 rounded-full bg-[radial-gradient(circle,var(--color-tertiary)_0%,transparent_70%)] opacity-40 blur-3xl"></div>
          </div>

          {/* MAIN TITLE */}
          <motion.div 
            initial={{ scale: 0.5, rotate: -10, opacity: 0 }}
            animate={{ scale: 1, rotate: -2, opacity: 1 }}
            transition={{ type: 'spring', damping: 12, stiffness: 200 }}
            className="relative z-10"
          >
            <h1 className="font-headline text-7xl md:text-8xl text-primary stage-overlay-text uppercase tracking-tighter leading-none">
              GOOD JOB!
            </h1>
            {/* Subtle Glow Layer */}
            <div className="absolute -inset-2 bg-primary/20 blur-2xl -z-10 rounded-full"></div>
          </motion.div>

          {/* REWARD SECTION */}
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-8 flex items-center justify-center gap-3 bg-surface-low/80 backdrop-blur-md px-8 py-4 rounded-full border-b-4 border-surface-highest shadow-2xl scale-110"
          >
            <span className="font-headline text-4xl text-tertiary">+{coinsAwarded}</span>
            <div className="flex items-center justify-center w-12 h-12 bg-primary rounded-full shadow-[0_0_20px_rgba(233,196,0,0.4)] border-b-4 border-primary-container">
              {/* Inline SVG Coin Icon for reliability */}
              <svg viewBox="0 0 24 24" className="w-8 h-8 text-on-primary fill-current">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.39 2.1-1.39 1.47 0 2.01.59 2.1 1.58h1.77c-.11-1.76-1.28-2.91-3.07-3.34V4h-1.71v2.28c-1.53.33-2.82 1.3-2.82 2.87 0 1.84 1.54 2.76 3.8 3.32 2.09.51 2.48 1.15 2.48 1.9 0 .78-.71 1.48-2.28 1.48-1.7 0-2.34-.78-2.49-1.58H7.66c.23 1.83 1.59 2.94 3.31 3.32V19h1.71v-2.29c1.64-.31 3.03-1.26 3.03-2.97 0-2.13-1.85-2.73-3.4-3.13z"/>
              </svg>
            </div>
          </motion.div>

          {/* SUBTEXT */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ delay: 0.6 }}
            className="mt-12 max-w-xs"
          >
            <p className="font-body text-xs tracking-[0.2em] text-secondary uppercase font-bold">
              STAGE {stageNumber} COMPLETE.
            </p>
          </motion.div>

          {/* CTA SECTION */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-16 relative group"
          >
            {/* Pulse/Glow behind CTA */}
            <div className="absolute -inset-4 bg-tertiary/10 rounded-full blur-xl animate-pulse"></div>
            <div className="relative flex flex-col items-center gap-2">
              <span className="font-body font-extrabold text-on-surface text-xl tracking-[0.2em] drop-shadow-md">
                TAP TO CONTINUE
              </span>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
