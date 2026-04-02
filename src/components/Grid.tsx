import React from 'react';
import { AnimatePresence } from 'framer-motion';
import Tile from './Tile';

interface GridProps {
  letters: string[];
  rows: number;
  cols: number;
  onTileClick?: (index: number) => void;
}

/**
 * Grid Component
 * Supports dynamic AxB dimensions up to 4x4.
 * Ensures that the total grid area remains consistent regardless of the number of tiles.
 */
const Grid: React.FC<GridProps> = ({ letters, rows, cols, onTileClick }) => {
  return (
    <div className="w-full max-w-[min(90vw,400px)] aspect-square mx-auto p-4 bg-surface-low rounded-xl shadow-inner relative overflow-hidden">
      <div 
        className="w-full h-full grid"
        style={{
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`,
          gap: '0.75rem', // Consistent spacing
        }}
      >
        <AnimatePresence>
          {letters.slice(0, rows * cols).map((letter, index) => (
            <Tile 
              key={`tile-${index}-${letter}`}
              letter={letter}
              index={index}
              onClick={() => onTileClick?.(index)}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Grid;
