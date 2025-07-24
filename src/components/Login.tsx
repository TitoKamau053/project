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
  const [error, setError] = useState<string | null>(null);
  const [showResendVerification, setShowResendVerification] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setShowResendVerification(false);
    
    try {
      const data = await userAPI.login({
        email: formData.email,
        password: formData.password
      });
      
      // Store token and user info
      localStorage.setItem('token', data.token);
      localStorage.setItem('userJustLoggedIn', 'true'); // Set flag for countdown reset
      onLogin(data.token, data.user);
    } catch (err) {
      if (err instanceof Error) {
        const errorMessage = err.message;
        
        // Check if this is an email verification error
        if (errorMessage.includes('verify your email') || 
            errorMessage.includes('email verification') ||
            errorMessage.includes('not verified')) {
          setShowResendVerification(true);
        }
        
        setError(errorMessage);
      } else {
        setError('Login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!formData.email) {
      setError('Please enter your email address first');
      return;
    }

    setResendLoading(true);
    try {
      const result = await userAPI.resendVerification(formData.email);
      setError(null);
      alert(result.message || 'Verification email sent! Please check your inbox.');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to resend verification email');
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
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">C</span>
          </div>
          <span className="text-orange-500 font-bold text-lg">CryptoMine Pro</span>
        </div>
      </div>

      {/* Login Form */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-white text-2xl font-bold mb-2">Welcome Back</h1>
            <p className="text-slate-400">Sign in to your CryptoMine Pro account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-600/20 border border-red-500/30 rounded-lg p-3 text-center">
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
            
            {/* Admin Testing Info */}
            <div className="bg-blue-600/20 border border-blue-500/30 rounded-lg p-3 text-center">
              <p className="text-blue-400 text-sm font-medium mb-2">👑 Admin Testing Credentials</p>
              <div className="flex items-center justify-between text-xs">
                <div>
                  <p className="text-blue-300">Email: admin@cryptominepro.com</p>
                  <p className="text-blue-300">Password: Admin@123</p>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData({ 
                    email: 'admin@cryptominepro.com', 
                    password: 'Admin@123' 
                  })}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs transition-colors"
                >
                  Quick Fill
                </button>
              </div>
              <p className="text-slate-400 text-xs mt-1">Use these credentials to access the admin dashboard</p>
            </div>

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
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 pr-12 text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-colors"
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

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-orange-500 bg-slate-800 border-slate-700 rounded focus:ring-orange-500 focus:ring-2"
                />
                <span className="ml-2 text-slate-400 text-sm">Remember me</span>
              </label>
              <button
                type="button"
                className="text-orange-500 text-sm hover:text-orange-400 transition-colors"
              >
                Forgot password?
              </button>
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