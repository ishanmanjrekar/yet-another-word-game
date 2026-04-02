import React from 'react';

interface TileProps {
  letter: string;
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
}

export const Tile: React.FC<TileProps> = ({ 
  letter, 
  isActive = false, 
  onClick, 
  className = '' 
}) => {
  return (
    <button 
      onClick={onClick}
      className={`
        aspect-square rounded-xl bg-surface-highest
        flex items-center justify-center
        font-headline text-3xl text-on-surface select-none
        border-b-4 border-surface-lowest
        shadow-[inset_0_2px_0_0_rgba(255,255,255,0.1)]
        transition-all duration-100 ease-in-out cursor-pointer
        active:translate-y-1 active:border-b-0
        ${isActive ? 'translate-y-1 border-b-0 opacity-80' : ''}
        ${className}
      `}
    >
      {letter}
    </button>
  );
};
