import { CryptoIcon } from './CryptoIcon';
import { getAllCryptoIcons } from '../utils/cryptoIcons';

export const CryptoShowcase = () => {
  const allCryptos = getAllCryptoIcons();

  return (
    <div className="bg-slate-800 rounded-lg p-4">
      <h3 className="text-white font-semibold mb-4">Supported Cryptocurrencies</h3>
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4">
        {allCryptos.map((crypto) => (
          <div key={crypto.symbol} className="flex flex-col items-center">
            <div className="w-12 h-12 flex items-center justify-center mb-2">
              <CryptoIcon 
                symbol={crypto.symbol} 
                size="lg"
                showBackground={true}
              />
            </div>
            <span className="text-slate-400 text-xs text-center">{crypto.symbol}</span>
            <span className="text-slate-500 text-xs text-center truncate w-full">{crypto.name}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 text-center">
        <p className="text-slate-400 text-sm">
          Powered by <span className="text-orange-500">@iconify/react</span> with {allCryptos.length}+ cryptocurrency icons
        </p>
      </div>
    </div>
  );
};
