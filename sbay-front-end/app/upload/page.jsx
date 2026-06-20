'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { postsAPI } from '@/app/lib/api';
import { useToast } from '@/app/components/Toast';

export default function UploadPage() {
  const { user } = useAuth();
  const router = useRouter();
  const toast = useToast();
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [mediaFile, setMediaFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [mediaType, setMediaType] = useState('');
  const [tags, setTags] = useState('');
  const [posting, setPosting] = useState(false);
  const fileRef = useRef(null);

  useEffect(() => {
    if (!user) { router.replace('/login'); return; }
  }, [user, router]);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setMediaFile(file);
    setPreview(URL.createObjectURL(file));
    setMediaType(file.type.startsWith('video/') ? 'video' : 'image');
    e.target.value = '';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    setMediaFile(file);
    setPreview(URL.createObjectURL(file));
    setMediaType(file.type.startsWith('video/') ? 'video' : 'image');
  };

  const clearMedia = () => {
    setMediaFile(null);
    setPreview('');
    setMediaType('');
  };

  const handlePost = async () => {
    if (!mediaFile) { toast?.('Please select a photo or video'); return; }
    setPosting(true);
    try {
      const form = new FormData();
      if (title.trim()) form.append('title', title.trim());
      if (caption.trim()) form.append('content', caption.trim());
      form.append('visibility', 'public');
      if (tags.trim()) form.append('tags', tags);
      if (mediaFile) form.append('media', mediaFile);
      await postsAPI.create(form);
      router.replace('/');
    } catch (err) {
      toast?.(err.response?.data?.message || 'Failed to post');
    } finally {
      setPosting(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[var(--bg)] flex flex-col">
      <div className="bg-[var(--bg2)] border-b border-[var(--border)] h-14 flex items-center px-4 gap-3 flex-shrink-0">
        <button onClick={() => router.back()} className="w-9 h-9 rounded-full bg-transparent border-none text-[var(--text2)] cursor-pointer flex items-center justify-center hover:bg-[var(--bg3)]">
          <i className="fa-solid fa-xmark text-xl" />
        </button>
        <span className="font-bold text-base text-[var(--text)]">Upload</span>
        <button
          onClick={handlePost}
          disabled={posting || !mediaFile}
          className="ml-auto px-5 py-1.5 bg-[var(--accent)] text-white border-none rounded-md cursor-pointer text-sm font-semibold hover:bg-[var(--accent2)] disabled:opacity-60"
        >
          {posting ? 'Posting...' : 'Post'}
        </button>
      </div>

      <div className="flex-1 max-w-2xl mx-auto w-full p-4">
        <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-lg overflow-hidden">
          <div
            className="relative flex items-center justify-center bg-black/5 min-h-[300px] cursor-pointer"
            onClick={() => !preview && fileRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
          >
            {!preview ? (
              <div className="flex flex-col items-center gap-3 p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-[var(--bg3)] flex items-center justify-center text-2xl text-[var(--text3)]">
                  <i className="fa-solid fa-cloud-arrow-up" />
                </div>
                <div className="text-base font-semibold text-[var(--text2)]">Upload your photo or video</div>
                <div className="text-sm text-[var(--text3)]">Drag & drop or click to browse</div>
                <button onClick={() => fileRef.current?.click()} className="px-6 py-2 bg-[var(--accent)] text-white border-none rounded-md cursor-pointer text-sm font-semibold hover:bg-[var(--accent2)]">
                  Select from computer
                </button>
              </div>
            ) : (
              <div className="w-full relative">
                {mediaType === 'video' ? (
                  <video src={preview} controls className="w-full max-h-[500px] object-contain" />
                ) : (
                  <img src={preview} alt="" className="w-full max-h-[500px] object-contain" />
                )}
                <button
                  onClick={clearMedia}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 border-none cursor-pointer"
                >
                  <i className="fa-solid fa-xmark" />
                </button>
                <button
                  onClick={() => fileRef.current?.click()}
                  className="absolute bottom-3 right-3 px-3 py-1.5 rounded-md bg-black/50 text-white text-xs font-semibold border-none cursor-pointer hover:bg-black/70"
                >
                  <i className="fa-solid fa-rotate mr-1" />Change
                </button>
              </div>
            )}
            <input ref={fileRef} type="file" accept="image/*,video/*" className="hidden" onChange={handleFileSelect} />
          </div>

          <div className="p-5 space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text2)] mb-1">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Add a title..."
                className="w-full bg-[var(--bg)] border border-[var(--border)] rounded px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--text2)] mb-1">Description</label>
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                rows={3}
                placeholder="Write a description..."
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
          </div>
        </div>
      </div>
    </div>
  );
}
