import React from 'react';

interface TileProps {
  letter: string;
  isActive?: boolean;
  isHighlighted?: boolean;
  onClick?: () => void;
  className?: string;
}

export const Tile: React.FC<TileProps> = ({ 
  letter, 
  isActive = false, 
  isHighlighted = false,
  onClick, 
  className = '' 
}) => {
  return (
    <button 
      onClick={onClick}
      className={`
        aspect-square rounded-[14px] flex items-center justify-center
        font-headline text-[2.25rem] select-none uppercase
        shadow-[inset_0_2px_0_0_rgba(255,255,255,0.05),0_4px_0_0_var(--tile-shadow)]
        transition-all duration-100 ease-in-out cursor-pointer outline-none pb-1
        active:translate-y-[4px] active:shadow-[inset_0_2px_0_0_rgba(255,255,255,0.05),0_0px_0_0_var(--tile-shadow)]
        ${isActive ? 'translate-y-[4px] shadow-[inset_0_2px_0_0_rgba(255,255,255,0.05),0_0px_0_0_var(--tile-shadow)] opacity-40 bg-[var(--tile-bg-active)] text-[var(--tile-text-active)]' : 'bg-[var(--tile-bg)] text-[var(--tile-text)] hover:bg-[var(--tile-bg-hover)]'}
        ${isHighlighted ? 'ring-4 ring-secondary animate-pulse' : ''}
        ${className}
      `}
    >
      {letter}
    </button>
  );
};
