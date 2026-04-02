import React from 'react';
import { motion } from 'framer-motion';

interface PowerupButtonProps {
  id: string;
  icon: string;
  label: string;
  count: number;
  colorClass: string;
  onClick: (id: string) => void;
}

const PowerupButton: React.FC<PowerupButtonProps> = ({ id, icon, label, count, colorClass, onClick }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9, y: 2 }}
      onClick={() => onClick(id)}
      className={`relative w-14 h-14 rounded-full border-b-4 flex items-center justify-center transition-all ${colorClass}`}
    >
      <span className="text-2xl pointer-events-none" role="img" aria-label={label}>{icon}</span>
      <span className="absolute -top-1 -right-1 bg-surface border-2 border-surface-highest rounded-full w-6 h-6 flex items-center justify-center text-[10px] font-bold text-on-surface">
        {count}
      </span>
    </motion.button>
  );
};

interface PowerupMapProps {
  powerups: { id: string; icon: string; label: string; count: number; color: string; colorContainer: string }[];
  onPowerupUse: (id: string) => void;
}

const PowerupMap: React.FC<PowerupMapProps> = ({ powerups, onPowerupUse }) => {
  return (
    <div className="w-full flex justify-center gap-6 p-6 mb-4 max-w-xl mx-auto">
      {powerups.map((pu) => (
        <PowerupButton 
          key={pu.id}
          id={pu.id}
          icon={pu.icon}
          label={pu.label}
          count={pu.count}
          colorClass={`${pu.color} ${pu.colorContainer}`}
          onClick={onPowerupUse}
        />
      ))}
    </div>
  );
};

export default PowerupMap;
