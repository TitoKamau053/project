import { LogOut, User } from 'lucide-react';
import { Logo } from './Logo';

interface HeaderProps {
  onLogout: () => void;
  onProfileClick?: () => void;
}

export const Header = ({ onLogout, onProfileClick }: HeaderProps) => {
  return (
    <header className="bg-slate-900 border-b border-slate-700 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Logo size="md" />
          <div>
            <h1 className="text-orange-500 font-bold text-lg">CryptoMine Pro</h1>
            <p className="text-slate-400 text-xs">CM7891xyz</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
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