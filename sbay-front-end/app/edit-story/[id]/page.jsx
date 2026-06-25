'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { storiesAPI } from '@/app/lib/api';
import { useToast } from '@/app/components/Toast';

export default function EditStoryPage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const toast = useToast();
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mediaFile, setMediaFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [caption, setCaption] = useState('');
  const [saving, setSaving] = useState(false);
  const fileRef = useRef(null);

  useEffect(() => {
    if (!user) { router.replace('/login'); return; }
    const id = params?.id;
    if (!id) return;
    (async () => {
      try {
        const res = await storiesAPI.getOne(id);
        const s = res.data.data;
        if (!s || s.userId !== user.id) {
          toast?.('Story not found');
          router.replace('/');
          return;
        }
        setStory(s);
        setCaption(s.caption || '');
        setPreview(s.mediaUrl || '');
      } catch {
        toast?.('Failed to load story');
        router.replace('/');
      } finally {
        setLoading(false);
      }
    })();
  }, [user, params?.id]);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setMediaFile(file);
    setPreview(URL.createObjectURL(file));
    e.target.value = '';
  };

  const handleSave = async () => {
    if (!story) return;
    setSaving(true);
    try {
      const form = new FormData();
      if (caption.trim()) form.append('caption', caption.trim());
      else form.append('caption', '');
      if (mediaFile) form.append('media', mediaFile);
      await storiesAPI.update(story.id, form);
      toast?.('Story updated');
      router.back();
    } catch (err) {
      toast?.(err.response?.data?.message || 'Failed to update story');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center"><div className="text-[var(--text3)]">Loading...</div></div>;
  if (!user || !story) return null;

  return (
    <div className="min-h-screen bg-[var(--bg)] flex flex-col">
      <div className="bg-[var(--bg2)] border-b border-[var(--border)] h-14 flex items-center px-4 gap-3 flex-shrink-0">
        <button onClick={() => router.back()} className="w-9 h-9 rounded-full bg-transparent border-none text-[var(--text2)] cursor-pointer flex items-center justify-center hover:bg-[var(--bg3)]">
          <i className="fa-solid fa-xmark text-xl" />
        </button>
        <span className="font-bold text-base text-[var(--text)]">Edit Story</span>
        <button
          onClick={handleSave}
          disabled={saving}
          className="ml-auto px-5 py-1.5 bg-[var(--accent)] text-white border-none rounded-md cursor-pointer text-sm font-semibold hover:bg-[var(--accent2)] disabled:opacity-60"
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row max-w-4xl w-full mx-auto p-4 gap-4 overflow-auto">
        <div className="flex-1 flex flex-col items-center justify-center bg-[var(--bg2)] border border-[var(--border)] rounded-lg min-h-[400px] relative overflow-hidden">
          {!preview ? (
            <div
              className="w-full h-full flex flex-col items-center justify-center gap-3 cursor-pointer p-8"
              onClick={() => fileRef.current?.click()}
            >
              <div className="w-20 h-20 rounded-full bg-[var(--bg3)] flex items-center justify-center text-3xl text-[var(--text3)]">
                <i className="fa-solid fa-image" />
              </div>
              <div className="text-lg font-semibold text-[var(--text2)]">Select a new photo or video</div>
              <button onClick={() => fileRef.current?.click()} className="px-6 py-2 bg-[var(--accent)] text-white border-none rounded-md cursor-pointer text-sm font-semibold hover:bg-[var(--accent2)]">
                Select from computer
              </button>
              <input ref={fileRef} type="file" accept="image/*,video/*" className="hidden" onChange={handleFileSelect} />
            </div>
          ) : (
            <div className="w-full h-full flex flex-col">
              <div className="relative flex-1 flex items-center justify-center bg-black/5 overflow-hidden min-h-[300px]">
                {story.mediaType === 'video' ? (
                  <video src={preview} controls className="max-w-full max-h-full object-contain" />
                ) : (
                  <img src={preview} alt="" className="max-w-full max-h-full object-contain" />
                )}
                <button
                  onClick={() => { setMediaFile(null); setPreview(''); }}
                  className="absolute top-3 right-3 w-8 h-8 bg-black/50 rounded-full text-white flex items-center justify-center hover:bg-black/70 border-none cursor-pointer z-10"
                >
                  <i className="fa-solid fa-xmark" />
                </button>
              </div>
              <button
                onClick={() => fileRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2 text-sm text-[var(--accent)] hover:bg-[var(--bg3)] border-none cursor-pointer bg-transparent"
              >
                <i className="fa-solid fa-rotate" /> Change media
              </button>
              <input ref={fileRef} type="file" accept="image/*,video/*" className="hidden" onChange={handleFileSelect} />
            </div>
          )}
        </div>

        <div className="w-full lg:w-80 flex flex-col gap-4">
          <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-full bg-[var(--accent)] flex items-center justify-center text-xs font-bold text-white flex-shrink-0 overflow-hidden">
                {user?.profilePicture ? (
                  <img src={user.profilePicture} alt="" className="w-full h-full object-cover" />
                ) : (
                  user?.username?.slice(0, 2).toUpperCase() || '?'
                )}
              </div>
              <span className="font-semibold text-sm text-[var(--text)]">{user?.username || 'User'}</span>
            </div>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              rows={3}
              placeholder="Edit caption..."
              className="w-full bg-transparent border-none outline-none text-sm text-[var(--text)] resize-none placeholder:text-[var(--text3)]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
