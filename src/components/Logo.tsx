import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showText?: boolean;
  textSize?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeClasses = {
  sm: 'w-6 h-6',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16'
};

const textSizeClasses = {
  sm: 'text-sm',
  md: 'text-lg',
  lg: 'text-xl',
  xl: 'text-2xl'
};

export const Logo = ({ 
  size = 'md', 
  className = '', 
  showText = false, 
  textSize = 'lg' 
}: LogoProps) => {
  const logoElement = (
    <img 
      src="/CryptoMinePro.jpeg" 
      alt="CryptoMine Pro Logo" 
      className={`${sizeClasses[size]} rounded-full object-cover ${className}`}
    />
  );

  if (!showText) {
    return logoElement;
  }

  return (
    <div className="flex items-center space-x-3">
      {logoElement}
      <span className={`text-orange-500 font-bold ${textSizeClasses[textSize]}`}>
        CryptoMine Pro
      </span>
    </div>
  );
};
