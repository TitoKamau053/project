const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

interface ApiOptions {
  method?: string;
  body?: object | string;
  token?: string | null;
}

export async function apiFetch(endpoint: string, options: ApiOptions = {}) {
  const { method = 'GET', body, token } = options;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  // Get token from localStorage if not provided
  const authToken = token || localStorage.getItem('token');
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    let errorMessage = 'API request failed';
    try {
      const errorData = await response.json();
      errorMessage = translateErrorMessage(errorData.message || errorMessage, response.status);
    } catch {
      errorMessage = translateErrorMessage(errorMessage, response.status);
    }
    throw new Error(errorMessage);
  }

  if (response.status === 204) {
    return null; // No content
  }

  return response.json();
}

// Function to translate backend errors to user-friendly messages
function translateErrorMessage(serverMessage: string, statusCode: number): string {
  // Handle common server errors with user-friendly messages
  const errorMap: Record<string, string> = {
    'Internal Server Error': 'Something went wrong on our end. Please try again.',
    'Server Error': 'Something went wrong on our end. Please try again.',
    'Network Error': 'Connection problem. Please check your internet and try again.',
    'Insufficient funds': 'Insufficient balance for this transaction.',
    'Invalid engine selection': 'The selected mining engine is not available.',
    'User not found': 'Account not found. Please check your credentials.',
    'Invalid credentials': 'Incorrect email or password. Please try again.',
    'Email already exists': 'An account with this email already exists.',
    'Invalid referral code': 'The referral code you entered is not valid.',
    'Mining engine not found': 'The selected mining engine is no longer available.',
    'Transaction failed': 'Transaction could not be processed. Please try again.',
    'Withdrawal limit exceeded': 'You have exceeded the daily withdrawal limit.',
    'Account suspended': 'Your account has been suspended. Please contact support.',
    'Invalid phone number': 'Please enter a valid phone number.',
    'Payment method not supported': 'This payment method is not currently supported.',
    'Email not verified': 'Please verify your email address before signing in.',
    'verify your email': 'Please verify your email address before signing in.',
    'email verification': 'Please verify your email address before signing in.',
    'not verified': 'Please verify your email address before signing in.',
    'Verification token expired': 'Your verification link has expired. Please request a new one.',
    'Invalid verification token': 'The verification link is invalid. Please request a new one.',
    'Invalid or expired token': 'Your verification link has expired. Please request a new one.',
    'Email already verified': 'Your email address is already verified.',
    'Verification email sent': 'Verification email sent successfully.',
    'Token not found': 'Invalid verification link. Please request a new one.',
    'Token expired': 'Your verification link has expired. Please request a new one.',
  };

  // Check if the server message matches any of our mapped errors
  for (const [serverError, userMessage] of Object.entries(errorMap)) {
    if (serverMessage.toLowerCase().includes(serverError.toLowerCase())) {
      return userMessage;
    }
  }

  // Handle HTTP status codes
  switch (statusCode) {
    case 400:
      return 'Invalid request. Please check your input and try again.';
    case 401:
      return 'Session expired. Please log in again.';
    case 403:
      return 'You do not have permission to perform this action.';
    case 404:
      return 'The requested resource was not found.';
    case 429:
      return 'Too many requests. Please wait a moment before trying again.';
    case 500:
    case 502:
    case 503:
    case 504:
      return 'Our servers are temporarily unavailable. Please try again later.';
    default:
      // If no specific mapping found, return a generic user-friendly message
      return 'Something went wrong. Please try again or contact support if the problem persists.';
  }
}

// Helper function to get token from localStorage
export function getAuthToken(): string | null {
  return localStorage.getItem('token');
}

// Helper function to make authenticated requests
export async function apiAuthFetch(endpoint: string, options: Omit<ApiOptions, 'token'> = {}) {
  const token = getAuthToken();
  return apiFetch(endpoint, { ...options, token });
}
// User Management
export const userAPI = {
  register: async (userData: {
    email: string;
    password: string;
    full_name: string;
    phone?: string;
    referral_code?: string;
  }) => {
    // Use the app base URL for verification instead of external URL
    const verificationUrl = `${import.meta.env.VITE_APP_BASE_URL || 'http://localhost:5173'}/?token=`;
    
    return apiFetch('/users/register', {
      method: 'POST',
      body: {
        ...userData,
        verification_url: verificationUrl
      },
    });
  },

  login: async (credentials: { phone?: string; email?: string; password: string }) => {
    return apiFetch('/users/login', {
      method: 'POST',
      body: credentials,
    });
  },

  getProfile: async () => {
    return apiAuthFetch('/users/profile');
  },

  // Email Verification endpoints
  verifyEmail: async (token: string) => {
    return apiFetch(`/users/verify-email?token=${token}`);
  },

  // Legacy verification endpoint for old backend URLs
  verifyEmailLegacy: async (email: string) => {
    return apiFetch(`/users/verification-status?email=${encodeURIComponent(email)}`, {
      method: 'GET'
    }).then(() => {
      // If the API call succeeds, we assume verification was successful
      return { message: 'Email verified successfully' };
    });
  },

  resendVerification: async (email: string) => {
    // Use the app base URL for verification instead of external URL
    const verificationUrl = `${import.meta.env.VITE_APP_BASE_URL || 'http://localhost:5173'}/?token=`;
    
    return apiFetch('/users/resend-verification', {
      method: 'POST',
      body: { 
        email,
        verification_url: verificationUrl 
      },
    });
  },

  resendVerificationByPhone: async (phone: string) => {
    // Use the app base URL for verification instead of external URL
    const verificationUrl = `${import.meta.env.VITE_APP_BASE_URL || 'http://localhost:5173'}/?token=`;
    
    return apiFetch('/users/resend-verification-by-phone', {
      method: 'POST',
      body: { 
        phone,
        verification_url: verificationUrl 
      },
    });
  },

  checkVerificationStatus: async (email: string) => {
    return apiFetch(`/users/verification-status?email=${encodeURIComponent(email)}`);
  },

  // Additional method that returns just the status without making network request
  // This is for compatibility with existing components
  getVerificationStatusFromResponse: (response: { success?: boolean; data?: { is_verified: boolean }; verified?: boolean }): { verified: boolean } => {
    // Handle both old and new response formats
    if (response.success && response.data) {
      return { verified: response.data.is_verified };
    }
    // Fallback for old format
    return { verified: response.verified || false };
  },
};

// Mining Engines
export const miningAPI = {
  getEngines: async () => {
    return apiFetch('/mining-engines');
  },

  addEngine: async (engineData: object) => {
    return apiAuthFetch('/mining-engines', {
      method: 'POST',
      body: engineData,
    });
  },
};

// Deposits
export const depositAPI = {
  initiate: async (depositData: { amount: number; phoneNumber: string }) => {
    return apiAuthFetch('/deposits/initiate', {
      method: 'POST',
      body: depositData,
    });
  },
};

// Withdrawals
export const withdrawalAPI = {
  request: async (withdrawalData: { amount: number; account_details: object }) => {
    return apiAuthFetch('/withdrawals/request', {
      method: 'POST',
      body: withdrawalData,
    });
  },

  approve: async (withdrawalId: number) => {
    return apiAuthFetch(`/withdrawals/approve/${withdrawalId}`, {
      method: 'POST',
    });
  },
};

// Purchases
export const purchaseAPI = {
  create: async (purchaseData: { engine_id: number; amount: number }) => {
    return apiAuthFetch('/purchases', {
      method: 'POST',
      body: purchaseData,
    });
  },

  getUserPurchases: async () => {
    return apiAuthFetch('/purchases');
  },
};

// Earnings
export const earningsAPI = {
  log: async (earningData: { purchase_id: number; earning_amount: number }) => {
    return apiAuthFetch('/earnings/log', {
      method: 'POST',
      body: earningData,
    });
  },

  getUserEarnings: async () => {
    return apiAuthFetch('/earnings');
  },
};

// Referrals
export const referralAPI = {
  getReferralInfo: async () => {
    return apiAuthFetch('/referrals');
  },

  generateReferralLink: async () => {
    return apiAuthFetch('/referrals/generate');
  },

  // Validate referral code (public endpoint - no auth required)
  validateReferralCode: async (code: string) => {
    return apiFetch(`/referrals/validate/${code}`);
  },

  // Get commission history
  getCommissions: async (page: number = 1, limit: number = 10) => {
    return apiAuthFetch(`/referrals/commissions?page=${page}&limit=${limit}`);
  },

  // Get referrer information
  getMyReferrer: async () => {
    return apiAuthFetch('/referrals/my-referrer');
  },
};

// Transactions & Activities
export const transactionAPI = {
  getRecentActivities: async () => {
    return apiAuthFetch('/transactions/recent');
  },

  getUserTransactions: async (filters?: { type?: string; period?: string; status?: string }) => {
    const params = new URLSearchParams();
    if (filters?.type && filters.type !== 'all') params.append('type', filters.type);
    if (filters?.period && filters.period !== 'all') params.append('period', filters.period);
    if (filters?.status && filters.status !== 'all') params.append('status', filters.status);
    
    const queryString = params.toString();
    return apiAuthFetch(`/transactions${queryString ? `?${queryString}` : ''}`);
  },

  getUserDeposits: async () => {
    return apiAuthFetch('/transactions/deposits');
  },

  getUserWithdrawals: async () => {
    return apiAuthFetch('/transactions/withdrawals');
  },

  getUserEarnings: async () => {
    return apiAuthFetch('/transactions/earnings');
  },
};

// Testimonials & Success Stories
export const testimonialsAPI = {
  getSuccessStories: async () => {
    return apiFetch('/testimonials/success-stories');
  },
};

// Admin
export const adminAPI = {
  getStats: async () => {
    return apiAuthFetch('/admin/stats');
  },

  getSettings: async () => {
    return apiAuthFetch('/admin/settings');
  },

  updateSetting: async (settingData: { setting_key: string; setting_value: string }) => {
    return apiAuthFetch('/admin/settings', {
      method: 'PUT',
      body: settingData,
    });
  },

  getRecentActivities: async () => {
    return apiAuthFetch('/admin/activities');
  },

  getUsers: async () => {
    return apiAuthFetch('/admin/users');
  },

  getDeposits: async () => {
    return apiAuthFetch('/admin/deposits');
  },

  getWithdrawals: async () => {
    return apiAuthFetch('/admin/withdrawals');
  },
};

// M-Pesa Integration
export const mpesaAPI = {
  stkPush: async (paymentData: { phone: string; amount: number; accountRef?: string }) => {
    return apiAuthFetch('/mpesa/stk', {
      method: 'POST',
      body: paymentData,
    });
  },

  b2cPayout: async (payoutData: { phone: string; amount: number }) => {
    return apiAuthFetch('/mpesa/b2c/payout', {
      method: 'POST',
      body: payoutData,
    });
  },
};
