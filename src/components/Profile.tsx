import { useState, useEffect } from 'react';
import { ArrowLeft, User, Mail, Phone, Shield, Bell, CreditCard, Users, HelpCircle, LogOut, Edit3, Check, X } from 'lucide-react';
import { userAPI, purchaseAPI, referralAPI } from '../utils/api';
import { Logo } from './Logo';

interface ProfileProps {
  onBack: () => void;
  onLogout: () => void;
}

export const Profile = ({ onBack, onLogout }: ProfileProps) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [editingField, setEditingField] = useState<string | null>(null);
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    joined: '',
    verified: false
  });

  const [notifications, setNotifications] = useState({
    deposits: true,
    withdrawals: true,
    mining: true,
    promotions: false,
    security: true
  });

  const [tempValue, setTempValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userStats, setUserStats] = useState({
    totalDeposits: '0.00',
    totalWithdrawals: '0.00', 
    activeInvestments: '0',
    totalReferrals: '0'
  });

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await userAPI.getProfile();
        const user = response.user;
        const [firstName, ...lastNameParts] = user.full_name.split(' ');
        setProfileData({
          firstName: firstName || '',
          lastName: lastNameParts.join(' ') || '',
          email: user.email || '',
          phone: user.phone || '',
          joined: user.created_at?.split('T')[0] || '',
          verified: user.status === 'active'
        });

        // Fetch user statistics in parallel
        try {
          const [purchasesResponse, referralResponse] = await Promise.all([
            purchaseAPI.getUserPurchases().catch(() => ({ purchases: [] })),
            referralAPI.getReferralInfo().catch(() => ({ referrals: [] }))
          ]);

          const activeInvestments = purchasesResponse.purchases.filter(
            (p: any) => p.status === 'active'
          ).length;

          setUserStats({
            totalDeposits: user.total_deposits || '0.00',
            totalWithdrawals: user.total_withdrawals || '0.00',
            activeInvestments: activeInvestments.toString(),
            totalReferrals: referralResponse.referrals?.length?.toString() || '0'
          });
        } catch {
          // If stats fail, keep default values
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleEdit = (field: string) => {
    setEditingField(field);
    setTempValue(profileData[field as keyof typeof profileData] as string);
  };

  const handleSave = (field: string) => {
    setProfileData({ ...profileData, [field]: tempValue });
    setEditingField(null);
    setTempValue('');
  };

  const handleCancel = () => {
    setEditingField(null);
    setTempValue('');
  };

  const menuItems = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'payment', label: 'Payment Methods', icon: CreditCard },
    { id: 'referrals', label: 'Referrals', icon: Users },
    { id: 'support', label: 'Support', icon: HelpCircle }
  ];

  const statsData = [
    { label: 'Total Deposits', value: `KES ${userStats.totalDeposits}`, color: 'text-green-500' },
    { label: 'Total Withdrawals', value: `KES ${userStats.totalWithdrawals}`, color: 'text-blue-500' },
    { label: 'Active Investments', value: userStats.activeInvestments, color: 'text-orange-500' },
    { label: 'Referrals', value: userStats.totalReferrals, color: 'text-purple-500' }
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700">
        <button 
          onClick={onBack}
          className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
        <h1 className="text-white font-bold text-lg">Profile & Settings</h1>
        <div></div>
      </div>

      <div className="p-4">
        {/* Profile Header */}
        <div className="bg-slate-800 rounded-lg p-6 mb-6">
          <div className="flex items-center space-x-4 mb-4">
            <Logo size="lg" />
            <div>
              <h2 className="text-white text-xl font-bold">
                {profileData.firstName} {profileData.lastName}
              </h2>
              <p className="text-slate-400">Member since {new Date(profileData.joined).toLocaleDateString()}</p>
              <div className="flex items-center space-x-2 mt-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-green-500 text-sm">Verified Account</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            {statsData.map((stat, index) => (
              <div key={index} className="bg-slate-900 rounded-lg p-3">
                <p className="text-slate-400 text-sm">{stat.label}</p>
                <p className={`font-bold ${stat.color}`}>{stat.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto space-x-2 mb-6">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  activeTab === item.id
                    ? 'bg-orange-500 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="space-y-4">
            {/* Personal Information */}
            <div className="bg-slate-800 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-4">Personal Information</h3>
              <div className="space-y-4">
                {/* First Name */}
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <label className="text-slate-400 text-sm">First Name</label>
                    {editingField === 'firstName' ? (
                      <div className="flex items-center space-x-2 mt-1">
                        <input
                          type="text"
                          value={tempValue}
                          onChange={(e) => setTempValue(e.target.value)}
                          className="flex-1 bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white"
                        />
                        <button
                          onClick={() => handleSave('firstName')}
                          className="text-green-500 hover:text-green-400"
                        >
                          <Check className="w-5 h-5" />
                        </button>
                        <button
                          onClick={handleCancel}
                          className="text-red-500 hover:text-red-400"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ) : (
                      <p className="text-white mt-1">{profileData.firstName}</p>
                    )}
                  </div>
                  {editingField !== 'firstName' && (
                    <button
                      onClick={() => handleEdit('firstName')}
                      className="text-slate-400 hover:text-white"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Last Name */}
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <label className="text-slate-400 text-sm font-medium mb-2">Last Name</label>
                    {editingField === 'lastName' ? (
                      <div className="flex items-center space-x-2 mt-1">
                        <input
                          type="text"
                          value={tempValue}
                          onChange={(e) => setTempValue(e.target.value)}
                          className="flex-1 bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white"
                        />
                        <button
                          onClick={() => handleSave('lastName')}
                          className="text-green-500 hover:text-green-400"
                        >
                          <Check className="w-5 h-5" />
                        </button>
                        <button
                          onClick={handleCancel}
                          className="text-red-500 hover:text-red-400"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ) : (
                      <p className="text-white mt-1">{profileData.lastName}</p>
                    )}
                  </div>
                  {editingField !== 'lastName' && (
                    <button
                      onClick={() => handleEdit('lastName')}
                      className="text-slate-400 hover:text-white"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Email */}
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <label className="text-slate-400 text-sm">Email Address</label>
                    <div className="flex items-center space-x-2 mt-1">
                      <p className="text-white">{profileData.email}</p>
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    </div>
                  </div>
                  <Mail className="w-4 h-4 text-slate-400" />
                </div>

                {/* Phone */}
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <label className="text-slate-400 text-sm">Phone Number</label>
                    {editingField === 'phone' ? (
                      <div className="flex items-center space-x-2 mt-1">
                        <input
                          type="text"
                          value={tempValue}
                          onChange={(e) => setTempValue(e.target.value)}
                          className="flex-1 bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white"
                        />
                        <button
                          onClick={() => handleSave('phone')}
                          className="text-green-500 hover:text-green-400"
                        >
                          <Check className="w-5 h-5" />
                        </button>
                        <button
                          onClick={handleCancel}
                          className="text-red-500 hover:text-red-400"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ) : (
                      <p className="text-white mt-1">{profileData.phone}</p>
                    )}
                  </div>
                  {editingField !== 'phone' && (
                    <button
                      onClick={() => handleEdit('phone')}
                      className="text-slate-400 hover:text-white"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="space-y-4">
            <div className="bg-slate-800 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-4">Security Settings</h3>
              <div className="space-y-4">
                <button className="w-full flex items-center justify-between p-3 bg-slate-900 rounded-lg hover:bg-slate-700 transition-colors">
                  <span className="text-white">Change Password</span>
                  <ArrowLeft className="w-4 h-4 text-slate-400 rotate-180" />
                </button>
                <button className="w-full flex items-center justify-between p-3 bg-slate-900 rounded-lg hover:bg-slate-700 transition-colors">
                  <span className="text-white">Two-Factor Authentication</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-red-500 text-sm">Disabled</span>
                    <ArrowLeft className="w-4 h-4 text-slate-400 rotate-180" />
                  </div>
                </button>
                <button className="w-full flex items-center justify-between p-3 bg-slate-900 rounded-lg hover:bg-slate-700 transition-colors">
                  <span className="text-white">Login Sessions</span>
                  <ArrowLeft className="w-4 h-4 text-slate-400 rotate-180" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="space-y-4">
            <div className="bg-slate-800 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-4">Notification Preferences</h3>
              <div className="space-y-4">
                {Object.entries(notifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-white capitalize">{key} Notifications</span>
                    <button
                      onClick={() => setNotifications({ ...notifications, [key]: !value })}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        value ? 'bg-orange-500' : 'bg-slate-600'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 bg-white rounded-full transition-transform ${
                          value ? 'translate-x-6' : 'translate-x-0.5'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Support Tab */}
        {activeTab === 'support' && (
          <div className="space-y-4">
            <div className="bg-slate-800 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-4">Help & Support</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between p-3 bg-slate-900 rounded-lg hover:bg-slate-700 transition-colors">
                  <span className="text-white">Contact Support</span>
                  <ArrowLeft className="w-4 h-4 text-slate-400 rotate-180" />
                </button>
                <button className="w-full flex items-center justify-between p-3 bg-slate-900 rounded-lg hover:bg-slate-700 transition-colors">
                  <span className="text-white">FAQ</span>
                  <ArrowLeft className="w-4 h-4 text-slate-400 rotate-180" />
                </button>
                <button className="w-full flex items-center justify-between p-3 bg-slate-900 rounded-lg hover:bg-slate-700 transition-colors">
                  <span className="text-white">Terms of Service</span>
                  <ArrowLeft className="w-4 h-4 text-slate-400 rotate-180" />
                </button>
                <button className="w-full flex items-center justify-between p-3 bg-slate-900 rounded-lg hover:bg-slate-700 transition-colors">
                  <span className="text-white">Privacy Policy</span>
                  <ArrowLeft className="w-4 h-4 text-slate-400 rotate-180" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Logout Button */}
        <button
          onClick={onLogout}
          className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};
