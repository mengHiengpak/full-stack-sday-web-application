'use client';

import { useState, useEffect, useRef } from 'react';
import khmerSongs from '@/app/lib/khmerMusic';
import englishSongs from '@/app/lib/englishMusic';

function timeFormat(sec) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function MusicPage({ toast }) {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('khmer');
  const [playingId, setPlayingId] = useState(null);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [page, setPage] = useState(1);
  const perPage = 10;
  const audioRef = useRef(null);
  const progressRef = useRef(null);

  useEffect(() => {
    loadTracks(tab);
  }, [tab]);

  useEffect(() => {
    if (!search.trim()) return;
    const timer = setTimeout(() => searchTracks(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [search, tab]);

  useEffect(() => {
    if (!currentTrack || !('mediaSession' in navigator)) return;
    const name = currentTrack.artist?.name || currentTrack.artist || 'Unknown';
    navigator.mediaSession.metadata = new MediaMetadata({
      title: currentTrack.title,
      artist: name,
      album: currentTrack.album?.title || '',
      artwork: currentTrack.album?.cover
        ? [{ src: currentTrack.album.cover, sizes: '250x250', type: 'image/jpeg' }]
        : [],
    });
    navigator.mediaSession.setActionHandler('play', () => audioRef.current?.play());
    navigator.mediaSession.setActionHandler('pause', () => audioRef.current?.pause());
    navigator.mediaSession.setActionHandler('seekforward', () => {
      if (audioRef.current) audioRef.current.currentTime = Math.min(audioRef.current.currentTime + 10, audioRef.current.duration || 0);
    });
    navigator.mediaSession.setActionHandler('seekbackward', () => {
      if (audioRef.current) audioRef.current.currentTime = Math.max(audioRef.current.currentTime - 10, 0);
    });
  }, [currentTrack]);

  useEffect(() => {
    if (currentTrack) {
      document.title = `${currentTrack.title} — ${currentTrack.artist?.name || currentTrack.artist || 'Unknown'} • Sbay Live`;
    } else {
      document.title = 'Sbay Live';
    }
    return () => { document.title = 'Sbay Live'; };
  }, [currentTrack]);

  const loadTracks = (category) => {
    setLoading(true);
    setTracks([]);
    const db = category === 'khmer' ? khmerSongs : englishSongs;
    setTracks([...db].sort(() => Math.random() - 0.5));
    setLoading(false);
  };

  const searchTracks = (q) => {
    setLoading(true);
    setTracks([]);
    const lower = q.toLowerCase();
    const db = tab === 'khmer' ? khmerSongs : englishSongs;
    const results = db.filter(
      (t) => t.title.toLowerCase().includes(lower) || t.artist.toLowerCase().includes(lower),
    );
    setTracks(results);
    if (!results.length) toast?.(`No ${tab === 'khmer' ? 'Khmer' : 'English'} songs found`);
    setLoading(false);
  };

  const playTrack = (track) => {
    if (playingId === track.id) {
      if (audioRef.current?.paused) {
        audioRef.current.play();
      } else {
        audioRef.current?.pause();
      }
      return;
    }
    setPlayingId(track.id);
    setCurrentTrack(track);
    setProgress(0);
    setTimeout(() => {
      if (audioRef.current) {
        if (track.preview) {
          audioRef.current.src = track.preview;
          audioRef.current.volume = volume;
          audioRef.current.play().catch(() => {});
        } else {
          toast?.('🔇 Preview not available for this track');
        }
      }
    }, 100);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current && currentTrack?.duration) {
      setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
    }
  };

  const handleEnded = () => {
    setPlayingId(null);
    setProgress(0);
  };

  const handleProgressClick = (e) => {
    if (!audioRef.current || !currentTrack?.duration) return;
    const rect = progressRef.current.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    audioRef.current.currentTime = pct * audioRef.current.duration;
    setProgress(pct * 100);
  };

  const changeVolume = (e) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
    if (audioRef.current) audioRef.current.volume = v;
  };

  const filtered = tracks.filter((t) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    const artistName = t.artist?.name || t.artist || '';
    return (t.title || '').toLowerCase().includes(q) || artistName.toLowerCase().includes(q);
  });

  const totalPages = Math.ceil(filtered.length / perPage) || 1;
  const paged = filtered.slice((page - 1) * perPage, page * perPage);
  const startItem = Math.min((page - 1) * perPage + 1, filtered.length);
  const endItem = Math.min(page * perPage, filtered.length);

  return (
    <div className="animate-[fadeIn_.3s_ease]">
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        onPlay={() => { if ('mediaSession' in navigator) navigator.mediaSession.playbackState = 'playing'; }}
        onPause={() => { if ('mediaSession' in navigator) navigator.mediaSession.playbackState = 'paused'; }}
        onError={() => { toast?.('Failed to play preview'); setPlayingId(null); }}
        className="hidden"
      />

      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-[16px] bg-gradient-to-br from-[#c084fc] to-[#a855f7] flex items-center justify-center text-white text-xl"><i className="fa-solid fa-music" /></div>
        <div>
          <div className="font-[Sora] text-xl font-extrabold">Music</div>
          <div className="text-sm text-[var(--text3)]">Khmer &amp; English music</div>
        </div>
      </div>

      <div className="flex gap-1 mb-4 bg-[var(--bg2)] border border-[var(--border)] rounded-full p-1">
        {['khmer', 'english'].map((t) => (
          <button
            key={t}
            onClick={() => { setTab(t); setSearch(''); }}
            className={`flex-1 py-1.5 text-sm font-semibold rounded-full transition-all cursor-pointer border-none ${
              tab === t ? 'bg-[var(--accent)] text-white shadow-sm' : 'text-[var(--text3)] hover:text-[var(--text)] bg-transparent'
            }`}
          >
            {t === 'khmer' ? '🇰🇭 Khmer' : '🌍 English'}
          </button>
        ))}
      </div>

      <div className="relative mb-4">
        <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[var(--text3)]" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={`Search ${tab === 'khmer' ? 'Khmer' : 'English'} music...`}
          className="w-full bg-[var(--bg2)] border border-[var(--border)] rounded-full pl-9 pr-3 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)]"
        />
      </div>

      {loading ? (
        <div className="space-y-2">
          {[1,2,3,4,5].map((i) => (
            <div key={i} className="flex items-center gap-3.5 bg-[var(--card)] border border-[var(--border)] rounded-[14px] p-3.5 animate-pulse">
              <div className="w-10 h-10 rounded-[12px] bg-[var(--bg3)] flex-shrink-0" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3 w-3/4 bg-[var(--bg3)] rounded" />
                <div className="h-2.5 w-1/2 bg-[var(--bg3)] rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-[var(--text3)]">
          <div className="text-4xl mb-3"><i className="fa-solid fa-music" /></div>
          <div className="font-semibold text-[var(--text2)]">No tracks found</div>
          <div className="text-sm mt-1">Try a different search</div>
        </div>
      ) : (
        <>
          <div className="space-y-2">
            {paged.map((t) => (
              <div
                key={t.id}
                onClick={() => playTrack(t)}
                className={`flex items-center gap-3.5 bg-[var(--card)] border border-[var(--border)] rounded-[14px] p-3 cursor-pointer transition-all duration-200 hover:bg-[var(--card2)] hover:-translate-y-[1px] group ${
                  playingId === t.id ? 'ring-2 ring-[var(--accent)] bg-[var(--card2)]' : ''
                }`}
              >
                <div className="w-11 h-11 rounded-[12px] overflow-hidden flex-shrink-0 bg-[var(--bg3)]">
                  {t.album?.cover || t.image ? (
                    <img src={t.album?.cover || t.image} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-lg" style={{ background: '#c084fc22', color: '#c084fc' }}>
                      <i className="fa-solid fa-music" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold truncate">{t.title}</div>
                  <div className="text-xs text-[var(--text3)] truncate">{t.artist?.name || t.artist || 'Unknown Artist'}</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-xs text-[var(--text3)] group-hover:text-[var(--accent)] transition-colors">
                    {t.duration ? timeFormat(t.duration) : ''}
                  </div>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                    playingId === t.id
                      ? 'bg-[var(--accent)] text-white'
                      : 'bg-[var(--bg3)] text-[var(--text2)] group-hover:bg-[var(--accent)] group-hover:text-white'
                  }`}>
                    <i className={`fa-solid ${playingId === t.id ? (audioRef.current?.paused ? 'fa-play' : 'fa-pause') : 'fa-play'} text-xs`} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-[var(--border)]">
              <div className="text-xs text-[var(--text3)]">{startItem}&ndash;{endItem} of {filtered.length}</div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-xs border-none cursor-pointer disabled:opacity-30 disabled:cursor-default bg-[var(--bg2)] text-[var(--text2)] hover:bg-[var(--accent)] hover:text-white transition-all"
                >
                  <i className="fa-solid fa-chevron-left" />
                </button>
                {(() => {
                  const pages = [];
                  const start = Math.max(1, page - 2);
                  const end = Math.min(totalPages, page + 2);
                  if (start > 1) {
                    pages.push(
                      <button key={1} onClick={() => setPage(1)} className="w-8 h-8 rounded-lg flex items-center justify-center text-xs border-none cursor-pointer bg-[var(--bg2)] text-[var(--text2)] hover:bg-[var(--accent)] hover:text-white transition-all">1</button>
                    );
                    if (start > 2) pages.push(<span key="dots1" className="px-1 text-xs text-[var(--text3)]">&hellip;</span>);
                  }
                  for (let i = start; i <= end; i++) {
                    pages.push(
                      <button
                        key={i}
                        onClick={() => setPage(i)}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs border-none cursor-pointer transition-all ${
                          i === page
                            ? 'bg-[var(--accent)] text-white shadow-sm'
                            : 'bg-[var(--bg2)] text-[var(--text2)] hover:bg-[var(--accent)] hover:text-white'
                        }`}
                      >
                        {i}
                      </button>
                    );
                  }
                  if (end < totalPages) {
                    if (end < totalPages - 1) pages.push(<span key="dots2" className="px-1 text-xs text-[var(--text3)]">&hellip;</span>);
                    pages.push(
                      <button key={totalPages} onClick={() => setPage(totalPages)} className="w-8 h-8 rounded-lg flex items-center justify-center text-xs border-none cursor-pointer bg-[var(--bg2)] text-[var(--text2)] hover:bg-[var(--accent)] hover:text-white transition-all">{totalPages}</button>
                    );
                  }
                  return pages;
                })()}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-xs border-none cursor-pointer disabled:opacity-30 disabled:cursor-default bg-[var(--bg2)] text-[var(--text2)] hover:bg-[var(--accent)] hover:text-white transition-all"
                >
                  <i className="fa-solid fa-chevron-right" />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {currentTrack && (
        <div className="mt-4 bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius)] p-4 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-[12px] overflow-hidden flex-shrink-0 bg-[var(--bg3)]">
              {currentTrack.album?.cover ? (
                <img src={currentTrack.album.cover} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[var(--accent)]"><i className="fa-solid fa-music" /></div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold truncate">{currentTrack.title}</div>
              <div className="text-xs text-[var(--text3)]">{currentTrack.artist?.name || currentTrack.artist || 'Unknown'}</div>
            </div>
            <button
              onClick={() => playTrack(currentTrack)}
              className="w-10 h-10 rounded-full bg-[var(--accent)] text-white flex items-center justify-center hover:bg-[var(--accent2)] transition-all border-none cursor-pointer"
            >
              <i className={`fa-solid ${audioRef.current?.paused ? 'fa-play' : 'fa-pause'}`} />
            </button>
          </div>
          <div
            ref={progressRef}
            onClick={handleProgressClick}
            className="h-2 bg-[var(--bg3)] rounded-full overflow-hidden cursor-pointer mb-2"
          >
            <div className="h-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent2)] rounded-full transition-all duration-200" style={{ width: `${progress}%` }} />
          </div>
          <div className="flex items-center justify-between text-xs text-[var(--text3)]">
            <span>{currentTrack.duration ? timeFormat((progress / 100) * currentTrack.duration) : '0:00'}</span>
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-volume-low" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={changeVolume}
                className="w-16 sm:w-20 accent-[var(--accent)] cursor-pointer"
              />
            </div>
            <span>{currentTrack.duration ? timeFormat(currentTrack.duration) : ''}</span>
          </div>
        </div>
      )}
    </div>
  );
}

