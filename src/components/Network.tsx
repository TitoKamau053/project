import React, { useState, useEffect } from 'react';
import { Users, Copy, Share2 } from 'lucide-react';
import { referralAPI } from '../utils/api';

export const Network = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [copied, setCopied] = useState(false);
  const [referralData, setReferralData] = useState({
    referralLink: '',
    totalReferrals: 0,
    totalEarnings: '0.00',
    referrals: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReferralData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch referral link
        const linkResponse = await referralAPI.generateReferralLink();
        
        // Fetch referral info
        const infoResponse = await referralAPI.getReferralInfo();
        
        setReferralData({
          referralLink: linkResponse.data.referral_link,
          totalReferrals: linkResponse.data.stats.total_referrals,
          totalEarnings: linkResponse.data.stats.total_commissions,
          referrals: infoResponse.referrals
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load referral data');
      } finally {
        setLoading(false);
      }
    };

    fetchReferralData();
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralData.referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Users className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-white text-2xl font-bold mb-2">Referral Program</h2>
        <p className="text-slate-400">Earn 10% of every deposit made by your referrals</p>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-800 rounded-lg p-1">
        {['overview', 'invite', 'rewards'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 px-4 rounded-md transition-colors capitalize ${
              activeTab === tab 
                ? 'bg-orange-500 text-white' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          {error && (
            <div className="bg-red-600 text-white p-3 rounded mb-4 text-center">
              {error}
            </div>
          )}
          
          {loading ? (
            <div className="text-center text-white">Loading referral data...</div>
          ) : (
            <>
              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-800 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Users className="w-5 h-5 text-blue-500" />
                    <span className="text-slate-400 text-sm">Referrals</span>
                  </div>
                  <p className="text-white text-2xl font-bold">{referralData.totalReferrals}</p>
                </div>
                <div className="bg-slate-800 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-5 h-5 bg-orange-500 rounded-full"></div>
                    <span className="text-slate-400 text-sm">Total Earnings</span>
                  </div>
                  <p className="text-white text-2xl font-bold">KES {referralData.totalEarnings}</p>
                </div>
              </div>

              {/* Referral Link */}
              <div className="bg-slate-800 rounded-lg p-4">
                <h3 className="text-white font-bold mb-3">Your Unique Referral Link</h3>
                <div className="bg-slate-900 rounded-lg p-3 mb-3">
                  <p className="text-slate-300 text-sm break-all">
                    {referralData.referralLink || 'Loading...'}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleCopy}
                    disabled={!referralData.referralLink}
                    className="bg-orange-500 text-white py-2 px-4 rounded-lg flex items-center justify-center space-x-2 hover:bg-orange-600 transition-colors disabled:opacity-50"
                  >
                    <Copy className="w-4 h-4" />
                    <span>{copied ? 'Copied!' : 'Copy'}</span>
                  </button>
                  <button className="bg-slate-700 text-white py-2 px-4 rounded-lg flex items-center justify-center space-x-2 hover:bg-slate-600 transition-colors">
                    <Share2 className="w-4 h-4" />
                    <span>Share Link</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Invite Tab */}
      {activeTab === 'invite' && (
        <div className="space-y-4">
          <div className="bg-slate-800 rounded-lg p-6 text-center">
            <Users className="w-16 h-16 text-orange-500 mx-auto mb-4" />
            <h3 className="text-white font-bold text-lg mb-2">Invite Friends</h3>
            <p className="text-slate-400 text-sm mb-4">
              Share your referral link and earn 10% commission on all their deposits
            </p>
            <div className="space-y-3">
              <button className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors">
                Share via WhatsApp
              </button>
              <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                Share via Telegram
              </button>
              <button className="w-full bg-slate-700 text-white py-3 rounded-lg font-semibold hover:bg-slate-600 transition-colors">
                More Options
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rewards Tab */}
      {activeTab === 'rewards' && (
        <div className="space-y-4">
          <div className="bg-slate-800 rounded-lg p-6 text-center">
            <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl">🎁</span>
            </div>
            <h3 className="text-white font-bold text-lg mb-2">Referral Rewards</h3>
            <p className="text-slate-400 text-sm mb-4">
              Track your commission earnings from referrals
            </p>
            <div className="bg-slate-900 rounded-lg p-4 mb-4">
              <p className="text-slate-400 text-sm">Total Commissions Earned</p>
              <p className="text-orange-500 text-2xl font-bold">KES 0.00</p>
            </div>
            <p className="text-slate-400 text-sm">
              You haven't earned any commissions yet. Start inviting friends to earn rewards!
            </p>
          </div>
        </div>
      )}
    </div>
  );
};