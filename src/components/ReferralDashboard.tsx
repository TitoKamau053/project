import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Copy, 
  Check, 
  Share2, 
  Gift, 
  DollarSign, 
  UserPlus, 
  TrendingUp,
  ExternalLink,
  Trophy,
  ArrowUp,
  RefreshCw
} from 'lucide-react';
import { referralAPI } from '../utils/api';
import { Logo } from './Logo';

interface ReferralStats {
  total_referrals: number;
  active_referrals: number;
  total_commissions_earned: number;
  avg_commission_per_referral: number;
}

interface ReferralData {
  referral_code: string;
  referral_link: string;
  short_referral_link?: string;
  share_message: string;
  stats: {
    total_referrals: number;
    total_commissions: number;
  };
}

interface Commission {
  id: number;
  commission_amount: number;
  commission_type: string;
  created_at: string;
  referred_name: string;
  referred_email: string;
}

interface Referrer {
  id: number;
  name: string;
  email: string;
  referral_code: string;
}

export const ReferralDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [referralData, setReferralData] = useState<ReferralData | null>(null);
  const [referralStats, setReferralStats] = useState<ReferralStats | null>(null);
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [myReferrer, setMyReferrer] = useState<Referrer | null>(null);
  const [commissionsPage, setCommissionsPage] = useState(1);
  const [hasMoreCommissions, setHasMoreCommissions] = useState(true);

  useEffect(() => {
    fetchReferralData();
  }, []);

  const fetchReferralData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch core referral data first
      const [linkResponse, infoResponse] = await Promise.all([
        referralAPI.generateReferralLink(),
        referralAPI.getReferralInfo()
      ]);
      
      // Try to fetch commissions separately to handle potential server errors
      let commissionsResponse = { commissions: [], pagination: { pages: 1 } };
      try {
        commissionsResponse = await referralAPI.getCommissions(1, 10);
      } catch (commissionsError) {
        console.warn('Failed to load commissions:', commissionsError);
        // Continue without commissions data
      }
      
      // Fetch referrer info (optional - user might not have one)
      let referrerInfo = null;
      try {
        const referrerResponse = await referralAPI.getMyReferrer();
        referrerInfo = referrerResponse.referrer;
      } catch (err) {
        console.log('No referrer found:', err);
      }
      
      setReferralData(linkResponse.data);
      setReferralStats(infoResponse.statistics);
      setCommissions(commissionsResponse.commissions || []);
      setMyReferrer(referrerInfo);
      setHasMoreCommissions((commissionsResponse.pagination?.pages || 1) > 1);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load referral data');
    } finally {
      setLoading(false);
    }
  };

  const loadMoreCommissions = async () => {
    if (!hasMoreCommissions) return;
    
    try {
      const response = await referralAPI.getCommissions(commissionsPage + 1, 10);
      setCommissions(prev => [...prev, ...(response.commissions || [])]);
      setCommissionsPage(prev => prev + 1);
      setHasMoreCommissions((response.pagination?.page || 1) < (response.pagination?.pages || 1));
    } catch (err) {
      console.error('Failed to load more commissions:', err);
    }
  };

  const handleCopy = async () => {
    if (!referralData?.referral_link) return;
    
    try {
      await navigator.clipboard.writeText(referralData.referral_link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleShare = async (platform: string) => {
    if (!referralData) return;
    
    const shareText = referralData.share_message;
    const link = referralData.short_referral_link || referralData.referral_link;
    
    switch (platform) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank');
        break;
      case 'telegram':
        window.open(`https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent('Join me on CryptoMine Pro!')}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}`, '_blank');
        break;
      case 'copy':
        handleCopy();
        break;
    }
  };

  if (loading) {
    return (
      <div className="p-4 space-y-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
          <p className="text-slate-400 mt-2">Loading referral data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 space-y-6">
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-center">
          <p className="text-red-400">{error}</p>
          <button
            onClick={fetchReferralData}
            className="mt-3 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="mx-auto mb-4">
          <Logo size="lg" />
        </div>
        <h2 className="text-white text-2xl font-bold mb-2">Referral Program</h2>
        <p className="text-slate-400">Invite friends and earn 10% commission on their first deposit</p>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-800 rounded-lg p-1">
        {[
          { key: 'overview', label: 'Overview', icon: TrendingUp },
          { key: 'invite', label: 'Invite Friends', icon: Share2 },
          { key: 'earnings', label: 'Earnings', icon: DollarSign }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center space-x-2 ${
              activeTab === tab.key
                ? 'bg-orange-500 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          {/* Referrer Info */}
          {myReferrer && (
            <div className="bg-slate-800 rounded-lg p-4 border border-green-500/20">
              <div className="flex items-center space-x-2 mb-3">
                <Gift className="w-5 h-5 text-green-400" />
                <h3 className="text-white font-semibold">You were invited by</h3>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-400 font-medium">{myReferrer.name}</p>
                  <p className="text-slate-400 text-sm">{myReferrer.email}</p>
                </div>
                <div className="text-right">
                  <p className="text-slate-400 text-xs">Referral Code</p>
                  <p className="text-orange-400 font-mono text-sm">{myReferrer.referral_code}</p>
                </div>
              </div>
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-800 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <UserPlus className="w-5 h-5 text-blue-500" />
                <span className="text-slate-400 text-sm">Total Referrals</span>
              </div>
              <p className="text-white text-2xl font-bold">{referralStats?.total_referrals || 0}</p>
              <p className="text-slate-500 text-xs mt-1">People you've invited</p>
            </div>
            <div className="bg-slate-800 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <DollarSign className="w-5 h-5 text-green-500" />
                <span className="text-slate-400 text-sm">Total Earnings</span>
              </div>
              <p className="text-white text-2xl font-bold">KES {Number(referralStats?.total_commissions_earned || 0).toFixed(2)}</p>
              <p className="text-slate-500 text-xs mt-1">Commission earned</p>
            </div>
          </div>

          {/* Performance */}
          <div className="bg-slate-800 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-3">
              <TrendingUp className="w-5 h-5 text-orange-500" />
              <h3 className="text-white font-semibold">Referral Performance</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">Commission Rate</span>
                <span className="text-orange-400 font-semibold">10%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">Active Referrals</span>
                <span className="text-white font-medium">{referralStats?.active_referrals || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">Average per Referral</span>
                <span className="text-white font-medium">
                  KES {Number(referralStats?.avg_commission_per_referral || 0).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Referral Link */}
          <div className="bg-slate-800 rounded-lg p-4">
            <h3 className="text-white font-semibold mb-3">Your Referral Link</h3>
            <div className="flex space-x-2">
              <input
                type="text"
                value={referralData?.referral_link || ''}
                readOnly
                placeholder="Your referral link will appear here"
                className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm"
              />
              <button
                onClick={handleCopy}
                className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center space-x-2"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invite Friends Tab */}
      {activeTab === 'invite' && (
        <div className="space-y-4">
          <div className="bg-slate-800 rounded-lg p-4 text-center">
            <h3 className="text-white font-semibold mb-2">Share your referral link</h3>
            <p className="text-slate-400 text-sm mb-4">
              Share your referral link and earn 10% commission on their first deposit
            </p>
            <div className="space-y-3">
              <button 
                onClick={() => handleShare('whatsapp')}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
              >
                <ExternalLink className="w-5 h-5" />
                <span>Share via WhatsApp</span>
              </button>
              <button 
                onClick={() => handleShare('telegram')}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
              >
                <ExternalLink className="w-5 h-5" />
                <span>Share via Telegram</span>
              </button>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => handleShare('twitter')}
                  className="bg-blue-400 text-white py-3 rounded-lg font-semibold hover:bg-blue-500 transition-colors flex items-center justify-center space-x-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Twitter</span>
                </button>
                <button 
                  onClick={() => handleShare('facebook')}
                  className="bg-blue-700 text-white py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors flex items-center justify-center space-x-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Facebook</span>
                </button>
              </div>
              <button 
                onClick={() => handleShare('copy')}
                className="w-full bg-slate-700 text-white py-3 rounded-lg font-semibold hover:bg-slate-600 transition-colors flex items-center justify-center space-x-2"
              >
                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                <span>{copied ? 'Link Copied!' : 'Copy Link'}</span>
              </button>
            </div>
          </div>

          {/* Referral Code Display */}
          <div className="bg-slate-800 rounded-lg p-4">
            <h3 className="text-white font-semibold mb-3">Your Referral Code</h3>
            <div className="bg-slate-700 rounded-lg p-3 text-center">
              <p className="text-orange-400 font-mono text-2xl font-bold">{referralData?.referral_code}</p>
              <p className="text-slate-400 text-sm mt-1">Share this code with friends</p>
            </div>
          </div>

          {/* How it Works */}
          <div className="bg-slate-800 rounded-lg p-4">
            <h3 className="text-white font-semibold mb-3">How it Works</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">1</span>
                </div>
                <div>
                  <p className="text-white font-medium">Share your link</p>
                  <p className="text-slate-400 text-sm">Send your referral link to friends and family</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">2</span>
                </div>
                <div>
                  <p className="text-white font-medium">They sign up</p>
                  <p className="text-slate-400 text-sm">Your friends create an account using your link</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">3</span>
                </div>
                <div>
                  <p className="text-white font-medium">You earn commission</p>
                  <p className="text-slate-400 text-sm">Get 10% commission when they make their first deposit</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Earnings Tab */}
      {activeTab === 'earnings' && (
        <div className="space-y-4">
          <div className="bg-slate-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">Commission History</h3>
              <button
                onClick={fetchReferralData}
                title="Refresh commission history"
                className="text-orange-400 hover:text-orange-300 transition-colors"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
            
            {commissions.length > 0 ? (
              <div className="space-y-3">
                {commissions.map((commission) => (
                  <div key={commission.id} className="flex justify-between items-center py-3 border-b border-slate-700 last:border-0">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                        <ArrowUp className="w-5 h-5 text-green-400" />
                      </div>
                      <div>
                        <p className="text-white font-medium">{commission.referred_name}</p>
                        <p className="text-slate-400 text-sm">{commission.commission_type} commission</p>
                        <p className="text-slate-500 text-xs">
                          {new Date(commission.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-green-400 font-semibold">+KES {Number(commission.commission_amount || 0).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
                
                {hasMoreCommissions && (
                  <button
                    onClick={loadMoreCommissions}
                    className="w-full bg-slate-700 text-white py-2 rounded-lg hover:bg-slate-600 transition-colors"
                  >
                    Load More
                  </button>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <Trophy className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-400">
                  You haven't earned any commissions yet. Start inviting friends to earn rewards!
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
