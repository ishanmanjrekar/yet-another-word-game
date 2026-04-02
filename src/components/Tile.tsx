import React from 'react';
import { motion } from 'framer-motion';

interface TileProps {
  letter: string;
  index: number;
  onClick?: () => void;
  disabled?: boolean;
}

const Tile: React.FC<TileProps> = ({ letter, index, onClick, disabled }) => {
  return (
    <motion.button
      initial={{ scale: 0, opacity: 0, rotate: -10 }}
      animate={{ 
        scale: 1, 
        opacity: 1, 
        rotate: 0,
        transition: {
          type: 'spring',
          stiffness: 260,
          damping: 20,
          delay: index * 0.05
        }
      }}
      whileTap={disabled ? {} : { y: 4 }}
      onClick={disabled ? undefined : onClick}
      className={`
        tile-3d w-full aspect-square flex items-center justify-center
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        select-none
      `}
      aria-label={`Letter ${letter}`}
    >
      <span className="drop-shadow-sm">{letter.toUpperCase()}</span>
    </motion.button>
  );
};

export default Tile;
