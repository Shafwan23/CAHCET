import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle2, Trash2, AlertCircle, Info } from 'lucide-react';
import { cmsService } from '../../../../services/cmsService';

const NotificationsEditor = () => {
  const [notifications, setNotifications] = useState([]);
  const [sectionId, setSectionId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await cmsService.getPage('system');
        const sections = res.data?.sections || [];
        const notifSection = sections.find(s => s.sectionKey === 'system.notifications');
        if (notifSection) {
          setSectionId(notifSection.id);
          setNotifications(JSON.parse(notifSection.content));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const saveNotifications = async (newNotifs) => {
    if (!sectionId) return;
    try {
      await cmsService.updateSection(sectionId, { content: JSON.stringify(newNotifs) });
      setNotifications(newNotifs);
    } catch (err) {
      console.error(err);
    }
  };

  const markNotificationRead = (id) => {
    const updated = notifications.map(n => n.id === id ? { ...n, read: true } : n);
    saveNotifications(updated);
  };

  const clearAllNotifications = () => {
    saveNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const getIcon = (type) => {
    switch(type) {
      case 'success': return <CheckCircle2 className="w-5 h-5 text-amber-500" />;
      case 'warning': return <AlertCircle className="w-5 h-5 text-amber-500" />;
      case 'error': return <AlertCircle className="w-5 h-5 text-amber-500" />;
      default: return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
            Notifications
            {unreadCount > 0 && (
              <span className="px-2.5 py-0.5 bg-primary-100 text-amber-600 text-xs font-bold rounded-full">
                {unreadCount} New
              </span>
            )}
          </h1>
          <p className="text-slate-500 text-sm mt-1">System alerts, updates, and reminders.</p>
        </div>
        
        {notifications.length > 0 && (
          <button 
            onClick={clearAllNotifications}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-primary-200 text-amber-600 rounded-lg hover:bg-primary-50 transition-colors text-sm font-semibold shadow-sm w-max"
          >
            <Trash2 className="w-4 h-4" /> Clear All
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {notifications.length === 0 ? (
          <div className="p-16 text-center flex flex-col items-center justify-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100">
              <Bell className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-700">All Caught Up!</h3>
            <p className="text-slate-500 mt-2 max-w-sm">You have no new notifications. System alerts and updates will appear here.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {notifications.map(notif => (
              <div 
                key={notif.id} 
                className={`p-5 flex gap-4 transition-colors ${notif.read ? 'bg-white opacity-70' : 'bg-blue-50/30'}`}
              >
                <div className="shrink-0 mt-1">
                  {getIcon(notif.type)}
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h4 className={`text-sm font-bold ${notif.read ? 'text-slate-700' : 'text-slate-900'}`}>
                        {notif.title}
                      </h4>
                      <p className={`text-sm mt-1 ${notif.read ? 'text-slate-500' : 'text-slate-600'}`}>
                        {notif.message}
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-slate-400 whitespace-nowrap">
                      {new Date(notif.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  {!notif.read && (
                    <button 
                      onClick={() => markNotificationRead(notif.id)}
                      className="mt-3 text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors uppercase tracking-wider"
                    >
                      Mark as read
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsEditor;
