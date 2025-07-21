import { Bell, LogOut, User, History } from 'lucide-react';

interface HeaderProps {
  onLogout: () => void;
  onProfileClick?: () => void;
  onTransactionsClick?: () => void;
  onNotificationsClick?: () => void;
}

export const Header = ({ onLogout, onProfileClick, onTransactionsClick, onNotificationsClick }: HeaderProps) => {
  return (
    <header className="bg-slate-900 border-b border-slate-700 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">C</span>
          </div>
          <div>
            <h1 className="text-orange-500 font-bold text-lg">CryptoMine Pro</h1>
            <p className="text-slate-400 text-xs">CM7891xyz</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          {onTransactionsClick && (
            <button
              onClick={onTransactionsClick}
              className="text-slate-400 hover:text-white transition-colors"
              title="Transaction History"
            >
              <History className="w-5 h-5" />
            </button>
          )}
          {onNotificationsClick && (
            <button
              onClick={onNotificationsClick}
              className="text-slate-400 hover:text-white transition-colors"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
            </button>
          )}
          {!onNotificationsClick && <Bell className="w-5 h-5 text-slate-400" />}
          {onProfileClick && (
            <button
              onClick={onProfileClick}
              className="text-slate-400 hover:text-white transition-colors"
              title="Profile"
            >
              <User className="w-5 h-5" />
            </button>
          )}
          <button
            onClick={onLogout}
            className="text-slate-400 hover:text-white transition-colors"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};