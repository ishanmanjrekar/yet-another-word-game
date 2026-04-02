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
        shadow-[inset_0_2px_0_0_rgba(255,255,255,0.05),0_4px_0_0_#1a1a2e]
        transition-all duration-100 ease-in-out cursor-pointer outline-none pb-1
        active:translate-y-[4px] active:shadow-[inset_0_2px_0_0_rgba(255,255,255,0.05),0_0px_0_0_#1a1a2e]
        ${isActive ? 'translate-y-[4px] shadow-[inset_0_2px_0_0_rgba(255,255,255,0.05),0_0px_0_0_#1a1a2e] opacity-40 bg-[#2b2b40] text-gray-400' : 'bg-[#35354f] text-white hover:bg-[#3d3d5a]'}
        ${isHighlighted ? 'ring-4 ring-secondary animate-pulse' : ''}
        ${className}
      `}
    >
      {letter}
    </button>
  );
};
