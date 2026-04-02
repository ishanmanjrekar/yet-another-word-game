import React from 'react';

interface DefinitionCardProps {
  label?: string;
  definition: string;
  className?: string;
}

export const DefinitionCard: React.FC<DefinitionCardProps> = ({ 
  label = "DEFINITION", 
  definition, 
  className = '' 
}) => {
  return (
    <div className={`bg-surface-low rounded-xl p-8 shadow-[0_8px_0_0_#0c0c1f] ${className}`}>
      <div className="text-secondary font-body text-xs uppercase font-bold tracking-wider mb-2">
        {label}
      </div>
      <div className="text-on-surface font-headline text-2xl leading-tight text-balance">
        {definition}
      </div>
    </div>
  );
};
