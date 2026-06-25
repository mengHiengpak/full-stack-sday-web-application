'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { reactionsAPI, storyCommentsAPI, chatAPI } from '@/app/lib/api';

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

const storyEmojiMap = { '❤️': 'love', '👍': 'like', '😂': 'haha', '😮': 'wow', '😢': 'sad', '🔥': 'fire' };

export default function StoryViewer({ stories, startIndex, onClose, toast }) {
  const { user } = useAuth();
  const router = useRouter();
  const [idx, setIdx] = useState(startIndex || 0);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [reactions, setReactions] = useState([]);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [myReaction, setMyReaction] = useState('');
  const [flyEmojis, setFlyEmojis] = useState([]);
  const [transitioning, setTransitioning] = useState(false);
  const [showReactionsPopup, setShowReactionsPopup] = useState(false);
  const [mediaError, setMediaError] = useState(false);
  const [pfpError, setPfpError] = useState(false);
  const animRef = useRef(null);
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);
  const longPressRef = useRef(null);
  const flyIdRef = useRef(0);
  const story = stories[idx];

  const loadReactions = useCallback(async () => {
    if (!story?.id) return;
    try {
      const res = await reactionsAPI.getStory(story.id);
      setReactions(res.data.data || []);
      const mine = res.data.data.find(r => r.userId === user?.id);
      setMyReaction(mine ? Object.keys(storyEmojiMap).find(k => storyEmojiMap[k] === mine.type) || '' : '');
    } catch {}
  }, [story?.id, user?.id]);

  const loadComments = useCallback(async () => {
    if (!story?.id) return;
    try {
      const res = await storyCommentsAPI.get(story.id);
      setComments(res.data.data || []);
    } catch {}
  }, [story?.id]);

  useEffect(() => {
    loadReactions();
    loadComments();
    setProgress(0);
    setPaused(false);
    setTransitioning(false);
    setMediaError(false);
    setPfpError(false);
  }, [idx, loadReactions, loadComments]);

  useEffect(() => {
    if (!story || paused || transitioning) return;
    const DURATION = 7000;
    const STEP = 50;
    const increment = (STEP / DURATION) * 100;
    animRef.current = setInterval(() => {
      setProgress(prev => {
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(animRef.current);
          goNext();
          return 100;
        }
        return next;
      });
    }, STEP);
    return () => clearInterval(animRef.current);
  }, [story, idx, paused, transitioning]);

  const goNext = useCallback(() => {
    if (transitioning) return;
    if (idx < stories.length - 1) {
      setTransitioning(true);
      setTimeout(() => setIdx(idx + 1), 200);
    } else {
      onClose();
    }
  }, [idx, stories.length, onClose, transitioning]);

  const goPrev = useCallback(() => {
    if (transitioning || idx === 0) return;
    setTransitioning(true);
    setTimeout(() => setIdx(idx - 1), 200);
  }, [idx, transitioning]);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' || e.key === ' ') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose, goNext, goPrev]);

  const handleMouseDown = () => {
    setPaused(true);
    longPressRef.current = setTimeout(() => {}, 300);
  };
  const handleMouseUp = () => {
    setPaused(false);
    clearTimeout(longPressRef.current);
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    setPaused(true);
  };

  const handleTouchEnd = (e) => {
    setPaused(false);
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
      if (dx < 0) goNext();
      else goPrev();
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  const spawnFlying = (emoji, count = 5, isHeart = false) => {
    const items = [];
    const c = isHeart ? Math.floor(count * 1.5) : count;
    for (let i = 0; i < c; i++) {
      const id = ++flyIdRef.current;
      items.push({
        id,
        emoji,
        x: (Math.random() - 0.5) * (isHeart ? 200 : 120),
        delay: Math.random() * (isHeart ? 0.25 : 0.15),
        size: isHeart ? 2 + Math.random() * 1.5 : 1.2 + Math.random() * 0.8,
        drift: (Math.random() - 0.5) * (isHeart ? 100 : 60),
        isHeart,
      });
    }
    setFlyEmojis(prev => [...prev, ...items]);
    setTimeout(() => {
      setFlyEmojis(prev => prev.filter(f => !items.find(i => i.id === f.id)));
    }, 1500);
  };

  const handleReact = async (emoji) => {
    if (!story?.id) return;
    const apiType = storyEmojiMap[emoji] || 'like';
    const wasActive = myReaction === emoji;
    if (wasActive) {
      setMyReaction('');
      setReactions(prev => prev.filter(r => !(r.userId === user?.id && r.type === apiType)));
    } else {
      setMyReaction(emoji);
      if (emoji === '❤️') spawnFlying(emoji, 6, true);
      setReactions(prev => [
        ...prev.filter(r => r.userId !== user?.id),
        { userId: user?.id, type: apiType, id: -Date.now(), user: { id: user?.id, username: user?.username } },
      ]);
    }
    try {
      await reactionsAPI.toggleStory(story.id, apiType);
      loadReactions();
    } catch {
      loadReactions();
    }
  };

  const handleComment = async () => {
    if (!commentText.trim() || !story?.id) return;
    try {
      await storyCommentsAPI.create(story.id, commentText);
      setCommentText('');
      loadComments();
      toast?.('Comment added');
    } catch {}
  };

  const handleMessageAuthor = async () => {
    if (!story?.author?.id) return;
    try {
      await chatAPI.createOrGet(story.author.id);
      onClose();
      router.push('/chat');
    } catch {}
  };

  const handleDoubleTap = () => {
    const defaultEmoji = '❤️';
    handleReact(defaultEmoji);
  };

  if (!story) return null;

  const emojis = ['❤️', '👍', '😂', '😮', '😢', '🔥'];
  const initials = story.author?.username?.slice(0, 2).toUpperCase() || '?';

  const reactionCounts = {};
  for (const r of reactions) {
    reactionCounts[r.type] = (reactionCounts[r.type] || 0) + 1;
  }
  const totalStoryReactions = reactions.length;
  const displayStoryEmojis = Object.keys(storyEmojiMap).filter(e => reactionCounts[storyEmojiMap[e]] > 0);

  return (
    <div
      className="fixed inset-0 z-[200] bg-black flex items-center justify-center select-none"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[420px] h-full max-h-[90vh] aspect-[9/16] flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="absolute top-0 left-0 right-0 z-20 p-3 pb-0 flex gap-1">
          {stories.map((_, i) => (
            <div key={i} className="flex-1 h-[3px] rounded-full bg-white/25 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-75 ease-linear"
                style={{
                  width: i < idx ? '100%' : i === idx ? `${progress}%` : '0%',
                  background: i === idx ? 'linear-gradient(90deg, #fff, #e0e0e0)' : '#fff',
                  opacity: i === idx ? 1 : 0.7,
                }}
              />
            </div>
          ))}
        </div>

        <div className="absolute top-4 left-3 right-3 z-20 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full border-2 border-white/60 overflow-hidden flex-shrink-0 bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xs font-bold text-white shadow-lg">
              {story.author?.profilePicture && !pfpError ? (
                <img src={story.author.profilePicture} alt="" className="w-full h-full object-cover" onError={() => setPfpError(true)} />
              ) : (
                initials
              )}
            </div>
            <div>
              <div className="text-sm font-bold text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]">{story.author?.username || 'User'}</div>
              <div className="text-[11px] text-white/70 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">{timeAgo(story.createdAt)}</div>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/50 transition-all text-lg">
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        <div
          className={`w-full h-full rounded-2xl overflow-hidden bg-black transition-transform duration-200 ${transitioning ? 'scale-95 opacity-50' : 'scale-100 opacity-100'}`}
          onDoubleClick={handleDoubleTap}
        >
          {story.mediaUrl && !mediaError ? (
            story.mediaType === 'video' ? (
              <video
                key={story.id}
                src={story.mediaUrl}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
                onError={() => setMediaError(true)}
              />
            ) : (
              <img key={story.id} src={story.mediaUrl} alt="" className="w-full h-full object-cover" onError={() => setMediaError(true)} />
            )
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
              <div className="text-7xl mb-5 opacity-60"><i className="fa-solid fa-camera" /></div>
              <div className="text-xl font-bold text-white/80">{story.caption || story.author?.username + "'s story"}</div>
            </div>
          )}
        </div>

        <div className="absolute inset-0 rounded-2xl pointer-events-none bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        {story.caption && (
          <div className="absolute bottom-24 left-4 right-4 z-10 text-center">
            <div className="inline-block bg-black/40 backdrop-blur-sm rounded-full px-5 py-2 text-sm text-white/90 shadow-lg">
              {story.caption}
            </div>
          </div>
        )}

        {flyEmojis.map(f => (
          <div
            key={f.id}
            className="absolute left-1/2 bottom-1/2 z-30 pointer-events-none"
            style={{
              animation: `${f.isHeart ? 'flyUpHeart' : 'flyUp'} 1.4s ease-out ${f.delay}s forwards`,
              fontSize: `${f.size}rem`,
              marginLeft: f.x,
              filter: f.isHeart ? 'drop-shadow(0 0 6px rgba(255,50,50,0.6))' : 'none',
            }}
          >
            <span style={{ display: 'inline-block', animation: `drift 1.4s ease-out ${f.delay}s forwards`, '--drift': `${f.drift}px` }}>
              {f.emoji}
            </span>
          </div>
        ))}

        {totalStoryReactions > 0 && (
          <div className="absolute bottom-16 left-4 right-4 z-10 flex justify-center">
            <button onClick={() => setShowReactionsPopup(true)} className="flex items-center gap-1 bg-black/30 backdrop-blur-sm rounded-full px-3 py-1 cursor-pointer border-none hover:bg-black/40 transition-all">
              {displayStoryEmojis.map(e => (
                <span key={e} className="text-sm">{e}</span>
              ))}
              <span className="text-xs text-white/80 ml-0.5">{totalStoryReactions} {totalStoryReactions === 1 ? 'reaction' : 'reactions'}</span>
            </button>
          </div>
        )}

        <div className="absolute bottom-4 left-4 right-4 z-10">
          <div className="flex items-center gap-1.5 justify-center bg-black/30 backdrop-blur-sm rounded-full px-4 py-2 mx-auto w-fit">
            {emojis.map(emoji => (
              <button
                key={emoji}
                onClick={() => handleReact(emoji)}
                className={`text-xl transition-all duration-150 cursor-pointer select-none ${
                  myReaction === emoji
                    ? 'scale-125 drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]'
                    : 'opacity-50 hover:opacity-100 hover:scale-110'
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        <div className="absolute right-3 bottom-20 z-10 flex flex-col gap-2.5">
          <div className="relative flex flex-col items-center">
            <button onClick={() => { handleReact('❤️'); }} className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/50 transition-all shadow-lg active:scale-90">
              <i className={`fa-solid fa-heart transition-all duration-200 ${myReaction === '❤️' ? 'text-red-500 scale-110 animate-[pulseHeart_0.6s_ease-in-out]' : ''}`} />
            </button>
            <span className="text-[10px] text-white/70 mt-0.5">{reactions.filter(r => r.type === 'love' || r.type === '❤️').length}</span>
          </div>
          <button onClick={() => setShowComments(!showComments)} className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/50 transition-all shadow-lg">
            <i className="fa-regular fa-comment" />
          </button>
          <button onClick={handleMessageAuthor} className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/50 transition-all shadow-lg">
            <i className="fa-regular fa-paper-plane" />
          </button>
        </div>

        <div className="absolute left-1 top-1/2 -translate-y-1/2 z-10">
          {idx > 0 && (
            <button onClick={(e) => { e.stopPropagation(); goPrev(); }} className="w-9 h-9 rounded-full bg-black/30 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/50 transition-all shadow-lg ml-1">
              <i className="fa-solid fa-chevron-left text-sm" />
            </button>
          )}
        </div>

        <div className="absolute right-1 top-1/2 -translate-y-1/2 z-10">
          {idx < stories.length - 1 && (
            <button onClick={(e) => { e.stopPropagation(); goNext(); }} className="w-9 h-9 rounded-full bg-black/30 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/50 transition-all shadow-lg mr-1">
              <i className="fa-solid fa-chevron-right text-sm" />
            </button>
          )}
        </div>
      </div>

      {showReactionsPopup && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center" onClick={() => setShowReactionsPopup(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative bg-[#1a1a2e] border border-white/10 rounded-2xl p-5 w-80 max-w-[90vw] max-h-[60vh] shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-bold text-sm">Reactions</h3>
              <button onClick={() => setShowReactionsPopup(false)} className="w-7 h-7 rounded-full bg-white/10 text-white/70 flex items-center justify-center hover:bg-white/20 border-none cursor-pointer">
                <i className="fa-solid fa-xmark text-xs" />
              </button>
            </div>
            <div className="overflow-y-auto max-h-60 space-y-2">
              {reactions.length === 0 ? (
                <div className="text-center text-sm text-white/30 py-4">No reactions yet</div>
              ) : (
                reactions.map(r => (
                  <div key={r.id} className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full flex-shrink-0 bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-[10px] font-bold text-white overflow-hidden">
                      {r.user?.profilePicture ? (
                        <img src={r.user.profilePicture} alt="" className="w-full h-full object-cover" />
                      ) : (
                        r.user?.username?.slice(0, 2).toUpperCase() || '?'
                      )}
                    </div>
                    <span className="flex-1 text-sm text-white/80">{r.user?.username || 'Unknown'}</span>
                    <span className="text-lg">{Object.keys(storyEmojiMap).find(k => storyEmojiMap[k] === r.type) || '❤️'}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {showComments && (
        <div className="fixed inset-0 z-[250] flex items-end justify-center" onClick={() => setShowComments(false)}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div
            className="relative w-full max-w-[420px] bg-[#1a1a2e] rounded-t-2xl max-h-[55vh] flex flex-col shadow-[0_-10px_40px_rgba(0,0,0,0.5)] animate-[slideUp_.3s_ease]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-white/30" />
                <h3 className="text-white font-bold text-base">Comments</h3>
              </div>
              <button onClick={() => setShowComments(false)} className="w-8 h-8 rounded-full bg-white/10 text-white/70 flex items-center justify-center hover:bg-white/20 transition-all">
                <i className="fa-solid fa-xmark text-sm" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[120px]">
              {comments.length === 0 ? (
                <div className="text-center py-8 text-white/30">
                  <div className="text-3xl mb-2"><i className="fa-regular fa-comment-dots" /></div>
                  <div className="text-sm">No comments yet</div>
                </div>
              ) : (
                comments.map(c => (
                  <div key={c.id} className="flex gap-2.5 group">
                    <div className="w-8 h-8 rounded-full flex-shrink-0 bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-[10px] font-bold text-white">
                      {c.author?.username?.slice(0, 2).toUpperCase() || '?'}
                    </div>
                    <div className="bg-white/10 rounded-2xl px-3.5 py-2.5 flex-1">
                      <div className="text-xs font-bold text-white/90 mb-0.5">{c.author?.username || 'User'}</div>
                      <div className="text-sm text-white/70 leading-relaxed">{c.content}</div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-4 pt-3 border-t border-white/10">
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleComment()}
                  placeholder="Write a comment..."
                  className="flex-1 bg-white/10 border-none rounded-full px-4 py-2.5 text-sm text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                />
                <button
                  onClick={handleComment}
                  disabled={!commentText.trim()}
                  className="w-9 h-9 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white flex items-center justify-center disabled:opacity-40 hover:shadow-lg hover:shadow-purple-500/30 transition-all flex-shrink-0"
                >
                  <i className="fa-solid fa-paper-plane text-xs" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
