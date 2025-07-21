import { useState } from 'react';
import { Check } from 'lucide-react';

interface DepositModalProps {
  onBack?: () => void;
}

export const DepositModal = ({ onBack }: DepositModalProps) => {
  const [amount, setAmount] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const minAmount = 100;
  
  const handleDeposit = () => {
    if (!amount || parseFloat(amount) < minAmount) {
      alert('Please enter a valid amount');
      return;
    }
    if (!phoneNumber) {
      alert('Please enter your phone number');
      return;
    }
    alert(`Deposit of KES ${amount} initiated to ${phoneNumber}`);
    if (onBack) onBack();
  };

  return (
    <div className="space-y-6">
      {/* Amount Input */}
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

      {/* Phone Number Input */}
      <div>
        <label className="block text-slate-400 text-sm font-medium mb-2">
          Phone Number
        </label>
        <input
          type="tel"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-colors"
          placeholder="254700000000"
        />
        <p className="text-slate-500 text-sm mt-1">
          Enter your M-Pesa registered phone number
        </p>
      </div>

      {/* Deposit Button */}
      <button
        onClick={handleDeposit}
        className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
      >
        Confirm Deposit
      </button>

      {/* Security Notice */}
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
