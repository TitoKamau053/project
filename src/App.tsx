import { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { Stake } from './components/Stake';
import { MiningNow } from './components/MiningNow';
import { Earnings } from './components/Earnings';
import { Network } from './components/Network';
import { Navigation } from './components/Navigation';
import { Header } from './components/Header';
import { Login } from './components/Login';
import { Signup } from './components/Signup';
import { EmailVerification } from './components/EmailVerification';
import { EmailVerifyPage } from './components/EmailVerifyPage';
import { Profile } from './components/Profile';
import { Support } from './components/Support';
import { AdminDashboard } from './components/AdminDashboard';
import { TransactionHistory } from './components/TransactionHistory';
import { About } from './components/About';
import { Homepage } from './components/Homepage';
import { TermsOfService } from './components/TermsOfService';
import { userAPI } from './utils/api';
import { setScrollFlag } from './utils/scrollUtils';

interface User {
  id: number;
  email: string;
  full_name: string;
  role: string;
  created_at: string;
}

function AppContent() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentView, setCurrentView] = useState<'homepage' | 'app' | 'login' | 'signup' | 'admin' | 'profile' | 'support' | 'email-verification' | 'email-verify-page' | 'transactions' | 'about' | 'terms'>('homepage');
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check for email verification token in URL - DISABLED
  useEffect(() => {
    // Email verification redirects have been disabled
    // Users must manually navigate to email verification if needed
  }, []);

  // Check authentication status when component mounts
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      if (token && storedUser) {
        try {
          // Verify token is still valid by making a request to get profile
          const response = await userAPI.getProfile();
          const userData = response.user;
          
          setUser(userData);
          setIsAuthenticated(true);
          
          // Redirect based on user role
          if (userData.role === 'admin') {
            setCurrentView('admin');
          } else {
            setCurrentView('app');
          }
        } catch (error) {
          console.error('Token validation failed:', error);
          // Clear invalid token and user data
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setCurrentView('homepage');
          setIsAuthenticated(false);
          setUser(null);
        }
      } else {
        // No stored authentication - show homepage
        setCurrentView('homepage');
        setIsAuthenticated(false);
        setUser(null);
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const handleLogin = (_token: string, userData: User) => {
    // Ensure created_at field exists, provide default if missing
    const userWithCreatedAt = {
      ...userData,
      created_at: userData.created_at || new Date().toISOString()
    };
    
    setUser(userWithCreatedAt);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(userWithCreatedAt));
    
    // Redirect based on user role
    if (userWithCreatedAt.role === 'admin') {
      setCurrentView('admin');
    } else {
      setCurrentView('app');
    }
  };

  const handleSignup = () => {
    // After successful signup, redirect directly to login page
    // No email verification required
    setCurrentView('login');
  };

  const handleLogout = async () => {
    try {
      // Clear authentication data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      setIsAuthenticated(false);
      setCurrentView('homepage');
      setActiveTab('dashboard');
    } catch (error) {
      console.error('Logout error:', error);
      // Force logout even if there's an error
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      setIsAuthenticated(false);
      setCurrentView('homepage');
      setActiveTab('dashboard');
    }
  };

  // Handle show terms of service
  const handleShowTerms = () => {
    setCurrentView('terms');
  };

  // Handle "Activate Mine" button click from Dashboard
  const handleActivateMine = () => {
    setActiveTab('stake');
    setScrollFlag('scrollToProfitEngines');
  };

  // Handle show transaction history
  const handleShowTransactions = () => {
    setCurrentView('transactions');
  };

  // Handle show helpline/support
  const handleShowHelpline = () => {
    setCurrentView('support');
  };

  // Handle show about page
  const handleShowAbout = () => {
    setCurrentView('about');
  };

  // Handle show mining packages (stake page)
  const handleShowMiningPackages = () => {
    setActiveTab('stake');
  };

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-center">
          <img 
            src="/CryptoMinePro.jpeg" 
            alt="CryptoMine Pro Logo" 
            className="w-12 h-12 rounded-full object-cover mx-auto mb-4 animate-pulse"
          />
          <p>Loading CryptoMine Pro...</p>
        </div>
      </div>
    );
  }

  // Handle homepage view
  if (currentView === 'homepage') {
    return (
      <Homepage
        onGetStarted={() => setCurrentView('signup')}
        onLearnMore={() => setCurrentView('about')}
        onLogin={() => setCurrentView('login')}
      />
    );
  }

  // Handle unauthenticated views (login and signup)
  if (!isAuthenticated || !user) {
    if (currentView === 'signup') {
      return (
        <Signup
          onBack={() => setCurrentView('homepage')}
          onSignup={handleSignup}
          onSwitchToLogin={() => setCurrentView('login')}
          onShowTerms={handleShowTerms}
        />
      );
    }
    
    // Default to login view for unauthenticated users
    return (
      <Login
        onBack={() => setCurrentView('homepage')}
        onLogin={handleLogin}
        onSwitchToSignup={() => setCurrentView('signup')}
      />
    );
  }

  // Admin users get the admin dashboard
  if (user.role === 'admin' && currentView === 'admin') {
    return (
      <AdminDashboard
        user={user}
        onLogout={handleLogout}
      />
    );
  }

  // Regular users get profile view
  if (currentView === 'profile') {
    return (
      <Profile
        onBack={() => setCurrentView('app')}
        onLogout={handleLogout}
      />
    );
  }

  // Support view for all authenticated users
  if (currentView === 'support') {
    return (
      <Support
        onBack={() => setCurrentView('app')}
      />
    );
  }

  // Transaction History view
  if (currentView === 'transactions') {
    return (
      <TransactionHistory
        onBack={() => setCurrentView('app')}
      />
    );
  }

  // About view
  if (currentView === 'about') {
    return (
      <About
        onBack={() => setCurrentView('app')}
      />
    );
  }

  // Terms of Service view
  if (currentView === 'terms') {
    return (
      <TermsOfService
        onBack={() => setCurrentView('signup')}
      />
    );
  }

  // Default authenticated user dashboard - only for non-admin users
  if (user.role !== 'admin') {
    const renderContent = () => {
      switch (activeTab) {
        case 'dashboard':
          return (
            <Dashboard 
              onActivateMine={handleActivateMine}
              onShowTransactions={handleShowTransactions}
              onShowMiningPackages={handleShowMiningPackages}
              onShowHelpline={handleShowHelpline}
              onShowAbout={handleShowAbout}
            />
          );
        case 'mining':
          return <MiningNow />;
        case 'stake':
          return <Stake />;
        case 'earnings':
          return <Earnings onNavigateToStake={() => setActiveTab('stake')} />;
        case 'network':
          return <Network />;
        default:
          return (
            <Dashboard 
              onActivateMine={handleActivateMine}
              onShowTransactions={handleShowTransactions}
              onShowMiningPackages={handleShowMiningPackages}
              onShowHelpline={handleShowHelpline}
              onShowAbout={handleShowAbout}
            />
          );
      }
    };

    return (
      <div className="min-h-screen bg-slate-900 text-white">
        <Header 
          onLogout={handleLogout}
          onProfileClick={() => setCurrentView('profile')}
        />
        <main className="pb-20">
          {renderContent()}
        </main>
        <Navigation 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          onSupportClick={() => setCurrentView('support')}
        />
      </div>
    );
  }

  // If admin user somehow gets to 'app' view, redirect to admin
  if (user.role === 'admin') {
    return (
      <AdminDashboard
        user={user}
        onLogout={handleLogout}
      />
    );
  }

  // Fallback - should not reach here
  return (
    <Login
      onBack={() => setCurrentView('homepage')}
      onLogin={handleLogin}
      onSwitchToSignup={() => setCurrentView('signup')}
    />
  );
}

function App() {
  return <AppContent />;
}

export default App;