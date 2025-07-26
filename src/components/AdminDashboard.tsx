import { useState, useEffect } from 'react';
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  Settings,
  BarChart3,
  FileText,
  Shield,
  LogOut,
  Search,
  Filter,
  CheckCircle,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { apiAuthFetch } from '../utils/api';
import { Logo } from './Logo';

interface User {
  id: number;
  email: string;
  full_name: string;
  role: string;
  status?: string;
  balance?: number;
  total_earnings?: number;
  referral_code?: string;
  created_at: string;
}

interface AdminStats {
  total_users?: number;
  active_users?: number;
  new_users_today?: number;
  total_deposits?: number;
  deposits_today?: number;
  pending_deposits?: number;
  total_withdrawals?: number;
  withdrawals_today?: number;
  pending_withdrawals?: number;
  active_mining_engines?: number;
  active_investments?: number;
  total_active_investments?: number;
  total_referrals?: number;
  total_referral_commissions?: number;
  total_user_balance?: number;
}

interface Transaction {
  id: number;
  user_id: number;
  amount: number;
  status: string;
  created_at: string;
  method?: string;
  account_details?: string;
  // Deposit specific fields
  full_name?: string;
  email?: string;
}

interface Activity {
  id: number;
  admin_id: number;
  action: string;
  target_type: string;
  target_id: number;
  details: string;
  created_at: string;
  admin?: {
    full_name: string;
  };
}

interface MiningEngine {
  id: number;
  name: string;
  price: number;
  daily_earning_rate: number;
  duration_days: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface AdminDashboardProps {
  user: User | null;
  onLogout: () => void;
}

export const AdminDashboard = ({ user, onLogout }: AdminDashboardProps) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Data states for different sections
  const [users, setUsers] = useState<User[]>([]);
  const [deposits, setDeposits] = useState<Transaction[]>([]);
  const [withdrawals, setWithdrawals] = useState<Transaction[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [sectionLoading, setSectionLoading] = useState(false);
  
  // User management states
  const [userSearch, setUserSearch] = useState('');
  const [userStatusFilter, setUserStatusFilter] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('');
  const [usersPagination, setUsersPagination] = useState({ page: 1, total: 0, pages: 1 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiAuthFetch('/admin/stats');
        
        // Ensure stats object exists and has expected structure
        if (response && response.stats) {
          setStats(response.stats);
        } else {
          console.warn('Admin stats API returned unexpected format:', response);
          setStats({}); // Set empty object to prevent null errors
        }
      } catch (err) {
        console.error('Admin stats fetch error:', err);
        setError(err instanceof Error ? err.message : 'Failed to load admin statistics');
        setStats({}); // Set empty object even on error to prevent crashes
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Fetch section-specific data based on active tab
  useEffect(() => {
    const fetchSectionData = async () => {
      if (activeTab === 'overview') return; // Overview uses stats data
      
      try {
        setSectionLoading(true);
        
        switch (activeTab) {
          case 'users': {
            const queryParams = new URLSearchParams();
            queryParams.append('limit', '50');
            if (userSearch) queryParams.append('search', userSearch);
            if (userStatusFilter) queryParams.append('status', userStatusFilter);
            if (userRoleFilter) queryParams.append('role', userRoleFilter);
            
            const usersResponse = await apiAuthFetch(`/admin/users?${queryParams.toString()}`);
            if (usersResponse && usersResponse.users) {
              setUsers(usersResponse.users);
              if (usersResponse.pagination) {
                setUsersPagination(usersResponse.pagination);
              }
            }
            break;
          }
          case 'deposits': {
            const depositsResponse = await apiAuthFetch('/admin/deposits');
            if (depositsResponse && depositsResponse.deposits) {
              setDeposits(depositsResponse.deposits);
            }
            break;
          }
          case 'withdrawals': {
            const withdrawalsResponse = await apiAuthFetch('/admin/withdrawals');
            if (withdrawalsResponse && withdrawalsResponse.withdrawals) {
              setWithdrawals(withdrawalsResponse.withdrawals);
            }
            break;
          }
          case 'mining': {
            await fetchMiningEngines();
            break;
          }
          case 'logs': {
            const activitiesResponse = await apiAuthFetch('/admin/activities');
            if (activitiesResponse && activitiesResponse.activities) {
              setActivities(activitiesResponse.activities);
            }
            break;
          }
        }
      } catch (err) {
        console.error(`Failed to fetch ${activeTab} data:`, err);
      } finally {
        setSectionLoading(false);
      }
    };

    fetchSectionData();
  }, [activeTab, userSearch, userStatusFilter, userRoleFilter]);

  // Action handlers for admin operations
  const handleApproveDeposit = async (depositId: number) => {
    try {
      await apiAuthFetch(`/admin/deposits/${depositId}/status`, {
        method: 'PUT',
        body: {
          status: 'completed',
          admin_notes: 'Approved by admin'
        }
      });
      // Refresh deposits data
      const depositsResponse = await apiAuthFetch('/admin/deposits');
      if (depositsResponse && depositsResponse.deposits) {
        setDeposits(depositsResponse.deposits);
      }
      // Refresh stats
      const statsResponse = await apiAuthFetch('/admin/stats');
      if (statsResponse && statsResponse.stats) {
        setStats(statsResponse.stats);
      }
      alert('Deposit approved successfully!');
    } catch (err) {
      console.error('Failed to approve deposit:', err);
      alert('Failed to approve deposit. Please try again.');
    }
  };

  const handleRejectDeposit = async (depositId: number) => {
    try {
      const reason = prompt('Enter rejection reason:');
      await apiAuthFetch(`/admin/deposits/${depositId}/status`, {
        method: 'PUT',
        body: {
          status: 'failed',
          admin_notes: reason || 'Rejected by admin'
        }
      });
      // Refresh deposits data
      const depositsResponse = await apiAuthFetch('/admin/deposits');
      if (depositsResponse && depositsResponse.deposits) {
        setDeposits(depositsResponse.deposits);
      }
      // Refresh stats
      const statsResponse = await apiAuthFetch('/admin/stats');
      if (statsResponse && statsResponse.stats) {
        setStats(statsResponse.stats);
      }
      alert('Deposit rejected successfully!');
    } catch (err) {
      console.error('Failed to reject deposit:', err);
      alert('Failed to reject deposit. Please try again.');
    }
  };

  const handleApproveWithdrawal = async (withdrawalId: number) => {
    try {
      await apiAuthFetch(`/admin/withdrawals/${withdrawalId}/status`, {
        method: 'PUT',
        body: {
          status: 'approved',
          admin_notes: 'Approved by admin'
        }
      });
      // Refresh withdrawals data
      const withdrawalsResponse = await apiAuthFetch('/admin/withdrawals');
      if (withdrawalsResponse && withdrawalsResponse.withdrawals) {
        setWithdrawals(withdrawalsResponse.withdrawals);
      }
      // Refresh stats
      const statsResponse = await apiAuthFetch('/admin/stats');
      if (statsResponse && statsResponse.stats) {
        setStats(statsResponse.stats);
      }
      alert('Withdrawal approved successfully!');
    } catch (err) {
      console.error('Failed to approve withdrawal:', err);
      alert('Failed to approve withdrawal. Please try again.');
    }
  };

  const handleRejectWithdrawal = async (withdrawalId: number) => {
    try {
      const reason = prompt('Enter rejection reason:');
      await apiAuthFetch(`/admin/withdrawals/${withdrawalId}/status`, {
        method: 'PUT',
        body: {
          status: 'rejected',
          admin_notes: reason || 'Rejected by admin'
        }
      });
      // Refresh withdrawals data
      const withdrawalsResponse = await apiAuthFetch('/admin/withdrawals');
      if (withdrawalsResponse && withdrawalsResponse.withdrawals) {
        setWithdrawals(withdrawalsResponse.withdrawals);
      }
      // Refresh stats
      const statsResponse = await apiAuthFetch('/admin/stats');
      if (statsResponse && statsResponse.stats) {
        setStats(statsResponse.stats);
      }
      alert('Withdrawal rejected successfully!');
    } catch (err) {
      console.error('Failed to reject withdrawal:', err);
      alert('Failed to reject withdrawal. Please try again.');
    }
  };

  const handleProcessWithdrawal = async (withdrawalId: number) => {
    try {
      const transactionRef = prompt('Enter transaction reference:');
      if (!transactionRef) return;
      
      await apiAuthFetch(`/admin/withdrawals/${withdrawalId}/process`, {
        method: 'POST',
        body: {
          transaction_reference: transactionRef,
          admin_notes: 'Payment processed by admin'
        }
      });
      // Refresh withdrawals data
      const withdrawalsResponse = await apiAuthFetch('/admin/withdrawals');
      if (withdrawalsResponse && withdrawalsResponse.withdrawals) {
        setWithdrawals(withdrawalsResponse.withdrawals);
      }
      // Refresh stats
      const statsResponse = await apiAuthFetch('/admin/stats');
      if (statsResponse && statsResponse.stats) {
        setStats(statsResponse.stats);
      }
      alert('Withdrawal processed successfully!');
    } catch (err) {
      console.error('Failed to process withdrawal:', err);
      alert('Failed to process withdrawal. Please try again.');
    }
  };

  // Additional CRUD operations for users
  const handleUserStatusUpdate = async (userId: number, status: string) => {
    try {
      const reason = prompt(`Enter reason for ${status}:`);
      await apiAuthFetch(`/admin/users/${userId}/status`, {
        method: 'PUT',
        body: {
          status,
          reason
        }
      });
      // Refresh users data
      await refreshUsersData();
      alert(`User ${status} successfully!`);
    } catch (err) {
      console.error('Failed to update user status:', err);
      alert('Failed to update user status. Please try again.');
    }
  };

  const handleBalanceAdjustment = async (userId: number) => {
    try {
      const amount = prompt('Enter amount (positive to add, negative to subtract):');
      const reason = prompt('Enter reason for balance adjustment:');
      
      if (!amount || !reason) return;
      
      const numAmount = parseFloat(amount);
      if (isNaN(numAmount)) {
        alert('Please enter a valid number');
        return;
      }

      await apiAuthFetch(`/admin/users/${userId}/balance`, {
        method: 'PUT',
        body: {
          amount: Math.abs(numAmount),
          type: numAmount >= 0 ? 'add' : 'subtract',
          reason
        }
      });
      // Refresh users data
      await refreshUsersData();
      alert('Balance adjusted successfully!');
    } catch (err) {
      console.error('Failed to adjust balance:', err);
      alert('Failed to adjust balance. Please try again.');
    }
  };

  // Function to refresh users data
  const refreshUsersData = async () => {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('limit', '50');
      if (userSearch) queryParams.append('search', userSearch);
      if (userStatusFilter) queryParams.append('status', userStatusFilter);
      if (userRoleFilter) queryParams.append('role', userRoleFilter);
      
      const usersResponse = await apiAuthFetch(`/admin/users?${queryParams.toString()}`);
      if (usersResponse && usersResponse.users) {
        setUsers(usersResponse.users);
        if (usersResponse.pagination) {
          setUsersPagination(usersResponse.pagination);
        }
      }
    } catch (err) {
      console.error('Failed to refresh users data:', err);
    }
  };

  // Handle viewing user details
  const handleViewUser = async (user: User) => {
    try {
      setSelectedUser(user);
      const response = await apiAuthFetch(`/admin/users/${user.id}`);
      if (response && response.user) {
        setUserDetails(response.user);
      }
      setShowUserModal(true);
    } catch (err) {
      console.error('Failed to fetch user details:', err);
      alert('Failed to load user details. Please try again.');
    }
  };

  const handleDeleteDeposit = async (depositId: number) => {
    try {
      const reason = prompt('Enter reason for deleting this deposit:');
      if (!reason) return;
      
      const confirmed = confirm('Are you sure you want to delete this deposit? This action cannot be undone.');
      if (!confirmed) return;

      await apiAuthFetch(`/admin/deposits/${depositId}`, {
        method: 'DELETE',
        body: { reason }
      });
      // Refresh deposits data
      const depositsResponse = await apiAuthFetch('/admin/deposits');
      if (depositsResponse && depositsResponse.deposits) {
        setDeposits(depositsResponse.deposits);
      }
      // Refresh stats
      const statsResponse = await apiAuthFetch('/admin/stats');
      if (statsResponse && statsResponse.stats) {
        setStats(statsResponse.stats);
      }
      alert('Deposit deleted successfully!');
    } catch (err) {
      console.error('Failed to delete deposit:', err);
      alert('Failed to delete deposit. Please try again.');
    }
  };

  // Mining Engine CRUD operations
  const [miningEngines, setMiningEngines] = useState<MiningEngine[]>([]);
  const [showEngineModal, setShowEngineModal] = useState(false);
  const [editingEngine, setEditingEngine] = useState<MiningEngine | null>(null);
  
  // System settings state and functions
  const [systemSettings, setSystemSettings] = useState({
    // Withdrawal Settings
    min_withdrawal_amount: '100.00',
    max_withdrawal_amount: '50000.00',
    daily_withdrawal_limit: '100000.00',
    withdrawal_fee_percentage: '0.00',
    withdrawal_processing_time: '24',
    
    // Deposit Settings
    min_deposit_amount: '50.00',
    max_deposit_amount: '100000.00',  
    deposit_fee_percentage: '0.00',
    
    // Referral Settings
    referral_commission_rate: '10.00',
    referral_bonus_amount: '50.00',
    min_referral_payout: '100.00',
    
    // Platform Settings
    platform_commission_rate: '5.00',
    maintenance_mode: 'false',
    registration_enabled: 'true',
    kyc_required: 'false',
    
    // Notification Settings
    email_notifications: 'true',
    sms_notifications: 'false',
    withdrawal_approval_email: 'true',
    
    // Security Settings
    max_login_attempts: '5',
    session_timeout: '3600',
    password_min_length: '8',
    
    // Mining Settings
    default_mining_duration: '365',
    min_mining_investment: '100.00',
    max_mining_investment: '1000000.00'
  });
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Fetch system settings when settings tab is active
  useEffect(() => {
    const fetchSystemSettings = async () => {
      if (activeTab !== 'settings') return;
      
      try {
        setSettingsLoading(true);
        const response = await apiAuthFetch('/admin/settings');
        if (response && response.settings) {
          // Update state with fetched settings
          const settingsObject: any = {};
          response.settings.forEach((setting: any) => {
            settingsObject[setting.setting_key] = setting.setting_value;
          });
          setSystemSettings(prev => ({ ...prev, ...settingsObject }));
        }
      } catch (err) {
        console.error('Failed to fetch system settings:', err);
      } finally {
        setSettingsLoading(false);
      }
    };

    fetchSystemSettings();
  }, [activeTab]);

  // Handle system settings save
  const handleSaveSettings = async () => {
    try {
      setSettingsLoading(true);
      setSettingsSaved(false);
      
      // Convert settings object to array format expected by API
      const settingsArray = Object.entries(systemSettings).map(([key, value]) => ({
        setting_key: key,
        setting_value: value
      }));

      // Send each setting update
      await Promise.all(
        settingsArray.map(setting =>
          apiAuthFetch('/admin/settings', {
            method: 'PUT',
            body: {
              setting_key: setting.setting_key,
              setting_value: setting.setting_value
            }
          })
        )
      );

      setSettingsSaved(true);
      alert('Settings saved successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSettingsSaved(false), 3000);
    } catch (err) {
      console.error('Failed to save settings:', err);
      alert('Failed to save settings. Please try again.');
    } finally {
      setSettingsLoading(false);
    }
  };

  // Handle individual setting change
  const handleSettingChange = (key: string, value: string) => {
    setSystemSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // User detail modal
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userDetails, setUserDetails] = useState<any>(null);

  const fetchMiningEngines = async () => {
    try {
      const response = await apiAuthFetch('/mining-engines');
      if (response && Array.isArray(response)) {
        setMiningEngines(response);
      } else if (response && response.engines) {
        setMiningEngines(response.engines);
      }
    } catch (err) {
      console.error('Failed to fetch mining engines:', err);
    }
  };

  const handleCreateEngine = async (engineData: Omit<MiningEngine, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      await apiAuthFetch('/admin/mining-engines', {
        method: 'POST',
        body: engineData
      });
      await fetchMiningEngines();
      setShowEngineModal(false);
      alert('Mining engine created successfully!');
    } catch (err) {
      console.error('Failed to create mining engine:', err);
      alert('Failed to create mining engine. Please try again.');
    }
  };

  const handleUpdateEngine = async (engineId: number, engineData: Partial<MiningEngine>) => {
    try {
      await apiAuthFetch(`/admin/mining-engines/${engineId}`, {
        method: 'PUT',
        body: engineData
      });
      await fetchMiningEngines();
      setShowEngineModal(false);
      setEditingEngine(null);
      alert('Mining engine updated successfully!');
    } catch (err) {
      console.error('Failed to update mining engine:', err);
      alert('Failed to update mining engine. Please try again.');
    }
  };

  const handleDeleteEngine = async (engineId: number) => {
    try {
      const confirmed = confirm('Are you sure you want to delete this mining engine? This action cannot be undone.');
      if (!confirmed) return;

      await apiAuthFetch(`/admin/mining-engines/${engineId}`, {
        method: 'DELETE'
      });
      await fetchMiningEngines();
      alert('Mining engine deleted successfully!');
    } catch (err) {
      console.error('Failed to delete mining engine:', err);
      alert('Failed to delete mining engine. Please try again.');
    }
  };

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'deposits', label: 'Deposits', icon: ArrowDownRight },
    { id: 'withdrawals', label: 'Withdrawals', icon: ArrowUpRight },
    { id: 'mining', label: 'Mining Engines', icon: TrendingUp },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'logs', label: 'Activity Logs', icon: FileText },
  ];

  const renderOverview = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-slate-400">Loading statistics...</div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-600 text-white p-4 rounded-lg">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        </div>
      );
    }

    if (!stats) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-slate-400">No statistics available</div>
        </div>
      );
    }

    // Helper function to safely format numbers
    const safeToLocaleString = (value: number | undefined | null): string => {
      return (value || 0).toLocaleString();
    };

    const safeNumber = (value: number | undefined | null): number => {
      return value || 0;
    };

    return (
      <div className="space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-slate-800 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Users</p>
                <p className="text-2xl font-bold text-white">{safeToLocaleString(stats.total_users)}</p>
                <p className="text-green-500 text-sm">+{safeNumber(stats.new_users_today)} today</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-slate-800 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Deposits</p>
                <p className="text-2xl font-bold text-white">KES {safeToLocaleString(stats.total_deposits)}</p>
                <p className="text-green-500 text-sm">+KES {safeToLocaleString(stats.deposits_today)} today</p>
              </div>
              <ArrowDownRight className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-slate-800 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Withdrawals</p>
                <p className="text-2xl font-bold text-white">KES {safeToLocaleString(stats.total_withdrawals)}</p>
                <p className="text-orange-500 text-sm">+KES {safeToLocaleString(stats.withdrawals_today)} today</p>
              </div>
              <ArrowUpRight className="w-8 h-8 text-orange-500" />
            </div>
          </div>

          <div className="bg-slate-800 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Active Investments</p>
                <p className="text-2xl font-bold text-white">KES {safeToLocaleString(stats.total_active_investments)}</p>
                <p className="text-blue-500 text-sm">{safeNumber(stats.active_investments)} investments</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Pending Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-800 rounded-lg p-6">
            <h3 className="text-white font-semibold mb-4">Pending Deposits</h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center">
                  <Clock className="w-5 h-5 text-yellow-500" />
                </div>
                <div>
                  <p className="text-white font-semibold">{safeNumber(stats.pending_deposits)}</p>
                  <p className="text-slate-400 text-sm">Awaiting approval</p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('deposits')}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
              >
                Review
              </button>
            </div>
          </div>

          <div className="bg-slate-800 rounded-lg p-6">
            <h3 className="text-white font-semibold mb-4">Pending Withdrawals</h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
                  <Clock className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <p className="text-white font-semibold">{safeNumber(stats.pending_withdrawals)}</p>
                  <p className="text-slate-400 text-sm">Awaiting processing</p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('withdrawals')}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
              >
                Process
              </button>
            </div>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="bg-slate-800 rounded-lg p-6">
          <h3 className="text-white font-semibold mb-4">Platform Health</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">{safeNumber(stats.active_users)}</div>
              <div className="text-slate-400 text-sm">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500">{safeNumber(stats.total_referrals)}</div>
              <div className="text-slate-400 text-sm">Total Referrals</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-500">KES {safeToLocaleString(stats.total_user_balance)}</div>
              <div className="text-slate-400 text-sm">Total User Balance</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'users':
        return renderUserManagement();
      case 'deposits':
        return renderDepositManagement();
      case 'withdrawals':
        return renderWithdrawalManagement();
      case 'mining':
        return renderMiningEngineManagement();
      case 'settings':
        return renderSystemSettings();
      case 'logs':
        return renderActivityLogs();
      default:
        return renderOverview();
    }
  };

  const renderUserManagement = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-white text-2xl font-bold">User Management</h2>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              className="bg-slate-700 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <select 
            value={userStatusFilter}
            onChange={(e) => setUserStatusFilter(e.target.value)}
            className="bg-slate-700 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="deactivated">Deactivated</option>
          </select>
          <select 
            value={userRoleFilter}
            onChange={(e) => setUserRoleFilter(e.target.value)}
            className="bg-slate-700 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="">All Roles</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <button className="bg-slate-700 p-2 rounded-lg hover:bg-slate-600 transition-colors">
            <Filter className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </div>

      <div className="bg-slate-800 rounded-lg overflow-hidden">
        <div className="p-4 border-b border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <div className="text-slate-400 text-sm">
              Showing {users.length} of {usersPagination.total} users (Page {usersPagination.page} of {usersPagination.pages})
            </div>
            <div className="flex items-center space-x-2">
              <button 
                disabled={usersPagination.page <= 1}
                className="bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:text-slate-600 text-white px-3 py-1 rounded text-sm transition-colors"
              >
                Previous
              </button>
              <button 
                disabled={usersPagination.page >= usersPagination.pages}
                className="bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:text-slate-600 text-white px-3 py-1 rounded text-sm transition-colors"
              >
                Next
              </button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-4 text-slate-400 text-sm font-medium">
            <div>User</div>
            <div>Email</div>
            <div>Role</div>
            <div>Status</div>
            <div>Balance</div>
            <div>Joined</div>
            <div>Actions</div>
          </div>
        </div>
        
        {sectionLoading ? (
          <div className="p-8 text-center">
            <div className="text-slate-400">Loading users...</div>
          </div>
        ) : users.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-slate-400">No users found</div>
          </div>
        ) : (
          <div className="divide-y divide-slate-700">
            {users.map((user) => (
              <div key={user.id} className="p-4">
                <div className="grid grid-cols-7 gap-4 items-center">
                  <div>
                    <div className="font-medium text-white">{user.full_name}</div>
                    <div className="text-slate-400 text-sm">ID: {user.id}</div>
                  </div>
                  <div className="text-slate-300">{user.email}</div>
                  <div>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      user.role === 'admin' 
                        ? 'bg-purple-500/20 text-purple-400'
                        : 'bg-blue-500/20 text-blue-400'
                    }`}>
                      {user.role}
                    </span>
                  </div>
                  <div>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      user.status === 'active'
                        ? 'bg-green-500/20 text-green-400'
                        : user.status === 'suspended'
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {user.status || 'active'}
                    </span>
                  </div>
                  <div className="text-white font-medium">
                    KES {(user.balance || 0).toLocaleString()}
                  </div>
                  <div className="text-slate-400 text-sm">
                    {new Date(user.created_at).toLocaleDateString()}
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleViewUser(user)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
                    >
                      View
                    </button>
                    <button 
                      onClick={() => handleBalanceAdjustment(user.id)}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors"
                    >
                      Balance
                    </button>
                    {user.status !== 'suspended' && (
                      <button 
                        onClick={() => handleUserStatusUpdate(user.id, 'suspended')}
                        className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-sm transition-colors"
                      >
                        Suspend
                      </button>
                    )}
                    {user.status !== 'deactivated' && (
                      <button 
                        onClick={() => handleUserStatusUpdate(user.id, 'deactivated')}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
                      >
                        Deactivate
                      </button>
                    )}
                    {(user.status === 'suspended' || user.status === 'deactivated') && (
                      <button 
                        onClick={() => handleUserStatusUpdate(user.id, 'active')}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors"
                      >
                        Activate
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderDepositManagement = () => {
    if (!stats) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-slate-400">Loading deposit statistics...</div>
        </div>
      );
    }

    // Helper functions for safe number formatting
    const safeToLocaleString = (value: number | undefined | null): string => {
      return (value || 0).toLocaleString();
    };

    const safeNumber = (value: number | undefined | null): number => {
      return value || 0;
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-white text-2xl font-bold">Deposit Management</h2>
          <div className="flex items-center space-x-3">
            <select className="bg-slate-700 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-slate-800 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-white font-semibold">{safeNumber(stats.pending_deposits)}</p>
                <p className="text-slate-400 text-sm">Pending Deposits</p>
              </div>
            </div>
          </div>
          <div className="bg-slate-800 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-white font-semibold">KES {safeToLocaleString(stats.deposits_today)}</p>
                <p className="text-slate-400 text-sm">Today's Deposits</p>
              </div>
            </div>
          </div>
          <div className="bg-slate-800 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-white font-semibold">KES {safeToLocaleString(stats.total_deposits)}</p>
                <p className="text-slate-400 text-sm">Total Deposits</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 rounded-lg overflow-hidden">
          <div className="p-4 border-b border-slate-700">
            <div className="grid grid-cols-6 gap-4 text-slate-400 text-sm font-medium">
              <div>User</div>
              <div>Amount</div>
              <div>Method</div>
              <div>Status</div>
              <div>Date</div>
              <div>Actions</div>
            </div>
          </div>
          
          {sectionLoading ? (
            <div className="p-8 text-center">
              <div className="text-slate-400">Loading deposits...</div>
            </div>
          ) : deposits.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-slate-400">No deposits found</div>
              <p className="text-xs mt-2">Deposits will appear here once users make transactions</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-700">
              {deposits.map((deposit) => (
                <div key={deposit.id} className="p-4">
                  <div className="grid grid-cols-6 gap-4 items-center">
                    <div>
                      <div className="font-medium text-white">{deposit.full_name || 'N/A'}</div>
                      <div className="text-slate-400 text-sm">{deposit.email || `User ${deposit.user_id}`}</div>
                    </div>
                    <div className="text-white font-semibold">
                      KES {deposit.amount.toLocaleString()}
                    </div>
                    <div className="text-slate-300">{deposit.method || 'N/A'}</div>
                    <div>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        deposit.status === 'completed' 
                          ? 'bg-green-500/20 text-green-400'
                          : deposit.status === 'pending'
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {deposit.status}
                      </span>
                    </div>
                    <div className="text-slate-400 text-sm">
                      {new Date(deposit.created_at).toLocaleDateString()}
                    </div>
                    <div className="flex space-x-2">
                      {deposit.status === 'pending' && (
                        <>
                          <button 
                            onClick={() => handleApproveDeposit(deposit.id)}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors"
                          >
                            Approve
                          </button>
                          <button 
                            onClick={() => handleRejectDeposit(deposit.id)}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors">
                        View
                      </button>
                      <button 
                        onClick={() => handleDeleteDeposit(deposit.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderWithdrawalManagement = () => {
    if (!stats) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-slate-400">Loading withdrawal statistics...</div>
        </div>
      );
    }

    // Helper functions for safe number formatting
    const safeToLocaleString = (value: number | undefined | null): string => {
      return (value || 0).toLocaleString();
    };

    const safeNumber = (value: number | undefined | null): number => {
      return value || 0;
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-white text-2xl font-bold">Withdrawal Management</h2>
          <div className="flex items-center space-x-3">
            <select className="bg-slate-700 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="completed">Completed</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-slate-800 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
                <Clock className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <p className="text-white font-semibold">{safeNumber(stats.pending_withdrawals)}</p>
                <p className="text-slate-400 text-sm">Pending Withdrawals</p>
              </div>
            </div>
          </div>
          <div className="bg-slate-800 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center">
                <ArrowUpRight className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <p className="text-white font-semibold">KES {safeToLocaleString(stats.withdrawals_today)}</p>
                <p className="text-slate-400 text-sm">Today's Withdrawals</p>
              </div>
            </div>
          </div>
          <div className="bg-slate-800 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <p className="text-white font-semibold">KES {safeToLocaleString(stats.total_withdrawals)}</p>
                <p className="text-slate-400 text-sm">Total Withdrawals</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 rounded-lg overflow-hidden">
          <div className="p-4 border-b border-slate-700">
            <div className="grid grid-cols-6 gap-4 text-slate-400 text-sm font-medium">
              <div>User</div>
              <div>Amount</div>
              <div>Wallet/Account</div>
              <div>Status</div>
              <div>Date</div>
              <div>Actions</div>
            </div>
          </div>
          
          {sectionLoading ? (
            <div className="p-8 text-center">
              <div className="text-slate-400">Loading withdrawals...</div>
            </div>
          ) : withdrawals.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-slate-400">No withdrawals found</div>
              <p className="text-xs mt-2">Withdrawal requests will appear here once users request withdrawals</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-700">
              {withdrawals.map((withdrawal) => (
                <div key={withdrawal.id} className="p-4">
                  <div className="grid grid-cols-6 gap-4 items-center">
                    <div>
                      <div className="font-medium text-white">{withdrawal.full_name || 'N/A'}</div>
                      <div className="text-slate-400 text-sm">{withdrawal.email || `User ${withdrawal.user_id}`}</div>
                    </div>
                    <div className="text-white font-semibold">
                      KES {withdrawal.amount.toLocaleString()}
                    </div>
                    <div className="text-slate-300">
                      <div className="truncate max-w-32" title={withdrawal.account_details}>
                        {withdrawal.account_details || 'N/A'}
                      </div>
                    </div>
                    <div>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        withdrawal.status === 'completed' 
                          ? 'bg-green-500/20 text-green-400'
                          : withdrawal.status === 'pending'
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : withdrawal.status === 'approved'
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {withdrawal.status}
                      </span>
                    </div>
                    <div className="text-slate-400 text-sm">
                      {new Date(withdrawal.created_at).toLocaleDateString()}
                    </div>
                    <div className="flex space-x-2">
                      {withdrawal.status === 'pending' && (
                        <>
                          <button 
                            onClick={() => handleApproveWithdrawal(withdrawal.id)}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors"
                          >
                            Approve
                          </button>
                          <button 
                            onClick={() => handleRejectWithdrawal(withdrawal.id)}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {withdrawal.status === 'approved' && (
                        <button 
                          onClick={() => handleProcessWithdrawal(withdrawal.id)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
                        >
                          Process
                        </button>
                      )}
                      <button className="bg-slate-600 hover:bg-slate-700 text-white px-3 py-1 rounded text-sm transition-colors">
                        View
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderMiningEngineManagement = () => {
    if (!stats) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-slate-400">Loading mining engine statistics...</div>
        </div>
      );
    }

    // Helper functions for safe number formatting
    const safeToLocaleString = (value: number | undefined | null): string => {
      return (value || 0).toLocaleString();
    };

    const safeNumber = (value: number | undefined | null): number => {
      return value || 0;
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-white text-2xl font-bold">Mining Engine Management</h2>
          <button 
            onClick={() => {
              setEditingEngine(null);
              setShowEngineModal(true);
            }}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Add New Engine
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-slate-800 rounded-lg p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">{safeNumber(stats.active_mining_engines)}</div>
              <div className="text-slate-400 text-sm">Active Engines</div>
            </div>
          </div>
          <div className="bg-slate-800 rounded-lg p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500">{safeNumber(stats.active_investments)}</div>
              <div className="text-slate-400 text-sm">Active Investments</div>
            </div>
          </div>
          <div className="bg-slate-800 rounded-lg p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-500">KES {safeToLocaleString(stats.total_active_investments)}</div>
              <div className="text-slate-400 text-sm">Total Investment Value</div>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 rounded-lg overflow-hidden">
          <div className="p-4 border-b border-slate-700">
            <div className="grid grid-cols-6 gap-4 text-slate-400 text-sm font-medium">
              <div>Engine Name</div>
              <div>Price (KES)</div>
              <div>Daily Rate (%)</div>
              <div>Duration</div>
              <div>Status</div>
              <div>Actions</div>
            </div>
          </div>
          
          {sectionLoading ? (
            <div className="p-8 text-center">
              <div className="text-slate-400">Loading mining engines...</div>
            </div>
          ) : miningEngines.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-slate-400">No mining engines available</div>
            </div>
          ) : (
            <div className="divide-y divide-slate-700">
              {miningEngines.map((engine) => (
                <div key={engine.id} className="p-4">
                  <div className="grid grid-cols-6 gap-4 items-center">
                    <div>
                      <div className="font-medium text-white">{engine.name}</div>
                      <div className="text-slate-400 text-sm">ID: {engine.id}</div>
                    </div>
                    <div className="text-white font-semibold">
                      KES {engine.price.toLocaleString()}
                    </div>
                    <div className="text-slate-300">{engine.daily_earning_rate}%</div>
                    <div className="text-slate-300">{engine.duration_days} days</div>
                    <div>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        engine.is_active 
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {engine.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => {
                          setEditingEngine(engine);
                          setShowEngineModal(true);
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleUpdateEngine(engine.id, { is_active: !engine.is_active })}
                        className={`px-3 py-1 rounded text-sm transition-colors ${
                          engine.is_active 
                            ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                            : 'bg-green-600 hover:bg-green-700 text-white'
                        }`}
                      >
                        {engine.is_active ? 'Disable' : 'Enable'}
                      </button>
                      <button 
                        onClick={() => handleDeleteEngine(engine.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Mining Engine Modal */}
        {showEngineModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-slate-800 rounded-lg p-6 w-full max-w-md">
              <h3 className="text-white text-xl font-bold mb-4">
                {editingEngine ? 'Edit Mining Engine' : 'Add New Mining Engine'}
              </h3>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const engineData = {
                  name: formData.get('name') as string,
                  price: parseFloat(formData.get('price') as string),
                  daily_earning_rate: parseFloat(formData.get('daily_earning_rate') as string),
                  duration_days: parseInt(formData.get('duration_days') as string),
                  is_active: formData.get('is_active') === 'on'
                };
                
                if (editingEngine) {
                  handleUpdateEngine(editingEngine.id, engineData);
                } else {
                  handleCreateEngine(engineData);
                }
              }}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-slate-400 text-sm font-medium mb-1">Engine Name</label>
                    <input 
                      type="text" 
                      name="name"
                      defaultValue={editingEngine?.name || ''}
                      className="w-full bg-slate-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-500" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-sm font-medium mb-1">Price (KES)</label>
                    <input 
                      type="number" 
                      name="price"
                      step="0.01"
                      defaultValue={editingEngine?.price || ''}
                      className="w-full bg-slate-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-500" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-sm font-medium mb-1">Daily Earning Rate (%)</label>
                    <input 
                      type="number" 
                      name="daily_earning_rate"
                      step="0.01"
                      defaultValue={editingEngine?.daily_earning_rate || ''}
                      className="w-full bg-slate-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-500" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-sm font-medium mb-1">Duration (Days)</label>
                    <input 
                      type="number" 
                      name="duration_days"
                      defaultValue={editingEngine?.duration_days || ''}
                      className="w-full bg-slate-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-500" 
                      required 
                    />
                  </div>
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      name="is_active"
                      defaultChecked={editingEngine?.is_active ?? true}
                      className="mr-2" 
                    />
                    <label className="text-slate-400 text-sm">Active</label>
                  </div>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button 
                    type="button"
                    onClick={() => {
                      setShowEngineModal(false);
                      setEditingEngine(null);
                    }}
                    className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded transition-colors"
                  >
                    {editingEngine ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}


      </div>
    );
  };

  const renderSystemSettings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-white text-2xl font-bold">System Settings</h2>
        {settingsSaved && (
          <div className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm">
            Settings saved successfully!
          </div>
        )}
      </div>
      
      {settingsLoading && (
        <div className="text-center py-8">
          <div className="text-slate-400">Loading settings...</div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Financial Settings */}
        <div className="bg-slate-800 rounded-lg p-6">
          <h3 className="text-white font-semibold mb-4">Financial Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-slate-400 text-sm font-medium mb-1">
                Minimum Withdrawal Amount (KES)
              </label>
              <input 
                type="number" 
                step="0.01"
                value={systemSettings.min_withdrawal_amount}
                onChange={(e) => handleSettingChange('min_withdrawal_amount', e.target.value)}
                className="w-full bg-slate-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-500" 
              />
            </div>
            <div>
              <label className="block text-slate-400 text-sm font-medium mb-1">
                Maximum Withdrawal Amount (KES)
              </label>
              <input 
                type="number" 
                step="0.01"
                value={systemSettings.max_withdrawal_amount}
                onChange={(e) => handleSettingChange('max_withdrawal_amount', e.target.value)}
                className="w-full bg-slate-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-500" 
              />
            </div>
            <div>
              <label className="block text-slate-400 text-sm font-medium mb-1">
                Daily Withdrawal Limit (KES)
              </label>
              <input 
                type="number" 
                step="0.01"
                value={systemSettings.daily_withdrawal_limit}
                onChange={(e) => handleSettingChange('daily_withdrawal_limit', e.target.value)}
                className="w-full bg-slate-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-500" 
              />
            </div>
            <div>
              <label className="block text-slate-400 text-sm font-medium mb-1">
                Withdrawal Fee (%)
              </label>
              <input 
                type="number" 
                step="0.01"
                value={systemSettings.withdrawal_fee_percentage}
                onChange={(e) => handleSettingChange('withdrawal_fee_percentage', e.target.value)}
                className="w-full bg-slate-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-500" 
              />
            </div>
            <div>
              <label className="block text-slate-400 text-sm font-medium mb-1">
                Withdrawal Processing Time (hours)
              </label>
              <input 
                type="number"
                value={systemSettings.withdrawal_processing_time}
                onChange={(e) => handleSettingChange('withdrawal_processing_time', e.target.value)}
                className="w-full bg-slate-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-500" 
              />
            </div>
          </div>
        </div>

        {/* Deposit Settings */}
        <div className="bg-slate-800 rounded-lg p-6">
          <h3 className="text-white font-semibold mb-4">Deposit Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-slate-400 text-sm font-medium mb-1">
                Minimum Deposit Amount (KES)
              </label>
              <input 
                type="number" 
                step="0.01"
                value={systemSettings.min_deposit_amount}
                onChange={(e) => handleSettingChange('min_deposit_amount', e.target.value)}
                className="w-full bg-slate-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-500" 
              />
            </div>
            <div>
              <label className="block text-slate-400 text-sm font-medium mb-1">
                Maximum Deposit Amount (KES)
              </label>
              <input 
                type="number" 
                step="0.01"
                value={systemSettings.max_deposit_amount}
                onChange={(e) => handleSettingChange('max_deposit_amount', e.target.value)}
                className="w-full bg-slate-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-500" 
              />
            </div>
            <div>
              <label className="block text-slate-400 text-sm font-medium mb-1">
                Deposit Fee (%)
              </label>
              <input 
                type="number" 
                step="0.01"
                value={systemSettings.deposit_fee_percentage}
                onChange={(e) => handleSettingChange('deposit_fee_percentage', e.target.value)}
                className="w-full bg-slate-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-500" 
              />
            </div>
          </div>
        </div>

        {/* Referral Settings */}
        <div className="bg-slate-800 rounded-lg p-6">
          <h3 className="text-white font-semibold mb-4">Referral Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-slate-400 text-sm font-medium mb-1">
                Referral Commission Rate (%)
              </label>
              <input 
                type="number" 
                step="0.01"
                value={systemSettings.referral_commission_rate}
                onChange={(e) => handleSettingChange('referral_commission_rate', e.target.value)}
                className="w-full bg-slate-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-500" 
              />
            </div>
            <div>
              <label className="block text-slate-400 text-sm font-medium mb-1">
                Referral Bonus Amount (KES)
              </label>
              <input 
                type="number" 
                step="0.01"
                value={systemSettings.referral_bonus_amount}
                onChange={(e) => handleSettingChange('referral_bonus_amount', e.target.value)}
                className="w-full bg-slate-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-500" 
              />
            </div>
            <div>
              <label className="block text-slate-400 text-sm font-medium mb-1">
                Minimum Referral Payout (KES)
              </label>
              <input 
                type="number" 
                step="0.01"
                value={systemSettings.min_referral_payout}
                onChange={(e) => handleSettingChange('min_referral_payout', e.target.value)}
                className="w-full bg-slate-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-500" 
              />
            </div>
          </div>
        </div>

        {/* Platform Settings */}
        <div className="bg-slate-800 rounded-lg p-6">
          <h3 className="text-white font-semibold mb-4">Platform Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-slate-400 text-sm font-medium mb-1">
                Platform Commission Rate (%)
              </label>
              <input 
                type="number" 
                step="0.01"
                value={systemSettings.platform_commission_rate}
                onChange={(e) => handleSettingChange('platform_commission_rate', e.target.value)}
                className="w-full bg-slate-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-500" 
              />
            </div>
            <div>
              <label className="block text-slate-400 text-sm font-medium mb-1">
                Maintenance Mode
              </label>
              <select 
                value={systemSettings.maintenance_mode}
                onChange={(e) => handleSettingChange('maintenance_mode', e.target.value)}
                className="w-full bg-slate-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="false">Disabled</option>
                <option value="true">Enabled</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-400 text-sm font-medium mb-1">
                Registration Enabled
              </label>
              <select 
                value={systemSettings.registration_enabled}
                onChange={(e) => handleSettingChange('registration_enabled', e.target.value)}
                className="w-full bg-slate-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="true">Enabled</option>
                <option value="false">Disabled</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-400 text-sm font-medium mb-1">
                KYC Required
              </label>
              <select 
                value={systemSettings.kyc_required}
                onChange={(e) => handleSettingChange('kyc_required', e.target.value)}
                className="w-full bg-slate-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-slate-800 rounded-lg p-6">
          <h3 className="text-white font-semibold mb-4">Notification Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-slate-400 text-sm font-medium mb-1">
                Email Notifications
              </label>
              <select 
                value={systemSettings.email_notifications}
                onChange={(e) => handleSettingChange('email_notifications', e.target.value)}
                className="w-full bg-slate-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="true">Enabled</option>
                <option value="false">Disabled</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-400 text-sm font-medium mb-1">
                SMS Notifications
              </label>
              <select 
                value={systemSettings.sms_notifications}
                onChange={(e) => handleSettingChange('sms_notifications', e.target.value)}
                className="w-full bg-slate-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="false">Disabled</option>
                <option value="true">Enabled</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-400 text-sm font-medium mb-1">
                Withdrawal Approval Email
              </label>
              <select 
                value={systemSettings.withdrawal_approval_email}
                onChange={(e) => handleSettingChange('withdrawal_approval_email', e.target.value)}
                className="w-full bg-slate-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="true">Enabled</option>
                <option value="false">Disabled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-slate-800 rounded-lg p-6">
          <h3 className="text-white font-semibold mb-4">Security Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-slate-400 text-sm font-medium mb-1">
                Max Login Attempts
              </label>
              <input 
                type="number"
                value={systemSettings.max_login_attempts}
                onChange={(e) => handleSettingChange('max_login_attempts', e.target.value)}
                className="w-full bg-slate-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-500" 
              />
            </div>
            <div>
              <label className="block text-slate-400 text-sm font-medium mb-1">
                Session Timeout (seconds)
              </label>
              <input 
                type="number"
                value={systemSettings.session_timeout}
                onChange={(e) => handleSettingChange('session_timeout', e.target.value)}
                className="w-full bg-slate-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-500" 
              />
            </div>
            <div>
              <label className="block text-slate-400 text-sm font-medium mb-1">
                Password Minimum Length
              </label>
              <input 
                type="number"
                value={systemSettings.password_min_length}
                onChange={(e) => handleSettingChange('password_min_length', e.target.value)}
                className="w-full bg-slate-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-500" 
              />
            </div>
          </div>
        </div>

        {/* Mining Settings */}
        <div className="bg-slate-800 rounded-lg p-6">
          <h3 className="text-white font-semibold mb-4">Mining Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-slate-400 text-sm font-medium mb-1">
                Default Mining Duration (days)
              </label>
              <input 
                type="number"
                value={systemSettings.default_mining_duration}
                onChange={(e) => handleSettingChange('default_mining_duration', e.target.value)}
                className="w-full bg-slate-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-500" 
              />
            </div>
            <div>
              <label className="block text-slate-400 text-sm font-medium mb-1">
                Minimum Mining Investment (KES)
              </label>
              <input 
                type="number" 
                step="0.01"
                value={systemSettings.min_mining_investment}
                onChange={(e) => handleSettingChange('min_mining_investment', e.target.value)}
                className="w-full bg-slate-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-500" 
              />
            </div>
            <div>
              <label className="block text-slate-400 text-sm font-medium mb-1">
                Maximum Mining Investment (KES)
              </label>
              <input 
                type="number" 
                step="0.01"
                value={systemSettings.max_mining_investment}
                onChange={(e) => handleSettingChange('max_mining_investment', e.target.value)}
                className="w-full bg-slate-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-500" 
              />
            </div>
          </div>
        </div>

        {/* Additional Settings */}
        <div className="bg-slate-800 rounded-lg p-6">
          <h3 className="text-white font-semibold mb-4">Additional Settings</h3>
          <div className="space-y-4">
            <div className="bg-slate-700 rounded p-4">
              <h4 className="text-white font-medium mb-2">Current Settings Summary</h4>
              <div className="text-slate-300 text-sm space-y-1">
                <p>Min Withdrawal: KES {parseFloat(systemSettings.min_withdrawal_amount).toLocaleString()}</p>
                <p>Referral Rate: {systemSettings.referral_commission_rate}%</p>
                <p>Platform Commission: {systemSettings.platform_commission_rate}%</p>
                <p>Maintenance: {systemSettings.maintenance_mode === 'true' ? 'ON' : 'OFF'}</p>
                <p>Registration: {systemSettings.registration_enabled === 'true' ? 'OPEN' : 'CLOSED'}</p>
              </div>
            </div>
            <div className="bg-yellow-600/20 border border-yellow-500/30 rounded p-4">
              <div className="flex items-start space-x-2">
                <div className="text-yellow-500 mt-0.5">⚠️</div>
                <div>
                  <p className="text-yellow-200 font-medium text-sm">Important Notice</p>
                  <p className="text-yellow-300 text-xs mt-1">
                    Changes to these settings will take effect immediately and may impact user experience. 
                    Please review carefully before saving.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button 
          onClick={() => {
            if (confirm('Are you sure you want to reset all settings to defaults?')) {
              setSystemSettings({
                min_withdrawal_amount: '100.00',
                max_withdrawal_amount: '50000.00',
                daily_withdrawal_limit: '100000.00',
                withdrawal_fee_percentage: '0.00',
                withdrawal_processing_time: '24',
                min_deposit_amount: '50.00',
                max_deposit_amount: '100000.00',
                deposit_fee_percentage: '0.00',
                referral_commission_rate: '10.00',
                referral_bonus_amount: '50.00',
                min_referral_payout: '100.00',
                platform_commission_rate: '5.00',
                maintenance_mode: 'false',
                registration_enabled: 'true',
                kyc_required: 'false',
                default_mining_duration: '365',
                min_mining_investment: '100.00',
                max_mining_investment: '1000000.00',
                platform_name: 'CryptoMine Pro',
                support_email: 'support@cryptominepro.com'
              });
            }
          }}
          className="bg-slate-600 hover:bg-slate-700 text-white px-6 py-2 rounded-lg transition-colors"
        >
          Reset to Defaults
        </button>
        <button 
          onClick={handleSaveSettings}
          disabled={settingsLoading}
          className="bg-orange-500 hover:bg-orange-600 disabled:bg-orange-400 text-white px-6 py-2 rounded-lg transition-colors flex items-center space-x-2"
        >
          {settingsLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Saving...</span>
            </>
          ) : (
            <span>Save Settings</span>
          )}
        </button>
      </div>
    </div>
  );

  const renderActivityLogs = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-white text-2xl font-bold">Activity Logs</h2>
        <div className="flex items-center space-x-3">
          <select className="bg-slate-700 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
            <option value="">All Actions</option>
            <option value="user_status_update">User Status Updates</option>
            <option value="balance_adjustment">Balance Adjustments</option>
            <option value="deposit_approval">Deposit Approvals</option>
            <option value="withdrawal_processing">Withdrawal Processing</option>
          </select>
          <input
            type="date"
            className="bg-slate-700 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
      </div>

      <div className="bg-slate-800 rounded-lg overflow-hidden">
        <div className="p-4 border-b border-slate-700">
          <div className="grid grid-cols-5 gap-4 text-slate-400 text-sm font-medium">
            <div>Admin</div>
            <div>Action</div>
            <div>Target</div>
            <div>Details</div>
            <div>Timestamp</div>
          </div>
        </div>
        
        {sectionLoading ? (
          <div className="p-8 text-center">
            <div className="text-slate-400">Loading activity logs...</div>
          </div>
        ) : activities.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-slate-400">No recent activities found</div>
            <p className="text-xs mt-2">Admin activities will appear here as they occur</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-700">
            {activities.map((activity) => (
              <div key={activity.id} className="p-4">
                <div className="grid grid-cols-5 gap-4 items-center">
                  <div>
                    <div className="font-medium text-white">{activity.admin?.full_name || 'Admin'}</div>
                    <div className="text-slate-400 text-sm">ID: {activity.admin_id}</div>
                  </div>
                  <div className="text-slate-300">{activity.action}</div>
                  <div className="text-slate-300">
                    {activity.target_type} #{activity.target_id}
                  </div>
                  <div className="text-slate-400 text-sm">
                    {activity.details}
                  </div>
                  <div className="text-slate-400 text-sm">
                    {new Date(activity.created_at).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Admin Header */}
      <header className="bg-slate-800 border-b border-slate-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-white font-bold text-xl">Admin Dashboard</h1>
              <p className="text-slate-400 text-sm">CryptoMine Pro - Administration Panel</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-white font-medium">{user?.full_name}</p>
              <p className="text-slate-400 text-sm">{user?.email}</p>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-slate-800 min-h-screen border-r border-slate-700">
          <nav className="p-4">
            <div className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      isActive
                        ? 'bg-orange-500 text-white'
                        : 'text-slate-400 hover:text-white hover:bg-slate-700'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {renderContent()}
        </main>
      </div>

      {/* User Details Modal - Global Modal positioned at component root level */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white text-xl font-bold">User Details</h3>
              <button 
                onClick={() => {
                  setShowUserModal(false);
                  setSelectedUser(null);
                  setUserDetails(null);
                }}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 text-sm font-medium mb-1">Full Name</label>
                  <div className="text-white bg-slate-700 px-3 py-2 rounded">{selectedUser.full_name}</div>
                </div>
                <div>
                  <label className="block text-slate-400 text-sm font-medium mb-1">Email</label>
                  <div className="text-white bg-slate-700 px-3 py-2 rounded">{selectedUser.email}</div>
                </div>
                <div>
                  <label className="block text-slate-400 text-sm font-medium mb-1">Role</label>
                  <div className="text-white bg-slate-700 px-3 py-2 rounded">{selectedUser.role}</div>
                </div>
                <div>
                  <label className="block text-slate-400 text-sm font-medium mb-1">Status</label>
                  <div className="text-white bg-slate-700 px-3 py-2 rounded">{selectedUser.status || 'active'}</div>
                </div>
                <div>
                  <label className="block text-slate-400 text-sm font-medium mb-1">Current Balance</label>
                  <div className="text-white bg-slate-700 px-3 py-2 rounded">KES {(selectedUser.balance || 0).toLocaleString()}</div>
                </div>
                <div>
                  <label className="block text-slate-400 text-sm font-medium mb-1">Total Earnings</label>
                  <div className="text-white bg-slate-700 px-3 py-2 rounded">KES {(selectedUser.total_earnings || 0).toLocaleString()}</div>
                </div>
                <div>
                  <label className="block text-slate-400 text-sm font-medium mb-1">Referral Code</label>
                  <div className="text-white bg-slate-700 px-3 py-2 rounded">{selectedUser.referral_code || 'Not set'}</div>
                </div>
                <div>
                  <label className="block text-slate-400 text-sm font-medium mb-1">Joined Date</label>
                  <div className="text-white bg-slate-700 px-3 py-2 rounded">{new Date(selectedUser.created_at).toLocaleDateString()}</div>
                </div>
              </div>

              {/* Transaction History */}
              {userDetails && (
                <div>
                  <h4 className="text-white font-semibold mb-3">Transaction History</h4>
                  <div className="space-y-3">
                    {userDetails.deposits && userDetails.deposits.length > 0 && (
                      <div>
                        <h5 className="text-slate-300 text-sm font-medium mb-2">Recent Deposits ({userDetails.deposits.length})</h5>
                        <div className="bg-slate-700 rounded p-3 max-h-32 overflow-y-auto">
                          {userDetails.deposits.slice(0, 5).map((deposit: any, index: number) => (
                            <div key={index} className="flex justify-between text-sm">
                              <span className="text-slate-300">KES {deposit.amount?.toLocaleString()}</span>
                              <span className="text-slate-400">{new Date(deposit.created_at).toLocaleDateString()}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {userDetails.withdrawals && userDetails.withdrawals.length > 0 && (
                      <div>
                        <h5 className="text-slate-300 text-sm font-medium mb-2">Recent Withdrawals ({userDetails.withdrawals.length})</h5>
                        <div className="bg-slate-700 rounded p-3 max-h-32 overflow-y-auto">
                          {userDetails.withdrawals.slice(0, 5).map((withdrawal: any, index: number) => (
                            <div key={index} className="flex justify-between text-sm">
                              <span className="text-slate-300">KES {withdrawal.amount?.toLocaleString()}</span>
                              <span className="text-slate-400">{new Date(withdrawal.created_at).toLocaleDateString()}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {userDetails.purchases && userDetails.purchases.length > 0 && (
                      <div>
                        <h5 className="text-slate-300 text-sm font-medium mb-2">Mining Investments ({userDetails.purchases.length})</h5>
                        <div className="bg-slate-700 rounded p-3 max-h-32 overflow-y-auto">
                          {userDetails.purchases.slice(0, 5).map((purchase: any, index: number) => (
                            <div key={index} className="flex justify-between text-sm">
                              <span className="text-slate-300">KES {purchase.amount?.toLocaleString()}</span>
                              <span className="text-slate-400">{new Date(purchase.created_at).toLocaleDateString()}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-700">
                <button 
                  onClick={() => handleBalanceAdjustment(selectedUser.id)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors"
                >
                  Adjust Balance
                </button>
                {selectedUser.status !== 'suspended' && (
                  <button 
                    onClick={() => {
                      handleUserStatusUpdate(selectedUser.id, 'suspended');
                      setShowUserModal(false);
                    }}
                    className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded transition-colors"
                  >
                    Suspend User
                  </button>
                )}
                {selectedUser.status !== 'deactivated' && (
                  <button 
                    onClick={() => {
                      handleUserStatusUpdate(selectedUser.id, 'deactivated');
                      setShowUserModal(false);
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
                  >
                    Deactivate User
                  </button>
                )}
                {(selectedUser.status === 'suspended' || selectedUser.status === 'deactivated') && (
                  <button 
                    onClick={() => {
                      handleUserStatusUpdate(selectedUser.id, 'active');
                      setShowUserModal(false);
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors"
                  >
                    Activate User
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
