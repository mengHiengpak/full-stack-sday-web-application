'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { notificationsAPI } from '@/app/lib/api';
import { getNotificationsForUser, markAsRead as localMarkRead, markAllAsRead as localMarkAllRead } from '@/app/lib/localNotifications';

export default function NotificationPanel({ open, onClose, onRead }) {
  const router = useRouter();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    loadNotifications();
  }, [open]);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose?.();
    };
    if (open) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open, onClose]);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const res = await notificationsAPI.get();
      setNotifications(res.data.data || []);
    } catch {
      if (user) {
        setNotifications(getNotificationsForUser(user.id));
      } else {
        setNotifications([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClick = useCallback(async (notification) => {
    try {
      await notificationsAPI.markRead(notification.id);
    } catch {
      localMarkRead(notification.id);
    }
    onRead?.(1);
    onClose?.();
    if (notification.type === 'friend_request' || notification.type === 'friend_accepted') {
      router.push(`/profile/${notification.senderId}`);
    } else if (notification.type === 'post_like' || notification.type === 'post_comment') {
      router.push('/');
    } else {
      router.push('/');
    }
  }, [router, onClose, onRead]);

  const handleMarkAllRead = async () => {
    try {
      await notificationsAPI.markAllRead();
    } catch {
      localMarkAllRead(user?.id);
    }
    const unread = notifications.filter(n => !n.read).length;
    onRead?.(unread);
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const timeAgo = (dateStr) => {
    const now = new Date();
    const date = new Date(dateStr);
    const diff = Math.floor((now - date) / 1000);
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  const getIcon = (type) => {
    switch (type) {
      case 'friend_request': return 'fa-user-plus';
      case 'friend_accepted': return 'fa-handshake';
      case 'post_like': return 'fa-heart';
      case 'post_comment': return 'fa-comment';
      default: return 'fa-bell';
    }
  };

  const getIconColor = (type) => {
    switch (type) {
      case 'friend_request': return '#f59e0b';
      case 'friend_accepted': return '#42b72a';
      case 'post_like': return '#ef4444';
      case 'post_comment': return '#1877f2';
      default: return 'var(--text3)';
    }
  };

  return (
    <div
      ref={ref}
      className="absolute top-full right-0 mt-2 w-[380px] bg-[var(--bg2)] border border-[var(--border)] rounded-xl shadow-lg z-50 max-h-[500px] flex flex-col"
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
        <span className="font-bold text-base text-[var(--text)]">Notifications</span>
        {notifications.some(n => !n.read) && (
          <button
            onClick={handleMarkAllRead}
            className="text-xs font-semibold text-[var(--accent)] bg-transparent border-none cursor-pointer hover:underline"
          >
            Mark all read
          </button>
        )}
      </div>
      <div className="overflow-y-auto flex-1">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-6 h-6 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-10">
            <div className="text-3xl text-[var(--text3)] mb-2"><i className="fa-regular fa-bell-slash" /></div>
            <div className="text-sm font-medium text-[var(--text2)]">No notifications yet</div>
            <div className="text-xs text-[var(--text3)] mt-1">We'll let you know when something arrives</div>
          </div>
        ) : (
          <div>
            {notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => handleClick(n)}
                className={`flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors hover:bg-[var(--bg3)] ${!n.read ? 'bg-[var(--bg)]' : ''}`}
              >
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-sm"
                  style={{ backgroundColor: `${getIconColor(n.type)}20`, color: getIconColor(n.type) }}
                >
                  <i className={`fa-solid ${getIcon(n.type)}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-[var(--text)] leading-snug">
                    {n.message || (
                      <>
                        <span className="font-semibold">{n.senderName || n.sender?.username || 'Someone'}</span>
                        {n.type === 'friend_request' && ' sent you a friend request'}
                        {n.type === 'friend_accepted' && ' accepted your friend request'}
                        {n.type === 'post_like' && ' liked your post'}
                        {n.type === 'post_comment' && ' commented on your post'}
                      </>
                    )}
                  </div>
                  <div className="text-xs text-[var(--text3)] mt-0.5">{timeAgo(n.createdAt)}</div>
                </div>
                {!n.read && (
                  <div className="w-2.5 h-2.5 rounded-full bg-[var(--accent)] flex-shrink-0 mt-1.5" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
