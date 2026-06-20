'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { postsAPI } from '@/app/lib/api';
import { useToast } from '@/app/components/Toast';

export default function EditPostPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const toast = useToast();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) { router.replace('/login'); return; }
    loadPost();
  }, [user, id]);

  const loadPost = async () => {
    try {
      const res = await postsAPI.get(parseInt(id));
      const post = res.data.data;
      if (post.authorId !== user?.id) {
        setError('Not authorized');
        return;
      }
      setTitle(post.title || '');
      setContent(post.content || '');
      setTags(post.tags?.join(', ') || '');
    } catch {
      setError('Post not found');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!content.trim()) return;
    setSaving(true);
    try {
      await postsAPI.update(parseInt(id), {
        title: title.trim(),
        content: content.trim(),
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      });
      toast?.('Post updated');
      router.back();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[var(--bg)] flex flex-col">
      <div className="bg-[var(--bg2)] border-b border-[var(--border)] h-14 flex items-center px-4 gap-3 flex-shrink-0">
        <button onClick={() => router.back()} className="w-9 h-9 rounded-full bg-transparent border-none text-[var(--text2)] cursor-pointer flex items-center justify-center hover:bg-[var(--bg3)]">
          <i className="fa-solid fa-xmark text-xl" />
        </button>
        <span className="font-bold text-base text-[var(--text)]">Edit Post</span>
        <button
          onClick={handleSave}
          disabled={saving || !content.trim()}
          className="ml-auto px-5 py-1.5 bg-[var(--accent)] text-white border-none rounded-md cursor-pointer text-sm font-semibold hover:bg-[var(--accent2)] disabled:opacity-60"
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>

      <div className="flex-1 max-w-2xl mx-auto w-full p-4">
        {loading ? (
          <div className="space-y-4">
            {[1,2,3].map(i => (
              <div key={i} className="h-10 bg-[var(--bg3)] rounded animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <div className="text-4xl mb-3 opacity-30"><i className="fa-regular fa-circle-exclamation" /></div>
            <div className="font-semibold text-[var(--text2)]">{error}</div>
            <button onClick={() => router.replace('/')} className="mt-4 px-4 py-2 bg-[var(--accent)] text-white border-none rounded-md cursor-pointer text-sm font-semibold">
              Go Home
            </button>
          </div>
        ) : (
          <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-lg p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text2)] mb-1">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Post title (optional)"
                className="w-full bg-[var(--bg)] border border-[var(--border)] rounded px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--text2)] mb-1">Content</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={6}
                placeholder="What's on your mind?"
                className="w-full bg-[var(--bg)] border border-[var(--border)] rounded px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)] resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--text2)] mb-1">Tags</label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="tag1, tag2, tag3"
                className="w-full bg-[var(--bg)] border border-[var(--border)] rounded px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)]"
              />
              <p className="text-xs text-[var(--text3)] mt-1">Separate tags with commas</p>
            </div>
            <div className="text-xs text-[var(--text3)]">
              <i className="fa-solid fa-circle-info mr-1" />Media cannot be changed after posting.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
