import { Home, Zap, DollarSign, TrendingUp, Users, HelpCircle } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onSupportClick?: () => void;
}

export const Navigation = ({ activeTab, setActiveTab, onSupportClick }: NavigationProps) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'mining', label: 'Mining Now', icon: Zap },
    { id: 'stake', label: 'Stake', icon: DollarSign },
    { id: 'earnings', label: 'Earnings', icon: TrendingUp },
    { id: 'network', label: 'Network', icon: Users },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-slate-800 border-t border-slate-700">
      <div className="flex justify-around py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                isActive 
                  ? 'text-orange-500 bg-slate-700' 
                  : 'text-slate-400 hover:text-orange-400'
              }`}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-xs">{item.label}</span>
            </button>
          );
        })}
        {/* Support Button */}
        {onSupportClick && (
          <button
            onClick={onSupportClick}
            className="flex flex-col items-center py-2 px-3 rounded-lg transition-colors text-slate-400 hover:text-orange-400"
          >
            <HelpCircle className="w-5 h-5 mb-1" />
            <span className="text-xs">Help</span>
          </button>
        )}
      </div>
    </nav>
  );
};