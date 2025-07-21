import { useState, useEffect } from 'react';
import { Plus, ArrowUp, Users, Zap, TrendingUp, X } from 'lucide-react';
import TradingViewWidget from './TradingViewWidget';
import { LivePrices } from './LivePrices';
import { DepositModal } from './DepositModal';
import { WithdrawModal } from './WithdrawModal';
import { CryptoIcon } from './CryptoIcon';

interface DashboardProps {
  onDepositClick?: () => void;
  onWithdrawClick?: () => void;
}

export const Dashboard = ({ onDepositClick, onWithdrawClick }: DashboardProps) => {
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);

  // Simulated live activity data
  const liveActivities = [
    {
      name: 'Emma W.',
      avatar: 'E',
      action: 'Starter Withdraw',
      amount: '-KES 192,423.19',
      time: '1 min ago',
      crypto: 'BTC',
      color: 'bg-blue-500'
    },
    {
      name: 'John K.',
      avatar: 'J',
      action: 'Mining Reward',
      amount: '+KES 45,230.50',
      time: '3 min ago',
      crypto: 'ETH',
      color: 'bg-green-500'
    },
    {
      name: 'Sarah M.',
      avatar: 'S',
      action: 'Deposit Success',
      amount: '+KES 78,900.00',
      time: '5 min ago',
      crypto: 'USDT',
      color: 'bg-purple-500'
    },
    {
      name: 'David L.',
      avatar: 'D',
      action: 'Triple Mine Profit',
      amount: '+KES 156,780.25',
      time: '7 min ago',
      crypto: 'BNB',
      color: 'bg-orange-500'
    },
    {
      name: 'Lisa R.',
      avatar: 'L',
      action: 'Referral Bonus',
      amount: '+KES 32,450.00',
      time: '9 min ago',
      crypto: 'ADA',
      color: 'bg-pink-500'
    }
  ];

  // Rotate live activity every 5-10 seconds (randomized)
  useEffect(() => {
    const getRandomInterval = () => Math.floor(Math.random() * 5000) + 5000; // 5-10 seconds
    
    const scheduleNext = () => {
      const timeout = setTimeout(() => {
        setCurrentActivityIndex((prev) => (prev + 1) % liveActivities.length);
        scheduleNext();
      }, getRandomInterval());
      
      return timeout;
    };
    
    const timeout = scheduleNext();
    return () => clearTimeout(timeout);
  }, [liveActivities.length]);

  const currentActivity = liveActivities[currentActivityIndex];

  const handleDepositClick = () => {
    setShowDepositModal(true);
    if (onDepositClick) onDepositClick();
  };

  const handleWithdrawClick = () => {
    setShowWithdrawModal(true);
    if (onWithdrawClick) onWithdrawClick();
  };

  return (
    <div className="p-4 space-y-6">
      
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
        <div className="flex items-center space-x-4 text-white text-sm">
          <div className="flex items-center space-x-1">
            <Zap className="w-4 h-4" />
            <span>Instant bonus payout</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="w-4 h-4" />
            <span>103,357 people joined</span>
          </div>
        </div>
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
          <span className="text-orange-500 text-sm">Volume: KES 30.88M</span>
        </div>
        <div className="bg-slate-800 rounded-lg p-3 flex items-center space-x-3 transition-all duration-500">
          <div className={`w-8 h-8 ${currentActivity.color} rounded-full flex items-center justify-center`}>
            <span className="text-white text-sm font-bold">{currentActivity.avatar}</span>
          </div>
          <div className="flex-1">
            <p className="text-white text-sm font-medium">{currentActivity.name}</p>
            <div className="flex items-center space-x-2">
              <p className="text-slate-400 text-xs">{currentActivity.action}</p>
              <CryptoIcon symbol={currentActivity.crypto} size="sm" />
            </div>
          </div>
          <div className="text-right">
            <p className={`text-sm font-semibold ${
              currentActivity.amount.startsWith('+') ? 'text-green-500' : 'text-orange-500'
            }`}>
              {currentActivity.amount}
            </p>
            <p className="text-slate-400 text-xs">{currentActivity.time}</p>
          </div>
        </div>
      </div>

      {/* Balance */}
      <div>
        <p className="text-slate-400 text-sm mb-1">Total Balance</p>
        <h2 className="text-orange-500 text-3xl font-bold mb-4">KES 0.00</h2>
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
          <p className="text-white text-lg font-bold">KES 0.00</p>
        </div>
        <div className="bg-slate-800 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Users className="w-5 h-5 text-blue-500" />
            <span className="text-slate-400 text-sm">Active Miners</span>
          </div>
          <p className="text-white text-lg font-bold">0</p>
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