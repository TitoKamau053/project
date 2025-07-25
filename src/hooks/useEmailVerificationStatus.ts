import { useState, useEffect, useCallback } from 'react';

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
      const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
      const response = await fetch(
        `${apiUrl}/users/verification-status?email=${encodeURIComponent(email)}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.success && data.data) {
        setStatus({
          isVerified: data.data.is_verified,
          isLoading: false,
          error: null,
          lastChecked: now
        });
      } else {
        throw new Error(data.message || 'Failed to check verification status');
      }
    } catch (error) {
      console.error('Verification status check error:', error);
      setStatus(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        lastChecked: now
      }));
    }
  }, [email, status.lastChecked]);

  // Check status on mount and when email changes
  useEffect(() => {
    if (email) {
      checkStatus();
    }
  }, [email]);

  // Clear browser cache for verification status
  useEffect(() => {
    localStorage.removeItem('emailVerificationStatus');
    sessionStorage.removeItem('emailVerificationStatus');
  }, []);

  return { ...status, checkStatus };
};
