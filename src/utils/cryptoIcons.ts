// Crypto icon utilities for consistent usage across the application
export interface CryptoIconData {
  name: string;
  symbol: string;
  iconName: string;
  color: string;
}

export const cryptoIconsMap: Record<string, CryptoIconData> = {
  BTC: {
    name: 'Bitcoin',
    symbol: 'BTC',
    iconName: 'cryptocurrency:btc',
    color: '#f97316'
  },
  ETH: {
    name: 'Ethereum',
    symbol: 'ETH',
    iconName: 'cryptocurrency:eth',
    color: '#3b82f6'
  },
  XRP: {
    name: 'Ripple',
    symbol: 'XRP',
    iconName: 'cryptocurrency:xrp',
    color: '#60a5fa'
  },
  LTC: {
    name: 'Litecoin',
    symbol: 'LTC',
    iconName: 'cryptocurrency:ltc',
    color: '#6b7280'
  },
  DOGE: {
    name: 'Dogecoin',
    symbol: 'DOGE',
    iconName: 'cryptocurrency:doge',
    color: '#eab308'
  },
  ADA: {
    name: 'Cardano',
    symbol: 'ADA',
    iconName: 'cryptocurrency:ada',
    color: '#06b6d4'
  },
  SOL: {
    name: 'Solana',
    symbol: 'SOL',
    iconName: 'cryptocurrency:sol',
    color: '#8b5cf6'
  },
  BNB: {
    name: 'Binance Coin',
    symbol: 'BNB',
    iconName: 'cryptocurrency:bnb',
    color: '#f59e0b'
  },
  MATIC: {
    name: 'Polygon',
    symbol: 'MATIC',
    iconName: 'cryptocurrency:matic',
    color: '#8b5cf6'
  },
  DOT: {
    name: 'Polkadot',
    symbol: 'DOT',
    iconName: 'cryptocurrency:dot',
    color: '#e879f9'
  },
  AVAX: {
    name: 'Avalanche',
    symbol: 'AVAX',
    iconName: 'cryptocurrency:avax',
    color: '#ef4444'
  },
  LINK: {
    name: 'Chainlink',
    symbol: 'LINK',
    iconName: 'cryptocurrency:link',
    color: '#3b82f6'
  },
  UNI: {
    name: 'Uniswap',
    symbol: 'UNI',
    iconName: 'cryptocurrency:uni',
    color: '#ff007a'
  },
  ATOM: {
    name: 'Cosmos',
    symbol: 'ATOM',
    iconName: 'cryptocurrency:atom',
    color: '#2e3148'
  },
  FTT: {
    name: 'FTX Token',
    symbol: 'FTT',
    iconName: 'cryptocurrency:ftt',
    color: '#5fcade'
  },
  NEAR: {
    name: 'Near Protocol',
    symbol: 'NEAR',
    iconName: 'cryptocurrency:near',
    color: '#00c08b'
  },
  FIL: {
    name: 'Filecoin',
    symbol: 'FIL',
    iconName: 'cryptocurrency:fil',
    color: '#0090ff'
  },
  TRX: {
    name: 'Tron',
    symbol: 'TRX',
    iconName: 'cryptocurrency:trx',
    color: '#ff060a'
  },
  VET: {
    name: 'VeChain',
    symbol: 'VET',
    iconName: 'cryptocurrency:vet',
    color: '#15bdff'
  },
  XLM: {
    name: 'Stellar',
    symbol: 'XLM',
    iconName: 'cryptocurrency:xlm',
    color: '#14b6e7'
  },
  ALGO: {
    name: 'Algorand',
    symbol: 'ALGO',
    iconName: 'cryptocurrency:algo',
    color: '#000000'
  },
  XTZ: {
    name: 'Tezos',
    symbol: 'XTZ',
    iconName: 'cryptocurrency:xtz',
    color: '#2c7df7'
  },
  EGLD: {
    name: 'Elrond',
    symbol: 'EGLD',
    iconName: 'cryptocurrency:egld',
    color: '#1b46c2'
  }
};

// Utility function to get crypto icon data by symbol
export const getCryptoIcon = (symbol: string): CryptoIconData | null => {
  const cleanSymbol = symbol.replace('USDT', '').replace('USD', '').replace('BUSD', '');
  return cryptoIconsMap[cleanSymbol] || null;
};

// Utility function to get all available crypto icons
export const getAllCryptoIcons = (): CryptoIconData[] => {
  return Object.values(cryptoIconsMap);
};
