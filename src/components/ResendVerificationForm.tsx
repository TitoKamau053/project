import React, { useState } from 'react';
import { Send, AlertCircle, CheckCircle, Mail } from 'lucide-react';
import { userAPI } from '../utils/api';
import { Logo } from './Logo';

interface ResendVerificationFormProps {
  initialEmail?: string;
  onSuccess?: (email: string) => void;
  onBackToLogin?: () => void;
  showBackButton?: boolean;
}

export const ResendVerificationForm = ({ 
  initialEmail = '', 
  onSuccess, 
  onBackToLogin,
  showBackButton = true 
}: ResendVerificationFormProps) => {
  const [email, setEmail] = useState(initialEmail);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');
  const [cooldown, setCooldown] = useState(0);

  React.useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || loading || cooldown > 0) return;

    setLoading(true);
    setMessage('');
    setMessageType('');

    try {
      const response = await userAPI.resendVerification(email);
      
      if (response.success || response.message?.includes('sent')) {
        setMessageType('success');
        setMessage('✅ Verification email sent successfully! Check your inbox and spam folder.');
        setCooldown(60); // 60 second cooldown
        onSuccess?.(email);
      } else if (response.already_verified) {
        setMessageType('success');
        setMessage('✅ Your email is already verified! You can now log in to your account.');
      } else {
        setMessageType('error');
        setMessage('❌ ' + (response.message || 'Failed to send verification email'));
      }
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('already verified')) {
          setMessageType('success');
          setMessage('✅ Your email is already verified! You can now log in to your account.');
        } else if (error.message.includes('not found')) {
          setMessageType('error');
          setMessage('❌ No account found with this email address. Please check your email or create a new account.');
        } else {
          setMessageType('error');
          setMessage('❌ ' + (error.message || 'Failed to send verification email'));
        }
      } else {
        setMessageType('error');
        setMessage('❌ Network error. Please check your connection and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-6">
        <div className="mx-auto mb-4">
          <Logo size="lg" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Resend Verification Email</h2>
        <p className="text-slate-400">
          Enter your email address and we'll send you a new verification link
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-colors"
            required
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          disabled={loading || cooldown > 0 || !email}
          className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Sending...</span>
            </>
          ) : cooldown > 0 ? (
            <span>Resend in {cooldown}s</span>
          ) : (
            <>
              <Send className="w-5 h-5" />
              <span>Send Verification Email</span>
            </>
          )}
        </button>

        {message && (
          <div className={`p-4 rounded-lg flex items-start space-x-3 ${
            messageType === 'success' 
              ? 'bg-green-500/10 border border-green-500/20' 
              : 'bg-red-500/10 border border-red-500/20'
          }`}>
            {messageType === 'success' ? (
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            )}
            <p className={`text-sm ${messageType === 'success' ? 'text-green-300' : 'text-red-300'}`}>
              {message}
            </p>
          </div>
        )}

        {showBackButton && onBackToLogin && (
          <button
            type="button"
            onClick={onBackToLogin}
            className="w-full bg-slate-700 text-white py-3 rounded-lg font-semibold hover:bg-slate-600 transition-colors"
          >
            Back to Login
          </button>
        )}
      </form>

      {/* Help Section */}
      <div className="mt-6 bg-slate-800 rounded-lg p-4">
        <h3 className="text-white font-semibold mb-3">Didn't receive the email?</h3>
        <div className="space-y-2 text-sm text-slate-400">
          <p>• Check your spam/junk folder</p>
          <p>• Make sure you entered the correct email address</p>
          <p>• Add {import.meta.env.VITE_EMAIL_FROM_ADDRESS || 'noreply@cryptominepro.com'} to your contacts</p>
          <p>• Wait a few minutes before requesting another email</p>
          <p>• Contact support if you continue having issues</p>
        </div>
      </div>

      {/* Email client shortcuts */}
      <div className="mt-4 text-center">
        <p className="text-slate-500 text-sm mb-3">Quick access to popular email providers:</p>
        <div className="flex justify-center space-x-4">
          <a 
            href="https://gmail.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-orange-500 hover:text-orange-400 text-sm transition-colors"
          >
            Gmail
          </a>
          <a 
            href="https://outlook.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-orange-500 hover:text-orange-400 text-sm transition-colors"
          >
            Outlook
          </a>
          <a 
            href="https://mail.yahoo.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-orange-500 hover:text-orange-400 text-sm transition-colors"
          >
            Yahoo
          </a>
        </div>
      </div>
    </div>
  );
};
