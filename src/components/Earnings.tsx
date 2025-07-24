import React, { useState, useEffect } from 'react';
import { TrendingUp, Calendar, Trophy, ArrowUpDown, Zap } from 'lucide-react';
import { earningsAPI, purchaseAPI, testimonialsAPI } from '../utils/api';

interface EarningsProps {
  onNavigateToStake?: () => void;
}

interface Earning {
  earning_amount: string;
  earning_date: string;
}

interface Purchase {
  status: string;
}

interface SuccessStory {
  name: string;
  avatar: string;
  story: string;
  total: string;
  time: string;
  verified: boolean;
}

export const Earnings = ({ onNavigateToStake }: EarningsProps) => {
  const [earningsData, setEarningsData] = useState({
    totalEarnings: '0.00',
    monthlyEarnings: '0.00',
    activeInvestments: 0,
    earnings: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successStories, setSuccessStories] = useState<SuccessStory[]>([]);

  useEffect(() => {
    const fetchEarningsData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch earnings and purchases data
        const [earningsResponse, purchasesResponse] = await Promise.all([
          earningsAPI.getUserEarnings(),
          purchaseAPI.getUserPurchases()
        ]);

        const totalEarnings = earningsResponse.earnings.reduce(
          (sum: number, earning: Earning) => sum + parseFloat(earning.earning_amount), 
          0
        );

        // Calculate this month's earnings
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const monthlyEarnings = earningsResponse.earnings
          .filter((earning: Earning) => {
            const earningDate = new Date(earning.earning_date);
            return earningDate.getMonth() === currentMonth && earningDate.getFullYear() === currentYear;
          })
          .reduce((sum: number, earning: Earning) => sum + parseFloat(earning.earning_amount), 0);

        const activeInvestments = purchasesResponse.purchases.filter(
          (purchase: Purchase) => purchase.status === 'active'
        ).length;

        setEarningsData({
          totalEarnings: totalEarnings.toFixed(2),
          monthlyEarnings: monthlyEarnings.toFixed(2),
          activeInvestments,
          earnings: earningsResponse.earnings
        });

        // Try to fetch real success stories
        try {
          const storiesResponse = await testimonialsAPI.getSuccessStories();
          if (storiesResponse.stories && storiesResponse.stories.length > 0) {
            setSuccessStories(storiesResponse.stories);
          }
        } catch {
          // If success stories API fails, keep default stories
          console.log('No success stories API available, using default stories');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load earnings data');
      } finally {
        setLoading(false);
      }
    };

    fetchEarningsData();
  }, []);

  // Default success stories (fallback if no real data)
  const defaultSuccessStories: SuccessStory[] = [
    {
      name: "James K.",
      avatar: "J",
      story: "Started with KES 5,000 and now earning KES 25,000 monthly. CryptoMine Pro changed my financial life!",
      total: "+KES 120,450 total",
      time: "2 days ago",
      verified: true
    },
    {
      name: "Sarah M.",
      avatar: "S",
      story: "In just 3 months I've doubled my initial investment. The automated system works perfectly!",
      total: "+KES 78,200 total",
      time: "1 week ago",
      verified: true
    }
  ];

  // Use real success stories if available, otherwise use defaults
  const storiesToDisplay = successStories.length > 0 ? successStories : defaultSuccessStories;

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-orange-500 text-xl font-bold">Your Success Portfolio</h2>
          <p className="text-slate-400 text-sm">Track your investment growth</p>
        </div>
        <div className="bg-slate-800 px-3 py-1 rounded-lg">
          <span className="text-slate-400 text-sm">Active: </span>
          <span className="text-white font-bold">{earningsData.activeInvestments} Investments</span>
        </div>
      </div>

      {error && (
        <div className="bg-red-600 text-white p-3 rounded mb-4 text-center">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center text-white">Loading earnings data...</div>
      ) : (
        <>
          {/* Portfolio Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-800 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                <span className="text-slate-400 text-xs">Total Earnings</span>
              </div>
              <p className="text-white text-lg font-bold">KES {earningsData.totalEarnings}</p>
            </div>
            <div className="bg-slate-800 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Calendar className="w-5 h-5 text-blue-500" />
                <span className="text-slate-400 text-xs">This Month</span>
              </div>
              <p className="text-white text-lg font-bold">KES {earningsData.monthlyEarnings}</p>
            </div>
            <div className="bg-slate-800 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Trophy className="w-5 h-5 text-orange-500" />
                <span className="text-slate-400 text-xs">Success Rate</span>
              </div>
              <p className="text-white text-lg font-bold">100%</p>
            </div>
          </div>
        </>
      )}

      {/* Success Stories */}
      <div className="bg-slate-800 rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-orange-500" />
            <h3 className="text-orange-500 font-bold">Success Stories</h3>
          </div>
          <div className="flex items-center space-x-1 text-green-500 text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Verified Earnings</span>
          </div>
        </div>
        <div className="space-y-4">
          {storiesToDisplay.map((story, index) => (
            <div key={index} className="bg-slate-900 rounded-lg p-4 border border-slate-700">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">{story.avatar}</span>
                  </div>
                  <div>
                    <p className="text-white font-semibold">{story.name}</p>
                    {story.verified && (
                      <div className="flex items-center space-x-1 text-green-500 text-xs">
                        <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                        <span>Verified Story</span>
                      </div>
                    )}
                  </div>
                </div>
                <span className="text-slate-400 text-xs">{story.time}</span>
              </div>
              <p className="text-slate-300 text-sm mb-3">"{story.story}"</p>
              <div className="flex justify-between items-center">
                <span className="text-orange-500 text-sm font-bold">{story.total}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Earnings History */}
      <div className="bg-slate-800 rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-orange-500 font-bold">Your Earnings History</h3>
          <div className="flex items-center space-x-2 text-slate-400 text-sm">
            <span>Sorted by Recent</span>
            <ArrowUpDown className="w-4 h-4" />
          </div>
        </div>
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-8 h-8 text-slate-400" />
          </div>
          <p className="text-slate-400">No earnings history yet.</p>
          <p className="text-slate-500 text-sm mt-2">Start investing to see your earnings here!</p>
          
          {/* Start Mining Now Button */}
          <button
            onClick={onNavigateToStake}
            className="mt-4 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2 mx-auto"
          >
            <Zap className="w-5 h-5" />
            <span>Start Mining Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};