import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, Mail, ArrowLeft } from 'lucide-react';
import { userAPI } from '../utils/api';

interface EmailVerifyPageProps {
  token?: string;
  onBack: () => void;
  onVerificationComplete: () => void;
}

export const EmailVerifyPage = ({ token, onBack, onVerificationComplete }: EmailVerifyPageProps) => {
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [message, setMessage] = useState('');
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    if (token) {
      verifyEmail(token);
    } else {
      setStatus('error');
      setMessage('No verification token provided. Please use the complete link from your email.');
    }
  }, [token]);

  // Countdown for redirect after successful verification
  useEffect(() => {
    if (status === 'success' && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (status === 'success' && countdown === 0) {
      onVerificationComplete();
    }
  }, [status, countdown, onVerificationComplete]);

  const verifyEmail = async (verificationToken: string) => {
    try {
      setStatus('verifying');
      const response = await userAPI.verifyEmail(verificationToken);
      
      setStatus('success');
      setMessage(response.message || 'Email verified successfully!');
      
    } catch (error) {
      setStatus('error');
      if (error instanceof Error) {
        // Handle specific error cases
        if (error.message.includes('Invalid or expired')) {
          setMessage('This verification link has expired or is invalid. Please request a new verification email.');
        } else if (error.message.includes('already verified')) {
          setMessage('Your email is already verified! You can now log in to your account.');
        } else {
          setMessage(error.message || 'Verification failed. Please try again.');
        }
      } else {
        setMessage('Verification failed. Please try again.');
      }
    }
  };

  const handleRequestNewLink = () => {
    // This will redirect to the main verification page where user can enter email
    onBack();
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
        <h1 className="text-white font-bold text-lg">Email Verification</h1>
        <div></div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6">
          
          {/* Verifying State */}
          {status === 'verifying' && (
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-orange-500/20 rounded-full flex items-center justify-center">
                <Mail className="w-10 h-10 text-orange-500 animate-pulse" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Verifying Your Email...</h2>
              <p className="text-slate-400">Please wait while we verify your email address.</p>
              
              <div className="mt-6">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
              </div>
            </div>
          )}

          {/* Success State */}
          {status === 'success' && (
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-green-500/20 rounded-full flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">✅ Email Verified Successfully!</h2>
              <p className="text-green-400 mb-4">{message}</p>
              <p className="text-slate-400">
                You can now access all features of your CryptoMinePro account.
              </p>
              
              <div className="mt-6 bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                <p className="text-green-400 font-medium mb-2">
                  Redirecting to login in {countdown} second{countdown !== 1 ? 's' : ''}...
                </p>
                <button
                  onClick={onVerificationComplete}
                  className="w-full bg-green-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-green-600 transition-colors"
                >
                  Continue to Login
                </button>
              </div>
            </div>
          )}

          {/* Error State */}
          {status === 'error' && (
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-red-500/20 rounded-full flex items-center justify-center">
                <AlertCircle className="w-10 h-10 text-red-500" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">❌ Verification Failed</h2>
              <p className="text-red-400 mb-4">{message}</p>
              
              <div className="space-y-3">
                {message.includes('expired') || message.includes('invalid') ? (
                  <button
                    onClick={handleRequestNewLink}
                    className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
                  >
                    Request New Verification Email
                  </button>
                ) : message.includes('already verified') ? (
                  <button
                    onClick={onVerificationComplete}
                    className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors"
                  >
                    Continue to Login
                  </button>
                ) : (
                  <div className="space-y-2">
                    <button
                      onClick={() => token && verifyEmail(token)}
                      className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
                    >
                      Try Again
                    </button>
                    <button
                      onClick={handleRequestNewLink}
                      className="w-full bg-slate-700 text-white py-3 rounded-lg font-semibold hover:bg-slate-600 transition-colors"
                    >
                      Request New Verification Email
                    </button>
                  </div>
                )}
              </div>

              {/* Help Section */}
              <div className="mt-6 bg-slate-800 rounded-lg p-4 text-left">
                <h3 className="text-white font-semibold mb-3">Need Help?</h3>
                <div className="space-y-2 text-sm text-slate-400">
                  <p>• Make sure you're using the complete link from your email</p>
                  <p>• Check if the email is older than 24 hours (links expire)</p>
                  <p>• Ensure you haven't already verified this email</p>
                  <p>• Try copying and pasting the link into a new browser tab</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
