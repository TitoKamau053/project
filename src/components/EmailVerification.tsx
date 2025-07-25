import React, { useState, useEffect } from 'react';
import { ArrowLeft, Mail, CheckCircle, AlertCircle, RefreshCw, Send } from 'lucide-react';
import { useEmailVerificationStatus } from '../hooks/useEmailVerificationStatus';
import { userAPI } from '../utils/api';

interface EmailVerificationProps {
  email: string;
  onBack: () => void;
  onVerificationComplete?: () => void;
}

export const EmailVerification = ({ email, onBack, onVerificationComplete }: EmailVerificationProps) => {
  const { isVerified, isLoading, error: statusError, checkStatus } = useEmailVerificationStatus(email);
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState('');
  const [canResend, setCanResend] = useState(true);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Handle verification completion
  useEffect(() => {
    if (isVerified && onVerificationComplete) {
      setTimeout(() => {
        onVerificationComplete();
      }, 2000); // Give user time to see success message
    }
  }, [isVerified, onVerificationComplete]);

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

  // Clear MetaMask auto-connection conflicts
  useEffect(() => {
    if (window.ethereum) {
      (window.ethereum as any).autoRefreshOnNetworkChange = false;
    }
  }, []);

  const handleResendVerification = async () => {
    if (!canResend || resendCooldown > 0) return;
    
    setIsResending(true);
    setResendMessage('');

    try {
      const response = await userAPI.resendVerification(email);
      
      if (response.already_verified) {
        setResendMessage('Your email is already verified! Please refresh the page.');
        // Force status recheck
        setTimeout(() => checkStatus(), 1000);
      } else {
        setResendMessage('Verification email sent successfully! Check your inbox.');
        setCanResend(false);
        setResendCooldown(60); // 60 second cooldown
      }
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('already verified')) {
          setResendMessage('Your email is already verified! Redirecting...');
          setTimeout(() => checkStatus(), 1000);
        } else {
          setResendMessage(error.message || 'Failed to send verification email. Please try again.');
        }
      } else {
        setResendMessage('Failed to send verification email. Please try again.');
      }
    } finally {
      setIsResending(false);
    }
  };

  const handleCheckNow = async () => {
    await checkStatus();
    if (!isVerified) {
      setResendMessage('Email not verified yet. Please check your inbox and click the verification link.');
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
        <h1 className="text-white font-bold text-lg">Email Verification</h1>
        <div></div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6">
          {/* Icon and Status */}
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-orange-500/20 rounded-full flex items-center justify-center">
              {isVerified ? (
                <CheckCircle className="w-10 h-10 text-green-500" />
              ) : (
                <Mail className="w-10 h-10 text-orange-500" />
              )}
            </div>
            
            {isVerified ? (
              <>
                <h2 className="text-2xl font-bold text-white mb-2">✅ Email Verified Successfully!</h2>
                <p className="text-green-400 mb-2">Your email <strong>{email}</strong> has been verified.</p>
                <p className="text-slate-400">You can now access all features of your account. Redirecting...</p>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-white mb-2">📧 Check Your Email</h2>
                <p className="text-slate-400 mb-4">
                  We've sent a verification link to <span className="text-white font-medium">{email}</span>
                </p>
                <p className="text-slate-500 text-sm">
                  Click the link in the email to verify your account and complete registration.
                </p>
              </>
            )}
          </div>

          {/* Error Messages */}
          {statusError && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <p className="text-red-400 font-medium">❌ Error: {statusError}</p>
              </div>
            </div>
          )}

          {/* Resend Messages */}
          {resendMessage && (
            <div className={`rounded-lg p-3 border ${
              resendMessage.includes('already verified') || resendMessage.includes('successfully') 
                ? 'bg-green-500/10 border-green-500/20' 
                : 'bg-blue-500/10 border-blue-500/20'
            }`}>
              <p className={`font-medium ${
                resendMessage.includes('already verified') || resendMessage.includes('successfully')
                  ? 'text-green-400' 
                  : 'text-blue-400'
              }`}>
                {resendMessage}
              </p>
            </div>
          )}

          {!isVerified && (
            <>
              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleCheckNow}
                  disabled={isLoading}
                  className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      <span>Checking...</span>
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-5 h-5" />
                      <span>Check Verification Status</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleResendVerification}
                  disabled={!canResend || resendCooldown > 0 || isResending}
                  className="w-full bg-slate-700 text-white py-3 rounded-lg font-semibold hover:bg-slate-600 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  {isResending ? (
                    <>
                      <Send className="w-5 h-5 animate-pulse" />
                      <span>Sending...</span>
                    </>
                  ) : resendCooldown > 0 ? (
                    <span>Resend in {resendCooldown}s</span>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Resend Verification Email</span>
                    </>
                  )}
                </button>
              </div>

              {/* Instructions */}
              <div className="bg-slate-800 rounded-lg p-4">
                <h3 className="text-white font-semibold mb-3">Didn't receive the email?</h3>
                <div className="space-y-2 text-sm text-slate-400">
                  <p>• Check your spam/junk folder</p>
                  <p>• Make sure you entered the correct email address</p>  
                  <p>• Add {import.meta.env.VITE_EMAIL_FROM_ADDRESS || 'noreply@cryptominepro.com'} to your contacts</p>
                  <p>• Wait a few minutes and try checking again</p>
                </div>
              </div>

              {/* Email client shortcuts */}
              <div className="text-center">
                <p className="text-slate-500 text-sm mb-3">Quick access to popular email providers:</p>
                <div className="flex justify-center space-x-3">
                  <a 
                    href="https://gmail.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-orange-500 hover:text-orange-400 text-sm transition-colors"
                  >
                    Gmail
                  </a>
                  <span className="text-slate-600">•</span>
                  <a 
                    href="https://outlook.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-orange-500 hover:text-orange-400 text-sm transition-colors"
                  >
                    Outlook
                  </a>
                  <span className="text-slate-600">•</span>
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};
