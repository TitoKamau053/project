import { useState } from 'react';
import { ArrowLeft, Filter, Download, ArrowUpRight, ArrowDownLeft, Clock, Check, X } from 'lucide-react';

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
}

export const TransactionHistory = ({ onBack }: TransactionHistoryProps) => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('30');

  const transactions: Transaction[] = [
    {
      id: 'T001',
      type: 'deposit',
      amount: 5000,
      status: 'completed',
      date: '2025-01-17',
      time: '14:30',
      method: 'M-Pesa',
      description: 'Account deposit via M-Pesa',
      reference: 'MP17011430'
    },
    {
      id: 'T002',
      type: 'mining',
      amount: 500,
      status: 'completed',
      date: '2025-01-17',
      time: '10:15',
      description: 'Daily Mine Pro - Mining reward',
      reference: 'MR17011015'
    },
    {
      id: 'T003',
      type: 'withdrawal',
      amount: 2000,
      status: 'pending',
      date: '2025-01-16',
      time: '16:45',
      method: 'M-Pesa',
      description: 'Withdrawal to M-Pesa',
      reference: 'WD16011645'
    },
    {
      id: 'T004',
      type: 'referral',
      amount: 250,
      status: 'completed',
      date: '2025-01-15',
      time: '09:20',
      description: 'Referral commission from John K.',
      reference: 'RF15010920'
    },
    {
      id: 'T005',
      type: 'deposit',
      amount: 10000,
      status: 'completed',
      date: '2025-01-14',
      time: '11:30',
      method: 'Bank Transfer',
      description: 'Account deposit via Bank Transfer',
      reference: 'BT14011130'
    },
    {
      id: 'T006',
      type: 'mining',
      amount: 750,
      status: 'completed',
      date: '2025-01-13',
      time: '15:45',
      description: 'Crypto Blast - Mining reward',
      reference: 'MR13011545'
    },
    {
      id: 'T007',
      type: 'withdrawal',
      amount: 3000,
      status: 'failed',
      date: '2025-01-12',
      time: '08:15',
      method: 'M-Pesa',
      description: 'Failed withdrawal - Insufficient balance',
      reference: 'WD12010815'
    }
  ];

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
      .reduce((sum, t) => sum + t.amount, 0),
    totalWithdrawals: transactions
      .filter(t => t.type === 'withdrawal' && t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0),
    totalEarnings: transactions
      .filter(t => (t.type === 'mining' || t.type === 'referral') && t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0)
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
        <button className="text-slate-400 hover:text-white transition-colors">
          <Download className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4 space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-slate-800 rounded-lg p-4">
            <p className="text-slate-400 text-sm">Total Deposits</p>
            <p className="text-green-500 text-lg font-bold">
              KES {totalStats.totalDeposits.toLocaleString()}
            </p>
          </div>
          <div className="bg-slate-800 rounded-lg p-4">
            <p className="text-slate-400 text-sm">Total Withdrawn</p>
            <p className="text-orange-500 text-lg font-bold">
              KES {totalStats.totalWithdrawals.toLocaleString()}
            </p>
          </div>
          <div className="bg-slate-800 rounded-lg p-4">
            <p className="text-slate-400 text-sm">Total Earnings</p>
            <p className="text-blue-500 text-lg font-bold">
              KES {totalStats.totalEarnings.toLocaleString()}
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
          
          {filteredTransactions.length > 0 ? (
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
