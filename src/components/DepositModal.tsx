import { useState } from 'react';
import { Check } from 'lucide-react';
import { depositAPI } from '../utils/api';

interface DepositModalProps {
  onBack?: () => void;
}

export const DepositModal = ({ onBack }: DepositModalProps) => {
  const [amount, setAmount] = useState('');
  const [phoneNumber, setPhoneNumber] = useState(() => {
    // Auto-fill phone number from localStorage
    return localStorage.getItem('userPhoneNumber') || '';
  });

  const minAmount = 100;
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

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

  const handleDeposit = async () => {
    setError(null);
    setSuccessMessage(null);
    
    if (!amount || parseFloat(amount) < minAmount) {
      setError('Please enter a valid amount');
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
      
      await depositAPI.initiate({
        amount: parseFloat(amount),
        phoneNumber: formattedPhone
      });
      
      setSuccessMessage('Deposit received successfully. Your balance has been updated accordingly.');
      setAmount('');
      setPhoneNumber('');
      
      // Close modal after a delay
      setTimeout(() => {
        if (onBack) onBack();
      }, 2000);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to initiate deposit');
      }
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
        <label className="block text-slate-400 text-sm font-medium mb-2">
          Deposit Amount (KES)
        </label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-colors"
          placeholder="Enter amount"
          min={minAmount}
        />
        <p className="text-slate-500 text-sm mt-1">
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
          placeholder="254788888888 or 0788888888"
        />
        <p className="text-slate-500 text-sm mt-1">
          Enter your M-Pesa registered phone number (Format: 254788888888 or 0788888888)
        </p>
      </div>

      <button
        onClick={handleDeposit}
        disabled={loading}
        className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50"
      >
        {loading ? 'Initiating Deposit...' : 'Confirm Deposit'}
      </button>

      <div className="bg-slate-800 rounded-lg p-4 border-l-4 border-green-500">
        <div className="flex items-start space-x-3">
          <Check className="w-5 h-5 text-green-500 mt-0.5" />
          <div>
            <h4 className="text-white font-semibold mb-1">Secure Transaction</h4>
            <p className="text-slate-400 text-sm">
              All deposits are encrypted and processed securely. Funds typically reflect within the specified processing time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
