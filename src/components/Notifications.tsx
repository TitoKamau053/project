import { useState } from 'react';
import { ArrowLeft, Bell, Check, X, AlertCircle, DollarSign, Users, Zap } from 'lucide-react';

interface NotificationsProps {
  onBack: () => void;
}

interface Notification {
  id: string;
  type: 'deposit' | 'withdrawal' | 'mining' | 'referral' | 'system' | 'security';
  title: string;
  message: string;
  time: string;
  read: boolean;
  important: boolean;
}

export const Notifications = ({ onBack }: NotificationsProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 'N001',
      type: 'deposit',
      title: 'Deposit Successful',
      message: 'Your deposit of KES 5,000 via M-Pesa has been processed successfully.',
      time: '2 hours ago',
      read: false,
      important: false
    },
    {
      id: 'N002',
      type: 'mining',
      title: 'Mining Reward Earned',
      message: 'You have earned KES 500 from Daily Mine Pro. Check your earnings!',
      time: '4 hours ago',
      read: false,
      important: false
    },
    {
      id: 'N003',
      type: 'security',
      title: 'Security Alert',
      message: 'New login detected from Android device. If this wasn\'t you, please secure your account.',
      time: '1 day ago',
      read: true,
      important: true
    },
    {
      id: 'N004',
      type: 'referral',
      title: 'Referral Commission',
      message: 'You earned KES 250 commission from John K.\'s deposit. Keep inviting friends!',
      time: '2 days ago',
      read: true,
      important: false
    },
    {
      id: 'N005',
      type: 'system',
      title: 'System Maintenance',
      message: 'Scheduled maintenance on Jan 20, 2025 from 2:00 AM - 4:00 AM EAT. Services may be temporarily unavailable.',
      time: '3 days ago',
      read: true,
      important: true
    },
    {
      id: 'N006',
      type: 'withdrawal',
      title: 'Withdrawal Processed',
      message: 'Your withdrawal of KES 2,000 has been sent to your M-Pesa account.',
      time: '5 days ago',
      read: true,
      important: false
    }
  ]);

  const [selectedFilter, setSelectedFilter] = useState('all');

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <DollarSign className="w-5 h-5 text-green-500" />;
      case 'withdrawal':
        return <DollarSign className="w-5 h-5 text-orange-500" />;
      case 'mining':
        return <Zap className="w-5 h-5 text-blue-500" />;
      case 'referral':
        return <Users className="w-5 h-5 text-purple-500" />;
      case 'security':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'system':
        return <Bell className="w-5 h-5 text-yellow-500" />;
      default:
        return <Bell className="w-5 h-5 text-slate-400" />;
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev =>
      prev.filter(notification => notification.id !== id)
    );
  };

  const filteredNotifications = notifications.filter(notification => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'unread') return !notification.read;
    if (selectedFilter === 'important') return notification.important;
    return notification.type === selectedFilter;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

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
        <div className="flex items-center space-x-2">
          <h1 className="text-white font-bold text-lg">Notifications</h1>
          {unreadCount > 0 && (
            <div className="bg-orange-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
              {unreadCount}
            </div>
          )}
        </div>
        <button
          onClick={markAllAsRead}
          className="text-orange-500 text-sm hover:text-orange-400 transition-colors"
        >
          Mark all read
        </button>
      </div>

      <div className="p-4 space-y-6">
        {/* Filter Tabs */}
        <div className="flex overflow-x-auto space-x-2">
          {[
            { id: 'all', label: 'All' },
            { id: 'unread', label: 'Unread' },
            { id: 'important', label: 'Important' },
            { id: 'deposit', label: 'Deposits' },
            { id: 'mining', label: 'Mining' },
            { id: 'security', label: 'Security' }
          ].map((filter) => (
            <button
              key={filter.id}
              onClick={() => setSelectedFilter(filter.id)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                selectedFilter === filter.id
                  ? 'bg-orange-500 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`bg-slate-800 rounded-lg p-4 border-l-4 ${
                  notification.important
                    ? 'border-red-500'
                    : notification.read
                    ? 'border-slate-700'
                    : 'border-orange-500'
                } ${!notification.read ? 'bg-slate-700' : ''}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className="mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className={`font-semibold ${!notification.read ? 'text-white' : 'text-slate-300'}`}>
                          {notification.title}
                        </h3>
                        {notification.important && (
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        )}
                        {!notification.read && (
                          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        )}
                      </div>
                      <p className={`text-sm ${!notification.read ? 'text-slate-300' : 'text-slate-400'} mb-2`}>
                        {notification.message}
                      </p>
                      <p className="text-xs text-slate-500">{notification.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-2">
                    {!notification.read && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="text-green-500 hover:text-green-400 transition-colors"
                        title="Mark as read"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(notification.id)}
                      className="text-red-500 hover:text-red-400 transition-colors"
                      title="Delete notification"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <Bell className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-white font-semibold mb-2">No notifications</h3>
              <p className="text-slate-400">
                {selectedFilter === 'all' 
                  ? "You're all caught up! No notifications to show."
                  : `No ${selectedFilter} notifications found.`}
              </p>
            </div>
          )}
        </div>

        {/* Notification Settings */}
        <div className="bg-slate-800 rounded-lg p-4">
          <h3 className="text-white font-semibold mb-3">Notification Settings</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Push Notifications</span>
              <div className="w-12 h-6 bg-orange-500 rounded-full flex items-center">
                <div className="w-5 h-5 bg-white rounded-full translate-x-6 transition-transform"></div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Email Notifications</span>
              <div className="w-12 h-6 bg-slate-600 rounded-full flex items-center">
                <div className="w-5 h-5 bg-white rounded-full translate-x-0.5 transition-transform"></div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300">SMS Notifications</span>
              <div className="w-12 h-6 bg-slate-600 rounded-full flex items-center">
                <div className="w-5 h-5 bg-white rounded-full translate-x-0.5 transition-transform"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
