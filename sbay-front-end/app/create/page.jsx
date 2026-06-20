'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { postsAPI } from '@/app/lib/api';
import { useToast } from '@/app/components/Toast';

const FILTERS = [
  { name: 'Normal', filter: '' },
  { name: 'Clarendon', filter: 'brightness(1.1) contrast(1.15) saturate(1.2)' },
  { name: 'Gingham', filter: 'brightness(1.05) hue-rotate(-10deg) saturate(0.9)' },
  { name: 'Juno', filter: 'brightness(1.05) contrast(1.05) saturate(1.3) hue-rotate(5deg)' },
  { name: 'Lark', filter: 'brightness(1.05) contrast(0.95) saturate(0.9) hue-rotate(180deg)' },
  { name: 'Valencia', filter: 'sepia(0.15) brightness(1.05) contrast(1.05)' },
  { name: 'X-Pro II', filter: 'sepia(0.3) contrast(1.2) saturate(1.3)' },
  { name: 'Amaro', filter: 'brightness(1.1) contrast(0.95) saturate(1.1) hue-rotate(-10deg)' },
  { name: 'Inkwell', filter: 'grayscale(1) brightness(1.05) contrast(1.1)' },
  { name: 'Moon', filter: 'grayscale(0.8) brightness(1.1) contrast(1.2)' },
  { name: 'Hudson', filter: 'brightness(1.1) contrast(1.1) saturate(1.1) hue-rotate(-10deg)' },
  { name: 'Sierra', filter: 'sepia(0.2) brightness(1.05) contrast(0.95) saturate(0.8)' },
];

export default function CreatePostPage() {
  const { user } = useAuth();
  const router = useRouter();
  const toast = useToast();
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [mediaFile, setMediaFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [mediaType, setMediaType] = useState('');
  const [activeFilter, setActiveFilter] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturate, setSaturate] = useState(100);
  const [posting, setPosting] = useState(false);
  const [showFilters, setShowFilters] = useState(true);
  const [showAdjust, setShowAdjust] = useState(false);
  const [tags, setTags] = useState('');
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

  const resetEdits = () => {
    setZoom(1);
    setRotation(0);
    setBrightness(100);
    setContrast(100);
    setSaturate(100);
    setActiveFilter(0);
  };

  const handlePost = async () => {
    if (!caption.trim() && !mediaFile) return;
    setPosting(true);
    try {
      const form = new FormData();
      if (title.trim()) form.append('title', title.trim());
      if (caption.trim()) form.append('content', caption.trim());
      form.append('visibility', 'public');
      if (tags.trim()) form.append('tags', tags);
      if (mediaFile) form.append('media', mediaFile);
      const res = await postsAPI.create(form);
      router.replace('/');
    } catch (err) {
      toast?.(err.response?.data?.message || 'Failed to post');
    } finally {
      setPosting(false);
    }
  };

  if (!user) return null;

  const filterStyle = mediaType === 'image' ? {
    filter: FILTERS[activeFilter].filter,
    transform: `scale(${zoom}) rotate(${rotation}deg)`,
    brightness: `${brightness}%`,
    contrast: `${contrast}%`,
    saturate: `${saturate}%`,
  } : {};

  return (
    <div className="min-h-screen bg-[var(--bg)] flex flex-col">
      <div className="bg-[var(--bg2)] border-b border-[var(--border)] h-14 flex items-center px-4 gap-3 flex-shrink-0">
        <button onClick={() => router.back()} className="w-9 h-9 rounded-full bg-transparent border-none text-[var(--text2)] cursor-pointer flex items-center justify-center hover:bg-[var(--bg3)]">
          <i className="fa-solid fa-xmark text-xl" />
        </button>
        <span className="font-bold text-base text-[var(--text)]">Create Post</span>
        <button
          onClick={handlePost}
          disabled={posting || (!caption.trim() && !mediaFile)}
          className="ml-auto px-5 py-1.5 bg-[var(--accent)] text-white border-none rounded-md cursor-pointer text-sm font-semibold hover:bg-[var(--accent2)] disabled:opacity-60"
        >
          {posting ? 'Posting...' : 'Post'}
        </button>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row max-w-4xl w-full mx-auto p-4 gap-4 overflow-auto">
        <div className="flex-1 flex flex-col items-center justify-center bg-[var(--bg2)] border border-[var(--border)] rounded-lg min-h-[400px] relative overflow-hidden">
          {!preview ? (
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className="w-full h-full flex flex-col items-center justify-center gap-3 cursor-pointer p-8"
              onClick={() => fileRef.current?.click()}
            >
              <div className="w-20 h-20 rounded-full bg-[var(--bg3)] flex items-center justify-center text-3xl text-[var(--text3)]">
                <i className="fa-solid fa-image" />
              </div>
              <div className="text-lg font-semibold text-[var(--text2)]">Drag photos and videos here</div>
              <div className="text-sm text-[var(--text3)] mb-2">or click to browse</div>
              <button onClick={() => fileRef.current?.click()} className="px-6 py-2 bg-[var(--accent)] text-white border-none rounded-md cursor-pointer text-sm font-semibold hover:bg-[var(--accent2)]">
                Select from computer
              </button>
              <input ref={fileRef} type="file" accept="image/*,video/*" className="hidden" onChange={handleFileSelect} />
            </div>
          ) : (
            <div className="w-full h-full flex flex-col">
              <div className="relative flex-1 flex items-center justify-center bg-black/5 overflow-hidden min-h-[300px]">
                {mediaType === 'video' ? (
                  <video src={preview} controls className="max-w-full max-h-full object-contain" style={{ transform: `scale(${zoom}) rotate(${rotation}deg)` }} />
                ) : (
                  <img
                    src={preview}
                    alt=""
                    className="max-w-full max-h-full object-contain transition-all duration-200"
                    style={{
                      filter: FILTERS[activeFilter].filter,
                      transform: `scale(${zoom}) rotate(${rotation}deg)`,
                    }}
                  />
                )}
                <button
                  onClick={() => { setMediaFile(null); setPreview(''); resetEdits(); }}
                  className="absolute top-3 right-3 w-8 h-8 bg-black/50 rounded-full text-white flex items-center justify-center hover:bg-black/70 border-none cursor-pointer z-10"
                >
                  <i className="fa-solid fa-xmark" />
                </button>
              </div>
              <button
                onClick={() => fileRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2 text-sm text-[var(--accent)] hover:bg-[var(--bg3)] border-none cursor-pointer bg-transparent"
              >
                <i className="fa-solid fa-rotate" /> Change photo
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
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Add a title..."
              className="w-full bg-[var(--bg3)] border border-[var(--border)] rounded px-3 py-1.5 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)] mb-2"
            />
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              rows={4}
              placeholder="Write a caption..."
              className="w-full bg-transparent border-none outline-none text-sm text-[var(--text)] resize-none placeholder:text-[var(--text3)]"
            />
            <div className="border-t border-[var(--border)] pt-2 mt-2">
              <input
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="Add tags (comma separated)"
                className="w-full bg-[var(--bg3)] border border-[var(--border)] rounded px-3 py-1.5 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)]"
              />
            </div>
          </div>

          {preview && mediaType === 'image' && (
            <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-lg p-4">
              <div className="flex gap-2 mb-3">
                <button
                  onClick={() => { setShowFilters(true); setShowAdjust(false); }}
                  className={`flex-1 py-2 rounded-md text-xs font-semibold border-none cursor-pointer ${showFilters ? 'bg-[var(--accent)] text-white' : 'bg-[var(--bg3)] text-[var(--text2)]'}`}
                >
                  Filters
                </button>
                <button
                  onClick={() => { setShowAdjust(true); setShowFilters(false); }}
                  className={`flex-1 py-2 rounded-md text-xs font-semibold border-none cursor-pointer ${showAdjust ? 'bg-[var(--accent)] text-white' : 'bg-[var(--bg3)] text-[var(--text2)]'}`}
                >
                  Adjust
                </button>
              </div>

              {showFilters && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {FILTERS.map((f, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveFilter(i)}
                      className={`flex-shrink-0 w-16 cursor-pointer bg-transparent border-none ${activeFilter === i ? 'ring-2 ring-[var(--accent)] rounded' : ''}`}
                    >
                      <div className="w-16 h-16 rounded overflow-hidden bg-[var(--bg3)]">
                        <img
                          src={preview}
                          alt=""
                          className="w-full h-full object-cover"
                          style={{ filter: f.filter }}
                        />
                      </div>
                      <div className="text-[10px] text-[var(--text2)] mt-0.5 truncate">{f.name}</div>
                    </button>
                  ))}
                </div>
              )}

              {showAdjust && (
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs text-[var(--text3)] mb-1">
                      <span>Zoom</span>
                      <span>{Math.round(zoom * 100)}%</span>
                    </div>
                    <input type="range" min="0.5" max="3" step="0.1" value={zoom} onChange={(e) => setZoom(parseFloat(e.target.value))} className="w-full accent-[var(--accent)]" />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs text-[var(--text3)] mb-1">
                      <span>Rotate</span>
                      <span>{rotation}°</span>
                    </div>
                    <input type="range" min="0" max="360" step="1" value={rotation} onChange={(e) => setRotation(parseInt(e.target.value))} className="w-full accent-[var(--accent)]" />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setRotation(prev => prev - 90)} className="flex-1 py-2 bg-[var(--bg3)] border border-[var(--border)] rounded-md text-xs font-medium text-[var(--text2)] cursor-pointer hover:bg-[var(--card2)]">
                      <i className="fa-solid fa-rotate-left mr-1" /> -90°
                    </button>
                    <button onClick={() => setRotation(prev => prev + 90)} className="flex-1 py-2 bg-[var(--bg3)] border border-[var(--border)] rounded-md text-xs font-medium text-[var(--text2)] cursor-pointer hover:bg-[var(--card2)]">
                      <i className="fa-solid fa-rotate-right mr-1" /> +90°
                    </button>
                  </div>
                  <button onClick={resetEdits} className="w-full py-2 bg-[var(--bg3)] border border-[var(--border)] rounded-md text-xs font-medium text-[var(--text2)] cursor-pointer hover:bg-[var(--card2)]">
                    <i className="fa-solid fa-arrow-rotate-left mr-1" /> Reset all
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
