import { useState } from 'react';
import { DollarSign, AlertTriangle } from 'lucide-react';
import { withdrawalAPI } from '../utils/api';

interface WithdrawModalProps {
  onBack?: () => void;
}

export const WithdrawModal = ({ onBack }: WithdrawModalProps) => {
  const [selectedNetwork, setSelectedNetwork] = useState('mpesa');
  const [amount, setAmount] = useState('');
  const [phoneNumber, setPhoneNumber] = useState(() => {
    // Auto-fill phone number from localStorage
    return localStorage.getItem('userPhoneNumber') || '';
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const networks = [
    {
      id: 'mpesa',
      name: 'M-Pesa',
      minAmount: 200,
      maxAmount: 70000,
      processingTime: '1-5 minutes'
    },
    {
      id: 'airtel',
      name: 'Airtel Money',
      minAmount: 200,
      maxAmount: 70000,
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
      message: 'Please enter a valid phone number. Format: 254788888888 or 0788888888' 
    };
  };

  // Format phone number for API (ensure it's in 254XXXXXXX format)
  const formatPhoneNumber = (phone: string): string => {
    const cleanPhone = phone.replace(/\D/g, '');
    
    // If it's already in international format (254XXXXXXX)
    if (cleanPhone.startsWith('254')) {
      return cleanPhone;
    }
    
    // If it's in local format (07XXXXXXX, 01XXXXXXX), convert to international
    if (cleanPhone.startsWith('0')) {
      return '254' + cleanPhone.substring(1);
    }
    
    return cleanPhone;
  };

  const handleWithdraw = async () => {
    setError(null);
    setSuccessMessage(null);
    if (!amount || parseFloat(amount) < 10000) {
      setError('Please enter a valid amount (min KES 10000)');
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
      setSuccessMessage('Your withdrawal request has been received. It is currently being processed and will reflect shortly.');
      if (onBack) onBack();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initiate withdrawal');
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
      {successMessage && (
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
        />
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
          placeholder="254788888888 or 0788888888"
        />
        <p className="text-slate-500 text-sm mt-1">
          Enter your {selectedNetwork === 'mpesa' ? 'M-Pesa' : 'Airtel Money'} registered phone number (Format: 254788888888 or 0788888888)
        </p>
      </div>

      <button
        onClick={handleWithdraw}
        disabled={loading}
        className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50"
      >
        {loading ? 'Submitting Withdrawal...' : 'Confirm Withdrawal'}
      </button>

      <div className="bg-slate-800 rounded-lg p-4 border-l-4 border-yellow-500">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />
          <div>
            <h4 className="text-white font-semibold mb-1">Important Notice</h4>
            <p className="text-slate-400 text-sm">
              Ensure your phone number is correct and in the format 254788888888. Withdrawals to wrong numbers cannot be reversed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
