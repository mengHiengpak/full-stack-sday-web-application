 'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const featureItems = [
  { icon: 'fa-store', label: 'Marketplace', route: '/marketplace', color: '#34d399' },
  { icon: 'fa-users-line', label: 'Groups', route: '/groups', color: '#60a5fa' },
  { icon: 'fa-calendar-days', label: 'Events', route: '/events', color: '#a78bfa' },
  { icon: 'fa-bookmark', label: 'Saved', route: '/saved', color: '#f472b6' },
  { icon: 'fa-video', label: 'Reels', route: '/reels', color: '#fb923c' },
  { icon: 'fa-fire-flame-curved', label: 'Trending', route: '/trending', color: '#f59e0b' },
  { icon: 'fa-music', label: 'Music', route: '/music', color: '#c084fc' },
  { icon: 'fa-gamepad', label: 'Gaming', route: '/gaming', color: '#4ade80' },
  { icon: 'fa-newspaper', label: 'News', route: '/news', color: '#94a3b8' },
  { icon: 'fa-photo-film', label: 'Memories', route: '/memories', color: '#fbbf24' },
  { icon: 'fa-gift', label: 'Birthdays', route: '/birthdays', color: '#f87171' },
  { icon: 'fa-handshake-angle', label: 'Fundraisers', route: '/fundraisers', color: '#2dd4bf' },
];

export default function BottomNav({ onOpenChat, toast, onViewChange }) {
  const router = useRouter();
  const [active, setActive] = useState('Home');
  const [showFeatures, setShowFeatures] = useState(false);
  const items = [
    { icon: 'fa-house', label: 'Home', view: 'feed' },
    { icon: 'fa-compass', label: 'Explore', view: 'explore' },
    { icon: 'fa-satellite-dish', label: 'Live', view: 'live', live: true },
    { icon: 'fa-circle-plus', label: 'Upload' },
    { icon: 'fa-message', label: 'Chat' },
  ];

  return (
    <>
      <div className="hidden max-[780px]:flex fixed bottom-0 left-0 right-0 z-[100] bg-[var(--bg2)] border-t border-[var(--border)] py-1 pb-2 justify-around shadow-sm">
        {items.map((item, i) => (
          <div
            key={i}
            onClick={() => {
              setActive(item.label);
              if (item.label === 'Upload') { router.push('/upload'); return; }
              if (item.label === 'Chat') { router.push('/chat'); return; }
              if (item.view) onViewChange?.(item.view);
            }}
            className={`flex flex-col items-center gap-0.5 px-2 sm:px-3 py-1 cursor-pointer text-[10px] ${active === item.label ? 'text-[var(--accent)]' : 'text-[var(--text3)]'}`}
          >
            <i className={`fa-solid ${item.icon} text-lg`} style={item.live ? { color: '#ef4444' } : {}} />
            {item.label}
          </div>
        ))}
        <div
          onClick={() => setShowFeatures(true)}
          className="flex flex-col items-center gap-0.5 px-2 sm:px-3 py-1 cursor-pointer text-[10px] text-[var(--text3)]"
        >
          <i className="fa-solid fa-grid-2 text-lg" />
          More
        </div>
      </div>

      {showFeatures && (
        <div className="fixed inset-0 z-[200] bg-black/50 flex items-end sm:items-center justify-center">
          <div className="bg-[var(--bg2)] rounded-t-2xl sm:rounded-2xl w-full sm:max-w-sm max-h-[75vh] overflow-y-auto shadow-2xl animate-[fadeIn_.2s_ease]">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)] sticky top-0 bg-[var(--bg2)]">
              <div className="font-[Sora] font-bold text-lg">All Features</div>
              <button onClick={() => setShowFeatures(false)} className="w-8 h-8 rounded-full bg-[var(--bg3)] flex items-center justify-center text-[var(--text2)] hover:bg-[var(--border)]">
                <i className="fa-solid fa-xmark" />
              </button>
            </div>
            <div className="p-4 grid grid-cols-3 gap-3">
              {featureItems.map((f, i) => (
                <div
                  key={i}
                  onClick={() => { setShowFeatures(false); router.push(f.route); }}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl bg-[var(--bg)] hover:bg-[var(--bg3)] cursor-pointer active:scale-95 transition-all"
                >
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl" style={{ background: f.color + '20', color: f.color }}>
                    <i className={`fa-solid ${f.icon}`} />
                  </div>
                  <span className="text-[11px] font-semibold text-[var(--text2)] text-center leading-tight">{f.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
