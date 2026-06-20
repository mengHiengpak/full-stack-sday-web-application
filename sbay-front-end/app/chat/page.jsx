'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { chatAPI, usersAPI, friendsAPI } from '@/app/lib/api';
import { getSocket } from '@/app/lib/socket';
import { getGroupChats, getGroupById, createGroup, sendGroupMessage, getGroupMessagesById } from '@/app/lib/groupChat';
import { getFriendList } from '@/app/lib/localFriends';
import { generateMockUsers } from '@/app/lib/mockData';
import TopNav from '@/app/components/TopNav';
import Sidebar from '@/app/components/Sidebar';
import BottomNav from '@/app/components/BottomNav';

const EMOJIS = ['😀','😂','😍','🥰','😎','🤔','👍','❤️','🔥','🎉','💯','✅','⭐','🙏','💪','😊','🤗','😢','😡','🤣','🥳','😇','🤩'];

function formatTime(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  const now = new Date();
  const diff = (now - d) / 1000;
  if (diff < 60) return 'now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d`;
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

function formatFullTime(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function ChatPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [msgInput, setMsgInput] = useState('');
  const [loadingChats, setLoadingChats] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [search, setSearch] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  const [showNewChat, setShowNewChat] = useState(false);
  const [userSearch, setUserSearch] = useState('');
  const [userResults, setUserResults] = useState([]);
  const [searchingUsers, setSearchingUsers] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [typingUsers, setTypingUsers] = useState({});
  const [mobileView, setMobileView] = useState('list');
  const [showMobileNewChat, setShowMobileNewChat] = useState(false);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [groupSearch, setGroupSearch] = useState('');
  const [mockUsers, setMockUsers] = useState([]);
  const [showChatMenu, setShowChatMenu] = useState(false);
  const chatMenuRef = useRef(null);
  const fileRef = useRef(null);
  const msgEndRef = useRef(null);
  const msgContainerRef = useRef(null);
  const typingTimerMap = useRef({});
  const socketRef = useRef(null);

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    try {
      const users = generateMockUsers();
      setMockUsers(users);
    } catch {}
  }, []);

  const loadChats = useCallback(async () => {
    try {
      const res = await chatAPI.getAll();
      const apiChats = res.data.data || [];
      const groups = getGroupChats();
      const all = [...groups, ...apiChats];
      all.sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0));
      setChats(all);
    } catch {
      const groups = getGroupChats();
      setChats(groups);
    } finally {
      setLoadingChats(false);
    }
  }, []);

  const openChat = useCallback(async (chat) => {
    setActiveChat(chat);
    setMobileView('messages');
    setShowEmoji(false);
    setLoadingMsgs(true);
    if (chat.isGroup) {
      setMessages(getGroupMessagesById(chat.id));
      setLoadingMsgs(false);
      return;
    }
    try {
      const res = await chatAPI.getMessages(chat.id);
      const msgs = res.data.data || res.data || [];
      setMessages(msgs);
      const unreadIds = msgs.filter((m) => !m.read && m.senderId !== user.id).map((m) => m.id);
      if (unreadIds.length > 0) {
        const s = socketRef.current || getSocket();
        s?.emit('mark_read', { chatId: chat.id, messageIds: unreadIds });
      }
    } catch {
      setMessages([]);
    } finally {
      setLoadingMsgs(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      await loadChats();
      const params = new URLSearchParams(window.location.search);
      const targetUserId = params.get('userId');
      if (targetUserId) {
        try {
          const res = await chatAPI.createOrGet(parseInt(targetUserId));
          const chat = res.data.data || res.data;
          if (chat) openChat(chat);
        } catch {}
      }
    })();
  }, [user, loadChats, openChat]);

  useEffect(() => {
    if (!user) return;
    const s = getSocket();
    if (!s) return;
    socketRef.current = s;

    s.on('connect', () => {
      console.log('Socket connected');
    });

    s.on('new_message', (msg) => {
      setMessages((prev) => {
        if (prev.some((m) => m.id === msg.id)) return prev;
        return [...prev, msg];
      });
      setChats((prev) => {
        const existing = prev.find((c) => c.id === msg.chatId);
        if (!existing) return prev;
        const updated = { ...existing, lastMessage: msg, updatedAt: new Date().toISOString() };
        const others = prev.filter((c) => c.id !== msg.chatId);
        return [updated, ...others];
      });
      if (msg.chatId === activeChat?.id && msg.senderId !== user.id) {
        s.emit('mark_read', { chatId: msg.chatId, messageIds: [msg.id] });
      }
    });

    s.on('typing', (data) => {
      if (data.chatId === activeChat?.id && data.userId !== user.id) {
        setTypingUsers((prev) => ({ ...prev, [data.chatId]: true }));
        clearTimeout(typingTimerMap.current[data.chatId]);
        typingTimerMap.current[data.chatId] = setTimeout(() => {
          setTypingUsers((prev) => ({ ...prev, [data.chatId]: false }));
          delete typingTimerMap.current[data.chatId];
        }, 3000);
      }
    });

    s.on('messages_read', (data) => {
      setMessages((prev) =>
        prev.map((m) =>
          m.chatId === data.chatId && data.messageIds?.includes(m.id)
            ? { ...m, read: true }
            : m
        )
      );
    });

    return () => {
      s.off('new_message');
      s.off('typing');
      s.off('messages_read');
    };
  }, [user, activeChat]);

  useEffect(() => {
    msgEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = useCallback(async () => {
    if (!msgInput.trim() || !activeChat || !user) return;
    const content = msgInput.trim();
    setMsgInput('');
    if (activeChat.isGroup) {
      const newMsg = sendGroupMessage(activeChat.id, user.id, content);
      if (newMsg) {
        setMessages((prev) => (prev.some((m) => m.id === newMsg.id) ? prev : [...prev, newMsg]));
        setChats((prev) => {
          const updated = { ...activeChat, lastMessage: newMsg, updatedAt: newMsg.createdAt };
          const others = prev.filter((c) => c.id !== activeChat.id);
          return [updated, ...others];
        });
      }
      return;
    }
    const s = socketRef.current || getSocket();
    if (s?.connected) {
      s.emit('send_message', { chatId: activeChat.id, content });
    } else {
      try {
        const fd = new FormData();
        fd.append('content', content);
        const res = await chatAPI.sendMessage(activeChat.id, fd);
        const newMsg = res.data.data || res.data;
        if (newMsg) {
          setMessages((prev) => (prev.some((m) => m.id === newMsg.id) ? prev : [...prev, newMsg]));
        }
      } catch {
        // ignore
      }
    }
  }, [msgInput, activeChat, user]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTyping = () => {
    if (!activeChat || !user) return;
    const s = socketRef.current || getSocket();
    s?.emit('typing', { chatId: activeChat.id, userId: user.id });
  };

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !activeChat) return;
    try {
      const fd = new FormData();
      fd.append('media', file);
      if (msgInput.trim()) fd.append('content', msgInput.trim());
      setMsgInput('');
      await chatAPI.sendMessage(activeChat.id, fd);
      const res = await chatAPI.getMessages(activeChat.id);
      setMessages(res.data.data || res.data || []);
    } catch {
      // ignore
    }
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleNewChat = async (targetUser) => {
    try {
      const res = await chatAPI.createOrGet(targetUser.id);
      const chat = res.data.data || res.data;
      setShowNewChat(false);
      setUserSearch('');
      setUserResults([]);
      setShowMobileNewChat(false);
      await loadChats();
      if (chat) openChat(chat);
    } catch {
      // ignore
    }
  };

  const handleDeleteChat = async () => {
    if (!activeChat || activeChat.isGroup) return;
    try {
      await chatAPI.deleteChat(activeChat.id);
      setChats((prev) => prev.filter((c) => c.id !== activeChat.id));
      setActiveChat(null);
      setMessages([]);
      setMobileView('list');
    } catch {
      // ignore
    }
    setShowChatMenu(false);
  };

  const handleBlockUser = async () => {
    const other = otherUser(activeChat);
    if (!other?.id) return;
    try {
      await chatAPI.blockUser(other.id);
      setChats((prev) => prev.filter((c) => c.id !== activeChat.id));
      setActiveChat(null);
      setMessages([]);
      setMobileView('list');
    } catch {
      // ignore
    }
    setShowChatMenu(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (chatMenuRef.current && !chatMenuRef.current.contains(e.target)) {
        setShowChatMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchUsers = useCallback(async (q) => {
    if (q.length < 2) { setUserResults([]); return; }
    setSearchingUsers(true);
    try {
      const res = await usersAPI.search(q);
      setUserResults(res.data.data || []);
    } catch {
      const friends = user ? getFriendList(user.id) : [];
      const ql = q.toLowerCase();
      const matched = friends.filter((f) => f.username?.toLowerCase().includes(ql));
      const fallback = mockUsers.filter((u) =>
        u.username?.toLowerCase().includes(ql) && u.id !== user?.id
      );
      const seen = new Set();
      const results = [];
      for (const f of matched) {
        seen.add(f.userId);
        results.push({ id: f.userId, username: f.username, profilePicture: '' });
      }
      for (const u of fallback) {
        if (!seen.has(u.id)) {
          seen.add(u.id);
          results.push({ id: u.id, username: u.username, profilePicture: u.profilePicture || '' });
        }
      }
      setUserResults(results);
    } finally {
      setSearchingUsers(false);
    }
  }, [mockUsers, user]);

  const loadContacts = useCallback(async () => {
    try {
      const res = await friendsAPI.getList();
      const list = res.data.data || [];
      setContacts(list);
      if (!userSearch.trim()) {
        setUserResults(list);
      }
    } catch {
      const friends = user ? getFriendList(user.id) : [];
      setContacts(friends);
      if (!userSearch.trim()) {
        setUserResults(friends.map((f) => ({ id: f.userId, username: f.username, profilePicture: '' })));
      }
    }
  }, [user]);

  useEffect(() => {
    if (showNewChat) {
      loadContacts();
    }
  }, [showNewChat, loadContacts]);

  useEffect(() => {
    const t = setTimeout(() => searchUsers(userSearch), 300);
    return () => clearTimeout(t);
  }, [userSearch, searchUsers]);

  const addEmoji = (emoji) => {
    setMsgInput((prev) => prev + emoji);
    setShowEmoji(false);
  };

  const renderLastMsg = (chat) => {
    const m = chat.lastMessage;
    if (!m) return 'No messages yet';
    if (typeof m === 'string') return m;
    return m.content || (m.mediaUrl ? '📷 Media' : 'No messages yet');
  };

  const lastMsgTime = (chat) => {
    const m = chat.lastMessage;
    if (!m) return '';
    if (typeof m === 'object' && m.createdAt) return m.createdAt;
    return chat.lastMessageAt || '';
  };

  const filteredChats = chats.filter((c) => {
    if (c.isGroup) {
      return c.name?.toLowerCase().includes(search.toLowerCase());
    }
    const other = c.participants?.find((p) => p.id !== user?.id);
    if (!other) return true;
    return other.username?.toLowerCase().includes(search.toLowerCase());
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  const navigateHome = () => router.push('/');

  const otherUser = (chat) => {
    if (chat?.isGroup) return { username: chat.name, isGroup: true, participants: chat.participants };
    return chat?.participants?.find((p) => p.id !== user.id) || {};
  };
  const isTyping = activeChat && !activeChat.isGroup ? typingUsers[activeChat.id] : false;

  const handleCreateGroup = () => {
    if (!groupName.trim()) return;
    if (selectedMembers.length < 1) return;
    const allMembers = [{ id: user.id, username: user.username || user.email?.split('@')[0] || 'Me', profilePicture: user.profilePicture || '' }, ...selectedMembers];
    const group = createGroup(groupName.trim(), user.id, allMembers);
    setShowCreateGroup(false);
    setGroupName('');
    setSelectedMembers([]);
    setGroupSearch('');
    loadChats();
    if (group) openChat(group);
  };

  const toggleMember = (u) => {
    setSelectedMembers((prev) =>
      prev.some((m) => m.id === u.id) ? prev.filter((m) => m.id !== u.id) : [...prev, u]
    );
  };

  const filteredMockUsers = mockUsers.filter((u) => {
    if (u.id === user?.id) return false;
    if (selectedMembers.some((m) => m.id === u.id)) return true;
    if (!groupSearch.trim()) return true;
    return u.username?.toLowerCase().includes(groupSearch.toLowerCase());
  });

  const CreateGroupModal = ({ mobile }) => (
    <div className={mobile ? 'fixed inset-0 z-[300] bg-[var(--bg2)] flex flex-col' : 'fixed inset-0 z-[300] bg-black/50 flex items-center justify-center'}>
      <div className={mobile ? 'flex flex-col h-full' : 'bg-[var(--bg2)] rounded-2xl w-[420px] max-h-[80vh] flex flex-col shadow-lg'}>
        <div className="flex items-center gap-3 px-4 py-4 border-b border-[var(--border)]">
          <button onClick={() => { setShowCreateGroup(false); setGroupName(''); setSelectedMembers([]); setGroupSearch(''); }} className="w-8 h-8 rounded-full bg-[var(--bg)] flex items-center justify-center text-[var(--text2)] hover:bg-[var(--bg3)]">
            <i className="fa-solid fa-xmark" />
          </button>
          <div className="font-[Sora] font-semibold text-base">Create Group</div>
        </div>
        <div className="px-4 py-3 border-b border-[var(--border)]">
          <div className="flex items-center bg-[var(--bg)] border border-[var(--border)] rounded-xl px-3 gap-2">
            <i className="fa-solid fa-users text-xs text-[var(--text3)]" />
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Group name..."
              className="flex-1 bg-transparent border-none outline-none text-sm text-[var(--text)] py-2"
              autoFocus
            />
          </div>
        </div>
        <div className="px-4 py-2 border-b border-[var(--border)]">
          <div className="flex items-center bg-[var(--bg)] border border-[var(--border)] rounded-full px-3 gap-2">
            <i className="fa-solid fa-magnifying-glass text-xs text-[var(--text3)]" />
            <input
              type="text"
              value={groupSearch}
              onChange={(e) => setGroupSearch(e.target.value)}
              placeholder="Add friends..."
              className="flex-1 bg-transparent border-none outline-none text-sm text-[var(--text)] py-1.5"
            />
            {groupSearch && <button onClick={() => setGroupSearch('')} className="text-[var(--text3)] hover:text-[var(--text)]"><i className="fa-solid fa-xmark" /></button>}
          </div>
          {selectedMembers.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {selectedMembers.map((m) => (
                <span key={m.id} className="inline-flex items-center gap-1 px-2 py-1 bg-[var(--accent)]/10 text-[var(--accent)] text-xs font-semibold rounded-full">
                  {m.username?.slice(0, 2).toUpperCase()}
                  <button onClick={() => toggleMember(m)} className="hover:text-[var(--accent2)]"><i className="fa-solid fa-xmark" /></button>
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="flex-1 overflow-y-auto px-2 pb-4">
          {filteredMockUsers.length === 0 ? (
            <div className="text-center py-8 text-sm text-[var(--text3)]">No users found</div>
          ) : (
            filteredMockUsers.slice(0, 50).map((u) => {
              const selected = selectedMembers.some((m) => m.id === u.id);
              return (
                <div
                  key={u.id}
                  onClick={() => toggleMember(u)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${
                    selected ? 'bg-[var(--accent)]/5' : 'hover:bg-[var(--bg3)]'
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#c084fc] to-[#a855f7] flex items-center justify-center font-bold text-sm text-white flex-shrink-0">
                    {u.username?.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-[var(--text)]">{u.username}</div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                    selected ? 'bg-[var(--accent)] border-[var(--accent)] text-white' : 'border-[var(--text3)]'
                  }`}>
                    {selected && <i className="fa-solid fa-check text-[8px]" />}
                  </div>
                </div>
              );
            })
          )}
        </div>
        <div className="px-4 py-3 border-t border-[var(--border)]">
          <button
            onClick={handleCreateGroup}
            disabled={!groupName.trim() || selectedMembers.length < 1}
            className="w-full py-2.5 bg-[var(--accent)] text-white text-sm font-bold rounded-xl hover:bg-[var(--accent2)] disabled:opacity-40 transition-all flex items-center justify-center gap-2"
          >
            <i className="fa-solid fa-users" /> Create Group ({selectedMembers.length + 1} members)
          </button>
        </div>
      </div>
    </div>
  );

  const NewChatModal = ({ mobile }) => (
    <div className={mobile ? 'fixed inset-0 z-[300] bg-[var(--bg2)] flex flex-col' : 'fixed inset-0 z-[300] bg-black/50 flex items-center justify-center'}>
      <div className={mobile ? 'flex flex-col h-full' : 'bg-[var(--bg2)] rounded-2xl w-[420px] max-h-[80vh] flex flex-col shadow-lg'}>
        <div className="flex items-center gap-3 px-4 py-4 border-b border-[var(--border)]">
          <button onClick={() => { setShowNewChat(false); setShowMobileNewChat(false); setUserSearch(''); setUserResults([]); }} className="w-8 h-8 rounded-full bg-[var(--bg)] flex items-center justify-center text-[var(--text2)] hover:bg-[var(--bg3)]">
            <i className="fa-solid fa-xmark" />
          </button>
          <div className="font-[Sora] font-semibold text-base">New Chat</div>
        </div>
        <div className="px-4 py-3">
          <div className="flex items-center bg-[var(--bg)] border border-[var(--border)] rounded-full px-3 gap-2">
            <i className="fa-solid fa-magnifying-glass text-xs text-[var(--text3)]" />
            <input
              type="text"
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              placeholder="Search users..."
              className="flex-1 bg-transparent border-none outline-none text-sm text-[var(--text)] py-2"
              autoFocus
            />
            {userSearch && <button onClick={() => { setUserSearch(''); setUserResults([]); }} className="text-[var(--text3)] hover:text-[var(--text)]"><i className="fa-solid fa-xmark" /></button>}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-2 pb-4">
          {searchingUsers && (
            <div className="flex items-center justify-center py-8 text-sm text-[var(--text3)]">
              <div className="w-5 h-5 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin mr-2" />
              Searching...
            </div>
          )}
          {!searchingUsers && userSearch.length >= 2 && userResults.length === 0 && (
            <div className="text-center py-8 text-sm text-[var(--text3)]">No users found</div>
          )}
          {!searchingUsers && userSearch.length < 2 && contacts.length > 0 && (
            <div className="px-3 pt-2 pb-1">
              <div className="text-xs font-semibold text-[var(--text3)] uppercase tracking-wider">Your Friends</div>
            </div>
          )}
          {!searchingUsers && userSearch.length < 2 && contacts.length === 0 && (
            <div className="text-center py-8 text-sm text-[var(--text3)]">Type at least 2 characters to search</div>
          )}
          {(userSearch.length < 2 ? contacts : userResults).map((u) => {
            const isFriend = contacts.some((c) => c.userId === u.id || c.id === u.id);
            const isFriendSearch = userSearch.length >= 2 && isFriend;
            return (
              <div
                key={u.id}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[var(--bg3)] cursor-pointer transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#c084fc] to-[#a855f7] flex items-center justify-center font-bold text-sm text-white flex-shrink-0">
                  {u.username?.slice(0, 2).toUpperCase() || '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-[var(--text)] truncate">{u.username}</div>
                  <div className="text-xs text-[var(--text3)]">
                    {isFriend ? 'Friend' : '@' + (u.username || 'user')}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {(isFriend || userSearch.length >= 2) && (
                    <button
                      onClick={() => handleNewChat(u)}
                      className="w-8 h-8 rounded-full bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)] hover:bg-[var(--accent)] hover:text-white transition-colors"
                      title="Send Message"
                    >
                      <i className="fa-solid fa-message text-xs" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <TopNav />
      <div className="flex pt-[56px] min-h-[calc(100vh-56px)]">
        <Sidebar onViewChange={navigateHome} />
        <div className="flex-1 ml-[260px] min-h-[calc(100vh-56px)] bg-[var(--bg)] max-[780px]:ml-0 max-[780px]:mb-[56px]">
          <div className="flex h-[calc(100vh-56px)] bg-[var(--bg2)] max-w-[1100px] mx-auto border-x border-[var(--border)]">
            {/* Chat List Panel */}
            <div className={`w-[320px] border-r border-[var(--border)] flex flex-col bg-[var(--bg2)] ${mobileView === 'messages' ? 'max-[780px]:!hidden' : ''}`}>
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
                <div className="font-[Sora] font-bold text-lg">Chats</div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setShowCreateGroup(true)}
                    className="w-8 h-8 rounded-full bg-[var(--bg)] flex items-center justify-center text-[var(--text2)] hover:bg-[var(--bg3)] hover:text-[var(--accent)] transition-colors"
                    title="Create Group"
                  >
                    <i className="fa-solid fa-users-gear text-xs" />
                  </button>
                  <button
                    onClick={() => setShowNewChat(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--accent)] text-white text-sm font-semibold hover:bg-[var(--accent2)] transition-colors"
                  >
                    <i className="fa-solid fa-plus text-xs" />
                    <span className="max-[400px]:hidden">New Chat</span>
                  </button>
                </div>
              </div>
              {/* Search */}
              <div className="px-3 py-2.5">
                <div className="flex items-center bg-[var(--bg)] border border-[var(--border)] rounded-full px-3 gap-2">
                  <i className="fa-solid fa-magnifying-glass text-xs text-[var(--text3)]" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search chats..."
                    className="flex-1 bg-transparent border-none outline-none text-sm text-[var(--text)] py-1.5"
                  />
                  {search && <button onClick={() => setSearch('')} className="text-[var(--text3)] hover:text-[var(--text)]"><i className="fa-solid fa-xmark" /></button>}
                </div>
              </div>
              {/* Chat List */}
              <div className="flex-1 overflow-y-auto">
                {loadingChats ? (
                  <div className="space-y-2 px-3 py-4">
                    {[1,2,3,4,5].map((i) => (
                      <div key={i} className="flex items-center gap-3 p-2">
                        <div className="w-12 h-12 rounded-full bg-[var(--bg3)] flex-shrink-0" />
                        <div className="flex-1 space-y-2">
                          <div className="h-3 w-24 rounded bg-[var(--bg3)]" />
                          <div className="h-2.5 w-40 rounded bg-[var(--bg3)]" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : filteredChats.length === 0 ? (
                  <div className="text-center py-16 px-4">
                    <div className="w-16 h-16 rounded-full bg-[var(--bg)] flex items-center justify-center mx-auto mb-3">
                      <i className="fa-solid fa-comment-dots text-2xl text-[var(--text3)]" />
                    </div>
                    <div className="font-semibold text-[var(--text)] mb-1">No chats yet</div>
                    <div className="text-sm text-[var(--text3)]">Start a conversation by clicking "New Chat"</div>
                  </div>
                ) : (
                  filteredChats.map((chat) => {
                    const other = otherUser(chat);
                    const isActive = activeChat?.id === chat.id;
                    const lm = chat.lastMessage;
                    const isLmObj = typeof lm === 'object' && lm !== null;
                    const isGroup = chat.isGroup;
                    return (
                      <div
                        key={chat.id}
                        onClick={() => openChat(chat)}
                        className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors ${
                          isActive ? 'bg-[var(--bg3)]' : 'hover:bg-[var(--bg3)]'
                        }`}
                      >
                        <div className="relative flex-shrink-0">
                          <div className={`w-12 h-12 ${isGroup ? 'rounded-[14px]' : 'rounded-full'} bg-gradient-to-br from-[#c084fc] to-[#a855f7] flex items-center justify-center font-bold text-sm text-white`}>
                            {isGroup ? <i className="fa-solid fa-users text-base" /> : (other.username?.slice(0, 2).toUpperCase() || '?')}
                          </div>
                          {!isGroup && <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-[var(--online)] border-2 border-[var(--bg2)]" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <div className="font-semibold text-sm text-[var(--text)] truncate">
                              {isGroup ? other.username : (other.username || 'Unknown')}
                              {isGroup && <span className="text-[10px] text-[var(--text3)] ml-1.5">{chat.participants?.length || 0} members</span>}
                            </div>
                            <div className="text-[11px] text-[var(--text3)] flex-shrink-0 ml-2">{formatTime(isLmObj ? lm.createdAt : chat.lastMessageAt)}</div>
                          </div>
                          <div className="flex items-center gap-1">
                            {isLmObj && lm.senderId === user.id && (
                              <i className={`fa-solid fa-check text-[10px] ${lm.read ? 'text-[var(--accent)]' : 'text-[var(--text3)]'}`} />
                            )}
                            {isLmObj && isGroup && lm.senderId !== user.id && (
                              <span className="text-[10px] text-[var(--text3)] font-medium mr-0.5">{lm.senderName}: </span>
                            )}
                            <div className="text-sm text-[var(--text2)] truncate">
                              {isLmObj ? (lm.content || (lm.mediaUrl ? '📷 Media' : '') ) : (renderLastMsg(chat))}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Messages Panel */}
            <div className={`flex-1 flex flex-col bg-[var(--bg2)] ${mobileView === 'list' ? 'max-[780px]:!hidden' : ''}`}>
              {!activeChat ? (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center px-6">
                    <div className="w-20 h-20 rounded-full bg-[var(--bg)] flex items-center justify-center mx-auto mb-4">
                      <i className="fa-solid fa-comment-dots text-3xl text-[var(--text3)]" />
                    </div>
                    <div className="text-lg font-semibold text-[var(--text)] mb-1">Your Messages</div>
                    <div className="text-sm text-[var(--text3)]">Select a chat to start messaging</div>
                  </div>
                </div>
              ) : (
                <>
                  {/* Messages Header */}
                  <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--border)] bg-[var(--bg2)]">
                    <button
                      onClick={() => setMobileView('list')}
                      className="hidden max-[780px]:flex w-8 h-8 rounded-full bg-[var(--bg)] items-center justify-center text-[var(--text2)] hover:bg-[var(--bg3)] flex-shrink-0"
                    >
                      <i className="fa-solid fa-chevron-left text-sm" />
                    </button>
                    <div className={`w-10 h-10 ${activeChat.isGroup ? 'rounded-[12px]' : 'rounded-full'} bg-gradient-to-br from-[#c084fc] to-[#a855f7] flex items-center justify-center font-bold text-sm text-white flex-shrink-0`}>
                      {activeChat.isGroup ? <i className="fa-solid fa-users text-sm" /> : (otherUser(activeChat).username?.slice(0, 2).toUpperCase() || '?')}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-sm text-[var(--text)]">
                        {activeChat.isGroup ? activeChat.name : (otherUser(activeChat).username || 'Unknown')}
                      </div>
                      <div className="text-xs text-[var(--text3)]">
                        {activeChat.isGroup ? (
                          <span>{activeChat.participants?.length || 0} members</span>
                        ) : (
                          isTyping ? <span className="text-[var(--accent)]">typing...</span> : 'Active now'
                        )}
                      </div>
                    </div>
                    {!activeChat.isGroup && (
                      <div className="relative" ref={chatMenuRef}>
                        <button
                          onClick={() => setShowChatMenu(!showChatMenu)}
                          className="w-8 h-8 rounded-full bg-[var(--bg)] flex items-center justify-center text-[var(--text2)] hover:bg-[var(--bg3)] hover:text-[var(--accent)] transition-colors"
                        >
                          <i className="fa-solid fa-ellipsis-vertical text-sm" />
                        </button>
                        {showChatMenu && (
                          <div className="absolute right-0 top-full mt-1 w-44 bg-[var(--bg2)] border border-[var(--border)] rounded-xl shadow-lg z-50 py-1 overflow-hidden">
                            <button
                              onClick={handleDeleteChat}
                              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--text)] hover:bg-[var(--bg3)] transition-colors text-left"
                            >
                              <i className="fa-regular fa-trash-can text-[var(--text3)]" />
                              Delete Chat
                            </button>
                            <button
                              onClick={handleBlockUser}
                              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-[var(--bg3)] transition-colors text-left"
                            >
                              <i className="fa-solid fa-ban" />
                              Block User
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  {/* Messages Area */}
                  <div ref={msgContainerRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-1.5 bg-[var(--bg)]">
                    {loadingMsgs ? (
                      <div className="space-y-3 py-4">
                        {[1,2,3,4].map((i) => (
                          <div key={i} className={`flex items-end gap-2 ${i % 2 === 0 ? 'flex-row-reverse' : ''}`}>
                            <div className={`${i % 2 === 0 ? 'bg-[var(--accent)]' : 'bg-[var(--card)]'} rounded-2xl p-3 max-w-[60%]`}>
                              <div className={`h-3 ${i % 2 === 0 ? 'w-32' : 'w-24'} rounded ${i % 2 === 0 ? 'bg-white/30' : 'bg-[var(--bg3)]'}`} />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : messages.length === 0 ? (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                          <div className="text-sm text-[var(--text3)]">No messages yet</div>
                          <div className="text-xs text-[var(--text3)] mt-1">Send a message to start the conversation</div>
                        </div>
                      </div>
                    ) : (
                      messages.map((msg) => {
                        const isMine = msg.senderId === user.id;
                        const showSender = activeChat.isGroup && !isMine;
                        const avatarLetter = showSender ? (msg.senderName?.slice(0, 2).toUpperCase() || '?') : '';
                        return (
                          <div key={msg.id} className={`flex items-end gap-2 ${isMine ? 'flex-row-reverse' : ''}`}>
                            {!isMine && (
                              <div className={`${showSender ? 'w-7 h-7' : 'w-7 h-7'} rounded-full bg-[var(--accent)] flex items-center justify-center font-bold text-[10px] text-white flex-shrink-0 self-end`}>
                                {avatarLetter}
                              </div>
                            )}
                            <div className={`max-w-[70%] ${isMine ? 'items-end' : 'items-start'} flex flex-col`}>
                              {showSender && (
                                <div className="text-[10px] text-[var(--text3)] font-medium mb-0.5 ml-1">{msg.senderName}</div>
                              )}
                              <div className={`px-3 py-2 rounded-2xl text-sm leading-relaxed break-words ${
                                isMine
                                  ? 'bg-[var(--accent)] text-white rounded-br-md'
                                  : 'bg-[var(--card)] text-[var(--text)] rounded-bl-md border border-[var(--border)]'
                              }`}>
                                {msg.mediaUrl && (
                                  <div className="mb-1.5">
                                    {msg.mediaUrl.match(/\.(mp4|webm|ogg)/i) ? (
                                      <video src={msg.mediaUrl} controls className="max-w-full rounded-lg max-h-48" />
                                    ) : (
                                      <img src={msg.mediaUrl} alt="Media" className="max-w-full rounded-lg max-h-64" />
                                    )}
                                  </div>
                                )}
                                {msg.content && <div>{msg.content}</div>}
                              </div>
                              <div className={`flex items-center gap-1 mt-0.5 ${isMine ? 'justify-end' : 'justify-start'}`}>
                                <span className="text-[10px] text-[var(--text3)]">{formatFullTime(msg.createdAt)}</span>
                                {isMine && (
                                  <i className={`fa-solid fa-check text-[10px] ${msg.read ? 'text-[var(--accent)]' : 'text-[var(--text3)]'}`} />
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                    {isTyping && (
                      <div className="flex items-end gap-2">
                        <div className="w-7 h-7 rounded-full bg-[var(--accent)] flex items-center justify-center font-bold text-[10px] text-white flex-shrink-0">
                          {otherUser(activeChat).username?.slice(0, 2).toUpperCase() || '?'}
                        </div>
                        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl rounded-bl-md px-3 py-2">
                          <div className="flex items-center gap-1">
                            <span className="w-2 h-2 bg-[var(--text3)] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <span className="w-2 h-2 bg-[var(--text3)] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <span className="w-2 h-2 bg-[var(--text3)] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={msgEndRef} />
                  </div>
                  {/* Chat Input */}
                  <div className="border-t border-[var(--border)] bg-[var(--bg2)] px-4 py-3">
                    {showEmoji && (
                      <div className="flex flex-wrap gap-1.5 mb-2 pb-2 border-b border-[var(--border)]">
                        {EMOJIS.map((emoji) => (
                          <button
                            key={emoji}
                            onClick={() => addEmoji(emoji)}
                            className="w-8 h-8 flex items-center justify-center text-lg hover:bg-[var(--bg3)] rounded-lg transition-colors"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setShowEmoji(!showEmoji)}
                        className="w-9 h-9 rounded-full bg-[var(--bg)] flex items-center justify-center text-[var(--text2)] hover:bg-[var(--bg3)] hover:text-[var(--accent)] flex-shrink-0 transition-colors"
                      >
                        <i className="fa-regular fa-face-smile" />
                      </button>
                      <button
                        onClick={() => fileRef.current?.click()}
                        className="w-9 h-9 rounded-full bg-[var(--bg)] flex items-center justify-center text-[var(--text2)] hover:bg-[var(--bg3)] hover:text-[var(--accent)] flex-shrink-0 transition-colors"
                      >
                        <i className="fa-solid fa-paperclip" />
                      </button>
                      <input
                        ref={fileRef}
                        type="file"
                        accept="image/*,video/*"
                        className="hidden"
                        onChange={handleFile}
                      />
                      <div className="flex-1 flex items-center bg-[var(--bg)] border border-[var(--border)] rounded-full px-3 gap-2">
                        <input
                          type="text"
                          value={msgInput}
                          onChange={(e) => { setMsgInput(e.target.value); handleTyping(); }}
                          onKeyDown={handleKeyDown}
                          placeholder="Type a message..."
                          className="flex-1 bg-transparent border-none outline-none text-sm text-[var(--text)] py-2"
                        />
                      </div>
                      <button
                        onClick={handleSend}
                        disabled={!msgInput.trim()}
                        className="w-9 h-9 rounded-full bg-[var(--accent)] flex items-center justify-center text-white disabled:opacity-40 hover:bg-[var(--accent2)] flex-shrink-0 transition-colors"
                      >
                        <i className="fa-solid fa-paper-plane text-sm" />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <BottomNav onViewChange={navigateHome} />

      {/* Create Group Modal */}
      {showCreateGroup && <CreateGroupModal />}

      {/* New Chat Modal */}
      {showNewChat && <NewChatModal />}
      {showMobileNewChat && <NewChatModal mobile />}
    </>
  );
}
