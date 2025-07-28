import { useState } from 'react';
import {AlertTriangle, Check, X, Trash2 } from 'lucide-react';
import { withdrawalAPI } from '../utils/api';

interface WithdrawModalProps {
  onBack?: () => void;
  isAdmin?: boolean;
  withdrawalId?: string;
}

export const WithdrawModal = ({ onBack, isAdmin = false, withdrawalId }: WithdrawModalProps) => {
  const [selectedNetwork, setSelectedNetwork] = useState('mpesa');
  const [amount, setAmount] = useState('');
  const [phoneNumber, setPhoneNumber] = useState(() => {
    // Auto-fill phone number from localStorage
    return localStorage.getItem('userPhoneNumber') || '';
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);

  const networks = [
    {
      id: 'mpesa',
      name: 'M-Pesa',
      minAmount: 50,
      maxAmount: 100000,
      processingTime: '1-5 minutes'
    },
    {
      id: 'airtel',
      name: 'Airtel Money',
      minAmount: 50,
      maxAmount: 100000,
      processingTime: '1-5 minutes'
    }
  ];

  // Phone number validation function
  const validatePhoneNumber = (phone: string): { isValid: boolean; message?: string } => {
    // Remove all non-digit characters
    const cleanPhone = phone.replace(/\D/g, '');
    
    // Check if it matches Kenyan format (254XXXXXXX - should be 12 digits total)
    if (cleanPhone.length === 12 && cleanPhone.startsWith('254')) {
      return { isValid: true };
    }
    
    // Check if it matches local format (07XXXXXXX, 01XXXXXXX - should be 10 digits)
    if (cleanPhone.length === 10 && (cleanPhone.startsWith('07') || cleanPhone.startsWith('01'))) {
      return { isValid: true };
    }
    
    return { 
      isValid: false, 
      message: 'Please enter a valid phone number. Format: 0788888888 or 254788888888' 
    };
  };

  // Format phone number for API (convert from international format to local format)
  const formatPhoneNumber = (phone: string): string => {
    const cleanPhone = phone.replace(/\D/g, '');
    
    // If it's in international format (254XXXXXXX), convert to local format
    if (cleanPhone.startsWith('254')) {
      return '0' + cleanPhone.substring(3);
    }
    
    // If it's already in local format (07XXXXXXX, 01XXXXXXX)
    if (cleanPhone.startsWith('0')) {
      return cleanPhone;
    }
    
    return cleanPhone;
  };

  const handleWithdraw = async () => {
    setError(null);
    setSuccessMessage(null);
    const amountValue = parseFloat(amount);
    if (!amount || amountValue < 50) {
      setError('Please enter a valid amount (minimum withdrawal: KES 50)');
      return;
    }
    if (amountValue > 100000) {
      setError('Maximum withdrawal amount is KES 100,000');
      return;
    }
    if (!phoneNumber) {
      setError('Please enter your phone number');
      return;
    }
    // Validate phone number
    const phoneValidation = validatePhoneNumber(phoneNumber);
    if (!phoneValidation.isValid) {
      setError(phoneValidation.message || 'Invalid phone number format');
      return;
    }
    setLoading(true);
    try {
      // Format phone number for API
      const formattedPhone = formatPhoneNumber(phoneNumber);
      await withdrawalAPI.request({
        amount: parseFloat(amount),
        account_details: {
          type: selectedNetwork,
          phone: formattedPhone
        }
      });
      setShowPopup(true);
      setSuccessMessage('Your withdrawal request has been received. It is currently being processed and will reflect shortly.');
      setAmount('');
      setPhoneNumber('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initiate withdrawal');
    } finally {
      setLoading(false);
    }
  };
  
  // Admin functions for managing withdrawals
  const handleApproveWithdrawal = async () => {
    if (!withdrawalId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      await withdrawalAPI.approve(withdrawalId);
      setSuccessMessage('Withdrawal approved successfully. The funds have been sent to the user.');
      
      // Close modal after a delay
      setTimeout(() => {
        if (onBack) onBack();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to approve withdrawal');
    } finally {
      setLoading(false);
    }
  };
  
  const handleRejectWithdrawal = async () => {
    if (!withdrawalId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      await withdrawalAPI.reject(withdrawalId);
      setSuccessMessage('Withdrawal rejected. The funds have been returned to the user\'s balance.');
      
      // Close modal after a delay
      setTimeout(() => {
        if (onBack) onBack();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reject withdrawal');
    } finally {
      setLoading(false);
    }
  };
  
  const handleDeleteWithdrawal = async () => {
    if (!withdrawalId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      await withdrawalAPI.delete(withdrawalId);
      setSuccessMessage('Withdrawal record deleted successfully.');
      
      // Close modal after a delay
      setTimeout(() => {
        if (onBack) onBack();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete withdrawal record');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-600 text-white p-3 rounded mb-4 text-center">
          {error}
        </div>
      )}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-slate-900 rounded-lg p-8 max-w-sm w-full flex flex-col items-center">
            <Check className="w-12 h-12 text-green-500 mb-4" />
            <h3 className="text-white text-lg font-bold mb-2">Withdrawal Request Received</h3>
            <p className="text-slate-300 text-center mb-4">Your withdrawal request has been received.<br/>It is currently being processed and will reflect shortly.</p>
            <button
              className="mt-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
              onClick={() => {
                setShowPopup(false);
                if (onBack) onBack();
              }}
            >OK</button>
          </div>
        </div>
      )}
      {successMessage && !showPopup && (
        <div className="bg-green-600 text-white p-3 rounded mb-4 text-center">
          {successMessage}
        </div>
      )}
      <div>
        <label className="block text-slate-400 text-sm font-medium mb-3">
          Select Network
        </label>
        <div className="space-y-3">
          {networks.map((network) => (
            <label key={network.id} className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="network"
                value={network.id}
                checked={selectedNetwork === network.id}
                onChange={(e) => setSelectedNetwork(e.target.value)}
                className="w-4 h-4 text-orange-500 bg-slate-800 border-slate-700 focus:ring-orange-500 focus:ring-2"
              />
              <div className="flex-1 flex items-center justify-between">
                <span className="text-white font-medium">{network.name}</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-slate-400 text-sm font-medium mb-2">
          Withdrawal Amount (KES)
        </label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-colors"
          placeholder="Enter amount"
          min={50}
        />
        <p className="text-slate-500 text-sm mt-1">
          Minimum: KES 50 • Maximum: KES 100,000 • Zero transaction fees
        </p>
      </div>

      <div>
        <label className="block text-slate-400 text-sm font-medium mb-2">
          Phone Number
        </label>
        <input
          type="tel"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-colors"
          placeholder="0788888888 or 254788888888"
        />
        <p className="text-slate-500 text-sm mt-1">
          Enter your {selectedNetwork === 'mpesa' ? 'M-Pesa' : 'Airtel Money'} registered phone number (Format: 0788888888 or 254788888888)
        </p>
      </div>

      {isAdmin ? (
        <div className="space-y-4">
          <div className="flex space-x-2">
            <button
              onClick={handleApproveWithdrawal}
              disabled={loading}
              className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              <Check className="w-5 h-5" />
              <span>{loading ? 'Processing...' : 'Approve'}</span>
            </button>
            
            <button
              onClick={handleRejectWithdrawal}
              disabled={loading}
              className="flex-1 bg-red-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              <X className="w-5 h-5" />
              <span>{loading ? 'Processing...' : 'Reject'}</span>
            </button>
          </div>
          
          <button
            onClick={handleDeleteWithdrawal}
            disabled={loading}
            className="w-full bg-slate-700 text-white py-3 rounded-lg font-semibold hover:bg-slate-600 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            <Trash2 className="w-5 h-5" />
            <span>{loading ? 'Processing...' : 'Delete'}</span>
          </button>
        </div>
      ) : (
        <button
          onClick={handleWithdraw}
          disabled={loading}
          className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50"
        >
          {loading ? 'Submitting Withdrawal...' : 'Confirm Withdrawal'}
        </button>
      )}

      <div className="bg-slate-800 rounded-lg p-4 border-l-4 border-yellow-500">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />
          <div>
            <h4 className="text-white font-semibold mb-1">Important Notice</h4>
            <p className="text-slate-400 text-sm">
              Ensure your phone number is correct and in the format 0788888888. Withdrawals to wrong numbers cannot be reversed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
