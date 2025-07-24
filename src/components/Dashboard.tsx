import { useState, useEffect } from 'react';
import { Plus, ArrowUp, Users, Zap, TrendingUp, X } from 'lucide-react';
import TradingViewWidget from './TradingViewWidget';
import { LivePrices } from './LivePrices';
import { DepositModal } from './DepositModal';
import { WithdrawModal } from './WithdrawModal';
import { CryptoIcon } from './CryptoIcon';
import { userAPI, purchaseAPI } from '../utils/api';

interface Activity {
  name: string;
  avatar: string;
  action: string;
  amount: string;
  time: string;
  crypto: string;
  color: string;
}

interface DashboardProps {
  onActivateMine?: () => void;
}

export const Dashboard = ({ onActivateMine }: DashboardProps) => {
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
  const [balance, setBalance] = useState('0.00');
  const [totalProfit, setTotalProfit] = useState('0.00');
  const [activeMiners, setActiveMiners] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [simulatedVolume, setSimulatedVolume] = useState(30.88);

  // Kenyan context simulated activities - at least 15 activities
  const simulatedActivities: Activity[] = [
    { name: 'Brian K.', avatar: 'B', action: 'activated CryptoMine Pro', amount: '+KES 15,420', time: '2 mins ago', crypto: 'BTC', color: 'bg-green-600' },
    { name: 'Sarah M.', avatar: 'S', action: 'completed Daily Mine', amount: '+KES 8,750', time: '3 mins ago', crypto: 'ETH', color: 'bg-blue-600' },
    { name: 'John K.', avatar: 'J', action: 'withdrew to M-Pesa', amount: '-KES 12,000', time: '5 mins ago', crypto: 'USDT', color: 'bg-orange-600' },
    { name: 'Grace W.', avatar: 'G', action: 'started Triple Mine', amount: '+KES 22,150', time: '7 mins ago', crypto: 'BTC', color: 'bg-purple-600' },
    { name: 'David O.', avatar: 'D', action: 'deposited via M-Pesa', amount: '+KES 5,000', time: '8 mins ago', crypto: 'ETH', color: 'bg-teal-600' },
    { name: 'Mary N.', avatar: 'M', action: 'earned referral bonus', amount: '+KES 3,250', time: '10 mins ago', crypto: 'LTC', color: 'bg-indigo-600' },
    { name: 'Peter K.', avatar: 'P', action: 'activated Crypto Blast', amount: '+KES 18,900', time: '12 mins ago', crypto: 'BTC', color: 'bg-green-600' },
    { name: 'Agnes M.', avatar: 'A', action: 'completed mining cycle', amount: '+KES 9,430', time: '15 mins ago', crypto: 'ETH', color: 'bg-blue-600' },
    { name: 'Joseph L.', avatar: 'J', action: 'deposited KES 10K', amount: '+KES 10,000', time: '18 mins ago', crypto: 'USDT', color: 'bg-yellow-600' },
    { name: 'Ruth K.', avatar: 'R', action: 'withdrew earnings', amount: '-KES 7,500', time: '20 mins ago', crypto: 'BTC', color: 'bg-orange-600' },
    { name: 'Samuel N.', avatar: 'S', action: 'joined via referral', amount: '+KES 1,000', time: '22 mins ago', crypto: 'ETH', color: 'bg-purple-600' },
    { name: 'Catherine W.', avatar: 'C', action: 'activated Pro Miner', amount: '+KES 25,750', time: '25 mins ago', crypto: 'BTC', color: 'bg-green-600' },
    { name: 'Michael O.', avatar: 'M', action: 'completed staking', amount: '+KES 14,200', time: '28 mins ago', crypto: 'LTC', color: 'bg-indigo-600' },
    { name: 'Faith M.', avatar: 'F', action: 'deposited via Bank', amount: '+KES 20,000', time: '30 mins ago', crypto: 'USDT', color: 'bg-teal-600' },
    { name: 'Daniel K.', avatar: 'D', action: 'earned mining reward', amount: '+KES 11,650', time: '32 mins ago', crypto: 'ETH', color: 'bg-blue-600' },
    { name: 'Joyce N.', avatar: 'J', action: 'activated Hourly Mine', amount: '+KES 6,800', time: '35 mins ago', crypto: 'BTC', color: 'bg-green-600' }
  ];

  // Get activities to display (simulated activities for better UX)
  const activitiesToDisplay = simulatedActivities;

  // Simulate volume changes every 3-5 seconds
  useEffect(() => {
    const updateVolume = () => {
      setSimulatedVolume(prev => {
        // Random change between -2% to +3%
        const changePercent = (Math.random() * 5 - 2) / 100;
        const newVolume = prev * (1 + changePercent);
        return Math.max(25, Math.min(50, newVolume)); // Keep between 25M and 50M
      });
    };

    const volumeInterval = setInterval(updateVolume, Math.random() * 2000 + 3000); // 3-5 seconds
    return () => clearInterval(volumeInterval);
  }, []);

  // Rotate live activity every 5-10 seconds (randomized)
  useEffect(() => {
    if (activitiesToDisplay.length === 0) return;
    
    const getRandomInterval = () => Math.floor(Math.random() * 5000) + 5000; // 5-10 seconds
    
    const scheduleNext = () => {
      const timeout = setTimeout(() => {
        setCurrentActivityIndex((prev) => (prev + 1) % activitiesToDisplay.length);
        scheduleNext();
      }, getRandomInterval());
      
      return timeout;
    };
    
    const timeout = scheduleNext();
    return () => clearTimeout(timeout);
  }, [activitiesToDisplay.length]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setError(null);
      try {
        // Fetch user profile data
        const profileData = await userAPI.getProfile();
        setBalance(profileData.user.balance || '0.00');
        setTotalProfit(profileData.user.total_earnings || '0.00');
        
        // Fetch user purchases to count active miners
        try {
          const purchasesData = await purchaseAPI.getUserPurchases();
          const activePurchases = purchasesData.purchases.filter((p: { status: string }) => p.status === 'active');
          setActiveMiners(activePurchases.length);
        } catch {
          // If purchases endpoint fails, just set to 0
          setActiveMiners(0);
        }

        // We're using simulated activities, no need to fetch from API
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Error fetching dashboard data');
        }
      }
    };
    fetchDashboardData();
  }, []);

  const handleDepositClick = () => {
    setShowDepositModal(true);
  };

  const handleWithdrawClick = () => {
    setShowWithdrawModal(true);
  };

  return (
    <div className="p-4 space-y-6">
      
      {/* Error Message */}
      {error && (
        <div className="bg-red-600 text-white p-3 rounded-lg text-center">
          {error}
        </div>
      )}
      
      {/* Promotional Banner */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-4 relative overflow-hidden">
        <div className="absolute top-2 right-2 bg-orange-500 text-white px-2 py-1 rounded text-xs font-bold">
          HOT OFFER
        </div>
        <div className="flex items-center space-x-3 mb-2">
          <Zap className="w-6 h-6 text-white" />
          <h2 className="text-white font-bold text-lg">INSTANT 50% PROFIT!</h2>
        </div>
        <p className="text-white text-sm mb-3">
          <strong>RIGHT NOW:</strong> Invest into Hourly Mine Engines and get <strong>50% EXTRA</strong> in just 60 minutes!
        </p>
        <div className="flex items-center space-x-4 text-white text-sm mb-4">
          <div className="flex items-center space-x-1">
            <Zap className="w-4 h-4" />
            <span>Instant bonus payout</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="w-4 h-4" />
            <span>103,357 people joined</span>
          </div>
        </div>
        <button 
          onClick={onActivateMine}
          className="w-full bg-white text-purple-600 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors flex items-center justify-center space-x-2"
        >
          <Zap className="w-5 h-5" />
          <span>🚀 ACTIVATE MINE NOW</span>
        </button>
      </div>

      {/* Live Activity */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center space-x-2">
            <h3 className="text-white font-semibold">Live Activity</h3>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-500 text-xs font-medium">LIVE</span>
            </div>
          </div>
          <span className="text-orange-500 text-sm">Volume: KES {simulatedVolume.toFixed(2)}M</span>
        </div>
        <div className="bg-slate-800 rounded-lg p-3 flex items-center space-x-3 transition-all duration-500">
          <div className={`w-8 h-8 ${activitiesToDisplay[currentActivityIndex].color} rounded-full flex items-center justify-center`}>
            <span className="text-white text-sm font-bold">{activitiesToDisplay[currentActivityIndex].avatar}</span>
          </div>
          <div className="flex-1">
            <p className="text-white text-sm font-medium">{activitiesToDisplay[currentActivityIndex].name}</p>
            <div className="flex items-center space-x-2">
              <p className="text-slate-400 text-xs">{activitiesToDisplay[currentActivityIndex].action}</p>
              <CryptoIcon symbol={activitiesToDisplay[currentActivityIndex].crypto} size="sm" />
            </div>
          </div>
          <div className="text-right">
            <p className={`text-sm font-semibold ${
              activitiesToDisplay[currentActivityIndex].amount.startsWith('+') ? 'text-green-500' : 'text-orange-500'
            }`}>
              {activitiesToDisplay[currentActivityIndex].amount}
            </p>
            <p className="text-slate-400 text-xs">{activitiesToDisplay[currentActivityIndex].time}</p>
          </div>
        </div>
      </div>

      {/* Balance */}
      <div>
        <p className="text-slate-400 text-sm mb-1">Total Balance</p>
        <h2 className="text-orange-500 text-3xl font-bold mb-4">KES {balance}</h2>
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={handleDepositClick}
            className="bg-orange-500 text-white py-3 px-4 rounded-lg flex items-center justify-center space-x-2 hover:bg-orange-600 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Deposit</span>
          </button>
          <button 
            onClick={handleWithdrawClick}
            className="bg-slate-700 text-white py-3 px-4 rounded-lg flex items-center justify-center space-x-2 hover:bg-slate-600 transition-colors"
          >
            <ArrowUp className="w-5 h-5" />
            <span>Withdraw</span>
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-800 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="w-5 h-5 text-green-500" />
            <span className="text-slate-400 text-sm">Today's Profit</span>
          </div>
          <p className="text-white text-lg font-bold">KES {totalProfit}</p>
        </div>
        <div className="bg-slate-800 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Users className="w-5 h-5 text-blue-500" />
            <span className="text-slate-400 text-sm">Active Miners</span>
          </div>
          <p className="text-white text-lg font-bold">{activeMiners}</p>
        </div>
      </div>
      {/* TradingView Chart */}
      <div className="bg-slate-800 rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-white font-semibold">Market Chart</h3>
          <span className="text-slate-400 text-sm">Live Trading Data</span>
        </div>
        <div className="h-96 rounded-lg overflow-hidden">
          <TradingViewWidget />
        </div>
      </div>
      
      {/* Live Prices */}
      <LivePrices />

      {/* Deposit Modal */}
      {showDepositModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-slate-700">
              <h2 className="text-white font-bold text-lg">Deposit Funds</h2>
              <button
                onClick={() => setShowDepositModal(false)}
                className="text-slate-400 hover:text-white transition-colors"
                title="Close deposit modal"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-4">
              <DepositModal onBack={() => setShowDepositModal(false)} />
            </div>
          </div>
        </div>
      )}

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-slate-700">
              <h2 className="text-white font-bold text-lg">Withdraw Funds</h2>
              <button
                onClick={() => setShowWithdrawModal(false)}
                className="text-slate-400 hover:text-white transition-colors"
                title="Close withdraw modal"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-4">
              <WithdrawModal onBack={() => setShowWithdrawModal(false)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
