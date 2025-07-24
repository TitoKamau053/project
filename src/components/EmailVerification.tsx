import { useState, useEffect } from 'react';
import { ArrowLeft, Mail, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { userAPI } from '../utils/api';

interface EmailVerificationProps {
  email: string;
  onBack: () => void;
  onVerificationComplete: () => void;
}

export const EmailVerification = ({ email, onBack, onVerificationComplete }: EmailVerificationProps) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [canResend, setCanResend] = useState(true);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Check verification status on component mount
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const status = await userAPI.checkVerificationStatus(email);
        if (status.emailVerified) {
          setMessage('Email already verified! You can now log in.');
          setTimeout(() => {
            onVerificationComplete();
          }, 2000);
        }
      } catch {
        // If status check fails, we'll just continue with the normal flow
      }
    };
    
    checkStatus();
  }, [email, onVerificationComplete]);

  // Handle resend cooldown
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendCooldown]);

  // Check URL for verification token
  useEffect(() => {
    const verifyEmailToken = async (token: string) => {
      setLoading(true);
      setError(null);
      
      try {
        const result = await userAPI.verifyEmail(token);
        if (result.verified) {
          setMessage(result.message);
          setTimeout(() => {
            onVerificationComplete();
          }, 2000);
        } else {
          setError(result.message);
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Email verification failed');
        }
      } finally {
        setLoading(false);
      }
    };

    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    if (token) {
      verifyEmailToken(token);
    }
  }, [onVerificationComplete]);

  const handleResendVerification = async () => {
    if (!canResend || resendCooldown > 0) return;
    
    setLoading(true);
    setError(null);
    setMessage(null);
    
    try {
      const result = await userAPI.resendVerification(email);
      setMessage(result.message);
      setCanResend(false);
      setResendCooldown(60); // 60 second cooldown
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to resend verification email');
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
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">C</span>
          </div>
          <span className="text-orange-500 font-bold text-lg">CryptoMine Pro</span>
        </div>
      </div>

      {/* Verification Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <div className="mb-8">
            <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-orange-500" />
            </div>
            <h1 className="text-white text-2xl font-bold mb-2">Verify Your Email</h1>
            <p className="text-slate-400 mb-4">
              We've sent a verification link to:
            </p>
            <p className="text-orange-500 font-semibold text-lg">{email}</p>
          </div>

          {/* Messages */}
          {message && (
            <div className="bg-green-600/20 border border-green-500/30 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <p className="text-green-400 font-medium">{message}</p>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-600/20 border border-red-500/30 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-center space-x-2">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <p className="text-red-400 font-medium">{error}</p>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="bg-slate-800 rounded-lg p-6 mb-6">
            <h3 className="text-white font-semibold mb-4">Next Steps:</h3>
            <div className="space-y-3 text-slate-400 text-sm">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold">1</div>
                <span>Check your email inbox for our verification message</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold">2</div>
                <span>Click the "Verify Email" button in the email</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold">3</div>
                <span>Return here to complete your account setup</span>
              </div>
            </div>
          </div>

          {/* Resend Button */}
          <div className="space-y-4">
            <button
              onClick={handleResendVerification}
              disabled={loading || !canResend || resendCooldown > 0}
              className="w-full bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:opacity-50 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Sending...</span>
                </>
              ) : resendCooldown > 0 ? (
                <span>Resend in {resendCooldown}s</span>
              ) : (
                <>
                  <Mail className="w-4 h-4" />
                  <span>Resend Verification Email</span>
                </>
              )}
            </button>

            <p className="text-slate-500 text-sm">
              Didn't receive the email? Check your spam folder or try resending.
            </p>
          </div>

          {/* Help */}
          <div className="mt-8 text-center">
            <p className="text-slate-400 text-sm">
              Need help?{' '}
              <button className="text-orange-500 hover:text-orange-400 transition-colors">
                Contact Support
              </button>
            </p>
          </div>

          {/* Security Notice */}
          <div className="mt-6 bg-blue-600/20 border border-blue-500/30 rounded-lg p-4">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">!</span>
              </div>
              <h4 className="text-blue-400 font-semibold text-sm">Security Notice</h4>
            </div>
            <p className="text-blue-300 text-xs">
              Your verification link will expire in 24 hours for security purposes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
