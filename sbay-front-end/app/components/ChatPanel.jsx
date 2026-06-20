'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { chatAPI, usersAPI } from '@/app/lib/api';
import { getSocket, disconnectSocket } from '@/app/lib/socket';

const EMOJIS = ['😀','😂','😍','🥰','😎','🤔','👍','❤️','🔥','🎉','💯','✅','⭐','🙏','💪','😊','🤗','😢','😡','🤣'];

export default function ChatPanel({ open, onClose }) {
  const { user } = useAuth();
  const router = useRouter();
  const [view, setView] = useState('list');
  const [currentDM, setCurrentDM] = useState(null);
  const [msgInput, setMsgInput] = useState('');
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [typingUsers, setTypingUsers] = useState({});
  const msgEndRef = useRef(null);
  const socketRef = useRef(null);
  const typingTimerRef = useRef({});

  useEffect(() => {
    if (open && user) {
      loadChats();
      const s = getSocket();
      if (s) {
        socketRef.current = s;
        s.on('new_message', handleNewMessage);
        s.on('typing', handleTyping);
      }
    }
    return () => {
      const s = socketRef.current;
      if (s) {
        s.off('new_message', handleNewMessage);
        s.off('typing', handleTyping);
      }
    };
  }, [open, user, currentDM]);

  useEffect(() => {
    msgEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleNewMessage = useCallback((msg) => {
    setMessages((prev) => {
      if (prev.some((m) => m.id === msg.id)) return prev;
      return [...prev, msg];
    });
    loadChats();
  }, []);

  const handleTyping = useCallback((data) => {
    if (data.chatId === currentDM?.id && data.userId !== user?.id) {
      setTypingUsers((prev) => ({ ...prev, [data.chatId]: true }));
      clearTimeout(typingTimerRef.current[data.chatId]);
      typingTimerRef.current[data.chatId] = setTimeout(() => {
        setTypingUsers((prev) => ({ ...prev, [data.chatId]: false }));
      }, 3000);
    }
  }, [currentDM, user]);

  const loadChats = async () => {
    try {
      const res = await chatAPI.getAll();
      setChats(res.data.data || []);
    } catch {} finally {
      setLoading(false);
    }
  };

  const openChat = async (chat) => {
    setCurrentDM(chat);
    setView('messages');
    setShowEmoji(false);
    setLoadingMsgs(true);
    try {
      const res = await chatAPI.getMessages(chat.id);
      setMessages(res.data.data || res.data || []);
    } catch {
      setMessages([]);
    } finally {
      setLoadingMsgs(false);
    }
  };

  const handleSend = async () => {
    const content = msgInput.trim();
    if (!content || !currentDM) return;
    setMsgInput('');
    const s = socketRef.current || getSocket();
    if (s?.connected) {
      s.emit('send_message', { chatId: currentDM.id, content });
    } else {
      try {
        const fd = new FormData();
        fd.append('content', content);
        const res = await chatAPI.sendMessage(currentDM.id, fd);
        const newMsg = res.data.data || res.data;
        if (newMsg) {
          setMessages((prev) => (prev.some((m) => m.id === newMsg.id) ? prev : [...prev, newMsg]));
          loadChats();
        }
      } catch {}
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTypingEmit = () => {
    if (!currentDM || !user) return;
    const s = socketRef.current || getSocket();
    s?.emit('typing', { chatId: currentDM.id, userId: user.id });
  };

  const searchUsers = async (q) => {
    if (q.length < 2) { setSearchResults([]); return; }
    setSearching(true);
    try {
      const res = await usersAPI.search(q);
      setSearchResults(res.data.data || []);
    } catch {
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  const startNewChat = async (targetUser) => {
    try {
      const res = await chatAPI.createOrGet(targetUser.id);
      const chat = res.data.data || res.data;
      setShowSearch(false);
      setSearchQuery('');
      setSearchResults([]);
      await loadChats();
      if (chat) openChat(chat);
    } catch {}
  };

  const otherUser = (chat) => chat?.participants?.find((p) => p.id !== user?.id) || {};

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-sm flex items-center justify-center animate-[fadeIn_.2s]" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="w-[420px] h-[600px] max-h-[90vh] max-w-[95vw] bg-[var(--bg2)] border border-[var(--border)] rounded-2xl flex flex-col shadow-[0_30px_80px_rgba(0,0,0,.5)] animate-[slideUp_.3s_ease]" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 px-[18px] py-4 border-b border-[var(--border)]">
          <div className="font-[Sora] text-base font-bold flex-1">
            <i className="fa-solid fa-message text-[var(--accent)] mr-2.5" />
            {view === 'list' ? 'Messages' : otherUser(currentDM).username || 'Chat'}
          </div>
          {view === 'messages' && (
            <button onClick={() => { setView('list'); setCurrentDM(null); setShowEmoji(false); }} className="w-[34px] h-[34px] rounded-full bg-[var(--card)] border-none text-[var(--text2)] cursor-pointer flex items-center justify-center text-sm hover:bg-[var(--card2)] hover:text-[var(--text)] transition-all">
              <i className="fa-solid fa-arrow-left" />
            </button>
          )}
          <button onClick={onClose} className="w-[34px] h-[34px] rounded-full bg-[var(--card)] border-none text-[var(--text2)] cursor-pointer flex items-center justify-center text-base hover:bg-[var(--card2)] hover:text-[var(--text)] transition-all">
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        {view === 'list' && (
          <>
            <div className="flex items-center gap-2 px-[18px] py-2.5 border-b border-[var(--border)]">
              <button onClick={() => { setShowSearch(!showSearch); setSearchQuery(''); setSearchResults([]); }} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--accent)] text-white text-xs font-semibold hover:bg-[var(--accent2)] transition-colors">
                <i className="fa-solid fa-plus text-xs" /> New Chat
              </button>
              <button onClick={() => router.push('/chat')} className="ml-auto text-xs text-[var(--accent)] hover:underline bg-transparent border-none cursor-pointer">
                Open full chat <i className="fa-solid fa-arrow-up-right-from-square text-[10px] ml-1" />
              </button>
            </div>

            {showSearch && (
              <div className="px-[18px] py-3 border-b border-[var(--border)]">
                <div className="flex items-center bg-[var(--bg)] border border-[var(--border)] rounded-full px-3 gap-2">
                  <i className="fa-solid fa-magnifying-glass text-xs text-[var(--text3)]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); searchUsers(e.target.value); }}
                    placeholder="Search users..."
                    className="flex-1 bg-transparent border-none outline-none text-sm text-[var(--text)] py-2"
                    autoFocus
                  />
                  {searchQuery && <button onClick={() => { setSearchQuery(''); setSearchResults([]); }} className="text-[var(--text3)]"><i className="fa-solid fa-xmark" /></button>}
                </div>
                <div className="mt-2 max-h-40 overflow-y-auto">
                  {searching && <div className="text-center text-xs text-[var(--text3)] py-2">Searching...</div>}
                  {!searching && searchQuery.length >= 2 && searchResults.length === 0 && <div className="text-center text-xs text-[var(--text3)] py-2">No users found</div>}
                  {searchResults.map((u) => (
                    <div key={u.id} onClick={() => startNewChat(u)} className="flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-[var(--bg3)] cursor-pointer transition-colors">
                      <div className="w-8 h-8 rounded-full bg-[var(--accent)] flex items-center justify-center font-bold text-xs text-white flex-shrink-0">
                        {u.username?.slice(0, 2).toUpperCase()}
                      </div>
                      <span className="text-sm text-[var(--text)]">{u.username}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="space-y-2 px-[18px] py-4">
                  {[1,2,3].map((i) => (
                    <div key={i} className="flex items-center gap-3 p-2">
                      <div className="w-10 h-10 rounded-full bg-[var(--bg3)] flex-shrink-0" />
                      <div className="flex-1 space-y-1.5">
                        <div className="h-3 w-20 rounded bg-[var(--bg3)]" />
                        <div className="h-2.5 w-32 rounded bg-[var(--bg3)]" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : chats.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center px-6">
                    <div className="w-12 h-12 rounded-full bg-[var(--card)] flex items-center justify-center mx-auto mb-3">
                      <i className="fa-solid fa-comment-dots text-xl text-[var(--text3)]" />
                    </div>
                    <div className="text-[var(--text)] font-semibold mb-1 text-sm">No messages yet</div>
                    <div className="text-xs text-[var(--text3)]">Follow people and they will appear here</div>
                  </div>
                </div>
              ) : (
                chats.map((chat) => {
                  const other = otherUser(chat);
                  const lastMsg = chat.lastMessage;
                  return (
                    <div
                      key={chat.id}
                      onClick={() => openChat(chat)}
                      className="flex items-center gap-3 px-[18px] py-2.5 cursor-pointer hover:bg-[var(--bg3)] transition-colors"
                    >
                      <div className="w-10 h-10 rounded-full bg-[var(--accent)] flex items-center justify-center font-bold text-sm text-white flex-shrink-0">
                        {other.username?.slice(0, 2).toUpperCase() || '?'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-[var(--text)] truncate">{other.username || 'Unknown'}</div>
                        <div className="text-xs text-[var(--text3)] truncate">{typeof lastMsg === 'string' ? lastMsg : (lastMsg?.content || (lastMsg?.mediaUrl ? '📷 Media' : ''))}</div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </>
        )}

        {view === 'messages' && currentDM && (
          <>
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-1.5 bg-[var(--bg)]">
              {loadingMsgs ? (
                <div className="space-y-3 py-4">
                  {[1,2,3].map((i) => (
                    <div key={i} className={`flex items-end gap-2 ${i % 2 === 0 ? 'flex-row-reverse' : ''}`}>
                      <div className={`${i % 2 === 0 ? 'bg-[var(--accent)]' : 'bg-[var(--card)]'} rounded-2xl p-3 max-w-[60%]`}>
                        <div className={`h-3 ${i % 2 === 0 ? 'w-24' : 'w-20'} rounded ${i % 2 === 0 ? 'bg-white/30' : 'bg-[var(--bg3)]'}`} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center text-sm text-[var(--text3)]">Send a message to start the conversation</div>
                </div>
              ) : (
                messages.map((msg) => {
                  const isMine = msg.senderId === user?.id;
                  return (
                    <div key={msg.id} className={`flex items-end gap-2 ${isMine ? 'flex-row-reverse' : ''}`}>
                      <div className={`max-w-[70%] px-3 py-2 rounded-2xl text-sm leading-relaxed break-words ${
                        isMine ? 'bg-[var(--accent)] text-white rounded-br-md' : 'bg-[var(--card)] text-[var(--text)] rounded-bl-md border border-[var(--border)]'
                      }`}>
                        {msg.mediaUrl && (
                          <div className="mb-1">
                            {msg.mediaUrl.match(/\.(mp4|webm|ogg)/i) ? (
                              <video src={msg.mediaUrl} controls className="max-w-full rounded-lg max-h-32" />
                            ) : (
                              <img src={msg.mediaUrl} alt="" className="max-w-full rounded-lg max-h-32" />
                            )}
                          </div>
                        )}
                        {msg.content && <div>{msg.content}</div>}
                      </div>
                    </div>
                  );
                })
              )}
              {typingUsers[currentDM.id] && (
                <div className="text-xs text-[var(--text3)] italic">typing...</div>
              )}
              <div ref={msgEndRef} />
            </div>

            <div className="border-t border-[var(--border)] px-4 py-3">
              {showEmoji && (
                <div className="flex flex-wrap gap-1 mb-2 pb-2 border-b border-[var(--border)]">
                  {EMOJIS.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => { setMsgInput((p) => p + emoji); setShowEmoji(false); }}
                      className="w-7 h-7 flex items-center justify-center text-base hover:bg-[var(--bg3)] rounded-lg"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}
              <div className="flex items-center gap-2">
                <button onClick={() => setShowEmoji(!showEmoji)} className="w-8 h-8 rounded-full bg-[var(--bg)] flex items-center justify-center text-[var(--text2)] hover:bg-[var(--bg3)] flex-shrink-0">
                  <i className="fa-regular fa-face-smile text-sm" />
                </button>
                <div className="flex-1 flex items-center bg-[var(--bg)] border border-[var(--border)] rounded-full px-3 gap-2">
                  <input
                    type="text"
                    value={msgInput}
                    onChange={(e) => { setMsgInput(e.target.value); handleTypingEmit(); }}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a message..."
                    className="flex-1 bg-transparent border-none outline-none text-sm text-[var(--text)] py-1.5"
                  />
                </div>
                <button onClick={handleSend} disabled={!msgInput.trim()} className="w-8 h-8 rounded-full bg-[var(--accent)] flex items-center justify-center text-white disabled:opacity-40 hover:bg-[var(--accent2)] flex-shrink-0">
                  <i className="fa-solid fa-paper-plane text-xs" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
