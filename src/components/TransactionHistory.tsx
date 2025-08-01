import { useState, useEffect } from 'react';
import { ArrowLeft, Filter, Download, ArrowUpRight, ArrowDownLeft, Clock, Check, X } from 'lucide-react';
import { transactionAPI } from '../utils/api';

interface TransactionHistoryProps {
  onBack: () => void;
}

interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'mining' | 'referral';
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  date: string;
  time: string;
  method?: string;
  description: string;
  reference?: string;
  created_at?: string;
}

interface BackendTransaction {
  id: number;
  type: string;
  amount: string | number;
  status: string;
  created_at: string;
  payment_method?: string;
  method?: string;
  description?: string;
  reference?: string;
  transaction_id?: string;
}

export const TransactionHistory = ({ onBack }: TransactionHistoryProps) => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('30');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch transactions from backend
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Pass filters to the API
        const filters = {
          type: selectedFilter,
          period: selectedPeriod,
        };
        
        const response = await transactionAPI.getUserTransactions(filters);
        
        // Transform backend response to match our interface
        const transformedTransactions = response.transactions?.map((transaction: BackendTransaction) => ({
          id: transaction.id.toString(),
          type: transaction.type as 'deposit' | 'withdrawal' | 'mining' | 'referral' || 'deposit',
          amount: parseFloat(transaction.amount?.toString() || '0'),
          status: transaction.status as 'completed' | 'pending' | 'failed' || 'pending',
          date: transaction.created_at ? new Date(transaction.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          time: transaction.created_at ? new Date(transaction.created_at).toTimeString().slice(0, 5) : new Date().toTimeString().slice(0, 5),
          method: transaction.payment_method || transaction.method || 'M-Pesa',
          description: transaction.description || getDefaultDescription(transaction.type, parseFloat(transaction.amount?.toString() || '0')),
          reference: transaction.reference || transaction.transaction_id || `TX${transaction.id}`,
          created_at: transaction.created_at
        })) || [];
        
        setTransactions(transformedTransactions);
      } catch (err) {
        console.error('Failed to fetch transactions:', err);
        setError(err instanceof Error ? err.message : 'Failed to load transaction history');
        // Use empty array as fallback if API fails
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [selectedFilter, selectedPeriod]); // Re-fetch when filters change

  // Helper function to generate default descriptions
  const getDefaultDescription = (type: string, amount: number) => {
    switch (type) {
      case 'deposit':
        return `Account deposit of KES ${amount.toLocaleString()}`;
      case 'withdrawal':
        return `Withdrawal of KES ${amount.toLocaleString()}`;
      case 'mining':
        return `Mining reward of KES ${amount.toLocaleString()}`;
      case 'referral':
        return `Referral commission of KES ${amount.toLocaleString()}`;
      default:
        return `Transaction of KES ${amount.toLocaleString()}`;
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    if (selectedFilter === 'all') return true;
    return transaction.type === selectedFilter;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <ArrowDownLeft className="w-5 h-5 text-green-500" />;
      case 'withdrawal':
        return <ArrowUpRight className="w-5 h-5 text-orange-500" />;
      case 'mining':
        return <div className="w-5 h-5 bg-blue-500 rounded text-white text-xs flex items-center justify-center">M</div>;
      case 'referral':
        return <div className="w-5 h-5 bg-purple-500 rounded text-white text-xs flex items-center justify-center">R</div>;
      default:
        return <Clock className="w-5 h-5 text-slate-400" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <Check className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'failed':
        return <X className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-slate-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-500';
      case 'pending':
        return 'text-yellow-500';
      case 'failed':
        return 'text-red-500';
      default:
        return 'text-slate-400';
    }
  };

  const getAmountColor = (type: string, status: string) => {
    if (status === 'failed') return 'text-slate-400';
    
    switch (type) {
      case 'deposit':
      case 'mining':
      case 'referral':
        return 'text-green-500';
      case 'withdrawal':
        return 'text-orange-500';
      default:
        return 'text-white';
    }
  };

    const totalStats = {
      totalDeposits: transactions
        .filter(t => t.type === 'deposit' && t.status === 'completed')
        .reduce((sum, t) => sum + (parseFloat(t.amount?.toString() || '0') || 0), 0),
      totalWithdrawals: transactions
        .filter(t => t.type === 'withdrawal' && t.status === 'completed')  
        .reduce((sum, t) => sum + (parseFloat(t.amount?.toString() || '0') || 0), 0),
      totalEarnings: transactions
        .filter(t => (t.type === 'mining' || t.type === 'referral') && t.status === 'completed')
        .reduce((sum, t) => sum + (parseFloat(t.amount?.toString() || '0') || 0), 0)
    };

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
        <h1 className="text-white font-bold text-lg">Transaction History</h1>
        <button 
          className="text-slate-400 hover:text-white transition-colors"
          title="Export transactions"
          aria-label="Export transactions"
        >
          <Download className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4 space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-slate-800 rounded-lg p-4">
            <p className="text-slate-400 text-sm">Total Deposits</p>
            <p className="text-green-500 text-lg font-bold">
              KES {totalStats.totalDeposits.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          <div className="bg-slate-800 rounded-lg p-4">
            <p className="text-slate-400 text-sm">Total Withdrawn</p>
            <p className="text-orange-500 text-lg font-bold">
              KES {totalStats.totalWithdrawals.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          <div className="bg-slate-800 rounded-lg p-4">
            <p className="text-slate-400 text-sm">Total Earnings</p>
            <p className="text-blue-500 text-lg font-bold">
              KES {totalStats.totalEarnings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            {/* Add debug info temporarily */}
            <p className="text-slate-500 text-xs mt-1">
              ({transactions.filter(t => (t.type === 'mining' || t.type === 'referral') && t.status === 'completed').length} earning transactions)
            </p>
          </div>
        </div>
        {/* Filters */}
        <div className="bg-slate-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">Filter Transactions</h3>
            <Filter className="w-5 h-5 text-slate-400" />
          </div>
          
          {/* Type Filter */}
          <div className="mb-4">
            <p className="text-slate-400 text-sm mb-2">Transaction Type</p>
            <div className="flex flex-wrap gap-2">
              {['all', 'deposit', 'withdrawal', 'mining', 'referral'].map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedFilter(type)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors capitalize ${
                    selectedFilter === type
                      ? 'bg-orange-500 text-white'
                      : 'bg-slate-700 text-slate-400 hover:text-white'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Period Filter */}
          <div>
            <p className="text-slate-400 text-sm mb-2">Time Period</p>
            <div className="flex gap-2">
              {[
                { value: '7', label: '7 Days' },
                { value: '30', label: '30 Days' },
                { value: '90', label: '3 Months' },
                { value: 'all', label: 'All Time' }
              ].map((period) => (
                <button
                  key={period.value}
                  onClick={() => setSelectedPeriod(period.value)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    selectedPeriod === period.value
                      ? 'bg-orange-500 text-white'
                      : 'bg-slate-700 text-slate-400 hover:text-white'
                  }`}
                >
                  {period.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Transactions List */}
        <div className="bg-slate-800 rounded-lg p-4">
          <h3 className="text-white font-semibold mb-4">
            Recent Transactions ({filteredTransactions.length})
          </h3>
          
          {loading ? (
            <div className="text-center py-8">
              <Clock className="w-12 h-12 text-slate-400 mx-auto mb-4 animate-spin" />
              <p className="text-slate-400">Loading transactions...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <X className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <p className="text-red-400 mb-2">Failed to load transactions</p>
              <p className="text-slate-400 text-sm">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="mt-3 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Retry
              </button>
            </div>
          ) : filteredTransactions.length > 0 ? (
            <div className="space-y-3">
              {filteredTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="bg-slate-900 rounded-lg p-4 border border-slate-700"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="mt-1">
                        {getTypeIcon(transaction.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <p className="text-white font-semibold capitalize">
                            {transaction.type}
                          </p>
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(transaction.status)}
                            <span className={`text-sm capitalize ${getStatusColor(transaction.status)}`}>
                              {transaction.status}
                            </span>
                          </div>
                        </div>
                        <p className="text-slate-400 text-sm mb-2">
                          {transaction.description}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-slate-500">
                          <span>{transaction.date} • {transaction.time}</span>
                          {transaction.method && <span>{transaction.method}</span>}
                          {transaction.reference && <span>Ref: {transaction.reference}</span>}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${getAmountColor(transaction.type, transaction.status)}`}>
                        {transaction.type === 'deposit' || transaction.type === 'mining' || transaction.type === 'referral' ? '+' : '-'}
                        KES {transaction.amount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Clock className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-400">No transactions found for the selected filter</p>
            </div>
          )}
        </div>

        {/* Export Options */}
        <div className="bg-slate-800 rounded-lg p-4">
          <h3 className="text-white font-semibold mb-3">Export Options</h3>
          <div className="grid grid-cols-2 gap-3">
            <button className="bg-slate-700 text-white py-2 px-4 rounded-lg hover:bg-slate-600 transition-colors">
              Export PDF
            </button>
            <button className="bg-slate-700 text-white py-2 px-4 rounded-lg hover:bg-slate-600 transition-colors">
              Export Excel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
