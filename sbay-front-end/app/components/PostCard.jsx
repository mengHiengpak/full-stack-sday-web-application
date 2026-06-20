'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { postsAPI, commentsAPI, reactionsAPI, chatAPI } from '@/app/lib/api';
import { useAuth } from '@/app/context/AuthContext';

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

const EMOJI_MAP = {
  '❤️': 'love', '👍': 'like', '😂': 'haha', '😮': 'wow', '😢': 'sad', '😡': 'angry', '🔥': 'fire',
};
const EMOJIS = ['❤️', '👍', '😂', '😮', '😢', '😡', '🔥'];

export default function PostCard({ post, toast, onOpenProfile, onShare, onDelete }) {
  const { user } = useAuth();
  const router = useRouter();
  const author = post.author || {};
  const authorName = author.username || 'Unknown';
  const initials = authorName.slice(0, 2).toUpperCase();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [myReaction, setMyReaction] = useState('');
  const [reactionsList, setReactionsList] = useState([]);
  const [showReactionsPopup, setShowReactionsPopup] = useState(false);
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const cardRef = useRef(null);
  const fetchRef = useRef(0);

  useEffect(() => {
    if (showComments && comments.length === 0 && !commentsLoading) {
      loadComments();
    }
  }, [showComments]);

  useEffect(() => {
    loadReactions();
  }, [post.id]);

  const loadReactions = async () => {
    const id = ++fetchRef.current;
    try {
      const res = await reactionsAPI.getPost(post.id);
      if (id !== fetchRef.current) return;
      setReactionsList(res.data.data || []);
      const mine = res.data.data.find(r => r.userId === user?.id);
      if (mine) setMyReaction(mine.type);
    } catch {}
  };

  const toggleReaction = async (emoji) => {
    const type = EMOJI_MAP[emoji];
    const wasActive = myReaction === type;
    if (wasActive) {
      setMyReaction('');
      setReactionsList(prev => prev.filter(r => !(r.userId === user?.id && r.type === type)));
    } else {
      setMyReaction(type);
      setReactionsList(prev => [
        ...prev.filter(r => r.userId !== user?.id),
        { userId: user?.id, type, id: -Date.now(), user: { id: user?.id, username: user?.username } },
      ]);
    }
    try {
      await reactionsAPI.togglePost(post.id, type);
      loadReactions();
    } catch {
      loadReactions();
    }
  };

  const loadComments = async () => {
    setCommentsLoading(true);
    try {
      const res = await commentsAPI.get(post.id);
      setComments(res.data.data || []);
    } catch {
    } finally {
      setCommentsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this post?')) return;
    setDeleting(true);
    try {
      await postsAPI.delete(post.id);
      toast?.('🗑️ Post deleted');
      onDelete?.(post.id);
    } catch {
      toast?.('Failed to delete');
    } finally {
      setDeleting(false);
      setShowMenu(false);
    }
  };

  const addComment = async () => {
    const text = commentText.trim();
    if (!text) return;
    try {
      const res = await commentsAPI.create(post.id, text, null);
      setComments([...comments, res.data.data]);
      setCommentText('');
      toast?.('💬 Comment posted!');
    } catch {
      toast?.('Failed to post comment');
    }
  };

  const isOwn = user?.id === author.id;

  const reactionCounts = {};
  for (const r of reactionsList) {
    reactionCounts[r.type] = (reactionCounts[r.type] || 0) + 1;
  }
  const totalReactions = reactionsList.length;

  const displayEmojis = EMOJIS.filter(e => reactionCounts[EMOJI_MAP[e]] > 0);

  const currentEmoji = Object.keys(EMOJI_MAP).find(k => EMOJI_MAP[k] === myReaction);

  return (
    <div ref={cardRef} className="bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius)] mb-4 shadow-sm">
      <div className="flex items-center gap-3 px-4 pt-4 pb-3">
        <div
          onClick={() => router.push(`/profile/${author.id}`)}
          className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-sm text-white cursor-pointer overflow-hidden bg-[var(--accent)]"
        >
          {author.profilePicture ? (
            <img src={author.profilePicture} alt="" className="w-full h-full object-cover" />
          ) : (
            initials
          )}
        </div>
        <div>
          <div onClick={() => router.push(`/profile/${author.id}`)} className="font-semibold text-sm text-[var(--text)] cursor-pointer hover:underline">{authorName}</div>
          <div className="text-xs text-[var(--text3)]">
            {timeAgo(post.createdAt)}
          </div>
        </div>
        <div className="ml-auto relative">
          <button onClick={() => setShowMenu(!showMenu)} className="w-8 h-8 rounded-full bg-transparent border-none text-[var(--text3)] cursor-pointer flex items-center justify-center hover:bg-[var(--bg3)] transition-colors">
            <i className="fa-solid fa-ellipsis" />
          </button>
          {showMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
              <div className="absolute right-0 top-full mt-1 w-40 bg-[var(--bg2)] border border-[var(--border)] rounded-lg shadow-lg z-20 py-1">
                {isOwn && (
                  <>
                    <button onClick={() => { setShowMenu(false); router.push(`/edit/${post.id}`); }} className="w-full text-left px-4 py-2 text-sm text-[var(--text2)] hover:bg-[var(--bg3)] flex items-center gap-2">
                      <i className="fa-solid fa-pen" />Edit
                    </button>
                    <button onClick={handleDelete} disabled={deleting} className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-[var(--bg3)] flex items-center gap-2">
                      <i className="fa-solid fa-trash-can" />{deleting ? 'Deleting...' : 'Delete'}
                    </button>
                  </>
                )}
                <button onClick={async () => { setShowMenu(false); try { await chatAPI.createOrGet(author.id); router.push('/chat'); } catch {} }} className="w-full text-left px-4 py-2 text-sm text-[var(--text2)] hover:bg-[var(--bg3)] flex items-center gap-2">
                  <i className="fa-solid fa-message" />Message
                </button>
                <button onClick={async () => { setShowMenu(false); try { await navigator.clipboard.writeText(window.location.origin + '/post/' + post.id); toast?.('🔗 Link copied!'); } catch { const ta = document.createElement('textarea'); ta.value = window.location.origin + '/post/' + post.id; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta); toast?.('🔗 Link copied!'); } }} className="w-full text-left px-4 py-2 text-sm text-[var(--text2)] hover:bg-[var(--bg3)] flex items-center gap-2">
                  <i className="fa-solid fa-link" />Copy link
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="px-4 pb-3">
        {post.title && <div className="font-bold text-base mb-1">{post.title}</div>}
        <div className="text-sm leading-relaxed text-[var(--text)] mb-3">{post.content}</div>
        {post.mediaUrl && (
          <div className="w-full rounded-[var(--radius-sm)] overflow-hidden mb-0.5 max-h-[400px] bg-[var(--bg3)]">
            {post.mediaType === 'video' ? (
              <video src={post.mediaUrl} controls className="w-full h-full object-cover" />
            ) : (
              <img src={post.mediaUrl} alt="" className="w-full h-full object-cover" />
            )}
          </div>
        )}
        {post.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {post.tags.map((t, i) => (
              <span key={i} className="text-xs text-[var(--accent)] bg-[#e7f3ff] px-2 py-0.5 rounded font-medium">{t.startsWith('#') ? t : `#${t}`}</span>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 px-4 py-2 border-t border-[var(--border)] text-xs text-[var(--text3)]">
        <div className="flex items-center gap-1 flex-wrap flex-1">
          {totalReactions > 0 ? (
            <button onClick={() => setShowReactionsPopup(true)} className="flex items-center gap-1 hover:underline cursor-pointer bg-transparent border-none p-0 text-[var(--text3)]">
              {displayEmojis.map(e => (
                <span key={e} className="text-sm">{e}</span>
              ))}
              <span>{totalReactions} {totalReactions === 1 ? 'reaction' : 'reactions'}</span>
            </button>
          ) : null}
        </div>
        <span className="ml-auto cursor-pointer hover:underline" onClick={() => setShowComments(!showComments)}>
          {post.commentCount || 0} comments
        </span>
      </div>

      <div className="flex border-t border-[var(--border)]">
        <div className="flex-1 relative">
          <div className="relative inline-flex w-full">
            <button
              onClick={() => setShowReactionPicker(!showReactionPicker)}
              className={`w-full flex items-center justify-center gap-1.5 py-2 cursor-pointer bg-transparent border-none text-sm font-medium transition-colors hover:bg-[var(--bg3)] ${myReaction ? 'text-[var(--accent)]' : 'text-[var(--text2)]'}`}
            >
              {currentEmoji ? (
                <span className="text-base">{currentEmoji}</span>
              ) : (
                <i className="fa-regular fa-thumbs-up" />
              )}
              {myReaction ? 'Liked' : 'Like'}
            </button>
            {showReactionPicker && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowReactionPicker(false)} />
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 flex items-center gap-1 bg-[var(--bg2)] border border-[var(--border)] rounded-full px-3 py-2 shadow-lg z-20">
                  {EMOJIS.map((e) => (
                    <button
                      key={e}
                      onClick={() => { toggleReaction(e); setShowReactionPicker(false); }}
                      className={`w-9 h-9 flex items-center justify-center text-xl rounded-full hover:bg-[var(--bg3)] transition-all hover:scale-125 ${myReaction === EMOJI_MAP[e] ? 'bg-[var(--bg3)] scale-110' : ''}`}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
        <button onClick={() => setShowComments(!showComments)} className="flex-1 flex items-center justify-center gap-1.5 py-2 cursor-pointer bg-transparent border-none text-sm font-medium text-[var(--text2)] transition-colors hover:bg-[var(--bg3)]">
          <i className="fa-regular fa-comment" />Comment
        </button>
        <button onClick={() => onShare?.(post)} className="flex-1 flex items-center justify-center gap-1.5 py-2 cursor-pointer bg-transparent border-none text-sm font-medium text-[var(--text2)] transition-colors hover:bg-[var(--bg3)]">
          <i className="fa-solid fa-share-nodes" />Share
        </button>
      </div>

      <div className={`px-4 pb-3 border-t border-[var(--border)] ${showComments ? 'block' : 'hidden'}`}>
        {commentsLoading && <div className="text-center text-xs text-[var(--text3)] py-3">Loading comments...</div>}
        {comments.map((c) => (
          <div key={c.id} className="flex gap-2.5 mt-3">
            <div className="w-8 h-8 rounded-full bg-[var(--accent)] flex items-center justify-center font-bold text-xs text-white flex-shrink-0 overflow-hidden">
              {c.author?.profilePicture ? (
                <img src={c.author.profilePicture} alt="" className="w-full h-full object-cover" />
              ) : (
                c.author?.username?.slice(0, 2).toUpperCase() || '?'
              )}
            </div>
            <div className="bg-[var(--bg3)] rounded-lg px-3 py-2 flex-1">
              <div className="text-xs font-semibold mb-0.5">{c.author?.username || 'Unknown'}</div>
              <div className="text-xs leading-relaxed text-[var(--text2)]">{c.content}</div>
              <div className="text-xs text-[var(--text3)] mt-1 flex gap-3">
                <span onClick={async () => { try { await commentsAPI.like(c.id); toast?.('❤️ Liked comment'); } catch { toast?.('Failed to like comment'); } }} className="cursor-pointer hover:underline">Like</span>
                <span onClick={() => { setCommentText(`@${c.author?.username || ''} `); document.querySelector(`[data-comment-input]`)?.focus(); }} className="cursor-pointer hover:underline">Reply</span>
                {(user?.id === c.author?.id || user?.id === author.id) && (
                  <span onClick={async () => { try { await commentsAPI.delete(c.id); setComments((prev) => prev.filter((x) => x.id !== c.id)); toast?.('🗑️ Comment deleted'); } catch { toast?.('Failed to delete comment'); } }} className="cursor-pointer hover:underline text-red-400">Delete</span>
                )}
                <span>{timeAgo(c.createdAt)}</span>
              </div>
            </div>
          </div>
        ))}
        <div className="flex gap-2 items-center pt-3">
          <div className="w-8 h-8 rounded-full bg-[var(--accent)] flex items-center justify-center font-bold text-xs text-white flex-shrink-0 overflow-hidden">
            {user?.profilePicture ? (
              <img src={user.profilePicture} alt="" className="w-full h-full object-cover" />
            ) : (
              user?.username?.slice(0, 2).toUpperCase() || '?'
            )}
          </div>
          <input
            data-comment-input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addComment()}
            placeholder="Write a comment..."
            className="flex-1 bg-[var(--bg3)] border border-[var(--border)] rounded-full px-3 py-1.5 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)]"
          />
          <button onClick={addComment} className="w-8 h-8 rounded-full bg-[var(--accent)] border-none text-white cursor-pointer text-xs flex items-center justify-center hover:bg-[var(--accent2)]">
            <i className="fa-solid fa-paper-plane" />
          </button>
        </div>
      </div>

      {showReactionsPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={() => setShowReactionsPopup(false)}>
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative bg-[var(--bg2)] border border-[var(--border)] rounded-lg p-5 w-80 max-w-[90vw] max-h-80 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-sm text-[var(--text)]">Reactions</h3>
              <button onClick={() => setShowReactionsPopup(false)} className="bg-transparent border-none text-[var(--text3)] cursor-pointer text-lg hover:text-[var(--text)]">
                <i className="fa-solid fa-xmark" />
              </button>
            </div>
            <div className="overflow-y-auto max-h-60 space-y-2">
              {reactionsList.length === 0 ? (
                <div className="text-center text-sm text-[var(--text3)] py-4">No reactions yet</div>
              ) : (
                reactionsList.map(r => (
                  <div key={r.id} className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[var(--accent)] flex items-center justify-center font-bold text-xs text-white flex-shrink-0 overflow-hidden">
                      {r.user?.profilePicture ? (
                        <img src={r.user.profilePicture} alt="" className="w-full h-full object-cover" />
                      ) : (
                        r.user?.username?.slice(0, 2).toUpperCase() || '?'
                      )}
                    </div>
                    <span className="flex-1 text-sm text-[var(--text2)]">{r.user?.username || 'Unknown'}</span>
                    <span className="text-lg">{Object.keys(EMOJI_MAP).find(k => EMOJI_MAP[k] === r.type) || '👍'}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
