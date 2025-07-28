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
  min_investment?: number;
  max_investment?: number;
}

export const Stake = () => {
  const [selectedEngine, setSelectedEngine] = useState(0);
  const [engines, setEngines] = useState<MiningEngine[]>([]);
  const [balance, setBalance] = useState('0.00');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [countdown, setCountdown] = useState<number>(0);
  const [showPurchaseSection, setShowPurchaseSection] = useState(false);
  const [purchaseAmount, setPurchaseAmount] = useState('');
  const purchaseSectionRef = useRef<HTMLDivElement>(null);
  const [engineDetails, setEngineDetails] = useState<MiningEngine | null>(null);
  const [purchaseFeedback, setPurchaseFeedback] = useState<string | null>(null);
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
        
        const sortedEngines = (enginesResponse.engines || enginesResponse).slice().sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        setEngines(sortedEngines);
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

  // Fetch engine details (with min/max investment) when user clicks purchase
  const handleShowPurchase = async (engineId: number) => {
    setPurchaseFeedback(null);
    setPurchaseAmount('');
    setShowPurchaseSection(true);
    setEngineDetails(null);
    try {
      setPurchaseLoading(true);
      // Fetch engine details from backend
      const details = await miningAPI.getEngineById(engineId);
      setEngineDetails(details.engine || details);
      setTimeout(() => {
        if (purchaseSectionRef.current) {
          purchaseSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } catch (err) {
      setPurchaseFeedback(err instanceof Error ? err.message : 'Failed to load engine details');
    } finally {
      setPurchaseLoading(false);
    }
  };

  // Handle purchase form submit
  const handlePurchaseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!engineDetails) return;
    setPurchaseLoading(true);
    setPurchaseFeedback(null);
    try {
      await purchaseAPI.create({
        engine_id: engineDetails.id,
        amount: parseFloat(purchaseAmount)
      });
      // Refresh balance after successful purchase
      const profileResponse = await userAPI.getProfile();
      setBalance(profileResponse.user.balance || '0.00');
      setPurchaseFeedback('Mining engine purchased successfully!');
      setShowPurchaseSection(false);
    } catch (err) {
      setPurchaseFeedback(err instanceof Error ? err.message : 'Failed to purchase mining engine');
    } finally {
      setPurchaseLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-6 max-w-full overflow-x-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-3">
            <Clock className="w-6 h-6 text-white" />
            <div>
              <h3 className="text-white font-bold">Next Mining Window</h3>
              <p className="text-blue-200 text-sm">Time remaining to start new operations</p>
            </div>
          </div>
          <div className="text-center sm:text-right">
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
                onClick={() => {
                  if (engines[0]) handleShowPurchase(engines[0].id);
                }}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors"
              >
                ACTIVATE ENGINE NOW
              </button>
            </div>
          </div>

          {/* All Engines */}
          <div className="bg-orange-500 text-black py-2 px-4 rounded-lg text-center font-bold">
            All Engines
          </div>

          {/* Engine Grid - Responsive */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" ref={profitEnginesRef}>
            {engines.map((engine: MiningEngine, index: number) => (
              <div
                key={engine.id}
                className={`bg-slate-800 rounded-lg p-4 border-2 transition-colors cursor-pointer ${
                  selectedEngine === index ? 'border-orange-500' : 'border-slate-700'
                }`}
                onClick={() => setSelectedEngine(index)}
              >
                {/* Engine Header */}
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-sm">No. {index + 1}. {engine.name}</h3>
                      {selectedEngine === index && (
                        <span className="text-orange-500 text-xs">Selected</span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white text-lg font-bold">No. {index + 1}</p>
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
                    <span className="text-slate-400 text-xs">Minimum Price:</span>
                    <span className="text-white text-sm font-bold break-words">KSh {engine.price}</span>
                  </div>
                </div>

                {/* Purchase Button */}
                <button
                  onClick={async (e) => {
                    e.stopPropagation();
                    await handleShowPurchase(engine.id);
                    setTimeout(() => {
                      window.scrollTo({
                        top: document.body.scrollHeight,
                        behavior: 'smooth',
                      });
                    }, 100); // slight delay to ensure modal is rendered
                  }}
                  className="w-full bg-orange-500 text-white py-2 rounded-lg font-bold hover:bg-orange-600 transition-colors disabled:opacity-50 text-sm sm:text-base"
                >
                  ACTIVATE
                </button>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center text-slate-400">No mining engines available</div>
      )}
      {/* Purchase Section (Inline, not modal) */}
      {showPurchaseSection && engineDetails && (
        <div ref={purchaseSectionRef} className="mt-8 bg-slate-800 rounded-lg p-6 w-full max-w-2xl mx-auto shadow-lg">
          <h3 className="text-white text-xl font-bold mb-4">Start New Profit Engines</h3>
          <form onSubmit={handlePurchaseSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 text-sm font-medium mb-1">Selected Engine</label>
                <input type="text" value={engineDetails.name} readOnly className="w-full bg-slate-700 text-white px-3 py-2 rounded" />
              </div>
              <div>
                <label className="block text-slate-400 text-sm font-medium mb-1">Return Percentage</label>
                <input type="text" value={parseFloat(engineDetails.daily_earning_rate || '0').toFixed(2) + '%'} readOnly className="w-full bg-slate-700 text-white px-3 py-2 rounded" />
              </div>
              <div>
                <label className="block text-slate-400 text-sm font-medium mb-1">Duration</label>
                <input type="text" value={engineDetails.duration_days + ' Day' + (engineDetails.duration_days > 1 ? 's' : '')} readOnly className="w-full bg-slate-700 text-white px-3 py-2 rounded" />
              </div>
              <div>
                <label className="block text-slate-400 text-sm font-medium mb-1">Minimum Amount</label>
                <input type="text" value={`KSh ${engineDetails.min_investment || engineDetails.price}`} readOnly className="w-full bg-slate-700 text-white px-3 py-2 rounded" />
              </div>
            </div>
            <div>
              <label className="block text-slate-400 text-sm font-medium mb-1">Engine Amount (KSh)</label>
              <input
                type="number"
                min={engineDetails.min_investment || engineDetails.price}
                max={engineDetails.max_investment || ''}
                step="0.01"
                value={purchaseAmount}
                onChange={e => setPurchaseAmount(e.target.value)}
                className="w-full bg-slate-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
              <div className="text-slate-400 text-xs mt-1">
                Min: <span className="text-white font-bold">KES {engineDetails.min_investment || engineDetails.price}</span>
                {engineDetails.max_investment && (
                  <>
                    {" | "}Max: <span className="text-white font-bold">KES {engineDetails.max_investment}</span>
                  </>
                )}
              </div>
            </div>
            {purchaseFeedback && (
              <div className={`p-2 rounded text-center ${purchaseFeedback.includes('success') ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
                {purchaseFeedback}
              </div>
            )}
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded"
                onClick={() => setShowPurchaseSection(false)}
                disabled={purchaseLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded font-bold"
                disabled={purchaseLoading}
              >
                {purchaseLoading ? 'Processing...' : 'Activate Engine Now'}
              </button>
            </div>
          </form>
          {/* Engine Summary Section */}
          <div className="mt-6 bg-slate-900 rounded-lg p-4">
            <h4 className="text-blue-200 font-bold mb-2 flex items-center"><span className="mr-2">📋</span>Engine Summary</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-800 rounded p-4 text-center">
                <div className="text-slate-400 text-sm mb-1">You Invest</div>
                <div className="text-2xl text-white font-bold">KSh {purchaseAmount || '0.00'}</div>
              </div>
              <div className="bg-slate-800 rounded p-4 text-center">
                <div className="text-slate-400 text-sm mb-1">You Earn</div>
                <div className="text-2xl text-green-400 font-bold">
                  KSh {purchaseAmount && engineDetails.daily_earning_rate ? (parseFloat(purchaseAmount) * parseFloat(engineDetails.daily_earning_rate) * engineDetails.duration_days / 100).toFixed(2) : '0.00'}
                </div>
              </div>
            </div>
            <div className="text-slate-400 text-xs mt-2">Returns are calculated after Engine period ends</div>
          </div>
        </div>
      )}
    </div>
  );
};
