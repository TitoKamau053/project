import React, { useState, useEffect } from 'react';
import { RefreshCw, DollarSign, Clock, Zap, TrendingUp, Play, CheckCircle, AlertCircle, Timer, Target } from 'lucide-react';
import { purchaseAPI, earningsAPI } from '../utils/api';
import { sanitize, safeRender } from '../utils/sanitize';

interface Purchase {
  id: number;
  engine_id: number;
  engine_name: string;
  amount_invested: number;
  daily_earning: number;
  total_earned: number;
  start_date: string;
  end_date: string;
  last_earning_date?: string;
  status: string;
  earning_interval: string;
  
  // NEW: Exact timing fields
  periods_elapsed: number;
  total_periods: number;
  progress_percentage: number;
  next_earning_time?: string;
  period_earning: number;
  expected_earnings: number;
  earning_deficit: number;
  is_earning_up_to_date: boolean;
  days_remaining: number;
  is_completed: boolean;
}

interface EarningsSummary {
  summary: {
    active_purchases: number;
    total_logged_earnings: number;
    last_earning_time?: string;
    total_earning_logs: number;
    todays_earnings: number;
    last_7_days_earnings: number;
    last_hour_earnings: number;
  };
  upcoming_maturities: Array<{
    purchase_id: number;
    engine_name: string;
    earning_interval: string;
    next_maturity_time: string;
    next_earning_amount: number;
    minutes_until_maturity: number;
    formatted_amount: string;
    purchase_time: string;
  }>;
}

interface CountdownState {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isOverdue: boolean;
}

export const MiningNow = () => {
  const [activeTab, setActiveTab] = useState('active');
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [earningsSummary, setEarningsSummary] = useState<EarningsSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [countdowns, setCountdowns] = useState<{[key: number]: CountdownState}>({});

  // Real-time countdown calculator
  const calculateCountdown = (targetTime: string): CountdownState => {
    const now = new Date();
    const target = new Date(targetTime);
    const diff = target.getTime() - now.getTime();
    
    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isOverdue: true };
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    return { days, hours, minutes, seconds, isOverdue: false };
  };

  // Update countdowns every second
  useEffect(() => {
    const timer = setInterval(() => {
      const newCountdowns: {[key: number]: CountdownState} = {};
      
      purchases.forEach(purchase => {
        if (purchase.next_earning_time && purchase.status === 'active') {
          newCountdowns[purchase.id] = calculateCountdown(purchase.next_earning_time);
        }
      });
      
      setCountdowns(newCountdowns);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [purchases]);

  // Poll for updates every 30 seconds
  useEffect(() => {
    const pollUpdates = async () => {
      if (!loading) {
        await fetchData(false); // Silent update
      }
    };
    
    // Change from 30 seconds to 15 seconds for more responsive updates
    const interval = setInterval(pollUpdates, 15000);
    return () => clearInterval(interval);
  }, [loading]);

    const fetchData = async (showLoading = true) => {
      if (showLoading) setLoading(true);
      setError(null);
      
      try {
        const [purchasesData, summaryData] = await Promise.all([
          purchaseAPI.getUserPurchases({ include_timing: true }).catch(err => {
            console.warn('Failed to fetch purchases:', err);
            return { success: true, purchases: [] }; // Fallback to empty array
          }),
          earningsAPI.getEarningsSummary().catch(err => {
            console.warn('Failed to fetch earnings summary:', err);
            return { summary: { total_logged_earnings: 0 }, upcoming_maturities: [] }; // Fallback
          })
        ]);
        
        // Ensure data is properly sanitized
        const purchases = purchasesData.purchases || [];
        const summary = summaryData.summary || { total_logged_earnings: 0 };
        const upcomingMaturities = summaryData.upcoming_maturities || [];
        
        setPurchases(sanitize(purchases));
        setEarningsSummary(sanitize({ summary, upcoming_maturities: upcomingMaturities }));
      } catch (err) {
        console.error('Error fetching mining data:', err);
        setError(err instanceof Error ? err.message : 'Error fetching data');
        // Set empty fallback data to prevent UI crashes
        setPurchases([]);
        setEarningsSummary({ summary: { total_logged_earnings: 0 }, upcoming_maturities: [] });
      } finally {
        if (showLoading) setLoading(false);
      }
    };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const activePurchases = purchases.filter(p => p.status === 'active');
  const completedPurchases = purchases.filter(p => p.status === 'completed');

  const formatCountdown = (countdown: CountdownState): string => {
    if (countdown.isOverdue) return 'Ready to earn!';
    
    if (countdown.days > 0) {
      return `${countdown.days}d ${countdown.hours}h ${countdown.minutes}m`;
    } else if (countdown.hours > 0) {
      return `${countdown.hours}h ${countdown.minutes}m ${countdown.seconds}s`;
    } else {
      return `${countdown.minutes}m ${countdown.seconds}s`;
    }
  };

  const getStatusColor = (purchase: Purchase) => {
    if (purchase.earning_deficit > 0.01) return 'text-yellow-500';
    if (purchase.status === 'active') return 'text-green-500';
    return 'text-blue-500';
  };

  const getStatusIcon = (purchase: Purchase) => {
    if (purchase.earning_deficit > 0.01) return <AlertCircle className="w-4 h-4" />;
    if (purchase.status === 'active') return <Play className="w-4 h-4" />;
    return <CheckCircle className="w-4 h-4" />;
  };

  const formatExactTime = (datetime: string): string => {
    const date = new Date(datetime);
    const now = new Date();
    
    const isToday = date.toDateString() === now.toDateString();
    const isTomorrow = date.toDateString() === new Date(now.getTime() + 86400000).toDateString();
    
    const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    if (isToday) return `Today at ${timeStr}`;
    if (isTomorrow) return `Tomorrow at ${timeStr}`;
    return `${date.toLocaleDateString()} at ${timeStr}`;
  };

  if (loading && purchases.length === 0) {
    return (
      <div className="p-4 space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 text-orange-500 animate-spin mx-auto mb-2" />
            <p className="text-slate-400">Loading mining operations...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6 pb-20">
      {/* Header with Real-time Status */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <Zap className="w-6 h-6 text-orange-500" />
          <div>
            <h2 className="text-white text-xl font-bold">Mining Operations</h2>
            <p className="text-slate-400 text-sm">
              {activePurchases.length} active • Last update: {new Date().toLocaleTimeString()}
            </p>
          </div>
        </div>
        <button 
          onClick={handleRefresh}
          disabled={refreshing}
          className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors"
        >
          <RefreshCw className={`w-5 h-5 text-slate-400 ${refreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {error && (
        <div className="bg-red-600/20 border border-red-600/30 text-red-400 p-3 rounded-lg text-center">
          <AlertCircle className="w-5 h-5 inline mr-2" />
          {error}
        </div>
      )}

      {/* Available Mining Rewards */}
      <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-600/30 rounded-xl p-4">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <p className="text-green-400 text-sm font-medium">Available Mining Rewards</p>
            <p className="text-green-500 text-2xl font-bold">
              KES {safeRender(earningsSummary?.summary?.total_logged_earnings?.toLocaleString() || '0.00')}
            </p>
            <p className="text-green-300 text-xs">
              Total from {earningsSummary?.summary?.total_earning_logs || 0} earnings
            </p>
          </div>
        </div>
      </div>

      {/* Next Earning Countdown */}
      {earningsSummary?.upcoming_maturities && earningsSummary.upcoming_maturities.length > 0 && (
        <div className="bg-gradient-to-r from-orange-600/20 to-yellow-600/20 border border-orange-600/30 rounded-xl p-4">
          <div className="flex items-center space-x-3 mb-3">
            <Timer className="w-6 h-6 text-orange-400" />
            <div>
              <p className="text-orange-400 text-sm font-medium">Next Earning</p>
              <p className="text-white text-lg font-bold">
                {earningsSummary.upcoming_maturities[0].formatted_amount} from {earningsSummary.upcoming_maturities[0].engine_name}
              </p>
            </div>
          </div>
          
          <div className="bg-slate-800/50 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <span className="text-slate-300 text-sm">
                {formatExactTime(earningsSummary.upcoming_maturities[0].next_maturity_time)}
              </span>
              <div className="text-orange-400 font-mono font-bold">
                {earningsSummary.upcoming_maturities[0].minutes_until_maturity < 60 
                  ? `${earningsSummary.upcoming_maturities[0].minutes_until_maturity}m`
                  : `${Math.floor(earningsSummary.upcoming_maturities[0].minutes_until_maturity / 60)}h ${earningsSummary.upcoming_maturities[0].minutes_until_maturity % 60}m`
                }
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-slate-800 rounded-lg p-4 flex flex-col justify-center items-center">
        <div className="flex items-center space-x-2 mb-2">
          <DollarSign className="w-5 h-5 text-blue-500" />
          <span className="text-slate-400 text-sm font-semibold">Total Investment</span>
        </div>
        <p className="text-white text-2xl font-extrabold">
          KES {activePurchases.reduce((sum, p) => sum + (p.amount_invested || 0), 0).toLocaleString()}
        </p>
      </div>
        
        <div className="bg-slate-800 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Zap className="w-5 h-5 text-orange-500" />
            <span className="text-slate-400 text-sm">Active Engines</span>
          </div>
          <p className="text-white text-lg font-bold">{activePurchases.length}</p>
        </div>

        <div className="bg-slate-800 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="w-5 h-5 text-green-500" />
            <span className="text-slate-400 text-sm">Today's Earnings</span>
          </div>
          <p className="text-white text-lg font-bold">
            KES {safeRender(earningsSummary?.summary?.todays_earnings?.toLocaleString() || '0.00')}
          </p>
        </div>

        <div className="bg-slate-800 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Clock className="w-5 h-5 text-purple-500" />
            <span className="text-slate-400 text-sm">This Week</span>
          </div>
          <p className="text-white text-lg font-bold">
            KES {safeRender(earningsSummary?.summary?.last_7_days_earnings?.toLocaleString() || '0.00')}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-800 rounded-lg p-1">
        <button
          onClick={() => setActiveTab('active')}
          className={`flex-1 py-3 px-4 rounded-md transition-all duration-200 font-medium ${
            activeTab === 'active' 
              ? 'bg-orange-500 text-white shadow-lg' 
              : 'text-slate-400 hover:text-white hover:bg-slate-700'
          }`}
        >
          Active Mining ({activePurchases.length})
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`flex-1 py-3 px-4 rounded-md transition-all duration-200 font-medium ${
            activeTab === 'completed' 
              ? 'bg-orange-500 text-white shadow-lg' 
              : 'text-slate-400 hover:text-white hover:bg-slate-700'
          }`}
        >
          Completed ({completedPurchases.length})
        </button>
      </div>

      {/* Mining Operations List */}
      <div className="space-y-4">
        {activeTab === 'active' && (
          <>
            {activePurchases.length === 0 ? (
              <div className="text-center py-12 bg-slate-800 rounded-lg">
                <Zap className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400 text-lg mb-2">No Active Mining Operations</p>
                <p className="text-slate-500 text-sm">Start mining to see your active engines here</p>
              </div>
            ) : (
              activePurchases.map((purchase) => (
                <div key={purchase.id} className="bg-slate-800 rounded-lg p-4 border border-slate-700 hover:border-orange-500/50 transition-colors">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getStatusColor(purchase)} bg-current/20`}>
                        {getStatusIcon(purchase)}
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">{safeRender(purchase.engine_name)}</h3>
                        <p className="text-slate-400 text-sm">
                          {purchase.earning_interval} • ID: {purchase.id}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-bold">KES {purchase.amount_invested?.toLocaleString()}</p>
                      <p className="text-slate-400 text-sm">Invested</p>
                    </div>
                  </div>

                  {/* Exact Timing Progress */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-slate-400 text-sm">Mining Progress</span>
                  <span className="text-slate-300 text-sm">
                    {purchase.periods_elapsed}/{purchase.total_periods} periods ({typeof purchase.progress_percentage === 'number' ? purchase.progress_percentage.toFixed(1) : purchase.progress_percentage})
                  </span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-orange-500 to-yellow-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, purchase.progress_percentage || 0)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Earnings Info */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-slate-400 text-sm">Total Earned</p>
                      <p className="text-green-400 font-bold">KES {purchase.total_earned?.toLocaleString() || '0.00'}</p>
                      {purchase.expected_earnings > 0 && (
                        <p className="text-slate-500 text-xs">
                          Expected: KES {purchase.expected_earnings.toLocaleString()}
                        </p>
                      )}
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">
                        Per {purchase.earning_interval === 'hourly' ? 'Hour' : 'Day'}
                      </p>
                      <p className="text-blue-400 font-bold">
                        KES {purchase.period_earning?.toLocaleString() || purchase.daily_earning?.toLocaleString() || '0.00'}
                      </p>
                    </div>
                  </div>

                  {/* Real-time Countdown */}
                  {purchase.next_earning_time && countdowns[purchase.id] && (
                    <div className="bg-slate-700 rounded-lg p-3 mb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Timer className="w-4 h-4 text-orange-400" />
                          <span className="text-slate-300 text-sm">Next Earning</span>
                        </div>
                        <div className="text-right">
                          <div className={`font-mono font-bold ${
                            countdowns[purchase.id].isOverdue ? 'text-green-400' : 'text-orange-400'
                          }`}>
                            {formatCountdown(countdowns[purchase.id])}
                          </div>
                          <div className="text-slate-400 text-xs">
                            {formatExactTime(purchase.next_earning_time)}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Purchase Timeline */}
                  <div className="bg-slate-700/50 rounded-lg p-3">
                    <div className="flex items-center justify-between text-sm">
                      <div>
                        <span className="text-slate-400">Started:</span>
                        <span className="text-slate-300 ml-1">
                          {new Date(purchase.start_date).toLocaleDateString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400">Ends:</span>
                        <span className="text-slate-300 ml-1">
                          {new Date(purchase.end_date).toLocaleDateString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400">Remaining:</span>
                        <span className="text-orange-400 ml-1 font-medium">
                          {purchase.days_remaining} days
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Warning for earning deficit */}
{Number(purchase.earning_deficit) > 0.01 && (
  <div className="mt-3 bg-yellow-600/20 border border-yellow-600/30 rounded-lg p-2">
    <div className="flex items-center space-x-2">
      <AlertCircle className="w-4 h-4 text-yellow-400" />
      <span className="text-yellow-400 text-sm">
        Earnings processing delayed (KES {Number(purchase.earning_deficit).toFixed(2)} pending)
      </span>
    </div>
  </div>
)}
                </div>
              ))
            )}
          </>
        )}

      {activeTab === 'completed' && (
        <>
          {completedPurchases.length === 0 ? (
            <div className="text-center py-12 bg-slate-800 rounded-lg">
              <CheckCircle className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400 text-lg mb-2">No Completed Mining Operations</p>
              <p className="text-slate-500 text-sm">Completed mining engines will appear here</p>
            </div>
          ) : (
            completedPurchases.map((purchase) => {
              // Safe number parsing
              const amountInvested = parseFloat(purchase.amount_invested) || 0;
              const totalEarned = parseFloat(purchase.total_earned) || 0;
              const periodsElapsed = parseInt(purchase.periods_elapsed) || 0;
              const totalPeriods = parseInt(purchase.total_periods) || 0;
              
              // Calculate duration properly
              const startDate = new Date(purchase.start_date);
              const endDate = new Date(purchase.end_date);
              const durationDays = Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
              
              // Calculate ROI
              const roi = amountInvested > 0 ? ((totalEarned / amountInvested) - 1) * 100 : 0;
              
              return (
                <div key={purchase.id} className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">{purchase.engine_name}</h3>
                        <p className="text-slate-400 text-sm">
                          Completed • {periodsElapsed} {purchase.earning_interval || 'daily'} periods
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-green-400 font-bold">
                        +KES {totalEarned.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                      <p className="text-slate-400 text-sm">Total Earned</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <p className="text-slate-400 text-sm">Investment</p>
                      <p className="text-white font-medium">
                        KES {amountInvested.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">ROI</p>
                      <p className={`font-medium ${roi >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {roi >= 0 ? '+' : ''}{roi.toFixed(1)}%
                      </p>
                    </div>
                  </div>

                  {/* Completion Details */}
                  <div className="bg-slate-700/50 rounded-lg p-3">
                    <div className="flex justify-between items-center text-sm">
                      <div>
                        <span className="text-slate-400">Duration:</span>
                        <span className="text-slate-300 ml-1">{durationDays} days</span>
                      </div>
                      <div>
                        <span className="text-slate-400">Completed:</span>
                        <span className="text-slate-300 ml-1">
                          {new Date(purchase.end_date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-slate-400">
                      Periods: {periodsElapsed}/{totalPeriods} • 
                      Interval: {purchase.earning_interval || 'daily'}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </>
      )}
      </div>
    </div>
  );
};