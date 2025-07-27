import { useState, useRef, useEffect, useCallback } from 'react';
import { Zap, Clock } from 'lucide-react';
import { miningAPI, purchaseAPI, userAPI } from '../utils/api';
import { getAndClearScrollFlag } from '../utils/scrollUtils';

interface MiningEngine {
  id: number;
  name: string;
  description: string;
  price: string;
  daily_earning_rate: string;
  duration_days: number;
  is_active: boolean;
}

export const Stake = () => {
  const [selectedEngine, setSelectedEngine] = useState(0);
  const [engines, setEngines] = useState<MiningEngine[]>([]);
  const [balance, setBalance] = useState('0.00');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [countdown, setCountdown] = useState<number>(0);
  const profitEnginesRef = useRef<HTMLDivElement>(null);

  // Define scrollToProfitEngines function with useCallback
  const scrollToProfitEngines = useCallback(() => {
    if (profitEnginesRef.current) {
      profitEnginesRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  }, []);

  // Initialize countdown timer from localStorage or set to 12 hours
  useEffect(() => {
    const initializeCountdown = () => {
      const savedCountdown = localStorage.getItem('stakingCountdown');
      const savedTime = localStorage.getItem('stakingCountdownTime');
      
      if (savedCountdown && savedTime) {
        const timeElapsed = Math.floor((Date.now() - parseInt(savedTime)) / 1000);
        const remainingTime = parseInt(savedCountdown) - timeElapsed;
        
        if (remainingTime > 0) {
          setCountdown(remainingTime);
        } else {
          // Timer expired, reset to 12 hours
          const newCountdown = 12 * 60 * 60; // 12 hours in seconds
          setCountdown(newCountdown);
          localStorage.setItem('stakingCountdown', newCountdown.toString());
          localStorage.setItem('stakingCountdownTime', Date.now().toString());
        }
      } else {
        // First time or no saved data, set to 12 hours
        const newCountdown = 12 * 60 * 60; // 12 hours in seconds
        setCountdown(newCountdown);
        localStorage.setItem('stakingCountdown', newCountdown.toString());
        localStorage.setItem('stakingCountdownTime', Date.now().toString());
      }
    };

    initializeCountdown();
  }, []);

  // Countdown timer effect
  useEffect(() => {
    if (countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown(prev => {
        const newCountdown = prev - 1;
        
        // Save to localStorage every minute to reduce writes
        if (newCountdown % 60 === 0) {
          localStorage.setItem('stakingCountdown', newCountdown.toString());
          localStorage.setItem('stakingCountdownTime', Date.now().toString());
        }
        
        return newCountdown;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  // Function to format countdown time
  const formatCountdown = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Function to reset countdown (called on login/signup)
  const resetCountdown = () => {
    const newCountdown = 12 * 60 * 60; // 12 hours in seconds
    setCountdown(newCountdown);
    localStorage.setItem('stakingCountdown', newCountdown.toString());
    localStorage.setItem('stakingCountdownTime', Date.now().toString());
  };

  // Check if user just logged in/signed up and reset countdown
  useEffect(() => {
    const userJustLoggedIn = localStorage.getItem('userJustLoggedIn');
    if (userJustLoggedIn === 'true') {
      resetCountdown();
      localStorage.removeItem('userJustLoggedIn');
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch mining engines and user profile
        const [enginesResponse, profileResponse] = await Promise.all([
          miningAPI.getEngines(),
          userAPI.getProfile()
        ]);
        
        setEngines(enginesResponse.engines || enginesResponse);
        setBalance(profileResponse.user.balance || '0.00');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle scroll flags from other components
  useEffect(() => {
    const scrollFlag = getAndClearScrollFlag();
    if (scrollFlag === 'scrollToProfitEngines') {
      // Small delay to ensure component is fully rendered
      setTimeout(() => {
        scrollToProfitEngines();
      }, 100);
    }
  }, [scrollToProfitEngines]);

  const handlePurchase = async (engineId: number, amount: number) => {
    setPurchaseLoading(true);
    setError(null);
    try {
      await purchaseAPI.create({
        engine_id: engineId,
        amount: amount
      });
      
      // Refresh balance after successful purchase
      const profileResponse = await userAPI.getProfile();
      setBalance(profileResponse.user.balance || '0.00');
      
      alert('Mining engine purchased successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to purchase mining engine');
    } finally {
      setPurchaseLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-orange-500 text-xl font-bold">Mining Operations</h2>
          <p className="text-slate-400 text-sm">Active mining operations</p>
        </div>
        <div className="bg-slate-700 px-3 py-1 rounded-lg">
          <p className="text-slate-400 text-sm">Balance: <span className="text-white font-bold">KSh {balance}</span></p>
        </div>
      </div>

      {/* Countdown Timer */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Clock className="w-6 h-6 text-white" />
            <div>
              <h3 className="text-white font-bold">Next Mining Window</h3>
              <p className="text-blue-200 text-sm">Time remaining to start new operations</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-white text-2xl font-bold font-mono">
              {formatCountdown(countdown)}
            </div>
            <p className="text-blue-200 text-xs">HH:MM:SS</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-600 text-white p-3 rounded mb-4 text-center">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center text-white">Loading mining engines...</div>
      ) : engines.length > 0 ? (
        <>
          {/* Featured Engine */}
          <div className="bg-gradient-to-r from-purple-600 to-orange-500 rounded-xl p-4 relative overflow-hidden">
            <div className="absolute top-3 left-3 bg-blue-500 text-white px-2 py-1 rounded text-xs font-bold">
              ★ Featured Engine
            </div>
            <div className="absolute top-3 right-3 flex items-center space-x-1 text-white text-sm">
              <Clock className="w-4 h-4" />
              <span>{formatCountdown(countdown)}</span>
            </div>
            <div className="mt-6">
              <div className="bg-purple-700 rounded-lg p-3 mb-3 flex items-center space-x-3">
                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold">1. {engines[0]?.name}</h3>
                  <div className="flex items-center space-x-4 text-white text-sm">
                    <div className="flex items-center space-x-1">
                      <Zap className="w-4 h-4" />
                      <span>{parseFloat(engines[0]?.daily_earning_rate || '0').toFixed(2)}% ROI</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{engines[0]?.duration_days} Days</span>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-white text-sm mb-3">Investment: KSh {engines[0]?.price}</p>
              <button 
                onClick={scrollToProfitEngines}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors"
              >
                ACTIVATE MINE 🚀
              </button>
            </div>
          </div>

          {/* All Engines */}
          <div className="bg-orange-500 text-black py-2 px-4 rounded-lg text-center font-bold">
            All Engines
          </div>

          {/* Engine Grid - 2 Columns */}
          <div className="grid grid-cols-2 gap-4" ref={profitEnginesRef}>
            {engines.map((engine: MiningEngine, index: number) => (
              <div
                key={engine.id}
                className={`bg-slate-800 rounded-lg p-4 border-2 transition-colors ${
                  selectedEngine === index ? 'border-orange-500' : 'border-slate-700'
                }`}
                onClick={() => setSelectedEngine(index)}
              >
                {/* Engine Header */}
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {engine.id}
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-sm">{engine.id}. {engine.name}</h3>
                      {selectedEngine === index && (
                        <span className="text-orange-500 text-xs">Selected</span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white text-lg font-bold">{engine.id}</p>
                  </div>
                </div>

                {/* Engine Details */}
                <div className="space-y-2 mb-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 text-xs">ROI:</span>
                    <span className="text-green-500 text-sm font-bold">{parseFloat(engine.daily_earning_rate || '0').toFixed(2)}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 text-xs">Duration:</span>
                    <span className="text-white text-sm">{engine.duration_days} Days</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 text-xs">Price:</span>
                    <span className="text-white text-sm font-bold">KSh {engine.price}</span>
                  </div>
                </div>

                {/* Purchase Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePurchase(engine.id, parseFloat(engine.price));
                  }}
                  disabled={purchaseLoading}
                  className="w-full bg-orange-500 text-white py-2 rounded-lg font-bold hover:bg-orange-600 transition-colors disabled:opacity-50"
                >
                  {purchaseLoading ? 'Purchasing...' : 'INVEST NOW'}
                </button>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center text-slate-400">No mining engines available</div>
      )}
    </div>
  );
};
