import React, { useState, useEffect } from 'react';
import { Bell, CheckCheck, Trash2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import notificationService from './notificationService';
import Loading from '../../components/Loading/Loading';

export const NotificationList = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const data = await notificationService.getNotifications();
      setNotifications(data.notifications || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    } catch (e) {
      console.error(e);
    }
  };

  const handleItemRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return <Loading message="Loading notifications..." />;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E2ECE0]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-black text-[#20392A] flex items-center gap-2.5">
            <Bell size={28} className="text-[#347A46]" /> Notifications & Dispatch Alerts
          </h1>
          <p className="text-xs sm:text-sm text-[#56715E] mt-1.5 font-sans">
            Real-time updates regarding your farm waste listings, collection offers, and partner dispatch dates.
          </p>
        </div>
        {notifications.some(n => !n.is_read) && (
          <button
            onClick={handleMarkAllRead}
            className="btn-outline text-xs px-4 py-2 flex items-center gap-2 self-start sm:self-auto font-heading font-bold rounded-full border-[#E2ECE0] text-[#347A46] hover:bg-[#FAF9F3]"
          >
            <CheckCheck size={16} /> Mark all as read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-[#E2ECE0] p-8 shadow-sm">
          <div className="w-16 h-16 bg-[#E8F1E5] rounded-2xl flex items-center justify-center mx-auto text-[#347A46] mb-4">
            <Bell size={32} />
          </div>
          <h3 className="font-heading font-bold text-lg text-[#20392A]">No Notifications Yet</h3>
          <p className="text-xs sm:text-sm text-[#56715E] max-w-md mx-auto mt-2 font-sans leading-relaxed">
            You'll receive alerts here when recycling partners schedule a pickup, submit an offer, or update your request timeline.
          </p>
        </div>
      ) : (
        <div className="space-y-3.5">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-5 rounded-2xl border transition-all ${
                !notif.is_read 
                  ? 'bg-white border-[#68A66A] shadow-sm' 
                  : 'bg-[#FAF9F3] border-[#E2ECE0] opacity-80'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 font-sans">
                  <div className="flex items-center gap-2">
                    <h3 className="font-heading font-bold text-[#20392A] text-sm">{notif.title}</h3>
                    {!notif.is_read && (
                      <span className="w-2.5 h-2.5 rounded-full bg-[#68A66A] inline-block"></span>
                    )}
                  </div>
                  <p className="text-xs text-[#56715E] mt-1.5 leading-relaxed">{notif.message}</p>
                  <div className="flex items-center gap-4 mt-3">
                    <span className="text-[11px] text-gray-400">
                      {new Date(notif.created_at).toLocaleString('en-IN')}
                    </span>
                    {notif.link && (
                      <Link
                        to={notif.link}
                        onClick={() => handleItemRead(notif.id)}
                        className="text-xs font-heading font-bold text-[#347A46] hover:text-[#2A6439] underline"
                      >
                        View Details &rarr;
                      </Link>
                    )}
                  </div>
                </div>
                {!notif.is_read && (
                  <button
                    onClick={() => handleItemRead(notif.id)}
                    className="text-xs text-gray-400 hover:text-[#347A46] p-2 rounded-xl hover:bg-[#E8F1E5] cursor-pointer"
                    title="Mark as read"
                  >
                    <CheckCheck size={16} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationList;
