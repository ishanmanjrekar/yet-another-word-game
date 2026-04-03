import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface StageStartOverlayProps {
  stageNumber: number;
  onStart: () => void;
}

export const StageStartOverlay: React.FC<StageStartOverlayProps> = ({ stageNumber, onStart }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        onStart();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onStart]);

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-surface/40 backdrop-blur-[4px] cursor-pointer"
        onClick={onStart}
      >
        <motion.div 
          initial={{ scale: 0.8, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          className="animate-bounce-slow text-center"
        >
          {/* STAGE NUMBER */}
          <h1 className="font-headline text-[68px] text-primary stage-overlay-text leading-none mb-4 uppercase italic">
            Stage {stageNumber}
          </h1>

          {/* SUBTEXT */}
          <p className="font-body text-xl text-on-surface/90 font-bold tracking-widest uppercase animate-pulse">
            Get Ready!
          </p>

          {/* TAP TO START BUTTON */}
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-10 px-8 py-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.1)] inline-block"
          >
            <p className="font-body text-base text-white uppercase font-extrabold tracking-[0.3em]">
              Tap to start
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
