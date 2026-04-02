import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'tertiary';

interface ChunkyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: React.ReactNode;
}

export const ChunkyButton: React.FC<ChunkyButtonProps> = ({ 
  variant = 'primary', 
  children, 
  className = '', 
  ...props 
}) => {
  const baseClasses = "font-headline text-center transition-all duration-100 ease-in-out active:translate-y-[4px] active:border-b-0";
  
  const variants = {
    primary: "bg-primary text-on-primary border-b-4 border-primary-container text-3xl px-8 py-3 rounded-xl",
    secondary: "bg-secondary-container text-secondary border-b-4 border-[#4b007e] text-2xl px-6 py-2 rounded-xl",
    tertiary: "bg-transparent text-primary outline outline-1 outline-[rgba(233,196,0,0.2)] border-b-0 text-xl px-4 py-2 rounded-xl opacity-80 hover:opacity-100 active:translate-y-[2px]"
  };

  return (
    <button 
      className={`${baseClasses} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
