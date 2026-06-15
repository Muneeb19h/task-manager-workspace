import React, { useState, useEffect, useRef } from 'react';
import { FaBell, FaCircle } from 'react-icons/fa';
import type { NotificationBellProps, NotificationItem } from '../types/component-props.types';
// Import your central API client wrapper
import { taskClient } from '../api/taskClient';

export const NotificationBell: React.FC<NotificationBellProps> = ({ darkMode }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const intervalRef = useRef<number | null>(null);

  const fetchNotifications = async () => {
    try {
      // Use the verified client instance to automatically include token interceptors
      const response = await taskClient.get<NotificationItem[]>('notifications/');
      setNotifications(response.data);
      setUnreadCount(response.data.filter((n) => !n.is_read).length);
    } catch (err: unknown) {
      console.error('Notification synchronization error:', err);
    }
  };

  const markAllAsRead = async () => {
    if (unreadCount === 0) return;
    try {
      // Use taskClient for action posts as well
      await taskClient.post('notifications/mark-read/');
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (err: unknown) {
      console.error('Failed to clear notifications:', err);
    }
  };

  useEffect(() => {
    const initializeFeed = async () => {
      await fetchNotifications();
    };
    initializeFeed();

    intervalRef.current = window.setInterval(() => {
      fetchNotifications();
    }, 30000);

    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      markAllAsRead();
    }
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={toggleDropdown}
        className={`p-2.5 rounded-xl border relative transition-all duration-200 ${
          darkMode
            ? 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800'
            : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:shadow-sm'
        }`}
      >
        <FaBell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <FaCircle className="relative inline-flex rounded-full h-2.5 w-2.5 text-indigo-500" />
          </span>
        )}
      </button>

      {isOpen && (
        <div
          className={`absolute right-0 mt-2 w-80 rounded-2xl border shadow-2xl z-50 overflow-hidden transform origin-top-right transition-all duration-200 ${
            darkMode
              ? 'bg-slate-900 border-slate-800 text-slate-100'
              : 'bg-white border-slate-200 text-slate-900'
          }`}
        >
          <div className="px-4 py-3 border-b border-slate-800/60 flex items-center justify-between bg-slate-950/20">
            <h4 className="text-xs font-black tracking-wider uppercase font-mono text-indigo-400">
              Activity Stream
            </h4>
            {unreadCount > 0 && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                {unreadCount} New
              </span>
            )}
          </div>

          <div className="max-h-64 overflow-y-auto divide-y divide-slate-800/40">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500 font-medium">
                Your activity feed is empty.
              </div>
            ) : (
              notifications.map((item) => (
                <div
                  key={item.id}
                  className={`p-3.5 text-xs transition-colors leading-relaxed ${
                    !item.is_read
                      ? darkMode
                        ? 'bg-indigo-500/[0.03]'
                        : 'bg-indigo-500/[0.01]'
                      : ''
                  }`}
                >
                  <p className={item.is_read ? 'text-slate-400' : 'text-slate-200 font-medium'}>
                    {item.message}
                  </p>
                  <span className="text-[9px] font-mono text-slate-500 block mt-1">
                    {new Date(item.created_at).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
