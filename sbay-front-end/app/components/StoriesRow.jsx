'use client';

import { useState, useEffect, useRef } from 'react';
import { storiesAPI } from '@/app/lib/api';
import StoryViewer from './StoryViewer';
import { getMockStories } from '@/app/lib/mockData';

export default function StoriesRow({ toast }) {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewerIdx, setViewerIdx] = useState(-1);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  useEffect(() => {
    loadStories();
  }, []);

  const loadStories = async () => {
    try {
      const res = await storiesAPI.get();
      setStories(res.data.data || []);
    } catch {
      setStories(getMockStories());
    } finally {
      setLoading(false);
    }
  };

  const createStory = () => {
    fileRef.current?.click();
  };

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('media', file);
      await storiesAPI.create(fd);
      toast?.('Story posted!');
      e.target.value = '';
      loadStories();
    } catch (err) {
      toast?.(err.response?.data?.message || 'Failed to post story');
    } finally {
      setUploading(false);
    }
  };

  const storyDuration = (createdAt) => {
    const diff = Date.now() - new Date(createdAt).getTime();
    const hrs = Math.floor(diff / 3600000);
    if (hrs < 1) return `${Math.floor(diff / 60000)}m`;
    return `${hrs}h`;
  };

  return (
    <>
      <div className="flex gap-2 overflow-x-auto pb-1 mb-4">
        <div onClick={createStory} className="flex-shrink-0 w-28 h-40 rounded-lg relative cursor-pointer overflow-hidden border-2 border-dashed border-[var(--border)] hover:border-[var(--accent)] transition-colors bg-[var(--card)]">
          {uploading ? (
            <div className="w-full h-full flex items-center justify-center bg-[var(--bg3)]">
              <div className="w-6 h-6 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <>
              <div className="w-full h-full bg-[var(--bg3)]" />
              <div className="absolute inset-0 bg-black/30" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] w-9 h-9 rounded-full bg-[var(--accent)] text-white flex items-center justify-center text-lg"><i className="fa-solid fa-plus" /></div>
              <div className="absolute bottom-2 left-0 right-0 text-center text-xs font-semibold text-white">Add Story</div>
            </>
          )}
        </div>
        <input ref={fileRef} type="file" accept="image/*,video/*" className="hidden" onChange={handleFile} />

        {loading ? (
          <div className="flex items-center text-sm text-[var(--text3)]">Loading stories...</div>
        ) : stories.length === 0 ? (
          <div className="flex items-center text-sm text-[var(--text3)]">
            No stories available
          </div>
        ) : (
          stories.map((s, i) => (
            <div key={s.id} onClick={() => setViewerIdx(i)} className="flex-shrink-0 w-28 h-40 rounded-lg relative cursor-pointer overflow-hidden border border-[var(--border)] hover:border-[var(--accent)] transition-colors">
              {s.mediaUrl ? (
                s.mediaType === 'video' ? (
                  <video src={s.mediaUrl} className="w-full h-full object-cover" />
                ) : (
                  <img src={s.mediaUrl} alt="" className="w-full h-full object-cover" />
                )
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl bg-[var(--accent)]">
                  <i className="fa-solid fa-image text-white/50" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-[var(--accent)] flex items-center justify-center text-[9px] font-bold text-white border border-white overflow-hidden">
                {s.author?.profilePicture ? (
                  <img src={s.author.profilePicture} alt="" className="w-full h-full object-cover" />
                ) : (
                  s.author?.username?.slice(0, 2).toUpperCase() || '?'
                )}
              </div>
              <div className="absolute bottom-2 left-2 right-2">
                <div className="text-xs font-semibold text-white truncate">{s.author?.username || 'User'}</div>
              </div>
            </div>
          ))
        )}
      </div>
      {viewerIdx >= 0 && (
        <StoryViewer stories={stories} startIndex={viewerIdx} onClose={() => setViewerIdx(-1)} toast={toast} />
      )}
    </>
  );
}
