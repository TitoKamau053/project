import React, { useState } from 'react';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { userAPI } from '../utils/api';

interface User {
  id: number;
  email: string;
  full_name: string;
  role: string;
  created_at: string;
}

interface LoginProps {
  onBack: () => void;
  onLogin: (token: string, user: User) => void;
  onSwitchToSignup: () => void;
  onShowEmailVerification: (email: string) => void;
}

export const Login = ({ onBack, onLogin, onSwitchToSignup, onShowEmailVerification }: LoginProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | JSX.Element | null>(null);
  const [showResendVerification, setShowResendVerification] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setShowResendVerification(false);
    
    try {
      // Login with backend API
      const response = await userAPI.login({
        email: formData.email,
        password: formData.password
      });
      
      // Store token and user data
      localStorage.setItem('token', response.token);
      localStorage.setItem('userJustLoggedIn', 'true');
      
      onLogin(response.token, response.user);
    } catch (err) {
      if (err instanceof Error) {
        const errorMessage = err.message;
        
        // Handle specific API errors
        if (errorMessage.includes('Email not verified')) {
          setError('Please verify your email before logging in.');
          setShowResendVerification(true);
        } else if (errorMessage.includes('Invalid email or password')) {
          setError('Invalid email or password.');
        } else if (errorMessage.includes('Account is suspended')) {
          setError('This account has been suspended.');
        } else if (errorMessage.includes('User not found')) {
          setError(
            <div>
              No account found with this email address.{' '}
              <button 
                onClick={onSwitchToSignup}
                className="text-orange-500 hover:text-orange-400 underline"
              >
                Create an account
              </button>
            </div>
          );
        } else {
          setError(errorMessage);
        }
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setResendLoading(true);
    setError(null);
    
    try {
      const response = await userAPI.resendVerification(formData.email);
      
      // Check if user is already verified
      if (response.already_verified) {
        setError(null);
        alert('Your email is already verified! You can now log in.');
        // Clear the resend verification option since user is verified
        setShowResendVerification(false);
        return;
      }
      
      setError(null);
      alert('Verification email sent! Please check your inbox.');
      onShowEmailVerification(formData.email);
    } catch (err) {
      if (err instanceof Error) {
        if (err.message.includes('already verified')) {
          setError(null);
          alert('Your email is already verified! You can now log in.');
          setShowResendVerification(false);
        } else {
          setError(`Failed to send verification email: ${err.message}`);
        }
      } else {
        setError('Failed to send verification email.');
      }
    } finally {
      setResendLoading(false);
    }
  };

  const handleGoToVerification = () => {
    if (!formData.email) {
      setError('Please enter your email address first');
      return;
    }
    onShowEmailVerification(formData.email);
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
            <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-2xl">C</span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
            <p className="text-slate-400">Sign in to your CryptoMine Pro account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                <p className="text-red-400 font-medium mb-2">{error}</p>
                {showResendVerification && (
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={handleGoToVerification}
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded text-sm font-medium transition-colors"
                    >
                      Go to Email Verification
                    </button>
                    <button
                      type="button"
                      onClick={handleResendVerification}
                      disabled={resendLoading}
                      className="w-full bg-slate-600 hover:bg-slate-700 disabled:opacity-50 text-white py-2 px-4 rounded text-sm font-medium transition-colors"
                    >
                      {resendLoading ? 'Sending...' : 'Resend Verification Email'}
                    </button>
                  </div>
                )}
              </div>
            )}

            <div>
              <label className="block text-slate-400 text-sm font-medium mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-colors"
                placeholder="Enter your email"
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
