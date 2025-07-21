import { Icon } from '@iconify/react';
import { getCryptoIcon } from '../utils/cryptoIcons';

interface CryptoIconProps {
  symbol: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showBackground?: boolean;
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8'
};

const backgroundSizes = {
  sm: 'w-6 h-6',
  md: 'w-8 h-8',
  lg: 'w-10 h-10'
};

export const CryptoIcon = ({ 
  symbol, 
  size = 'md', 
  className = '', 
  showBackground = false 
}: CryptoIconProps) => {
  const cryptoData = getCryptoIcon(symbol);
  
  if (!cryptoData) {
    // Fallback for unknown cryptocurrencies
    return (
      <div className={`${showBackground ? backgroundSizes[size] : sizeClasses[size]} ${className} flex items-center justify-center`}>
        <Icon 
          icon="cryptocurrency:generic" 
          className={sizeClasses[size]}
          style={{ color: '#6b7280' }}
        />
      </div>
    );
  }

  if (showBackground) {
    return (
      <div 
        className={`${backgroundSizes[size]} ${className} rounded-full flex items-center justify-center bg-opacity-20`}
        style={{ backgroundColor: cryptoData.color + '33' }}
      >
        <Icon 
          icon={cryptoData.iconName} 
          className={sizeClasses[size]}
          style={{ color: cryptoData.color }}
        />
      </div>
    );
  }

  return (
    <Icon 
      icon={cryptoData.iconName} 
      className={`${sizeClasses[size]} ${className}`}
      style={{ color: cryptoData.color }}
    />
  );
};
