import { useState, useEffect } from 'react';
import { CryptoIcon } from './CryptoIcon';

interface CryptoCurrency {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change: number;
}

const COINGECKO_IDS: Record<string, string> = {
  BTCUSDT: 'bitcoin',
  ETHUSDT: 'ethereum',
  XRPUSDT: 'ripple',
  LTCUSDT: 'litecoin',
  DOGEUSDT: 'dogecoin'
};

const INITIAL_CRYPTOS: CryptoCurrency[] = [
  { id: 'BTCUSDT', name: 'Bitcoin', symbol: 'BTCUSDT', price: 0, change: 0 },
  { id: 'ETHUSDT', name: 'Ethereum', symbol: 'ETHUSDT', price: 0, change: 0 },
  { id: 'XRPUSDT', name: 'Ripple', symbol: 'XRPUSDT', price: 0, change: 0 },
  { id: 'LTCUSDT', name: 'Litecoin', symbol: 'LTCUSDT', price: 0, change: 0 },
  { id: 'DOGEUSDT', name: 'Dogecoin', symbol: 'DOGEUSDT', price: 0, change: 0 }
];

export const LivePrices = () => {
  const [cryptos, setCryptos] = useState<CryptoCurrency[]>(INITIAL_CRYPTOS);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const fetchPrices = async () => {
    try {
      const ids = Object.values(COINGECKO_IDS).join(',');
      const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`);
      const data = await res.json();

      const updated = INITIAL_CRYPTOS.map(c => {
        const coinData = data[COINGECKO_IDS[c.symbol]];
        return {
          ...c,
          price: coinData?.usd ?? 0,
          change: coinData?.usd_24h_change ?? 0
        };
      });

      setCryptos(updated);
      setLastUpdate(new Date());
    } catch (err) {
      console.error('Error fetching prices', err);
    }
  };

  useEffect(() => {
    fetchPrices();
    const interval = setInterval(fetchPrices, 120000); // Changed to 2 minutes (120 seconds) to reduce API calls
    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price: number) => {
    if (price < 1) return `$${price.toFixed(4)}`;
    if (price < 100) return `$${price.toFixed(2)}`;
    return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="bg-slate-800 rounded-lg p-4 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-white font-semibold">Live Prices</h3>
        <span className="text-slate-400 text-sm">
          Updated: {lastUpdate.toLocaleTimeString('en-US', {
            hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
          })}
        </span>
      </div>
      <div className="space-y-3">
        {cryptos.map((crypto) => (
          <div key={crypto.id} className="flex items-center justify-between p-3 bg-slate-900 rounded-lg border border-slate-700">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 flex items-center justify-center">
                <CryptoIcon symbol={crypto.symbol} size="md" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">{crypto.name}</p>
                <p className="text-slate-400 text-xs">{crypto.symbol}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-white font-bold text-sm">{formatPrice(crypto.price)}</p>
              <div className={`flex items-center space-x-1 text-xs ${crypto.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                <span>{crypto.change >= 0 ? '+' : ''}{crypto.change.toFixed(2)}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
