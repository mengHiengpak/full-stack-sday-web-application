'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usersAPI, friendsAPI } from '@/app/lib/api';
import { useAuth } from '@/app/context/AuthContext';

export default function RightPanel({ toast }) {
  const { user } = useAuth();
  const router = useRouter();
  const [suggested, setSuggested] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(true);

  useEffect(() => {
    loadSuggested();
    loadRequests();
  }, [user]);

  useEffect(() => {
    if (!user || suggested.length === 0) return;
  }, [suggested.length, user]);

  const loadSuggested = async () => {
    try {
      const res = await usersAPI.suggested(5);
      setSuggested(res.data.data || []);
    } catch {
      // unavailable
    } finally {
      setLoading(false);
    }
  };

  const loadRequests = async () => {
    try {
      const res = await friendsAPI.getRequests();
      setRequests(res.data.data || []);
    } catch {
      // ignore
    } finally {
      setRequestsLoading(false);
    }
  };

  const handleSendRequest = async (userId, username) => {
    setSuggested(prev => prev.map(u => u.id === userId ? { ...u, friendStatus: 'sent' } : u));
    try {
      await friendsAPI.sendRequest(userId);
      toast?.(`Friend request sent to ${username}`);
    } catch {
      loadSuggested();
      toast?.('Failed to send request');
    }
  };

  const handleRespond = async (requestId, status, username) => {
    setRequests(prev => prev.filter(r => r.id !== requestId));
    try {
      await friendsAPI.respond(requestId, status);
      toast?.(status === 'accepted' ? `Accepted friend request from ${username}` : `Declined friend request from ${username}`);
    } catch {
      toast?.(status === 'accepted' ? `Accepted friend request from ${username}` : `Declined friend request from ${username}`);
    }
  };

  const handleUnfriend = async (userId, username) => {
    setSuggested(prev => prev.map(u => u.id === userId ? { ...u, friendStatus: 'none' } : u));
    try {
      await friendsAPI.unfriend(userId);
      toast?.(`Unfriended ${username}`);
    } catch {
      toast?.('Failed to unfriend');
    }
  };

  return (
    <aside className="w-[300px] fixed top-[56px] right-0 bottom-0 bg-[var(--bg2)] border-l border-[var(--border)] overflow-y-auto p-4 flex flex-col gap-4 max-[1100px]:hidden">
      {requests.length > 0 && (
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius)] p-4 shadow-sm">
          <div className="text-sm font-semibold text-[var(--text)] mb-3">Friend Requests</div>
          {requests.map((r) => (
            <div key={r.id} className="flex items-center gap-3 mb-3">
              <div
                onClick={() => router.push(`/profile/${r.sender?.id}`)}
                className="w-10 h-10 rounded-full bg-[var(--accent)] text-xs font-bold text-white flex-shrink-0 overflow-hidden cursor-pointer hover:opacity-80 relative"
              >
                {r.sender?.profilePicture && <img src={r.sender.profilePicture} alt="" className="absolute inset-0 w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />}
                <div className="w-full h-full flex items-center justify-center">{r.sender?.username?.slice(0, 2).toUpperCase() || '?'}</div>
              </div>
              <div
                onClick={() => router.push(`/profile/${r.sender?.id}`)}
                className="flex-1 min-w-0 cursor-pointer hover:underline"
              >
                <div className="text-sm font-semibold text-[var(--text)] truncate">{r.sender?.username}</div>
              </div>
              <div className="flex gap-1">
                <button onClick={() => handleRespond(r.id, 'accepted', r.sender?.username)} className="w-8 h-8 rounded-full bg-[var(--accent)] text-white border-none flex items-center justify-center cursor-pointer text-xs hover:bg-[var(--accent2)]">
                  <i className="fa-solid fa-check" />
                </button>
                <button onClick={() => handleRespond(r.id, 'declined', r.sender?.username)} className="w-8 h-8 rounded-full bg-[var(--bg3)] text-[var(--text2)] border-none flex items-center justify-center cursor-pointer text-xs hover:bg-red-50 hover:text-red-500">
                  <i className="fa-solid fa-xmark" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius)] p-4 shadow-sm">
        <div className="text-sm font-semibold text-[var(--text)] mb-3">Suggested for you</div>
        {loading ? (
          <div className="text-center text-xs text-[var(--text3)] py-4">Loading suggestions...</div>
        ) : suggested.length === 0 ? (
          <div className="text-sm text-[var(--text3)] text-center py-6">
            <div className="font-medium text-[var(--text2)]">No suggestions yet</div>
          </div>
        ) : (
          <div className="space-y-3">
            {suggested.filter(u => u.friendStatus !== 'received').map((u) => (
              <div key={u.id} className="flex items-center gap-3">
                <div
                  onClick={() => router.push(`/profile/${u.id}`)}
                  className="w-10 h-10 rounded-full bg-[var(--accent)] text-xs font-bold text-white flex-shrink-0 overflow-hidden cursor-pointer hover:opacity-80 relative"
                >
                  {u.profilePicture && <img src={u.profilePicture} alt="" className="absolute inset-0 w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />}
                  <div className="w-full h-full flex items-center justify-center">{u.username?.slice(0, 2).toUpperCase() || '?'}</div>
                </div>
                <div
                  onClick={() => router.push(`/profile/${u.id}`)}
                  className="flex-1 min-w-0 cursor-pointer hover:underline"
                >
                  <div className="text-sm font-semibold text-[var(--text)] truncate">{u.username}</div>
                </div>
                <button
                  onClick={() => u.friendStatus === 'none' ? handleSendRequest(u.id, u.username) : u.friendStatus === 'friends' ? handleUnfriend(u.id, u.username) : null}
                  className={`px-3 py-1.5 rounded-md border-none text-xs font-semibold cursor-pointer whitespace-nowrap transition-colors ${u.friendStatus === 'friends' ? 'bg-[var(--bg3)] text-[var(--text)] hover:bg-red-50 hover:text-red-500' : u.friendStatus === 'sent' ? 'bg-[var(--bg3)] text-[var(--text3)] opacity-60 cursor-not-allowed' : 'bg-[var(--accent)] text-white hover:bg-[var(--accent2)]'}`}
                  disabled={u.friendStatus === 'sent'}
                >
                  {u.friendStatus === 'none' && 'Add Friend'}
                  {u.friendStatus === 'sent' && 'Requested'}
                  {u.friendStatus === 'friends' && 'Friends ✓'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}