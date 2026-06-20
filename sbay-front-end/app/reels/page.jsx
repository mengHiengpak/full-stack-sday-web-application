'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { getMockReels } from '@/app/lib/mockData';

export default function ReelsPage() {
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [likedSet, setLikedSet] = useState(new Set());
  const [likesCountMap, setLikesCountMap] = useState({});
  const [commentPostId, setCommentPostId] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [heartBeatId, setHeartBeatId] = useState(null);
  const [toast, setToast] = useState(null);

  const containerRef = useRef(null);
  const videoRefs = useRef({});
  const touchStartY = useRef(0);
  const toastTimer = useRef(null);

  const { user } = useAuth();
  const router = useRouter();

  const showToast = useCallback((msg) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2000);
  }, []);

  useEffect(() => {
    const mock = getMockReels();
    const likes = {};
    mock.forEach((r) => { likes[r.id] = r.likeCount || 0; });
    setReels(mock);
    setLikesCountMap(likes);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (reels.length === 0) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const idx = Number(entry.target.dataset.index);
          const video = videoRefs.current[idx];
          if (entry.isIntersecting) {
            setActiveIndex(idx);
            if (video) video.play().catch(() => {});
          } else {
            if (video) video.pause();
          }
        });
      },
      { threshold: 0.7 },
    );
    const items = containerRef.current?.querySelectorAll('.reel-item');
    items?.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [reels]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'ArrowDown') { e.preventDefault(); scrollToReel(activeIndex + 1); }
      if (e.key === 'ArrowUp') { e.preventDefault(); scrollToReel(activeIndex - 1); }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [activeIndex, reels.length]);

  const scrollToReel = (idx) => {
    if (idx < 0 || idx >= reels.length) return;
    containerRef.current?.querySelectorAll('.reel-item')[idx]?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleTouchStart = (e) => { touchStartY.current = e.touches[0].clientY; };
  const handleTouchEnd = (e) => {
    const diff = touchStartY.current - e.changedTouches[0].clientY;
    if (Math.abs(diff) > 50) {
      scrollToReel(diff > 0 ? activeIndex + 1 : activeIndex - 1);
    }
  };

  const handleLike = (postId) => {
    setLikedSet((prev) => {
      const next = new Set(prev);
      if (next.has(postId)) {
        next.delete(postId);
        setLikesCountMap((m) => ({ ...m, [postId]: (m[postId] || 0) - 1 }));
        showToast('💔 Unliked');
      } else {
        next.add(postId);
        setLikesCountMap((m) => ({ ...m, [postId]: (m[postId] || 0) + 1 }));
        setHeartBeatId(postId);
        setTimeout(() => setHeartBeatId(null), 500);
        showToast('❤️ Liked!');
      }
      return next;
    });
  };

  const openComments = (postId) => {
    setCommentPostId(postId);
    setComments([]);
    setCommentsLoading(true);
    setTimeout(() => {
      setComments([]);
      setCommentsLoading(false);
    }, 300);
  };

  const addComment = () => {
    const text = commentText.trim();
    if (!text || !commentPostId) return;
    setComments((prev) => [
      ...prev,
      {
        id: 'local_' + Date.now(),
        content: text,
        createdAt: new Date().toISOString(),
        author: { id: user?.id, username: user?.username || 'You', profilePicture: user?.profilePicture },
      },
    ]);
    setCommentText('');
    showToast('💬 Comment posted!');
  };

  const handleShare = (reel) => {
    const url = `${window.location.origin}/post/${reel.id}`;
    if (navigator.share) navigator.share({ title: reel.title || 'Sbay Reel', url });
    else navigator.clipboard.writeText(url).then(() => showToast('🔗 Link copied!'));
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          <span className="text-white/70 text-sm">Loading reels...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black overflow-hidden">
      <style>{`
        .reels-container { scrollbar-width: none; -ms-overflow-style: none; }
        .reels-container::-webkit-scrollbar { display: none; }
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
        @keyframes toastIn { from { opacity: 0; transform: translate(-50%, -10px); } to { opacity: 1; transform: translate(-50%, 0); } }
      `}</style>

      <div
        ref={containerRef}
        className="reels-container w-full h-full overflow-y-scroll snap-y snap-mandatory"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {reels.map((reel, idx) => (
          <div key={reel.id} className="reel-item relative w-full h-screen snap-start snap-always" data-index={idx}>
            {reel.isPlaceholder ? (
              <div className={`w-full h-full ${reel.bgClass} flex items-center justify-center`}>
                <div className="text-center px-8">
                  <div className="text-7xl mb-6">{reel.icon}</div>
                  <h2 className="text-white text-2xl font-bold mb-3">{reel.title}</h2>
                  <p className="text-white/70 text-base max-w-xs mx-auto">{reel.message}</p>
                </div>
              </div>
            ) : (
              <video
                ref={(el) => { videoRefs.current[idx] = el; }}
                src={reel.mediaUrl}
                className="absolute inset-0 w-full h-full object-cover"
                loop
                muted
                playsInline
              />
            )}

            {/* Bottom gradient overlay */}
            <div className="absolute bottom-0 left-0 right-0 h-[45%] bg-gradient-to-t from-black/85 via-black/30 to-transparent pointer-events-none" />

            {/* Bottom-left: user info + caption + song */}
            <div className="absolute bottom-6 left-4 right-[72px] z-10">
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center font-bold text-sm text-white cursor-pointer overflow-hidden bg-[var(--accent)] flex-shrink-0"
                  onClick={() => router.push(`/profile/${reel.author?.id}`)}
                >
                  {reel.author?.profilePicture ? (
                    <img src={reel.author.profilePicture} alt="" className="w-full h-full object-cover" />
                  ) : (
                    (reel.author?.username || 'U').slice(0, 2).toUpperCase()
                  )}
                </div>
                <span
                  className="text-white font-semibold text-sm cursor-pointer hover:underline"
                  onClick={() => router.push(`/profile/${reel.author?.id}`)}
                >
                  @{reel.author?.username || 'unknown'}
                </span>
              </div>
              {(reel.title || reel.content) && (
                <p className="text-white text-sm leading-relaxed line-clamp-2">{reel.title || reel.content}</p>
              )}
              <div className="flex items-center gap-2 mt-2 text-white/70 text-xs">
                <i className="fa-solid fa-music" />
                <span>{reel.song || 'Original Sound'}</span>
              </div>
            </div>

            {/* Right-side action buttons */}
            <div className="absolute bottom-24 right-3 z-10 flex flex-col items-center gap-5">
              <button onClick={() => handleLike(reel.id)} className="flex flex-col items-center gap-0.5 bg-transparent border-none text-white cursor-pointer p-0">
                <div className={`text-3xl transition-transform duration-200 ${heartBeatId === reel.id ? 'scale-125' : 'scale-100'}`}>
                  <i className={`${likedSet.has(reel.id) ? 'fa-solid text-red-500' : 'fa-regular'} fa-heart`} />
                </div>
                <span className="text-xs font-semibold">{likesCountMap[reel.id] ?? (reel.likeCount ?? 0)}</span>
              </button>
              <button onClick={() => openComments(reel.id)} className="flex flex-col items-center gap-0.5 bg-transparent border-none text-white cursor-pointer p-0">
                <i className="fa-regular fa-comment text-3xl" />
                <span className="text-xs font-semibold">{reel.commentCount ?? 0}</span>
              </button>
              <button onClick={() => handleShare(reel)} className="flex flex-col items-center gap-0.5 bg-transparent border-none text-white cursor-pointer p-0">
                <i className="fa-solid fa-share-nodes text-3xl" />
                <span className="text-xs font-semibold">Share</span>
              </button>
            </div>

            {/* Reel counter */}
            {reels.length > 1 && (
              <div className="absolute top-4 right-4 z-10 bg-black/50 text-white text-xs px-2.5 py-0.5 rounded-full font-medium">
                {idx + 1}/{reels.length}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Toast notification */}
      {toast && (
        <div
          className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-white/90 text-gray-900 px-5 py-2.5 rounded-full text-sm font-medium shadow-lg"
          style={{ animation: 'toastIn 0.25s ease-out' }}
        >
          {toast}
        </div>
      )}

      {/* Comments bottom sheet */}
      {commentPostId !== null && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/60" onClick={() => setCommentPostId(null)} />
          <div
            className="relative bg-[#1a1a1a] rounded-t-2xl max-h-[70vh] flex flex-col"
            style={{ animation: 'slideUp 0.25s ease-out' }}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
              <h3 className="text-white font-semibold text-base">Comments</h3>
              <button onClick={() => setCommentPostId(null)} className="text-white/60 text-xl bg-transparent border-none cursor-pointer p-1 hover:text-white transition-colors">
                <i className="fa-solid fa-xmark" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-2 space-y-3">
              {commentsLoading && <div className="text-center text-white/50 text-sm py-8">Loading comments...</div>}
              {!commentsLoading && comments.length === 0 && <div className="text-center text-white/50 text-sm py-8">No comments yet.</div>}
              {comments.map((c) => (
                <div key={c.id} className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-[var(--accent)] flex items-center justify-center font-bold text-xs text-white flex-shrink-0 overflow-hidden">
                    {c.author?.profilePicture ? (
                      <img src={c.author.profilePicture} alt="" className="w-full h-full object-cover" />
                    ) : (
                      c.author?.username?.slice(0, 2).toUpperCase() || '?'
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-sm font-semibold">{c.author?.username || 'Unknown'}</div>
                    <div className="text-white/80 text-sm break-words">{c.content}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-4 py-3 border-t border-white/10 flex gap-2 items-center">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addComment()}
                placeholder="Add a comment..."
                className="flex-1 bg-white/10 text-white placeholder-white/40 border border-white/20 rounded-full px-4 py-2 text-sm outline-none focus:border-[var(--accent)] transition-colors"
              />
              <button
                onClick={addComment}
                className="w-9 h-9 rounded-full bg-[var(--accent)] border-none text-white cursor-pointer flex items-center justify-center flex-shrink-0 hover:opacity-90 transition-opacity"
              >
                <i className="fa-solid fa-paper-plane text-sm" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


