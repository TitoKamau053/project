import React, { useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { Stake } from './components/Stake';
import { MiningNow } from './components/MiningNow';
import { Earnings } from './components/Earnings';
import { Network } from './components/Network';
import { Navigation } from './components/Navigation';
import { Header } from './components/Header';
import { Login } from './components/Login';
import { Signup } from './components/Signup';
import { Profile } from './components/Profile';
import { TransactionHistory } from './components/TransactionHistory';
import { Notifications } from './components/Notifications';
import { Support } from './components/Support';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentView, setCurrentView] = useState<'app' | 'login' | 'signup' | 'deposit' | 'withdraw' | 'profile' | 'transactions' | 'notifications' | 'support'>('login');

  const handleLogin = () => {
    setCurrentView('app');
  };

  const handleSignup = () => {
    setCurrentView('app');
  };

  const handleLogout = () => {
    setCurrentView('login');
    setActiveTab('dashboard');
  };

  if (currentView === 'login') {
    return (
      <Login
        onBack={() => setCurrentView('app')}
        onLogin={handleLogin}
        onSwitchToSignup={() => setCurrentView('signup')}
      />
    );
  }

  if (currentView === 'signup') {
    return (
      <Signup
        onBack={() => setCurrentView('login')}
        onSignup={handleSignup}
        onSwitchToLogin={() => setCurrentView('login')}
      />
    );
  }

  if (currentView === 'profile') {
    return (
      <Profile
        onBack={() => setCurrentView('app')}
        onLogout={handleLogout}
      />
    );
  }

  if (currentView === 'transactions') {
    return (
      <TransactionHistory
        onBack={() => setCurrentView('app')}
      />
    );
  }

  if (currentView === 'notifications') {
    return (
      <Notifications
        onBack={() => setCurrentView('app')}
      />
    );
  }

  if (currentView === 'support') {
    return (
      <Support
        onBack={() => setCurrentView('app')}
      />
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard 
            onDepositClick={() => setCurrentView('deposit')}
            onWithdrawClick={() => setCurrentView('withdraw')}
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
            onDepositClick={() => setCurrentView('deposit')}
            onWithdrawClick={() => setCurrentView('withdraw')}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Header 
        onLogout={handleLogout}
        onProfileClick={() => setCurrentView('profile')}
        onTransactionsClick={() => setCurrentView('transactions')}
        onNotificationsClick={() => setCurrentView('notifications')}
      />
      <main className="pb-20">
        {renderContent()}
      </main>
      <Navigation 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
      />
    </div>
  );
}

export default App;