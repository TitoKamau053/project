import { useState, useEffect, useCallback } from 'react';
import { userAPI } from '../utils/api';

interface VerificationStatus {
  isVerified: boolean;
  isLoading: boolean;
  error: string | null;
  lastChecked: Date | null;
}

export const useEmailVerificationStatus = (email: string) => {
  const [status, setStatus] = useState<VerificationStatus>({
    isVerified: false,
    isLoading: false,
    error: null,
    lastChecked: null
  });

  const checkStatus = useCallback(async () => {
    if (!email) return;

    // Prevent excessive polling - don't check more than once per 5 seconds
    const now = new Date();
    if (status.lastChecked && now.getTime() - status.lastChecked.getTime() < 5000) {
      return;
    }

    setStatus(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await userAPI.checkVerificationStatus(email);
      
      if (response.success && response.data) {
        setStatus({
          isVerified: response.data.is_verified || response.data.email_verified,
          isLoading: false,
          error: null,
          lastChecked: now
        });
      } else {
        setStatus({
          isVerified: false,
          isLoading: false,
          error: response.message || 'Failed to check verification status',
          lastChecked: now
        });
      }
    } catch (error) {
      console.error('Email verification status check failed:', error);
      setStatus({
        isVerified: false,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to check verification status',
        lastChecked: now
      });
    }
  }, [email, status.lastChecked]);

  // Auto-check on mount and when email changes
  useEffect(() => {
    if (email) {
      checkStatus();
    }
  }, [email, checkStatus]);

  // Set up polling for verification status every 30 seconds
  useEffect(() => {
    if (!email || status.isVerified) return;

    const interval = setInterval(() => {
      checkStatus();
    }, 30000); // Poll every 30 seconds

    return () => clearInterval(interval);
  }, [email, status.isVerified, checkStatus]);

  return {
    isVerified: status.isVerified,
    isLoading: status.isLoading,
    error: status.error,
    lastChecked: status.lastChecked,
    checkStatus
  };
};
