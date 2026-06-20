'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { useToast } from '@/app/components/Toast';
import { usersAPI, notificationsAPI } from '@/app/lib/api';
import { getUnreadCount as localUnreadCount } from '@/app/lib/localNotifications';
import NotificationPanel from '@/app/components/NotificationPanel';

export default function TopNav({ onOpenChat }) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const toast = useToast();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const ref = useRef(null);
  const notifRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (!user) return;
    const fetchCount = async () => {
      try {
        const res = await notificationsAPI.unreadCount();
        setUnreadCount(res.data?.count || res.data?.data || 0);
      } catch {
        setUnreadCount(localUnreadCount(user.id));
      }
    };
    fetchCount();
    const interval = setInterval(fetchCount, 10000);
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    if (query.length < 1) { setResults([]); setOpen(false); return; }
    const timer = setTimeout(async () => {
      try {
        const res = await usersAPI.search(query);
        setResults(res.data.data || []);
        setOpen(true);
      } catch { setOpen(false); }
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] h-[56px] bg-[var(--bg2)] border-b border-[var(--border)] flex items-center px-4 gap-3 shadow-sm">
      <div className="flex items-center gap-1.5">
        <div className="w-8 h-8 rounded-lg bg-[var(--accent)] flex items-center justify-center text-white font-[Sora] font-bold text-base">S</div>
        <span className="font-[Sora] font-bold text-lg text-[var(--accent)]">Sbay</span>
      </div>

      <div ref={ref} className="flex-1 max-w-[400px] mx-2 relative">
        <div className="flex items-center bg-[var(--bg)] border border-[var(--border)] rounded-full px-3 gap-2">
          <i className="fa-solid fa-magnifying-glass text-xs text-[var(--text3)]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Sbay"
            className="flex-1 bg-transparent border-none outline-none text-sm text-[var(--text)] py-1.5"
          />
          {query && <button onClick={() => { setQuery(''); setResults([]); setOpen(false); }} className="text-[var(--text3)] hover:text-[var(--text)]"><i className="fa-solid fa-xmark" /></button>}
        </div>
        {open && (
          <div className="absolute top-full mt-1.5 left-0 right-0 bg-[var(--bg2)] border border-[var(--border)] rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
            {results.length === 0 ? (
              <div className="px-3 py-4 text-center text-sm text-[var(--text3)]">No users found</div>
            ) : (
              results.map((u) => (
                <div key={u.id} className="flex items-center gap-3 px-3 py-2 hover:bg-[var(--bg3)] cursor-pointer" onClick={() => { setOpen(false); setQuery(''); router.push(`/profile/${u.id}`); }}>
                  <div className="w-8 h-8 rounded-full bg-[var(--accent)] flex items-center justify-center font-bold text-xs text-white flex-shrink-0 overflow-hidden">
                    {u.profilePicture ? <img src={u.profilePicture} alt="" className="w-full h-full object-cover" /> : u.username?.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-[var(--text)]">{u.username}</div>
                    {u.bio && <div className="text-xs text-[var(--text3)] truncate max-w-[200px]">{u.bio}</div>}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <div className="ml-auto flex items-center gap-1">
        <button onClick={() => router.push('/chat')} className="w-9 h-9 rounded-full bg-[var(--bg)] flex items-center justify-center text-[var(--text2)] hover:bg-[var(--bg3)] hover:text-[var(--accent)]">
          <i className="fa-solid fa-message" />
        </button>
        <div ref={notifRef} className="relative">
          <button onClick={() => setNotifOpen(prev => !prev)} className="w-9 h-9 rounded-full bg-[var(--bg)] flex items-center justify-center text-[var(--text2)] hover:bg-[var(--bg3)] hover:text-[var(--accent)] relative">
            <i className="fa-solid fa-bell" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full bg-[#ef4444] text-white text-[10px] font-bold flex items-center justify-center px-1 shadow-sm border-2 border-[var(--bg2)]">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </button>
          {notifOpen && <NotificationPanel open={notifOpen} onClose={() => setNotifOpen(false)} onRead={(n) => setUnreadCount(prev => Math.max(0, prev - n))} />}
        </div>
        <div className="relative group">
          <button onClick={() => router.push(`/profile/${user?.id}`)} className="w-[36px] h-[36px] rounded-full bg-[var(--accent)] flex items-center justify-center font-bold text-sm text-white cursor-pointer flex-shrink-0 overflow-hidden">
            {user?.profilePicture ? (
              <img src={user.profilePicture} alt="" className="w-full h-full object-cover" />
            ) : (
              user?.username?.slice(0, 2).toUpperCase() || '?'
            )}
          </button>
          <div className="absolute right-0 top-full mt-1.5 w-40 bg-[var(--bg2)] border border-[var(--border)] rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
            <button onClick={() => router.push(`/profile/${user?.id}`)} className="w-full text-left px-4 py-2.5 text-sm text-[var(--text2)] hover:bg-[var(--bg3)] rounded-lg">
              <i className="fa-solid fa-user mr-2" />Profile
            </button>
            <button onClick={logout} className="w-full text-left px-4 py-2.5 text-sm text-[var(--text2)] hover:bg-[var(--bg3)] rounded-lg">
              <i className="fa-solid fa-right-from-bracket mr-2" />Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
