import { useState } from 'react';
import { ArrowLeft, Shield, Bell, Eye, Lock, Smartphone, Globe, Moon, Sun } from 'lucide-react';

interface SettingsProps {
  onBack: () => void;
}

export const Settings = ({ onBack }: SettingsProps) => {
  const [darkMode, setDarkMode] = useState(true);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [notifications, setNotifications] = useState({
    transactions: true,
    marketing: false,
    security: true,
    mining: true,
  });
  const [language, setLanguage] = useState('english');
  const [currency, setCurrency] = useState('kes');

  const handleNotificationToggle = (key: string) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev]
    }));
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700">
        <button 
          onClick={onBack}
          className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
        <h1 className="text-white font-bold text-lg">Settings</h1>
        <div></div>
      </div>

      <div className="p-4 space-y-6">
        {/* Security Settings */}
        <div className="bg-slate-800 rounded-lg p-4">
          <div className="flex items-center space-x-3 mb-4">
            <Shield className="w-6 h-6 text-orange-500" />
            <h3 className="text-white font-semibold">Security</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Lock className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="text-white">Two-Factor Authentication</p>
                  <p className="text-slate-400 text-sm">Add an extra layer of security</p>
                </div>
              </div>
              <button
                onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                className={`w-12 h-6 rounded-full transition-colors ${
                  twoFactorEnabled ? 'bg-orange-500' : 'bg-slate-600'
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    twoFactorEnabled ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Smartphone className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="text-white">Biometric Login</p>
                  <p className="text-slate-400 text-sm">Use fingerprint or face ID</p>
                </div>
              </div>
              <button
                onClick={() => setBiometricEnabled(!biometricEnabled)}
                className={`w-12 h-6 rounded-full transition-colors ${
                  biometricEnabled ? 'bg-orange-500' : 'bg-slate-600'
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    biometricEnabled ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>

            <button className="w-full flex items-center justify-between p-3 bg-slate-900 rounded-lg hover:bg-slate-700 transition-colors">
              <span className="text-white">Change Password</span>
              <ArrowLeft className="w-4 h-4 text-slate-400 rotate-180" />
            </button>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-slate-800 rounded-lg p-4">
          <div className="flex items-center space-x-3 mb-4">
            <Bell className="w-6 h-6 text-orange-500" />
            <h3 className="text-white font-semibold">Notifications</h3>
          </div>
          <div className="space-y-4">
            {Object.entries(notifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <p className="text-white capitalize">{key} Notifications</p>
                  <p className="text-slate-400 text-sm">
                    {key === 'transactions' && 'Deposits, withdrawals, and earnings'}
                    {key === 'marketing' && 'Promotions and special offers'}
                    {key === 'security' && 'Login alerts and security updates'}
                    {key === 'mining' && 'Mining rewards and status updates'}
                  </p>
                </div>
                <button
                  onClick={() => handleNotificationToggle(key)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    value ? 'bg-orange-500' : 'bg-slate-600'
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      value ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Appearance */}
        <div className="bg-slate-800 rounded-lg p-4">
          <div className="flex items-center space-x-3 mb-4">
            <Eye className="w-6 h-6 text-orange-500" />
            <h3 className="text-white font-semibold">Appearance</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {darkMode ? <Moon className="w-5 h-5 text-slate-400" /> : <Sun className="w-5 h-5 text-slate-400" />}
                <div>
                  <p className="text-white">Dark Mode</p>
                  <p className="text-slate-400 text-sm">Switch between light and dark themes</p>
                </div>
              </div>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`w-12 h-6 rounded-full transition-colors ${
                  darkMode ? 'bg-orange-500' : 'bg-slate-600'
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    darkMode ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-slate-800 rounded-lg p-4">
          <div className="flex items-center space-x-3 mb-4">
            <Globe className="w-6 h-6 text-orange-500" />
            <h3 className="text-white font-semibold">Preferences</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white">Language</p>
                <p className="text-slate-400 text-sm">Choose your preferred language</p>
              </div>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-slate-700 text-white px-3 py-2 rounded border border-slate-600 focus:outline-none focus:border-orange-500"
              >
                <option value="english">English</option>
                <option value="swahili">Swahili</option>
                <option value="french">French</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-white">Currency</p>
                <p className="text-slate-400 text-sm">Default currency display</p>
              </div>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="bg-slate-700 text-white px-3 py-2 rounded border border-slate-600 focus:outline-none focus:border-orange-500"
              >
                <option value="kes">KES (Kenyan Shilling)</option>
                <option value="usd">USD (US Dollar)</option>
                <option value="eur">EUR (Euro)</option>
              </select>
            </div>
          </div>
        </div>

        {/* About */}
        <div className="bg-slate-800 rounded-lg p-4">
          <h3 className="text-white font-semibold mb-4">About</h3>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-between p-3 bg-slate-900 rounded-lg hover:bg-slate-700 transition-colors">
              <span className="text-white">Privacy Policy</span>
              <ArrowLeft className="w-4 h-4 text-slate-400 rotate-180" />
            </button>
            <button className="w-full flex items-center justify-between p-3 bg-slate-900 rounded-lg hover:bg-slate-700 transition-colors">
              <span className="text-white">Terms of Service</span>
              <ArrowLeft className="w-4 h-4 text-slate-400 rotate-180" />
            </button>
            <button className="w-full flex items-center justify-between p-3 bg-slate-900 rounded-lg hover:bg-slate-700 transition-colors">
              <span className="text-white">App Version</span>
              <span className="text-slate-400">1.0.0</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
