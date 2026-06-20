'use client';

import { useState, useRef } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { postsAPI } from '@/app/lib/api';

export default function CreatePost({ onPost, toast }) {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [posting, setPosting] = useState(false);
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState('');
  const [mediaType, setMediaType] = useState('');
  const photoRef = useRef(null);
  const videoRef = useRef(null);

  const handleFileSelect = (e, type) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setMediaFile(file);
    setMediaType(type);
    setMediaPreview(URL.createObjectURL(file));
  };

  const clearMedia = () => {
    setMediaFile(null);
    setMediaPreview('');
    setMediaType('');
    if (photoRef.current) photoRef.current.value = '';
    if (videoRef.current) videoRef.current.value = '';
  };

  const handlePost = async () => {
    const trimmed = text.trim();
    if (!trimmed && !mediaFile) { toast?.('✏️ Please write something or add media!'); return; }
    setPosting(true);
    try {
      const form = new FormData();
      if (title.trim()) form.append('title', title.trim());
      form.append('content', trimmed);
      form.append('visibility', 'public');
      if (mediaFile) {
        form.append('media', mediaFile);
        form.append('mediaType', mediaType);
      }
      const res = await postsAPI.create(form);
      onPost?.(res.data.data);
      setTitle('');
      setText('');
      clearMedia();
      toast?.('✅ Post shared successfully!');
    } catch (err) {
      toast?.(err.response?.data?.message || 'Failed to post');
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius)] p-4 mb-4 shadow-sm">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full flex-shrink-0 bg-[var(--accent)] flex items-center justify-center text-white text-sm font-bold overflow-hidden">
          {user?.profilePicture ? (
            <img src={user.profilePicture} alt="" className="w-full h-full object-cover" />
          ) : (
            <i className="fa-solid fa-user" />
          )}
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={1}
          placeholder="What's on your mind?"
          className="flex-1 bg-[var(--bg)] border border-[var(--border)] rounded-full px-4 py-2 text-sm text-[var(--text)] outline-none resize-none focus:border-[var(--accent)]"
        />
      </div>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Add a title (optional)"
        className="w-full mb-2 bg-[var(--bg)] border border-[var(--border)] rounded px-3 py-1.5 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)]"
      />
      {mediaPreview && (
        <div className="relative mt-2 mb-2 rounded-lg overflow-hidden max-h-40 bg-[var(--bg3)]">
          <button onClick={clearMedia} className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/50 text-white flex items-center justify-center text-xs z-10 hover:bg-black/70">
            <i className="fa-solid fa-xmark" />
          </button>
          {mediaType === 'video' ? (
            <video src={mediaPreview} controls className="w-full max-h-40 object-contain" />
          ) : (
            <img src={mediaPreview} alt="Preview" className="w-full max-h-40 object-contain" />
          )}
        </div>
      )}
      <div className="flex items-center gap-1 flex-wrap border-t border-[var(--border)] pt-3">
        <input ref={photoRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFileSelect(e, 'image')} />
        <input ref={videoRef} type="file" accept="video/*" className="hidden" onChange={(e) => handleFileSelect(e, 'video')} />
        <button onClick={() => photoRef.current?.click()} className="flex items-center gap-1.5 px-3 py-1.5 rounded cursor-pointer text-xs font-medium text-[var(--text2)] hover:bg-[var(--bg3)] transition-colors">
          <i className="fa-solid fa-image text-[#45bd62]" />Photo
        </button>
        <button onClick={() => videoRef.current?.click()} className="flex items-center gap-1.5 px-3 py-1.5 rounded cursor-pointer text-xs font-medium text-[var(--text2)] hover:bg-[var(--bg3)] transition-colors">
          <i className="fa-solid fa-video text-[#f5533d]" />Video
        </button>
        <button
          onClick={handlePost}
          disabled={posting}
          className="ml-auto px-5 py-1.5 bg-[var(--accent)] text-white border-none rounded-md cursor-pointer text-sm font-semibold hover:bg-[var(--accent2)] disabled:opacity-60"
        >
          {posting ? 'Posting...' : 'Post'}
        </button>
      </div>
    </div>
  );
}
