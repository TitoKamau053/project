import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, ArrowLeft, Check, Users, AlertCircle } from 'lucide-react';
import { userAPI, referralAPI } from '../utils/api';
import { Logo } from './Logo';

interface User {
  id: number;
  email: string;
  full_name: string;
  role: string;
  created_at: string;
}

interface SignupProps {
  onBack: () => void;
  onSignup: (token: string, user: User) => void;
  onSwitchToLogin: () => void;
  onShowEmailVerification: (email: string) => void;
}

export const Signup = ({ onBack, onSignup, onSwitchToLogin, onShowEmailVerification }: SignupProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    referralCode: '',
    agreeToTerms: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [referralInfo, setReferralInfo] = useState<{
    isValid: boolean;
    referrerName?: string;
    isLoading: boolean;
    error?: string;
  }>({ isValid: false, isLoading: false });

  // Handle referral URL parameters and validate referral code
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const refCode = urlParams.get('ref');
    if (refCode) {
      setFormData(prev => ({ ...prev, referralCode: refCode }));
      validateReferralCode(refCode);
    }
  }, []);

  // Validate referral code when it changes
  useEffect(() => {
    if (formData.referralCode && formData.referralCode.length >= 6) {
      validateReferralCode(formData.referralCode);
    } else if (formData.referralCode === '') {
      setReferralInfo({ isValid: false, isLoading: false });
    }
  }, [formData.referralCode]);

  const validateReferralCode = async (code: string) => {
    if (!code || code.length < 6) return;
    
    setReferralInfo(prev => ({ ...prev, isLoading: true, error: undefined }));
    
    try {
      const response = await referralAPI.validateReferralCode(code);
      
      if (response.valid) {
        setReferralInfo({
          isValid: true,
          referrerName: response.referrer?.name || response.referrer_name,
          isLoading: false
        });
      } else {
        setReferralInfo({
          isValid: false,
          isLoading: false,
          error: response.message || 'Invalid referral code'
        });
      }
    } catch (err) {
      setReferralInfo({
        isValid: false,
        isLoading: false,
        error: err instanceof Error ? err.message : 'Failed to validate referral code'
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (!formData.agreeToTerms) {
      setError('Please agree to the terms and conditions');
      return;
    }
    
    setLoading(true);
    
    try {
      // Register with backend API
      const response = await userAPI.register({
        email: formData.email,
        password: formData.password,
        full_name: `${formData.firstName} ${formData.lastName}`,
        phone: formData.phone || undefined,
        referral_code: formData.referralCode || undefined,
      });
      
      setMessage(response.message || 'Registration successful! Please check your email to verify your account.');
      
      // Show verification screen after a short delay
      setTimeout(() => {
        onShowEmailVerification(formData.email);
      }, 2000);
    } catch (err) {
      if (err instanceof Error) {
        const errorMessage = err.message;
        
        // Handle API-specific errors
        if (errorMessage.includes('already exists')) {
          setError('An account with this email already exists.');
        } else if (errorMessage.includes('password')) {
          setError('Password should be at least 6 characters.');
        } else if (errorMessage.includes('email')) {
          setError('Please enter a valid email address.');
        } else {
          setError(errorMessage);
        }
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-slate-700">
        <button 
          onClick={onBack}
          className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
        <div className="flex items-center space-x-3">
          <img 
            src="/CryptoMinePro.jpeg" 
            alt="CryptoMine Pro Logo" 
            className="w-8 h-8 rounded-full object-cover"
          />
          <span className="text-orange-500 font-bold text-lg">CryptoMine Pro</span>
        </div>
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        <div className="w-full max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-white text-2xl font-bold mb-2">Create Account</h1>
            <p className="text-slate-400">Join CryptoMine Pro and start earning</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-600/20 border border-red-500/30 rounded-lg p-3 text-center">
                <p className="text-red-400 font-medium">{error}</p>
              </div>
            )}

            {message && (
              <div className="bg-green-600/20 border border-green-500/30 rounded-lg p-3 text-center">
                <p className="text-green-400 font-medium">{message}</p>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 text-sm font-medium mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-colors"
                  placeholder="First name"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-400 text-sm font-medium mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-colors"
                  placeholder="Last name"
                  required
                />
              </div>
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
                placeholder="your.email@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-slate-400 text-sm font-medium mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-colors"
                placeholder="Enter your phone number"
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
                  placeholder="Create a strong password"
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

            <div>
              <label className="block text-slate-400 text-sm font-medium mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 pr-12 text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-colors"
                  placeholder="Confirm your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-slate-400 text-sm font-medium mb-2">
                Referral Code (Optional)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.referralCode}
                  onChange={(e) => setFormData({ ...formData, referralCode: e.target.value.toUpperCase() })}
                  className={`w-full bg-slate-800 border rounded-lg px-4 py-3 pr-12 text-white placeholder-slate-500 focus:outline-none transition-colors ${
                    formData.referralCode && referralInfo.isValid 
                      ? 'border-green-500 focus:border-green-400' 
                      : formData.referralCode && referralInfo.error
                      ? 'border-red-500 focus:border-red-400'
                      : 'border-slate-700 focus:border-orange-500'
                  }`}
                  placeholder="Enter referral code"
                />
                {referralInfo.isLoading && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-orange-500"></div>
                  </div>
                )}
                {formData.referralCode && !referralInfo.isLoading && referralInfo.isValid && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <Check className="w-5 h-5 text-green-500" />
                  </div>
                )}
                {formData.referralCode && !referralInfo.isLoading && referralInfo.error && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  </div>
                )}
              </div>
              
              {/* Referral validation messages */}
              {referralInfo.isValid && referralInfo.referrerName && (
                <div className="mt-2 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-green-400" />
                    <p className="text-green-400 text-sm">
                      <span className="font-medium">Invited by:</span> {referralInfo.referrerName}
                    </p>
                  </div>
                  <p className="text-green-300 text-xs mt-1">
                    You'll both earn rewards when you make your first deposit!
                  </p>
                </div>
              )}
              
              {referralInfo.error && (
                <div className="mt-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 text-red-400" />
                    <p className="text-red-400 text-sm">{referralInfo.error}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-start space-x-3">
              <div className="relative">
                <input
                  type="checkbox"
                  id="terms"
                  checked={formData.agreeToTerms}
                  onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
                  className="sr-only"
                />
                <div 
                  onClick={() => setFormData({ ...formData, agreeToTerms: !formData.agreeToTerms })}
                  className={`w-5 h-5 rounded border-2 cursor-pointer transition-colors ${
                    formData.agreeToTerms 
                      ? 'bg-orange-500 border-orange-500' 
                      : 'border-slate-700 bg-slate-800'
                  }`}
                >
                  {formData.agreeToTerms && (
                    <Check className="w-3 h-3 text-white m-0.5" />
                  )}
                </div>
              </div>
              <label htmlFor="terms" className="text-slate-400 text-sm leading-5">
                I agree to the{' '}
                <button type="button" className="text-orange-500 hover:text-orange-400 transition-colors">
                  Terms of Service
                </button>{' '}
                and{' '}
                <button type="button" className="text-orange-500 hover:text-orange-400 transition-colors">
                  Privacy Policy
                </button>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-400">
              Already have an account?{' '}
              <button
                onClick={onSwitchToLogin}
                className="text-orange-500 hover:text-orange-400 transition-colors font-semibold"
              >
                Sign in
              </button>
            </p>
          </div>

          <div className="mt-8 bg-slate-800 rounded-lg p-4">
            <h3 className="text-white font-semibold mb-3">Why Choose CryptoMine Pro?</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-3 text-slate-400 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Up to 35% ROI on investments</span>
              </div>
              <div className="flex items-center space-x-3 text-slate-400 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>10% referral commission</span>
              </div>
              <div className="flex items-center space-x-3 text-slate-400 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Automated mining systems</span>
              </div>
              <div className="flex items-center space-x-3 text-slate-400 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>24/7 customer support</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
