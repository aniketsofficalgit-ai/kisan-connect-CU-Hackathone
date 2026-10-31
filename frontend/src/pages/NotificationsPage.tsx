import React from 'react';
import { Link } from 'react-router-dom';
import { Bell, CheckCheck, Clock, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { useNotification } from '../context/NotificationContext';

export const NotificationsPage: React.FC = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotification();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#176B3A] mb-1">
            <Bell className="w-4 h-4" />
            <span>Activity & Real-Time Alerts</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Notifications Center
          </h1>
          <p className="text-xs sm:text-sm text-gray-600">
            Stay informed on booking approvals, job acceptances, and buyer purchase offers.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={markAllAsRead}
            className="px-4 py-2 bg-emerald-50 border border-emerald-200 text-[#176B3A] text-xs font-bold rounded-xl hover:bg-emerald-100 transition-colors flex items-center gap-1.5 w-fit"
          >
            <CheckCheck className="w-4 h-4" />
            <span>Mark All as Read</span>
          </button>
        )}
      </div>

      <div className="bg-white rounded-3xl border border-gray-200 shadow-xs divide-y divide-gray-100 overflow-hidden">
        {notifications.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Bell className="w-10 h-10 text-gray-300 mx-auto" />
            <h3 className="text-base font-bold text-gray-800">No Notifications</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              You are all caught up! When you receive requests, offers, or messages, they will appear here.
            </p>
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => !n.is_read && markAsRead(n.id)}
              className={`p-5 transition-colors flex items-start justify-between gap-4 cursor-pointer ${
                n.is_read ? 'bg-white hover:bg-gray-50/70' : 'bg-emerald-50/40 hover:bg-emerald-50/70'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    n.is_read ? 'bg-gray-100 text-gray-500' : 'bg-[#176B3A] text-white'
                  }`}
                >
                  <Bell className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-xs sm:text-sm text-gray-900">{n.title}</h4>
                    {!n.is_read && (
                      <span className="w-2 h-2 rounded-full bg-emerald-600" />
                    )}
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">{n.message}</p>
                  <span className="text-[10px] text-gray-400 block pt-0.5">
                    {new Date(n.created_at).toLocaleDateString([], {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>

              <div className="shrink-0 flex items-center gap-2">
                <Link
                  to="/requests"
                  className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-bold text-gray-700 hover:bg-white"
                >
                  View
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
