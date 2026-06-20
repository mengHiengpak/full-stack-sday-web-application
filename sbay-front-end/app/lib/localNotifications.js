const NOTIFICATIONS_KEY = 'sbay_notifications';

function getAll() {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem(NOTIFICATIONS_KEY) || '[]'); } catch { return []; }
}

function saveAll(notifs) {
  try { localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifs)); } catch {}
}

export function createNotification({ userId, type, senderId, senderName, message }) {
  const notifs = getAll();
  notifs.unshift({
    id: `notif_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    userId,
    type,
    senderId,
    senderName,
    message: message || getDefaultMessage(type, senderName),
    read: false,
    createdAt: new Date().toISOString(),
  });
  saveAll(notifs);
}

function getDefaultMessage(type, senderName) {
  const map = {
    friend_request: `sent you a friend request`,
    friend_accepted: `accepted your friend request`,
    post_like: `liked your post`,
    post_comment: `commented on your post`,
  };
  return map[type] || 'sent you a notification';
}

export function getNotificationsForUser(userId) {
  return getAll().filter((n) => n.userId === userId);
}

export function getUnreadCount(userId) {
  return getAll().filter((n) => n.userId === userId && !n.read).length;
}

export function markAsRead(notifId) {
  const notifs = getAll();
  const n = notifs.find((n) => n.id === notifId);
  if (n) { n.read = true; saveAll(notifs); }
}

export function markAllAsRead(userId) {
  const notifs = getAll();
  notifs.forEach((n) => { if (n.userId === userId) n.read = true; });
  saveAll(notifs);
}
