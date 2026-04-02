import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';

interface HUDProps {
  coins: number;
  stage: number;
  maxStages?: number;
}

const HUD: React.FC<HUDProps> = ({ coins, stage, maxStages = 10 }) => {
  const coinControls = useAnimation();
  const [prevCoins, setPrevCoins] = useState(coins);

  useEffect(() => {
    if (coins > prevCoins) {
      coinControls.start({
        scale: [1, 1.3, 1],
        transition: { duration: 0.3, type: 'spring', stiffness: 300 }
      });
    }
    setPrevCoins(coins);
  }, [coins, prevCoins, coinControls]);

  return (
    <header className="w-full flex justify-between items-center p-4 bg-surface max-w-xl mx-auto shadow-chunky-surface">
      {/* Stage Progress Pill */}
      <div className="bg-surface-highest rounded-full border-b-2 border-surface-lowest px-4 py-1">
        <span className="text-secondary text-sm font-headline uppercase mr-2 tracking-widest">Stage</span>
        <span className="text-on-surface text-xl font-headline">{stage}</span>
        {maxStages && <span className="text-secondary/50 text-sm font-headline"> / {maxStages}</span>}
      </div>

      {/* Coins Pill */}
      <motion.div 
        animate={coinControls}
        className="bg-surface-highest rounded-full border-b-2 border-surface-lowest flex items-center gap-2 pl-2 pr-4 py-1"
      >
        <div className="w-6 h-6 bg-primary rounded-full border-b-2 border-primary-container flex items-center justify-center">
          <span className="text-[10px] text-on-primary font-bold">C</span>
        </div>
        <span className="text-on-surface text-xl font-headline min-w-[2ch]">
          {coins.toLocaleString()}
        </span>
      </motion.div>
    </header>
  );
};

export default HUD;
