import React, { useState } from 'react';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { userAPI } from '../utils/api';
import { Logo } from './Logo';

interface User {
  id: number;
  email: string;
  full_name: string;
  phone: string;
  role: string;
  created_at: string;
}

interface LoginProps {
  onBack: () => void;
  onLogin: (token: string, user: User) => void;
  onSwitchToSignup: () => void;
  onShowToast?: (message: string, type: 'success' | 'error') => void;
}

export const Login = ({ onBack, onLogin, onSwitchToSignup, onShowToast }: LoginProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    phone: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | JSX.Element | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Login with backend API using phone number
      const response = await userAPI.login({
        phone: formData.phone,
        password: formData.password
      });
      
      // Store token and user data
      localStorage.setItem('token', response.token);
      localStorage.setItem('userJustLoggedIn', 'true');
      localStorage.setItem('userPhoneNumber', formData.phone); // Store phone number for auto-fill
      
      onLogin(response.token, response.user);
      onShowToast?.('Login successful! Welcome back.', 'success');
    } catch (err) {
      if (err instanceof Error) {
        const errorMessage = err.message;
        
        // Handle specific API errors
        if (errorMessage.includes('Invalid phone number or password')) {
          onShowToast?.('Login failed. Please try again.', 'error');
          setError('Login failed. Please try again.');
        } else if (errorMessage.includes('Account is suspended')) {
          onShowToast?.('Login failed. Please try again.', 'error');
          setError('This account has been suspended.');
        } else if (errorMessage.includes('User not found')) {
          setError(
            <div>
              No account found with this phone number.{' '}
              <button 
                onClick={onSwitchToSignup}
                className="text-orange-500 hover:text-orange-400 underline"
              >
                Create an account
              </button>
            </div>
          );
        } else {
          onShowToast?.('Login failed. Please try again.', 'error');
          setError('Login failed. Please try again.');
        }
      } else {
        onShowToast?.('Login failed. Please try again.', 'error');
        setError('Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700">
        <button 
          onClick={onBack}
          className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
        <h1 className="text-white font-bold text-lg">Sign In</h1>
        <div></div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6">
          {/* Logo */}
          <div className="text-center">
            <Logo size="xl" className="mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
            <p className="text-slate-400">Sign in to your CryptoMine Pro account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                <p className="text-red-400 font-medium">{error}</p>
              </div>
            )}

            <div>
              <label className="block text-slate-400 text-sm font-medium mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-colors"
                placeholder="07XXXXXXXX"
                required
              />
            </div>

            <div>
              <label className="block text-slate-400 text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-colors pr-12"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-400">
              Don't have an account?{' '}
              <button
                onClick={onSwitchToSignup}
                className="text-orange-500 hover:text-orange-400 transition-colors font-semibold"
              >
                Sign up
              </button>
            </p>
          </div>

          {/* Features */}
          <div className="mt-8 space-y-3">
            <div className="flex items-center space-x-3 text-slate-400 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Secure & encrypted platform</span>
            </div>
            <div className="flex items-center space-x-3 text-slate-400 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>24/7 automated mining</span>
            </div>
            <div className="flex items-center space-x-3 text-slate-400 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Instant withdrawals</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
