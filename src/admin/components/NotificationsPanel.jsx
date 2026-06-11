import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, CheckCheck, Trash2, Info, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { useToast } from './ui/Toast';
import EditorPage from './ui/EditorPage';
import { AdminButton } from './ui/AdminInput';
import EmptyState from './ui/EmptyState';
import { cmsService } from '../../services/cmsService';

const TYPE_CONFIG = {
  success: { icon: CheckCircle, color: 'text-amber-500', bg: 'bg-primary-50', border: 'border-primary-100' },
  error: { icon: XCircle, color: 'text-amber-500', bg: 'bg-primary-50', border: 'border-primary-100' },
  warning: { icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-100' },
  info: { icon: Info, color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-100' },
};

const formatTime = (ts) => {
  const d = new Date(ts);
  const now = new Date();
  const diff = Math.floor((now - d) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  return d.toLocaleDateString();
};

const NotificationsPanel = () => {
  const toast = useToast();
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

  const handleMarkAll = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    saveNotifications(updated);
    toast({ type: 'success', title: 'All marked as read' });
  };

  const handleClearAll = () => {
    saveNotifications([]);
    toast({ type: 'info', title: 'Notifications cleared' });
  };

  const handleTestNotif = () => {
    const newNotif = {
      id: Date.now().toString(),
      title: 'Test Notification',
      message: 'This is a test notification from the admin panel.',
      type: 'info',
      read: false,
      createdAt: new Date().toISOString()
    };
    saveNotifications([newNotif, ...notifications]);
  };

  const unread = notifications.filter(n => !n.read).length;

  if (loading) return <div>Loading...</div>;

  return (
    <EditorPage title="Notifications" description="View and manage admin notifications and system alerts." breadcrumb={['Admin', 'Notifications']}>
      {/* Actions */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        {unread > 0 && (
          <span className="px-2.5 py-1 bg-primary-100 text-amber-600 text-xs font-bold rounded-full">{unread} unread</span>
        )}
        <div className="ml-auto flex gap-2">
          {unread > 0 && <AdminButton variant="secondary" size="sm" icon={CheckCheck} onClick={handleMarkAll}>Mark all read</AdminButton>}
          {notifications.length > 0 && <AdminButton variant="danger" size="sm" icon={Trash2} onClick={handleClearAll}>Clear all</AdminButton>}
          <AdminButton variant="ghost" size="sm" onClick={handleTestNotif}>Test notification</AdminButton>
        </div>
      </div>

      {/* Notification list */}
      {notifications.length === 0 ? (
        <EmptyState icon={Bell} title="No notifications" description="You're all caught up! Notifications from the CMS will appear here." />
      ) : (
        <div className="space-y-3">
          {notifications.map((notif, i) => {
            const config = TYPE_CONFIG[notif.type] || TYPE_CONFIG.info;
            const Icon = config.icon;
            return (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => !notif.read && markNotificationRead(notif.id)}
                className={`flex items-start gap-4 p-4 rounded-2xl border transition-all cursor-pointer
                  ${notif.read ? 'bg-white border-slate-100' : `${config.bg} ${config.border} shadow-sm`}`}
              >
                <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${notif.read ? 'bg-slate-100' : config.bg}`}>
                  <Icon className={`w-4.5 h-4.5 ${notif.read ? 'text-slate-400' : config.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm font-semibold ${notif.read ? 'text-slate-600' : 'text-slate-800'}`}>
                      {notif.title}
                      {!notif.read && <span className="ml-2 inline-block w-2 h-2 rounded-full bg-blue-500 align-middle" />}
                    </p>
                    <span className="text-[10px] text-slate-400 shrink-0">{formatTime(notif.createdAt)}</span>
                  </div>
                  {notif.message && (
                    <p className={`text-xs mt-0.5 leading-relaxed ${notif.read ? 'text-slate-400' : 'text-slate-600'}`}>{notif.message}</p>
                  )}
                  {!notif.read && (
                    <p className="text-[10px] text-blue-500 mt-1.5 font-medium">Click to mark as read</p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </EditorPage>
  );
};

export default NotificationsPanel;
